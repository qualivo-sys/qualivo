# Dashboard REBT (Focus Practical) — actualización automática

`update_rebt_dashboard.py` reescribe la pestaña **Funnel REBT** del Sheet
`1te0epMJ...` con: campañas Meta REBT (gasto, CTR, CPC, CPM, leads, CPL) y las
etapas del pipeline REBT en GoHighLevel. Lee las credenciales de variables de
entorno (`META_TOKEN`, `GHL_PIT`, `GOOGLE_SA`, `SHEET_ID`).

`run_daily_rebt.sh <passphrase>` descifra `rebt_creds.enc` (AES-256) y ejecuta
el script. La passphrase NO está en el repo: vive en la tarea programada.

Ejecutado a diario por una tarea programada de Claude Code (sesión nueva).
