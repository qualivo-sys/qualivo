# ACTA DE APAGADO · Meta Qualivo · 15-sep-2026

```
AGENTE       qualivo.paid
ACCIÓN       PAUSAR la campaña QV_DIAG_LEADFORM_Sep26 (120245598917380358)
COLOR        🟡 · frenar es la única acción que el agente ejecuta solo
QUIÉN LO PIDE  Maikel, 15-sep 18:1x CEST: «yo lo apagaría, creo que no tiene sentido»
EJECUTADO    15-sep-2026 16:2x UTC · verificado por API
ESTADO CUENTA  0 campañas capaces de gastar
```

Se apaga a nivel de **campaña**. El grupo y el anuncio siguen en ACTIVE por debajo, así que
reencender es un clic sobre la campaña y vuelve todo tal cual estaba. No se ha borrado nada.

---

## 1 · Lo que costó, con fuente y fecha

Meta Marketing API v21.0 · `/120245598917380358/insights` · `date_preset=maximum` · 15-sep 16:2x UTC

| Día | Gasto | Impresiones | Aperturas de formulario | Envíos | CTR | CPM |
|---|---|---|---|---|---|---|
| 14-sep · pre-arreglo | 17,08 € | 1.519 | 15 | **0** | 1,18 % | 11,24 € |
| 15-sep · post-arreglo | 20,01 € | 953 | 21 | **0** | 3,15 % | 21,00 € |
| **Total** | **37,07 €** | **2.468** | **36** | **0** | 1,94 % | 15,02 € |

Alcance 2.190 personas · frecuencia 1,13 · CPC 0,77 €.

«Aperturas» = `link_click`. En un anuncio de formulario nativo el clic **es** la apertura del
formulario: no hay salto a la web donde perder gente por el camino.

**Envíos: 0.** Fuente independiente, la del propio formulario, consultada seis veces en 24 h:

```
GET /1006694072388659?fields=leads_count,organic_leads_count
→ {"leads_count":1, "organic_leads_count":1}   ⇒  de pago: 0
```

El único registro recuperable del formulario sigue siendo «Maikel Prueba», orgánico, del 11-sep.

---

## 2 · Por qué el apagado es defendible, y no solo una corazonada

La hipótesis H1.1 decía: *el formulario nativo convierte ≥10 % de las aperturas*. Con 0 envíos:

| Lectura | Aperturas | P(0 envíos si la hipótesis fuera cierta) | Veredicto |
|---|---|---|---|
| Estricta · solo post-arreglo | 21 | **0,11** | aún no concluyente |
| Agrupada · las dos jornadas | 36 | **0,02** | **falsada** |

La lectura estricta era la conservadora: descartaba el día de Reels porque la colocación mala
ensucia *quién* hace clic. Pero el paso que se mide aquí es posterior al clic — 36 personas
abrieron el formulario y ninguna lo envió — y por ese lado el resultado ya está decidido.

Los 9 clics que faltaban para el umbral formal costaban ~8,50 €. **La decisión no dependía de
ese dinero**, así que apagar ahora no compra ignorancia: cierra la hipótesis un día antes.

---

## 3 · Lo que queda demostrado, y lo que no

### Sí demostrado

- **El arreglo de colocaciones funcionó.** Quitar el overlay de Reels (69,5 % de las impresiones)
  llevó el CTR de 1,18 % a 3,15 % y el coste por apertura de 1,14 € a 0,95 €. El anuncio compra
  atención.
- **La conversión es el problema, no el tráfico.** 36 aperturas · 0 envíos. Y en la landing vieja,
  41 visitas · 0 inicios. Dos puertas distintas, el mismo cero detrás. Eso deja de ser mala suerte
  del canal y pasa a ser una señal sobre la oferta o sobre el público.

### No demostrado · y se queda sin respuesta

- **EXP-001 (landing contra formulario) no llegó a correr.** La rama B nunca se activó, así que el
  contrafactual no existe. Queda ESPECIFICADO, no falsado.
- **H0.1 sigue abierta.** Meta insiste en `lead: 1` a 37,07 €; el formulario dice 0 de pago. Mientras
  no se mire GoHighLevel no sabemos si Meta cuenta mal o si el formulario no devuelve bien. **Esto
  se puede cerrar con la campaña apagada y sin gastar un euro** — y hay que cerrarlo, porque si
  el marcador de Meta miente, miente también en todo lo que se lance después.

---

## 4 · Lo que NO se debe concluir de estos 37 €

Que «Meta no funciona para Qualivo». 37 €, 2.190 personas y dos días no dan para esa frase, y
firmarla sería inventarse una conclusión del tamaño de un presupuesto anual.

Lo que sí sostienen los datos es más estrecho y más útil: **con este mensaje, a este público y
con esta oferta, el embudo no convierte en ninguno de sus dos formatos.** Reabrir tiene sentido
cuando cambie una de esas tres cosas, no antes. Volver a encender lo mismo esperando otro número
es la definición literal de quemar presupuesto.

---

## 5 · Estado en que queda la cuenta

| | |
|---|---|
| Campañas capaces de gastar | **0** · verificado por API tras el apagado |
| QV_DIAG_LEADFORM_Sep26 | PAUSED · grupo y anuncio ACTIVE debajo, reencendido de un clic |
| QV_DIAG_LANDING_Sep26 | PAUSED · nunca llegó a gastar |
| Gasto total del experimento | 37,07 € |
| Token de Meta | **sin rotar · sexto día** · alcanza 20+ cuentas de clientes |

El apagado no arregla lo del token. Es lo único urgente que sigue sobre la mesa.
