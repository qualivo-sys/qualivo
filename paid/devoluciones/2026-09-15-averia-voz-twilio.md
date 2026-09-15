# Avería de la voz saliente · 11 al 15 de septiembre

El agente de voz dejó de poder llamar el 11 de septiembre. Nadie se enteró hasta
el 15, cuando un lead real se quedó sin su llamada. Este documento explica la
causa, lo que se arregló y lo que sigue abierto.

## Qué pasó, en orden

1. **9 y 10 de septiembre.** El agente llama con normalidad: 23 llamadas
   salientes a móviles y fijos españoles, todas conectadas.
2. **11 de septiembre, madrugada.** Twilio rechaza el *Regulatory Bundle* de
   España. Es la documentación que la regulación española exige para poder
   tener un número móvil. Al caer el bundle, Twilio **libera el número**.
3. **11 al 15.** Nadie lo detecta. No había ninguna alerta montada sobre el
   estado del número ni sobre el estado del bundle.
4. **15 de septiembre.** Un lead de la campaña pide diagnóstico. El sistema
   intenta llamarle dos veces y falla las dos.

## El síntoma y lo que despistaba

El error que devolvía la centralita era:

```
call.in-progress.error-sip-outbound-call-failed-to-connect
sipStatus: 404
sipReason: "Not Found"
```

Un 404 parece un problema de enrutado del trunk SIP, y hacia ahí fue la
primera hipótesis. Era engañoso por dos motivos:

- **No era saldo.** La cuenta tenía crédito de sobra. Un problema de saldo o de
  permisos geográficos habría devuelto **403**, no 404.
- **No era el trunk.** El trunk seguía existiendo, con su dominio de
  terminación intacto, y la configuración del agente no se había tocado desde
  el día 9.

La causa real: el trunk estaba bien, pero **no tenía ningún número detrás**. El
inventario de números de la cuenta estaba a cero. Por eso «Not Found»: no había
nada desde lo que originar la llamada.

## Por qué cayó el bundle

Twilio rechazó los dos documentos aportados, ambos con el mismo código genérico
(18001, «no cumple los criterios»).

- **El documento de identidad**: el escaneo era ilegible. Las dos caras estaban
  metidas dentro de una hoja A4, ocupando cada una en torno al 10% de la
  página, en escala de grises y a baja resolución. El validador no podía leer
  los datos.
- **El justificante de domicilio**: factura de suministro correcta en el fondo
  (reciente, a nombre del titular, emisor identificable), pero redactada
  íntegramente en catalán, y con la dirección escrita de una forma que no
  coincidía literalmente con la declarada en el expediente.

## Lo que se arregló el 15 de septiembre

- **Documento de identidad rehecho.** Fotografías nuevas, recortadas al borde
  del documento, a color, procesadas y unidas en un PDF de dos páginas.
- **Dirección corregida.** La dirección del expediente tenía la segunda línea
  duplicando código postal y ciudad. Corregida y ahora **validada** por Twilio,
  cosa que antes no estaba.
- **Expediente nuevo.** Un expediente rechazado no se puede reabrir ni copiar:
  Twilio solo permite copiar los aprobados. Hubo que crear uno desde cero.
- **Hallazgo que simplifica todo:** la regulación española acepta el **propio
  documento de identidad como prueba de domicilio**, siempre que el fichero
  muestre anverso y reverso. Eso elimina la dependencia del justificante de
  suministro, que era el documento problemático.
- **Un solo documento, tres requisitos.** Twilio rechaza tener dos documentos
  del mismo tipo en un expediente. La solución es un único documento que lleve
  todos los atributos a la vez: identidad, número fiscal y domicilio.

Resultado: expediente **compliant** en las cuatro comprobaciones y enviado a
revisión. Queda esperar el veredicto de Twilio.

## Lo que sigue abierto

- **El número antiguo se ha perdido.** No se puede recuperar. Cuando el
  expediente se apruebe habrá que comprar uno nuevo, y será un número distinto.
- **Hay que actualizarlo en el agente de voz** cuando llegue, porque la
  credencial apunta al número viejo.
- **España no aparece** en la lista de países donde la cuenta puede comprar
  números. Probablemente sea consecuencia de no tener expediente aprobado y se
  resuelva solo al aprobarse, pero está sin confirmar.

## La lección, que es la que importa

El fallo no fue el rechazo del bundle. Fue que **estuvimos cuatro días sin
saberlo**. La documentación regulatoria caduca, se revisa y se rechaza sin
avisar, y cuando cae se lleva el número por delante.

Pendiente de montar: una comprobación diaria del inventario de números y del
estado del expediente, que avise por correo en cuanto cualquiera de los dos
cambie. Sale más barato que enterarse por un lead que se quedó sin llamada.
