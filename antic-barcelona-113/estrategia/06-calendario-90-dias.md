# 06 · Calendario de 90 días

Escenario de referencia: **900 €/mes**. Cada fase tiene una condición de salida explícita:
si no se cumple, no se pasa a la siguiente.

---

## SEMANA 0 · Preparación *(antes de gastar un euro)*

| # | Tarea | Responsable | Bloqueante |
|---|---|---|---|
| 1 | Business Manager y cuenta publicitaria a nombre del cliente | Cliente | ✅ |
| 2 | Verificación del dominio en Meta | Agencia | ✅ |
| 3 | Píxel + Conversions API con deduplicación | Agencia | ✅ |
| 4 | Priorización de los 8 eventos (AEM) | Agencia | ✅ |
| 5 | Landing publicada con política de privacidad y banner de cookies | Agencia | ✅ |
| 6 | **Guía PDF terminada y entrega automatizada** | Cliente + Agencia | ✅ |
| 7 | WhatsApp Business con respuesta rápida configurada | Cliente | ✅ |
| 8 | Hoja de CRM creada y compartida | Agencia | ✅ |
| 9 | 10 creatividades subidas a la biblioteca de Meta | Agencia | ✅ |
| 10 | **Definición del SLA de respuesta y quién lo cubre** | Cliente | ✅ |
| 11 | Ticket medio y margen confirmados | Cliente | ⚠️ Para el modelo económico |
| 12 | Recopilación de fotos reales de proyectos entregados | Cliente | ⚠️ Alta prioridad |

> **Condición de salida:** los 10 bloqueantes en verde. Lanzar sin el 3, el 6 o el 10
> es tirar el presupuesto del primer mes.

---

## SEMANAS 1-2 · Lanzamiento y aprendizaje

**Qué se hace**
- Se activa `AB113 | FRIO | Lead` con 22 €/día y los 10 anuncios.
- Retargeting **apagado** — todavía no hay audiencia.
- Se revisa el panel **una vez al día** para detectar errores técnicos, no rendimiento.

**Qué NO se hace**
- ❌ Cambiar presupuestos
- ❌ Pausar anuncios por "sensación"
- ❌ Editar copys
- ❌ Añadir públicos

> Cada edición reinicia la fase de aprendizaje. Es la regla más incumplida del sector y
> la más cara. **Dos semanas de no tocar nada.**

**Única intervención permitida:** apagar un anuncio con > 3.000 impresiones y **cero**
clics de enlace (eso es un fallo, no un resultado).

**Condición de salida:** ≥ 25 leads acumulados y píxel registrando `Lead` correctamente.
Si a día 10 hay menos de 8 leads, revisar la landing antes que la campaña.

---

## SEMANA 3 · Primera poda y diagnóstico

**Poda de creatividad** (reglas de `02` §6):
- Apagar CTR < 0,6 % con > 2.000 impresiones
- Apagar CPL > 30 € con > 30 € gastados
- Quedarse con 5-6 anuncios activos

**Diagnóstico de embudo** — esta es la semana clave para saber *dónde* está el problema:

| CTR | Conversión landing | Diagnóstico | Acción |
|---|---|---|---|
| Bueno | Buena | Todo bien | Escalar +20 % |
| Bueno | Mala | **Problema de landing** | Revisar velocidad, promesa y CTA. No tocar Meta |
| Malo | — | **Problema de creatividad** | Rotar. Priorizar la sesión de fotos |
| Malo | — (y CPM alto) | Público equivocado o mercado saturado | Probar exclusión de intereses o ampliar geo |

**Entregable:** primer informe al cliente. Cinco métricas de `04` §6, nada más.

---

## SEMANA 4 · Activación de retargeting

- Se activa `AB113 | RTG | Lead` con 8 €/día y las 3 creatividades de retargeting.
- Audiencia base esperada: 400-800 visitantes acumulados.
- Vigilar frecuencia desde el primer día.

**Condición de salida del mes 1:** CPL guía < 20 € y ≥ 45 leads acumulados.
Si no se cumple, **no se escala**: se resuelve el cuello de botella identificado en la
semana 3.

