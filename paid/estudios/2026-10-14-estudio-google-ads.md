# Estudio · ¿Google Ads para Qualivo? (v0.1 · 14-oct-2026 · en curso, entrega 17-oct)

Pedido de Maikel (14-oct): "¿crees que sería interesante hacer una campaña en Google Ads? ¿podríamos hacer un estudio?" → "haz eso porfa".
Alcance: estudio de mesa, sin gasto. Decide si Google Ads arranca en noviembre, con qué estructura, presupuesto y fecha de muerte.
Regla: cero cifras inventadas. Cada número lleva valor, fuente y fecha; lo que no tiene fuente va marcado como **estimación** o **pendiente**.

## 0 · Resumen (se escribe el 17-oct con los datos completos)

Pendiente.

## 1 · Qué sabemos ya (datos propios)

**Meta, 17-sep → 12-oct (GHL + Meta API, 12-oct):** 50 leads de formulario nativo, CPL 23,6 €, 50 % nivel A+B, 20 % llegan a reunión celebrada, coste por reunión celebrada 118 €, 1 piloto (CAC ~1.179 € con n=1). Dolor declarado: clínicas 60 % "seguimiento"; formación "anuncios" y "respuesta". Es la vara de medir: Google tiene que dar reuniones celebradas a menos de 118 €, o leads con mejor encaje a un coste similar.

**Google Ads B2B en español, cuenta de cliente operada por Qualivo (repo `outthink-google-ads/ESTADO.md`, sep-2026):** lección directa para un nicho pequeño:
- 4 de 17 palabras clave hipernicho en concordancia de frase quedaron `RARELY_SERVED` por volumen insuficiente; la campaña de búsqueda sirvió 4 impresiones en 11 horas hasta que se abrió a concordancia amplia (75 impresiones/día después).
- Techo de CPC necesario (3,00 €) porque "maximizar clics" sin límite y amplia disparan el CPC.
- La medición (conversión, GTM, Consent Mode) decidió el ritmo: sin conversiones no se puede optimizar a conversiones.
- Ejemplo de informe en el mandato Paid (`docs/agent-os/04-systems/70-paid.md`, 14-sep): CPL 45,8 €, CPL cualificado 103 €, campaña de consultoría IA CPL 31 € con 4 de 4 cualificados. **Benchmark B2B en español, no de nuestro nicho.**

**Medición en la landing (rama Growth, `assets/consent.js`, 13-oct):** GA4 `G-LVDQS0MXF4` con Consent Mode v2 ya implementado; no hay etiqueta de conversión de Google Ads (`AW-…`), ni captura de `gclid` hacia GHL. A diferencia de Meta, Google modela las conversiones sin consentimiento vía Consent Mode: el aviso de cookies penaliza menos aquí.

## 2 · Demanda: qué busca la gente y cuánto

**Pendiente de la exportación del Planificador de palabras clave** (España, últimos 12 meses, 30-40 términos por vertical). Sin eso solo hay estimaciones de terceros, que en nichos pequeños fallan por un factor 3-5. Cómo conseguirla:
- Opción A (5 minutos, Maikel): Planificador de palabras clave → "Consultar volumen de búsquedas y previsiones" → pegar la lista de abajo → descargar CSV → pasármelo (sin datos personales dentro).
- Opción B (API): el conector `src/connectors/GoogleAds.gs` ya usa un developer token y un refresh token del MCC de Qualivo, guardados en las propiedades del proyecto de Apps Script (no en el repo). Si Maikel los pone como secretos del entorno de esta sesión (`GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`), puedo pedir volúmenes con `KeywordPlanIdeaService` sin tocar ninguna cuenta de cliente. Solo lectura de ideas, nada de cuentas.

Lista candidata (se completa con la investigación de competencia en §3; intención: **S** = quiere servicio/agencia, **I** = quiere informarse/hacerlo él, **H** = herramienta):

| Vertical | Búsqueda | Intención |
|---|---|---|
| Formación | agencia marketing para academias | S |
| Formación | agencia captación de alumnos | S |
| Formación | agencia marketing centros de formación | S |
| Formación | publicidad para academias | S |
| Formación | campañas captación alumnos | S |
| Formación | cómo captar alumnos para mi academia | I |
| Formación | marketing educativo agencia | S |
| Formación | agencia marketing formación online | S |
| Formación | captación de alumnos FP / oposiciones / idiomas | S/I |
| Formación | crm para academias | H |
| Clínicas | agencia marketing clínicas | S |
| Clínicas | agencia marketing clínica estética | S |
| Clínicas | agencia marketing dental | S |
| Clínicas | captación de pacientes agencia | S |
| Clínicas | marketing para clínicas de fisioterapia | S/I |
| Clínicas | publicidad clínica estética | S |
| Clínicas | cómo conseguir pacientes clínica | I |
| Clínicas | crm para clínicas | H |

