# AUDITORÍA · Formulario nativo `Qualivo_Diagnostico_sep2026_v1`

```
AGENTE   qualivo.paid
FECHA    14-sep-2026 · 17:40 CEST
OBJETO   Por qué 6 aperturas del formulario han dado 0 envíos
FUENTE   Meta Graph API v21.0 · form_id 1006694072388659
ACCIÓN   Ninguna. No he tocado el formulario ni la campaña.
```

## Veredicto

**El formulario no está roto.** Con 6 aperturas, 0 envíos es el resultado más probable. Lo que sí
está es configurado para calidad y no para velocidad, en cuatro sitios a la vez, y eso encarece el
aprendizaje justo cuando lo que hace falta es aprender rápido.

---

## 1 · El recorrido real

```
Anuncio → tap → Tarjeta de contexto → tap → 5 preguntas → tap → Revisión → tap → Enviar
```

Cuatro toques y dos pantallas antes de ver una pregunta.

## 2 · Los cuatro frenos, cada uno deliberado

| Ajuste | Valor | Efecto |
|---|---|---|
| `is_optimized_for_quality` | **True** | Formulario de «mayor intención»: añade pantalla de revisión. **El que más volumen quita** |
| `context_card` | `LIST_STYLE`, 3 líneas, botón «Pedir mi diagnóstico» | Pantalla extra antes de las preguntas |
| `questions` | **5** · nombre, email, teléfono + **2 de opción múltiple** | Las dos custom no se autorrellenan |
| `block_display_for_non_targeted_viewer` | **True** | Quien no esté en el público no puede enviarlo |

Ninguno está mal por separado. Los cuatro juntos, sí son mucho.

## 3 · La aritmética, para no inventar un problema

- Formulario nativo estándar: **40-60 %** de las aperturas se convierten.
- Con «mayor intención» + tarjeta de contexto + 2 preguntas que hay que pensar: **10-20 %** es lo
  razonable aquí.
- Con 6 aperturas y un 15 % esperado, **lo esperado son 0,6-1,2 leads**. Cero es lo más probable.

**P(0 envíos de 6) ≈ 0,38.** No es una señal, es ruido.

> **La línea:** `P(0 de 20) ≈ 0,04`. **Veinte aperturas sin un solo envío** sí sería un suceso
> improbable y ahí sí habría que mirar el formulario. Al ritmo actual, eso llega mañana.

## 4 · Confirmación de que no hay ningún lead de pago

`leads_count = 1` y `organic_leads_count = 1`. **El único lead registrado es orgánico**: la prueba
de Maikel del 11-sep. De pago van cero, y no ha habido ocasión de que fuera de otro modo.

## 5 · Si se quiere acelerar, un solo interruptor

**`is_optimized_for_quality` → `False`.**

Tiene una ventaja poco habitual: **no cuesta cualificación**. La cualificación de este formulario no
viene del tipo de formulario, viene de la pregunta *«¿Cuánto invertís al mes en conseguir
clientes?»*, que se queda igual y contiene el corte de 500 € del ICP. Hoy se está pagando el peaje
de volumen del modo «mayor intención» sin cobrar su beneficio.

Segundo cambio, gratis: **`block_display_for_non_targeted_viewer` → `False`**. Volumen sin coste.

**Lo que NO tocaría: el teléfono.** Es el campo de más fricción, pero la página de agradecimiento
dice «te mando un WhatsApp»: es una pieza que sostiene el seguimiento, no un adorno.

**Y no propongo aplicar nada hoy.** Con 6 aperturas no hay evidencia que justifique el cambio, y
cambiarlo ahora sería exactamente el error que este agente existe para evitar: mover cosas antes de
que el dato hable. Se decide con 20 aperturas.

## 6 · Lo que de verdad hay que vigilar mañana

No el número de leads. **El primer lead de pago que entre.** Ese hay que seguirlo a mano de punta a
punta: si aparece en GoHighLevel, la rama de formulario funciona entera; si no aparece, se habrá
pagado por un lead que nadie va a llamar. La integración **nunca se ha ejercitado**, porque nunca ha
habido un lead de pago que la ejercite.

Es la única pregunta abierta que puede convertir este gasto en dinero tirado, y se responde con un
solo lead.
