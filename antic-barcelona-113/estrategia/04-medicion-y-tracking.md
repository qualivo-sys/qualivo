# 04 · Medición y tracking

> Sin esto, la campaña es opinión. Con esto, es un experimento.

## 1. El mapa de eventos

Ocho eventos, en orden de prioridad para Aggregated Event Measurement (AEM). Meta solo
procesa 8 por dominio y **el orden importa**: en iOS, si un usuario dispara varios, solo
se atribuye el de mayor prioridad.

| # | Evento Meta | Cuándo se dispara | Volumen/mes esperado | Uso |
|---|---|---|---|---|
| 1 | `Purchase` | Venta cerrada (manual desde CRM) | 1-2 | Cálculo de ROAS real |
| 2 | `Schedule` | Visita al taller agendada | 3-6 | Señal de intención máxima |
| 3 | `CompleteRegistration` | Cuestionario de 6 pasos terminado | 20-30 | **Evento de negocio.** Optimización fase 2 |
| 4 | `Contact` | Clic en el botón de WhatsApp | 15-40 | Intención directa |
| 5 | `Lead` | Guía descargada (email entregado) | 70-110 | **Evento de optimización fase 1** |
| 6 | `InitiateCheckout` | Cuestionario iniciado (paso 1 respondido) | 40-60 | Diagnóstico de abandono |
| 7 | `ViewContent` | Scroll ≥ 50 % de la landing | 300-600 | Audiencia de retargeting caliente |
| 8 | `PageView` | Carga de cualquier página | 1.500-3.000 | Base de retargeting |

**Por qué `Lead` es el evento de optimización y no `CompleteRegistration`:** con 20-30
cuestionarios al mes, Meta recibe ~6 señales por semana. Necesita ~50. El algoritmo
nunca convergería. `Lead` (70-110/mes ≈ 20/semana) se queda corto pero es viable; a
partir del mes 3, si el volumen sube, se migra la optimización al evento 3.

## 2. Parámetros personalizados

Todos los eventos del cuestionario deben enviar el contexto de negocio. Esto es lo que
permite después decir "los leads del concepto 02 piden mesas más grandes" en vez de
"el concepto 02 va bien".

```js
// CompleteRegistration
{
  content_name:  'cuestionario_particular',
  tier:          'HOT' | 'WARM' | 'COLD',   // del scoring del cuestionario
  pieza:         'Mesa' | 'Banco' | 'Cajonera' | 'Otra',
  espacio:       'Salón' | 'Comedor' | 'Cocina' | 'Restaurante' | 'Otro',
  plazo:         'Lo antes posible' | '3 meses' | 'Este año' | 'Explorando',
  presupuesto:   <número o null>,
  value:         <presupuesto declarado o valor estimado por tier>,
  currency:      'EUR'
}
```

**El campo `value` es clave.** Permite a Meta optimizar por *valor* y no solo por
volumen a partir del mes 3. Valores por defecto cuando el usuario no declara presupuesto:
HOT = 3.000, WARM = 1.500, COLD = 300. **[SUPUESTO — ajustar con el ticket medio real]**

## 3. Pixel + Conversions API

**Solo píxel no es suficiente.** Entre iOS 14.5+, bloqueadores de anuncios y navegadores
con protección de rastreo, se pierde entre el 20 % y el 40 % de los eventos. En una
campaña de 20 conversiones al mes, perder el 30 % significa perder 6 señales de las ~20
que el algoritmo necesita. Es la diferencia entre que la campaña aprenda y que no.

**Implementación recomendada por orden de esfuerzo:**

| Opción | Esfuerzo | Coste | Recomendado |
|---|---|---|---|
| Píxel + CAPI vía **Meta Conversions API Gateway** | Alto | ~30 €/mes servidor | Si hay volumen |
| Píxel + CAPI vía **Zapier / Make** desde el formulario | Bajo | ~20 €/mes | ✅ **Para empezar** |
| Píxel + CAPI vía **integración de partner** (Stape, Segment) | Medio | 20-50 €/mes | Alternativa sólida |
| Solo píxel | Mínimo | 0 € | ❌ No recomendado |

