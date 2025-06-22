export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}
