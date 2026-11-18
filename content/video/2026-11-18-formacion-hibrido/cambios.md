# Formación V2 · híbrido — montaje para revisión y qué cambia frente al corte 14A

18-nov-2026 · Creative. **Sin publicar; sin cambios en Meta.** El anuncio activo sigue siendo el corte 14A, que queda como referencia. Este híbrido es una hipótesis creativa nueva (cambian gancho, desarrollo y cierre), no una prueba aislada del gancho.

| Formato | Archivo | Duración |
|---|---|---|
| 9:16 | `formacion-v2-hibrido-916.mp4` | 48,8 s |
| 4:5 | `formacion-v2-hibrido-45.mp4` | 48,8 s |

## Recorrido final

| Tiempo | Reloj | Pantalla | Voz |
|---|---|---|---|
| 0–3,7 | — | Lista de solicitudes: entra una nueva; otra pasa a «Sin respuesta · 3 días» | Tu academia puede estar perdiendo matrículas sin saberlo. |
| 3,7–6,7 | — | Galería de anuncios de Escuela Norte | En Qualivo nos encargamos de la captación. |
| 6,7–12,7 | 00:00 | Landing; el formulario se rellena y se envía | Pero conseguir el contacto es solo el principio. Laura pide información. |
| 12,7–14,8 | 00:00 | El formulario se convierte en la fila de Laura en el CRM | Su solicitud entra al momento, |
| 14,8–18,3 | 00:00 | «Instagram · viene de este anuncio» y el curso que le interesa | con el anuncio del que viene y el curso que le interesa. |
| 18,3–20,8 | +2 min | WhatsApp, marcado «Envío automático» | En pocos minutos recibe un WhatsApp, |
| 20,8–23,0 | +2 min | Laura contesta con una duda | y Laura responde. |
| 23,0–29,7 | +1 día | Llamada de Raquel a pantalla completa, con «La activa tu equipo» | Si hace falta, tu equipo activa una llamada. · Raquel: «Hola, Laura, soy Raquel, de Escuela Norte.» |
| 29,7–34,3 | +3 días | Tarjeta «Volver a contactar en 6 semanas» | Si todavía no reserva, queda apuntado qué hacer y cuándo volver a contactar. |
| 34,3–41,4 | +6 semanas | Lista de oportunidades: etapa, prioridad y siguiente acción | Así tu equipo sabe qué oportunidades avanzan y cuáles necesitan atención. Gestionamos la captación |
| 41,4–48,8 | — | Botón de diagnóstico, «Para academias y centros de formación», logo | y mejoramos el seguimiento contigo, mes a mes. Solicita tu diagnóstico gratuito. |

## Qué cambia frente al corte 14A

| Elemento | Corte 14A | Híbrido |
|---|---|---|
| Gancho | Texto grande sobre el anuncio: «Tu academia consigue solicitudes. ¿Pero cuántas acaban en matrícula?» | Lista de solicitudes sin responder, en movimiento; «…perdiendo matrículas sin saberlo» |
| Reloj | Pequeño, en la cabecera | Grande junto al rótulo, solo tiempos relativos: 00:00, +2 min, +1 día, +3 días, +6 semanas |
| Origen y curso | Al final, tras la reserva | Al entrar la solicitud |
| Laura | No responde al WhatsApp | Responde con una duda (pantalla real de la demo) |
| Llamada | Ficha del CRM con la llamada anotada | Pantalla completa de la llamada, con «La activa tu equipo» |
| Seguimiento | «Retomar en enero» | «Volver a contactar en 6 semanas» |
| Final de la historia | Reserva de plaza y origen | Lista de oportunidades por etapa; sin reserva ni matrícula |
| Cierre | 7,3 s | 7,4 s |
| Duración | 45,0 s | 48,8 s |
| Locución | Tomas u1 y u2 | Tomas nuevas h1 y h2, misma voz y velocidad |

No cambian: estética, galería y landing de Escuela Norte, voz de Raquel, música, botón y texto del cierre.

## Decisiones aplicadas y lo que queda abierto

- **Curso: se mantiene «Administración y Finanzas» en todas las pantallas.** Growth no ha podido confirmar el cambio a Marketing Digital (su sesión está a la espera de una aprobación), y las pantallas del CRM y del WhatsApp son capturas de la demo. Si Growth cambia la demo, se sustituyen las capturas, el anuncio y la landing sin tocar el montaje.
- **Escena de oportunidades:** es la vista real «Oportunidades» de la demo. La primera mitad (nombres y etapas) se lee justa en móvil; la segunda (prioridad y siguiente acción) se lee bien.
- **Tarjeta de seguimiento y pantalla de la llamada:** son rótulos del vídeo, no capturas. Representan la etapa, el aviso al equipo y la llamada de Raquel; no muestran ningún mensaje automático.
- **Llamada de Raquel: sigue sin una prueba reciente.** Hay que hacerla antes de lanzar.
- **Cierre:** 7,4 s. Para bajarlo a 6 habría que cortar «mes a mes» de la locución.
- Medido: ningún silencio de más de 0,6 s; toma 1, -15,1 LUFS; Raquel, -15,2; toma 2, -15,1. **No he escuchado el resultado** (no puedo oír audio): la escucha queda para una persona.

Regenerar: `python3 audio.py` y `node render.js "ver=corta&ap=hy&fmt=916|45" <dir>`.

## Ajustes finales (18-nov, tras la revisión visual de Maikel)

Mismos archivos, misma locución y misma duración (48,8 s). Lo anterior de este documento queda corregido en estos puntos:

1. **Curso: Marketing Digital.** Anuncio, galería y landing de Escuela Norte rehechos («Marketing Digital por las tardes», temario de marketing, paleta nueva sin el azul y amarillo de FP; fuentes en `captacion/`). La tarjeta de origen dice «Curso de Marketing Digital». Las capturas de la demo (WhatsApp y CRM) dicen «Curso de tarde», que encaja. No se ha tocado la demo.
2. **WhatsApp.** Un solo mensaje protagonista por plano, ampliado; el resto de la conversación queda atenuado.
3. **De +3 días a +6 semanas.** La pantalla final muestra a Laura en «Necesitan atención» con «Volver a contactar · hoy», bajo el rótulo «Toca retomarla».
4. **Oportunidades.** Ya no es la captura del listado: son dos bloques, «Avanzan» y «Necesitan atención», que se destacan cuando la voz los nombra. Es un rótulo que resume la vista real «Oportunidades» (prioridad y siguiente acción); los datos son simulados.
5. **Zonas seguras (9:16).** Todo el contenido queda entre y = 268 y y ≈ 1.450 de 1.920: fuera del 14 % superior y del 20 % inferior. La guía más conservadora de Meta para Reels reserva el 35 % inferior (desde y = 1.248); los subtítulos (1.322-1.450) quedan dentro de esa franja. El botón del cierre está en 770-930.
6. **Llamada de Raquel: no verificada y hoy no operativa.** Growth informa de que la llamada del agente de voz falla desde el 13-nov (línea SIP). La escena se mantiene con «La activa tu equipo», pero esta versión no debe lanzarse hasta que la llamada funcione y se haga la prueba.
