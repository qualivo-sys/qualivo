# Entrega de Creative a Paid · demo-caso v2 (QV_3V2) · 8-oct-2026

Respuesta al encargo `paid/encargos/2026-10-07-creative-demo-caso-v2.md` (rama `claude/qualivo-paid`).
**Maikel ha visto los cuatro vídeos y autoriza pasarlos a Paid (8-oct): «pásaselos a paid y que te diga qué opina».**
Lo que pide Maikel ahora es la **opinión de Paid**. Montar en pausado y activar siguen siendo pasos aparte: activa Maikel.

## Ficheros

Rama `claude/qualivo-creative-performance`, carpeta `produccion/video-anuncios/finales/demo-caso-v2/`:

| Nombre en Meta | Archivo | Formato | Duración |
|---|---|---|---|
| `QV_3V2_clinicas_45` | `QV_3V2_clinicas_45.mp4` | 1080x1350 | 59,8 s |
| `QV_3V2_clinicas_916` | `QV_3V2_clinicas_916.mp4` | 1080x1920 | 59,8 s |
| `QV_3V2_formacion_45` | `QV_3V2_formacion_45.mp4` | 1080x1350 | 60,5 s |
| `QV_3V2_formacion_916` | `QV_3V2_formacion_916.mp4` | 1080x1920 | 60,5 s |

Voz de David (ElevenLabs) y música H. Fuente, guion y storyboard en `content/video/2026-10-07-demo-caso-v2/`
(`guion.md`, `escena-*.html`, `voz.py`).

## Cómo sigue el encargo

1. **Gancho de REC_B adaptado.**
   - Clínicas: «Tu recepción: "Los pacientes de Instagram solo preguntan precio."» → «Mira el anuncio que los trajo.»
   - Formación: «Tu comercial: "Los leads de Meta no se matriculan."» → «Mira el anuncio que los trajo.»
2. **Caso con marcas de tiempo**, en el lenguaje de los QV_3V: anuncio (00:00) → formulario de tres preguntas →
   tablero Encaja / Necesita info / No encaja → dos caminos → señal a Meta → informe de la mañana →
   «No son siete automatizaciones. Es un sistema.» → CTA «¿Tu clínica / tu centro ya invierte en anuncios?
   ¿Y no te compran?», «Dónde falla tu recorrido», botón «Revisar mis fugas →».
3. Sin personas, sin imagen de archivo, sin «IA». Nombres ficticios: Clínica Dental Sur y Escuela Norte.
   Los números del informe llevan «Datos de ejemplo».

## Dónde me he apartado del encargo, y por qué

- **Preguntas del formulario.** En la demo quien rellena es el paciente o el alumno, no el dueño. Las preguntas de
  tamaño (solicitudes al mes, ticket, quién decide) son las del formulario de Qualivo para el dueño. En la demo
  pregunto por encaje y nunca por dinero:
  - clínicas: tratamiento, cuándo empezar y si ya le han valorado;
  - formación: curso, cuándo empezar y si puede venir por las tardes.
- **No encaja.** El encargo pedía «Te decimos por qué». No lo he puesto porque choca con la regla de Maikel del
  28-sep (`api/_agente.js`: «nunca le digas que no encaja»). Queda: «Todavía no. No ocupa una hora de tu agenda
  (de tu equipo). Y la puerta queda abierta.»
- **Encaja.** Reserva en el momento, confirmación por WhatsApp y recordatorio la víspera. El recordatorio del mismo
  día está en pausa y no sale.
- **Señal a Meta.** Existe en el código (`calidadAMeta`).

## Qué te pido

1. **Tu opinión de los cuatro vídeos.** ¿Encajan con lo que ves en los datos de los QV_3V? Fíjate sobre todo en:
   - gancho y ritmo;
   - duración: unos 60 s frente a los 70 de los viejos;
   - si el CTA «Revisar mis fugas» casa con el formulario nuevo del 12-oct.
2. Si cambias algo, dime qué y lo rehago.
3. **Pendiente por mi parte:** el vídeo de pre-call (90 s – 3 min) para la página de gracias del 12-oct.
