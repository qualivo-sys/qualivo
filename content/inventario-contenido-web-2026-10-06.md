# Inventario de contenido, diseño, redes y web de Qualivo

> Escrito el 6-oct-2026 por el agente de contenido (Head of Content), a petición
> de Maikel, para revisarlo con otro agente.
>
> Es una foto de lo que hay en el repositorio `qualivo-sys/qualivo`, rama
> `claude/qualivo-landing-vercel-nubk1i`. Para cada pieza dice dónde está, en
> qué estado y qué está pendiente. Las rutas son relativas a la raíz del
> repositorio.
>
> El repositorio es público. En este documento no hay nombres de leads ni
> credenciales.

---

## 1. Qué documento manda (orden de prioridad)

Cuando dos documentos se contradicen, gana el que está más arriba en esta lista.

1. **Instrucciones escritas de Maikel en el chat.** Mandan siempre.
2. **`content/plan-octubre-2026.md`.** Plan de octubre: una fuga por semana, contenido ligado a cada fuga y el trimestre. Desde el 29-sep, gobierna todo lo de octubre.
3. **`content/agentes/brief-head-of-content.md`.** Gobierno del contenido (21-sep): pilares, series, reparto de CTA, la regla «me pasa a mí» y la de primero el acierto y después el fallo.
4. **`content/guia-de-voz.md`.** Tono. Añadido del 22-sep: nada de lemas ni rótulos que suenen a máquina. Prohibidos la raya larga, el punto y coma y el «no es X, es Y».
5. **`content/contrabrief-qualivo.md`.** Lenguaje y gobierno de la comunicación (8-sep).
6. **`content/estandar-articulos.md`** (blog) y **`content/estandar-visual.md`** (visual, 26-ago).
7. **`content/growth-os.md`.** Objetivos y métricas (12-ago). La línea 65 dice: «sin resultados de clientes en contenido editorial». Sigue vigente, pendiente de que Maikel la revise.
8. **Skill `.claude/skills/sistema-contenidos`.** Sistema maestro de contenidos. Aquí está la pausa de redes del 9-sep.

**Documentos antiguos que solo sirven de contexto:**
- `estrategia-v3.md` (25-ago)
- `plan-de-contenidos.md` (25-ago)
- `sistema-maestro-contenidos.md` (26-ago)
- `maquina-de-contenido.md` (27-ago)
- `plan-editorial-septiembre.md` (27-ago)
- `estrategia-de-contenidos-v1.md` y `estrategia-redes-v1.md` (10-sep)
- `gtm-septiembre-2026.md` (10-sep)
- `documento-madre-qualivo.md` (21-ago)
- `brief-maestro-content-leadgen.md` (11-ago)
- `content-growth-agent.md` (27-ago)
- `content-intelligence.md` (14-ago)
- `brief-agente-contenido-codex.md` (8-sep)

**No son de Qualivo:** los documentos `agent-to-me-*`, `estrategia-agenttome.md`, `campana-meta-agenttome.md`, `qualivo-launch.md` y `sdr-cliente-cero.md` son de Agent for Me, Launch y otros proyectos de agosto.

## 2. Reglas en vigor

| Regla | Origen | Estado |
|---|---|---|
| Redes en pausa: solo borradores hasta que Maikel la levante por escrito | 9-sep | **Vigente.** Excepción: Maikel dio el ok a dos carruseles de Instagram (22 y 24-sep) |
| Ni una cifra inventada. Cada pieza lleva un dato real con fuente o no sale | Maikel | Vigente |
| Todo pasa por el Master Reviewer antes de darse por bueno | Maikel | Vigente (`content/agentes/prompt-qualivo-master-reviewer.md`) |
| Tono humano, sin lemas de máquina («Sin humo», «verdades de dueño»…) | 22-sep | Vigente |
| No publicar la tasa de plantones propia | 24-sep | **Se incumple:** «9 citas, 5 plantones» y «5 de 9» siguen publicados (ver §8) |
| Nada que parezca WhatsApp automatizado desde el número personal de Maikel | 21-sep | Vigente en el contenido. **En el sistema real**, desde el 1-oct el primer WhatsApp a los leads A/B sale solo a los 10 min (ver §8) |
| Sin datos de terceros: ni nombres de leads o clientes, ni cifras que los identifiquen | Maikel | Vigente |
| Sin resultados de clientes en el contenido editorial | Agosto (`growth-os.md`) | Vigente, con dudas (ver §8) |
| Ni precio ni garantía en el contenido | Calendario de octubre | Vigente |
| El Instagram personal de Maikel (molde crema, tinta y naranja, en primera persona) va separado de la newsletter de Qualivo (marca de la web, «nosotros») | 24-sep | Vigente |
| Maikel no sale a cámara en octubre | Calendario de octubre (otra sesión) | **Choca** con el plan de octubre, que pide probar «Maikel a cámara» |
| Envíos masivos de correo solo con autorización expresa de Maikel | Maikel | Vigente |

