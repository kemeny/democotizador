# 📱 Democotizador - Sistema de Cotización Mobile-First

Una aplicación web moderna para generar cotizaciones de productos, optimizada para dispositivos móviles y lista para deployment en Vercel.

## ✨ Características

- **📱 Mobile-First**: Diseño optimizado para dispositivos móviles
- **📊 Carga de CSV**: Importa productos desde archivos CSV
- **🛒 Carrito Intuitivo**: Selección fácil de productos y cantidades
- **🧮 Cálculos Automáticos**: Suma automática de valores
- **📄 Vista de Cotización**: Resumen profesional de la cotización
- **📑 Generación de PDF**: Descarga cotizaciones en formato PDF
- **🎨 UI Moderna**: Interfaz limpia con Tailwind CSS
- **⚡ Performance**: Optimizado para carga rápida

## 🚀 Tecnologías

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Estado**: React Context + useReducer
- **CSV**: Papa Parse
- **PDF**: jsPDF
- **Deployment**: Vercel

## 📋 Formato CSV

El archivo CSV debe contener las siguientes columnas:

```csv
id,name,description,price,unit,category
1,Producto 1,Descripción del producto,10000,unidad,Categoría
```

### Columnas requeridas:
- `name` (nombre): Nombre del producto
- `price` (precio): Precio unitario

### Columnas opcionales:
- `id`: Identificador único
- `description`: Descripción del producto
- `unit`: Unidad de medida (por defecto: "unidad")
- `category`: Categoría del producto

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <tu-repo>
cd democotizador

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Uso de la Aplicación

### 1. Cargar Productos
- Al abrir la app, carga un archivo CSV con tus productos
- O usa el archivo de ejemplo incluido (`products-example.csv`)

### 2. Seleccionar Productos
- Navega por la lista de productos
- Usa la búsqueda y filtros por categoría
- Ajusta cantidades y agrega al carrito

### 3. Revisar Cotización
- Ve el carrito en tiempo real (sidebar en desktop, modal en móvil)
- Haz clic en "Ver Cotización Completa"

### 4. Generar PDF
- Completa la información del cliente (opcional)
- Haz clic en "Descargar PDF"
- El PDF se descarga automáticamente

## 🌐 Deployment en Vercel

### Opción 1: Desde GitHub
1. Sube tu código a GitHub
2. Conecta tu repositorio en [vercel.com](https://vercel.com)
3. Vercel detectará automáticamente Next.js
4. ¡Deploy automático!

### Opción 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Variables de Entorno
No se requieren variables de entorno especiales para esta aplicación.

## 📁 Estructura del Proyecto

```
democotizador/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página principal
│   │   └── quote/
│   │       └── page.tsx        # Página de cotización
│   ├── components/
│   │   ├── CSVUploader.tsx     # Cargador de CSV
│   │   ├── ProductCard.tsx     # Tarjeta de producto
│   │   └── QuoteCart.tsx       # Carrito de cotización
│   ├── context/
│   │   └── QuoteContext.tsx    # Estado global
│   ├── types/
│   │   └── product.ts          # Tipos TypeScript
│   └── utils/
│       └── csvParser.ts        # Utilidades CSV
├── public/
│   └── products-example.csv    # Archivo de ejemplo
├── vercel.json                 # Configuración Vercel
└── README.md
```

## 🎨 Características de Diseño

### Mobile-First
- Diseño responsivo que prioriza la experiencia móvil
- Controles touch-friendly con botones grandes
- Modal de carrito para pantallas pequeñas
- Navegación optimizada para gestos

### UX/UI
- Feedback visual en todas las interacciones
- Estados de carga y animaciones suaves
- Iconografía clara y consistente
- Colores y tipografía profesional

## 🔧 Personalización

### Cambiar Moneda
Edita la función `formatPrice` en los componentes:

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP', // Cambiar aquí
    minimumFractionDigits: 0,
  }).format(price);
};
```

### Agregar Campos al CSV
1. Actualiza la interfaz `Product` en `src/types/product.ts`
2. Modifica `parseCSV` en `src/utils/csvParser.ts`
3. Actualiza los componentes según necesites

### Personalizar PDF
Edita la función `generatePDF` en `src/app/quote/page.tsx` para:
- Agregar logo de empresa
- Cambiar formato y colores
- Incluir términos y condiciones personalizados

## 🐛 Solución de Problemas

### Error al cargar CSV
- Verifica que el archivo tenga las columnas requeridas
- Asegúrate de que los precios sean números válidos
- Revisa la codificación del archivo (UTF-8 recomendado)

### PDF no se genera
- Verifica que jsPDF esté instalado correctamente
- Revisa la consola del navegador para errores
- Asegúrate de que hay productos en la cotización

### Problemas de responsive
- Verifica que Tailwind CSS esté configurado correctamente
- Revisa las clases responsive (sm:, md:, lg:)
- Prueba en diferentes dispositivos y navegadores

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Revisa la documentación
- Contacta al desarrollador

---

Desarrollado con ❤️ para facilitar la generación de cotizaciones profesionales.