**Deduplicación obligatoria:** cada evento se envía dos veces (navegador + servidor) con
el mismo `event_id`. Sin `event_id`, Meta cuenta doble y el CPL parece la mitad de lo que
es. Es el error de implementación más común.

```js
const eventId = crypto.randomUUID();
fbq('track', 'Lead', { ...params }, { eventID: eventId });
// y el mismo eventId en la llamada de servidor a la Conversions API
```

## 4. Datos de coincidencia avanzada

Enviar siempre que se tengan, hasheados con SHA-256 (el píxel lo hace solo si se activa
"Coincidencia avanzada automática"):

`em` (email) · `ph` (teléfono con prefijo +34) · `fn` / `ln` (nombre) · `ct` (ciudad) ·
`country` · `fbc` (de `fbclid`) · `fbp` (cookie de píxel)

**El `fbclid` hay que capturarlo y guardarlo en el CRM.** Es lo que permite atribuir una
venta que se cierra ocho semanas después de que el usuario hiciera clic.

```js
// capturar al aterrizar y persistir 90 días
const p = new URLSearchParams(location.search);
if (p.get('fbclid')) {
  localStorage.setItem('_fbc', `fb.1.${Date.now()}.${p.get('fbclid')}`);
}
```

## 5. UTMs

Plantilla única para todos los anuncios. Meta rellena las macros automáticamente:

```
?utm_source=meta
&utm_medium=paid_social
&utm_campaign={{campaign.name}}
&utm_content={{ad.name}}
&utm_term={{adset.name}}
&utm_id={{campaign.id}}
```

Con esto y la nomenclatura de `02-plan-de-medios-meta.md` §8, cada lead del CRM lleva
escrito de qué anuncio exacto vino.

## 6. Cuadro de mando semanal

Cinco filas. Ni una más: un informe de 40 métricas no se lee.

| Métrica | Fuente | Objetivo | Alarma |
|---|---|---|---|
| Inversión | Meta | ~210 €/semana | ±15 % |
| CPL guía | Meta / `Lead` | < 15 € | > 20 € |
| CPL cualificado | Meta / `CompleteRegistration` | < 80 € | > 120 € |
| % leads HOT | CRM | > 25 % | < 15 % |
| Coste por venta | CRM | < 600 € | > 900 € |

Más dos diagnósticos cualitativos que hay que mirar cada lunes:
- **Frecuencia** por conjunto (alarma > 3,5)
- **Mejor y peor anuncio** por CPL, para decidir la rotación semanal

## 7. Lo que Meta NO va a medir bien (y cómo compensarlo)

Con un ciclo de 3-12 semanas, parte de las ventas se atribuirán a "directo" u "orgánico".
El panel de Meta va a **subestimar** el resultado real.

**Compensación:** pregunta obligatoria en el cuestionario y en la llamada comercial:

> "¿Cómo nos has conocido?" → Instagram / Facebook / Google / Recomendación / Ya os conocía / Otro

Cruzar ese dato con el de Meta cada mes. Si Meta reporta 1 venta y el comercial ha
apuntado 3 "os vi en Instagram", el ROAS real es 3 veces el reportado. Esa conversación
con el cliente hay que tenerla en el **primer** informe mensual, no cuando pida cancelar.

## 8. RGPD

- Banner de consentimiento **antes** de cargar el píxel (consentimiento previo, no
  implícito). El píxel es tecnología de rastreo de terceros: cargarlo sin consentimiento
  es infracción del art. 22 LSSI.
- Política de privacidad enlazada en el formulario, con base legal (consentimiento) y
  finalidad (envío de la guía + contacto comercial).
- Casilla de consentimiento **no premarcada** para comunicaciones comerciales.
- Registro de consentimientos con marca temporal.
- Derecho de supresión operativo (un correo a info@ debe bastar).
