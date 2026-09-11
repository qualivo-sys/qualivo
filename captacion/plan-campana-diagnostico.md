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

## Lo que está montado (11-sep, en pausa)

```
QV_DIAG_LEADFORM_Sep26            OUTCOME_LEADS
└── ES 25-65 · Advantage+ · DINÁMICO · Lead form · 20 €/día
    └── DIN · 10 creativos · Lead form

QV_DIAG_LANDING_Sep26             OUTCOME_LEADS
└── ES 25-65 · Advantage+ · DINÁMICO · Landing · 20 €/día
    └── DIN · 10 creativos · Landing
```

Las dos en creatividad dinámica, con **las diez imágenes**, cuatro textos y cuatro
titulares que Meta combina. Segmentación idéntica en las dos: Advantage+ con semilla
de nueve intereses y las tres exclusiones que separaban los conjuntos de 13 € de los
de 50 € en el histórico.

Los cuatro ángulos que van en los textos: fuga, alertas, diagnóstico y mecanismo.

**Lo que se pierde con dinámico**, y conviene saberlo al leer los datos: Meta reporta
por imagen, pero no dice qué combinación exacta de imagen y texto ganó. Si a los 14
días hay un ganador claro, el siguiente paso es sacarlo a su propio conjunto con
creatividad fija para confirmarlo.

## Cuándo arrancar

Se montó un viernes a las 19:00 y se dejó en pausa a propósito. El histórico de la
cuenta dice que el fin de semana capta **a la mitad de precio** (8 € de CPL frente a
22 € entre semana), así que el fin de semana no es el problema.

El problema era la activación: el agente de voz no llamaba ni sábado ni domingo, y un
lead del sábado se quedaba sin llamada hasta el lunes. Ya está corregido: **la voz
atiende los sábados de 10:00 a 14:00**. Domingo sigue sin llamadas.

## La fase 2 no se abre por corazonada## La fase 2 no se abre por corazonada

Se abre cuando haya **30 leads o 14 días**, lo que llegue antes, y entonces:

| Si pasa esto | El cuello está en | Y se hace esto |
|---|---|---|
| CTR < 1,5 % | el gancho | cambiar creatividades, no audiencia |
| CTR > 2 % y CPL alto | el formulario | acortar o cambiar la pregunta de filtro |
| CPL bien y leads fuera de ICP | la promesa | endurecer el copy, no el targeting |
| Leads buenos y pocas citas | la activación | mirar WhatsApp y llamada, no la campaña |
| Citas y ningún piloto | la oferta | eso no lo arregla paid |

A los 14 días se compara **coste por cita** entre las dos campañas, no CPL, y se apaga
la que salga peor o se reparte el presupuesto según lo que diga ese número.

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

20 €/día en cada campaña (40 € al día en total). No se toca nada los tres primeros
días, pase lo que pase: antes de eso solo hay ruido. Revisión a los 7 días y decisión
a los 14.

No se sube el presupuesto porque haya leads baratos. Se sube cuando un ángulo traiga
citas a un coste que tenga sentido contra lo que vale un piloto.

## Parte automático (para no mirar el panel)

`api/informe-paid.js` manda un correo a las **7:00 y a las 18:00** (cron en
`vercel.json`). Cruza los insights de las campañas `QV_DIAG*` con los contactos de
GHL por etiqueta (`activacion`, `act-agendado`, `act-respondio`, `act-por-sms`), así
que no dice solo cuántos leads entraron sino cuántos cogieron el teléfono y cuántos
se sentaron.

Si no ha pasado nada, no manda nada. El correo solo llega si hay actividad, y separa
dos bloques:

- **Lo normal**: gasto, leads, CPL, citas. Informativo. No hay que hacer nada.
- **Esto sí pide una decisión**: solo aparece si se cruza un umbral.

Umbrales:

| Aviso | Cuándo salta |
|---|---|
| CPL alto | CPL del día por encima de **35 €** |
| Gasto sin leads | más de **25 €** gastados en un conjunto sin un solo lead |

Los dos umbrales son para el día, no acumulados: un mal día no significa una mala
campaña, pero dos seguidos sí. Un conjunto se pausa desde la app de Meta en el móvil
en diez segundos; no hace falta PC ni esperar a nadie.

Destinatario por defecto `maikel@qualivo.io`. Se cambia con la variable
`INFORME_PAID_TO` en Vercel.
