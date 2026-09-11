# CREATIVIDAD FIJA · QV_DIAG_LANDING / QV_DIAG_LEADFORM

```
AGENTE   qualivo.paid
FECHA    11-sep-2026 · 20:30 CEST
ENCARGO  Maikel: poner UTMs y fijar un titular, una descripción y un copy,
         el mismo en ambas campañas, para que la única variable sea el destino
ESTADO   PREPARADO · NO APLICADO. El sandbox bloquea la escritura en la cuenta.
```

## 0 · Tres cosas que dije mal anoche

Al ir a arreglarlo leí la creatividad entera y me había equivocado en tres puntos. Los corrijo aquí
porque cambian lo que hay que hacer.

### 0.1 · «Cero UTMs» era falso para la campaña de landing

Miré el campo `url_tags` del nivel creatividad, que está a `null`, y concluí que no había ninguna.
**Están un nivel más abajo**, dentro de `asset_feed_spec.link_urls`:

```
utm_source=meta&utm_medium=paid&utm_campaign=diagnostico-sep26&utm_content={{ad.name}}&utm_term={{adset.name}}
```

Es decir: **el contacto sí iba a recibir la etiqueta `utm-meta` en GoHighLevel** y la columna «De
Meta» del informe sí iba a contar. Mi alarma era infundada.

Queda una mejora real, no una avería: `utm_content={{ad.name}}` devuelve siempre el mismo valor
para el único anuncio que hay, así que no distingue creatividad. Con la creatividad fija eso deja
de importar, y para el futuro conviene `{{ad.id}}`, que no se rompe si alguien renombra.

### 0.2 · La campaña de formulario no puede llevar UTMs, y no le hacen falta

No hay página de destino: el formulario es nativo. Pero **el formulario ya devuelve al usuario con
UTMs** en su `follow_up_action_url`:

```
https://qualivo.io/diagnostico/?paso=agenda&utm_source=meta&utm_medium=leadform
```

Así que las dos ramas son distinguibles: `utm_medium=paid` la de landing, `utm_medium=leadform` la
otra. No está mal, aunque el esquema no es simétrico y convendría unificarlo algún día.

### 0.3 · El formulario nativo sí cualifica, y bastante bien

Dije que era el mayor riesgo y que no podía auditarlo. Pude, entrando por el id del formulario en
vez de por la página. `Qualivo_Diagnostico_sep2026_v1`, ACTIVE:

| Pregunta | |
|---|---|
| Nombre, email, teléfono | estándar |
| **«¿Cuánto invertís al mes en conseguir clientes?»** | Nada todavía · **Menos de 500 €** · 500-2.000 € · 2.000-5.000 € · Más de 5.000 € |
| **«¿Dónde crees que se te está escapando el negocio?»** | anuncios · web y formularios · tiempo de respuesta · seguimiento y presupuestos · no lo sé |

La primera es **exactamente el suelo de 500 €/mes** que se firmó ayer como criterio de descarte, y
la segunda alimenta el diagnóstico. Está bien pensado. Retiro la preocupación.

**Lo único que sigue sin saberse** es si esos leads entran en GoHighLevel. El formulario devuelve
al usuario a la web, pero el dato del lead necesita integración aparte. Es la única pregunta que
queda abierta antes de encender esa rama, y no la puedo responder con este token.

---

## 1 · Lo que sí estaba mal y ahora se arregla

### 640 combinaciones por campaña

4 titulares × 4 descripciones × 4 copys × **10 imágenes** = 640 celdas, a 20 €/día. Con eso no hay
forma de leer nada, y como los activos son idénticos en las dos campañas, contamina justo la
comparación landing contra formulario.

### Y de las 10 imágenes, solo hay 5

Las otras 5 son **las mismas subidas dos veces**:

| Imagen | Hashes |
|---|---|
| anuncio-01 | `306f45a9…` y `01f12a22…` |
| anuncio-03 | `3d85ba03…` y `763aef68…` |
| anuncio-05 | `0f016da4…` y `3cc9b777…` |

Meta está repartiendo entrega entre copias literales del mismo archivo. No rompe nada, pero divide
el aprendizaje por dos sin dar nada a cambio.

### Un detalle de coherencia

