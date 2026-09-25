# Campaña · ICP Adelantta · vuestras líneas de servicio

Campaña Smartlead **3812488**. Creada el 17-ago-2026, **activada el
17-ago-2026** tras revisión de las 14 cartas por Maikel.

## Configuración

- **ICP**: `icp-adelantta.md` — servicios profesionales B2B, 11-200 empleados,
  España, varias líneas de servicio, 1-4 personas en marketing.
- **Leads**: 14, sobre 9 empresas de las 10 verificadas. **Ceifor Estudios se
  excluyó de esta tanda**: su único contacto en Apollo es un buzón genérico
  (`ceiforestudios@ceiforestudios.com`, sin persona real identificada), y es
  exactamente el patrón que en `inteligencia-respuestas.md` nunca generó
  conversación (6 de 15 buzones genéricos, cero respuestas reales).
- **Doble contacto** donde existía persona de marketing real (5 de 9 cuentas):
  Grup Montaner, Grupo2000, equilibrha, Beta Formación, TTI Success Insights.
  Las otras 4 (Avansel, People2People, Uare, GLM) solo tienen al
  fundador/CEO — por debajo de cierto tamaño no hay marketing propio.
- **Envío**: 3 buzones @goqualivo.com, 100% de reputación y sin campañas
  activas (`maikel.echevarria@`, `maikel@`, `echevarria@`).
- **Ritmo**: laborables 9:00-18:00 Europe/Madrid, 20 min entre correos, tope
  20 nuevos/día (irrelevante con solo 14 leads, todos salen el mismo día).
- **Sin A/B**: con 9-14 contactos no hay muestra para split. Todos reciben la
  misma hipótesis de mensaje.

## Personalización

El email 1 (día 0) es distinto por cada lead — **no es una plantilla con
variables, son 14 cartas**, guardadas como `custom_fields.subject1` /
`custom_fields.body1` por lead, ejecutadas en el paso 1 con
`{{subject1}}` / `{{body1}}`.

Dos versiones de fondo:
- **CEO/fundador**: ofrece detectar la fuga de atribución entre líneas.
- **Persona de marketing**: mismo gancho, en clave de aliada que puede llevar
  el análisis a la reunión de dirección, no de obstáculo.

Las dos líneas de servicio mencionadas por empresa son reales (investigadas
en su web), elegidas para que contrasten en ciclo de venta (ej. selección de
personal = transaccional vs. consultoría = proyecto largo), porque es
justamente esa asimetría la que sostiene el argumento del email.

| Empresa | Líneas mencionadas | Nota |
|---|---|---|
| Grupo2000 | formación bonificada / agencia de colocación | |
| Grup Montaner | selección de personal / trabajo temporal | Marketing = CMO real (Jose Luis González) |
| Avansel | selección de personal / consultoría de RRHH | |
| People2People | headhunting / selección especializada en SAP | Gancho algo más débil: son segmentos de un mismo servicio, no líneas distintas |
| equilibrha | servicios gestionados de nómina / soluciones cloud de RRHH | Empresa de software/BPO de RRHH, no de servicios clásicos — el gancho de "líneas que compiten por presupuesto" encaja peor aquí que en el resto |
| Beta Formación | formación bonificada / preparación de oposiciones | |
| TTI Success Insights | evaluaciones de talento DISC / procesos de selección | El email del CEO usa `d.producto@ttisuccessinsights.es`, verificado como su dirección real pero con formato de alias de rol, no de nombre — vigilar si responde |
| Uare | selección de personal / trabajo temporal | |
| GLM | selección de personal / empleo temporal | |

Emails 2 (+3d) y 3 (+6d) son genéricos, mismo hilo, sin asunto propio
(continúan la conversación): recuerdan el dato de fuga y cierran pidiendo el
mismo "sí" para el análisis.

## Ola 3 (18-ago)

36 cuentas nuevas cargadas del pool de 559, mismas reglas: un decisor con
nombre por empresa, email verificado, líneas de servicio verificadas en la
web de cada una (dos agentes visitaron las 41 candidatas), dedupe contra
supresión. El embudo de calidad: 250 candidatos revisados → 60 enriquecidos
(60 créditos) → 50 tras supresión → 41 tras filtro de encaje → 36 tras
verificación web. Cayeron por el camino: 10 ya contactadas por Qualivo,
agencias de marketing y software (competidores o fuera de ICP), 3 con email
de dominio distinto al de su empresa, 1 dominio reutilizado por spam de
casinos (Oxygen), 1 web en mantenimiento sin confirmar (La Firma), 1
rebranding total (Asic), y 2 sin líneas de servicio diferenciadas reales.

Destacan por encaje: Bové Montero (asesoría multi-área, 160 emp), Glezco,
Grupo HOB, Grup Carles, Empatif (ETT+PRL+formación, 140 emp), TempJob,
Access Talento, New Tandem (ETT+consultoría), Lider System, Moebius
(consultoría comercial) y Humannova. Con las 3 olas, la campaña queda con
**57 cuentas** en total.

## Cuando respondan

El mini-diagnóstico (`mini-diagnostico-lineas-servicio.md`) se personaliza en
10-15 min por cuenta usando las líneas de servicio reales de la tabla de
arriba y se envía el mismo día de la respuesta.

## Estado
- [x] Investigación de líneas de servicio reales (10 webs)
- [x] Contactos de marketing enriquecidos en Apollo (5 de 10 cuentas, 6 créditos)
- [x] Campaña creada, remitentes, calendario y secuencia configurados
- [x] 14 leads cargados (0 duplicados, 0 rebotes, 0 bloqueos)
- [x] Confirmación de Maikel para pasar a ACTIVE — campaña **ACTIVA**, primeros envíos hoy 17-ago
