# RUEDA DE VALIDACIÓN · Qualivo Meta

```
AGENTE     qualivo.paid
ABIERTA    15-sep-2026
REGLA      20 €/día hasta que algo esté validado
REVISIÓN   viernes. El resto de la semana, solo el parte de anomalías
```

## Por qué 20 €/día, escrito para acordarnos en una semana

No es por el dinero. **Es para proteger la atención de Maikel**, que es el recurso que se agota
antes que la caja. Presupuesto alto = revisar los anuncios todo el rato = desgaste = decisiones
impulsivas. A 20 €/día no hay nada que mirar, y eso es exactamente lo que se busca.

**280 € en catorce días.** Ese es el presupuesto completo de validación.

---

## LA REGLA MÁS IMPORTANTE DE TODO ESTE DOCUMENTO

**Las hipótesis no se validan en paralelo. Se validan en cadena.**

Preguntar «¿qué público convierte mejor?» cuando **nadie** convierte es comparar cero contra cero.
Preguntar «¿qué creatividad gana?» sin saber si el formulario funciona es gastar en decorar una
puerta que está cerrada.

```
NIVEL 0   ¿PODEMOS VER?      fontanería · 0 €        ← estamos aquí
   ↓ solo si pasa
NIVEL 1   ¿CONVIERTE ALGO?   binario · ~35 €
   ↓ solo si pasa
NIVEL 2   ¿DÓNDE MEJOR?      landing vs formulario
   ↓ solo si pasa
NIVEL 3   ¿A QUIÉN?          audiencias y similares
   ↓ solo si pasa
NIVEL 4   ¿CON QUÉ MENSAJE?  ángulos y creatividades
```

**Esta semana solo se juegan el nivel 0 y el nivel 1.** Nada más. Y eso ya es mucho.

---

## NIVEL 0 · Fontanería · cuesta 0 € y bloquea todo

Sin esto no se puede validar nada, porque no se puede observar nada.

| # | Hipótesis | Cómo se decide | Quién | Estado |
|---|---|---|---|---|
| **H0.1** | El lead que Meta reporta el 15-sep existe de verdad | Buscar en GoHighLevel un contacto del 15-sep con etiqueta `leadform`. Binario | **Maikel** | 🔴 ABIERTA |
| **H0.2** | El webhook del formulario entrega al CRM | Confirmar que `1006694072388659` está en `META_LEADFORM_IDS` y que la suscripción `leadgen` de la página apunta a `/api/meta-leadform/` | Growth / Ops | 🔴 ABIERTA |
| **H0.3** | Se puede ver dónde abandona la gente en la landing | Existen los eventos `form_view`, `form_start`, `form_abandon` | Growth | 🔴 ABIERTA · pedido el 14-sep |

**H0.1 es la más barata y la más importante de las tres.** Es una consulta. Y separa dos mundos:
uno donde solo falta volumen y otro donde hay una fuga de fontanería.

---

## NIVEL 1 · ¿Convierte algo? · el gate de verdad

Solo una rama corriendo: **el formulario nativo, 20 €/día**. La landing sigue apagada a propósito
(ver §«Por qué una sola rama»).

| # | Hipótesis | Métrica | Umbral de decisión | Datos que hace falta | Coste |
|---|---|---|---|---|---|
| **H1.1** | El formulario nativo convierte ≥10 % de las aperturas | envíos ÷ aperturas | **30 aperturas** post-arreglo. Si 0 envíos → P≈0,04, el formulario está roto o el público es el equivocado | ~30 aperturas | **~16 €** |
| **H1.2** | Los leads que entran cumplen el ICP | campo `inversion` del formulario ≥ 500 €/mes | ≥60 % cualificados sobre los primeros 5 leads | 5 leads | incluido |
| **H1.3** | Un lead llega entero de Meta al CRM y es contactable | seguimiento manual de punta a punta del primero | binario | 1 lead | incluido |

**Si H1.1 falla** (30 aperturas, 0 envíos): el problema no es de puja ni de público. Es el
formulario. Se baja `is_optimized_for_quality`, que es el interruptor que más volumen devuelve sin
perder cualificación, y se vuelve a contar.

**Si H1.1 pasa pero H1.2 falla** (entran leads pero son basura): entonces sí es problema de
público, y se sube al nivel 3.

---

## NIVEL 2 · ¿Dónde convierte mejor? · y por qué esta semana NO

| # | Hipótesis | Estado |
|---|---|---|
| H2.1 | El formulario nativo produce más leads cualificados por euro que la landing | 🔒 **BLOQUEADA** |

**Y aquí va la verdad incómoda que un experto tiene que decir:** para distinguir dos ramas hacen
falta del orden de **30 conversiones por rama**. A 20 €/día repartidos, eso son semanas. **La
comparación landing contra formulario NO se puede validar con este presupuesto en catorce días.**

