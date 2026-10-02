# Motor V3 · una campaña, copy por lead (11-sep-2026)

## El problema que resuelve

Hasta hoy, las campañas "Brain" (ICP15, ICP08, ICP10, Multiservicio, Solar señal)
tenían el **paso 1 en variables** (`{{subject1}}` / `{{body1}}`, copy por lead) pero
los **pasos 2 y 3 escritos a fuego con la copia antigua**: el email del "¿lo viste?"
con el caso de la empresa de formación, la oferta de "vistazo gratis y por escrito"
y un enlace al calendario viejo de 30 min (`llamada-hackthelead`).

Es decir: el email 1 iba en V3 y los seguimientos contradecían al email 1 y mandaban
al calendario equivocado.

No se puede arreglar en caliente. Cambiar los pasos 2 y 3 exige
`POST /campaigns/{id}/sequences`, que reinicia el progreso de los leads y reenvía el
paso 1 a todo el mundo. Eso es exactamente el incidente de agosto (228 reenvíos,
1 queja LOPD). Ver `incidente-reenvios-smartlead-2026-08.md`.

## La solución

Campaña **3940264 · "V3 · Motor de puertas (copy por lead)"**, con los TRES pasos
en variables:

| Paso | Retardo | Asunto | Cuerpo |
|---|---|---|---|
| 1 | +0 d | `{{subject1}}` | `{{body1}}{{signature}}` |
| 2 | +3 d | (vacío, mismo hilo) | `{{body2}}{{signature}}` |
| 3 | +7 d | (vacío, mismo hilo) | `{{body3}}{{signature}}` |

El copy entero viaja con el lead. **Nunca más hay que tocar una secuencia**, así que
el riesgo de reenvío masivo desaparece de raíz. Cambiar el mensaje = cambiar el
script de carga, y solo afecta a los leads que se suban después.

Configuración: 15 buzones (los mismos que las Brain), L-V 09:00-17:00 Madrid,
12 min entre envíos, **120 leads nuevos/día** (las Brain estaban topadas a 15),
parar al responder, texto de baja visible (punto débil que señalaba el incidente).

## Cómo se carga

```
python3 captacion/scripts/carga_v3.py <SMARTLEAD_KEY> leads.json [--dry]
```

`leads.json` es una lista de objetos:

```json
{"email":"ana@kubysoft.com","first_name":"Ana","company_name":"Kubysoft",
 "dom":"kubysoft.com","puerta":"crm","v":{"crm":"HubSpot"}}
```

Puertas válidas: `anuncios`, `crm`, `base`, `multiservicio`, `mide`, `direccion`,
`comercial`. Variables por puerta: `crm` → crm · `base` → anios ·
`multiservicio` → l1,l2,l3 · `direccion` → cargo.

El script construye los tres cuerpos a partir de `estrategia/mensajes-v3.md`
(primera línea por puerta + cuerpo común + caso por puerta + pregunta final) y
avisa si el email 1 pasa de 110 palabras.

## Estado de las campañas viejas

Las cinco campañas Brain siguen activas con sus 50 leads dentro. Sus pasos 2 y 3
saldrán con la copia antigua salvo que se pausen. **Decisión de Maikel**, porque
las dos únicas salidas son malas a medias:

- **Dejarlas correr**: los leads reciben seguimiento, pero con un mensaje que no
  es el V3 y con el calendario de 30 min. La copia antigua está validada y no es
  ofensiva, solo incoherente.
- **Pausarlas**: nadie recibe un mensaje equivocado, pero esos 50 leads se quedan
  con un solo toque, y el seguimiento es donde salen la mayoría de respuestas.

Recomendación: dejarlas correr y no volver a cargar ni un lead en ellas. Todo lo
nuevo entra por el motor 3940264.
