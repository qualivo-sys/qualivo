# Landing de formación · propuesta para que convierta (borrador, 5-nov-2026)

- **Encargo:** del CoS, 5-nov.
- **Entrega:** lunes 9-nov a las 9:00.
- **Lo prepara:** Creative v2, coordinado con Growth (dueño de la web) y Paid.
- **Estado:** no se publica nada. Los cambios los hace Growth después del OK de Maikel.
- **Leyenda:** [C] comprobado, [E] estimación.
- **Pendientes:** las cifras marcadas «pendiente» las tienen que confirmar Growth y Paid antes del lunes.

**Punto de partida (recuento de Paid, 21-oct a 5-nov, solo visitas que aceptan cookies):**
- **Píxel de Meta:** 212 PageView → 66 ven el formulario (`DiagnosticoFormView`) → **2 lo empiezan** (`DiagnosticoFormStart`) [C].
- **GA4:** 33 ven el formulario → 1 lo empieza [C]. De esas 33 vistas, 18 son en la portada, 12 en /formacion/ (incluidas las v21 y v22) y 3 en /reformas/.
- **Qué cuenta como «empezar»:** tocar cualquier campo, de cualquier paso [C, `diagnostico/landing.js`].
- **Lectura:** solo ~1 de cada 3 visitas llega al formulario y, de las que lo ven, ~3 % lo tocan. **El freno está en la llegada y, sobre todo, en el propio formulario** [E].

## 1 · Diagnóstico

Revisión en móvil (iPhone 13 emulado) de `qualivo.io/formacion/` y de la portada, el 5-nov [C]. Capturas: `movil-primera-pantalla.png` y `movil-pagina-completa.png`.

| Área | Qué hay | Lectura |
|---|---|---|
| **Medición** | Ya existen los eventos `form_view`, `form_start` y `form_abandon` [C, Paid]. Pero el píxel y GA4 solo cargan si se aceptan las cookies [C, `assets/consent.js`], y el píxel registra más abandonos (4) que inicios (2): las cifras absolutas no son fiables. Lo que coincide en las dos fuentes es la proporción. El denominador **no** incluye leads del formulario nativo: el botón «Ver cómo trabajamos» lleva 0 visitas desde el 4-nov [C, Paid]. | Lo que se ve, se ve en las dos fuentes. Falta contar a quien rechaza las cookies. |
| **Mensaje frente al anuncio** | Anuncio E-03: «¿Vendes formación? Te llegan contactos… y no compran». Titular de la landing: «Más alumnos para tu centro. Del primer anuncio a la matrícula» [C]. | El anuncio vende el dolor de que no compran y la landing promete volumen. El subtítulo sí conecta, pero el titular no repite el gancho [E]. |
| **Oferta** | «Diagnóstico sin coste · 30 minutos» [C]. | Es la oferta más repetida del mercado: ~14 de 19 competidores [C, `../2026-11-competidores/lista-agencias.md`]. No dice qué te llevas. |
| **Prueba** | Casos con cifras y nombre del centro, vídeo de 70 s y una demo interactiva de 9 pasos con «datos simulados» [C]. | Hay prueba de sobra. Pero los casos con nombre chocan con la regla de Maikel del 29-oct («sin casos de clientes, ni en anónimo»), si esa regla vale también para la web. **Lo decide Maikel.** |
| **Formulario: posición** | Empieza en el **62 % de la página**: 5.810 px de 9.442, unas 9 pantallas de scroll en móvil [C]. Los botones «Pide tu diagnóstico» saltan hasta allí. | Para tráfico frío de Meta, el formulario está demasiado lejos. Paid ya lo señaló en septiembre en /diagnostico/, con el formulario al 80 % [C, Paid]. |
| **Formulario: fricción** | 3 pasos: (1) centro, web, objetivo, solicitudes al mes y precio del curso, con 5 campos obligatorios; (2) nombre, email, teléfono y RGPD; (3) calendario [C]. | El paso 1 pide la web y el nombre del centro antes de saber nada de la persona. Son los campos que más cuestan [E]. El formulario nativo de 4 preguntas sí recibe envíos [C, Paid]. |
| **Móvil** | El banner de cookies ocupa ~40 % de la primera pantalla y tapa el botón principal [C, captura]. | Es lo primero que ve quien llega desde Meta. |
| **Velocidad** | TTFB de 0,1-0,5 s, LCP de 0,4-0,8 s y unos 2,3 MB por carga en móvil [C, 3 cargas, 5-nov]. | No es el problema. |

