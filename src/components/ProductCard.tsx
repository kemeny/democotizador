'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToQuote: (product: Product, quantity: number) => void;
  isInQuote?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToQuote, 
  isInQuote = false 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToQuote = async () => {
    setIsAdding(true);
    onAddToQuote(product, quantity);
    
    // Feedback visual
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border p-4 transition-all duration-200
      ${isInQuote ? 'border-green-200 bg-green-50' : 'border-gray-200'}
      hover:shadow-md active:scale-[0.98]
    `}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
            {product.name}
          </h3>
          {product.category && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {product.category}
            </span>
          )}
        </div>
        {isInQuote && (
          <div className="ml-2 flex-shrink-0">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* Price */}
      <div className="mb-4">
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </span>
        <span className="text-sm text-gray-500 ml-1">
          / {product.unit}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">Cantidad:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={decrementQuantity}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
            disabled={quantity <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="w-8 text-center font-medium text-gray-900">
            {quantity}
          </span>
          
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-semibold text-gray-900">
          {formatPrice(product.price * quantity)}
        </span>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddToQuote}
        disabled={isAdding}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200
          ${isAdding
            ? 'bg-green-500 text-white'
            : isInQuote
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isAdding ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Agregado
          </div>
        ) : isInQuote ? (
          'Agregar más'
        ) : (
          'Agregar a cotización'
        )}
      </button>
    </div>
  );
}; 