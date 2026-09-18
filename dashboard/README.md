# Cuadro de mando de Qualivo

`actualizar.py` lee **Meta Ads**, **Smartlead** y **GoHighLevel** y escribe una fila
por día en el Google Sheet financiero. Idempotente: si la fila del día ya existe,
la reescribe en vez de duplicarla.

## Pestañas que mantiene

| Pestaña | Contenido | Fuente |
|---|---|---|
| `DASH` | Portada con semáforos y estado de clientes | fórmulas sobre las demás |
| `Paid diario` | Una fila por campaña y día: gasto, impresiones, clics, CTR, CPC, leads, CPL | Meta Ads API |
| `Outbound diario` | Una fila por día: campañas activas, enviados, respuestas, % | Smartlead |
| `Outbound campañas` | Una fila por campaña y día | Smartlead |
| `CRM diario` | Prospectos, leads nuevos, reuniones, seguimiento, propuestas, clientes | GoHighLevel |

## Uso

```bash
export META_TOKEN=...            META_AD_ACCOUNT=act_...
export SMARTLEAD_KEY=...         GHL_TOKEN=pit-...   GHL_LOCATION=...
export GOOGLE_SA_JSON=/ruta/service_account.json
export SHEET_ID=1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0

python3 dashboard/actualizar.py            # ayer, que es el ultimo dia cerrado
python3 dashboard/actualizar.py 2026-09-17 # un dia concreto
```

Ninguna credencial vive en el repositorio.

## Tres trampas que ya costaron su rato, para no repetirlas

1. **Cloudflare 1010.** Smartlead y GoHighLevel rechazan clientes sin User-Agent de
   navegador. Todas las llamadas lo llevan.
2. **Locale español.** Con `valueInputOption=USER_ENTERED`, la hoja convierte `19.01`
   en la fecha 19 de enero y los totales se disparan. Las pestañas de datos se
   escriben con `RAW`.
3. **Arrastre de filas.** Al releer las filas anteriores hay que pedir
   `valueRenderOption=UNFORMATTED_VALUE`. Si se leen formateadas, se reescriben como
   texto y `SUM` deja de contarlas.

## Lo que este cuadro de mando NO mide, y por qué

- **Aperturas y clics de email**: Smartlead los da a 0 porque el seguimiento de
  apertura está desactivado. Es correcto: el píxel de apertura daña la entregabilidad.
  **La métrica real de outbound es la respuesta**, no la apertura.
- **Facturación y MRR**: viven en Quipu y no hay credenciales en esta sesión.
- **Smartlead da totales acumulados por campaña**, no por día. La fila diaria es una
  foto del acumulado; la actividad del día es la diferencia entre dos días.
