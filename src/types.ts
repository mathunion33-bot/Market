export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  address?: string;
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  internalPrice: number; // Cost price for profit calculation
  category: string;
  image: string;
  stock: number;
  popular?: boolean;
  featured?: boolean;
  priceMax?: number;
  deliveryDays?: number; // Days to prepare/deliver
  hidden?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'received' | 'buying' | 'preparing' | 'on_the_way' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  address?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: any;
  deliveryDate: string;
  pixCode?: string;
  observation?: string;
  isRecurring?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