`anuncio-01` dice **«7 ALERTAS»**. Los copys, el H2 de la web y `anuncio-02` dicen **ocho**.

---

## 2 · La creatividad fija que propongo

**Idéntica en las dos campañas.** Única variable: el destino.

| | |
|---|---|
| **Imagen** | `anuncio-02` · hash `3cc40bbf91cfe3767025102994b80500` |
| **Titular** | Así se te escapa el dinero entre el anuncio y el cierre |
| **Descripción** | Quince minutos. Plan por escrito |
| **Copy** | «Cuando algo no va, todo el mundo mira los anuncios. Y el dinero casi nunca se pierde ahí. / Se pierde en la web que no dice a quién le pasa qué. En el formulario que espanta a la mitad. En el lead que tarda seis horas en recibir respuesta. En el presupuesto que nadie persigue. / Miramos los ocho puntos en quince minutos y te decimos por cuál se te está escapando a ti. Sales con un plan por escrito, lo hagas con nosotros o no.» |

### Por qué esta combinación y no otra

**La imagen `anuncio-02`** es la única de las cinco que **lidera con el problema y no con la
solución**, que es lo que pide el tráfico frío. Además:

- es literalmente el territorio de la V2 hecho dibujo: los ocho puntos, antes, en y después del lead
- es la única sobre fondo claro, y eso diferencia en un feed dominado por fondos oscuros
- **encaja con el copy elegido**, que nombra la web, el formulario, el tiempo de respuesta y el
  presupuesto: el lector los ve en la imagen mientras los lee
- coincide con el H2 de la página, «Miramos los ocho. La fuga suele estar en más de uno»

Descartadas: `anuncio-01` es fuerte pero dice siete y rompe la coherencia · `anuncio-03` y
`anuncio-05` lideran con la solución · `anuncio-04` es la factura a 0 €, que es la pieza más
cualificada del lote y no la que pondría en frío.

**El copy** es el mejor texto de los cuatro y ya lo dije antes de que esto fuera un encargo.
**El titular** es el H1 exacto de la página: quien hace clic encuentra arriba la misma frase.
**La descripción** es la única concreta de las cuatro.

Los otros tres titulares y los otros cuatro creativos **no se tiran**: se prueban después, cuando
ya sepas qué destino gana. Primero una variable, luego las demás.

### UTMs

Rama landing:
```
utm_source=meta&utm_medium=paid&utm_campaign=diagnostico-sep26&utm_content=landing&utm_term={{ad.id}}
```
Rama formulario: sin cambios, ya viene por `follow_up_action_url` con `utm_medium=leadform`.

---

## 3 · Cómo se aplica

No he podido ejecutarlo: **el sandbox de esta sesión bloquea escribir en la cuenta publicitaria**
(«Modify Shared Resources»). No es un límite de Meta ni del token: el token tiene permiso de
gestión, creó estas campañas esta tarde.

Son dos pasos por campaña:

1. **Crear la creatividad nueva** en `act_3453332464718877` con un solo activo de cada tipo: la
   imagen, el titular, la descripción y el copy de §2, conservando `page_id 359073050620335`,
   `instagram_user_id 17841400637954150` y el `degrees_of_freedom_spec` actual (todo en `OPT_OUT`).
   En la rama de formulario hay que mantener además `call_to_actions` con
   `lead_gen_form_id: 1006694072388659` y el CTA `SIGN_UP`; en la de landing, `LEARN_MORE` y el
   `website_url` con las UTMs de §2.
2. **Apuntar el anuncio a la creatividad nueva**: anuncio `120245599211350358` en la rama landing y
   `120245599268040358` en la de formulario.

Ambos conjuntos tienen `is_dynamic_creative: true`. Con un activo de cada tipo sigue siendo válido:
simplemente deja de rotar, que es justo lo que queremos.

Nada de esto activa nada. **Las dos campañas siguen en PAUSADO y se quedan así hasta que las
enciendas tú.**

### Si prefieres que lo haga yo

Necesito permiso de escritura hacia `graph.facebook.com` en esta sesión. Con eso son cuatro
llamadas y diez minutos, verificación incluida. El script está escrito y probado hasta el punto
exacto del bloqueo.
