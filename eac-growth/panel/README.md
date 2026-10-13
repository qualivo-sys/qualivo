# EAC · Panel comercial en vivo

Panel de una sola página que lee **en vivo** GoHighLevel, Meta Ads, Google Ads,
Search Console y GA4, y responde a la pregunta que se repite cada semana:
*¿cuántos leads entran, cuántos agendan, cuántos se presentan y cuánto cuesta cada entrevista?*

Sigue `playbooks/dashboard-comercial/README.md` (caso de referencia: Eleva Academy),
con las cuatro adaptaciones que pide EAC — explicadas en la sección «EAC» de ese playbook.

## Desplegar

1. Proyecto nuevo en Vercel, **root directory** `eac-growth/panel`.
2. Variables de entorno: copiar las claves de `.env.example` y rellenarlas en Vercel.
   Ningún valor real se guarda en el repo.
3. Deploy. Probar `https://<dominio>/api/data?pw=<DASHBOARD_PASSWORD>`.

## Lo que hay que saber para leerlo bien

- **El embudo se mide por el nombre de la columna del tablero, nunca por su posición.**
  En EAC el resultado de una cita no está en el calendario (las 161 citas están
  como `confirmed`): está en las columnas **Plantón** y **Entrevistado**.
- **No hay columna de matrícula**, así que el panel no calcula ingresos ni retorno.
  La economía se cierra en **coste por entrevista**. Crear una columna «Matriculado»
  es el cambio que más valor añadiría.
- Los **% de plantón se calculan solo sobre las citas marcadas**. Las que nadie marcó
  se muestran aparte y salen en los avisos de arriba.
- El panel **avisa de lo que no sabe** en lugar de esconderlo: citas sin marcar,
  desacuerdos entre el estado de GHL y la columna, y fuentes de datos caídas.

## Archivos

| Archivo | Qué hace |
|---|---|
| `api/data.js` | Trae y normaliza todo. Una fila por oportunidad + citas resueltas + inversión. Caché 2 min, protegido por contraseña. |
| `index.html` | Todo el front: gate, filtros y una función `render*` por sección. |
| `vercel.json` | `cleanUrls` y `no-store` en la API. |
| `.env.example` | Las variables, para qué sirven y qué pasa si faltan. |
