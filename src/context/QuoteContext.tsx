'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, QuoteItem, QuoteContextType } from '@/types/product';

interface QuoteState {
  products: Product[];
  quoteItems: QuoteItem[];
  loading: boolean;
  error: string | null;
}

type QuoteAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_QUOTE'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_QUOTE'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_QUOTE' };

const initialState: QuoteState = {
  products: [],
  quoteItems: [],
  loading: false,
  error: null,
};

const quoteReducer = (state: QuoteState, action: QuoteAction): QuoteState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_QUOTE':
      const existingItemIndex = state.quoteItems.findIndex(
        item => item.product.id === action.payload.product.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.quoteItems];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        updatedItems[existingItemIndex].subtotal = 
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].product.price;
        return { ...state, quoteItems: updatedItems };
      } else {
        const newItem: QuoteItem = {
          product: action.payload.product,
          quantity: action.payload.quantity,
          subtotal: action.payload.product.price * action.payload.quantity,
        };
        return { ...state, quoteItems: [...state.quoteItems, newItem] };
      }
    case 'REMOVE_FROM_QUOTE':
      return {
        ...state,
        quoteItems: state.quoteItems.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        quoteItems: state.quoteItems.map(item =>
          item.product.id === action.payload.productId
            ? {
                ...item,
                quantity: action.payload.quantity,
                subtotal: item.product.price * action.payload.quantity,
              }
            : item
        ),
      };
    case 'CLEAR_QUOTE':
      return { ...state, quoteItems: [] };
    default:
      return state;
  }
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quoteReducer, initialState);

  const addToQuote = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_TO_QUOTE', payload: { product, quantity } });
  };

  const removeFromQuote = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_QUOTE', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const clearQuote = () => {
    dispatch({ type: 'CLEAR_QUOTE' });
  };

  const getTotal = () => {
    return state.quoteItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const value: QuoteContextType = {
    products: state.products,
    quoteItems: state.quoteItems,
    loading: state.loading,
    error: state.error,
    addToQuote,
    removeFromQuote,
    updateQuantity,
    clearQuote,
    getTotal,
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
};

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}; 