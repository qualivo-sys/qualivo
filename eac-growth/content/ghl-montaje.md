# EAC · Montaje en GoHighLevel

Estado a 8 de septiembre de 2026. Location `5Eylu2xUj1SoQaQnfmF8`.

## Lo que ya existía en la cuenta (no se ha tocado)

EAC ya tenía montado buena parte del esqueleto, así que los imanes se han enganchado a **su**
taxonomía en lugar de crear una paralela.

| Campo personalizado | Tipo | Valores |
|---|---|---|
| `contact.lead_score` | Numérico | 0-100 |
| `contact.lead_temperature` | Opción | Caliente · Tibio · Frio · Congelado |
| `contact.cuando_empezar` | Opción | Lo antes posible · En 1-3 meses · En 3-6 meses · Solo busco info |
| `contact.programa_interes` | Opción | TCP / Auxiliar de vuelo · Piloto comercial · Flight Dispatcher · Marketing aereo · Aun no estoy seguro |
| `contact.nivel_ingles` | Opción | A1-A2 · B1 · B2 · C1 o superior · No estoy seguro |
| `contact.sabes_nadar_bien` | Opción | Sí · No, pero puedo aprender · No |
| `contact.edad_rango` | Opción | Menor de 18 · 18-21 · 22-30 · 31-40 · Mayor de 40 |
| `contact.cul_es_tu_nivel_de_estudios` | Opción | ESO o equivalente · Bachillerato · Estudios Superiores |
| `contact.fuente_plataforma` · `contact.fuente_campania` | Opción · Texto | atribución |

Workflows ya publicados: `WF1 · Speed-to-Lead Hot TCP`, `WF1 · … Orgánico`, `WF2 · Dispacher`,
`WF3 · Azafata de tierra`, `W2 · Cita confirmada`, `W3 · Visita confirmada` y cuatro de fuente de captación.

**El modelo de puntuación se ha alineado a estas cuatro temperaturas** (Caliente ≥70, Tibio 45-69,
Frio 25-44, Congelado <25) en lugar de introducir una quinta categoría.

## Lo creado en esta sesión

**Etiquetas** — `lead-magnet`, `lm-test-tcp`, `lm-calc-sueldo`, `lm-guia-seleccion`,
`lm-test-perfil`, `lm-temario-fd`.

**Campos personalizados** — `contact.iman_de_captacion` (opción, los 5 imanes) y
`contact.resultado_del_test` (texto largo).

**15 plantillas de email**, agrupadas por prefijo:

| Secuencia | Plantillas |
|---|---|
| S1 · Test requisitos TCP (14 días) | D0 Tu resultado · D1 Mitos · D3 Sueldo · D5 Curso oficial · D8 Selección · D11 Precio · D14 Cierre |
| S2 · Despachador de vuelo (9 días) | D0 Temario · D2 No es controlador · D5 Perfil · D9 Cierre |
| S3 · Perfil cabina o tierra (9 días) | D0 Comparativa · D2 Tierra · D5 Formación · D9 Cierre |

Cada email lleva `{{contact.first_name}}`, enlace con UTM a un artículo del blog y un CTA único.

## Lo que hay que montar a mano (la API de GHL no crea workflows)

### Workflow «WF4 · Imanes de leads»

**Disparador:** etiqueta añadida — cualquiera de las cinco `lm-*`.

1. **Condición: `contact.lead_temperature` = Caliente**
   - Sí → crear tarea urgente para la asesora («Llamar en menos de 1 h») + notificación interna.
     Enviar solo el email D0 de la secuencia que corresponda y **detener** aquí.
   - No → continuar.
2. **Bifurcación por etiqueta de imán:**
   - `lm-test-tcp` o `lm-calc-sueldo` o `lm-guia-seleccion` → secuencia **S1**
   - `lm-temario-fd` → secuencia **S2**
   - `lm-test-perfil` → secuencia **S3**
3. **Emails con espera** según los días del nombre de cada plantilla (D0, D1, D3…).
4. **Condiciones de salida** en cada paso: si el contacto pasa a `Entrevistado`, se matricula,
   o recibe la etiqueta `no-cumple-requisitos` o `descartado` → salir del workflow.

### Reglas de puntuación en vivo

Workflow aparte, disparador «Email · clic en enlace»:
- clic en un email de precio o de curso → sumar 6 a `contact.lead_score`
- si el nuevo valor ≥ 70 → poner `lead_temperature` = Caliente y crear tarea urgente

### Ajuste pendiente en la cuenta

`contact.programa_interes` **no tiene opción para azafata de tierra**, aunque existen la etiqueta
`lead-azafata-tierra` y el workflow `WF3`. Hoy esos leads caen en «TCP / Auxiliar de vuelo».
Conviene añadir la opción «Azafata de tierra / Operaciones» al desplegable — es un clic en
Configuración → Campos personalizados, y no rompe nada.

## Conexión de los imanes con el CRM

`leadmagnets/api/lead.js` ya construye el contacto con los identificadores reales de los campos y
traduce cada respuesta al valor exacto de cada desplegable. Funciona de dos formas, según qué
variable de entorno se defina en Vercel:

- `GHL_TOKEN` + `GHL_LOCATION_ID` → alta directa por API (`/contacts/upsert`)
- `CRM_WEBHOOK_URL` → envío al webhook de entrada de un workflow

**Ahora mismo no hay ninguna definida**, así que los formularios responden en modo vista previa y no
escriben nada. Ninguna credencial vive en el repositorio. El formulario lleva además un campo trampa
antibot.
