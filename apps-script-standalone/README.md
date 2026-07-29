# EAC · Auto-actualización diaria del panel de métricas

Script único de Google Apps Script que actualiza **solo cada día** la pestaña
del mes actual + `Curso × Etapa` del Google Sheet, con datos en vivo de
**Meta Ads + Google Ads + GoHighLevel (CRM)**. TikTok es manual.

## Instalación (una vez, ~5 min)
1. Abre el Sheet → **Extensiones → Apps Script**.
2. Borra lo que haya y pega `EAC_AutoDaily.gs` completo. Guarda.
3. Rellena en el bloque `CFG` (cabecera) los **8 campos con `PEGA_AQUI`**
   (tus tokens de Meta, Google Ads y GHL — los mismos que ya usas).
4. Panel izquierdo → **Servicios (＋) → "Sheets API" → Añadir**.
5. Selecciona la función **`setup`** y pulsa ▶ **Ejecutar** → autoriza.
6. Listo: se ejecuta solo cada día ~07:15 (Europe/Madrid).

## Notas
- **META_TOKEN:** usa un token de **Usuario del Sistema** (Business Settings
  → Usuarios del sistema → Generar token, sin caducidad) para que no se rompa.
- Prueba al momento: ejecuta `refreshDashboard` a mano.
- TikTok: edita `TIKTOK_SPEND` / `TIKTOK_CONV` en `CFG` cuando cambien.
