import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchListings, fetchSearchPage } from "@/lib/listings-api";
import { SearchParams } from "@/types/listings";

export const LISTINGS_KEY = ["listings"] as const;
export const SEARCH_KEY = (params: SearchParams) =>
  ["listings", "search", params] as const;

// All listings — no pagination (backend doesn't support it on this endpoint)
export function useListings() {
  return useQuery({
    queryKey: LISTINGS_KEY,
    queryFn: fetchListings,
    staleTime: 1000 * 60 * 5,
  });
}

// Infinite paginated search — uses /listings/search with real page+limit
export function useInfiniteSearch(params: SearchParams, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: SEARCH_KEY(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchSearchPage({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
