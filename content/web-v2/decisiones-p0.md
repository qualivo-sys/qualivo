# Web V2 · Decisiones P0 antes de diseñar

> 6-oct-2026 · Head of Content. Responde a la revisión «QUALIVO WEB V2 ·
> Posicionamiento, arquitectura, copy y diseño» (Notion, la hizo ChatGPT). La
> revisión pide cerrar seis cosas antes de seguir diseñando (su §15, P0). Aquí
> están cerradas como propuesta, cruzadas con el Content OS
> (`content/content-os-v1.md`) y con lo que el sistema hace hoy de verdad.
>
> **Lo que dice «Decide Maikel» espera su ok.** Lo demás lo doy por bueno salvo
> que diga otra cosa. Nada de esto toca la home publicada: el prototipo va en
> `/home-nueva/v3/`, con noindex.

## 0. Qué cogemos de la revisión y qué no

**Lo compartimos casi todo:**
- La IA es el mecanismo y no la categoría.
- El recorrido del lead es la columna vertebral de la web.
- Intelligence pasa a ser el centro.
- Agentes dentro del recorrido, no en una tienda de agentes.
- Un solo CTA.
- Casos contados como problema, fuga, cambio y resultado.
- Tres momentos wow en vez de veinte efectos.

**Lo que hay que corregir antes de usarla, porque chocaría con la verdad o con nuestras reglas:**

| La revisión dice | Problema | Lo que hacemos |
|---|---|---|
| «Respuesta en 47 s», «respuesta en segundos» como visual del hero | **R2.** En nuestro propio sistema, el primer WhatsApp a los leads A/B sale a los 10 minutos si Maikel no actúa antes (`api/activacion.js`). Al resto, la puerta lo manda al entrar. Una cifra de segundos como promesa no se sostiene | Las cifras van en una demo marcada **«Ejemplo»**. Como promesa, «en minutos, también de noche y en fin de semana» |
| «Laura Martínez · 2.400 €», «Fit 87», «Presupuesto abierto ×3» | **R1.** Son datos inventados | Valen como **ejemplo etiquetado**, igual que la demo de Intelligence (`intelligence/README.md`: «Todos los datos son ficticios»). Nombre claramente de ejemplo |
| «6,45×» en grande, con el contexto por explicar | **R1 y R6.** Es el caso Nuria Roure. Hay que decir qué mide y tener el permiso escrito para usarlo fuera de las páginas de caso | Se usa con su frase: «6,45 veces lo invertido, con los mismos contactos». Se registra en `content/casos-permisos.md` antes de llevarlo a la home nueva |
| «No necesitas otro dashboard. Necesitas saber qué está pasando…» | **R11.** Es un «no es X, es Y» | «Qué está pasando, qué importa y qué hacer después. En una pantalla.» |
| «IA cuando aporta velocidad. Humano cuando aporta criterio.» | **R11.** Lema de máquina | «El agente hace lo que se repite. Tu equipo decide lo que importa.» |
| Lista «Qué NO es Qualivo» | Sirve como guía interna. En la web suena a «no es X» | Se queda solo como guía interna. En la web, la sección «Para quién es y para quién no» |
| Formulario corto: nombre, empresa, contacto y problema | Choca con el test de formularios de Growth y Paid (13 al 25-oct) y con la puntuación (`api/_scoring.js`, que usa inversión, volumen y sector) | **No se toca el formulario hasta el 25-oct.** Después se decide con el dato del test |
| CTA «Auditar mi sistema», página «Auditoría» | Todo el blog (79 botones con UTM), las landings y el CRM usan «diagnóstico» y `/diagnostico/`. Cambiarlo rompe la medición | La palabra y la URL siguen siendo «diagnóstico». El texto del botón puede cambiar (ver §3) |
| Recorrido que acaba en «Reactivación» | El Content OS acaba en «Medición» | Siete etapas que acaban en reactivación. **La medición es Intelligence**, la capa que mira todo el recorrido. Se actualiza el Content OS (§4) |

## 1. Posicionamiento

**Qué es Qualivo (una frase):**
> Encontramos dónde se te escapan las oportunidades entre el anuncio y la venta, y montamos el sistema que las lleva hasta el cierre.

**Versión larga (para la página «Cómo funciona» y las propuestas):**
> Miramos todo lo que pasa desde que alguien muestra interés hasta que compra: la respuesta, la cualificación, el seguimiento, la cita, la venta y lo que viene después. Encontramos dónde se pierde negocio y montamos el sistema que lo corrige: agentes que hacen lo repetitivo, un CRM que dice qué toca, y tu equipo decidiendo lo importante. Y lo medimos todo.

