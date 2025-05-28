'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuote } from '@/context/QuoteContext';

export default function QuotePage() {
  const router = useRouter();
  const { quoteItems, getTotal, clearQuote } = useQuote();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceForPDF = (price: number) => {
    // Formato ultra compacto para PDF - sin símbolo de moneda, solo números
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${Math.round(price / 1000)}K`;
    } else {
      return price.toString();
    }
  };

  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COT-${year}${month}${day}-${random}`;
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Importar jsPDF dinámicamente
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Configuración
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('COTIZACIÓN', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Quote Info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const quoteNumber = generateQuoteNumber();
      const currentDate = new Date().toLocaleDateString('es-CL');
      
      doc.text(`Número: ${quoteNumber}`, margin, yPosition);
      doc.text(`Fecha: ${currentDate}`, pageWidth - margin - 60, yPosition);
      yPosition += 25;

      // Customer Info
      if (customerInfo.name || customerInfo.company) {
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENTE:', margin, yPosition);
        yPosition += 10;
        
        doc.setFont('helvetica', 'normal');
        if (customerInfo.company) {
          doc.text(customerInfo.company, margin, yPosition);
          yPosition += 8;
        }
        if (customerInfo.name) {
          doc.text(customerInfo.name, margin, yPosition);
          yPosition += 8;
        }
        if (customerInfo.email) {
          doc.text(customerInfo.email, margin, yPosition);
          yPosition += 8;
        }
        if (customerInfo.phone) {
          doc.text(customerInfo.phone, margin, yPosition);
          yPosition += 8;
        }
        yPosition += 15;
      }

      // Table Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      
      // Posiciones de columnas con espaciado amplio para evitar superposición
      const col1 = margin;                    // Producto: 20
      const col2 = margin + 75;               // Cantidad: 95  
      const col3 = margin + 100;              // P. Unit: 120
      const col4 = pageWidth - margin - 10;   // Subtotal: ~200 (alineado derecha)
      
      doc.text('PRODUCTO', col1, yPosition);
      doc.text('CANT.', col2, yPosition);
      doc.text('P. UNIT.', col3, yPosition);
      doc.text('SUBTOTAL', col4, yPosition, { align: 'right' });
      
      // Line under header
      doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
      yPosition += 15;

      // Items
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      quoteItems.forEach((item) => {
        // Verificar si necesitamos nueva página
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin + 20;
          
          // Repetir headers en nueva página
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('PRODUCTO', col1, yPosition);
          doc.text('CANT.', col2, yPosition);
          doc.text('P. UNIT.', col3, yPosition);
          doc.text('SUBTOTAL', col4, yPosition, { align: 'right' });
          doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
          yPosition += 15;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }

        // Truncar nombre del producto para que no invada otras columnas
        const productName = item.product.name.length > 25 
          ? item.product.name.substring(0, 22) + '...' 
          : item.product.name;

        doc.text(productName, col1, yPosition);
        doc.text(`${item.quantity}`, col2, yPosition);
        doc.text(formatPriceForPDF(item.product.price), col3, yPosition);
        doc.text(formatPriceForPDF(item.subtotal), col4, yPosition, { align: 'right' });
        yPosition += 12;
      });

      // Total
      yPosition += 10;
      doc.line(col3, yPosition, pageWidth - margin, yPosition);
      yPosition += 12;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL:', col3, yPosition);
      doc.text(formatPriceForPDF(getTotal()), col4, yPosition, { align: 'right' });

      // Footer
      yPosition += 25;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // Verificar si hay espacio para el footer
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin + 20;
      }
      
      doc.text('Precios en miles de pesos chilenos (K = miles, M = millones)', margin, yPosition);
      yPosition += 6;
      doc.text('Esta cotización tiene validez de 30 días.', margin, yPosition);
      yPosition += 6;
      doc.text('Precios incluyen IVA.', margin, yPosition);

      // Save PDF
      doc.save(`cotizacion-${quoteNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (quoteItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay productos en la cotización</h2>
          <p className="text-gray-600 mb-6">Agrega productos para generar una cotización</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-xl font-bold text-gray-900">Cotización</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Customer Info Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            />
            <input
              type="text"
              placeholder="Empresa"
              value={customerInfo.company}
              onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            />
          </div>
        </div>

        {/* Quote Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalle de Cotización</h3>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('es-CL')}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quoteItems.map((item) => (
                  <tr key={item.product.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </div>
                        {item.product.description && (
                          <div className="text-sm text-gray-500">
                            {item.product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {item.quantity} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {formatPrice(item.product.price)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatPrice(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar PDF
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres limpiar la cotización?')) {
                clearQuote();
                router.push('/');
              }
            }}
            className="flex-1 sm:flex-none bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Nueva Cotización
          </button>
        </div>

        {/* Terms */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Esta cotización tiene validez de 30 días.</p>
          <p>Precios incluyen IVA.</p>
        </div>
      </div>
    </div>
  );
} 