# EAC · Fase 5 — Puntuación de leads y secuencias de email

Vive en el Google Sheet, pestaña **«F5 · Email + Scoring»**. Este documento es la copia versionada.

Objetivo: que la asesora llame primero a quien más probabilidad tiene de matricularse, y que el resto
madure solo por email en vez de perderse. Con 182 entrevistas y 26 matrículas en el trimestre, el cuello
de botella no es el volumen de leads sino **a quién se llama primero**.

## Modelo de puntuación (100 puntos)

| Bloque | Criterio | Pts |
|---|---|---|
| **Origen** (máx. 20) | Imán de leads del blog | 20 |
| | Espontáneo / recomendación | 18 |
| | Landing de campaña | 15 |
| | Formulario nativo de Meta | 12 |
| | Otros / desconocido | 8 |
| **Curso** (máx. 10) | Pide curso concreto (TCP, AT, FD) | 10 |
| | Interés general | 4 |
| **Plazo** (máx. 20) | Empezar en < 3 meses | 20 |
| | En 3-6 meses | 10 |
| | > 6 meses / no lo sabe | 3 |
| **Requisitos** (máx. 20) | Mayor de 18 · ESO · inglés funcional · sabe nadar | 5 c/u |
| **Datos** (máx. 15) | Teléfono válido | 8 |
| | Provincia área de Barcelona | 4 |
| | Email personal (no temporal) | 3 |
| **Comportamiento** (máx. 15) | Abre 2+ emails | 4 |
| | Clic en artículo de precio o curso | 6 |
| | Visita la página del curso | 5 |

### Penalizaciones

| Criterio | Pts | Acción |
|---|---|---|
| No habla español | −25 | Marcar, no pasar a comercial |
| Fuera de España | −15 | Solo secuencia informativa |
| Menor de 18 | −20 | Secuencia «vuelve cuando cumplas» |
| Descartado en campaña anterior | −10 | No repetir llamada en frío |
| Teléfono inválido | −15 | Solo email |

La penalización por idioma nace de un caso real: en agosto entraron leads que no hablaban español
porque los conjuntos de anuncios tenían el idioma sin definir. Ya está corregido en Meta
(`locales` = castellano, catalán, inglés en las 6 campañas), pero la regla queda como red de seguridad.

## Umbrales

| Puntuación | Etiqueta | Asesora | Sistema |
|---|---|---|---|
| 70-100 | CALIENTE | Llamada en < 1 h | Tarea urgente + aviso |
| 45-69 | TEMPLADO | Llamada el mismo día | Tarea normal + secuencia |
| 25-44 | TIBIO | No llamar todavía | Secuencia 14 días; si sube de 45, avisa |
| 0-24 | FRÍO | No tocar | Secuencia larga mensual |
| Negativo | DESCARTADO | No tocar | Fuera de secuencias comerciales |

## Secuencia principal — Test de requisitos TCP (14 días)

| Día | Asunto | Objetivo | CTA |
|---|---|---|---|
| 0 | Tu resultado: esto es lo que te falta para ser TCP | Valor inmediato, confianza | Ver resultado completo |
| 1 | Los requisitos que sí importan (y los que son leyenda) | Desmontar mitos | `/blog/requisitos-azafata-vuelo/` |
| 3 | Lo que se gana de verdad volando | Motivación económica | `/blog/cuanto-cobran-las-azafatas-de-vuelo/` |
| 5 | Cuidado con los cursos que no son oficiales | Diferenciación AESA | `/blog/curso-tcp-precio-cuanto-cuesta/` |
| 8 | Así es la selección de una aerolínea por dentro | Ventaja de ir preparado | `/blog/como-superar-entrevista-tcp-aerolinea/` |
| 11 | Cuánto cuesta y cómo se puede pagar | Quitar objeción de precio | Hablar con el equipo |
| 14 | ¿Te llamamos y lo vemos en 10 minutos? | Cierre a llamada | Reservar llamada |

Cada email enlaza a un artículo del lote: la secuencia y el blog se alimentan mutuamente, y cada clic
suma puntos y puede subir el lead de tibio a templado automáticamente.

## Secuencias secundarias

| Origen | Emails | Enfoque | Curso |
|---|---|---|---|
| Calculadora de sueldo | 5 en 10 días | Económico: sueldo, dietas, progresión | TCP |
| Guía de selección | 6 en 12 días | Preparación: CV, entrevista, dinámica | TCP |
| Test de perfil cabina/tierra | 5 en 10 días | Orientación y encaje de vida | TCP / AT |
| Temario despachador | 5 en 12 días | Técnico: salidas, poca competencia | FD |
| Lead que no cerró | 4 mensuales | Reactivación en cada convocatoria | El que pidió |

## Reglas de automatización (GoHighLevel)

| Cuando ocurre | El sistema hace |
|---|---|
| Entra un lead desde un imán | Calcula puntuación, asigna etiqueta, arranca secuencia |
| La puntuación pasa de 70 | Tarea urgente + aviso a la asesora |
| Clic en email de precio | +6 puntos y recalcula |
| Asesora marca «entrevistado» | Pausa la secuencia automática |
| No contesta a 3 llamadas | Pasa a maduración larga |
| Se matricula | Sale de todas las secuencias comerciales |
| «No cumple requisitos» | Sale de secuencias y queda etiquetado |

Todo se monta dentro de GoHighLevel, que ya es el CRM comercial. No hace falta herramienta nueva.
