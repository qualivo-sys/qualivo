# Alpha · las 8 etapas en el Zoho de pruebas

29-oct-2026 · para la reunión del lunes 2-nov a las 17:00 · [C] confirmado · [E] estimación

## Estado a las 29-oct

- **Bloqueado.** El Zoho de pruebas rechaza nuestro usuario de API («usuario inactivo») desde el 27-oct [C, parte del 29-oct]. No se puede crear nada hasta que Alpha lo reactive.
- **Listo para aplicarse en cuanto se reactive:** la configuración completa (`alpha/zoho/etapas_v2.json`) y el script que crea campos y etapas (`alpha/zoho/aplicar_etapas_v2.py`). El script solo trabaja contra un dominio de sandbox y por defecto solo lee y enseña el plan.
- **Fecha límite para llegar al lunes:** reactivación el **viernes 30 a las 12:00**. Montarlo lleva unas 3 h [E]: 10 min el script, ~2 h las reglas de validación y de flujo a mano, ~45 min las pruebas.
- **Plan B** si no se reactiva el viernes: una sesión de 45 min con Sergi o con quien administre Zoho el lunes por la mañana, en la que él comparte pantalla y lo montamos con esta guía. O bien que Alpha dé de alta a maikel@qualivo.io como administrador del sandbox.

Para pedir la reactivación hace falta escribir a Sergi: **pendiente del OK de Maikel**.

## Por qué son 8

El documento de Sergi («Tareas por etapa - flujo comercial v2.pdf», 26-oct) numera de 0 a 10. En Zoho quedan **8 etapas de pipeline**, que es lo que prometió el correo del 27-oct:

| # | Etapa | Probabilidad | Entra con |
|---|---|---|---|
| 1 | Nueva oportunidad | 10 % | — |
| 2 | Cualificación (briefing) | 20 % | — |
| 3 | Planificación | 30 % | **Briefing completo (obligatorio)** |
| 4 | Propuesta enviada | 40 % | — |
| 5 | Ajustes y versionado | 50 % | **Número de versión y qué cambia** |
| 6 | Reservada | 75 % | — |
| 7 | Ganada | 100 % | **Contrato firmado u orden de compra adjunta** |
| 8 | Operaciones y facturación | 100 % | Documento de cierre. **No se marca «Lista para facturar» sin la foto de la campaña colocada** |

Lo demás no es etapa de pipeline:
- **0 · Prospección** se queda en Leads (marketing).
- **Pospuesta y Perdida** son estados de salida que ya existen. Pospuesta exige motivo y fecha de recontacto; Perdida, motivo (ya obligatorio en pruebas [C]).
- **Contactada y Reunión agendada** dejan de usarse; los tratos que estén ahí se conservan.

Las probabilidades son una propuesta [E]: las decide Sergi.

## Campos nuevos en Oportunidades (16)

| Bloque | Campos |
|---|---|
| Briefing (7) | Objetivo de campaña · Zonas · Inicio de campaña · Fin de campaña · Presupuesto orientativo · Decisor · Empresa a facturar |
| Versionado (3) | Versión de la propuesta · Fecha de la última versión · Qué cambia en esta versión |
| Cierre (2) | Documento de cierre (contrato firmado / orden de compra / confirmación por correo autorizada) · Archivo del documento de cierre |
| Operaciones (3) | Foto de la campaña colocada (imagen) · Fecha de colocación · Lista para facturar |
| Pospuesta (1) | Motivo de pospuesta |

Ya existen en pruebas [C, notas del 20-oct]: Fecha primer contacto, Fecha de recontacto y Motivo de pérdida obligatorio. El script comprueba que siguen ahí.

## Montaje paso a paso

### 1. Campos y etapas (script, 10 min)

```
export ZOHO_API_BASE=https://sandbox.zohoapis.eu
export ZOHO_TOKEN=...            # usuario de API de pruebas, ya reactivado
python3 alpha/zoho/aplicar_etapas_v2.py            # plan: qué falta
python3 alpha/zoho/aplicar_etapas_v2.py --aplicar  # lo crea
```

Después, a mano: **Configuración › Personalización › Módulos y campos › Oportunidades › Diseño estándar**, poner los campos en los bloques Briefing, Versionado, Cierre y Operaciones. Y en **Configuración › Personalización › Pipelines**, ordenar las 8 etapas y quitar del pipeline Contactada y Reunión agendada.