**Promesa:** convertir más de las oportunidades que ya generas y, si hace falta, captar mejor.

**Diferencia:** sabemos qué está pasando en cada oportunidad, dónde se pierde y qué toca hacer después. Eso es Intelligence.

**Para quién:** empresas que ya invierten en captar (anuncios, comerciales, prospección) y tienen volumen suficiente para que una fuga cueste dinero. Formación, clínicas y servicios B2B, incluidos los equipos comerciales.

**Decide Maikel:** la frase corta. Es la base del H1 y de la bio de LinkedIn.

## 2. Message House

| Pilar | Mensaje para la web | Prueba que tenemos (fuente) |
|---|---|---|
| **Problema** | Pagas por oportunidades que se pierden antes de llegar a ventas | Blog y diagnóstico (fugas por etapa). Cada fuga contada lleva su dato (R1) |
| **Insight** | Un lead no se pierde de golpe. Se pierde en algún punto del recorrido | Calculadora de fugas (`/calculadora-de-fugas/`) |
| **Solución** | Conectamos captación, respuesta, cualificación, seguimiento, cita, venta y reactivación en un solo sistema | Las cuatro páginas de caso (`/casos/<nombre>/`) |
| **Mecanismo** | El agente hace lo que se repite. Tu equipo decide lo que importa | La demo de WhatsApp y el agente de voz. **Cuidado con R2 y R9:** no describir nuestro WhatsApp interno como «nada sale sin tu ok» mientras salga solo a los 10 minutos |
| **Control** | Qué está pasando, qué importa y qué hacer después. En una pantalla | Demo de Intelligence (`/intelligence/`, datos de ejemplo) |
| **Siguiente paso** | Te enseñamos dónde estás perdiendo oportunidades. Diagnóstico de 30 minutos | La llamada es de 30 minutos (cambio del 29-sep). Sin precio ni garantía en la web (R10) |

## 3. CTA único

- **Destino:** `/diagnostico/`, siempre. Con UTM en los enlaces propios.
- **Texto del botón principal (propuesta):** «Ver dónde pierdo oportunidades».
- **Secundario, solo en la home:** «Ver cómo funciona». Es un ancla a la sección del recorrido, no otra conversión.
- **Fuera de la home nueva:** «Agendar», «Contactar», «Demo» y «Ver agentes» como CTA principales.
- **Test previsto (backlog 2 de la revisión):** «Ver dónde pierdo oportunidades» contra «Quiero mi diagnóstico», cuando la home nueva esté publicada.

**Decide Maikel:** el texto del botón.

## 4. Arquitectura

La del Content OS (§6), con el orden de la revisión:

| Menú | Página | Estado hoy | Qué falta |
|---|---|---|---|
| Cómo funciona | `/como-funciona/` | Existe | Reescribirla sobre el recorrido de 7 etapas |
| Intelligence | `/intelligence/` | Demo noindex con datos ficticios | Página pública que la explique, con la demo enlazada y marcada como ejemplo |
| Casos | `/casos/` | **No existe como página.** Hay cuatro páginas de caso (`/casos/eac/`, `/casos/focus-practical/`, `/casos/bellovinilo/`, `/casos/nuria-roure/`) y la sección #casos de la home | Crear el índice `/casos/`. Reescribir cada caso como contexto, problema, fuga, cambio, resultado y aprendizaje. Separar captación de conversión |
| Sectores | `/formacion/`, `/clinicas/`, `/reformas/`, `/equipos-comerciales/` | Existen | Una página hub, `/sectores/`. Decidir la v1 o la v2 de equipos comerciales |
| Recursos | `/blog/`, `/calculadora-de-fugas/`, `/recursos/` | Existen | Juntarlos bajo «Recursos» |
| CTA | `/diagnostico/` | Existe | Nada |

**Etapas del recorrido (marco oficial, propuesta de ajuste al Content OS):** captación → respuesta → cualificación → seguimiento → cita → venta → reactivación, con **Intelligence midiendo todo el recorrido**.

**Agentes:** sin página propia en el menú. Aparecen en cada etapa del recorrido.

**`/para/`:** sigue como capa personalizada para outbound, fuera del menú.

**Decide Maikel:** el menú, y si Intelligence pasa a página pública.

## 5. Intelligence dentro de la marca

**Qué es:** la pantalla donde se ve cada oportunidad con su encaje, su intención y su riesgo, qué toca hacer ahora y por qué.

**Qué no es (guía interna):** un panel de gráficos ni un CRM nuevo. Va encima del CRM que ya tenga el cliente.

