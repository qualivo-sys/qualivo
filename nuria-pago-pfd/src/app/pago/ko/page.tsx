export const dynamic = 'force-dynamic';

export default function PagoKO() {
  return (
    <main className="wrap">
      <div className="result">
        <div className="badge ko">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>
        <h1>El pago no se ha completado</h1>
        <p>
          No se ha realizado ningun cargo. Puede que la operacion fuera cancelada o rechazada por tu banco.
          Puedes volver a intentarlo.
        </p>
        <a className="btn" href="/">Volver a intentar</a>
        <p style={{ marginTop: 18, fontSize: 14 }}>
          Si el problema persiste, escribenos a <strong>hola@nuriaroure.com</strong>.
        </p>
      </div>
    </main>
  );
}