## 3. Marca y diseño

| Qué | Dónde | Notas |
|---|---|---|
| Paleta y tipografía de la web y de los correos | `assets/styles.css`, `index.html` | Blanco, #101319, turquesa #27BDB1, #0E7C74, menta #B7F0EA, lila #EFECFB, negro #08090C. Montserrat (`assets/fonts/`) |
| Molde de redes (Instagram y LinkedIn de Maikel) | `content/infografias/2026-09-10/_base.css` | Crema #F2EEE6, tinta #0A0A0B, naranja #E8590C. Fuentes Anton y Space Grotesk (alias `SG`) |
| Logos | `assets/img/qualivo-logo.png`, `qualivo-logo-blanco.png` | En `content/video/2026-09-17-sistema/rec/logo-blanco.png` hay una versión grande (860 px) |
| Portada y descripción del perfil de empresa | `content/marca/portada-perfil/` | 1920 × 1080 con la marca de la web, más un texto de 466 caracteres. **Pendiente de subir** |
| Estándar visual | `content/estandar-visual.md` | Del 26-ago |
| Guía de carruseles | `content/guia-carruseles.md` | Del 22-sep |
| Capturas para revisar las landings | `content/marca/capturas-landings-2026-10-02/` | /para/ y equipos-comerciales v2, en móvil y escritorio |

**Cómo se genera:**
- Las infografías y los carruseles se generan desde HTML con el Chromium del entorno, mediante el `render.sh` de cada carpeta.
- Desde el 29-sep, el `render.sh` espera 3 segundos a que carguen las fuentes.

## 4. Web (qualivo.io)

Se despliega desde la rama `claude/qualivo-landing-vercel-nubk1i` con Vercel.

### Páginas públicas (indexadas)

| Página | Ruta | Nota |
|---|---|---|
| Home | `index.html` | Titular: «Te decimos dónde se te escapa el dinero entre el anuncio y el cierre» |
| Diagnóstico | `diagnostico/` | 30 minutos y plan escrito en 24 h. Es el destino de todos los botones del blog |
| Sectores | `clinicas/`, `formacion/`, `reformas/`, `asesorias/` | Landings por sector |
| Servicios | `servicios/` | |
| Sobre Maikel | `sobre/` | |
| Calculadora de fugas | `calculadora-de-fugas/` | |
| Recursos | `recursos/` | |
| Casos | `casos/` | EAC, Nuria Roure, Focus Practical y Bellovinilo. Son los únicos sitios donde se permiten resultados de clientes |
| Páginas SEO de servicio | `consultoria-*`, `growth-b2b/`, `gestion-google-ads/`, `automatizacion-comercial/`, `consultora-growth-barcelona/` | |

### Borradores o páginas sin indexar

