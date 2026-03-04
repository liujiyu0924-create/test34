export interface Pig {
  id: number;
  code: string;
  breed: string;
  price: number;
  image_url: string;
  current_weight: number;
  birth_date: string;
  status: string;
  description?: string;
  coop_number?: string;
  video_url?: string;
  entry_weight?: number;
}

export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  name: string;
  balance: number;
  phone?: string;
}

export interface FeedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  weight_kg: number;
  image_url: string;
}

export interface FeedOrder {
  id: number;
  user_id: number;
  pig_id: number;
  product_id: number;
  status: string;
  created_at: string;
}

export interface Log {
  id: number;
  pig_id: number;
  date: string;
  type: string;
  value: string;
  notes: string;
  image_url?: string;
}
