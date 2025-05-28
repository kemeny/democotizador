import Papa from 'papaparse';
import { Product } from '@/types/product';

export const parseCSV = (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const products: Product[] = (results.data as Record<string, unknown>[]).map((row, index: number) => ({
            id: (row.id as string) || `product-${index}`,
            name: (row.name as string) || (row.nombre as string) || '',
            description: (row.description as string) || (row.descripcion as string) || '',
            price: parseFloat((row.price as string) || (row.precio as string) || '0'),
            unit: (row.unit as string) || (row.unidad as string) || 'unidad',
            category: (row.category as string) || (row.categoria as string) || 'General'
          }));
          
          // Filtrar productos válidos
          const validProducts = products.filter(p => p.name && p.price > 0);
          resolve(validProducts);
        } catch {
          reject(new Error('Error al procesar el archivo CSV'));
        }
      },
      error: (error) => {
        reject(new Error(`Error al leer el archivo: ${error.message}`));
      }
    });
  });
};

export const validateCSVStructure = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      preview: 1,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const requiredFields = ['name', 'price'];
        const hasRequiredFields = requiredFields.some(field => 
          headers.some(header => 
            header.toLowerCase().includes(field) || 
            header.toLowerCase().includes(field === 'name' ? 'nombre' : 'precio')
          )
        );
        resolve(hasRequiredFields);
      },
      error: () => resolve(false)
    });
  });
}; 