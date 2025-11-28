export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rop: number; // Reorder Point
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'webpay' | 'transfer';
  date: Date;
}

export enum PaymentMethod {
  WEBPAY = 'webpay',
  TRANSFER = 'transfer'
}