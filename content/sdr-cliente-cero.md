# SDR Digital cliente-cero — diseño del puesto (BORRADOR para aprobación)

> Experimento E6 del Growth OS. **Nada de esto se envía sin el OK explícito de Maikel** a: (1) el ICP, (2) los mensajes, (3) el remitente/dominio. El SDR arranca en modo supervisado: Maikel aprueba cada lote antes del envío durante las 2 primeras semanas.

## El puesto

- **Rol:** SDR Digital de Agent to Me, vendiendo Agent to Me (dogfooding). El gancho es el propio empleado: *"este análisis lo preparó nuestro SDR digital"*.
- **KPI principal:** reuniones cualificadas agendadas. Secundarias: tasa de respuesta, % respuestas positivas, coste por reunión.
- **Umbral E6:** respuesta ≥5 % y ≥2 reuniones en el primer mes. Si no → modificar mensaje/ICP, no escalar volumen.
- **Reporta a:** Maikel, informe semanal (integrado en el Growth Review).

## ICP inicial (v1 — un solo segmento para aprender rápido)

**Academias y centros de formación privados en España, 10-80 empleados.**
Por qué este primero: (a) es el vertical donde el ecosistema ya tiene autoridad y números (qualivo.io/formacion); (b) el dolor es visible desde fuera (leads sin contactar, seguimiento manual de matrículas); (c) sinergia total — si no compran empleado digital, son lead de Qualivo, y viceversa.

**Señales de priorización** (research por cuenta): invierten en ads (Meta/Google activos) · equipo de admisiones/comercial visible en LinkedIn · ofertas de empleo de "asesor comercial/admisiones" (= van a contratar para trabajo repetitivo) · usan CRM conocible (señal técnica).

**Decisor:** CEO/director general o director comercial/admisiones.

**Segmento B en reserva** (si A no responde): despachos y asesorías 10-50 empleados (dolor: impagos + reporting → Collection/CFO Digital como gancho).

## Cadencia (borrador de mensajes — EDITAR ANTES DE APROBAR)

**Email 1 — el gancho dogfooding (día 0)**
Asunto: `el trabajo repetitivo de {{empresa}}`
> Hola {{nombre}} —
>
> {{frase de research personalizada: 1 línea concreta sobre su empresa — p. ej. "he visto que estáis captando para el curso X con campañas en Meta y que buscáis un asesor de admisiones"}}.
>
> Te escribo porque ese patrón (captación activa + contratar para perseguir leads) suele significar decenas de horas al mes de trabajo que no necesita criterio: primer contacto, seguimientos, actualizar el CRM.
>
> Nosotros incorporamos **empleados digitales** que ocupan ese puesto — con KPIs y ROI, desde 199 €/mes. Y una confesión: este email lo ha preparado el nuestro. Yo solo lo he revisado.
>
> ¿Te enseño en 20 min qué haría uno en {{empresa}}?
>
> Maikel Echevarria — Agent to Me

**Email 2 — valor sin pedir nada (día 3-4, si no responde)**
Asunto: re: anterior
> Te dejo algo útil aunque no hablemos: nuestro Company Scan (2 min) te dice qué puesto digital tendría más impacto en {{empresa}} y cuántas horas/€ al mes hay en juego → agenttome.io/company-scan
>
> Si el resultado te sorprende, me lo cuentas.

**Email 3 — cierre honesto (día 8-9, si no responde)**
> Última vez que te escribo, {{nombre}}. Solo una pregunta de calibración: ¿el trabajo repetitivo (seguimientos, CRM, informes) es un tema para {{empresa}} este año, o no está en la lista?
>
> Un "no" también me sirve — y te dejo de aparecer en la bandeja.

**Toque LinkedIn** (día 1-2, paralelo): invitación sin nota o con una línea de contexto — nunca pitch en la invitación.

## Límites (innegociables)

- Máx. **20 cuentas nuevas/día** al empezar (calidad > volumen; protege dominio y marca).
- Email desde subdominio dedicado (p. ej. `hola@get.agenttome.io`) con SPF/DKIM/DMARC y warm-up — **nunca** desde el dominio raíz.
- Research real por cuenta o no se contacta. Prohibido el merge-tag-spam.
- Respuestas: las frecuentes las gestiona el SDR con plantillas aprobadas; cualquier matiz → Maikel.
- Baja inmediata y lista de exclusión ante cualquier "no".

## Stack

Apollo (listas + señales) → Mailerfind/instantly-equivalente para cadencias email (campañas SIEMPRE creadas en borrador; lanzar requiere OK) → HeyReach para el toque LinkedIn → GHL como registro (tag `atm-outbound`, nota por cuenta) → informe semanal en el Growth Review.

## Qué necesito de Maikel para arrancar

1. OK o edición del ICP v1 (¿formación primero?).
2. Edición y aprobación de los 3 emails (tono tuyo — esto es un borrador).
3. Decisión del remitente: comprar/configurar subdominio de envío + buzón (te preparo las instrucciones exactas o lo hago yo con acceso al DNS).
4. Tu calendario de reuniones enlazable (¿el mismo widget de GHL de Qualivo u otro para AtM?).

## El bucle build-in-public

Cada viernes, los números del SDR (cuentas trabajadas, respuestas, reuniones, aprendizajes) se convierten en material de contenido — con números PROPIOS, cumpliendo la regla editorial. Primer post cuando haya 2 semanas de datos reales: "Pusimos a nuestro SDR digital a vender SDRs digitales. Semana 1: esto es lo que pasó."
