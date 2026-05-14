export interface ListingPhoto {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  createdAt: string;
  listingId: string;
}

export interface ListingHost {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
}

export interface ApiListing {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  guests: number;
  type: "APARTMENT" | "HOUSE" | "VILLA" | "CABIN" | string;
  amenities: string[];
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  hostId: string;
  host: ListingHost;
  photos: ListingPhoto[];
}

export interface ListingsResponse {
  success: boolean;
  data: ApiListing[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchParams {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}
