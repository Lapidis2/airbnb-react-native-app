import { HelloWave } from "@/components/hello-wave";
import { ListingSkeletonList } from "@/components/listing-skeleton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useWishlist } from "@/context/wishlist";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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

// Superhost is simulated — listings with rating >= 4.8 are shown as superhost
function isSuperhost(listing: ApiListing) {
  return listing.rating !== null && listing.rating >= 4.8;
}

function WishlistCard({
  listing,
  onPress,
  onRemove,
  colors,
}: {
  listing: ApiListing;
  onPress: () => void;
  onRemove: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: getPrimaryPhoto(listing) }} style={styles.image} />

        {/* Superhost badge — top left */}
        {isSuperhost(listing) && (
          <View style={styles.superhostBadge}>
            <Text style={styles.superhostText}>⭐ Superhost</Text>
          </View>
        )}

        {/* Heart remove button — top right */}
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

// Simple date picker modal
function DatePickerModal({
  visible,
  onClose,
  onSelect,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
  colors: any;
}) {
  const now = new Date();
  const options = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i * 7);
    const end = new Date(d);
    end.setDate(end.getDate() + 5);
    return `${MONTHS[d.getMonth()]} ${d.getDate()} - ${end.getDate()}`;
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select dates</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => { onSelect(opt); onClose(); }}
            >
              <Text style={[styles.modalOptionText, { color: colors.text }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Simple guests picker modal
function GuestsModal({
  visible,
  onClose,
  onSelect,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
  colors: any;
}) {
  const options = ["1 guest", "2 guests", "3 guests", "4 guests", "5+ guests"];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.text }]}>Number of guests</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => { onSelect(opt); onClose(); }}
            >
              <Text style={[styles.modalOptionText, { color: colors.text }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Mock Collections Data
const MOCK_COLLECTIONS = [
  { id: "col1", name: "Nice", date: "May 14 - 19, 2023", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" },
  { id: "col2", name: "Chill", date: null, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop" },
];

// Collections Tab Component
function CollectionsTab({ colors, onSelectCollection }: { colors: any; onSelectCollection: (id: string) => void }) {
  return (
    <FlatList
      data={MOCK_COLLECTIONS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.collectionCard, { borderBottomColor: colors.border }]}
          onPress={() => onSelectCollection(item.id)}
        >
          <Image source={{ uri: item.image }} style={styles.collectionImage} />
          <View style={styles.collectionInfo}>
            <Text style={[styles.collectionName, { color: colors.text }]}>{item.name}</Text>
            {item.date && <Text style={[styles.collectionDate, { color: colors.textSecondary }]}>{item.date}</Text>}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

// Map Tab Component
function MapTab({ colors }: { colors: any }) {
  return (
    <View style={[styles.mapContainer, { backgroundColor: colors.background }]}>
      <View style={styles.mapPlaceholder}>
        <Text style={[styles.mapPlaceholderText, { color: colors.textSecondary }]}>🗺️ Interactive Map</Text>
        <Text style={[styles.mapPlaceholderSubtext, { color: colors.textSecondary }]}>Map view with saved listings</Text>
      </View>
    </View>
  );
}

export default function WishlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { savedIds, toggle } = useWishlist();

  const now = new Date();
  const defaultDate = `${MONTHS[now.getMonth()]} ${now.getDate()} - ${now.getDate() + 5}`;
  const [dateLabel, setDateLabel] = useState(defaultDate);
  const [guestsLabel, setGuestsLabel] = useState("Guests");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"collections" | "map" | "listings">("listings");

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

  const Header = (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
      {/* Top label */}
      <View style={styles.topRow}>
        <Text style={[styles.wishlistLabel, { color: colors.textSecondary }]}>Wishlist</Text>
        <HelloWave />
      </View>

      {/* Large "Nice" title */}
      <Text style={[styles.niceTitle, { color: colors.text }]}>Nice</Text>

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, { borderColor: colors.border }]}
          onPress={() => setShowDatePicker(true)}
        >
          <IconSymbol name="map" size={14} color={colors.text} />
          <Text style={[styles.filterBtnText, { color: colors.text }]}>{dateLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, { borderColor: colors.border }]}
          onPress={() => setShowGuestsPicker(true)}
        >
          <IconSymbol name="person" size={14} color={colors.text} />
          <Text style={[styles.filterBtnText, { color: colors.text }]}>{guestsLabel}</Text>
        </TouchableOpacity>
      </View>

      {savedIds.length > 0 && (
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {savedIds.length} saved {savedIds.length === 1 ? "place" : "places"}
        </Text>
      )}
    </View>
  );

  if (!isLoading && savedIds.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        {Header}
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No saved listings yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Tap the heart on any listing while exploring to save it here
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push("/(tabs)/explore")}
          >
            <Text style={styles.exploreBtnText}>Start exploring</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Tab Switcher UI
  const TabSwitcher = (
    <View style={[styles.tabSwitcher, { borderBottomColor: colors.border }]}>
      {["collections", "map", "listings"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabButton}
          onPress={() => setActiveTab(tab as any)}
        >
          <Text style={[styles.tabText, activeTab === tab ? styles.tabTextActive : { color: colors.textSecondary }]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
          {activeTab === tab && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={setDateLabel}
        colors={colors}
      />
      <GuestsModal
        visible={showGuestsPicker}
        onClose={() => setShowGuestsPicker(false)}
        onSelect={setGuestsLabel}
        colors={colors}
      />

      {/* Collections Tab */}
      {activeTab === "collections" && (
        <>
          {TabSwitcher}
          <CollectionsTab colors={colors} onSelectCollection={() => setActiveTab("listings")} />
        </>
      )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <>
          {TabSwitcher}
          <MapTab colors={colors} />
        </>
      )}

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <>
          {TabSwitcher}
          {isLoading ? (
            <FlatList
              data={[]}
              renderItem={null}
              keyExtractor={(_, i) => String(i)}
              ListHeaderComponent={Header}
              ListFooterComponent={<ListingSkeletonList count={savedIds.length || 3} />}
            />
          ) : (
            <FlatList
              data={listings}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={Header}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1 },
  headerContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  wishlistLabel: { fontSize: 14, fontWeight: "500" },
  niceTitle: { fontSize: 36, fontWeight: "800", marginBottom: 16 },
  filterRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterBtnText: { fontSize: 13, fontWeight: "500" },
  count: { fontSize: 13 },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: -40,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 28 },
  exploreBtn: {
    backgroundColor: "#FF385C",
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  exploreBtnText: { color: "white", fontSize: 15, fontWeight: "600" },
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
  // Tab Switcher Styles
  tabSwitcher: { flexDirection: "row", borderBottomWidth: 1, paddingTop: 8 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: "center", position: "relative" },
  tabText: { fontSize: 13, fontWeight: "500" },
  tabTextActive: { color: "#000", fontWeight: "600" },
  tabUnderline: { position: "absolute", bottom: 0, width: "100%", height: 2, backgroundColor: "#FF385C" },
  // Collections Styles
  collectionCard: { flexDirection: "row", paddingVertical: 12, borderBottomWidth: 1, gap: 12, paddingHorizontal: 16 },
  collectionImage: { width: 80, height: 80, borderRadius: 8 },
  collectionInfo: { flex: 1, justifyContent: "center" },
  collectionName: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  collectionDate: { fontSize: 12 },
  // Map Styles
  mapContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  mapPlaceholder: { alignItems: "center" },
  mapPlaceholderText: { fontSize: 32, marginBottom: 8 },
  mapPlaceholderSubtext: { fontSize: 14 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalOptionText: { fontSize: 15 },
  modalCancel: { paddingVertical: 16, alignItems: "center" },
  modalCancelText: { fontSize: 15, fontWeight: "500" },
});
