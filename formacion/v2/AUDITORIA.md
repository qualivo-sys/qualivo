# Formación V2 · auditoría breve y entrega (12-oct-2026)

**Archivos:**
- borrador en `formacion/v2/index.html` (noindex, canonical a `/formacion/`);
- capturas en `formacion/v2/capturas/`.

**Especificación:** `content/formacion-v2-instruccion-maestra.md` y `content/brief-formacion-v2-para-contenido.md`.

**Estado:** no se publica. Está en la rama `claude/pensive-cray-u3k7kx`, que no despliega en qualivo.io. La landing publicada, `/formacion/`, está intacta.

## 1. Qué se conserva de /formacion/

- **Paleta y tipografía:** marfil, negro, verde petróleo, amarillo en los botones y Montserrat.
- **Los 16 logos de clientes**, los mismos de la landing publicada, ahora en una cinta continua.
- **Los casos EAC y Nail Boss**, con las mismas cifras publicadas.
- **El formulario de `/diagnostico/landing.js`, sin tocar el archivo.** Se conservan:
  - el mismo envío a `api/diagnostico.js`;
  - el calendario de GHL;
  - el honeypot;
  - los eventos `diagnostico_*` y el `diagnostico_lead` con su `evento_id` deduplicado por la Conversions API.
- **El consentimiento** (`/assets/consent.js`) y `utm_content=formacion` cuando la página llega sin parámetros.

## 2. Qué se modifica

- **El mensaje.** H1 «Más alumnos para tu centro. Del primer anuncio a la matrícula.» y el recorrido completo en lugar de la velocidad de respuesta. Las cinco funciones van en un selector en escritorio y en una lista en móvil.
- **El formulario.** Pasa a dos pasos:
  - paso 1: centro, web y principal objetivo;
  - paso 2: nombre, email, teléfono y RGPD.

  **Cómo se mapea a lo que pide el backend** (comprobado con la API simulada):

  | Campo | Qué se envía |
  |---|---|
  | `sector` | «Formación o academia» |
  | `equipo` | «No preguntado (formación v2)» |
  | `inversion` | «No preguntado (formación v2)» |
  | `hipotesis` | «Centro: X · Objetivo: Y», que llega a la nota del CRM |
  | `origen` | `formacion/v2` |

- **Raquel, en formato compacto,** con la prueba real de llamada (`/api/prueba/`, `sector: formacion`):
  - la página dice el horario de 9:00 a 21:00;
  - los mensajes de «fuera de horario» y del tope por móvil y día se muestran tal como los devuelve la API.
- **Intelligence, con dos capturas reales de la demo** (`/intelligence/?sector=formacion`), etiquetadas «Demo con datos simulados». Se usa el recorrido; la de anuncios queda guardada.

## 3. Qué se elimina

- **Cosas que la instrucción prohíbe o que ya no aplican:**
  - «agentes de IA», los siete agentes y «lo agentizamos»;
  - el vídeo de 70 s;
  - la garantía y «primer agente en dos semanas», porque son promesas;
  - BelloVinilo, que no es de formación;
  - «Esto no es para todo el mundo»;
  - 6 de las 10 FAQ.
- **El botón fijo de WhatsApp.** Se quita para tener un solo CTA. Va como test A/B (ver abajo).
- **FEMXA y XFP:** no aparecen en ningún sitio.

## 4. Efecto «wow» (petición de Maikel, 12-oct)

Todos los efectos son CSS y JavaScript ligero, sin librerías, y se apagan con `prefers-reduced-motion`.

- **Hero:**
  - las barras del panel crecen y las cifras suben;
  - un brillo recorre las barras;
  - la fuga late;
  - el subrayado amarillo se dibuja solo;
  - el panel se inclina con el ratón;
  - aparecen avisos de actividad («Nueva solicitud», «Reunión agendada»…) con la etiqueta **«Ejemplo»**.
- **Resultados:** las cifras cuentan al entrar en pantalla.
- **Sección oscura:** la línea del recorrido del alumno se llena al bajar, cada paso se ilumina y la captura de Intelligence entra con perspectiva.

## 5. Elementos de conversión (petición de Maikel, 12-oct)

