# EXP-001 · Landing contra formulario nativo

```
AGENTE       qualivo.paid
ABIERTO      14-sep-2026
FECHA DE MUERTE   28-sep-2026 · a los 14 días se mata o se escala
ESTADO       ESPECIFICADO · pendiente de que Maikel active la rama de landing
```

## La pregunta

Después de ver que en la landing vieja 44 visitas daban 2 inicios de test, la hipótesis es que
**el formulario nativo convierte mejor porque se salta el salto a la web**. Hay que comprobarlo con
dinero, no con opinión.

| Rama | Campaña | Destino |
|---|---|---|
| A | `QV_DIAG_LEADFORM_Sep26` · **ACTIVE desde el 14-sep 12:19** | formulario nativo en Meta |
| B | `QV_DIAG_LANDING_Sep26` · **PAUSED** | `qualivo.io/diagnostico/` |

---

## ⚠️ El fallo que haría inútil este experimento

**Las dos ramas NO cuentan lo mismo cuando dicen «lead».** Está en el código, no es una sospecha:

`api/diagnostico.js`, rama de landing:

> `// Conversions API: el Lead solo cuenta cuando ha pasado el corte.`

| | Rama A · formulario | Rama B · landing |
|---|---|---|
| Qué cuenta Meta como lead | **toda** entrega del formulario | **solo** el que pasa el corte de cualificación |
| Vía | nativa, 100 % | CAPI de servidor, deduplicada, no depende de cookies |
| Etiquetas en GoHighLevel | `leadform` | `diagnostico-cualificado` · `paid` · **`creativo-<utm_content>`** |

**Consecuencia:** si comparas la columna «Resultados» del Administrador, la landing va a parecer
**3-5 veces más cara y será falso.** Estarás comparando leads cualificados contra entregas brutas.

### La regla de lectura, escrita antes de empezar

**Se compara cualificado contra cualificado.**

- **Rama B:** el número de `Lead` que da Meta ya es el cualificado. Se usa tal cual.
- **Rama A:** NO se usa el número de Meta. Se leen las entregas del formulario
  `1006694072388659` por API y se filtran por la respuesta a *«¿Cuánto invertís al mes en conseguir
  clientes?»*: cualifica **500 € o más**. Eso lo calculo yo.

Ambas ramas tienen además el mismo corte de ICP por detrás, así que la comparación es limpia
siempre que se haga sobre esta base y no sobre la de Meta.

---

## Condiciones de arranque

1. **Presupuesto 15 + 15, partiendo los 30 € actuales.** No añadir dinero: partirlo. Mismo coste,
   y se recupera el contrafactual.
2. **Confirmar `META_LEADFORM_IDS`.** El propio `api/meta-leadform.js` avisa:
   > *«Un lead de un formulario que no esté en esa lista se guarda en el CRM pero NO entra en la
   > cadencia: nadie le escribe ni le llama.»*
   Si `1006694072388659` no está en esa variable, la rama A paga por leads que nadie va a llamar.
   **Es la única comprobación que bloquea el arranque.**
3. **La creatividad, idéntica en ambas.** Si no se puede fijar todavía, al menos que las dos lleven
   el mismo lote: el ruido creativo será simétrico y no sesgará la comparación entre ramas.

## Criterios de decisión, fijados de antemano

| | |
|---|---|
| **Gana una rama** | coste por lead **cualificado** un 40 % mejor, con ≥8 cualificados en esa rama |
| **Se mata una rama** | 3× el coste por cualificado de la otra, o 60 € sin un solo cualificado |
| **No se toca antes de** | 3 días o 50 € por rama |
| **Fecha de muerte** | **28-sep**. Se mata o se escala. «Seguimos mirando» no es un resultado |

### Referencia histórica, que hasta hoy no tenía

De `api/informe-paid.js`: el **CPL medio de la cuenta en los últimos 90 días es 32,80 €**
(excluyendo Valldesarroca por nicho local). Sus umbrales: aviso por encima de **45 €** de CPL, y
aviso a los **25 €** de gasto sin leads.

Eso da contexto a lo de hoy: 8,25 € sin leads todavía **no es nada raro**. El aviso salta a 25 €.

---

## Lo que ya no es un riesgo

Dos cosas que llevaba días señalando como abiertas y que Growth ha cerrado:

1. **La atribución por creatividad existe.** `api/diagnostico.js` etiqueta
   `creativo-<utm_content>` en GoHighLevel. Era mi petición número uno del 10-sep, y en la rama de
   landing ya está hecha. El coste por lead cualificado **por anuncio** pasa a ser calculable.
2. **El webhook de leadform → GoHighLevel existe y está desplegado.** `api/meta-leadform.js`
   responde `403` a un token de verificación falso, que es la respuesta correcta: está configurado.
   Valida firma con `META_APP_SECRET` y va a buscar los datos a la Graph API en vez de fiarse del
   cuerpo del webhook.

Queda sin verificar, y no puedo verlo desde aquí: que la suscripción `leadgen` de la página esté
activa apuntando a esa URL, y el contenido de `META_LEADFORM_IDS`.

## Nota de duplicidad

Growth ha montado `/api/informe-paid/` con cron a las **07:00 y 18:00**, que junta Meta con el CRM
y lo manda por correo. Se solapa en parte con la rutina diaria que armé ayer
(`trig_01MD7adsrquDqUaNvhg57Wg2`). El suyo es más completo porque cruza el CRM. **Antes de dejar
los dos corriendo, conviene decidir cuál manda**, o acabaremos con dos avisos que cada uno cubre la
mitad. Mi voto: que mande el suyo para el parte, y el mío se quede solo como vigilancia de
anomalías de la cuenta publicitaria.
