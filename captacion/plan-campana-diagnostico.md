# Plan de campaña · Diagnóstico de crecimiento (11-sep-2026)

## Lo que dice la propia cuenta

Antes de elegir estructura, los últimos 90 días de `act_3453332464718877`:

| Campaña | Gasto | CTR | CPC | Leads | CPL |
|---|---|---|---|---|---|
| VALLD_LEADS_PRO_Tarragona | 277,71 € | 2,44 % | 0,35 € | 39 | 7,12 € |
| HTL_LAB_N2_EXP003_INTERESES | 104,33 € | 2,40 % | 1,03 € | 11 | 9,48 € |
| HTL_LAB_N2_EXP003_LOOKALIKE | 50,83 € | 1,04 % | 2,31 € | 1 | 50,83 € |
| **HTL_LAB_N1_EXP005_DINAMICO** | 23,22 € | 0,94 % | 2,32 € | **0** | — |
| **HTL_LAB_N1_EXP006_DINAMICO_DOLOR2** | 61,72 € | 1,01 % | 2,29 € | **1** | 61,72 € |
| **HTL_LAB_N1_EXP007_ADVANTAGE_IA** | 55,79 € | 1,08 % | 2,94 € | **0** | — |
| QV_HERO_LEADS_Sep26 | 20,76 € | **2,66 %** | 0,69 € | 0 | — |

**Las tres campañas dinámicas se llevaron 140,73 € y dejaron un lead.** CTR por
debajo del 1,1 % y CPC de 2,29 a 2,94 €, el triple que las que funcionaron. Las de
intereses con creatividades separadas hicieron 2,4 % de CTR y CPL de 9,48 €.

Por eso **no arranco en creatividad dinámica**, aunque sea lo cómodo. Con 15 €/día no
hay margen para repetir un experimento que ya salió mal en esta misma cuenta, y
además la mezcla automática impide saber qué ángulo ha parado el scroll, que es justo
lo que hay que aprender ahora.

Dinámico se reserva para la fase 3, cuando ya se sepa qué ángulo gana y solo haga
falta exprimir variaciones de uno que funciona.

## Estructura · fase 1, validación

Una campaña. Un conjunto. Cuatro anuncios. Nada más.

```
CAMPAÑA · Qualivo · Diagnóstico · sep 2026        OUTCOME_LEADS
└── CONJUNTO A · Lead form · 15 €/día
    ├── AD 01 · fuga        · la cinta
    ├── AD 02 · alerta      · el cuadro de mandos
    ├── AD 03 · diagnóstico · el médico
    └── AD 04 · mecanismo   · la radiografía
```

**Por qué un solo conjunto.** 15 €/día partidos en dos son 7,50 € cada uno: ninguno
sale de la fase de aprendizaje y los dos mienten. Un conjunto con cuatro anuncios deja
que Meta reparta y, sobre todo, **reporta cada creatividad por separado**.

**Por qué lead form y no la landing, todavía.** El CPL del formulario instantáneo
ronda los 5-10 € en esta cuenta; el de una landing fría, 20-30 €. Con 15 €/día eso es
la diferencia entre 2-3 leads diarios y menos de uno. En dos semanas: 30-40 leads
frente a 8. Para aprender qué ángulo funciona hace falta el primero.

La calidad más baja del formulario la compensa la capa de activación: WhatsApp al
minuto, llamada a los veinte y la pregunta de inversión dentro del propio formulario.

**Segmentación.** España, 28-60, Facebook e Instagram, ubicaciones automáticas y
audiencia amplia con Advantage+. Sin intereses al principio: el formulario ya filtra
por inversión y el ICP es difícil de dibujar con intereses. Esto sí es «dinámico», y
es el sitio donde el dinámico funciona.

Nada de lookalike: en julio dio 50,83 € por lead.

## La fase 2 no se abre por corazonada

Se abre cuando haya **30 leads o 14 días**, lo que llegue antes, y entonces:

| Si pasa esto | El cuello está en | Y se hace esto |
|---|---|---|
| CTR < 1,5 % | el gancho | cambiar creatividades, no audiencia |
| CTR > 2 % y CPL alto | el formulario | acortar o cambiar la pregunta de filtro |
| CPL bien y leads fuera de ICP | la promesa | endurecer el copy, no el targeting |
| Leads buenos y pocas citas | la activación | mirar WhatsApp y llamada, no la campaña |
| Citas y ningún piloto | la oferta | eso no lo arregla paid |

Solo entonces entra el conjunto B a la landing, con el píxel ya calentado por el
tráfico del lead form.

## Tracking

El píxel bueno es **`879197745226987`** («Qualivo Agencia», con eventos el 10-sep).
Ojo: hay trece píxeles en la cuenta, uno llamado literalmente «Qualivo web (duplicado,
no usar)». La landing carga el correcto desde `assets/consent.js`.

UTMs, iguales en los cuatro anuncios salvo `utm_content`:

```
utm_source=meta
utm_medium=paid
utm_campaign=diagnostico-sep26
utm_content={{ad.name}}
```

`utm_content` entra en el CRM como etiqueta `creativo-…`, así que el ángulo viaja
hasta la cita. Ese es el dato que importa: no qué creatividad tuvo más clics, sino
cuál trajo a alguien que se sentó quince minutos.

## Presupuesto y ritmo

15 €/día. No se toca nada los tres primeros días, pase lo que pase: antes de eso solo
hay ruido. Revisión a los 7 días y decisión a los 14.

No se sube el presupuesto porque haya leads baratos. Se sube cuando un ángulo traiga
citas a un coste que tenga sentido contra lo que vale un piloto.
