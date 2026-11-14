# Brief para Claude Design · retoque de UX de las landings v22 (22-oct)

> Para pegar en Claude Design. El objetivo es pulir, no rediseñar.
> Lo que salga de Design lo pasa Claude Code al generador de las dos landings, para que formación y reformas sigan alineadas.
> Nada se publica sin el ok de Maikel.

---

## 1. Prompt listo para pegar

> Eres diseñador/a senior de producto y conversión. Quiero un **último retoque de UX** de dos landings de Qualivo que ya están publicadas. Son la misma plantilla con el contenido de cada sector:
>
> - Formación: https://qualivo.io/formacion/v22/
> - Reformas: https://qualivo.io/reformas/v22/
>
> **No es un rediseño.** Se mantienen la marca, el copy, el orden de las secciones y las funciones. Lo que busco:
>
> 1. Que alguien que llega desde un **email en frío** o un **anuncio de Meta** entienda en 5 segundos qué hacemos y para quién.
> 2. Que la **demo por pestañas** (9 pestañas) se recorra sin esfuerzo, sobre todo en móvil.
> 3. Que el camino al **diagnóstico** sea evidente sin resultar insistente.
>
> Revísalas a 390 px y a 1280 px y dame:
>
> - **A.** Una lista de 10 cambios como máximo, ordenados por impacto, con el problema, el cambio y el porqué.
> - **B.** Mockups de móvil y escritorio de las tres zonas críticas: portada, demo por pestañas y bloque del formulario.
> - **C.** El CSS o HTML de cada cambio, respetando las clases e ids existentes (los tienes en la sección 5 del brief).
>
> Respeta las restricciones de la sección 4. Si algo te parece que debería cambiar y está restringido, propónlo aparte en lugar de aplicarlo.

---

## 2. Contexto

- **Qualivo:** conectamos captación y seguimiento comercial: anuncios, páginas, respuesta por WhatsApp con IA, citas, seguimiento y medición.
- **A quién va:**
  - dueños y directores de academias y centros de formación;
  - dueños de empresas de reformas, construcción e instalaciones.
  - No son técnicos. Muchos leen desde el móvil.
- **De dónde llegan:**
  - email de prospección en frío, con el enlace en la firma (formación);
  - anuncios de Meta.
  - No nos conocen.
- **Conversión:** formulario en 2 pasos (empresa, después datos) y, a continuación, reserva de una videollamada de 30 minutos. Lo secundario: WhatsApp y ver el vídeo.

## 3. Estructura actual (las dos páginas igual)

1. **Barra superior:** logo y botón «Descubre cómo captar más alumnos / conseguir más obras».
2. **Portada:**
   - **Izquierda:** eyebrow del sector, H1 con subrayado amarillo, entradilla, CTA principal y enlace «Ver cómo funciona ↓».
   - **Derecha:** vídeo del sistema del sector (70 s / 67 s) con su pie.
3. **Resultados:**
   - **Formación:** EAC (10,2× y 44.000 €) y Nail Boss (1.160 solicitudes y 21 matrículas).
   - **Reformas:** Bellovinilo (8,3×) y Antic Barcelona (visita en menos de 24 h).
   - Después, la fila de logos «Han trabajado con Qualivo», que debe verse grande.
4. **Problema y solución:** tres problemas y un flujo de 5 pasos (Atraer · Convertir · Responder · Facilitar la venta · Medir).
5. **Demo «Así se ve por dentro»** (fondo negro), con 9 pestañas y todo ficticio:
   1. **Anuncios:** tabla con solicitudes, encaje, citas y ventas, más «Qué revisamos».
   2. **Formulario:** las preguntas del anuncio y lo que entra en el CRM.
   3. **WhatsApp:** móvil interactivo con 3 ramas y la columna «Por detrás».
   4. **Llamada:** audio de 40 s, transcripción y reglas. Estado: «Simulación · opcional».
   5. **Ficha:** dos notas («Quién es» y «Qué hace»), nivel A, resumen y siguiente paso.
   6. **Citas:** las de la semana, con estado.
   7. **Seguimientos:** 4 situaciones (A-D) en línea de tiempo.
   8. **Dónde se pierden:** cifras clave, recorrido en barras y fugas.
   9. **Qué hacer hoy:** lista priorizada (Urgente / Alta / Media).
6. **Diagnóstico** (formulario, después de la demo):
   - **Izquierda:** qué pasa después, huecos libres, Maikel y la línea de WhatsApp.
   - **Derecha:** formulario en 3 pasos.
7. **Qué recibe tu centro o empresa:** 3 fases y lo que incluye.
8. **Preguntas frecuentes.**
9. **Pie, botón flotante de WhatsApp y CTA fijo en móvil.**