| Página | Ruta | Estado |
|---|---|---|
| Home nueva | `home-nueva/` (v2) y `home-nueva/v1/` | Preview de otra sesión. **En la sección de captación de la v1** pone «las campañas aprenden de quién compra», y hoy no es así |
| Equipos comerciales (tipo A) | `equipos-comerciales/` (v1) y `equipos-comerciales/v2/` | La v2 tiene hero animado, comparativa antes/después del lunes de dirección, demo interactiva «Pruébalo» y menos texto. **Falta que Maikel elija cuál va a producción** |
| Páginas de cuenta ABM | `para/<cuenta>/`, generadas con `node herramientas/para.js` desde `para/_fichas/*.json` | Plantilla con efectos del 2-oct y 5 cuentas de nivel 1. Llevan una baliza a `/api/visita/` que no se toca. Nunca aparece el nombre de una persona. **La ficha `ejemplo.json` usa nombres en el mensaje de ejemplo** |
| Cómo funciona | `como-funciona/` | noindex |
| Qualivo Intelligence | `intelligence/` | Demos por sector y simulador del embudo para usar en reuniones |
| Prueba tu agente y reserva | `prueba/`, `llamada/` | noindex |

**Otros proyectos dentro del repositorio:** `agentforme-site/`, `equipzilla-site/`, `maikelechevarria-site/`, `outthink-preview/` y `launch/`. No son de Qualivo.

## 5. Blog (`blog/`, 58 artículos)

Toda la serie se publicó entre el 22-sep y el 6-oct. Cada artículo lleva un dato propio y una revisión del Master Reviewer.

| Fecha | Artículo | Dato propio |
|---|---|---|
| 22-sep | presupuestos-sin-respuesta | CRM propio: propuestas abiertas sin siguiente paso |
| 23-sep | cliente-no-se-presenta-a-la-cita | **Publica la tasa de plantones (corregir)** |
| 24-sep | que-poner-en-tu-negocio-para-atraer-clientes | **Publica «9 citas, 5 plantones» (corregir)** |
| 25-sep | coste-por-lead | Anuncios del 18 al 22-sep por sector, y coste por cita |
| 28-sep | formulario-de-facebook-o-landing-page | 12 de 14 citas entraron por el formulario. La prueba de precio se paró al día siguiente |
| 29-sep | ahora-no-es-el-momento | Tres objeciones reales, anonimizadas |
| 30-sep | primera-reunion-con-un-cliente | El diagnóstico pasó de 15 a 30 minutos |
| 1-oct | cualificar-leads | Dos reuniones en las que el formulario sobrestimó el encaje |
| 2-oct | origen-de-los-leads | Etiqueta de origen mal puesta en el CRM: 36 de 38 contactos frente a 36 de 37 |
| 5-oct | equipo-comercial-no-usa-el-crm | Limpieza de nuestro propio CRM el 1-oct (primer artículo para el tipo A) |
| 6-oct | cuanto-invertir-en-publicidad | Un contacto con la nota más alta, y el precio del servicio cambiaba la cuenta |

**Reorientados al diagnóstico** (los dos últimos párrafos y el CTA, con un solo botón):
auditoria-de-marketing, seguimiento-comercial, leads-pero-no-ventas, como-captar-clientes, captacion-de-leads, embudo-de-ventas, cliente-ideal-b2b, que-es-un-lead, metricas-de-marketing, crm-para-pymes y cuanto-cuestan-anuncios-facebook-instagram.

**Registros:**
- Al publicar cada artículo hay que actualizar `blog/index.html` (tarjetas), `sitemap.xml`, `llms.txt` y `content/seo-keywords-usadas.md`. Este último registra la keyword y el dato de cada artículo, y además los reorientados.
- Arquitectura SEO en `content/arquitectura-seo-clusters.md`.
- Keywords en `content/listado-maestro-busquedas.md`.
- Baseline SEO en `measurement/baseline.md` (27-ago, punto de partida cero).

**Plantilla:**
- La rutina la toma de `blog/estrategias-marketing-crm/index.html`.
- En la práctica se copia la cabecera de `blog/coste-por-lead/` con un script: schema de Article, FAQPage y Breadcrumb, FAQ visible, «En 30 segundos» y post-cta.

## 6. Redes sociales

**Cuentas:**
- Instagram @maikel.echevarria y LinkedIn de Maikel, en primera persona.
- La publicación en Instagram se hace por el Social Planner de GHL. Hay un script con credenciales en el scratchpad de la sesión, no en el repositorio.

### Publicado

