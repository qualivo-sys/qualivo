# Sistema de cualificación V2: formulario de Meta y puntuación (borrador para Maikel)

> **Encargo de Maikel (13-nov, a través de Creative):** «No esperaría a tener el anuncio terminado para corregir el formulario de Meta. Son dos líneas de trabajo independientes». Este documento es la línea del formulario.
> **Estado:** borrador. No se crea ni se cambia nada en Meta ni en GHL sin el OK de Maikel en el chat de Paid.
> **Base:** el análisis de las dos semanas (`paid/auditoria/2026-11-13-analisis-dos-semanas.md`) y los 77 leads de Meta desde septiembre [C].

## Qué tiene que arreglar
1. **Leads falsos con nota alta.** Gmail, empresa de una palabra y la opción más alta en todo.
2. **Filtramos por lo que no importa.** La inversión en anuncios dejó fuera a perfiles como Cancomar, que hoy está en negociación por 1.200 € y había marcado «no invierto nada».
3. **No usamos la mejor señal.** El email de empresa avanza un 32 %, frente al 9 % del gratuito.
4. **No empujamos a reservar.** El formulario actual no tiene pantalla final con el botón «Elegir hora».

## 1. El formulario nuevo (formación)

**Ajustes:** pantalla de «mayor intención» activada. Idioma español. Solo se usará en Instagram.

**Portada.** Coherente con el CTA del vídeo V2, «solicita un diagnóstico»:
- **Título:** «Diagnóstico de tu proceso de solicitudes»
- **Puntos:**
  - «Para academias que ya reciben solicitudes cada semana.»
  - «Revisamos qué pasa con cada solicitud desde que entra hasta la matrícula.»
  - «30 minutos con Maikel. Sales con un plan por escrito, lo hagas con nosotros o no.»

**Preguntas (4, todas obligatorias):**
1. **¿Cuántas solicitudes de información recibís al mes?** Menos de 20 · 20-49 · 50-99 · 100 o más.
2. **¿Qué pasa hoy con esas solicitudes?** Esta es la pregunta del dolor; sustituye a la de inversión.
   - Se contestan tarde o se quedan sin respuesta.
   - Se contestan, pero nadie hace seguimiento.
   - Hacemos seguimiento, pero no sabemos qué campaña trae matrículas.
   - Funciona bien, solo quiero comparar.
3. **¿Quién decide contratar algo así?** Yo · Yo y mi socio o la dirección · Otra persona.
4. **Web o Instagram de tu academia.** Texto libre. Es lo que más frena a los falsos.

**Datos de contacto:**
- Nombre.
- **Email de trabajo** (el campo «Work email» de Meta, en lugar del email normal).
- Teléfono.
- Nombre de la empresa.

**Fuera:** las preguntas de inversión en anuncios y de valor del cliente. Las respuestas declaradas no se pueden comprobar, y son las que usan los falsos para colarse. El ticket se pregunta en la llamada.

**Pantalla final:**
- **Título:** «Recibido. Te escribimos en unos minutos.»
- **Texto:** «Si prefieres, elige ya tu hora para el diagnóstico.»
- **Botón:** «Elegir hora ahora», que lleva a qualivo.io/diagnostico/?paso=agenda con las UTM.

## 2. Puntuación en GHL (se cambia en `api/meta-leadform.js` y `api/_funnel-v2.js`, en la rama web)

| Señal | Puntos |
|---|---|
| Email de empresa (dominio propio) | +3 |
| Web o Instagram que parece real (dominio, @ o URL; no «no tengo» ni una sola palabra) | +2 |
| 20-49 solicitudes al mes / 50 o más | +2 / +3 |
| Decide él o ella, o con su socio | +1 |
| Dolor: respuesta tarde o seguimiento | +1 |
| «Solo quiero comparar» | −1 |

- **Nivel A:** 7 puntos o más. **Nivel B:** 5-6. **Nivel C:** 3-4. **Nivel D:** 2 o menos.
- **Marca de posible falso** (no descarta; solo marca «revisar» y no se avisa como lead caliente). Salta si se cumplen dos o más de estas condiciones:
  - email gratuito;
  - empresa de una palabra o igual al nombre de la persona;
  - campo de web vacío o sin sentido.
- **Descarte automático solo si:** menos de 20 solicitudes al mes **y** sin web. Se descarta como ahora: oportunidad perdida y Disqualified a Meta.
- **El filtro por inversión del 4-nov desaparece.**

## 3. Después del lead
- **A y B:** aviso a Maikel y **llamada en menos de 5 minutos** en horario (de 10 a 14 h; los domingos, revisar por la mañana). Además, el WhatsApp automático, como ahora.
- **C:** WhatsApp automático con su secuencia.
- **D o «revisar»:** WhatsApp corto. Si no contesta en 48 h, se pasa a «no-encaja» y Meta recibe Disqualified.
- **Señales a Meta:** las mismas de ahora (Contacted, Schedule, Qualified, Converted y Disqualified). Se mira que cada lead falso termine en Disqualified.

## 4. Cómo se prueba
- **Formulario y puntuación nuevos con el anuncio V2,** solo en Instagram, en una campaña limpia, 14 días sin tocar nada.
- **Se juzga por** coste por reunión celebrada con encaje y por oportunidad que avanza, no por coste por lead.
- **Para comparar** se guarda la tabla de los 77 leads anteriores.

## Qué necesito de Maikel
1. **OK al formulario.** Una vez creado no se puede editar, así que conviene revisar los textos antes. Crearlo no gasta nada y no se publica sin un anuncio.
2. **OK a cambiar la puntuación en la rama web.** Afecta solo a los leads de este formulario nuevo.
3. **Quién llama en los primeros 5 minutos** mientras él esté de vacaciones.
