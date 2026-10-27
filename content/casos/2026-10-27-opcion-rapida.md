# Casos sin permiso: tres opciones para decidir hoy (27-oct-2026, 14:30)

**Resumen (las tres opciones):**

1. **C · Anonimizar (rama `claude/casos-anonimos-propuesta`, ya hecha):** los 4 casos siguen en la web con sector y cifras, sin nombre, logo ni detalle que identifique. Las URL viejas redirigen (301) a las nuevas.
2. C quita los nombres de unas 55 páginas (home, landings, blog, diccionario, llms.txt, sitemap) y todas las tiras de logos de clientes. Coste: revisar el diff y fusionar, unos 20-30 min.
3. **B · Pedir permiso:** 4 correos listos en `content/casos/2026-10-27-borradores-permiso.md`. No resuelve nada hoy: mientras no haya un «sí», los nombres siguen publicados sin permiso.
4. **A · Quitar del menú + noindex (la opción rápida):** unos 30-40 min, pero **no quita los nombres**: siguen en 50 páginas que enlazan a los casos (125 enlaces), en llms.txt y en los correos automáticos.
5. Para que A cumpla la R6 habría que quitar también esas menciones, que es casi el mismo trabajo que C, y con menos prueba social al final.
6. Prueba social que se pierde con A: la home, /formacion/, /reformas/, /clinicas/ y /asesorias/ (adonde van los anuncios de Meta), /diagnostico/ y las landings SEO.
7. SEO: las 4 páginas están en sitemap.xml. Tráfico real: **no tengo el dato** (Vercel Analytics está instalado, pero no tengo acceso).
8. Riesgo común a todas: los correos y mensajes automáticos (`api/`) siguen nombrando a clientes. No se ha tocado; hay que decidirlo aparte.
9. **Recomendación:** C hoy (fusionar la rama tras revisarla) + B en paralelo, salvo C-02, que espera a la nota interna. A solo si no da tiempo a revisar C.
10. Con C, cuando llegue un «sí» «con nombre» se vuelve a poner el nombre en esa página. Sin ese «sí», todo sigue anónimo.

> Repo público: aquí no van nombres de clientes. Códigos C-01…C-04 como en
> `content/casos/2026-10-27-borradores-permiso.md`.

---

## Opción A (la rápida): quitar /casos del menú y poner noindex mientras tanto

Todas las rutas y líneas son de la rama de producción
`claude/qualivo-landing-vercel-nubk1i` a 27-oct.

### Qué hay que tocar

| Qué | Dónde (fichero:línea) | Minutos |
|---|---|---|
| **noindex** a las 4 páginas de casos | `vercel.json`, bloque `headers`: añadir `{"source": "/casos/(.*)", "headers": [{"key": "X-Robots-Tag", "value": "noindex, follow"}]}`, igual que el de `/para/(.*)`. **No** añadir `Disallow: /casos/` a `robots.txt`: Google tiene que poder entrar para ver el noindex. | 5 |
| **Menú «Casos»**: no hay página `/casos/`; el menú apunta a `/#casos`, la sección de casos de la home | `404.html:31`, `blog/index.html:60`, `consultoria-growth-marketing/index.html:97`, `consultoria-ia/index.html:92`, `servicios/index.html:54`, `sobre/index.html:64`, `home-nueva/v3/index.html:206`, y la línea 57 de cada una de las 4 páginas de casos | 10 |
| Otros enlaces «Ver los casos» a `/#casos` | `sobre/index.html:101` y `:115`, `launch/index.html:790`, `blog/growth-partner/index.html:124` | 5 |
| **Footer «Casos»** (apunta al caso del centro de formación) | `index.html:1158`, `formacion/index.html:1009`, `reformas/index.html:1010`, `anterior/index.html:925`, `inicio/v2/index.html:650` | 5 |
| **Sección de casos de la home** (2 tarjetas con nombre, cifras y logo + tira de 18 logos) | `index.html:769` (logos en el hero), `index.html:785-834` (sección `#casos`) | 10 |
| Bloques de casos en landings de anuncios | `formacion/index.html:631` y `:647-693`, `reformas/index.html:631` y `:647-694`, `asesorias/index.html:264-297` y `:354-384`, `clinicas/index.html` (mismas líneas), `diagnostico/index.html:262-296` y `:360-390`, `como-funciona/index.html:272-294` y `:357-387` | 25 |
| **sitemap.xml** | líneas 46-49 (las 4 URL de casos) | 2 |
| **llms.txt** | líneas 28-31 (los 4 casos con nombre y cifras), y menciones en las líneas 5, 10, 47, 61, 62 y 90 | 10 |
| **Schema / JSON-LD** | Solo hay `Article` dentro de las 4 páginas de casos. Ninguna otra página tiene schema que apunte a ellas. Con noindex no hace falta tocarlo. | 0 |
| Enlaces internos desde blog, diccionario y landings SEO | 125 enlaces en 50 HTML. Los principales: 17 posts del blog (`blog/captacion-de-leads`, `funnel-de-ventas`, `leads-pero-no-ventas`, `metricas-de-marketing`, `cliente-ideal-b2b`…), 4 del diccionario (`cac`, `roas`, `lead-scoring`, `cualificacion-de-leads`), 6 landings SEO (`gestion-google-ads`, `automatizacion-comercial`, `consultora-growth-barcelona`, `consultoria-marketing-digital`, `consultoria-growth-marketing`, `consultoria-ia`), `growth-b2b`, `sobre`, `video`, `encaja`, `recorrido/v3`, `servicios` | 60-90 si se quitan; 0 si se dejan |
| Anuncios Meta/Google que apunten a `/casos/` | En el repo no hay ninguno: los anuncios llevan a `/formacion/`, `/reformas/`, `/clinicas/` y `/asesorias/`. Las cuentas publicitarias no las he podido revisar. | 0 |
| Correos automáticos que enlazan a los casos | `api/_secuencia.js` (líneas 26, 37 y 48: nombre + URL), `api/_nurturing-correos.json`, `api/_correo-cita.js:106`, `api/_mensajes.js:327`, `api/_agente.js:38` (prompt del agente de WhatsApp: «casos que puedes citar»). Con noindex los enlaces siguen funcionando, pero los textos nombran al cliente. | aparte |

