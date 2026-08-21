# Biblioteca estratégica de Qualivo — cómo funciona

> Creada el 21-ago-2026 sobre la arquitectura de 6 niveles propuesta por Maikel.
> **Propósito**: que el agente de contenido no se pregunte «¿qué publico hoy?»
> sino **«¿qué combinación tiene más probabilidad de generar negocio esta semana?»**.
>
> Fuentes de verdad de las que bebe esta biblioteca:
> - `content/documento-madre-qualivo.md` (idea central, fugas, niveles, hooks, territorio)
> - `content/oferta-sistema-recuperacion-ingresos.md` (mecanismo, escalera, garantía)
> - `content/guia-de-voz.md` (cómo se escribe todo)
> - `video-factory/recursos/metodo-angulos.md` (ángulos de venta para anuncios)

---

## El problema que resuelve

> «El problema no es crear contenido. El problema es quedarse sin ángulos.»

Sin biblioteca, cada día hay que inventar de cero. Con biblioteca, cada pieza es
**una coordenada** dentro de un espacio ya definido, y la única decisión diaria es
*qué coordenada toca hoy* — decisión que se puede puntuar con datos (radar de IA,
radar comercial, resultados de las piezas anteriores).

## Los 6 niveles

| Nivel | Fichero | Qué contiene | Rol en el motor |
|-------|---------|--------------|-----------------|
| 1 | `01-dolores.md` | Catálogo de fugas con ID, síntoma en lenguaje llano y coste típico | **Qué** duele |
| 2 | `02-icps.md` | Perfiles de cliente ideal, con sus dolores prioritarios | **A quién** le duele |
| 3 | `03-angulos.md` | 12 ángulos de contenido + 12 ángulos de venta (dos ejes distintos) | **Cómo** se cuenta |
| 4 | `04-niveles-consciencia.md` | Los 5 niveles + qué se puede y qué no se puede decir en cada uno | **Cuánto sabe** el que escucha |
| 5 | `05-matriz.md` | La combinación `ICP × Dolor × Ángulo × Nivel` y su puntuación | **Qué toca hoy** |
| 6 | `06-motor-campanas.md` | De una combinación ganadora a una campaña completa | **Qué se construye** |

## La unidad mínima: la combinación

Toda pieza de contenido de Qualivo se identifica con un código:

```
ICP-CLI · D-CUA-02 · A-COSTE · N2
└─ clínica  └─ el bueno   └─ coste   └─ sabe que
   privada     y el curioso   oculto     algo falla
               tratados igual
```

Ese código es suficiente para escribir el brief entero. Ejemplo, expandido:

> **A quién**: dueño de clínica privada con 3-8 profesionales.
> **Qué le duele**: su recepción trata igual al que quiere presupuesto de implante
> y al que pregunta el precio de una limpieza.
> **Cómo se lo cuento**: coste oculto — el precio no está en la agenda vacía, está
> en las horas de la mejor profesional gastadas en la consulta más barata.
> **Cuánto sabe**: sabe que algo no cuadra pero no sabe qué → le pongo nombre,
> no le vendo nada todavía. CTA de curiosidad, no de llamada.

## Reglas que la biblioteca impone (no negociables)

1. **Nunca se publica una combinación sin nivel de consciencia.** El mismo dolor
   contado a un nivel 1 y a un nivel 5 son dos piezas distintas; mezclarlos es
   la forma más rápida de no conectar con nadie.
2. **El dolor se dice en lenguaje llano, siempre.** Los IDs y las categorías son
   para nosotros. Al cliente se le habla como en la sección 8 del documento madre.
3. **Nunca el seguimiento como mensaje central.** El *speed to lead* lo vende
   cualquier agencia. Qualivo revisa el recorrido entero. Un dolor de la etapa
   SEGUIMIENTO puede ser el tema de una pieza, nunca el posicionamiento.
4. **Cero cifras inventadas.** Los «coste típico» de la biblioteca son *rangos de
   razonamiento* para construir el argumento, no datos publicables. Si una cifra
   sale a un vídeo o a un anuncio, sale del diagnóstico de un cliente real y con
   su permiso, o no sale.
5. **Una combinación quemada no vuelve en 60 días.** El registro está en
   `📊 QUALIVO DAILY` (Notion) — el motor consulta antes de proponer.
6. **Rotación obligatoria de ángulo.** Nunca dos piezas seguidas con el mismo
   ángulo de contenido, aunque el dolor sea distinto.

## Cómo se usa cada día

```
RADAR IA (04:00) ─┐
RADAR COMERCIAL ──┼→ ANALISTA → puntúa combinaciones de 05-matriz.md
SEÑALES PROPIAS ──┘              (qué dolor está caliente esta semana)
                                        │
                                        ▼
                              ESTRATEGA → elige y expande
                                        │
        ┌───────────────┬───────────────┼───────────────┬──────────────┐
        ▼               ▼               ▼               ▼              ▼
   Top 10          Top 5           Top 3           Top 3          Top 3
   contenidos      anuncios        lead magnets    landings       campañas
        │
        └──→ 📊 QUALIVO DAILY (Notion) → producción
```

Los cinco «Top» no son cinco decisiones distintas: son **la misma combinación
ganadora expresada en cinco formatos**. Eso es lo que hace que la semana tenga
hilo conductor en vez de ser una colección de piezas sueltas.
