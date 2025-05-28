import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QuoteProvider } from "@/context/QuoteContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Democotizador - Sistema de Cotización",
  description: "Sistema de cotización de productos móvil-first",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <QuoteProvider>
          {children}
        </QuoteProvider>
      </body>
    </html>
  );
}
