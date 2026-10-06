export interface Category {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  image: string;
  accent: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  badge: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  seasonal: boolean;
  origin: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Address {
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  address: Address;
  notes?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
