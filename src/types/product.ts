export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category?: string;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  date: string;
  items: QuoteItem[];
  total: number;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface QuoteContextType {
  products: Product[];
  quoteItems: QuoteItem[];
  loading: boolean;
  error: string | null;
  addToQuote: (product: Product, quantity: number) => void;
  removeFromQuote: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearQuote: () => void;
  getTotal: () => number;
} 