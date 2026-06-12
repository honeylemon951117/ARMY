/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'necklace' | 'ring' | 'earrings' | 'choker';
  price: number;
  material: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  stock: number;
  story: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  description: string;
}

export interface UserProfile {
  username: string;
  role: 'customer' | 'admin';
  points: number;
  email: string;
  level: string; // e.g., "暗夜男爵 Barons of the Night"
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'threads' | 'facebook';
  imageUrl: string;
  content: string;
  hashtags: string[];
  likes: number;
  date: string;
}

export interface EdmCampaign {
  id: string;
  subject: string;
  title: string;
  content: string;
  badge: string;
  callToAction: string;
}

export interface SeoDoc {
  page: string;
  title: string;
  keywords: string[];
  description: string;
  structure: string[];
}