---

## MES 2 · Iteración creativa

| Semana | Acción |
|---|---|
| 5 | Producir 3 variantes nuevas del **concepto ganador** (mismo ángulo, distinta ejecución) |
| 5 | **Sesión de fotos real** si el cliente la aprueba — es la palanca de mayor retorno |
| 6 | Activar las 3 variantes. Sustituir a los 3 peores anuncios |
| 6 | Test del vídeo de 15 s (guion en `03` §4) |
| 7 | Test de gancho: mismo anuncio ganador con 3 primeras líneas distintas |
| 8 | Informe mensual + **conversación de atribución** (`04` §7) |

**Objetivo del mes 2:** bajar el CPL cualificado por debajo de 80 € e identificar el
ángulo ganador con datos, no con opinión.

**Condición de salida:** ≥ 15 leads cualificados en el mes y al menos 1 presupuesto enviado.

---

## MES 3 · Consolidación y decisión

| Semana | Acción |
|---|---|
| 9 | Migrar la optimización a `CompleteRegistration` **si** hay ≥ 30 eventos/mes |
| 9 | Crear **Lookalike 1 %** de leads cualificados **si** hay ≥ 100 conversiones acumuladas |
| 10 | Test de valor: optimización por valor de conversión usando el campo `value` |
| 11 | Segunda tanda creativa a partir de la sesión de fotos |
| 12 | **Informe de cierre de trimestre y decisión de continuidad** |

**Las tres decisiones del mes 3:**

1. **¿Escalar?** Si el CPL cualificado < 80 € y hay ≥ 1 venta atribuida → subir a
   1.200-1.500 €/mes.
2. **¿Abrir B2B?** Si el funnel B2C es rentable y estable → conjunto separado para
   interioristas y hostelería (ver fase 3).
3. **¿Parar?** Si tras 90 días el coste por venta supera el margen bruto por venta y el
   embudo no ha mejorado mes a mes, **hay que decirlo**. Meta no es el canal adecuado
   para todos los negocios, y proponer un cuarto mes idéntico sabiendo que no funciona
   es la forma más rápida de perder el cliente.

---

## FASE 3 · Meses 4-6 *(condicionada al éxito de la fase 1)*

| Iniciativa | Requisito previo | Presupuesto adicional |
|---|---|---|
| **Campaña B2B** — interioristas, arquitectos, hostelería | Funnel B2C rentable | +300-500 €/mes |
| **Google Ads búsqueda** — "mesa a medida barcelona", "mesa madera maciza tronco" | Landing con buena conversión | +400-600 €/mes |
| **Vídeo a escala** — línea de 4-6 piezas de taller | Sesión de fotos hecha | Producción |
| **Orgánico Instagram/Pinterest** | Contenido de taller fluyendo | Tiempo, no medios |
| **Email a base propia** | > 300 contactos en lista | ~30 €/mes |

**Nota sobre Google Ads:** la intención de búsqueda en esta categoría es mejor que la de
Meta ("mesa a medida barcelona" es alguien que ya la quiere). Si hubiera presupuesto para
un solo canal *y* el cliente tuviera prisa por vender, Google sería la primera opción.
Con 600-1.000 € hay que elegir uno, y Meta gana porque **esta categoría se descubre antes
de buscarse**: casi nadie sabe que puede encargar una mesa de tronco de una sola pieza
hasta que la ve.

---

## Resumen visual del trimestre

```
SEM 0    ████ Preparación técnica · sin gasto
SEM 1-2  ████████ Frío 22 €/día · NO TOCAR NADA
SEM 3    ████ Poda + diagnóstico + informe 1
SEM 4    ████ + Retargeting 8 €/día
MES 2    ████████████████ Iteración creativa + fotos reales
MES 3    ████████████████ Optimización por valor + decisión
                              │
                              ├─► Escalar a 1.200-1.500 €
                              ├─► Abrir B2B
                              └─► O parar, con honestidad
```
