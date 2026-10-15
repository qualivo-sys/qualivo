# Montaje · conjunto horizontal "Ya inviertes y no cierran" → formulario HZ_demo (15-oct-2026, en PAUSADO)

Orden de Maikel (15-oct): "dale caña, ponle 20 €"; "dejémoslo unos días": los dos nativos (clínicas VIEJO 15, formación 3V2 15) siguen activos; el horizontal entra a 20 €/día cuando Maikel active. Total previsto 50 €/día.

| Capa | Id | Config |
|---|---|---|
| Formulario nativo | 1593733452501786 `Qualivo_HZ_demo` | es_ES, mayor intención. Preguntas: `inversion` (todavia_no / menos_500 / 500_1000 / 1000_3000 / mas_3000), `atiende` (yo / 1_2 / equipo), `sector` (formacion / clinica / reformas / inmobiliaria / otro), `volumen` (menos_20 / 20_50 / 50_100 / mas_100), `momento` (este_mes / 1_3_meses / mas_adelante) + nombre, empresa, email, teléfono. Tarjeta "Ya inviertes en anuncios. ¿Y después del clic?". Gracias: "Hecho. Te escribo en unos minutos" + botón a `/gracias/?utm_content=hz-demo`. Sin precio. |
| Vídeos | 45: 2219075615622180 · 916: 1748466139602098 | QV_HZ_ya-inviertes v6 de Creative, 58 s; miniaturas de Creative (hashes 7eed6e75… / 87616aa9…) |
| Conjunto | 120246104601970358 "HZ · ya inviertes · demo · 20 €/día" | PAUSED · 20 €/día · QUALITY_LEAD · destino formulario · público idéntico al 3V2 (ES 25-65, Advantage+ audience, 3 exclusiones, feed + stories FB/IG) |
| Creativo | 1654512026289793 | asset_feed_spec: v45 feed / v916 stories, texto principal y titular "¿Tus comerciales dicen que los leads no valen?", descripción "Demo personalizada · Sin compromiso", CTA "Más información" → formulario HZ_demo, mejoras automáticas en OPT_OUT, sin precio |
| Anuncio | 120246104605680358 "AD · HZ · ya inviertes · demo" | PAUSED, en revisión · vista previa https://fb.me/1WBJkwpLXxUxiOM |

Nada activo ha cambiado: clínicas VIEJO y formación 3V2 nativo siguen a 15; landing sigue pausada.

## Antes de activar
1. **Growth**: el webhook debe reconocer el formulario nuevo (claves `inversion` + `atiende`) y aplicar la regla de encaje: B = inversión ≥ 1.000 y atiende ≠ yo; medio = 500-1.000, o ≥ 1.000 atendido por él solo; C = todavia_no o menos_500 (sin agenda, recurso y nurturing). Etiquetas `inv2-*`, `atiende-*`, `sector-*`, `vol-*`, `momento-*`, `funnel-hz`. Si Maikel activa antes, los leads entran sin encaje y hay que clasificarlos a mano.
2. **Ops**: qué es la "demo personalizada" y quién la hace; el WhatsApp de confirmación pide la web.
3. **Paid**: aprobación del anuncio por Meta (en revisión).

## Lectura
Muere a 150 € o 10 leads. Gana si ≥ 40 % de leads B (inversión ≥ 1.000 y alguien atiende) con coste por cita ≤ 60 €, aunque el CPL doble al vertical; a 3 semanas, coste por reunión celebrada frente a 118 €. CTR más bajo que el vertical es esperado, no fallo.
