# Formación V3 · storyboard y prueba de montaje (23-nov)

- **Encargo:** de Maikel, 23-nov. Tercer anuncio de formación: 70 % del antiguo, 30 % del definitivo. 45-50 s.
- **Estado:** storyboard y prueba de montaje. No es exportación definitiva. No se publica sin revisión y aprobación; el anuncio antiguo sigue activo.
- **Idea única:** cuando alguien pide información sobre un curso, hay un sistema que se encarga de que esa oportunidad no se pierda.

## De dónde sale cada cosa

| | Origen |
|---|---|
| Estilo, colores, tipografías, móvil, ficha, reloj, rótulo inferior | Anuncio antiguo (`../2026-09-17-sistema/escena-formacion*.html`), sin cambios |
| Laura como hilo de principio a fin | Anuncio antiguo |
| Voz (Javier Rojas) y música | Anuncio antiguo |
| Hablar a escuelas online que captan con anuncios | Definitivo |
| Curso «Marketing Digital por las tardes» | Definitivo |
| Etapas reales del pipeline y «Nivel A» | Definitivo (validadas por Growth el 19-nov) |
| Atribución: de qué anuncio viene cada oportunidad | Definitivo, sin cifras |

## Guion y escenas (versión A, 45 s)

| Tiempo | Voz | Pantalla |
|---|---|---|
| 0-6 | «¿Tienes una escuela online? Mira qué pasa cuando alguien pide información sobre uno de tus cursos.» | El CRM ya está en pantalla y la solicitud de Laura entra desde el primer fotograma. Titular: «¿Tienes una escuela online?» |
| 6-12,3 | «Laura ha llegado desde un anuncio. Sabemos qué curso le interesa y de qué campaña viene.» | Anuncio de Instagram con lo que escribe Laura → su ficha: curso, horario, origen y campaña. |
| 12,3-19,8 | «El sistema le responde por WhatsApp en minutos y, con lo que contesta, sabemos qué necesita.» | Conversación de WhatsApp: dos preguntas y dos respuestas. |
| 19,8-27 | «Si necesita hablar con alguien, el equipo sabe cuándo intervenir. Y si no responde, el seguimiento no se pierde.» | Ficha de Laura: Nivel A, aviso al equipo, tarea «Llamar hoy», WhatsApp al día siguiente y otro a los 3 días. |
| 27-34,8 | «Así ves qué solicitudes avanzan, cuáles necesitan seguimiento y qué anuncios generan oportunidades.» | Pipeline con las tres etapas; la tarjeta de Laura avanza. Debajo, de qué anuncio viene. |
| 34,8-45 | «En Qualivo conectamos captación, seguimiento y ventas. Si quieres mejorar cómo captas alumnos, solicita un diagnóstico gratuito.» | Logo, «Conectamos captación, seguimiento y ventas», botón «Solicita tu diagnóstico gratuito», «Para escuelas de formación online». |

## Versión B · con la apertura original, como referencia

Los primeros 5,68 s son los del anuncio antiguo, sin tocar (tarjeta «¿Qué pasa con un alumno cuando pide información?» y su voz). Después entra el mismo cuerpo de la versión A. Sirve para comparar aperturas con el resto igual. Esa tarjeta original dice «academia» y «siete agentes».

## Qué se ha quitado

- Del definitivo: la introducción de leads perdidos, el formulario paso a paso, la suma de puntos y el resumen por anuncio con cifras.
- Del antiguo: los nombres de los siete agentes, la llamada de Raquel, la reactivación a 30 días, el informe de la mañana con cifras, el mapa de agentes y la prioridad «88 / 100».
- No hay ninguna cifra de resultados.

## Pendiente de confirmar antes de una versión final

1. **WhatsApp.** La pantalla enseña al sistema haciendo dos preguntas seguidas por WhatsApp. Growth confirmó el 19-nov que el primer WhatsApp es automático; no ha confirmado que el sistema siga la conversación solo. La voz dice «le responde por WhatsApp en minutos y, con lo que contesta, sabemos qué necesita», y no «resuelve sus primeras dudas», por ese motivo.
2. **Llamada.** No aparece: la línea de voz seguía caída en el último dato de Growth.
3. **Etiqueta «Caso de ejemplo · Escuela Norte».** Se mantiene como en el antiguo.
4. **Audio.** Nadie ha escuchado la mezcla.

## Archivos

- `formacion-v3-prueba-A-916.mp4` y `-45.mp4`: apertura nueva.
- `formacion-v3-prueba-B-916.mp4` y `-45.mp4`: apertura original.
- `hacer_escena.py` genera `escena-v3.html` y `escena-v3-45.html`; `montar.py` monta las cuatro piezas; `guion.json` y `voz/` tienen la locución.
