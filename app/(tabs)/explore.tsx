import { CategoryFilter } from "@/components/category-filter";
import { ListingSkeletonList } from "@/components/listing-skeleton";
import { SearchBar } from "@/components/search-bar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useWishlist } from "@/context/wishlist";
import { useInfiniteSearch, useListings } from "@/hooks/listings/use-listings";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";

const VALID_TYPES = ["APARTMENT", "HOUSE", "VILLA", "CABIN"];

function getPrimaryPhoto(listing: ApiListing): string {
  const primary = listing.photos.find((p) => p.isPrimary);
  return primary?.url ?? listing.photos[0]?.url ?? FALLBACK_IMAGE;
}

// ── Card receives only primitives + stable callbacks so React.memo works ──
const ListingCard = React.memo(
  function ListingCard({
    listing,
    saved,
    onPress,
    onToggleSave,
  }: {
    listing: ApiListing;
    saved: boolean;
    onPress: () => void;
    onToggleSave: () => void;
  }) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.background }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getPrimaryPhoto(listing) }}
            style={styles.image}
          />
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{listing.type}</Text>
          </View>
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={onToggleSave}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <IconSymbol
              name={saved ? "heart.fill" : "heart"}
              size={22}
              color={saved ? "#FF385C" : "white"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text
              style={[styles.location, { color: colors.text }]}
              numberOfLines={1}
            >
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
          <Text
            style={[styles.title, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            Hosted by {listing.host.name}
          </Text>
          <View style={styles.cardRow}>
            <Text style={[styles.price, { color: colors.text }]}>
              <Text style={styles.priceBold}>${listing.pricePerNight}</Text>
              <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>
                {" "}/night
              </Text>
            </Text>
            <Text style={[styles.guests, { color: colors.textSecondary }]}>
              Up to {listing.guests} guests
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  // Custom comparator — only re-render if saved state or listing id changes
  (prev, next) =>
    prev.saved === next.saved &&
    prev.listing.id === next.listing.id &&
    prev.onPress === next.onPress &&
    prev.onToggleSave === next.onToggleSave
);

// ── Row renderer extracted so useCallback dependency is just the id ────────
function ListingRow({
  item,
  onNavigate,
}: {
  item: ApiListing;
  onNavigate: (id: string) => void;
}) {
  const { isSaved, toggle } = useWishlist();
  const onPress = useCallback(() => onNavigate(item.id), [item.id, onNavigate]);
  const onToggleSave = useCallback(() => toggle(item.id), [item.id, toggle]);

  return (
    <ListingCard
      listing={item}
      saved={isSaved(item.id)}
      onPress={onPress}
      onToggleSave={onToggleSave}
    />
  );
}

// ── Memoized header so FlatList doesn't re-render on every keystroke ───────
const ListHeader = React.memo(function ListHeader({
  searchQuery,
  isSearching,
  loadingSearch,
  totalSearchResults,
  activeQuery,
  selectedCategory,
  paddingTop,
  backgroundColor,
  borderColor,
  textSecondaryColor,
  onSearchChange,
  onClear,
  onSelectCategory,
}: {
  searchQuery: string;
  isSearching: boolean;
  loadingSearch: boolean;
  totalSearchResults?: number;
  activeQuery: string;
  selectedCategory: string;
  paddingTop: number;
  backgroundColor: string;
  borderColor: string;
  textSecondaryColor: string;
  onSearchChange: (t: string) => void;
  onClear: () => void;
  onSelectCategory: (c: string) => void;
}) {
  return (
    <View style={{ backgroundColor, paddingTop }}>
      <SearchBar
        placeholder="Search by location or type..."
        showDetails={!isSearching}
        value={searchQuery}
        onChangeText={onSearchChange}
        onClear={onClear}
      />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      {isSearching && !loadingSearch && (
        <View style={[styles.searchBanner, { borderBottomColor: borderColor }]}>
          <Text style={[styles.searchBannerText, { color: textSecondaryColor }]}>
            {totalSearchResults !== undefined
              ? `${totalSearchResults} result${totalSearchResults !== 1 ? "s" : ""} for "${activeQuery}"`
              : "Searching..."}
          </Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

function ErrorState({ onRetry, colors }: { onRetry: () => void; colors: any }) {
  return (
    <View style={styles.centerState}>
      <Text style={styles.stateIcon}>⚠️</Text>
      <Text style={[styles.stateTitle, { color: colors.text }]}>
        Failed to load listings
      </Text>
      <Text style={[styles.stateSubtitle, { color: colors.textSecondary }]}>
        Check your connection and try again
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryBtnText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState({ query, colors }: { query: string; colors: any }) {
  return (
    <View style={styles.centerState}>
      <Text style={styles.stateIcon}>🔍</Text>
      <Text style={[styles.stateTitle, { color: colors.text }]}>
        No results found
      </Text>
      <Text style={[styles.stateSubtitle, { color: colors.textSecondary }]}>
        {query
          ? `No listings match "${query}"`
          : "No listings available right now"}
      </Text>
    </View>
  );
}

function PaginationFooter({
  isFetchingNextPage,
  hasNextPage,
  colors,
}: {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  colors: any;
}) {
  if (!isFetchingNextPage && !hasNextPage) return null;
  return (
    <View style={styles.paginationFooter}>
      {isFetchingNextPage && (
        <>
          <ActivityIndicator size="small" color="#FF385C" />
          <Text style={[styles.paginationText, { color: colors.textSecondary }]}>
            Loading more...
          </Text>
        </>
      )}
    </View>
  );
}

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearching = activeQuery.trim().length > 0;

  const queryUpper = activeQuery.trim().toUpperCase();
  const isTypeQuery = VALID_TYPES.includes(queryUpper);
  const searchParams = useMemo(
    () => (isTypeQuery ? { type: queryUpper } : { location: activeQuery }),
    [isTypeQuery, queryUpper, activeQuery]
  );

  const {
    data: allListings = [],
    isLoading: loadingAll,
    isError: errorAll,
    refetch: refetchAll,
    isRefetching,
  } = useListings();

  const {
    data: searchData,
    isLoading: loadingSearch,
    isError: errorSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchSearch,
  } = useInfiniteSearch(searchParams, isSearching);

  const searchResults = useMemo(
    () => searchData?.pages.flatMap((p) => p.data) ?? [],
    [searchData]
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setActiveQuery(text.trim()), 500);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const handleEndReached = useCallback(() => {
    if (isSearching && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Stable navigation callback — id is the only changing dependency
  const handleNavigate = useCallback(
    (id: string) => router.push({ pathname: "/listing-detail", params: { id } }),
    [router]
  );

  const baseListings = isSearching ? searchResults : allListings;

  const filteredListings = useMemo(
    () =>
      selectedCategory === "All"
        ? baseListings
        : baseListings.filter(
            (l) => l.type.toUpperCase() === selectedCategory.toUpperCase()
          ),
    [baseListings, selectedCategory]
  );

  const isLoading = isSearching ? loadingSearch : loadingAll;
  const isError = isSearching ? errorSearch : errorAll;
  const onRetry = isSearching ? refetchSearch : refetchAll;
  const totalSearchResults = searchData?.pages[0]?.meta.total;

  // Stable renderItem — only depends on handleNavigate which is stable
  const renderItem = useCallback(
    ({ item }: { item: ApiListing }) => (
      <ListingRow item={item} onNavigate={handleNavigate} />
    ),
    [handleNavigate]
  );

  const keyExtractor = useCallback((item: ApiListing) => item.id, []);

  const listHeader = (
    <ListHeader
      searchQuery={searchQuery}
      isSearching={isSearching}
      loadingSearch={loadingSearch}
      totalSearchResults={totalSearchResults}
      activeQuery={activeQuery}
      selectedCategory={selectedCategory}
      paddingTop={insets.top}
      backgroundColor={colors.background}
      borderColor={colors.border}
      textSecondaryColor={colors.textSecondary}
      onSearchChange={handleSearchChange}
      onClear={handleClearSearch}
      onSelectCategory={setSelectedCategory}
    />
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={[]}
          renderItem={null}
          keyExtractor={(_, i) => String(i)}
          ListHeaderComponent={listHeader}
          ListFooterComponent={<ListingSkeletonList count={5} />}
          stickyHeaderIndices={[0]}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={[]}
          renderItem={null}
          keyExtractor={(_, i) => String(i)}
          ListHeaderComponent={listHeader}
          ListFooterComponent={<ErrorState onRetry={onRetry} colors={colors} />}
          stickyHeaderIndices={[0]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredListings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState query={activeQuery} colors={colors} />
        }
        ListFooterComponent={
          isSearching ? (
            <PaginationFooter
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              colors={colors}
            />
          ) : null
        }
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        removeClippedSubviews
        maxToRenderPerBatch={6}
        windowSize={10}
        initialNumToRender={6}
        refreshControl={
          !isSearching ? (
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetchAll}
              tintColor="#FF385C"
              colors={["#FF385C"]}
            />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  imageContainer: { width: "100%", height: 220, position: "relative" },
  image: { width: "100%", height: "100%" },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: { color: "white", fontSize: 11, fontWeight: "600" },
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  location: { fontSize: 14, fontWeight: "700", flex: 1, marginRight: 8 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  star: { color: "#FFB800", fontSize: 13 },
  ratingText: { fontSize: 13, fontWeight: "600" },
  title: { fontSize: 13, marginBottom: 8 },
  price: { fontSize: 14 },
  priceBold: { fontWeight: "700", fontSize: 15 },
  priceUnit: { fontSize: 13 },
  guests: { fontSize: 12 },
  searchBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  searchBannerText: { fontSize: 13 },
  clearText: { fontSize: 13, fontWeight: "600", color: "#FF385C" },
  centerState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  stateIcon: { fontSize: 48, marginBottom: 16 },
  stateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  stateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: "#FF385C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: { color: "white", fontWeight: "600", fontSize: 15 },
  paginationFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },
  paginationText: { fontSize: 13 },
});
