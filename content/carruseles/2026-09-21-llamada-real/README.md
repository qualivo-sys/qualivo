# Carrusel · «Esto es lo que pasa cuando alguien pide el diagnóstico» (21 sep 2026)

Seis láminas 1080 × 1350 en el formato de simulación de pantalla que Maikel
aprobó el 14-sep. Serie **Construyendo Qualivo**. Enseña el sistema funcionando
con una llamada real del lunes 21 (la cita de las 10:30): el WhatsApp que recibe
el cliente, la transcripción de la llamada, la nota que queda en el CRM, lo que
no salió bien y el remate.

**Datos.** Todos reales: los textos del sistema son los de `api/_mensajes.js` y
`api/vapi-fin.js`; la llamada está en la base «📞 Llamadas de Raquel» de
Notion. **No aparece el nombre, la empresa ni el teléfono del cliente**: solo el
sector, el tamaño y sus dos respuestas («por recomendación», «va saliendo»).
El nombre va tapado con una barra en las láminas 2 y 3.

**Uso.** Instagram (carrusel) y LinkedIn (documento). Sirve para Instagram y
LinkedIn con las mismas láminas. CTA de conversación. **NO PUBLICAR**: pausa
vigente.

**Pendiente de Maikel.** Aunque no hay nombre, el cliente podría reconocer su
propia llamada. Recomiendo publicarla igual (no hay dato que lo identifique y
las frases son genéricas), pero es su decisión.

Regenerar: `./render.sh` (sin Playwright; usa el headless shell del entorno).