| Fecha | Pieza | Dónde |
|---|---|---|
| 22-sep | Carrusel «Casi 7×» (contacto), v5 | `content/carruseles/2026-09-22-contacto-7x/` |
| 24-sep | Carrusel «Te han dado plantón», v3 con portada de Higgsfield | `content/carruseles/2026-09-24-plantones/` |

### Borradores listos (sin publicar)

| Pieza | Dónde | Nota |
|---|---|---|
| **4 posts de cobertura en LinkedIn para la prospección tipo A (6-9 oct)** | `content/linkedin/2026-10-06-air-cover.md` | **Lo más urgente.** Esperan el ok de Maikel |
| Bandera roja · cita (23-sep) | `content/borradores/2026-09-23-bandera-roja-cita.md` | Lleva el «5 de 9». **No publicar tal cual** |
| «¿Eres una máquina?» (24-sep) | `content/borradores/2026-09-24-agentizando-eres-una-maquina.md` | |
| Tesis «falla en silencio» (25-sep) | `content/borradores/2026-09-25-tesis-falla-en-silencio.md` | |
| «Dos preguntas antes de la llamada», con versión 2 (28-sep) | `content/borradores/2026-09-28-agentizando-dos-preguntas.md` | Vale la versión 2: «lo quité al día siguiente» |
| «Sí. Pero más tarde» (29-sep) | `content/borradores/2026-09-29-objecion-si-pero-mas-tarde.md` | Retenido por la regla de no contar resultados de clientes |
| Bandera roja · reuniones de 15 minutos (30-sep) | `content/borradores/2026-09-30-bandera-roja-reuniones.md` | |
| «Le digo a Meta quién encajó» (1-oct) | `content/borradores/2026-10-01-agentizando-le-digo-a-meta.md` | |
| Tesis «la etiqueta dice dos cosas» (2-oct) | `content/borradores/2026-10-02-tesis-etiqueta.md` | |
| ~~«La IA no sustituye al comercial» (5-oct)~~ | `content/borradores/2026-10-05-agentizando-semiautomatico.md` | **RETIRADO:** describe el copiloto, que ya está apagado |

- Las imágenes están en `content/infografias/<fecha>/`, cada una con su README y su fuente.
- Otra sesión preparó tres carruseles de octubre (velocidad, plantones v2 y curiosos) en `content/carruseles/2026-09-30-*`, y guiones de voz en `content/guiones/2026-09-30-guiones-maikel.md`.
- Calendario de octubre por días y horas: `content/calendario-contenidos-octubre-2026.md`.
- Propuesta de la semana 41 (tipo A): `content/propuestas-areas/2026-10-05-contenido.md`.

## 7. Correo: newsletter y nurturing

| Qué | Dónde | Estado |
|---|---|---|
| Newsletter de plantones (marca Qualivo, a prueba de cualquier gestor de correo) | `content/newsletter/correo/2026-09-25-plantones.html`. Plantilla en GHL | **Sin enviar.** Propuesta: solo a los 22 contactos con la cadencia terminada, sin cita y sin baja |
| Capítulo 1 «Agentizando» (diario personal de Maikel) | `content/newsletter/2026-09-24.md` | Si sale, sale como newsletter de LinkedIn de Maikel, no de Qualivo |
| Correos de la semana del 30-sep, de otra sesión | `content/newsletter/2026-10/` | Borradores |
| Nurturing de formación y clínicas: 6 correos (días 0, 2, 5, 8, 12 y 20) | `content/nurturing/formacion-v1.md` y `content/nurturing/correo/` (HTML maquetado y vista previa) | **Encendido el 1-oct** por otra sesión, solo para leads nuevos. Falta el enlace del vídeo del correo del día 12 |
| **Bloqueo: DNS de qualivo.io** | `content/newsletter/2026-10/semana-2026-09-30.md` | Al SPF le falta Google y no hay DMARC. Con el nurturing encendido, los correos pueden caer en spam. Lo arregla Maikel |

## 8. Problemas abiertos que hay que resolver

