import { ReservationModals } from "@/components/reservation-modals";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_URL = "https://airbnb-api-c4yx.onrender.com/api/v1";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";
const FALLBACK_AVATAR = "https://i.pravatar.cc/150?img=1";

function getPrimaryPhoto(listing: ApiListing): string {
  const primary = listing.photos.find((p) => p.isPrimary);
  return primary?.url ?? listing.photos[0]?.url ?? FALLBACK_IMAGE;
}

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [isSaved, setIsSaved] = useState(false);
  const [reservationModalVisible, setReservationModalVisible] = useState(false);

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery<ApiListing>({
    queryKey: ["listing", id],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/listings/${id}`);
      if (!res.ok) throw new Error("Listing not found");
      const json = await res.json();
      return json.data ?? json;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  if (isError || !listing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Listing not found
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const photoUrl = getPrimaryPhoto(listing);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero image with overlaid back + heart */}
      <View style={[styles.imageGallery, { height: 340 + insets.top }]}>
        <Image source={{ uri: photoUrl }} style={styles.mainImage} />
        <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsSaved(!isSaved)}
          >
            <IconSymbol
              name={isSaved ? "heart.fill" : "heart"}
              size={22}
              color={isSaved ? "#FF385C" : "#222"}
            />
          </TouchableOpacity>
        </View>

        {/* Photo count badge */}
        {listing.photos.length > 1 && (
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>
              1 / {listing.photos.length}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Title + type */}
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {listing.title}
          </Text>
          <View style={[styles.typePill, { borderColor: colors.border }]}>
            <Text
              style={[styles.typePillText, { color: colors.textSecondary }]}
            >
              {listing.type}
            </Text>
          </View>
        </View>

        {/* Location + rating */}
        <View style={styles.metaRow}>
          <Text style={[styles.location, { color: colors.textSecondary }]}>
            📍 {listing.location}
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

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Host */}
        <View style={styles.hostSection}>
          <Image
            source={{ uri: listing.host.avatar ?? FALLBACK_AVATAR }}
            style={styles.hostAvatar}
          />
          <View style={styles.hostInfo}>
            <Text style={[styles.hostName, { color: colors.text }]}>
              Hosted by {listing.host.name}
            </Text>
            <Text style={[styles.hostSub, { color: colors.textSecondary }]}>
              @{listing.host.username}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <IconSymbol name="person" size={20} color="#FF385C" />
            <Text style={[styles.statLabel, { color: colors.text }]}>
              {listing.guests} guests
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <IconSymbol name="house.fill" size={20} color="#FF385C" />
            <Text style={[styles.statLabel, { color: colors.text }]}>
              {listing.type}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Description */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About this place
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {listing.description}
        </Text>

        {/* Amenities */}
        {listing.amenities.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Amenities
            </Text>
            <View style={styles.amenitiesGrid}>
              {listing.amenities.map((amenity, index) => (
                <View
                  key={index}
                  style={[styles.amenityTag, { borderColor: colors.border }]}
                >
                  <Text style={[styles.amenityText, { color: colors.text }]}>
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Price + Reserve */}
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.pricePerNight, { color: colors.text }]}>
              ${listing.pricePerNight}
              <Text style={[styles.perNight, { color: colors.textSecondary }]}>
                {" "}
                /night
              </Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => setReservationModalVisible(true)}
        >
          <Text style={styles.reserveButtonText}>Reserve</Text>
        </TouchableOpacity>
      </View>

      <ReservationModals
        visible={reservationModalVisible}
        listing={listing}
        onClose={() => setReservationModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorIcon: { fontSize: 48 },
  errorTitle: { fontSize: 18, fontWeight: "600" },
  backBtn: {
    backgroundColor: "#FF385C",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: { color: "white", fontWeight: "600" },
  imageGallery: { width: "100%", position: "relative" },
  mainImage: { width: "100%", height: "100%" },
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  photoBadgeText: { color: "white", fontSize: 12, fontWeight: "600" },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "bold", flex: 1 },
  typePill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  typePillText: { fontSize: 12, fontWeight: "500" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  location: { fontSize: 14 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  star: { color: "#FFB800", fontSize: 14 },
  ratingText: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginVertical: 16 },
  hostSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  hostAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  hostInfo: { flex: 1 },
  hostName: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  hostSub: { fontSize: 13 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  statItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  statDivider: { width: 1, height: 32, marginHorizontal: 16 },
  statLabel: { fontSize: 14, fontWeight: "500" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 4,
  },
  description: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  amenityTag: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amenityText: { fontSize: 12, fontWeight: "500" },
  priceRow: { paddingVertical: 8, marginBottom: 8 },
  pricePerNight: { fontSize: 22, fontWeight: "bold" },
  perNight: { fontSize: 16, fontWeight: "400" },
  reserveButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  reserveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
