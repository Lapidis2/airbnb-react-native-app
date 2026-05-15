import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useWishlist } from "@/context/wishlist";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import { useQueries } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_URL = "https://airbnb-api-c4yx.onrender.com/api/v1";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";

const LOCATION_COORDS: Record<string, { latitude: number; longitude: number }> = {
  kigali:     { latitude: -1.9441, longitude: 30.0619 },
  kibagabaga: { latitude: -1.9200, longitude: 30.1100 },
  rubavu:     { latitude: -1.6800, longitude: 29.2500 },
  biryogo:    { latitude: -1.9600, longitude: 30.0500 },
  manhattan:  { latitude: 40.7831, longitude: -73.9712 },
  yonkers:    { latitude: 40.9312, longitude: -73.8988 },
  default:    { latitude: -1.9441, longitude: 30.0619 },
};

function getCoords(location: string) {
  const key = location.toLowerCase().split(",")[0].trim();
  for (const [k, v] of Object.entries(LOCATION_COORDS)) {
    if (key.includes(k)) return v;
  }
  return LOCATION_COORDS.default;
}

function getPrimaryPhoto(listing: ApiListing): string {
  const primary = listing.photos.find((p) => p.isPrimary);
  return primary?.url ?? listing.photos[0]?.url ?? FALLBACK_IMAGE;
}

function isSuperhost(listing: ApiListing) {
  return listing.rating !== null && listing.rating >= 4.8;
}

function PricePin({ price, selected }: { price: number; selected: boolean }) {
  return (
    <View style={[styles.pin, selected && styles.pinSelected]}>
      <Text style={[styles.pinText, selected && styles.pinTextSelected]}>
        ♥ ${price}
      </Text>
    </View>
  );
}

function PreviewCard({
  listing, onPress, onClose, colors,
}: {
  listing: ApiListing; onPress: () => void; onClose: () => void; colors: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.previewCard, { backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <Image source={{ uri: getPrimaryPhoto(listing) }} style={styles.previewImage} />
      <View style={styles.previewContent}>
        <View style={styles.previewRow}>
          <Text style={[styles.previewLocation, { color: colors.text }]} numberOfLines={1}>
            {listing.location}
          </Text>
          {isSuperhost(listing) && (
            <View style={styles.superhostBadge}>
              <Text style={styles.superhostText}>⭐ Superhost</Text>
            </View>
          )}
        </View>
        <Text style={[styles.previewHost, { color: colors.textSecondary }]} numberOfLines={1}>
          Hosted by {listing.host.name}
        </Text>
        <View style={styles.previewBottom}>
          <Text style={[styles.previewPrice, { color: colors.text }]}>
            <Text style={styles.previewPriceBold}>${listing.pricePerNight}</Text>
            <Text style={[styles.previewPriceUnit, { color: colors.textSecondary }]}> /night</Text>
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
      </View>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function WishlistMapScreen() {
  const router = useRouter();
  const { date, guests } = useLocalSearchParams<{ date: string; guests: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { savedIds } = useWishlist();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const listings = results.filter((r) => r.data != null).map((r) => r.data as ApiListing);
  const selectedListing = listings.find((l) => l.id === selectedId) ?? null;

  const firstCoords =
    listings.length > 0 ? getCoords(listings[0].location) : LOCATION_COORDS.default;
  const initialRegion: Region = {
    ...firstCoords,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  // Bottom pill height — same as tab bar height
  const PILL_HEIGHT = 60;

  return (
    <View style={styles.container}>
      {/* Full screen map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={() => setSelectedId(null)}
        showsUserLocation
        showsCompass={false}
      >
        {listings.map((listing) => {
          const coords = getCoords(listing.location);
          return (
            <Marker
              key={listing.id}
              coordinate={coords}
              onPress={() => setSelectedId(listing.id)}
              pinColor="#FF385C"
              title={listing.location}
              description={`\u2665 $${listing.pricePerNight}/night`}
            />
          );
        })}
      </MapView>

      {/* Floating back button — top left */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.background }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Preview card when pin tapped */}
      {selectedListing && (
        <View style={[styles.previewWrap, { bottom: PILL_HEIGHT + insets.bottom + 12 }]}>
          <PreviewCard
            listing={selectedListing}
            colors={colors}
            onPress={() =>
              router.push({ pathname: "/listing-detail", params: { id: selectedListing.id } })
            }
            onClose={() => setSelectedId(null)}
          />
        </View>
      )}

      {/* Bottom pill — replaces tab bar, full width, rounded top corners, "Nice" centered */}
      <View
        style={[
          styles.bottomPill,
          {
            height: PILL_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.bottomPillText, { color: colors.text }]}>Nice</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Floating top bar
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  pin: {
    width: 110,
    height: 36,
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pinSelected: {
    backgroundColor: "#FF385C",
    borderColor: "#FF385C",
  },
  pinLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#222",
  },
  pinLabelSelected: { color: "white" },

  // Preview card
  previewWrap: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  previewCard: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  previewImage: { width: 90, height: 90 },
  previewContent: { flex: 1, padding: 12 },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
  previewLocation: { fontSize: 14, fontWeight: "700", flex: 1 },
  superhostBadge: {
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  superhostText: { fontSize: 10, fontWeight: "700", color: "#FF385C" },
  previewHost: { fontSize: 12, marginBottom: 6 },
  previewBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  previewPrice: { fontSize: 13 },
  previewPriceBold: { fontWeight: "700" },
  previewPriceUnit: { fontSize: 12 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  star: { color: "#FFB800", fontSize: 12 },
  ratingText: { fontSize: 12, fontWeight: "600" },
  closeBtn: { padding: 12, justifyContent: "center" },

  // Bottom pill — replaces tab bar
  bottomPill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPillText: { fontSize: 16, fontWeight: "700" },
});
