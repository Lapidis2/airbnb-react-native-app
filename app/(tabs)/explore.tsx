import { CategoryFilter } from "@/components/category-filter";
import { ListingCard } from "@/components/listing-card";
import { SearchBar } from "@/components/search-bar";
import { mockListings } from "@/constants/mockData";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Listing } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View } from "react-native";

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [savedListings, setSavedListings] = useState<string[]>(
    mockListings.filter((l) => l.isSaved).map((l) => l.id),
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("Chefs");

  const handleListing = (listing: Listing) => {
    router.push({
      pathname: "/listing-detail",
      params: { id: listing.id },
    });
  };

  const handleSave = (listing: Listing) => {
    if (savedListings.includes(listing.id)) {
      setSavedListings(savedListings.filter((id) => id !== listing.id));
    } else {
      setSavedListings([...savedListings, listing.id]);
    }
    // Update listing
    setListings(
      listings.map((l) =>
        l.id === listing.id ? { ...l, isSaved: !l.isSaved } : l,
      ),
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={listings}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={handleListing}
            onSavePress={handleSave}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ backgroundColor: colors.background, paddingTop: insets.top }}>
            <SearchBar placeholder="Where to?" showDetails={true} />
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
        }
        stickyHeaderIndices={[0]}
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
});
