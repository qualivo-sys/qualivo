# Formación V5 · guion y prueba de los primeros segundos (23-nov)

- **Encargo:** de Maikel, 23-nov. Evolución de la V4: mismo estilo y la historia de Laura, con gancho nuevo que identifica a escuelas online que ya invierten en publicidad y con el cierre del ciclo (ventas → Meta) como diferencial. 55-62 s.
- **Qué se entrega ahora:** este guion y el montaje de los primeros 14 s (`formacion-v5-inicio-916.mp4`). No se produce ni se publica una versión completa hasta que Maikel apruebe el arranque y la escena de voz.
- **Control:** el anuncio antiguo con el formulario de cualificación sigue activo.

## Decisión de Maikel (23-nov)

- Aprobado el arranque de los primeros 14 s.
- Montar la V5 completa con la escena del agente de voz, que debe oírse.
- La escena queda preparada con el audio marcado como provisional; no se finge una llamada real.
- No se publica hasta incorporar y verificar la llamada funcional, y hasta corregir las señales de cualificación que se envían a Meta.
- Growth: revisar Twilio, hacer una llamada de prueba y pasar la grabación.

## Guion (57 s)

| Tiempo | Voz | Pantalla |
|---|---|---|
| 0-5,3 | «¿Tu escuela online ya invierte en anuncios? Mira todo lo que pasa cuando alguien pide información.» | Fotograma 0: la pregunta en grande y el CRM. La solicitud de Laura cae a los 0,1 s y el sistema reacciona solo: origen, nivel y WhatsApp enviado. |
| 5,3-13,6 | «Laura llega desde una campaña de Meta, pasa por la landing y rellena el formulario. Ya sabemos de qué anuncio viene y qué curso le interesa.» | Campaña → landing → formulario, encadenados, y la ficha de Laura con su origen y «Nivel A». |
| 13,6-19,6 | «Recibe un WhatsApp al momento: el sistema resuelve sus dudas, la cualifica y mueve su etapa.» | Conversación de WhatsApp y el rótulo «Etapa: conversación abierta». |
| 19,6-31 | «¿No responde? A las dos horas la llama nuestro agente de voz.» Después, 7 s reservados para la llamada. **Audio provisional:** la frase antigua de Raquel, «Hola Laura, soy Raquel, de Escuela Norte. ¿Te viene bien el jueves a las cinco para una llamada de diez minutos?». | Sello «Laura no responde», pantalla de llamada «Raquel · agente de voz», subtítulo palabra a palabra, música baja. En pantalla, el aviso «Audio provisional · pendiente de la llamada real». |
| 31-39,3 | «Cuando agenda, el sistema confirma la cita, le recuerda la reunión y actualiza el pipeline. Si no puede, la cambia ella misma.» | Cita «Jueves 17:00» y cuatro líneas: confirmada por WhatsApp, recordatorios, pipeline y cambio de cita. |
| 39,3-47,6 | «La reunión se celebra y el equipo la marca como cualificada. Esa señal vuelve a Meta, para que las campañas busquen más contactos como Laura.» | «Reunión celebrada · Cualificada ✓» y la señal que sube hasta la campaña que la trajo. |
| 47,6-57 | «En Qualivo conectamos captación, seguimiento y datos para ayudarte a conseguir más matrículas. Solicita un diagnóstico gratuito.» | «Esto es Qualivo» con las tres piezas; después logo, «Más matrículas, con todo conectado» y el botón. |

## Qué falta para poder publicarla

1. **La llamada real.** Sustituir el audio provisional por la grabación de la prueba de Growth, con la respuesta de Laura, y quitar el aviso de pantalla. La línea no funciona desde el 13-nov.
2. **Las señales a Meta.** Hoy sale una señal al agendar y otra de «cualificada» al pasar a oferta aunque no encaje (dato de Growth). El vídeo enseña solo la señal tras reunión celebrada y cualificada.
3. **Subtítulos de toda la locución.** La prueba lleva los titulares de cada escena y el subtítulo de la llamada.
4. **Formato 4:5** y escucha de la mezcla (voz un 8 % más rápida, efectos sintetizados).

## Ajustes ya hechos por los hechos que confirmó Growth

- «Intelligence» es el panel de métricas; las fichas y el pipeline son el CRM, y así se llaman en pantalla.
- Google Ads no es lo que se vende hoy en formación: el recorrido dice solo Meta.
- WhatsApp: el sistema contesta solo, resuelve dudas, cualifica y agenda; pasa a una persona el precio y lo delicado.
- El reloj de la llamada dice «+2 h»: es la condición configurada (sin respuesta a las 2 h, salvo nivel D, en horario).

## Archivos

- `formacion-v5-inicio-916.mp4`: arranque aprobado.
- `formacion-v5-prueba-916.mp4`: prueba completa.
- `hacer_escena.py` y `montar.py`; `guion.json` y `voz/` (incluye `r.mp3`, el recorte provisional de Raquel).
