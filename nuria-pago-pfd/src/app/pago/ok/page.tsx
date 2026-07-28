export const dynamic = 'force-dynamic';

export default function PagoOK() {
  return (
    <main className="wrap">
      <div className="result">
        <div className="badge ok">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1>¡Pago completado!</h1>
        <p>
          Gracias por inscribirte en <strong>Por Fin Duermo</strong>. En unos minutos recibiras un email
          con el acceso a tu curso. Revisa tambien la carpeta de spam por si acaso.
        </p>
        <p style={{ marginTop: 18, fontSize: 14 }}>
          Si en 15 minutos no te ha llegado nada, escribenos a <strong>hola@nuriaroure.com</strong>.
        </p>
      </div>
    </main>
  );
}
