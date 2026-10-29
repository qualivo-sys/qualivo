# Al Milímetro · ficha de montaje en GoHighLevel

Para montar la subcuenta de Sonia en la interfaz de GHL. Los textos de cada mensaje están en `mensajes.md` (W1-W12, E1-E4). El formulario los dispara con **etiquetas** que pone `api/al-milimetro-lead.js` (rama `claude/al-milimetro-landing-v2-site`).

**Hasta el OK de Sonia (viernes 30, 10:15):** todos los flujos llevan como primera condición «tiene la etiqueta `am-prueba`». Al dar el OK se quita esa condición y se pone `AM_SOLO_PRUEBA=0` en Vercel.

## 0. Subcuenta

| Qué | Valor |
| --- | --- |
| Nombre | Al Milímetro Reformas |
| Zona horaria | Europe/Madrid |
| Horario de la empresa | Lunes a jueves de 9:00 a 19:00 · viernes de 9:00 a 15:00 |
| Usuario | Sonia (administradora; app LeadConnector en su móvil para las notificaciones) |
| Token privado | Ajustes → Integraciones privadas → permisos: contacts (lectura y escritura), opportunities (lectura y escritura), locations/customFields (lectura y escritura). Va a Vercel como `AM_GHL_API_KEY`. |

## 1. Campos personalizados

Los crea el script: `AM_GHL_API_KEY=… AM_GHL_LOCATION_ID=… node scripts/al-milimetro/ghl-preparar.js --aplicar`. Sin `--aplicar` solo enseña lo que haría.

Son 15 campos `am_*`: tipo de obra, obra en texto, código postal, municipio, metros, cuándo, presupuesto, vivienda propia, clase, puntos, origen, segundas preguntas, precio «desde», instalaciones y qué quiere cambiar. **Las opciones de los desplegables tienen que coincidir letra a letra con `api/_am-modelo.js`.** Si GHL acepta un valor que no está en el desplegable, ninguna lista ni ningún flujo lo ve (nos pasó en EAC).

## 2. Pipeline «Al Milímetro · Reformas»

Se crea a mano (la API no crea pipelines), con estas etapas en este orden y escritas exactamente así:

`Nuevo` → `Contactado` → `Visita técnica` → `Presupuesto enviado` → `Seguimiento` → `Firmado` → `Perdido`

Después, el script anterior comprueba que están las 7.

## 3. Etiquetas que pone el formulario

| Etiqueta | Cuándo |
| --- | --- |
| `am-lead` | Siempre que entra un contacto que encaja |
| `am-a` / `am-b` / `am-c` | Según la puntuación (A ≥ 70 · B 45-69 · C < 45) |
| `am-revision` | Por debajo de 15.000 € o dudoso: va por segundas preguntas |
| `am-origen-pared` · `-chalet` · `-precio` · `-portal` · `-web` | El anuncio del que viene (`?a=` de la landing) |
| `am-prueba` | El nombre lleva «PRUEBA QUALIVO» |

Los descartados (local, arreglos, baño o cocina sueltos, sur, solo acabados) **no llegan a GHL**.

## 4. Flujos

Ajustes comunes a todos los flujos:
- **«Detener al responder»** activado: si el contacto contesta por WhatsApp o email, sale del flujo.
- **Esperas con ventana horaria:** cada espera que acaba en un envío lleva «reanudar solo dentro de la ventana» de lunes a jueves de 9:00 a 19:00 y viernes de 9:00 a 15:00, hora de Madrid.
- **Sin reentrada:** un contacto no entra dos veces en el mismo flujo.

### F1 · Entrada (disparador: se añade la etiqueta `am-lead`)

