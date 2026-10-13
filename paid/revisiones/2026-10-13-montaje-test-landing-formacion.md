# Montaje · test anuncio 3V2 formación → landing v2.1 (13-oct-2026, en PAUSADO)

Pedido de Maikel (13-oct): "puedes ir hablando tú con quien toque todo esto e ir montándolo". Construido en pausado; **Maikel activa**.

## Qué hay en Meta (campaña QV_VERTICALES_Sep26 · 120245699223330358)

| Capa | Id | Config |
|---|---|---|
| Conjunto | 120246072734620358 | "formacion · 3V2 → LANDING v21 · 15 €/día · TEST" · PAUSED · 15 €/día · destino WEBSITE · optimización OFFSITE_CONVERSIONS (Lead) · píxel Qualivo Agencia 879197745226987 · atribución 7d clic / 1d vista · público idéntico al 3V2 nativo (ES 25-65, Advantage+ audience, 3 exclusiones, feed + stories FB/IG) |
| Creativo | 968034012409405 | mismos vídeos 3V2 (v45 feed / v916 stories, reglas por ubicación), mismo cuerpo/título/descripción, CTA "Más información", enlace `https://qualivo.io/formacion/v21/?utm_content=formacion-3v2-landing`, url_tags `utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_term={{placement}}&utm_id={{ad.id}}`, todas las mejoras automáticas en OPT_OUT |
| Anuncio | 120246072746040358 | "AD · 3V2 · formacion · demo-caso v2 → LANDING v21" · PAUSED (revisión en curso) · vista previa https://fb.me/23gtc0E6WjfoW21 |

Nada más tocado: formación 3V2 nativo (15 €) y clínicas VIEJO (15 €) siguen activos; tope de campaña 1.405 €.

Nota API: `degrees_of_freedom_spec.standard_enhancements` ya no se acepta (subcode 3858504); hay que pasar la lista de funciones individuales en OPT_OUT (copiada del creativo origen).

## Pendientes antes de activar (enviados a Growth, trigger trig_01LFPrqryEqL4MsFnVs2U6Ly)

1. Confirmar píxel 879197745226987 y evento Lead al enviar el paso 2; event_id común navegador/servidor.
2. Revisar `api/diagnostico.js` y `api/_funnel-v2.js` (tocados por la sesión de landing): lead de landing → GHL con `funnel-v2`, `funnel-v2-landing`, `fit-paid-*` y WA1 real. Envío de prueba desde móvil comprobando status del mensaje.
3. Variante `?paso=agenda`: quitar nombre/email/teléfono de la URL; usar id de contacto GHL o token.
4. PageSpeed móvil en la URL pública.
5. UTM legibles en GHL (utm_term = ubicación, utm_id = id de anuncio).

## Diseño del test

Secuencial, 7 días a 15 €/día, muerte a 150 € u 8 leads. Decide coste por lead tipo B y coste por cita confirmada, en GHL por etiqueta de origen. Referencia: formulario nativo V2b (8-12 oct: 56,52 €, 5 leads, 2 nivel A con cita). Esperable: CPL de landing 35-60 €; gana si el coste por cita no es peor que el nativo.

## Activación (cuando Maikel diga)

Activar conjunto 120246072734620358 y anuncio 120246072746040358. Decidir qué se pausa para mantener los 30 €/día (propuesta Paid: pausar clínicas VIEJO esa semana, o aceptar 45 €/día siete días = +105 €).
