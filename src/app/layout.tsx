import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CORDANO PMS V1 - Gestión de Estacionamientos (ParkOps)',
  description: 'Sistema integral de gestión de estacionamiento y POS para ParkOps Iquique (Serrano 447). Conectado a Google Cloud Run.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100 flex flex-col">{children}</body>
    </html>
  );
}