- **Hechos:**
  - **Próximos huecos libres reales.** Salen del calendario del CRM a través de `api/huecos.js` (nuevo, solo lectura, con caché de 5 minutos). Reutiliza `huecosLibres()` de `api/agendar.js`, la misma función que usa Raquel y que ya salta los festivos. Aparecen en el hero («Próximo hueco libre: jueves 15 · 10:00») y junto al formulario. Si no hay huecos o falla, no se muestra nada.
  - **Foto y nombre de Maikel junto al formulario:** «La llamada la hace Maikel Echevarría».
  - **CTA fijo en móvil.**
- **No hecho, a propósito: avisos tipo «Fulano ha agendado una sesión» con nombres inventados.**
  - Es prueba social falsa y la instrucción prohíbe inventar datos.
  - Puede ser una práctica comercial engañosa según la ley de consumidores.
  - Si alguien lo detecta, hunde la credibilidad.
  - **Alternativa verdadera:** «Esta semana, N centros de formación han pedido su diagnóstico», contado desde el CRM con un endpoint como el de los huecos y sin nombres (R5). Necesita el ok de Maikel a publicar ese número.

## 6. Validación (API simuladas, sin tocar el CRM ni lanzar llamadas reales)

- **Escritorio (1440 px) y móvil (390 px):**
  - sin errores en consola;
  - sin desbordamiento horizontal.
- **Formulario:**
  - si faltan campos, da un error claro;
  - en el paso 2 valida el email y el RGPD (los de `landing.js`);
  - **se envía una sola vez aunque se pulse dos veces**;
  - después del envío carga el calendario.
- **Raquel:**
  - sin permiso da un error;
  - con permiso hace un solo envío y muestra «Te está llamando Raquel».
- **Eventos:**
  - `formacion_cta:<ubicación>`, que no cuenta como lead;
  - `diagnostico_form_view`;
  - `formacion_raquel_abrir`;
  - `prueba_enviar` y `prueba_llamando`;
  - `diagnostico_lead`, el único que es un lead, una vez por envío.
- **Texto comercial visible:** unas 700 palabras, sin contar el formulario, el panel ni los logos. Está en el límite bajo del rango de 700 a 900.
- **SEO:** un solo H1, H2 por sección, title y description propios, noindex y canonical a `/formacion/`.

## 7. Riesgos y datos pendientes (Maikel)

1. **Los precios** siguen sin publicarse. La FAQ «¿Qué presupuesto necesito?» responde sin cifra.
2. **Focus Practical** aparece solo como una línea con enlace. ¿Se queda o se quita?
3. **«Plan por escrito en 48 horas» y «sin coste»** vienen de la landing actual. Hay que confirmarlos.
4. **La FAQ «¿Qué incluye el servicio?»** menciona una revisión mensual, que es la propuesta del documento de oferta. Hay que confirmar el alcance.
5. **`api/huecos.js` es backend nuevo.** Expone solo horas libres. Hay que revisarlo antes de llevarlo a producción.
6. **`/encaja/`:** sin tocar. ¿Se borra?
7. **Preview:** si Vercel despliega esta rama como vista previa, el formulario enviaría al CRM real si allí están las claves. No se debe usar para probar a mano.
8. **Al publicar:** mover el contenido a `/formacion/` o hacer el test en una ruta aparte, y quitar la barra «BORRADOR».

## 8. Ideas de test A/B (métrica: reuniones celebradas, no leads)

1. **H1 actual contra una versión con dolor:** «Te piden información del curso. ¿Cuántas acaban en matrícula?».
2. **Formulario de 2 pasos contra uno de un solo paso** con los seis campos.
3. **Huecos reales visibles contra no visibles**, medido en inicio de formulario y reunión agendada.
4. **Con o sin la prueba de Raquel en la sección oscura:** ¿distrae del diagnóstico o lo empuja?
5. **Botón de WhatsApp fijo contra solo el CTA de diagnóstico.**
6. **Orden de los casos:** primero EAC (retorno) o primero Nail Boss (matrículas desde cero).
7. **CTA «Descubre tu plan de captación» contra «Ver dónde pierdo matrículas».**