1. **Tasa de plantones publicada:**
   - `blog/cliente-no-se-presenta-a-la-cita/`
   - `blog/que-poner-en-tu-negocio-para-atraer-clientes/`
   - `blog/leads-pero-no-ventas/`
   - `blog/index.html`
   - `llms.txt`

   Va contra la regla de Maikel. Arreglarlo es cambiar una frase en cada sitio, pero falta su ok.
2. **El WhatsApp sale solo desde el número personal de Maikel.** Desde el 1-oct, el primer WhatsApp a los leads A/B sale automáticamente a los 10 min y el copiloto está apagado (`api/_activacion.js`, `api/_agente.js`). Choca con su regla. Es tema de Growth, no de contenido.
3. **El DNS** (SPF y DMARC), con el nurturing ya encendido.
4. **Reglas que chocan:**
   - resultados de clientes en redes;
   - Maikel a cámara;
   - precio en el contenido.
   - Además, hay dos sesiones produciendo contenido a la vez. Falta decidir quién lleva qué.
5. **No se mide el contenido:**
   - Los botones del blog no llevan UTM.
   - El formulario no pregunta «¿cómo nos conociste?».
   - No hay dato de Search Console desde agosto.
   - Hoy no se puede atribuir ni un lead al contenido.
6. **Un caso de cliente en el blog.** `blog/cuanto-cuestan-anuncios-facebook-instagram/` lleva un caso real de cliente (Focus Practical) en el contenido editorial. Puede chocar con la regla de agosto.
7. **Producción de la web:**
   - Elegir la versión de equipos-comerciales (v1 o v2).
   - Corregir la frase de captación de `home-nueva/`.
   - Cambiar los nombres de persona de la ficha de ejemplo de /para/.
8. **Perfil de empresa:** subir la portada y la descripción nuevas.

## 9. Cómo trabaja el agente de contenido

**Rutina diaria:**
- De lunes a viernes a las 7:15. Es un disparador programado en Claude Code.
- Cada día:
  - un artículo de blog;
  - un artículo antiguo reorientado;
  - el borrador de redes de la serie que toca: lunes y jueves «Agentizando», martes la objeción de la semana, miércoles bandera roja, viernes tesis contraria;
  - los miércoles, además, el capítulo de la newsletter.
- Después: la revisión del Master Reviewer, la entrada del día en `content/diario-contenido.md`, el commit y el push.

**Fuentes de datos:**
- `bus/out/demand.jsonl`: dailies de Growth y cambios en Meta.
- `captacion/agente-llamadas/bitacora-raquel.md`.
- `content/brief-recorrido-semana-38.md`.
- `content/briefs/2026-10-02-insights-semana-40.md`: las 8 reuniones y los tipos de cliente A, B y C.
- El código de `api/`, que es lo que de verdad hace el sistema.

**Revisiones:** `content/borradores/revision-master-reviewer-<fecha>.md`, una por día desde el 22-sep.

**Análisis y planes:**
- `content/analisis-contenido-sep-2026-y-q4.md`: conclusiones de septiembre y propuesta para el trimestre.
- `content/borradores/plan-semana-40.md`.

**Skills del repositorio:** `.claude/skills/`:
- `sistema-contenidos`
- `creative-performance`
- `reel-premium`
- `director-creativo`
- `brief-produccion`
- `estratega-avatarhype`
- `avatarhype-6c-prompt-engine`

**Vídeo y anuncios:**
- `content/video/`: anuncios con IA y Veam, «Las fugas» V2 y la plantilla maestra.
- `content/anuncios/`
- `content/tratamientos/`
- `video-factory/`
- El agente Creative Performance trabaja en la rama `claude/qualivo-creative-performance`.

## 10. Preguntas para la conversación con el otro agente

1. ¿Quién lleva qué en contenido (blog, redes, correo, anuncios) para dejar de duplicar trabajo?
2. ¿Se unifican las reglas de los puntos §2 y §8.4 en un solo documento? Si es así, ¿cuál manda?
3. ¿Se quita hoy la tasa de plantones publicada?
4. ¿Cómo se mide el contenido a partir de ahora: UTM, «¿cómo nos conociste?» y Search Console?
5. Las redes de Maikel: ¿se levanta la pausa para la cobertura del tipo A?
