# Agent to Me · Piloto outbound gestorías (voz Maikel)

Primer outbound de Agent to Me, separado por completo del pipeline de Qualivo
(Lanzadera sigue su curso en HeyReach con otro pitch y otra cuenta).

## ICP del piloto
- **Vertical**: gestorías y asesorías (fiscal, laboral, contable). Pool Apollo: 924 decisores.
- **Tamaño**: 5-50 empleados. **Zona**: España.
- **Decisor**: gerente / socio director / CEO.
- **Dolor**: altas y bajas, nóminas, requerimientos, y responder por enésima vez
  el mismo correo de cliente. Trabajo repetitivo que come margen.
- **Lista**: `gestorias_piloto.json` (38 leads, deduplicados por empresa;
  los marcados `flag: juridica` son despachos más legales — decidir si entran).

## Oferta / CTA único
**Company Scan** (agentforme.io): analizamos la empresa y decimos qué equipo
digital necesita. Gratis, concreto, bajo compromiso. Sin demo, sin "agenda 30 min".

## CTA secundario (salida) · Radar IA semanal
Para quien no quiera el Scan todavía: **Radar IA**, el análisis semanal de Maikel
de noticias de growth e IA, con su lectura y cómo aplicarla. Convierte el "no"
en suscriptor en vez de en silencio. Se usa SOLO como oferta de salida en el
último toque de cada canal, nunca compitiendo con el Scan en los primeros.
Pendiente: dónde se publica (newsletter LinkedIn / email) para poner el enlace.

## Infraestructura de envío (pendiente de decisión)
- **Email**: NO enviar desde agentforme.io (dominio recién estrenado, protegerlo).
  Comprar dominio hermano (p. ej. `agentforme.co` o `getagentforme.io`) + 1-2 buzones
  y warmup en Mailerfind **desde ya**: 2-3 semanas de reloj antes del primer envío.
- **LinkedIn**: canal disponible de inmediato, pero desde una cuenta distinta a la
  del piloto Lanzadera (esa está en vuelo con el pitch de Qualivo). Revisar cuentas
  disponibles en HeyReach cuando el servidor vuelva.
- Límites: 20-25 invitaciones/día LinkedIn; email según warmup.

## Test A/B del remitente (20 leads por rama)
- **Rama A · Maikel (humano)**: frío clásico bien hecho.
- **Rama B · Sofía (equipo digital)**: el mensaje ES la demo del producto.
  Transparencia total: se presenta como parte del equipo digital desde la
  primera línea.

---

## Secuencia email (cuando el buzón esté caliente)

### Email 1 — Rama A (Maikel)
**Asunto**: las horas que se come el papeleo en {{companyName}}

Hola {{firstName}},

Pregunta directa: ¿cuántas horas a la semana se van en {{companyName}} a altas,
nóminas, requerimientos y responder correos que ya habéis respondido cien veces?

En Agent to Me construimos equipos digitales: asumen ese trabajo repetitivo,
trabajan 24/7 y tu equipo humano vuelve a facturar con su tiempo.

Si quieres saber qué equipo digital encajaría en tu gestoría, os hacemos un
**Company Scan gratuito**: analizamos vuestros procesos y te decimos exactamente
qué tarea automatizar primero y cuántas horas recupera. Sin llamada previa, te
llega el resultado y tú decides.

¿Te lo preparo?

Maikel — Agent to Me

### Email 1 — Rama B (Sofía)
**Asunto**: este correo lo ha escrito un equipo digital (en serio)

Hola {{firstName}},

Me llamo Sofía y formo parte del equipo digital de Agent to Me. Este correo lo
he preparado yo: investigué {{companyName}}, redacté este mensaje y gestionaré
tu respuesta. Mi supervisor humano revisa mi trabajo.

Lo cuento así porque es exactamente lo que hacemos: equipos digitales que
asumen el trabajo repetitivo de gestorías como la tuya (altas, nóminas,
requerimientos, correos de clientes) y trabajan 24/7.

Si quieres saber qué equipo digital encajaría en {{companyName}}, te preparo
un **Company Scan gratuito**: análisis de vuestros procesos y qué automatizar
primero. Tú decides si merece una conversación (con humanos, prometido).

¿Te lo envío?

Sofía — Agent to Me · supervisada por Maikel Echevarría

### Email 2 (+3 días, si no responde — mismo hilo, ambas ramas)
{{firstName}}, ¿pudiste verlo?

Te dejo un dato de referencia: en las empresas que analizamos, la supervisión de
tareas repetitivas pasa de ~32h a ~8h semanales. En una gestoría eso es un
empleado entero devuelto al trabajo facturable.

El Company Scan es gratis y no requiere llamada. ¿Te lo preparo?

### Email 3 (+4 días, si no responde — mismo hilo, cierre)
Última vez que insisto, {{firstName}}.

Si el papeleo repetitivo no es un problema en {{companyName}}, ignora este
correo y encantado igualmente. Si lo es, el Company Scan te dice en qué tarea
está el mayor ahorro. Un correo con "sí" y os lo mando.

PD: si prefieres algo sin compromiso, cada semana publico el Radar IA: las
noticias de IA y growth que importan, mi lectura y cómo aplicarlas en tu
negocio. [enlace pendiente]

Un abrazo,
{{sender}}

---

## Secuencia LinkedIn (arranque inmediato, cuenta por confirmar)

### Nota de invitación (máx. 300 caracteres)
Hola {{firstName}}, veo que lideras {{companyName}}. En Agent to Me construimos
equipos digitales que quitan el trabajo repetitivo a gestorías (nóminas,
requerimientos, correos). Me gustaría conectar y, si te encaja, contarte cómo.
Un saludo, Maikel

### Mensaje 1 (al aceptar, +1 día)
Gracias por conectar, {{firstName}} 🙏

Te resumo: los equipos digitales de Agent to Me asumen el trabajo repetitivo
de una gestoría (altas, nóminas, requerimientos, responder los correos de
siempre) y trabajan 24/7.

Si quieres saber qué equipo digital encajaría en {{companyName}}, os hago un
Company Scan gratuito: analizo vuestros procesos y te digo qué automatizar
primero y cuántas horas recupera. ¿Te lo preparo?

### Mensaje 2 (+3 días, si no responde)
{{firstName}}, ¿lo viste?

Dato rápido: la supervisión de tareas repetitivas suele pasar de ~32h a ~8h
semanales con un equipo digital. El Scan es gratis y sin llamada. Tú decides.

Y si prefieres verlo con calma: cada semana publico el Radar IA con las
noticias de IA y growth que importan y cómo aplicarlas. Sígueme y lo ves pasar.

---

## Métricas de decisión (2 semanas de piloto)
- Email: apertura >50%, respuesta >5% → escalar; respuesta <2% → revisar copy/ICP.
- LinkedIn: aceptación >30%, respuesta >10% de aceptadas → escalar.
- A/B Sofía vs Maikel: gana quien más Scans solicite, no quien más respuestas
  totales genere (curiosidad ≠ intención).

## Estado / pendientes
- [x] Vertical elegida y lista curada (38 leads)
- [x] Secuencias redactadas (email A/B + LinkedIn)
- [ ] Decisión Maikel: comprar dominio hermano + buzones (email) — o solo LinkedIn
- [ ] Confirmar cuenta LinkedIn libre en HeyReach (servidor caído al revisarlo)
- [ ] Enriquecer los 38 leads en Apollo (~38 créditos, confirmar antes)
- [ ] Montar campañas en borrador (Mailerfind / HeyReach) — nada se envía sin OK
