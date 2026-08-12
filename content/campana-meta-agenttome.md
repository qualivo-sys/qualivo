# Campaña Meta — Agent to Me · Fase Discovery

> **Objetivo real: aprender, no escalar.** Agent to Me tiene 0 clientes, 0 casos y una categoría sin demanda de búsqueda. Esta campaña es un laboratorio de mensajes: con 500-900 € descubrimos en 2 semanas qué dolor mueve al ICP. Se rige por `growth-os.md` (métrica de resultado > vanidad) y `guia-de-voz.md` (sin jerga).

## 0. Antes de gastar un euro — bloqueantes

| # | Bloqueante | Estado | Quién |
|---|---|---|---|
| 1 | **Píxel de Meta + API de Conversiones** en agenttome.io | ❌ no instalado | Maikel da el Pixel ID → yo lo monto en 10 min |
| 2 | **Banner de consentimiento (RGPD)** — el píxel obliga a pedirlo | ❌ no existe (hoy solo Vercel Analytics, sin cookies) | Yo lo monto (patrón de qualivo.io) |
| 3 | **Destino del tráfico frío** → `/company-scan/`, no el formulario | ✅ ya existe | — |
| 4 | Cuenta publicitaria + método de pago + página de Facebook de AtM | ⚠️ verificar | Maikel |
| 5 | Eventos definidos: `Lead` (scan completado) y `Contact` (formulario) | ❌ | Yo, con el píxel |

**La decisión de CRO más importante:** el tráfico frío NO va al formulario ("cuéntanos tu trabajo repetitivo" = pedir 30 min de llamada a un desconocido). Va al **Company Scan**: 2 minutos, respuesta personalizada, deja email para ver el resultado, y **auto-segmenta el lead** (tag `scan-<empleado>` en GHL). Bajar la fricción aquí puede multiplicar por 3-5 los leads del mismo presupuesto.

---

## 1. ICP para Meta (no es el mismo que para outbound)

Meta es débil en cargos B2B, pero **fuerte para llegar a dueños de PYME** — están en Instagram y Facebook, no en LinkedIn Sales Navigator.

**ICP primario:** dueño/gerente de empresa de servicios de **10-50 empleados** en España. Sectores con dolor visible: clínicas y centros médicos · despachos y asesorías · reformas/instalaciones · academias y formación · inmobiliarias · ecommerce con equipo · agencias.

- **Cargo:** fundador, gerente, director de operaciones. Decide solo o con un socio.
- **Madurez:** el negocio funciona, factura, tiene equipo — y está en el punto donde crecer significa contratar.
- **Qué intenta conseguir:** crecer sin que la estructura (y la nómina) crezca igual de rápido.
- **Qué le quita el sueño:** que las cosas dependan de que alguien se acuerde. Que se le escapen cobros y oportunidades. Contratar y equivocarse.
- **Alternativas que usa hoy:** contratar a alguien más (junior o becario) · un asistente virtual freelance · "cuando pueda me pongo con la IA" · Excel + fuerza de voluntad · una agencia de automatizaciones que le montó un flujo que ya nadie mantiene.
- **Por qué no le funcionan:** contratar es caro, lento y rota; el freelance requiere gestión; las automatizaciones se rompen y no hay responsable; la IA por su cuenta se le queda en jugar con ChatGPT.
- **Confía si:** ve el producto funcionando (demostración > promesa), habla con una persona, hay un número claro y puede empezar pequeño.
- **Desconfía si:** huele a humo de IA, no entiende qué compra, o le piden un compromiso grande de entrada.

### Tipos de problema
- **Funcional:** el trabajo repetitivo no se hace, o se hace tarde y mal.
- **Económico:** 25-35 k€/año por contratar para tareas mecánicas + dinero parado en impagos + oportunidades sin seguir.
- **Emocional:** ansiedad de que todo dependa de él; culpa por no llegar; sensación de estar quedándose atrás con la IA.
- **Estratégico:** cada escalón de crecimiento exige estructura; el margen se come a sí mismo.
- **Tiempo:** el dueño acaba haciendo tareas de 12 €/hora.
- **Riesgo:** contratar mal cuesta meses; automatizar mal deja procesos rotos sin dueño.

---

## 2. Mapa de dolores (los 5 con más potencial publicitario)