### 2. Reglas de validación (a mano, ~45 min)

**Configuración › Personalización › Módulos y campos › Oportunidades › Reglas de validación**. Una regla por fila:

| Cuando la etapa es | No deja guardar si falta | Mensaje |
|---|---|---|
| Planificación (o posterior) | Cualquiera de los 7 campos del briefing | «Falta el briefing: completa los 7 campos antes de pasar a Planificación.» |
| Ajustes y versionado | Versión de la propuesta · Qué cambia | «Indica el número de versión y qué cambia.» |
| Ganada | Documento de cierre · Archivo del documento de cierre | «Solo se gana con contrato firmado u orden de compra adjunta.» |
| Pospuesta | Motivo de pospuesta · Fecha de recontacto | «Pon el motivo y la fecha de recontacto (máximo 90 días).» |
| (Lista para facturar = sí) | Foto de la campaña colocada · Fecha de colocación | «Para facturar hace falta la foto de la campaña colocada.» |

**Por comprobar en el sandbox [E]:** si la regla de validación de Zoho deja comprobar que un campo de archivo o de imagen está vacío. Si no lo deja, esas dos reglas se hacen con **Blueprint** (Configuración › Automatización › Blueprint), con el archivo como obligatorio en la transición a Ganada y a Lista para facturar. Depende de la edición de Zoho de Alpha.

### 3. Tareas por etapa (reglas de flujo, ~75 min)

**Configuración › Automatización › Reglas de flujo de trabajo › Crear regla** · Módulo Oportunidades · «Cuando se edita un registro» · campo Etapa cambia a X · acción «Tarea», asignada al propietario, vencimiento «fecha de la regla + N días».

Zoho cuenta días naturales y el documento de Sergi habla de días laborables. Por eso los plazos se pasan a días naturales enteros, y Nexus mide las horas laborables y los escalados.

| Al entrar en | Tarea | Vence a los |
|---|---|---|
| Nueva oportunidad | Primer contacto (intento 1 de 3) · Primer contacto (intento 3 de 3) | 0 días · 2 días |
| Cualificación | Completar el briefing | 7 días (5 laborables) |
| Planificación | Elegir caras y montar la propuesta | 2 días |
| Propuesta enviada | Seguimientos día 2, 5 y 10 · Decidir | 2 · 7 · 14 · 21 días |
| Ajustes y versionado | Enviar versión nueva | 2 días |
| Reservada | Confirmar reserva | 3 días (regla de 72 h) |
| Ganada | Traspaso a operaciones | 1 día |
| Operaciones y facturación | Subir foto de la campaña colocada · Emitir factura | al inicio de campaña · 1 día tras «Lista para facturar» |
| Pospuesta | Recontactar | en la Fecha de recontacto |

Una regla más: **importe ≥ 30.000 €** y la etapa cambia a Propuesta enviada, Ganada o Perdida → correo al CEO.

Regla de oro del documento de Sergi: si ya hay una tarea abierta, no se crea otra. Zoho no lo puede comprobar en la regla [E]; lo vigila Nexus en la lista del día.

## Pruebas para el lunes (~45 min)

Con tratos de prueba creados en el sandbox, sin tocar datos reales:

1. Pasar un trato de Cualificación a Planificación sin briefing → **Zoho lo impide**. Con el briefing completo → deja.
2. Pasar a Propuesta enviada → **aparecen las 4 tareas** con sus fechas.
3. Pasar a Ajustes y versionado sin versión → lo impide.
4. Pasar a Ganada sin documento → lo impide. Con orden de compra adjunta → deja y crea «Traspaso a operaciones».
5. Marcar «Lista para facturar» sin foto → lo impide. Con foto → deja y crea «Emitir factura».
6. Pasar a Pospuesta sin fecha → lo impide.
7. Trato de 35.000 € a Propuesta enviada → llega el correo al CEO.

## Abierto (decide Alpha)

- Las probabilidades de cada etapa.
- El «X %» de descuento que aprueba dirección.
- Quién valida la factura y en qué plazo.
- Si la foto de la campaña colocada la sube el comercial o la app del fijador (Chronos). En esta versión la sube quien tenga el trato.
