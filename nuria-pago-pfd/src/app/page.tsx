'use client';

import { useState } from 'react';

const PRICE_LABEL = process.env.NEXT_PUBLIC_PRICE_LABEL ?? '2.200 €';

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const FEATURES = [
  'Metodo de 6 pasos para recuperar el sueno natural',
  'Sesiones en directo cada semana con la Dra. Nuria Roure',
  'Clases en video, audios y material descargable',
  'Grupo VIP de acompanamiento durante el programa',
  'Acceso durante 1 ano a todo el contenido',
];

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // proteccion anti doble-envio
    setError(null);

    const fd = new FormData(e.currentTarget);
    const accepted = fd.get('terms');
    if (!accepted) {
      setError('Debes aceptar las condiciones y la politica de privacidad.');
      return;
    }

    const payload = {
      name: String(fd.get('name') ?? ''),
      surname: String(fd.get('surname') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      country: String(fd.get('country') ?? ''),
    };

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'No se pudo iniciar el pago.');
        setLoading(false);
        return;
      }

      // Redirigimos a Redsys con un auto-submit (POST).
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;
      for (const [k, v] of Object.entries(data.fields as Record<string, string>)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch {
      setError('Error de conexion. Revisa tu internet e intentalo de nuevo.');
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <div className="hero">
        <div className="kicker">Dra. Nuria Roure · Psicologa experta en sueno</div>
        <h1>Programa Por Fin Duermo</h1>
        <p>Recupera el sueno natural en 10 semanas, sin depender de pastillas. Inscribete de forma segura.</p>
      </div>

      <div className="grid">
        <section className="card summary">
          <h2>Que incluye tu inscripcion</h2>
          <div className="price">{PRICE_LABEL} <small>· pago unico · acceso 1 ano</small></div>
          {FEATURES.map((f) => (
            <div className="feature" key={f}><Check /> <span>{f}</span></div>
          ))}
        </section>

        <section className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div>
                <label htmlFor="name">Nombre</label>
                <input id="name" name="name" autoComplete="given-name" required />
              </div>
              <div>
                <label htmlFor="surname">Apellidos</label>
                <input id="surname" name="surname" autoComplete="family-name" required />
              </div>
            </div>

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="phone">Telefono</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" />

            <label htmlFor="country">Pais</label>
            <select id="country" name="country" defaultValue="ES">
              <option value="ES">Espana</option>
              <option value="MX">Mexico</option>
              <option value="AR">Argentina</option>
              <option value="CO">Colombia</option>
              <option value="CL">Chile</option>
              <option value="OT">Otro</option>
            </select>

            <label className="check">
              <input type="checkbox" name="terms" />
              <span>He leido y acepto las condiciones de contratacion y la politica de privacidad.</span>
            </label>

            <button className="pay" type="submit" disabled={loading}>
              {loading ? 'Redirigiendo al pago seguro…' : `Pagar ${PRICE_LABEL}`}
            </button>

            {error && <div className="error">{error}</div>}

            <div className="secure">
              Pago 100% seguro · Procesado por <strong>Redsys (CaixaBank)</strong> · Bizum disponible<br />
              Cifrado SSL · Verificacion 3D Secure
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
