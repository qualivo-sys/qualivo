# LA MÁQUINA DE CONTENIDO QUALIVO (v1 · 27-ago-2026)

> El sistema operativo semanal. Complementa: sistema-maestro (qué decir),
> estandar-visual (cómo se ve), listado-maestro-busquedas (qué buscan),
> contrabrief (posicionamiento), guia-de-voz (tono).

## Principio: UNA tesis → todas las salidas
Cada semana una tesis central (del audio de Maikel, reuniones, ICP o radar).
Todo lo demás se atomiza de ella o de la biblioteca ya producida. Nunca
alimentar canales por separado.

## LA PARRILLA SEMANAL

| Día | Blog (qualivo.io) | Redes (IG + LinkedIn + TikTok) | Email |
|---|---|---|---|
| Lunes | — | Carrusel A (tesis) | — |
| Martes | Artículo TESIS (del audio de Maikel) | Post texto LinkedIn (la tesis en 150 palabras) | Newsletter corta «tip» (opcional) |
| Miércoles | Artículo SEO (del listado maestro) | Carrusel B (etapa distinta — regla del recorrido) | — |
| Jueves | Artículo CHECKLIST/diagnóstico (reciclado de carrusel) | Post personal/humano (foto real de Maikel: pizarra, reunión, día a día) | — |
| Viernes | Artículo RADAR (del Radar IA diario) | Carrusel C o reciclaje del checklist | Newsletter «La Fuga» |

- **Total semanal**: 4 artículos · 4-5 publicaciones por red · 1-2 newsletters.
- **TikTok**: modo foto con los MISMOS carruseles 4:5 (sin producir vídeo).
- **LinkedIn**: carrusel como documento PDF + su versión en texto.
- **El post humano del jueves es obligatorio**: el radar de cuentas demuestra
  que lo personal rinde más que lo corporativo (caso adboost). Sin producir:
  una foto real + 4 líneas.

## EL FLUJO DE PRODUCCIÓN (quién hace qué)

1. **Viernes**: Claude prepara el paquete de la semana siguiente (4 artículos
   borrador + 3 carruseles + textos LinkedIn + newsletter + captions).
2. **Fin de semana/lunes**: Maikel graba UN audio de 5 min con lo que le ronde
   (= tesis del martes) y aprueba el paquete en bloque (~30 min).
3. **Lunes**: Claude ajusta con el audio y programa todo (GHL para IG/LinkedIn;
   triggers propios para lo que el Social Planner rompa; blog por Vercel).
4. **Diario**: protocolo FUGAS — responder el mismo día; cada objeción/DM se
   apunta como observación en Notion (alimenta tesis futuras).
5. **Mensual**: radar de cuentas (Apify), content gap + GSC (MCP DinoRank),
   auditoría GEO (20 preguntas), minado de comentarios. Nuevo lead magnet
   del mejor contenido del mes.

## PUERTAS DE CALIDAD (innegociables)
- Nada se publica sin el ok de Maikel (paquete del lunes).
- Toda pieza pasa el filtro del sistema maestro (§20/§32) y el estándar visual.
- Cero cifras inventadas; hecho/hipótesis/opinión siempre separados.
- Regla del recorrido: dos piezas seguidas nunca atacan la misma fuga.
- CTA según objetivo; el comercial siempre es la misma puerta: diagnóstico/FUGAS.

## MEDICIÓN (solo 4 números, revisión viernes en Growth Review)
1. Contactos captados (calculadora + diagnóstico + FUGAS + newsletter)
2. Suscriptores newsletter
3. Conversaciones FUGAS abiertas
4. Reuniones generadas
(SEO se mira mensual: GSC vía DinoRank — hoy: 0 keywords, punto de partida.)

## HERRAMIENTAS DE INTELIGENCIA CONECTADAS
- **DinoRank MCP** (api.dinorank.com/mcp · clave en scratchpad/dinorank.env):
  keyword_research, contentgap, searchconsole, visibility, llms.
- **Apify** (clave en scratchpad/apify.env): radar mensual IG/LinkedIn.
- **Autocompletado Google**: barridos de semillas gratis.
- **Radar IA diario** (routine 04:00): alimenta el artículo del viernes.
- **GHL**: publicación IG/LinkedIn, newsletter, CRM del bucle FUGAS.

## ESTADO DE CONSTRUCCIÓN
- [x] Sistema maestro + estándar visual + listado de búsquedas
- [x] Pipeline de carruseles (plantillas en content/carruseles/)
- [x] Blog motor + artículo 1 («le hablas igual a todo el mundo»)
- [ ] Artículos 2-4 de la primera semana
- [ ] /recursos + lead magnet checklist (sin muro)
- [ ] Newsletter «La Fuga» (nombre pendiente de confirmar) + DNS envío
- [ ] Adaptación LinkedIn (PDF) + TikTok (modo foto)
- [ ] Radar de cuentas v1 (en ejecución)
