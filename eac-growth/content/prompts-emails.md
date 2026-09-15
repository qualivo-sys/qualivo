# EAC · Prompts para montar los emails

Para usar con el generador de IA de GoHighLevel, con ChatGPT o con Claude.
El **prompt maestro** va siempre delante; después se añade el prompt del email concreto.

---

## 1 · PROMPT MAESTRO (pégalo siempre primero)

```
Eres redactor de email marketing de la Escola Aeronàutica de Catalunya (EAC),
un centro de formación aeronáutica en Barcelona. Formáis a:

- TCP / auxiliar de vuelo (certificado oficial reconocido por AESA)
- Azafata de tierra y operaciones aeroportuarias
- Despachador de vuelo (flight dispatcher)

QUIÉN LEE ESTOS EMAILS
Personas de 18 a 45 años que han dejado sus datos en la web tras hacer un test
o pedir una guía. Están explorando, no decididas. Muchas tienen dudas sobre si
cumplen los requisitos, sobre el precio y sobre si la profesión tiene futuro real.

TONO
- Cercano y directo, de tú. Nada de "estimado alumno" ni corporativismo.
- Orientado a la salida laboral: la gente quiere trabajar, no estudiar.
- Honesto por encima de vendedor. Si algo tiene una pega, se dice.
- Aspiracional pero realista. Nada de "cumple tu sueño de volar".
- Frases cortas. Cero relleno.

REGLAS DE ESCRITURA
1. Empieza por lo útil, no por el saludo largo. La primera frase ya aporta algo.
2. Una sola idea por email. Un solo CTA.
3. Usa {{contact.first_name}} una vez, al principio. No lo repitas.
4. Entre 120 y 220 palabras. Si no cabe, sobra.
5. Asunto de menos de 50 caracteres, sin mayúsculas gritadas ni "!!".
6. Texto de vista previa distinto del asunto, que amplíe y no repita.
7. Termina con un CTA de una línea, en imperativo y concreto.

PROHIBIDO
- Inventar cifras de sueldo, plazos, porcentajes de empleo o datos de mercado.
  Si hace falta un número, escribe [DATO A CONFIRMAR] y sigue.
- Prometer o insinuar empleo garantizado. Quien contrata es la aerolínea.
- Llamar "título" u "homologación" al certificado. Es el certificado oficial
  de tripulante de cabina de pasajeros reconocido por AESA.
- Presión falsa: "últimas plazas", cuentas atrás, "solo hoy".
- Emojis más allá de uno ocasional (✈️) en el asunto.

FORMATO DE SALIDA
Asunto:
Vista previa:
Cuerpo: (párrafos cortos, negritas solo donde aporten, listas si ayudan)
CTA: (texto del botón)
```

---

## 2 · SECUENCIA S1 · Test de requisitos TCP (14 días)

### D0 — Entrega del resultado del test
```
Escribe el email de entrega. La persona acaba de completar un test de 6 preguntas
sobre si cumple los requisitos para ser TCP. Recuerda los seis requisitos
(mayor de 18, ESO, inglés funcional, saber nadar, certificado médico aeronáutico
y certificado oficial de AESA), deja claro que ninguno exige carrera ni experiencia,
y señala que el certificado es el único innegociable. Anticipa que en los próximos
días le contarás qué mira de verdad una aerolínea, cuánto se gana y cómo distinguir
un curso oficial. CTA al artículo de requisitos.
```

### D0b — Entrega de la calculadora de sueldo
```
Variante de entrega para quien ha usado la calculadora de sueldo en vez del test.
Explica de qué depende la horquilla que acaba de ver: el radio manda (largo radio
suma dietas y pernoctas que el corto no genera), la prima por hora de vuelo, los
idiomas y la promoción a sobrecargo. Cierra recordando que nada de eso se activa
sin el certificado. CTA al artículo de sueldos.
```

### D0c — Entrega de la guía de selección
```
Variante de entrega para quien ha pedido la guía del proceso de selección.
Mensaje central: la mayoría de candidatos no cae por los requisitos, cae en la
dinámica de grupo, donde no se evalúa la solución al caso sino cómo se comporta
con el grupo. Menciona que observan desde la sala de espera. CTA al artículo
de la entrevista.
```

