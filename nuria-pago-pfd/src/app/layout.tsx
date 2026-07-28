import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Programa Por Fin Duermo · Nuria Roure',
  description:
    'Inscripcion al programa Por Fin Duermo de la Dra. Nuria Roure. Pago 100% seguro procesado por Redsys (CaixaBank).',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
