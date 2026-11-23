# Formación · prueba audiovisual de 13 s (23-nov)

- **Encargo:** de Maikel, 23-nov. Cambiar la dirección creativa: lenguaje audiovisual en lugar de presentación animada, con escenas visualmente distintas. Probar con los recursos disponibles.
- **Estado:** prueba interna. No se publica. El anuncio antiguo sigue activo y no se toca.
- **Archivo:** `formacion-prueba-audiovisual-916.mp4` (9:16, 13 s).

## Cuatro planos, cuatro composiciones

| Tiempo | Plano | Voz | Capa gráfica |
|---|---|---|---|
| 0-3 s | Vídeo generado: Laura en el sofá, al atardecer, mirando el móvil; acaba sonriendo. | «¿Tu escuela online ya invierte en publicidad?» | Titular en el tercio inferior, palabra a palabra. |
| 3-5,6 s | Vídeo generado: un móvil sobre un escritorio oscuro se enciende. | «Laura acaba de pedir información.» | La notificación «Nueva solicitud · Laura Vidal» salta desde el móvil. Zumbido y aviso. |
| 5,6-9,4 s | Escena propia: móvil en perspectiva sobre fondo turquesa; la cámara gira y se acerca. | «En segundos, el sistema le responde y la cualifica.» | Conversación de WhatsApp y dos rótulos flotando: «WhatsApp enviado» y «Cualificada · Nivel A». |
| 9,4-13 s | Vídeo generado: asesora de admisiones con auriculares empezando una llamada. | «Y la lleva a una reunión con admisiones.» | Titular arriba y la cita «Jueves 17:00 · Reunión agendada» que golpea. |

## Cómo está hecho

- **Planos de vídeo:** Higgsfield, modelo Seedance 2.5, 720p, 5 s cada uno, sin audio. Las personas son generadas, no reales. Los planos no están en el repo.
- **Capas gráficas:** `capas.html`, renderizada con transparencia (`render_capas.js`) y compuesta sobre los planos (`montar.py`).
- **Voz:** Javier Rojas, a su velocidad normal. **Música:** la del anuncio antiguo. **Efectos:** sintetizados.
- Un destello de dos fotogramas en cada corte.

## Qué falta por decidir

- Si esta dirección (personas y objetos generados + interfaz en perspectiva) es la que se quiere para el vídeo completo.
- La escena del agente de voz y la de la señal a Meta no están en esta prueba.
- Usar personas generadas en un anuncio: conviene decidirlo expresamente.
