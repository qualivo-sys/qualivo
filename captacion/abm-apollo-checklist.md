# ABM — Checklist de setup en Apollo

Ejecutable en cuanto autorices el conector Apollo.io en claude.ai.

## 1. Validar segmento (mín. 200 empresas)
- `organizations_search`: academias / centros de formación / escuelas privadas
  en España. Filtros: país=España, industria=educación/formación,
  headcount 5–100, keywords ("academia", "escuela", "centro de formación", "FP").
- `mixed_people_api_search`: decisores dentro de esas cuentas — títulos
  "Director/a", "Propietario/a", "Gerente", "Responsable de marketing/admisiones".
- Confirmar volumen ≥ 200. Si < 200 → ampliar a vertical adyacente, no forzar.

## 2. Enriquecer y exportar
- Sacar 50–100 leads validados con email verificado.
- Volcar a Notion CRM "Captación Qualivo — Pipeline de clientes"
  (Fuente = "Apollo / Outbound", Nicho, Presupuesto estimado, Ciudad).

## 3. Cargar secuencia
- Pegar los 5 emails de `abm-secuencia-emails.md`.
- Cadencia: Día 0 / 2 / 5 / 9 / 14.
- Sender: Maikel o Víctor (rotar para volumen).
- A/B test del subject en Email 1 (Subject A vs B).
- Mapear variables `{{first_name}}`, `{{academia}}`.

## 4. Tracking
- Todos los links llevan UTM (ya incluidos) → atribución en GHL.
- CTA único: Calendly 15 min (cierre con Alba cuando esté activa).

## 5. Reglas
- No arrancar el envío si Alba no puede cerrar (se quema la lista).
- Revisar reply rate por segmento a los 7 días.

## Benchmark
Open > 40 % · Reply > 3 % · Meeting 0,5–1 % · Cost per meeting vs. Meta Ads.
