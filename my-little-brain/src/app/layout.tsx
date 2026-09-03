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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** Aplica el tema antes del primer pintado para que no haya parpadeo. Claro por defecto. */
const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem('mlb:tema');var o=t==='oscuro'||(t==='sistema'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',o);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
