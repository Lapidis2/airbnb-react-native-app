import { IconSymbol } from "@/components/ui/icon-symbol";
import { mockListings } from "@/constants/mockData";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const listing = mockListings.find((l) => l.id === id);
  const [isSaved, setIsSaved] = useState(listing?.isSaved || false);
  const insets = useSafeAreaInsets();

  if (!listing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Listing not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Image Gallery with overlaid header */}
      <View style={styles.imageGallery}>
        <Image source={{ uri: listing.image }} style={styles.mainImage} />
        <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsSaved(!isSaved)}>
            <IconSymbol
              name={isSaved ? "heart.fill" : "heart"}
              size={22}
              color={isSaved ? "#FF385C" : "#222"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title and Location */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {listing.title}
        </Text>
        <View style={styles.ratingRow}>
          <IconSymbol name="star.fill" size={16} color="#FFB800" />
          <Text style={[styles.rating, { color: colors.text }]}>
            {listing.rating}
          </Text>
          <Text style={[styles.reviews, { color: colors.textSecondary }]}>
            ({listing.reviewCount} reviews)
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Host Info */}
        <View style={styles.hostSection}>
          <Image
            source={{ uri: listing.host.avatar }}
            style={styles.hostAvatar}
          />
          <View style={styles.hostInfo}>
            <Text style={[styles.hostName, { color: colors.text }]}>
              Hosted by {listing.host.name}
            </Text>
            <Text
              style={[styles.hostResponse, { color: colors.textSecondary }]}
            >
              Response time: {listing.host.responseTime}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Property Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <IconSymbol name="door.left.hand.closed" size={20} color="#FF385C" />
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              {listing.bedrooms} Bed{listing.bedrooms > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="bed.double" size={20} color="#FF385C" />
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              {listing.beds} Bed{listing.beds > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="sink" size={20} color="#FF385C" />
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              {listing.bathrooms} Bath{listing.bathrooms > 1 ? "s" : ""}
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Amenities
        </Text>
        <View style={styles.amenitiesGrid}>
          {listing.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={[styles.amenityText, { color: colors.text }]}>
                {amenity}
              </Text>
            </View>
          ))}
        </View>

        {/* Price and Booking */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.priceSection}>
          <View>
            <Text style={[styles.pricePerNight, { color: colors.text }]}>
              ${listing.price} <Text style={styles.perNight}>/night</Text>
            </Text>
          </View>
        </View>

        {/* Reserve Button */}
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => alert('Reserve feature coming soon!')}
        >
          <Text style={styles.reserveButtonText}>Reserve</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageGallery: {
    width: "100%",
    height: 340,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviews: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  hostSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  hostResponse: {
    fontSize: 12,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  detailItem: {
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  amenityTag: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  priceSection: {
    paddingVertical: 16,
  },
  pricePerNight: {
    fontSize: 22,
    fontWeight: "bold",
  },
  perNight: {
    fontSize: 16,
    fontWeight: "400",
  },
  reserveButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  reserveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
