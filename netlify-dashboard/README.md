# Eleva · Panel Comercial (Netlify)

Panel comercial de Eleva Academy con **datos en vivo desde GoHighLevel**.
Web estática + una función serverless que trae los datos en el momento (con
caché de 2 min). Sin base de datos, sin servidor propio, sin subir datos.

## Qué muestra
- KPIs: leads nuevos, contactados, entrevistas, matrículas, perdidos, abandonados, **tasa de cierre**.
- **Embudo** global y filtrable.
- Desglose **por comercial** y **por procedencia** (canal).
- Filtros combinables: rango de fechas (calendario), comercial, procedencia, estado.
- Una sola fuente de verdad: todos ven los mismos números para el mismo periodo.

## Desplegar en Netlify (una vez, ~5 min)
1. Entra en **app.netlify.com** → **Add new site → Import an existing project**.
2. Conecta el repositorio `qualivo-sys/qualivo`.
3. En la configuración del build:
   - **Base directory:** `netlify-dashboard`
   - **Publish directory:** `netlify-dashboard/public`
   - Functions y build ya vienen definidos en `netlify.toml`.
4. **Site settings → Environment variables** → añade:
   | Variable | Valor |
   |---|---|
   | `GHL_TOKEN` | el token `pit-...` de GoHighLevel (solo lectura) |
   | `GHL_LOCATION_ID` | el id de la location de Eleva |
   | `DASHBOARD_PASSWORD` | la contraseña que compartiréis con el equipo |
5. **Deploy**. Netlify te da una URL (`https://<algo>.netlify.app`).
6. Comparte la URL + la contraseña con el equipo comercial.

## Cómo se actualiza
No hay que hacer nada: cada vez que se abre el panel, la función pide los datos
actuales a GHL (cacheados 2 min). Solo se vuelve a desplegar si cambia el
**código/diseño** (un push al repo lo despliega solo).

## Notas
- Los tokens viven **solo** en las variables de entorno de Netlify, nunca en el repo ni en el navegador.
- El acceso es por **contraseña compartida**. Para login por usuario se puede añadir Netlify Identity.
- v1 = solo datos comerciales (GHL). La inversión/ROAS de Meta+Google se puede añadir después.
- Estados: Pendiente (nuevos/contactados/agendados/propuesta/negociación) · Ganado (Alumna activa) · Perdido (No interesa/lost) · Abandonado/Inválido.
