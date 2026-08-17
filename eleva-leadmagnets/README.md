# Eleva Nails · Lead Magnets

Micro-site de lead magnets para Eleva Nails, alojado en **Vercel** (equipo *Qualivo Agency*).

## Lead magnet #1 · Calculadora de ingresos

**"¿Cuánto puedes ganar haciendo uñas?"** — calculadora interactiva que estima el
ingreso mensual/anual según clientas y precio, muestra el potencial especializándose,
y captura el lead (nombre + email + teléfono) para desbloquear el plan personalizado.

- **URL producción:** https://eleva-calculadora-qualivo-agency.vercel.app
- **Captura de lead:** `POST /api/lead` → crea el contacto en GoHighLevel
  con `source: "Calculadora ingresos (web)"` y tags `lead-magnet`, `calculadora-ingresos`.

## Estructura

```
public/index.html   → la página (HTML/CSS/JS inline, sin dependencias)
api/lead.js         → función serverless: recibe el form y lo manda a GHL
```

## Variables de entorno (Vercel → Project → Settings → Environment Variables)

| Variable | Descripción |
|---|---|
| `GHL_TOKEN` | Private Integration token de GoHighLevel |
| `GHL_LOCATION_ID` | ID de la location de Eleva en GHL |

Si faltan, el formulario sigue funcionando para el usuario pero no crea el lead
(devuelve `crm:false`), así nunca se rompe la experiencia.

## Despliegue

Se desplegó vía la API de Vercel (archivos inline). Para redeplegar se puede:
- Conectar el proyecto a este repo (Vercel → Git) para deploys automáticos, o
- Reenviar los archivos con la API de deployments.

## Notas

- La location de GHL **no permite duplicados** (deduplica por email/teléfono):
  un lead repetido se trata como éxito (no se muestra error al usuario).
- Protección de despliegue de Vercel (SSO) **desactivada** para que sea público.
- Pendiente: conectar subdominio propio (ej. `recursos.elevanails.es`) vía DNS.