| Pain | Intens. | Frec. | € | Emoción | Deseo asociado |
|---|---|---|---|---|---|
| **P1 · "Voy a tener que contratar a alguien para esto"** | 9 | Trimestral (pico) | 25-35 k/año | Miedo a equivocarse | Crecer sin ampliar nómina |
| **P2 · "Mi gente buena hace trabajo de becario"** | 8 | Diaria | Coste de oportunidad alto | Frustración | Que su equipo haga lo que sabe hacer |
| **P3 · "Se me escapan cosas"** (impagos, seguimientos, leads) | 9 | Semanal | Directo y medible | Culpa/agobio | Que nada dependa de acordarse |
| **P4 · "Todo depende de que alguien se acuerde"** | 7 | Constante | Indirecto | Ansiedad del dueño | Un sistema que aguante solo |
| **P5 · "Con la IA me estoy quedando atrás y no sé por dónde empezar"** | 7 | Mensual | Futuro | Vergüenza social | Sentirse al día sin perder meses |

**Dolores ocultos (los que no dicen en voz alta):** "me da vergüenza reconocer que llevo la empresa con notas en el móvil" · "no sé si mi comercial trabaja de verdad las 8 horas" · "he pagado por automatizaciones que ya no usa nadie" · "tengo miedo de que un empleado se vaya y se lleve el conocimiento".

---

## 3. Jobs to be Done

- **Funcional:** que el trabajo repetitivo se haga siempre, sin recordárselo a nadie.
- **Emocional:** dejar de sentir que el negocio se sostiene por su memoria.
- **Social:** que le vean como el que va por delante, no como el que "aún hace todo a mano".
- **Trigger:** está a punto de publicar una oferta de empleo · se le escapa un cobro grande · un empleado clave se va o se coge la baja · un competidor le dice que usa IA · pico de trabajo que no absorbe.
- **Momento de máximo dolor:** el domingo por la noche poniéndose al día con lo administrativo, o el día que descubre cuánto lleva sin cobrar.

---

## 4. Objeciones → mensaje → prueba

| Objeción | Insight | Mensaje | Prueba | Creativo |
|---|---|---|---|---|
| "Será carísimo" | Compara con software, no con sueldo | "Desde 199 €/mes. Un becario cuesta eso en tres días." | Tabla de costes | Estático comparativa |
| "No me fío de la IA con mis clientes" | Teme el ridículo, no la tecnología | "Empieza supervisado: tú apruebas todo hasta que te fíes." | Explicar el modo supervisado | Talking head founder |
| "Mi negocio es especial" | Cree que su proceso es único | "Si ocurre 100 veces al mes y sigue un patrón, encaja. Si no, te lo decimos." | El scan personalizado | Quiz / carrusel |
| "No tengo tiempo para montarlo" | Ha vivido implantaciones eternas | "2-4 semanas. Tú decides, nosotros montamos." | Proceso en 5 pasos | Carrusel |
| "Ya tengo automatizaciones" | Las tiene rotas y sin dueño | "Una automatización ejecuta una tarea. Un empleado ocupa el puesto y responde por él." | Tabla tarea vs puesto | Estático comparativa |
| "Me quitará puestos de trabajo" | Miedo real del equipo | "No viene a quitarle el trabajo a tu equipo. Viene a quitarle el que odia." | Reporta a una persona | Talking head |
| "Ahora no" | Sin urgencia | Trigger de contratación: "antes de publicar esa oferta…" | Coste de la contratación | Estático oferta tachada |

---

## 5. Ángulos (14 hipótesis distintas)