**Cómo se enseña:** como una ficha de decisión.
- **Arriba:** la oportunidad, su valor y su etapa.
- **En medio:** tres notas de 0 a 100 (encaje, intención, riesgo), como calcula `intelligence/js/motor.js`.
- **Abajo:** la siguiente acción y el porqué.

**Regla:** siempre con datos de ejemplo marcados como «Ejemplo». Nunca una captura con datos de un cliente.

## 6. Evidencia que podemos afirmar

| Caso | Qué demuestra | Tipo | ¿Se puede usar fuera de las páginas de caso? |
|---|---|---|---|
| **Nuria Roure** · 6,45× con los mismos contactos | Más negocio sin comprar más demanda: puntuación y priorización | **Conversión**. Es el que mejor encaja con la promesa | Solo con fila en `casos-permisos.md` (R6). Pedir el permiso escrito |
| **EAC** · ROAS 10,2× y 44.000 € atribuidos en un mes | Medir del anuncio a la matrícula | Captación más medición | Igual |
| **Focus Practical** · leads de electricista a 3 € | Captación barata y cualificada, todo automático | **Captación (Paid).** La revisión pide no venderlo como resultado del sistema | Igual. En la home, solo en el bloque de captación |
| **BelloVinilo** · 8,3× de retorno | Montar el motor desde cero | Captación | Igual |

**Cifras de la home publicada que no aparecen en ninguna página de caso** (hay que confirmar la fuente, R1):
- «1.160 leads y 21 matrículas en cuatro meses, partiendo de cero».
- «0,1 → 7,6 ROAS, rescatando una cuenta que perdía dinero».

**Pendiente:**
- Pedir el permiso escrito a los cuatro. Lo hace Maikel, y yo preparo el texto que tiene que aprobar cada uno.
- Hasta tenerlo, la home nueva usa los casos solo como enlaces a las páginas de caso, sin cifras grandes.
- La home publicada hoy ya los muestra. Eso lo decide Maikel (§12 del Content OS, D2).

## 7. Qué hago ahora sin ok

1. **Prototipo noindex en `/home-nueva/v3/`** con las tres piezas que pide la revisión (§34): hero vivo, recorrido vivo e Intelligence como ficha de decisión.
   - Datos de ejemplo marcados.
   - Móvil pensado aparte.
   - Respeta `prefers-reduced-motion`.
   - Capturas en móvil y escritorio, y Master Reviewer.
2. **Ajuste del Content OS:** recorrido de 7 etapas más Intelligence como medición.
3. **Nada en la home publicada** hasta que Maikel elija.

## 8. Lo que ha salido al documentar la web actual

Fuente: `content/web-copy-actual-2026-10-06.md` (39 páginas, 6-oct). Lo más grave, en orden:

1. **R2. La web describe un sistema que ya no funciona así.** Las páginas de sector, «Cómo funciona», automatización y home-nueva prometen «en dos minutos», «a cualquier hora» o «de noche y en fin de semana». Hoy, en nuestro propio sistema:
   - el primer WhatsApp a los A/B sale a los 10 minutos;
   - no se contesta de 21:30 a 8:00;
   - el copiloto está apagado.

   Hay que confirmar con Growth qué se configura en los sistemas de los clientes antes de reescribirlo.
2. **El diagnóstico se describe de seis formas.**
   - 30 minutos, con el plan en 24 h o en 48 h según la página.
   - En otras: 15 minutos, 90 segundos, dos semanas, gratis o «con precio cerrado».
3. **R10. Precio y garantía visibles.**
   - «Si no mejora el número que acordamos, no pagas el piloto», en la home y en `/diagnostico/`.
   - «Cifra cerrada» en Google Ads y Launch.
   - La cuota y otra garantía en el simulador de Intelligence.

   Es una decisión comercial de Maikel.
4. **R6. Resultados y logos de clientes fuera de las páginas de caso**, y `casos-permisos.md` sigue sin filas.
5. **Cifras que se contradicen:**
   - 4 o 5 casos;
   - 6, 7 u 8 agentes;
   - los «8 seg» atribuidos a EAC, que son de Focus Practical;
   - más oportunidades que leads en el embudo de EAC.
6. **R11:** rayas largas, «no es X, es Y» y lemas que se repiten («sin humo», «Lo agentizamos»).
7. **Botones y medición.** Casi todas las páginas interiores mandan «Solicitar diagnóstico» al formulario viejo de la home (`/#contacto`) y no a `/diagnostico/`. Así pierden el UTM y el origen.
8. **Borradores a la vista y sitemap desajustado:**
   - el banner de borrador en equipos comerciales;
   - `/hola/` es noindex pero está en el sitemap;
   - clínicas, reformas y asesorías no están en el sitemap.
