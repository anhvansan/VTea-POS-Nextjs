export type IceLevel = "100%" | "50%" | "Ít đá";
export type SugarLevel = "100%" | "70%" | "50%";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  badge?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  ice: IceLevel;
  sugar: SugarLevel;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}
