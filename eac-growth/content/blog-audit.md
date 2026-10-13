# EAC · Auditoría del blog existente (WordPress /blog/) — replantea la Fase 3

Descubrimiento: EAC **ya tiene ~50 posts** en `escolaeronauticadecatalunya.cat/blog/`, muchos rankeando en
**página 2 con enorme volumen de impresiones**. Publicar en este blog (mismo dominio) es mucho mejor que un
subdominio Vercel: hereda autoridad y aprovecha lo que ya funciona.

## Cambio de estrategia
1. **REFRESCAR primero** los posts que ya rankean en pos 6-11 con muchas impresiones → subirlos a top 3 es el ROI más rápido.
2. **Evitar canibalización:** NO crear posts nuevos que compitan con uno existente (p. ej. mi borrador "cuánto gana auxiliar de vuelo" debe ser una **mejora del post existente** `cuanto-cobran-las-azafatas-de-vuelo`, no una URL nueva).
3. **Crear nuevo** solo para huecos reales (despachador, agente de tierra, entrevista/selección).

## TOP a REFRESCAR (impresiones × oportunidad de posición) — datos GSC 90d
| Post existente | Pos | Impr/90d | Acción |
|---|---|---|---|
| cuanto-cobran-las-azafatas-de-vuelo | 6 | 99.000 | ⭐ Mejorar (sueldo TCP — comercial). Fusionar aquí el borrador nuevo. |
| requisitos-azafata-vuelo | 8 | 75.000 | ⭐ Ampliar + FAQ + CTA lead magnet |
| que-hay-que-estudiar-para-ser-azafata-de-vuelo | 11 | 63.000 | Reescribir/actualizar |
| sobrecargo-vuelo | 6 | 50.000 | Mejorar |
| diferencia-azafata-auxiliar-vuelo | 7 | 48.000 | Mejorar + enlazar |
| que-velocidad-va-avion | 8 | 139.000 | Refrescar (mucho tráfico, poco comercial → enlazar a pilares) |
| uniforme-azafata-vuelo | 6 | 23.000 | Mejorar + CTA |
| que-es-certificado-tcp | 11 | 3.700 | Ampliar (AESA/oficial — comercial) |

## NUEVOS (huecos sin post o muy flojo)
- Despachador de vuelo: qué hace y cuánto gana (solo existe `despachador-de-vueling` y `nuevo-curso-despachador`, flojos)
- Agente de tierra / rampa: funciones y sueldo (solo existe `que-es-un-agente-de-handling`)
- Preguntas frecuentes de la entrevista de TCP (proceso de selección) — no existe
- Cómo entrar a trabajar en una aerolínea desde cero — no existe

## Restricción de publicación (importante)
SiteGround (sgcaptcha) **bloquea el acceso automático al WordPress** desde este entorno — no puedo publicar/editar por API de forma fiable. Flujo realista:
- **Qualivo produce el contenido optimizado** (refrescos + nuevos, listos para pegar) y **adgoritmo/EAC lo publican** en WordPress.
- Alternativa (si se quiere automatizar): WP Application Password + excluir la API de la protección de SiteGround. No recomendado ahora mismo, con el sitio recién saneado.
