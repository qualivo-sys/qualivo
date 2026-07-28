# Checkout Por Fin Duermo — Redsys → ThriveCart

Checkout propio (Next.js) para el programa **Por Fin Duermo** de la Dra. Nuria Roure.
Cobra con **Redsys (CaixaBank)** y, al confirmarse el pago, **da de alta al alumno
automaticamente en ThriveCart Learn** — sin n8n ni ningun servicio externo que
haya que mantener encendido. Todo corre en Vercel, 24/7.

## Como funciona (flujo)

1. El cliente rellena el formulario en `/` y pulsa **Pagar**.
2. `POST /api/checkout` genera la operacion firmada (HMAC-SHA256) y redirige a Redsys.
3. El cliente paga en la pasarela (tarjeta / Bizum, con 3D Secure).
4. Redsys llama a **`/api/redsys/notificacion`** (server-to-server):
   - verifica la **firma**,
   - si el pago esta **autorizado** (`Ds_Response` 0000–0099), llama a la API de
     ThriveCart y **da de alta al alumno** (email + `course_id`).
5. ThriveCart envia al alumno su email de acceso al curso.
6. El cliente ve la pagina `/pago/ok` (o `/pago/ko` si fallo).

El email del comprador viaja firmado dentro de `Ds_MerchantData` y vuelve en la
notificacion, asi que no hace falta base de datos para saber a quien dar de alta.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellena los valores (NO se suben a git)
npm run dev                  # http://localhost:3000
```

## Despliegue en Vercel

1. Conecta este repo a un proyecto de Vercel.
2. En **Settings → Environment Variables**, añade todas las variables de
   `.env.example` con sus valores reales (ver abajo). Marca los secretos.
3. Fija `PUBLIC_BASE_URL` al dominio real (ej. `https://pago.nuriaroure.com`).
4. Deploy. Con el ordenador apagado sigue funcionando: vive en la nube.

## Configurar el panel de Redsys (produccion)

En el modulo de administracion real de Redsys, para el terminal, configura:

| Campo | Valor |
|---|---|
| URL de notificacion | `https://TU-DOMINIO/api/redsys/notificacion` |
| URL OK | `https://TU-DOMINIO/pago/ok` |
| URL KO | `https://TU-DOMINIO/pago/ko` |

La **clave SHA-256 de produccion** se obtiene en
`https://canales.redsys.es/lacaixa` → Administracion → Comercio → Detalles del
terminal → *Ver clave*. Esa clave va en `REDSYS_SECRET_KEY` (solo en Vercel).

## ⚠️ Punto a confirmar: endpoint de ThriveCart

La API oficial de ThriveCart permite crear/enrolar alumnos con `{ email, course_id }`
y autenticacion Bearer. El **endpoint exacto** (`src/lib/thrivecart.ts`) debe
verificarse contra la referencia oficial (https://developers.thrivecart.com) o
replicando la accion *"Create Student"* de Pabbly/Zapier. Es ajustable por env
(`THRIVECART_API_BASE`, `THRIVECART_ENROLL_PATH`) sin tocar codigo. Los logs de
Vercel muestran la respuesta de ThriveCart para poder afinarlo en la 1ª prueba real.

## Pruebas antes de vender

1. Deja `REDSYS_ENV=sandbox` y la clave/URLs de TEST → prueba con la tarjeta de test.
2. Cambia a `REDSYS_ENV=production` + clave real → haz **un** pago real con tu
   tarjeta y **devuelvelo** desde el panel. Verifica que llega el email de ThriveCart.

## Estructura

```
src/
  lib/
    config.ts       Lee la configuracion de variables de entorno
    redsys.ts       Firma y verificacion Redsys (redsys-easy)
    thrivecart.ts   Alta del alumno via API
  app/
    page.tsx                        Landing + formulario de pago
    api/checkout/route.ts           Genera la operacion firmada
    api/redsys/notificacion/route.ts  Webhook: verifica firma → alta ThriveCart
    pago/ok/page.tsx                Retorno pago OK
    pago/ko/page.tsx                Retorno pago KO
```