| # | Ángulo | Insight | Pain | Hook base | Awareness | Formato |
|---|---|---|---|---|---|---|
| A1 | **El coste de contratar** | Compara con sueldo, no con software | P1 | "Antes de publicar esa oferta de empleo, mira esto" | Problem | Estático comparativa |
| A2 | **La tarea concreta** | El dolor es específico, no abstracto | P3 | "¿Cuántas horas al mes se van en perseguir facturas?" | Problem | Vídeo simple / estático |
| A3 | **Tu gente buena** | Duele pagar bien por trabajo mecánico | P2 | "Tu mejor comercial pasa 2 h al día copiando datos. Le pagas por vender." | Problem | Talking head |
| A4 | **Contrarian anti-IA** | Hay fatiga de "IA" | P5 | "Tu empresa no necesita más IA. Necesita que el trabajo se haga." | Solution | Talking head |
| A5 | **Demo en directo** | El producto ES una pantalla | P1-P4 | "Esto lo hizo solo mientras dormíamos" | Solution | Screen recording ⭐ |
| A6 | **Coste de no actuar** | Pérdida > ganancia | P3 | "Las facturas no se cobran solas" | Problem | Estático número |
| A7 | **Comparativa** | Ayuda a decidir | P1 | "Contratar vs equipo digital" | Product | Estático tabla |
| A8 | **Build in public** | Autoridad sin casos | P5 | "Estoy montando esta empresa en público. Este es el empleado que la vende." | Solution | Talking head/serie |
| A9 | **El test (scan)** | Curiosidad + personalización | Todos | "¿Qué empleado digital necesita tu empresa? 2 minutos." | Problem | Carrusel/estático ⭐ |
| A10 | **El error habitual** | Educar da autoridad | P4 | "Automatizar el caos solo acelera el caos" | Problem | Carrusel |
| A11 | **La lista** | Identificación por checklist | P2-P4 | "Si tu equipo hace 5 de estas 8 cosas, tienes un puesto digital esperando" | Problem | Carrusel ⭐ |
| A12 | **POV sectorial** | Máxima relevancia | P3 | "POV: tienes una clínica y alguien tiene que llamar a los que no vinieron" | Unaware | Vídeo POV |
| A13 | **El domingo por la noche** | Momento de máximo dolor | P4 | "Son las 22:40 de un domingo y estás conciliando facturas" | Unaware | Vídeo/estático |
| A14 | **Autoridad prestada** | Qualivo tiene números | P5 | "La consultoría que publica sus números ahora monta equipos digitales" | Solution | Talking head |

### Ranking (pain × ICP × diferenciación × CTR × conversión × facilidad × escala)

| Pos | Ángulo | Nota | Por qué |
|---|---|---|---|
| 1 | **A1 Coste de contratar** | 9,0 | Dolor caro, trigger claro, produce en 20 min, número irrefutable |
| 2 | **A5 Demo en directo** | 8,7 | Prueba sin casos; nadie más puede enseñar esto |
| 3 | **A9 El test** | 8,6 | Fricción mínima, auto-segmenta, curiosidad alta |
| 4 | **A3 Tu gente buena** | 8,3 | Identificación instantánea del dueño |
| 5 | **A6 Coste de no actuar** | 8,0 | Número duro y compartible |
| 6 | **A11 La lista** | 7,8 | Carrusel barato, alto guardado |
| 7 | **A4 Contrarian** | 7,5 | Diferencia frente a la manada de la IA |
| 8 | **A13 Domingo noche** | 7,4 | Emocional puro, gran gancho de vídeo |

---

## 6. Los 6 creativos a producir primero (fase 1)

### C1 · Estático comparativa — "Antes de publicar esa oferta" (A1)
- **Visual:** captura de una oferta de empleo genérica ("Se busca administrativo/a — 20.000 €/año") con un tachón rojo diagonal. Debajo, dos columnas: **Contratar** (28.000 €/año · 3-6 meses de rampa · rota · jornada) vs **Empleado digital** (desde 199 €/mes · 2-4 semanas · no rota · 24/7).
- **Texto en pantalla:** máximo 12 palabras. Dato en amarillo/verde de marca.
- **Producción:** 20 minutos con el sistema de diseño. Ratio 4:5 y 1:1.

### C2 · Screen recording — "Mientras dormías" (A5) ⭐
- **Hook visual (0-2 s):** pantalla del panel con la hora "03:14" y actividad moviéndose sola.
- **Desarrollo:** 15-20 s de la secuencia real: empresa detectada → decisor localizado → mensaje personalizado → reunión agendada. Sin voz o con voz de Maikel de fondo.
- **Cierre:** "Nadie estaba delante del ordenador." + logo.
- **Producción:** grabación de pantalla del propio SDR cliente-cero. Requiere que el SDR esté rodando (dependencia).

### C3 · Talking head Maikel — "Tu mejor comercial" (A3)
- **Escena:** Maikel en su sitio de trabajo, plano cercano, 30-40 s.
- **Guion:** "Tu mejor comercial cobra 2.000 € al mes por vender. Y se pasa dos horas al día metiendo datos en el CRM. / No es culpa suya: alguien tiene que hacerlo. / Nosotros ponemos a un empleado digital a hacer esa parte. Tu comercial vuelve a vender. / Si quieres saber qué parte del trabajo de tu equipo se puede quitar de encima, hay un test de dos minutos en agenttome.io."
- **Subtítulos quemados**, sin música. Ratio 9:16 + 4:5.

### C4 · Carrusel — "8 tareas que ya no contratarías" (A11)
- 1 portada + 8 tarjetas (una tarea por tarjeta, con su coste en horas/mes) + cierre con el test.
- Reutiliza el diseño de las tarjetas de AtM. **Producción: 40 minutos.**