**Referencias de estilo que gustan a Maikel:**
- la demo de la home: https://qualivo.io/#demo
- la demo de Hunty: https://qualivo.io/propuestas/hunty/demo/

## 4. Restricciones (no se tocan)

- **Marca:**
  - tipografía Montserrat;
  - un solo estilo de botón, amarillo `#F4CC38` con texto `#101319`;
  - verde `#0E7C74` y verde claro `#27BDB1`;
  - fondo marfil `#FAF7F0`, segundo marfil `#F2EDE2`, negro `#08090C`, tinta `#101319`, gris `#5A5E66`.
- **Copy aprobado:** H1, entradillas, problemas, guiones de WhatsApp y de voz. Se pueden proponer recortes o jerarquía, pero no se reescribe el mensaje.
- **Sin precios** en la página (decisión de Maikel, de momento).
- **Demo siempre identificada como ejemplo:** se mantienen las etiquetas «Ejemplo · datos simulados». La llamada de voz se queda como «Simulación · opcional», con su recuadro de estado.
- **Sin afirmaciones nuevas:** ni cifras, ni garantías, ni «compatible con cualquier CRM», ni testimonios inventados.
- **Formulario:** no cambian los campos, los `name` ni los ids (`#f #p1 #p2 #p3 #p4 #b1 #b2 #e1 #e2 #cal #reservado #huecos`). Las opciones de importe tienen valores que lee el CRM.
- **Pestañas accesibles:**
  - `role=tab/tabpanel`, navegación con flechas y foco visible;
  - contraste AA;
  - zonas táctiles de 44 px como mínimo.
- **Rendimiento:** HTML y CSS propios, sin frameworks ni librerías nuevas. El vídeo carga solo los metadatos hasta que se pulsa.
- **Móvil a 390 px** sin scroll horizontal. El CTA fijo de abajo y el botón de WhatsApp no deben tapar contenido clave.

## 5. Clases útiles (para que el CSS que propongas encaje)

| Zona | Clases e ids |
|---|---|
| Portada | `.hero`, `.grid-h`, `h1 .subr`, `.lead`, `.ctas`, `.btn`, `.btn-link`, `.micro`, `figure.vsl#vsl > .vsl-marco > video#vid` |
| Resultados | `.res`, `.casos`, `.caso.eac` (oscuro), `.caso.nail` (claro), `.big`, `.lbl`, `.ctx`, `.logos .fila img` |
| Problema | `#sistema`, `.problemas .pb`, `.solucion .flujo li` |
| Demo | `#demo`, `.vistas [role=tab]`, `.vista[role=tabpanel]`, `.claro` (ventana clara con `.bar`), `.caja-d` (caja oscura), `.vtabla`, `.vd.si/.mm/.no`, `.tel .chat .msg.bot/.yo/.sis`, `.opciones button`, `.log li`, `.voz .linea`, `.audio-d`, `.ficha .notas .campos .resumen`, `.citas .cita`, `.segs button`, `.tl li`, `.panel .pk .emb .et .fugas .fu`, `.hys .hy .pr`, `.nota-img` |
| Formulario | `#diagnostico`, `.grid-f`, `.despues`, `.maikel`, `.caja-f`, `.pasos-f`, `.campo`, `.dos`, `.rgpd` |
| Fijos | `.top`, `.fijo` (CTA móvil), `.wa` (WhatsApp flotante) |

## 6. Dudas que nos gustaría que Design resolviera

1. **9 pestañas:** ¿agruparlas en 3 bloques («Captar · Atender · Seguir y medir»), poner un indicador de progreso o dejar un botón «Siguiente →» al final de cada pestaña, como en Hunty?
2. **Demo en móvil:** ¿pestañas con scroll horizontal o un selector desplegable?
3. **Portada:** con el vídeo a la derecha, ¿el CTA principal destaca lo suficiente? ¿Hace falta prueba social (logos o una cifra) por encima del pliegue?
4. **Ritmo:** la página es larga. ¿Qué sección se puede compactar sin perder confianza?
5. **Formulario:** ahora va después de la demo. ¿Basta con el CTA de la barra y el de la portada, o añadimos un CTA intermedio al final de la demo?
6. **Logos:** ¿cómo darles más peso (son clientes importantes) sin que compitan con los casos?

## 7. Cómo lo devolvemos

- **Lo que hay que pasar a Claude Code:**
  - la lista A;
  - los mockups B, en capturas o enlace;
  - el CSS y HTML de C.
- **Qué hace Claude Code:** lo aplica en el generador (las dos landings a la vez), lo prueba a 390 y 1280 px sin errores y lo publica como borrador noindex para el ok de Maikel.
- **Lo que no se aplica sin consultar:** lo que choque con la sección 4.
