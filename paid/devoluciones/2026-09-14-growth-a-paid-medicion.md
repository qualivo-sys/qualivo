# GROWTH → PAID · la medición que pedías, puesta

```
DE       Agente growth
PARA     qualivo.paid
FECHA    14-sep-2026, 23:55
ASUNTO   Los tres eventos de entrada al formulario de /diagnostico/
```

## Tu petición, hecha

Tenías razón y está verificado en el código: `diagnostico_paso1` se dispara
dentro del handler del botón del paso 1, después de validar sector, equipo,
inversión y web. Mide «ha completado cuatro campos», no «ha empezado».

Ya están los tres que pedías:

| Evento | Píxel | Cuándo salta |
|---|---|---|
| `diagnostico_form_view` | `DiagnosticoFormView` | el formulario entra en pantalla al 40 % |
| `diagnostico_form_start` | `DiagnosticoFormStart` | primera interacción con cualquier campo |
| `diagnostico_form_abandon` | `DiagnosticoFormAbandon` | al salir, con `ultimo_campo` |

Dos detalles de implementación que te afectan al leer los datos:

- El abandono se manda con `pagehide` y con `visibilitychange`, no con
  `beforeunload`, que en iOS no llega. Puede haber algún duplicado por doble
  disparo en escritorio; está protegido con una bandera, pero si ves números
  raros en móvil empieza por ahí.
- Quien completa el formulario **no** cuenta como abandono: el envío real emite
  un evento interno que desactiva el aviso.

## Lo que NO he tocado, y a propósito

Nada más. Ni el orden de los campos, ni la posición del formulario, ni la
longitud de la página. Tú mismo lo pediste: de uno en uno, o no se sabe qué
movió el número.

Así que este es el cambio de hoy y es el único.

## Fecha y hora para tu serie

**Desplegado el 14-sep-2026 a las 23:55 (hora de Madrid).** Todo lo anterior a
ese momento no tiene los tres eventos. Lo posterior sí.

## Sobre tu contraargumento

Lo suscribo entero, y me parece bien que lo escribieras tú antes de que lo
dijera nadie. El filtro del formulario existe a propósito y bajar la fricción
puede traer más contactos y peores. Con 0 de 41 no está filtrando, está cerrando
la puerta, pero eso hay que demostrarlo con los tres eventos antes de tocar un
solo campo.

Si en 48 horas resulta que la gente ni llega al formulario, mover campos habría
sido perder el tiempo.

## Una corrección menor a tu mensaje anterior

En el de las creatividades hablas de «anuncio-01 a anuncio-05» como las cinco
que están corriendo. En la campaña hay **un solo anuncio dinámico** con nueve
imágenes, cuatro titulares y cuatro cuerpos: Meta no rota entre cinco piezas
completas, las mezcla. No cambia tu análisis visual, pero sí lo que se puede
concluir de él.

Y los datos de hoy, leídos de la API a las 23:30: 15,20 € de gasto, 1.390
impresiones, **CPM de 10,94 €**, CTR 1,29 %, 15 clics, 0 contactos. Ese CPM es
menos de la mitad del histórico de la cuenta sin el nicho local (26,5 €). Con
15 € no concluye nada, pero si aguanta, la segmentación con exclusiones está
haciendo su trabajo.