### D1 — Mitos
```
Desmonta tres creencias que frenan a candidatos válidos: la altura mínima (se
evalúa el alcance a los compartimentos, no la altura), los tatuajes (depende de
cada aerolínea, la norma es que no sean visibles con el uniforme) y la carrera
universitaria (no hace falta). Cierra diciendo que el requisito que de verdad
deja gente fuera es el inglés hablado, que se evalúa en la entrevista.
CTA al artículo de requisitos.
```

### D3 — Sueldo
```
Explica por qué dos TCP de la misma promoción cobran distinto: la nómina son
cuatro partidas (base, dietas, prima por hora de vuelo y pluses) y solo la
primera es fija. El radio es lo que más separa dos nóminas. Los idiomas abren
las bases mejor pagadas. CTA a la calculadora de sueldo.
```

### D5 — Curso oficial
```
Tema: cómo distinguir un curso que sirve de uno que no. Da al lector una
pregunta concreta que pueda hacer por escrito a cualquier centro: "¿Qué documento
exacto recibo al terminar y quién lo reconoce?". Aclara que "homologado" o
"titulación propia" no significan oficial y que sin el certificado reconocido
por AESA no se puede volar. Menciona que una formación completa incluye prácticas
reales de evacuación, fuego y supervivencia en el agua. Sin atacar a ningún
competidor por su nombre. CTA al artículo del certificado.
```

### D8 — Proceso de selección
```
Explica las cuatro fases de una selección típica: criba de CV, entrevista o vídeo
en inglés, dinámica de grupo y entrevista final con prueba de alcance. Detalla
qué suma y qué descarta en la dinámica de grupo. CTA al artículo de la entrevista.
```

### D11 — Precio
```
Habla de dinero sin rodeos. Tres ideas: el precio se compara por lo que incluye
(no por el importe), hay gastos que van aparte (reconocimiento médico, tasas),
y se puede fraccionar. Argumenta que empezar ya con pago fraccionado suele salir
mejor que esperar a una convocatoria que forme gratis y perder una temporada de
contratación. No inventes importes: escribe [PRECIO A CONFIRMAR] si hace falta.
CTA a pedir el desglose.
```

### D14 — Cierre a llamada
```
Email de cierre. Recapitula en una línea lo que ha visto en la secuencia y
propón una llamada de 10 minutos para aplicarlo a su caso. Enumera qué se
resuelve en esa llamada: próxima convocatoria, qué incluye el curso y qué
certificado obtiene, precio y financiación, y qué aerolíneas están contratando.
Añade una salida digna: si decide que no es su momento, que lo diga y no se le
insiste. CTA a reservar llamada.
```

---

## 3 · SECUENCIA S2 · Despachador de vuelo (9 días)

### D0 — Temario
```
Entrega del temario del curso de despachador de vuelo. Explica qué hace el puesto
(planifica y autoriza cada vuelo junto al comandante: ruta, combustible,
meteorología y carga, desde el centro de operaciones) y lista los bloques del
programa. Destaca que es el área con mejor relación entre demanda y número de
profesionales formados. CTA a la página del curso.
```

### D2 — No es controlador aéreo
```
Aclara la confusión más habitual. El controlador trabaja para el proveedor de
navegación aérea y gestiona en tiempo real el tráfico de todas las aeronaves;
requiere licencia oficial y un proceso selectivo larguísimo. El despachador
trabaja para una aerolínea y planifica y sigue los vuelos de su compañía; se
accede con formación específica y selección privada. Traducción: uno es una
carrera de años con miles de aspirantes por plaza, el otro una vía realista en
meses. CTA a la comparativa.
```

### D5 — Perfil
```
Ayuda al lector a autoevaluarse. Encaja si se le dan bien los datos y los
procedimientos, quiere trabajar en aviación sin volar, busca estabilidad y tiene
buen inglés técnico. Encaja mal si lo que le atrae es viajar o prefiere el trato
constante con público, y en ese caso menciona que hay otras dos vías en el sector.
CTA a hablar con un asesor.
```

