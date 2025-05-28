'use client';

import React, { useRef, useState } from 'react';
import { parseCSV, validateCSVStructure } from '@/utils/csvParser';
import { Product } from '@/types/product';

interface CSVUploaderProps {
  onProductsLoaded: (products: Product[]) => void;
  onError: (error: string) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onProductsLoaded, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      onError('Por favor selecciona un archivo CSV válido');
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await validateCSVStructure(file);
      if (!isValid) {
        onError('El archivo CSV debe contener al menos las columnas "name" y "price"');
        return;
      }

      const products = await parseCSV(file);
      if (products.length === 0) {
        onError('No se encontraron productos válidos en el archivo');
        return;
      }

      onProductsLoaded(products);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200 min-h-[120px] flex flex-col justify-center
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-600">Procesando archivo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              Arrastra tu archivo CSV aquí
            </p>
            <p className="text-xs text-gray-500">
              o toca para seleccionar
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium mb-1">Formato requerido:</p>
        <p>• Columnas: id, name, description, price, unit, category</p>
        <p>• Mínimo requerido: name, price</p>
      </div>
    </div>
  );
}; 