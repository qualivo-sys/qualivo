# Quipu · Dashboard de facturación (ingresos y gastos)

Sincroniza la facturación de **Quipu** en un dashboard de **Google Sheets**,
agregada por mes para dos años (por defecto 2025 y 2026).

- **Fuente:** API de Quipu → `GET https://getquipu.com/api/invoices`
  (incluye facturas emitidas `kind=income` y gastos `kind=expenses`).
- **Destino:** Google Sheets, pestaña `Dashboard`.
- **Métrica:** base imponible (sin IVA), que es la cifra de facturación fiscal.

El dashboard contiene:

- **Resumen (KPIs)** por año: Ingresos, Gastos, Beneficio y Margen %.
- **Tabla mensual comparativa** (Ene–Dic) de los dos años.
- **Dos gráficos de columnas** (Ingresos vs Gastos por mes) uno por año.

## Requisitos

- Python 3 con el paquete `cryptography` (para firmar el JWT del service account).
- Una **cuenta de servicio de Google** con la API de Google Sheets habilitada.
  Comparte el Google Sheet con el email de la cuenta de servicio
  (`client_email` del JSON) con permiso de **Editor**.
- Las credenciales de la **App de Quipu** (App ID y App secret), que se obtienen
  en Quipu → Ajustes → Integraciones/API.

## Uso

```bash
export QUIPU_CLIENT_ID="…"          # App ID de Quipu
export QUIPU_CLIENT_SECRET="…"      # App secret de Quipu
export GOOGLE_SA_JSON="/ruta/service_account.json"
export SHEET_ID="1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0"

python3 sync_quipu_dashboard.py 2025 2026
```

El script es **idempotente**: reescribe los valores y borra los gráficos
anteriores antes de recrearlos, por lo que puede ejecutarse cuantas veces se
quiera (p. ej. desde un cron) sin duplicar nada.

## Notas de la API de Quipu

- **OAuth:** `POST https://getquipu.com/oauth/token` con **Basic Auth**
  (`client_id:client_secret`), cuerpo `grant_type=client_credentials&scope=ecommerce`.
- **Cabecera obligatoria** en las llamadas a la API: `Accept: application/vnd.quipu.v1+json`.
- **Paginación:** `?page[number]=N`; el total llega en `meta.pagination_info.total_pages`
  (20 resultados por página).
- Campos usados por factura: `kind`, `issue_date`, `total_amount`,
  `total_amount_without_taxes` (base), `vat_amount`, `retention_amount`.

## Seguridad

No hay ninguna credencial en el repositorio. Pásalas por variables de entorno o
por un fichero `.env` local (ya ignorado en `.gitignore`). El fichero JSON del
service account **nunca** debe commitearse.
