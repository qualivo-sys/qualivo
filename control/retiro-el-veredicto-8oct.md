# Retiro el veredicto de las puertas · 8-oct-2026

Hace dos horas cerré nueve puertas diciendo que la regla las condenaba. **La adenda P0
de la auditoría objetó que la medición mezclaba infraestructuras distintas, y al
comprobarlo tiene razón. Retiro el veredicto.**

## La prueba, con fechas y con código

**1 · Cuándo se midieron las puertas.** Rango de envío real, leído de la API:

| Puerta | Envíos | Resp. | Ventana |
|---|---:|---:|---|
| Google Ads | 221 | 3 | **16 a 22-sep** |
| Zoho | 132 | 2 | 16 a 22-sep |
| Salesforce | 130 | 1 | 16 a 18-sep |
| Meta | 110 | 0 | 16 a 21-sep |
| LinkedIn Ads | 90 | 2 | 16-sep a 8-oct |

Todas en una ventana de seis días de septiembre, menos LinkedIn Ads.

**2 · Con qué buzones nacieron.** `campana_senal.py`, línea 55 hasta hoy:

```python
cuentas = [c["id"] for c in api("GET", "/email-accounts/?offset=0&limit=100", key)]
```

Cogía **todos** los buzones. Así que las puertas se crearon el 16-sep con los 15,
incluidos los 3 de `goqualivo.com` y los 2 de `gotqualivo.com`.

**3 · Cuánto pesaban esos dominios.** Tenían el tope más alto, 55/día cada uno:
**275 de 475 de capacidad nominal, el 58%**. Y en el arreglo del 2-oct se midió que eran
el **44% de los envíos reales** de esos días.

**4 · Cuándo se supo que estaban en lista negra.** El 1-oct, por un rechazo recibido a
las 07:29 sobre un correo enviado el 30-sep. **Después de los envíos de las puertas.**

**5 · Cuándo se arreglaron.** El 2-oct a las 17:00, y solo sobre **las 5 campañas
ACTIVE**. Las puertas ya estaban pausadas, así que no entraron en ese arreglo.

## La conclusión

**Entre el 44% y el 58% de los 221 envíos de Google Ads salieron por dominios que
después se encontraron en una lista negra de URLs.** No puedo separar «la señal no
funciona» de «el correo no llegó».

Lo que no puedo establecer es **desde cuándo** estaban listados: el rechazo es del
30-sep y SURBL no publica la fecha de alta. Así que no afirmo que el 16-sep ya lo
estuvieran. Pero para invalidar la medición basta con que más de la mitad del envío
saliera por ahí, y eso sí está establecido.

## Qué cambia

Las nueve puertas **siguen pausadas, pero por otro motivo**: no es «cerrada por bajo
rendimiento», es **«sin medir con infraestructura limpia»**. La diferencia importa,
porque la primera es un cadáver y la segunda es un experimento pendiente.

Y el ángulo Intelligence sigue siendo lo mejor que tenemos, pero con la misma cautela:
sus 123 envíos son del 29-sep en adelante, así que también cruzan la ventana sucia.

## El arreglo de raíz

`campana_senal.py` ya no coge todos los buzones. Lleva una lista de dominios vetados y
los excluye por sufijo del correo, avisando de cuáles deja fuera y abortando si no queda
ninguno usable. Probado contra los 15 buzones reales: deja exactamente los 10 limpios.

Sin esto, la próxima campaña que alguien cree vuelve a nacer con los dominios quemados
dentro y volvemos a medir entregabilidad creyendo que medimos señal.

## Lo que me llevo

Tres veces hoy he afirmado algo con confianza y mi propia comprobación posterior me ha
corregido: las puertas «medidas» con 40 envíos, los cuatro correos que «no se habían
mandado», y ahora este veredicto. El patrón es el mismo: **concluyo antes de comprobar
con qué se generó el dato.**

La regla que me aplico: **antes de usar una tasa para decidir, comprobar en qué ventana
se generó y con qué infraestructura.** Un número no vale por existir.
