import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Little Brain · tu sistema operativo personal',
  description:
    'Coach de nutricion, entrenamiento, habitos y productividad con IA. Le cuentas tu dia por chat y el resto se calcula solo.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'My Little Brain', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#0b1020',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>{children}</body>
    </html>
  );
}
