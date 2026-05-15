import { HelloWave } from "@/components/hello-wave";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useWishlist } from "@/context/wishlist";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
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

export default function WishlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { savedIds } = useWishlist();

  const now = new Date();
  const defaultDate = `${MONTHS[now.getMonth()]} ${now.getDate()} - ${now.getDate() + 5}`;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={savedIds.length === 0 ? [] : listings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]}>Wishlist</Text>
              <HelloWave />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
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
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.collectionCard, { borderBottomColor: colors.border }]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/wishlist-listings",
                params: { date: defaultDate, guests: "Guests" },
              })
            }
          >
            {/* Image with type badge */}
            <View style={styles.imageWrap}>
              <Image source={{ uri: getPrimaryPhoto(item) }} style={styles.image} />
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.type}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text style={[styles.infoName, { color: colors.text }]} numberOfLines={1}>
                {item.location}
              </Text>
              <Text style={[styles.infoDate, { color: colors.textSecondary }]}>
                {defaultDate}
              </Text>
            </View>

            <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 32, fontWeight: "800" },
  collectionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  imageWrap: { position: "relative" },
  image: { width: 80, height: 80, borderRadius: 10 },
  typeBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeBadgeText: { color: "white", fontSize: 9, fontWeight: "700" },
  info: { flex: 1 },
  infoName: { fontSize: 15, fontWeight: "700", marginBottom: 3 },
  infoDate: { fontSize: 13, marginBottom: 2 },
  infoCount: { fontSize: 12 },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
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
});