Pendiente: volúmenes, CPC alto/bajo y competencia por término.

## 3 · Competencia en Google

Pendiente (investigación en curso, 14-oct): quién puja, qué promete, precios públicos, uso de "diagnóstico gratis", evidencia de anuncios. Impulso Business Lab incluido.

## 4 · Encaje con la oferta

Pendiente de §2-3. Hipótesis a contrastar: las búsquedas tipo **S** son pocas pero convierten a reunión 2-3× mejor que Meta; las **I** son muchas, baratas y traen tipo C (dueño pequeño que quiere hacerlo él); las **H** compiten con software y no son nuestras.

## 5 · Números (modelo, se recalcula con §2)

Supuestos marcados como estimación hasta tener el Planificador. CPC de servicios B2B en España: 2-5 € (**estimación**; el caso OutThink necesitó techo de 3 €). Conversión de visita a lead en la landing v2.1 con tráfico de búsqueda: 5-10 % (**estimación**; el tráfico de búsqueda convierte más que el de Meta porque ya busca solución). Reunión celebrada por lead: 20 % (dato Meta) a 35 % (**estimación** por mayor intención).

| Presupuesto/mes | Clics (CPC 2-5 €) | Leads (5-10 %) | CPL | Reuniones (20-35 %) | Coste/reunión |
|---|---|---|---|---|---|
| 300 € | 60-150 | 3-15 | 20-100 € | 1-5 | 60-300 € |
| 500 € | 100-250 | 5-25 | 20-100 € | 1-9 | 55-500 € |
| 1.000 € | 200-500 | 10-50 | 20-100 € | 2-17 | 60-500 € |

Lectura provisional: con 300 €/mes la muestra no da para decidir nada (1-5 reuniones); el mínimo útil es 500 €/mes durante 8 semanas, y solo si el volumen de búsqueda de §2 permite gastarlos (riesgo real: que no haya suficientes búsquedas S en España para gastar 17 €/día sin abrir a términos I).

## 6 · Requisitos técnicos antes de gastar

1. Etiqueta de conversión de Google Ads (`AW-…`) en la landing, disparada al enviar el paso 2 y al reservar, bajo el Consent Mode ya existente. Growth.
2. Capturar `gclid` (y `gbraid/wbraid`) en la URL y guardarlo en el contacto de GHL, igual que las UTM. Growth.
3. Importar conversiones offline a Google Ads desde GHL: "reunión celebrada" y "cliente", con el `gclid`. Es lo que convierte a Google en una máquina de reuniones y no de formularios. Growth + Paid.
4. Página de destino propia por vertical (formación v2.1 sirve; clínicas no tiene landing nueva todavía).
5. Vinculación GA4 ↔ Google Ads y audiencias de remarketing (visitantes de /formacion/ y /clinicas/ sin lead) para YouTube con los vídeos 3V2.

## 7 · Estructura propuesta (borrador, se cierra el 17-oct)

- Una campaña de búsqueda por vertical, solo términos **S**, concordancia de frase + amplia con techo de CPC, España, español. Grupos: "agencia", "captación", "publicidad". Negativas desde el día 1: gratis, curso, empleo, plantilla, software, cómo.
- Campaña de marca (qualivo) a 1-2 €/día: barata y evita que un competidor compre nuestro nombre.
- YouTube con los 3V2 (Demand Gen) solo en fase 2, si búsqueda demuestra que el mensaje aguanta.
- Puja: maximizar clics con techo las 2 primeras semanas; maximizar conversiones cuando haya 15-20 conversiones.

## 8 · Fecha de muerte

Si arranca el 3-nov: lectura el 1-dic (4 semanas) y decisión el 15-dic (6 semanas). Muere si en 6 semanas no hay ≥ 3 reuniones celebradas atribuidas a Google o el coste por reunión supera 2× el de Meta.

## 9 · Lo que necesito de Maikel

- La exportación del Planificador (opción A) o los secretos del conector (opción B). Sin uno de los dos, el estudio se entrega con estimaciones y lo digo así.
- OK para que Growth meta la etiqueta de conversión y el gclid en la landing cuando toque (no antes del 20-oct, para no pisar el test de la landing).
