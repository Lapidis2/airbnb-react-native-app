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

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [listings, setListings] = useState<Listing[]>(
    mockListings.map((l) => ({ ...l, isSaved: true })),
  );

  const handleListing = (listing: Listing) => {
    router.push({
      pathname: "/listing-detail",
      params: { id: listing.id },
    });
  };

  const handleRemove = (listing: Listing) => {
    setListings(listings.filter((l) => l.id !== listing.id));
  };

  if (listings.length === 0) {
    return (
      <View
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
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
          <Text style={[styles.header, { color: colors.text }]}>
            Saved Listings
          </Text>
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
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