### C5 · Estático número — "Las facturas no se cobran solas" (A6)
- Número gigante (p. ej. "23 impagos") + línea: "Alguien tiene que perseguirlos. Ya no tienes que ser tú." Fondo oscuro, verde de marca.

### C6 · Vídeo POV sectorial — clínicas (A12)
- Grabado con móvil, 15 s: teléfono sonando sin contestar, agenda con huecos, post-it de "llamar a los que no vinieron".
- Texto: "Cada hueco sin llamar es dinero que no vuelve."

---

## 7. Copys (para los 3 primeros)

### C1 — Coste de contratar
**Primary text A (económico):** Antes de publicar esa oferta de empleo, echa la cuenta. Un administrativo cuesta unos 28.000 € al año entre sueldo y cargas. Y de todo lo que va a hacer, la mitad es mecánico: perseguir facturas, actualizar el CRM, preparar informes. Esa mitad la puede ocupar un empleado digital desde 199 €/mes. Trabaja 24/7, no rota y reporta a alguien de tu equipo. → Haz el test de 2 minutos y te decimos qué puesto encaja en tu empresa.

**Primary text B (miedo al error):** Contratar para trabajo repetitivo es la forma más cara de resolver un problema barato. Tres meses hasta que produce, rotación cada año y media, y una nómina que no baja cuando baja el trabajo. Hay tareas que sí necesitan una persona. Y otras que no. → Descubre cuáles en 2 minutos.

**Primary text C (identificación):** "Necesito a alguien que me lleve todo esto." Lo escuchamos cada semana. Y casi siempre "todo esto" son cuatro tareas repetitivas que nadie quiere hacer. → Test de 2 minutos: qué parte del trabajo de tu empresa puede ocupar un empleado digital.

**Headlines:** 1) "28.000 €/año o 199 €/mes" · 2) "Antes de contratar, haz este test" · 3) "El trabajo repetitivo ya no necesita nómina"
**CTA:** "Más información" / "Obtener oferta"

### C3 — Tu gente buena
**Primary A:** Le pagas por vender. Se pasa dos horas al día metiendo datos. / **Primary B:** El trabajo que odia tu equipo es exactamente el que mejor hace una máquina. / **Primary C:** No necesitas más gente. Necesitas que la que tienes deje de hacer trabajo de becario.

### C9/A9 — El test
**Primary A:** 10 preguntas. 2 minutos. Te decimos qué puesto de tu empresa puede ocupar un empleado digital, cuántas horas al mes te libera y cuánto cuesta hoy ese trabajo. Gratis y sin llamada. / **Primary B:** ¿Qué empleado digital necesita tu empresa? Marca lo que se repite en tu día a día y te lo decimos.

---

## 8. Dirección visual (toda la campaña)

