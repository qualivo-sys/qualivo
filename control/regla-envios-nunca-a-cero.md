# Regla: los envíos no se paran nunca

Maikel, 14-oct-2026: «nunca se pueden pausar los envíos».

Esto es una regla, no una preferencia, y corrige una decisión mía del 23-sep.

## Qué hice mal

El 23-sep pausé ocho campañas en una mañana: seis puertas de señal por no llegar
al 2% de respuestas y dos por rebote. Los envíos cayeron de 383 a 59 ese día.
Cada pausa, por separado, estaba justificada por la regla de la puerta. El fallo
fue no poner nada en su sitio: tres semanas después el outbound de Qualivo
enviaba 1 correo al día.

Cerrar una puerta que no convierte sigue estando bien. Lo que no se puede es
cerrarla y dejar el tubo vacío.

## La regla

1. **Una puerta no se cierra hasta que su recambio está cargado y enviando.**
   La decisión de cerrar y la decisión de reponer son la misma decisión, y se
   toman juntas.
2. **El depósito de las campañas activas nunca baja de 3 días de envío.**
   Con los topes actuales (60 leads/día por campaña, ~250 correos/día de
   capacidad limpia) eso son unos 180 leads sin empezar como suelo.
3. **Si el depósito va a tocar suelo, eso no es una línea del informe: es lo
   primero que se hace ese día**, por delante de cualquier análisis.
4. **Pausar una campaña para proteger entregabilidad sí vale** (rebote alto,
   buzón en lista negra, queja). Esa es una emergencia técnica, no una decisión
   de rendimiento, y se repone igual en cuanto se arregla.
5. **Nunca se despausa una campaña con leads a medias para recuperar volumen.**
   Reanudar reinicia secuencias y reenvía a quien ya recibió. El volumen se
   recupera cargando leads nuevos en las campañas vivas, nunca resucitando las
   muertas. Lo vigila `captacion/scripts/guardia_reenvios.py`.

## Por qué el informe diario no lo vio venir

Durante seis semanas el informe contó el depósito solo de las campañas activas,
así que mientras se vaciaban decía «depósito 0» sin que eso disparara nada, y a
la vez había 1.778 leads cargados en campañas pausadas que nadie veía. Las dos
mitades del problema estaban ocultas al mismo tiempo.

Corregido el 14-oct: el informe cuenta el depósito de todas las campañas, separa
activas de pausadas, y la sección de bloqueos va siempre.