1. Si NO tiene `am-prueba` → fin (solo hasta el OK de Sonia).
2. **Si `am-revision`:** WhatsApp W3 (segundas preguntas) + email E1 → mover la oportunidad a «Nuevo» → fin. Sonia decide a mano.
3. **Si está en horario:** WhatsApp W1. **Si no:** WhatsApp W2, con {{3}} = «mañana por la mañana» (de lunes a jueves) o «el lunes por la mañana» (viernes desde las 15:00 y fin de semana).
4. Email E1 (sale a cualquier hora).
5. **Si `am-a`:** aviso a Sonia (notificación interna por la app y WhatsApp a su móvil personal con la plantilla de «contacto A nuevo»). Crear la tarea «Llamar hoy a {{nombre}}» con vencimiento hoy.
6. Añadir la etiqueta `am-seq-antes` (arranca F2).

### F2 · Antes de la visita (disparador: etiqueta `am-seq-antes`)

1. Esperar 2 horas (dentro de la ventana). Si es B: llamada del asistente de voz (fase 2, de momento se salta). Si es A: nada, llama Sonia.
2. Esperar 1 día (dentro de la ventana) → WhatsApp W5.
3. Esperar 2 días más (día 3, dentro de la ventana) → WhatsApp W6 + email E2.
4. Esperar 4 días (día 7) → email E3.
5. Esperar 7 días (día 14) → email E4.
6. Si es C, o contestó «Más adelante»: pasa a la nutrición (un email cada 2 semanas; por escribir).

Sale del flujo al responder (ajuste común) o cuando la oportunidad pasa a «Visita técnica».

### F3 · Visita técnica (disparador: cita creada en el calendario «Visita técnica» de Sonia)

1. Mover la oportunidad a «Visita técnica».
2. WhatsApp W7 (confirmación con día, hora y dirección).
3. Esperar hasta 1 día antes de la cita, a las 10:00 → WhatsApp W8 (recordatorio).
4. Respuesta «Necesito cambiarla» → aviso a Sonia.

### F4 · Presupuesto (disparador: la oportunidad pasa a «Presupuesto enviado»)

1. Esperar 2 días → W9 · 7 días → W10 · 14 días → W11 · 21 días → W12. Todos dentro de la ventana.
2. Después de W12 sin respuesta → mover a «Perdido» con el motivo «sin respuesta» y crear la tarea para Sonia: «Apuntar el motivo».

Al moverla a «Presupuesto enviado», el flujo le crea a Sonia una tarea con el borrador del seguimiento para que lo valide. Ella quiere que todo cambio de presupuesto quede por escrito.

### F5 · Resumen diario (programado: de lunes a viernes a las 9:00)

WhatsApp a Sonia: contactos que entraron ayer (A y B), visitas de hoy y presupuestos por enviar. Si GHL no deja montarlo con su lógica, lo envía una función de Vercel que lea la subcuenta, como `api/intelligence-almilimetro.js`.

## 5. WhatsApp

- **Integración de WhatsApp de GHL** en la subcuenta con el número nuevo de prepago de Sonia. Lo verifica con el código que le llega por SMS. Necesita el portfolio de Meta del negocio (guion del 29-oct).
- **Plantillas:** las 12 de `mensajes.md` (nombres `am_*`), enviadas a aprobar a Meta desde GHL. Tarda entre unas horas y un par de días.
- Mientras no estén aprobadas: los flujos se prueban con el email y con WhatsApp al número de prueba de Qualivo, dentro de la ventana de 24 horas.

## 6. Prueba de punta a punta (lead «PRUEBA QUALIVO»)

Con datos internos de Qualivo, nunca de terceros:

1. En la preview de Vercel, landing v2 con `?a=pared` → formulario completo con nombre «PRUEBA QUALIVO Laura», teléfono y email de Qualivo.
2. Comprobar en GHL: contacto con los 15 campos rellenos, etiquetas `am-lead am-a am-origen-pared am-prueba`, oportunidad «[PRUEBA] …» en «Nuevo» y nota.
3. Comprobar que llegan W1 o W2, E1 y el aviso de contacto A.
4. Repetir con un descarte (local) y comprobar que en GHL no aparece nada.
5. Repetir con menos de 15.000 € y comprobar que lleva `am-revision` y recibe W3.
6. Abrir Intelligence con `?cuenta=almilimetro` y ver el contacto de prueba.
7. Borrar los contactos de prueba de GHL cuando Maikel dé el visto bueno.