- **Hook visual en los primeros 1-3 s:** un número, una tachadura o movimiento en pantalla. Nunca logo primero.
- **Jerarquía:** dato/frase corta → contexto → marca (pequeña, abajo).
- **Tipografía:** Inter Tight/Inter en negrita alta, mucho contraste. Mono solo para etiquetas.
- **Paleta:** blanco o negro (#08090C) de fondo + verde de marca (#0FA968/#3ECF8E) para el dato. Nada de degradados morados tipo "IA" — precisamente para no parecer la manada.
- **Texto en pantalla:** máximo 12-14 palabras por creativo estático.
- **Branding:** logo pequeño abajo. La marca no vende todavía; el dolor sí.
- **Ratios:** 4:5 y 1:1 para estáticos; 9:16 para vídeo. Subtítulos quemados siempre.

---

## 9. Estructura de campaña y matriz de testing

**Fase 1 · Discovery (días 1-14)**
- 1 campaña, objetivo **Clientes potenciales** optimizando a `Lead` (scan completado). Si no hay volumen suficiente en 5 días → optimizar a `ViewContent` de la página del scan y revisar.
- **1 conjunto de anuncios** con público amplio (España, 28-60, sin intereses o Advantage+). En B2B pequeño, la segmentación por intereses de Meta empeora resultados: que el creativo haga la segmentación.
- **6 anuncios = 6 ángulos** (C1-C6). Misma oferta (Company Scan), mismo destino. **Solo cambia el ángulo.**
- **Presupuesto:** 30 €/día × 14 días = **420 €**. Mínimo viable: 20 €/día.
- **Variable testada: ÁNGULO.** Nada más.

**Fase 2 · Validation (días 15-24):** los 2 ángulos ganadores × 3 hooks distintos cada uno = 6 anuncios. Variable: **HOOK**.
**Fase 3 · Iteration (días 25-35):** ángulo+hook ganador × 3 formatos (estático, vídeo, carrusel). Variable: **FORMATO**.
**Fase 4 · Scaling:** subir presupuesto 20-30 % cada 3 días sobre el ganador; abrir retargeting (visitantes del scan sin completar + los que completaron sin pedir llamada).

### Reglas de decisión
- **Ganador:** ≥15 conversiones (scan completado) con CPL por debajo de la media del conjunto **y** leads que encajan con el ICP al revisarlos a mano. Un ángulo con CPL bajo y leads basura **se mata**.
- **Matar:** 3× el CPL objetivo sin conversión, o CTR < 0,8 % con >2.000 impresiones.
- **No tocar antes de:** 3-4 días o 50 € gastados por anuncio. Nada de apagar creativos a las 6 horas.
- **Aprendizaje aunque no convierta:** qué ángulo tiene mejor CTR (atención), cuál mejor tasa de completado del scan (relevancia real), y qué empleado sale más recomendado en los scans (¡eso dice qué producto pide el mercado!).

### Métricas, en este orden
1. **Conversaciones cualificadas y reuniones** (resultado)
2. Leads del scan que encajan con el ICP (calidad)
3. Coste por scan completado (eficiencia)
4. Tasa de completado del scan (relevancia del mensaje)
5. CTR y CPM (solo como diagnóstico, nunca como objetivo)

---

## 10. Los 10 anuncios iniciales

| ID | Pain | Ángulo | Hook | Formato | Hipótesis |
|---|---|---|---|---|---|
| AD-01 | P1 | A1 | "Antes de publicar esa oferta de empleo…" | Estático comparativa | El trigger de contratación mueve más que el beneficio genérico |
| AD-02 | P1 | A1 | "28.000 €/año o 199 €/mes" | Estático número | El contraste de precio ancla mejor que la explicación |
| AD-03 | P2 | A3 | "Le pagas por vender. Se pasa 2 h copiando datos." | Talking head | La identificación con el equipo supera al argumento económico |
| AD-04 | P3 | A6 | "Las facturas no se cobran solas" | Estático número | El coste de no actuar convierte mejor que el beneficio de actuar |
| AD-05 | Todos | A9 | "¿Qué empleado digital necesita tu empresa? 2 min" | Carrusel | La oferta de bajo compromiso gana al mensaje de producto |
| AD-06 | P2-P4 | A11 | "Si tu equipo hace 5 de estas 8 cosas…" | Carrusel | El checklist genera identificación y guardado |
| AD-07 | P1-P4 | A5 | "Esto lo hizo solo mientras dormíamos" | Screen recording | La demostración sustituye a los casos que no tenemos |
| AD-08 | P5 | A4 | "Tu empresa no necesita más IA" | Talking head | El contrarian corta la fatiga de IA en el feed |
| AD-09 | P4 | A13 | "22:40 de un domingo, conciliando facturas" | Vídeo móvil | El momento de máximo dolor supera al argumento racional |
| AD-10 | P3 | A12 | "POV: tienes una clínica y nadie llama a los que no vinieron" | Vídeo POV | La hiper-relevancia sectorial bate al mensaje generalista |

---

## 11. Qué producir primero (mañana)

1. **AD-01 y AD-02** (estáticos de coste de contratar) — 40 minutos con el sistema de diseño. Los hago yo.
2. **AD-05 y AD-06** (carruseles del test y la lista) — 1 hora. Los hago yo.
3. **AD-03 y AD-08** (los dos talking heads) — **dependen de Maikel**: 10 minutos de grabación con el móvil, guiones ya escritos arriba.
4. **AD-07** (demo del SDR) — depende de que el SDR cliente-cero esté rodando.

**Con 4 creativos (AD-01, 02, 05, 06) ya se puede arrancar la fase 1** — no hay que esperar a tenerlos los diez.

## 12. Hipótesis principales que valida esta campaña

- **H1:** el trigger "estás a punto de contratar" convierte mejor que cualquier mensaje de producto.
- **H2:** el Company Scan (2 min, sin llamada) multiplica los leads frente a pedir contacto directo.
- **H3:** la demostración en pantalla sustituye a los casos que aún no existen.
- **H4:** el ICP de Meta (dueños de PYME de servicios) responde mejor que el vertical formación que usamos en outbound.
- **H5:** el empleado más recomendado en los scans nos dirá qué producto construir/vender primero — el mercado eligiendo por nosotros.
