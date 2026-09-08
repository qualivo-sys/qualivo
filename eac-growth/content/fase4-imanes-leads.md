# EAC · Fase 4 — Imanes de leads

Vive en el Google Sheet, pestaña **«F4 · Imanes de Leads»**. Este documento es la copia versionada.

Objetivo: convertir el tráfico SEO del blog en leads con nombre y teléfono, para dejar de depender
exclusivamente de la inversión en Meta.

## Los 5 imanes

| # | Imán | Formato | Dónde vive | Etiqueta CRM | Curso |
|---|---|---|---|---|---|
| 1 | ¿Cumples los requisitos para ser TCP? | Test 6 preguntas + resultado | P1 · requisitos, entrevista, azafato, precio | `lm_test_tcp` | TCP |
| 2 | Cuánto ganarías como TCP | Calculadora | P1 · cuánto cobran (99k impr.), salidas | `lm_calc_sueldo` | TCP |
| 3 | Cómo superar la selección de una aerolínea | PDF 12 pág. | P5 · entrevista, cómo entrar en aerolínea | `lm_guia_seleccion` | TCP |
| 4 | ¿Cabina o tierra? | Test 8 preguntas | P7 · TCP o azafata de tierra, trabajos aeropuerto | `lm_test_perfil` | TCP / AT |
| 5 | Temario y salidas del despachador | PDF + programa | P3 · despachador, curso FD, vs controlador | `lm_temario_fd` | FD |

El orden de prioridad sigue al tráfico: los imanes 1 y 2 se colocan en los artículos que ya reciben
más impresiones (99.000 y 75.000 al trimestre).

## Campos que se capturan

| Campo | Obligatorio | Para qué |
|---|---|---|
| Nombre | Sí | Personalización de secuencia y llamada |
| Email | Sí | Entrega del resultado + secuencia |
| Teléfono | Sí | Sin teléfono no hay llamada comercial |
| Curso de interés | Sí (el test lo deduce) | Enruta pipeline y mensaje |
| ¿Cuándo quieres empezar? | Sí | Mayor predictor de cierre → alimenta el scoring |
| Edad / ESO / inglés / natación | Test | Filtra requisitos antes de gastar tiempo comercial |
| Provincia | No | Prioriza área de Barcelona (formación presencial) |

## Flujo técnico

1. Lector llega al artículo desde Google (WordPress).
2. Ve el bloque del imán **dentro** del artículo.
3. Completa el test / pide la guía → formulario alojado en Vercel.
4. El lead entra al CRM con etiqueta, curso y puntuación (GoHighLevel).
5. Recibe su resultado al instante.
6. Si puntúa ≥ 70, tarea urgente para la asesora.
7. Si no, sigue madurando en la secuencia de 14 días.

El formulario se aloja **fuera de WordPress** a propósito: el sitio viene de un ataque y no conviene
añadirle plugins de formularios ni superficie nueva. Solo se incrusta un bloque ligero.

## Objetivos de referencia

| Métrica | Objetivo | Cómo se lee |
|---|---|---|
| Visitantes que ven el imán | > 60% | Va dentro del artículo, no al final |
| Que lo empiezan | 8-15% | Por debajo de 8%, el gancho no interesa |
| Que lo completan | 50-70% | Por debajo de 50%, pide demasiados datos |
| Leads / 1.000 visitas | 40-90 | Referencia de test interactivo en formación |
| Con teléfono válido | > 85% | Si baja, el campo teléfono espanta |

## Bloqueante

Los artículos actuales del blog llevan **formulario de HubSpot** (`js-eu1.hsforms.net`, portalId 26314109)
y el CRM comercial es **GoHighLevel**. Hay que unificar en uno antes de lanzar los imanes, o los leads
quedarán partidos entre dos sistemas y la atribución volverá a romperse.
