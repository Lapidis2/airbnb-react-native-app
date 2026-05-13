// Listing types
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  country: string;
  image: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: {
    name: string;
    avatar: string;
    responseTime: string;
  };
  amenities: string[];
  reviews: Review[];
  isSaved: boolean;
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
}

export interface SearchFilters {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}
