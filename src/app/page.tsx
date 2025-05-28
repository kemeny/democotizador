'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CSVUploader } from '@/components/CSVUploader';
import { ProductCard } from '@/components/ProductCard';
import { QuoteCart } from '@/components/QuoteCart';
import { useQuote } from '@/context/QuoteContext';
import { Product } from '@/types/product';

export default function Home() {
  const router = useRouter();
  const { addToQuote, quoteItems } = useQuote();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Cargar productos de ejemplo al inicio
  useEffect(() => {
    loadExampleProducts();
  }, []);

  // Filtrar productos cuando cambie el término de búsqueda o categoría
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const loadExampleProducts = async () => {
    try {
      const response = await fetch('/products-example.csv');
      const csvText = await response.text();
      
      // Parsear CSV manualmente para el ejemplo
      const lines = csvText.split('\n');
      const exampleProducts: Product[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 4) {
          exampleProducts.push({
            id: values[0],
            name: values[1],
            description: values[2],
            price: parseFloat(values[3]),
            unit: values[4] || 'unidad',
            category: values[5] || 'General'
          });
        }
      }

      setProducts(exampleProducts);
      setError(null);
    } catch {
      setError('Error al cargar productos de ejemplo');
    }
  };

  const handleProductsLoaded = (newProducts: Product[]) => {
    setProducts(newProducts);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleAddToQuote = (product: Product, quantity: number) => {
    addToQuote(product, quantity);
  };

  const handleViewQuote = () => {
    router.push('/quote');
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const isProductInQuote = (productId: string) => {
    return quoteItems.some(item => item.product.id === productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Democotizador</h1>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-600 hover:text-gray-900 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              {quoteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {quoteItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* CSV Uploader */}
            {products.length === 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cargar Productos
                </h2>
                <CSVUploader
                  onProductsLoaded={handleProductsLoaded}
                  onError={handleError}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <>
                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Productos ({filteredProducts.length})
                    </h2>
                    <button
                      onClick={loadExampleProducts}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Recargar CSV
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value || '')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Category Filter */}
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category || 'all')}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                          ${selectedCategory === category
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        {category === 'all' ? 'Todos' : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToQuote={handleAddToQuote}
                      isInQuote={isProductInQuote(product.id)}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron productos</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <QuoteCart onViewQuote={handleViewQuote} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Cotización</h3>
              <button
                onClick={() => setShowCart(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto">
              <QuoteCart onViewQuote={handleViewQuote} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
