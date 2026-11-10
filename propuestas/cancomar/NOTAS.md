# Cancomar · notas de la presentación (reunión mar 10-nov, 10:00)

## URLs
- Presentación: https://qualivo.io/propuestas/cancomar/presentacion/
- Raíz (redirige a la presentación): https://qualivo.io/propuestas/cancomar/
- Landing A · renovación (particular con urgencia): https://qualivo.io/propuestas/cancomar/landing-a/
- Landing B · empresas y flotas: https://qualivo.io/propuestas/cancomar/landing-b/
- Demo Intelligence (botón en la pantalla 15): https://qualivo.io/intelligence/?sector=maritima&empresa=Cancomar&objetivo=seguimiento

Se avanza con flechas, AvPág o espacio; Inicio y Fin saltan al principio y al final. Abajo a la derecha hay un contador (n / 16).

## Orden de pantallas (16)
1. Portada: «Qualivo × Cancomar · Nadie sin respuesta, aunque escriba desde alta mar», con las 3 fases.
2. Qué hacemos: 5 pasos, con el CRM y el panel debajo.
3. Alumno ideal: petición cualificada frente a «todavía no» («Lo validamos hoy»).
4. Hoy frente a con Qualivo, por fases: 1 Orden y respuesta · 2 Base de datos · 3 Captación.
5. Fase 2 · Base de datos: avisos de renovación a 5 años, lista de espera por curso y búsqueda por titulación (puente con empresas).
6. Anuncio A · Renovación: «¿Tu certificado caduca en 2027?» → landing A.
7. Anuncio B · Urgencia de embarque: «Te sale embarque y te falta el curso» → WhatsApp.
8. Anuncio C · Empresas y flotas: «¿Sabes cuándo caduca cada certificado de tu tripulación?» → landing B.
9. Anuncio D · Convocatoria: «Patrón Local de Pesca: empieza el 11 de enero» (fecha pública de su web).
10. Landings A y B lado a lado: qué cambia entre una y otra, con botones a las dos maquetas navegables.
11. Formulario de 5 preguntas y regla A / B / C / Empresa.
12. Recorrido: chat de WhatsApp (el sistema prepara, admisiones aprueba) y línea de tiempo: minuto 0, minuto 2, recordatorios, D+1, D+3, D+7, plaza y +5 años, con quién hace cada cosa (sistema o persona).
13. CRM: pipeline con sus 7 etapas (Petición nueva · Contactado · Esperando fecha / lista de espera · Plaza reservada · Matriculado y pagado · Renovación en 5 años · Perdido).
14. Ficha de un lead de ejemplo: datos, respuestas, titulaciones, historial y próxima acción.
15. Intelligence: 3 maquetas (Esta mañana, Convocatorias y Renovaciones) y botón a la demo en directo.
16. Siguiente paso: «Solo arranque» (RECOMENDADA, 1.200 € pago único, 30 días) junto a «Mensualidad» (1.000 €/mes, 3 meses). Arranque el lunes 16-nov, entrega el viernes 11-dic y calendario de 4 semanas. Las condiciones de pago no aparecen.

## Fuentes y reglas aplicadas
- Logo, fotos, colores (#0097DA, #00476B), tipografía (Montserrat y Open Sans) y nombres y fechas de cursos: sacados de cancomar.es el 10-nov. Las fotos están en `assets/brand/`.
- No se ha generado ninguna imagen con IA. Las maquetas de anuncios, CRM y paneles están hechas en HTML/CSS.
- Todas las personas y cifras van rotuladas como «Datos de ejemplo». No hay nombres reales de la empresa (tampoco los de las reseñas de su web), ni teléfonos, ni emails, ni citas de la primera reunión.
- `noindex,nofollow,noarchive` en las 4 páginas.
- Comprobado con Playwright: sin scroll horizontal a 390 y a 1440 px en la presentación y en las dos landings. A 1440×900 cada pantalla cabe sin scroll. Los formularios de las landings funcionan de principio a fin y muestran la clasificación A/B/C que vería admisiones.

## Qué no dio tiempo / para revisar
- No hay subpágina propia para el anuncio D (lleva a la «página del curso»). Si hace falta, se puede reutilizar la landing A.
- Las fechas de cursos de la landing A y del anuncio D son las publicadas el 10-nov: conviene revisarlas si cambian.
- El sector `intelligence/sectores/maritima.js` ya existía en el repo y no lo he tocado. Conviene abrir la demo una vez antes de la reunión para ver que los cursos que salen encajan con Cancomar.
- Los textos de los anuncios y de WhatsApp son propuestas. Que Maikel compruebe el tono y que «Patrón Local de Pesca» y «Formación Sanitaria» encajan con su público.
- No hay commit ni push (lo hace el agente principal).