### D9 — Cierre
```
Cierre a llamada de 10 minutos: próxima convocatoria, contenido del curso, precio
y financiación, y salidas reales en aerolíneas, handling y aviación ejecutiva.
Sin compromiso. CTA a reservar llamada.
```

---

## 4 · SECUENCIA S3 · Perfil cabina o tierra (9 días)

### D0 — Comparativa
```
Entrega de la comparativa de las tres vías. Cabina (TCP): mejor potencial de
ingresos y proyección, a cambio de noches fuera y turnos irregulares, con
certificado obligatorio. Tierra: acceso más rápido, contratación continua, base
fija, sueldo de entrada más contenido. Operaciones (despachador): trabajo técnico
de oficina, horario más previsible, muy pocos profesionales formados compitiendo.
Cierra diciendo que la pregunta que decide no es cuál es mejor sino cuánto puede
estar fuera de casa. CTA al artículo comparativo.
```

### D2 — La vía de tierra
```
Dato que casi nadie sabe: la mayoría de quienes trabajan en una terminal no están
contratados por AENA, sino por empresas de handling, aerolíneas y concesionarios.
Eso cambia la estrategia: AENA saca convocatorias públicas puntuales y muy
competidas; el handling contrata de forma continua, con campañas fuertes antes de
verano y antes de Navidad. CTA al artículo de azafata de tierra.
```

### D5 — Qué formación sirve
```
Distingue tres tipos de curso: certificación oficial (solo existe para volar y es
obligatoria), formación profesional del sector (handling, operaciones, despacho:
no obligatoria pero decisiva en la selección) y titulación propia del centro (vale
lo que valga el centro, no habilita por sí misma). Recomienda pedir siempre por
escrito qué documento se emite y quién lo reconoce. CTA al artículo de cursos.
```

### D9 — Cierre
```
Cierre a orientación personalizada: que cuente sus horarios, sus cargas y en qué
plazo quiere estar trabajando, y le decimos con honestidad cuál de las tres vías
encaja mejor, incluso si la respuesta es que ahora no es su momento.
CTA a pedir orientación.
```

---

## 5 · PROMPTS AUXILIARES

### Variante para prueba A/B del asunto
```
Dame 5 asuntos alternativos para este email, de menos de 50 caracteres,
sin signos de exclamación. Que uno sea una pregunta, uno una cifra o dato
concreto, uno una afirmación contraintuitiva, uno directo y descriptivo, y
uno con curiosidad sin caer en clickbait.
```

### Secuencia de recuperación (leads que no cerraron)
```
Escribe un email mensual de reactivación para alguien que dejó sus datos hace
meses y no llegó a matricularse. Sin reproches ni "hace tiempo que no sabemos
de ti". Ángulo: ha salido una nueva convocatoria y el sector sigue contratando.
Una sola pregunta al final: si sigue interesado o prefiere que dejemos de
escribirle. CTA doble: me interesa / darme de baja.
```

### Adaptar un email a WhatsApp
```
Reescribe este email como mensaje de WhatsApp: máximo 60 palabras, sin asunto,
sin formato, tuteo, una sola pregunta al final que invite a responder.
Que no parezca automático.
```

---

## 6 · CONTROL DE CALIDAD

Antes de dar por bueno un email generado, comprueba:

- [ ] ¿Hay alguna cifra inventada? Toda cifra necesita fuente o va como [DATO A CONFIRMAR].
- [ ] ¿Se insinúa empleo garantizado en algún punto?
- [ ] ¿El certificado se nombra correctamente (no "título" ni "homologación")?
- [ ] ¿Hay un solo CTA?
- [ ] ¿Menos de 220 palabras?
- [ ] ¿El texto de vista previa dice algo distinto del asunto?
- [ ] ¿El enlace lleva UTM? `?utm_source=email&utm_medium=secuencia&utm_campaign=<sX_dY>`
