# Agent to Me · Campaña A1 · Contratando administrativo

Campaña Smartlead **3804379**. Lanzada el 14-ago-2026. Primera campaña de
Agent to Me en producción.

## Configuración

- **ICP**: 11-200 empleados, España, con vacante activa de administrativo, back
  office, atención al cliente u office manager. Decisor fundador, CEO, COO u owner.
- **Leads**: 20 verificados, uno por dominio, cruzados contra la lista de
  supresión compartida (solo cayó una empresa por solape con Qualivo).
- **Envío**: 3 buzones de goqualivo, los de mejor reputación. Decisión de Maikel:
  no comprar dominio hermano por ahora. El remitente es de Qualivo y el cuerpo y
  la firma dicen Agent to Me.
- **Ritmo**: 10 leads nuevos al día, laborables 9:00-18:00 Europe/Madrid, 12
  minutos entre correos. Tope bajo a propósito para no comerle capacidad a las
  campañas de Qualivo.

## Objetivo

**No es cerrar venta. Es acumular tareas reales.**

```
100 empresas contactadas
  → 10-20 respuestas
  → 10-20 tareas reales
  → analizarlas y buscar patrones
  → "el 40% nos da tareas de seguimiento"
  → EMPLEADO IA DE FOLLOW-UP paquetizado
```

Eso alimenta a la vez outbound, contenido, lead magnet y producto.

## Secuencia (copy aprobado por Maikel)

### Email 1, día 0. Asunto: Antes de firmar esa nómina

> Hola {{first_name}},
>
> He visto que en {{company_name}} estáis buscando a alguien para administración
> y atención. Una pregunta antes de contratar.
>
> De ese puesto, probablemente una parte importante del trabajo sean tareas
> repetitivas: clasificar correos, pasar datos de un sitio a otro, perseguir
> documentos que faltan o responder una y otra vez a las mismas preguntas.
>
> La pregunta es cuánto de ese trabajo necesita realmente a una persona.
>
> Si me dices una tarea concreta que se repita cada semana en {{company_name}},
> te devuelvo por escrito cómo podría hacerla un empleado IA:
> — qué haría
> — qué no haría
> — cuánto trabajo podría asumir
>
> Gratis.
>
> ¿Qué tarea te viene a la cabeza?

### Email 2, día +3. Mismo hilo

> Por si te sirve para aterrizarlo, {{first_name}}:
>
> en empresas con procesos parecidos hemos encontrado que algunas tareas
> administrativas pueden acumular decenas de horas al mes sin que nadie las
> tenga realmente medidas.
>
> No te escribo para decirte que no contrates a esa persona. Solo para saber qué
> parte del trabajo necesita realmente a una persona.
>
> Si me dices una tarea, te hago el análisis.

### Email 3, día +6. Mismo hilo

> {{first_name}}, un ejemplo concreto.
>
> Hace poco analizamos un puesto con tareas de administración, seguimiento y
> actualización de sistemas. Solo en trabajo repetitivo había una estimación de
> 32 horas semanales.
>
> No todo era automatizable. Pero había una parte importante que sí.
>
> Si quieres, hacemos lo mismo con el puesto que estáis buscando. Dime una tarea
> y te lo devuelvo por escrito.

### Firma, común a las dos marcas

```
Maikel Echevarría
Qualivo · detectamos qué falla en tu captación y ventas
Agent to Me · convertimos tareas repetitivas en empleados IA
```

## Qué hacer cuando respondan

Si contestan con una tarea, por ejemplo "actualizar el CRM después de cada
llamada", se devuelve la ficha por escrito:

> **CRM Follow-up Agent**
> Hace... / No hace... / Podría encargarse de... / Necesitaría intervención
> humana cuando...
>
> Si quieres, te enseño cómo quedaría conectado a vuestro proceso.

A partir de ahí ya hay conversación comercial. No intentar cerrar antes.

## Decisiones de copy y por qué

Tres cambios que hizo Maikel sobre el borrador inicial, todos acertados:

1. **Fuera "eso ya no hace falta que lo haga una persona".** Provocaba reacción
   defensiva ("me está diciendo que no contrate"). Sustituido por "la pregunta es
   cuánto de ese trabajo necesita realmente a una persona", que pone en duda el
   alcance del puesto sin discutir la contratación.
2. **El follow-up desactiva la defensa explícitamente**: "no te escribo para
   decirte que no contrates a esa persona".
3. **Firma más concreta**: "equipos digitales que hacen el trabajo repetitivo"
   era abstracto. "Convertimos tareas repetitivas en empleados IA" se entiende en
   seis palabras.

## Retadores de asunto, pendientes de volumen

Con 20 leads no hay muestra para un A/B. Cuando la lista pase de 100:

- Una cosa antes de contratar
- Antes de contratar para ese puesto

## Nota técnica

El reemplazo de secuencia por API se hizo con la campaña recién creada y **cero
envíos previos**, que es el único caso en el que esa llamada es segura. Con leads
ya contactados provoca reenvíos, como pasó el 11-ago.
