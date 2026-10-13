# EAC · Imanes de leads (Fase 4)

Vista previa desplegada: **https://eac-imanes.vercel.app**

Cinco piezas estáticas + una función de captación. Sin framework, sin build, sin dependencias.

| Ruta | Imán | Etiqueta CRM | Curso |
|---|---|---|---|
| `/test-tcp` | Test de requisitos TCP (6 preguntas + informe) | `lm_test_tcp` | TCP |
| `/calculadora-sueldo` | Calculadora de sueldo TCP | `lm_calc_sueldo` | TCP |
| `/guia-seleccion` | Guía del proceso de selección | `lm_guia_seleccion` | TCP |
| `/test-perfil` | Test cabina / tierra / operaciones | `lm_test_perfil` | TCP · AT |
| `/temario-despachador` | Temario y salidas de despachador | `lm_temario_fd` | FD |

## Estructura

- `assets/eac.css` — sistema visual compartido (mismos tokens que los artículos del blog)
- `assets/eac.js` — motor de test, modelo de puntuación de la Fase 5 y formulario de captura
- `api/lead.js` — recepción del lead

## Conexión al CRM

`api/lead.js` reenvía a `process.env.CRM_WEBHOOK_URL`. **Sin esa variable definida responde en modo
vista previa: no almacena ni envía nada.** Es el estado actual, a la espera de que EAC decida entre
HubSpot y GoHighLevel.

Para activarlo: definir `CRM_WEBHOOK_URL` en las variables de entorno del proyecto de Vercel con la URL
del webhook de entrada del CRM. Ninguna credencial vive en el repositorio.

## Puntuación

`EAC.score()` en `assets/eac.js` implementa el modelo de 100 puntos documentado en
`../content/fase5-scoring-secuencias.md`. En la vista previa la puntuación se muestra al final de cada
pieza para que se vea el mecanismo; en producción es invisible para el usuario.

## Incrustar en el blog

Cada pieza se embebe en su artículo con un iframe responsive, o se enlaza como CTA. No requiere
plugins nuevos en WordPress, algo deliberado: el sitio viene de un ataque y no conviene ampliar
superficie.
