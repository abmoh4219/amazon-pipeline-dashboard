export interface Product {
  id: string;
  asin: string;
  title: string;
  brand?: string;
  category?: string;
  image_url?: string;
  price: string;
  currency: string;
  availability?: string;
  seller?: string;
  rating?: number;
  reviews_count?: number;
}