Se puede hacer una de dos cosas, y las dos son honestas:
1. **Aceptar que es una decisión cualitativa**, no estadística: se mira el embudo de cada una con
   ~10 leads y se decide con criterio.
2. **Esperar** a tener presupuesto para hacerlo bien.

Lo que **no** se puede hacer es partir 20 € en dos y creerse el resultado.

---

## NIVEL 3 · ¿A quién? · las hipótesis de audiencia

| # | Hipótesis | Estado |
|---|---|---|
| H3.1 | Un similar al 1 % de la lista del CRM supera al público amplio | 🔒 falta subir la lista de GoHighLevel |
| H3.2 | El retargeting de visitantes de `/diagnostico/` convierte mejor | 🔒 el público tiene ~50 personas, el mínimo son 1.000 |
| H3.3 | Estrechar por intereses mejora la calidad | ❌ **DESCARTADA a priori**, ver abajo |

### Lo que encontré al auditar los públicos, y es un aviso

La cuenta tiene **69 públicos personalizados** y **ninguno sirve**. Son listas de seguidores de
coaches e infoproductores —`@maite_issa`, `@rafelmayol`, `@javierelbe`, `Judit Catala.csv`…— de la
etapa anterior de la cuenta.

> ⚠️ **Están ahí y son usables.** Si alguien los mete «porque ya los tenemos», se compra audiencia
> de infoproductores, que es exactamente quien nunca va a pagar 1.000-2.500 €/mes a una consultora.
> Sería el error más caro posible y el más tentador porque parece gratis.

**H3.3 se descarta a priori** porque en B2B pequeño la segmentación por intereses de Meta
históricamente empeora resultados: el creativo segmenta mejor que el interés. Y con 0 conversiones
no hay nada que afinar.

---

## NIVEL 4 · ¿Con qué mensaje? · el último, siempre

| # | Hipótesis | Estado |
|---|---|---|
| H4.1 | El formato **pregunta** supera al formato **afirmación** | 🔒 nivel 4 |
| H4.2 | Una idea por creatividad supera al infográfico denso | 🔒 nivel 4 |
| H4.3 | El ángulo del seguimiento supera al del control | 🔒 nivel 4 |

Es el nivel que más volumen necesita y por eso va el último, aunque sea el más divertido. Las
creatividades están pedidas a Growth (devolución del 14-sep) y estarán listas antes de que haya
presupuesto para probarlas. No pasa nada.

---

## Por qué una sola rama y no dos

Con 20 €/día, dos ramas son dos experimentos a la mitad de velocidad, ninguno concluyente. Una
rama a 20 € responde la pregunta binaria del nivel 1 en la mitad de tiempo.

**Se elige el formulario nativo** porque tiene menos pasos: si falla, hay menos sitios donde puede
estar el fallo. La landing, además, tiene un paso **medido como roto** (41 visitas → 0 inicios de
formulario): encenderla hoy sería pagar por llevar gente a una puerta que sabemos que no se abre.

La landing se enciende cuando Growth cierre H0.3 y arregle la página. No antes.

---

## CUÁNDO MIRAR · la regla anti-desgaste

| Cuándo | Qué |
|---|---|
| **Cada día, 08:00** | Llega el parte. **Si es una línea, no hay nada que hacer.** No abras el Administrador |
| **Entre medias** | Nada. Si algo sangra o entra el primer lead, te escribo yo |
| **Viernes** | Revisión de verdad: se miran los umbrales y se decide |
| **Cuando se cruza un umbral** | Te aviso en el momento, sin esperar al viernes |

**Mirar los anuncios a diario no cambia el resultado y sí cambia tu ánimo.** El umbral está escrito
de antemano precisamente para que la decisión no dependa de cómo te levantes.

---

## MARCADOR · se actualiza con cada parte

| Hipótesis | Métrica | Necesita | Lleva | Estado |
|---|---|---|---|---|
| H0.1 lead real | binario | 1 consulta al CRM | — | 🔴 abierta |
| H0.2 webhook entrega | binario | revisión de config | — | 🔴 abierta |
| H0.3 eventos de la landing | binario | Growth | — | 🔴 abierta |
| **H1.1 conversión del formulario** | envíos ÷ aperturas | 30 aperturas | **11** | ⏳ 37 % |
| H1.2 calidad del lead | `inversion` ≥ 500 € | 5 leads | **0** | ⏳ 0 % |
| H1.3 entrega al CRM | binario | 1 lead | **0** | ⏳ |
| H2.1 landing vs formulario | CPL cualificado | 30+30 | — | 🔒 bloqueada |
| H3.1 similar del CRM | CPL cualificado | lista subida | — | 🔒 bloqueada |
| H4.x mensaje | CPL cualificado | volumen | — | 🔒 bloqueada |

**Gasto acumulado de validación:** 43,90 € de los 280 € del presupuesto.
Fuente: Meta Ads API · 15-sep 08:20 CEST.
