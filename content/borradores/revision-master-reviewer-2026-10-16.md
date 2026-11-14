# Master Reviewer · viernes 16-oct

> Revisión de las piezas del viernes, que cierran la semana 42. Los críticos están aplicados en el commit que sigue a 35da304.

## 1. Re-apunte de `/blog/equipo-comercial-no-usa-el-crm/` · 7/10 · publicar con cambios

**Críticos (aplicados):**
- **Alcance:** «cada contacto **que nos pide información**». La puntuación solo cubre contactos con la etiqueta `paid`.
- **El enlace dice lo que hay en el destino:** «Las preguntas que alimentan la primera nota están en cómo cualificar leads». El lunes, cuando salga el artículo de lead scoring, pasa a enlazar a ese.

**Opcional (aplicado):** el párrafo se parte en dos para el móvil.

## 2. Tesis contraria · 7/10 · publicar con cambios y con el ok de Maikel

**Críticos (aplicados):**
- **Titular:** «El contacto más barato me salió el doble de caro». Ahora sale del dato.
- **Total:** «unos 290 €». Las filas del artículo suman 290,90 € y el artículo dice 291,90 €.

**Opcional (aplicado):** sin «no saco X, saco Y».

## 3. Borrador «Lead scoring con dos notas» · 5/10 · no publicar sin aplicar los críticos (aplicados)

1. **Volumen:** «Menos de 20 = 1» y «No lo dice = 1». Fuera «menos de 5 = 0».
2. **Inversión:** nota sobre el formulario del 15-oct (desde 1.000 € suma 5). Fuera «tal como están en el código».
3. **Sector:** formación, clínicas, reformas o asesorías = 2; otro o no lo dice = 1.
4. «Nos escribe tres mensajes o más».
5. Raquel con su nombre, una sola llamada y en su horario.
6. Se recalcula en cada vuelta del sistema, cada diez minutos.
7. **Qué pasa con la A y la C, como hace el código:**
   - la A, aviso por correo y, a las 2 h 30, aviso a Maikel para llamar;
   - la C, también llamada de Raquel, y antes de la reunión, preguntas.
8. «La B es la que se pierde», sin el «la que más», porque es una comparación sin dato.
9. **Paso 1:** inversión, volumen y sector. El ticket, aparte.
10. **Faltaban la entradilla, el momento propio y el destacado:**
    - el momento propio es el cambio de regla del 28-sep;
    - el destacado: «Una letra sin siguiente paso no sirve de nada».

**Opcionales (aplicados):**
- la fila D completa;
- la fila «no responde tras la secuencia»;
- el H2 sin «en una tarde».

**Antes de publicar el lunes:**
- enlazar desde `/diccionario/lead-scoring/` al artículo;
- re-apuntar `/blog/cualificar-leads/` («una nota» → «dos notas»);
- quitar «scoring de leads» de sus keywords.

## Nota de sistema para Growth

1. **La misma respuesta puntúa distinto según el formulario:**
   - «menos de 20» da 0 en la etiqueta de septiembre y 1 en las nuevas;
   - con 1.500 € al mes, el nativo da 4 y el formulario del 15-oct da 5;
   - los textos de motivo («menos de 5», «5-15») no corresponden a ningún tramo real.
2. **El total de la campaña de septiembre:** las filas suman 290,90 € y en el artículo publicado figura 291,90 € (con una media de 13,90 €). Hay que comprobarlo en Meta y corregir el artículo si hace falta.
3. **Comentarios desfasados en `_scoring.js`:**
   - el de la B («cadencia, reenganche»);
   - el de la pestaña Resumen de la hoja, donde la C es «ticket pequeño».
4. **Las notas solo cubren contactos con la etiqueta `paid`.**
5. **R6 en todo el sitio:** Nuria Roure aparece con cifras en el diccionario y en unas diez páginas, y `content/casos-permisos.md` no tiene ninguna fila. Decisión de Maikel.
