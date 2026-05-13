import { HelloWave } from "@/components/hello-wave";
import { ListingCard } from "@/components/listing-card";
import { mockListings } from "@/constants/mockData";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Listing } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WishlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<Listing[]>(
    mockListings.map((l) => ({ ...l, isSaved: true })),
  );

  const handleListing = (listing: Listing) => {
    router.push({ pathname: "/listing-detail", params: { id: listing.id } });
  };

  const handleRemove = (listing: Listing) => {
    setListings(listings.filter((l) => l.id !== listing.id));
  };

  if (listings.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: insets.top + 8 },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Saved Listings
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Save listings to your favorites while exploring
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF385C" }]}
          onPress={() => router.push("/(tabs)/explore")}
        >
          <Text style={styles.buttonText}>Explore Listings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={listings}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={handleListing}
            onSavePress={handleRemove}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
            <View style={styles.titleRow}>
              <Text style={[styles.header, { color: colors.text }]}>Nice</Text>
              <HelloWave />
            </View>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterButton, { borderColor: colors.border }]}
              >
                <Text style={[styles.filterText, { color: colors.text }]}>
                  May 14 - 19
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, { borderColor: colors.border }]}
              >
                <Text style={[styles.filterText, { color: colors.text }]}>
                  Guests
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "#F7F7F7",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