**Total:** unos 30-40 min la versión mínima (noindex, menú, footer, sitemap y llms.txt). Unas 2-3 h si además se quitan las menciones del blog, las landings y la home, que es lo que hace falta para dejar de publicar los nombres.

### Qué se rompe o se pierde

- **Lo principal:** noindex solo saca las páginas de Google. Quien entra en la web sigue viendo los nombres, las cifras y los logos en la home, las landings y el blog, y los correos automáticos los siguen nombrando. Sin quitar las menciones, A no cumple la R6.
- **Prueba social en páginas de pago:** los anuncios de Meta llevan a `/formacion/`, `/reformas/`, `/clinicas/` y `/asesorias/`, y las cuatro usan los casos como prueba principal (10,2×, 8,3×, 6,45× y la tira de logos). Si se quitan, esas páginas se quedan sin cifras de clientes, salvo las del caso de la academia de uñas, que tampoco tiene permiso registrado. `/diagnostico/`, la página de conversión, pierde su bloque «Casos publicados».
- **SEO:** las 4 URL están en `sitemap.xml` (lastmod 27-ago). Tráfico y posiciones: **no tengo el dato**. Con noindex salen del índice en días o semanas, y los 125 enlaces internos apuntarían a páginas no indexables, lo que desperdicia algo de autoridad interna. Los posts que usan el caso como dato («ROAS 10,2×») pierden el enlace de prueba.
- **llms.txt:** si se dejan las líneas 28-31, los asistentes de IA siguen citando los casos con nombre aunque Google no los indexe.
- **Correos automáticos:** si en vez de noindex se borran las páginas, los enlaces de `api/_secuencia.js` y de los correos de nurturing darían 404.

---

## Opción C: dejar las páginas publicadas pero anónimas (lo hecho en la rama)

Rama `claude/casos-anonimos-propuesta`, creada desde producción. Sin fusionar.

- **Slugs nuevos:** `/casos/salud-servicios-online/` (C-01), `/casos/reformas-b2b/` (C-02), `/casos/formacion-profesional/` (C-03), `/casos/academia-oficios/` (C-04). Las URL viejas redirigen con 301 en `vercel.json`, con y sin barra final, como ya se hizo con `/casos/eleva-academy`.
- **Fuera:** nombres de empresa y de persona, logos (incluidos los ficheros de `assets/img/clientes/` de esos 3 clientes), ciudad y zona, nombres de cursos y productos que identifican, titulación de la persona y citas entre comillas. Las frases «antes/después» del caso C-01 quedan como paráfrasis, sin comillas.
- **Tiras de logos «Han trabajado con Qualivo»:** quitadas en todas las páginas. Ojo: incluían unos 15 clientes más, que tampoco tienen permiso registrado. Los logos de otros clientes dentro de tarjetas de caso (academia de uñas, Equipzilla, Antic) no se han tocado porque no entran en este encargo.
- **Cifras:** se mantienen los ratios (10,2×, 8,3×, 6,45×, −53 %, ~8 s). Las cifras absolutas que identifican (facturación del mes, inversión y ventas en euros, nº de leads y matrículas, precios de los cursos) pasan a porcentajes, índices o rangos. Lista completa en el informe de la sesión.
- **Sin tocar:** `api/` (correos y agentes automáticos), `intelligence/` (paneles privados de clientes, con noindex) y los documentos internos de `content/` (no se despliegan).
- **Comprobado en local:** las 56 páginas cambiadas cargan con estado 200, sin errores de consola y sin ningún nombre en el texto visible ni en el HTML.
- **Lo que deja ver la redirección:** quien tenga la URL vieja (con el nombre) llega al caso anónimo, así que queda claro de qué cliente es. Si eso molesta, la alternativa es redirigir las URL viejas a `/#casos`. Se pierde la equivalencia SEO 1:1.

## Opción B: pedir permiso

Borradores en `content/casos/2026-10-27-borradores-permiso.md`: uno por cliente, con el texto exacto, los tres niveles y la petición de un «sí» escrito. C-02 lleva una nota interna para no enviarlo todavía. B no sustituye a A ni a C. Es el camino para volver a poner los nombres cuando haya permiso.