## 2 · Cambios propuestos, por orden

| # | Cambio | Impacto / esfuerzo [E] | Dueño | ¿Maikel? |
|---|---|---|---|---|
| 0 | **Que la medición cuente a todos.** Los eventos ya existen. Falta que se registren también sin aceptar cookies, ya sea por servidor o con Consent Mode avanzado. Las visitas se cuentan en Vercel Analytics, y el tráfico del formulario nativo se separa con `utm_content=form-4preg-filtro-gracias`. | Alto / bajo | Growth | No |
| 1 | **Agenda directa para quien ya es lead.** Si se llega desde el formulario nativo, una variante que diga «Ya tenemos tus datos. Elige hora para la videollamada», con el calendario arriba y sin volver a pedir datos. | Alto / bajo | Growth (variante por UTM) y Paid (enlace) | OK al cambio |
| 2 | **Formulario corto arriba.** Justo después del titular, las mismas 3-4 preguntas que filtran en el formulario nativo: inversión, precio del curso y solicitudes al mes. Después, nombre y WhatsApp, y luego el calendario. La web y el nombre del centro pasan al final o se quitan. El formulario largo de abajo se queda para quien lee toda la página. | Alto / medio | Growth (con el copy de Creative) | OK al cambio |
| 3 | **Banner de cookies compacto.** Una barra inferior de ≤ 15 % de la pantalla que no tape el botón principal. | Medio / bajo | Growth | No |
| 4 | **Titular con las palabras del anuncio y una oferta concreta.** Por ejemplo: «Te llegan contactos… y no se matriculan. En 30 minutos te enseñamos dónde se pierden, anuncio por anuncio.» La oferta de noviembre entra aquí, cuando Growth confirme cuál es. **Pendiente.** | Medio / bajo | Creative (copy) y Growth | OK al copy |

**Fuera de esta propuesta:**
- Rehacer la página entera.
- Garantías o precio público: son decisiones de modelo de negocio de Maikel.
- El formulario del E-03 dio el mejor CPL, 8,51 € [C, Paid]. Pero es un formulario nativo sin salir de Meta, así que su CPL no se puede trasladar a la web.

## 3 · Cómo medimos

- **Tasa de inicio** = `form_start` / visitas únicas de tráfico frío. Se mira también `form_start` / `form_view`, para separar el «no llega» del «llega y no lo toca». Las visitas cuentan por Vercel Analytics, sin cookies. Línea base: 2 inicios por 66 vistas del formulario, ~3 % (píxel), y 66 vistas del formulario por 212 visitas, ~31 % [C, Paid, 21-oct a 5-nov]. Se repite con la medición nueva.
- **Tasa de reunión reservada** = reservas en el calendario de GHL / visitas únicas de tráfico frío.
- **Calidad:** % de reservas A/B y reuniones celebradas, porque una reserva no es una reunión.
- **Un cambio cada vez**, con fecha y hora, y un mínimo de 14 días o 100 visitas por tramo [E]. Con este volumen (~50 visitas cada 14 días, contando solo las que aceptan cookies) no habrá significación estadística: se decide por magnitud. Ejemplo: pasar del 4 % a más del 10 % de inicios [E].
- **Orden:** 0 → 3 → 2 → 4. El cambio 1 (agenda directa para quien ya es lead) se activa cuando el formulario nativo empiece a mandar tráfico: hoy son 0 visitas. Como de los que ven el formulario casi nadie lo toca, **el formulario corto (2) es el cambio con más palanca** [E]. El banner (3) va antes porque es barato y no se mezcla con él.
