'use client';

import React from 'react';
import { useQuote } from '@/context/QuoteContext';

interface QuoteCartProps {
  onViewQuote: () => void;
}

export const QuoteCart: React.FC<QuoteCartProps> = ({ onViewQuote }) => {
  const { quoteItems, getTotal, updateQuantity, removeFromQuote } = useQuote();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  if (quoteItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-sm">Tu cotización está vacía</p>
          <p className="text-gray-400 text-xs mt-1">Agrega productos para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Cotización ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h3>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(getTotal())}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="max-h-64 overflow-y-auto">
        {quoteItems.map((item) => (
          <div key={item.product.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPrice(item.product.price)} / {item.product.unit}
                </p>
              </div>
              <button
                onClick={() => removeFromQuote(item.product.id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="w-8 text-center text-sm font-medium text-gray-900">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* Subtotal */}
              <span className="font-semibold text-gray-900 text-sm">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(getTotal())}
          </span>
        </div>
        
        <button
          onClick={onViewQuote}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 active:scale-[0.98] transition-all duration-200"
        >
          Ver Cotización Completa
        </button>
      </div>
    </div>
  );
}; 