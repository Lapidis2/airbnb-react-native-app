import { IconSymbol } from "@/components/ui/icon-symbol";
import { ListingSkeletonList } from "@/components/listing-skeleton";
import { Colors } from "@/constants/theme";
import { useWishlist } from "@/context/wishlist";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import { useQueries } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_URL = "https://airbnb-api-c4yx.onrender.com/api/v1";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getPrimaryPhoto(listing: ApiListing): string {
  const primary = listing.photos.find((p) => p.isPrimary);
  return primary?.url ?? listing.photos[0]?.url ?? FALLBACK_IMAGE;
}

function isSuperhost(listing: ApiListing) {
  return listing.rating !== null && listing.rating >= 4.8;
}

function PickerModal({
  visible, title, options, onClose, onSelect, colors,
}: {
  visible: boolean; title: string; options: string[];
  onClose: () => void; onSelect: (v: string) => void; colors: any;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.text }]}>{title}</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.sheetOption, { borderBottomColor: colors.border }]}
              onPress={() => { onSelect(opt); onClose(); }}
            >
              <Text style={[styles.sheetOptionText, { color: colors.text }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.sheetCancel} onPress={onClose}>
            <Text style={[styles.sheetCancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function WishlistCard({
  listing, onPress, onRemove, colors,
}: {
  listing: ApiListing; onPress: () => void; onRemove: () => void; colors: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: getPrimaryPhoto(listing) }} style={styles.image} />
        {isSuperhost(listing) && (
          <View style={styles.superhostBadge}>
            <Text style={styles.superhostText}>⭐ Superhost</Text>
          </View>
        )}
        {/* Red heart top-right */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconSymbol name="heart.fill" size={22} color="#FF385C" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={[styles.location, { color: colors.text }]} numberOfLines={1}>
            {listing.location}
          </Text>
          {listing.rating !== null && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {listing.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.host, { color: colors.textSecondary }]} numberOfLines={1}>
          Hosted by {listing.host.name}
        </Text>
        <Text style={[styles.price, { color: colors.text }]}>
          <Text style={styles.priceBold}>${listing.pricePerNight}</Text>
          <Text style={[styles.priceUnit, { color: colors.textSecondary }]}> /night</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function WishlistListingsScreen() {
  const router = useRouter();
  const { date: initDate, guests: initGuests } = useLocalSearchParams<{ date: string; guests: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { savedIds, toggle } = useWishlist();

  const now = new Date();
  const fallbackDate = `${MONTHS[now.getMonth()]} ${now.getDate()} - ${now.getDate() + 5}`;
  const [dateLabel, setDateLabel] = useState(initDate ?? fallbackDate);
  const [guestsLabel, setGuestsLabel] = useState(initGuests ?? "Guests");
  const [showDate, setShowDate] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i * 7);
    const end = new Date(d);
    end.setDate(end.getDate() + 5);
    return `${MONTHS[d.getMonth()]} ${d.getDate()} - ${end.getDate()}`;
  });
  const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests", "5+ guests"];

  const results = useQueries({
    queries: savedIds.map((id) => ({
      queryKey: ["listing", id],
      queryFn: async (): Promise<ApiListing> => {
        const res = await fetch(`${BASE_URL}/listings/${id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        return json.data ?? json;
      },
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const listings = results.filter((r) => r.data != null).map((r) => r.data as ApiListing);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PickerModal visible={showDate} title="Select dates" options={dateOptions}
        onClose={() => setShowDate(false)} onSelect={setDateLabel} colors={colors} />
      <PickerModal visible={showGuests} title="Number of guests" options={guestOptions}
        onClose={() => setShowGuests(false)} onSelect={setGuestsLabel} colors={colors} />

      {/* Header: back arrow */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ListingSkeletonList count={savedIds.length || 3} />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* Large Nice title */}
              <Text style={[styles.niceTitle, { color: colors.text }]}>Nice</Text>

              {/* Left-aligned filter pills with gap, not stretched */}
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterBtn, { borderColor: colors.border }]}
                  onPress={() => setShowDate(true)}
                >
                  <Text style={[styles.filterBtnText, { color: colors.text }]}>{dateLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterBtn, { borderColor: colors.border }]}
                  onPress={() => setShowGuests(true)}
                >
                  <Text style={[styles.filterBtnText, { color: colors.text }]}>{guestsLabel}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.count, { color: colors.textSecondary }]}>
                {listings.length} {listings.length === 1 ? "place" : "places"} saved
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <WishlistCard
              listing={item}
              colors={colors}
              onPress={() =>
                router.push({ pathname: "/listing-detail", params: { id: item.id } })
              }
              onRemove={() => toggle(item.id)}
            />
          )}
        />
      )}

      {/* Floating Map button — sits above the tab bar */}
      <View style={[styles.mapFloating, { bottom: insets.bottom + 60 }]}>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() =>
            router.push({ pathname: "/wishlist-map", params: { date: dateLabel, guests: guestsLabel } })
          }
        >
          <IconSymbol name="map" size={16} color="white" />
          <Text style={styles.mapBtnText}>Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  listHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  niceTitle: { fontSize: 32, fontWeight: "800", marginBottom: 14 },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterBtnText: { fontSize: 13, fontWeight: "500" },
  count: { fontSize: 13 },
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageWrap: { width: "100%", height: 220, position: "relative" },
  image: { width: "100%", height: "100%" },
  superhostBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  superhostText: { fontSize: 11, fontWeight: "700", color: "#222" },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { padding: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  location: { fontSize: 14, fontWeight: "700", flex: 1, marginRight: 8 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  star: { color: "#FFB800", fontSize: 13 },
  ratingText: { fontSize: 13, fontWeight: "600" },
  host: { fontSize: 13, marginBottom: 6 },
  price: { fontSize: 14 },
  priceBold: { fontWeight: "700", fontSize: 15 },
  priceUnit: { fontSize: 13 },
  // Map floating button
  mapFloating: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  mapBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  // Modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32, paddingTop: 12 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 17, fontWeight: "700", paddingHorizontal: 20, marginBottom: 8 },
  sheetOption: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  sheetOptionText: { fontSize: 15 },
  sheetCancel: { paddingVertical: 16, alignItems: "center" },
  sheetCancelText: { fontSize: 15, fontWeight: "500" },
});
