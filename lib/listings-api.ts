import { ApiListing, SearchParams } from "@/types/listings";

const BASE_URL = "https://airbnb-api-c4yx.onrender.com/api/v1";
const PAGE_SIZE = 6;

export interface PaginatedResponse {
  data: ApiListing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


export async function fetchListings(): Promise<ApiListing[]> {
  const res = await fetch(`${BASE_URL}/listings`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}


export async function fetchSearchPage(
  params: SearchParams & { page: number }
): Promise<PaginatedResponse> {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(PAGE_SIZE));
 
  if (params.location) query.set("location", params.location);
  if (params.type) query.set("type", params.type);
  if (params.minPrice) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice) query.set("maxPrice", String(params.maxPrice));
  if (params.guests) query.set("guests", String(params.guests));

  const res = await fetch(`${BASE_URL}/listings/search?${query.toString()}`);
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  return {
    data: Array.isArray(json.data) ? json.data : [],
    meta: json.meta ?? { total: 0, page: params.page, limit: PAGE_SIZE, totalPages: 1 },
  };
}

export { PAGE_SIZE };
