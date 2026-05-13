import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Listing } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface ListingCardProps {
  listing: Listing;
  onPress: (listing: Listing) => void;
  onSavePress: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onPress,
  onSavePress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={() => onPress(listing)}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.image }} style={styles.image} />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSavePress(listing)}
        >
          <IconSymbol
            name={listing.isSaved ? "heart.fill" : "heart"}
            size={24}
            color={listing.isSaved ? "#E31C23" : "white"}
          />
        </TouchableOpacity>

        {/* Image Dots */}
        <View style={styles.imageDots}>
          {Array.from({ length: listing.images.length }).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    idx === 0 ? "white" : "rgba(255, 255, 255, 0.5)",
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Location */}
        <Text
          style={[styles.location, { color: colors.text }]}
          numberOfLines={1}
        >
          {listing.location}
        </Text>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {listing.title}
        </Text>

        {/* Bottom Info Row */}
        <View style={styles.bottomRow}>
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color="#FFB800" />
            <Text style={[styles.rating, { color: colors.text }]}>
              {listing.rating}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              ({listing.reviewCount})
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${listing.price}
            </Text>
            <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>
              /night
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDots: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    padding: 12,
  },
  location: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
  },
  priceUnit: {
    fontSize: 12,
  },
});
