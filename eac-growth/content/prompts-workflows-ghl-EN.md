# EAC · The 8 GoHighLevel workflows — English prompts

English version of `prompts-workflows-ghl.md`. The GHL AI assistant follows
instructions more reliably in English, but **the template names, tag names and
workflow names must stay exactly as written below, in Spanish**. Do not translate
them: the assistant matches them literally against what already exists in the
account. All 18 email templates are already built in GHL — these workflows only
wire them up.

Build them in **Automation → Workflows → Create → AI Assistant**, one at a time,
in order 1 → 8. Publish in that same order: the entry workflows (2-5) feed the
TCP queue (1), so the queue has to exist first.

Design rule: **small, linear workflows**. The TCP email queue exists only once
(WF4b) and all four entry points feed it by adding the tag `seq-tcp`.

---

## 1 · WF4b · Secuencia TCP D1-D14

```
Create a workflow named "WF4b · Secuencia TCP D1-D14".

Trigger: Contact Tag is added, tag "seq-tcp". Do not allow the same contact to
re-enter this workflow.

First step, an If/Else condition:
  If the contact has the tag "caliente" → End workflow.
  Otherwise → continue.

Then, as a single straight line of steps with no further conditions:
  Wait 1 day  → send email template "EAC · S1 TCP · D1 · Mitos"
  Wait 2 days → send email template "EAC · S1 TCP · D3 · Sueldo"
  Wait 2 days → send email template "EAC · S1 TCP · D5 · Curso oficial"
  Wait 3 days → send email template "EAC · S1 TCP · D8 · Selección"
  Wait 3 days → send email template "EAC · S1 TCP · D11 · Precio"
  Wait 3 days → send email template "EAC · S1 TCP · D14 · Cierre"
  End workflow.

The waits must be simple day delays. Do not add time-window steps, do not add
any extra conditions, and do not nest the emails inside the If/Else branches.
```

## 2 · WF4 · Entrada · Test TCP

```
Create a workflow named "WF4 · Entrada · Test TCP".
Trigger: Contact Tag is added, tag "lm-test-tcp". No re-entry.
Steps, in a straight line with no conditions:
  Send email template "EAC · S1 TCP · D0 · Tu resultado"
  Add the tag "seq-tcp"
  End workflow.
```

## 3 · WF4 · Entrada · Calculadora

```
Create a workflow named "WF4 · Entrada · Calculadora".
Trigger: Contact Tag is added, tag "lm-calc-sueldo". No re-entry.
Steps, in a straight line with no conditions:
  Send email template "EAC · S1 TCP · D0b · Calculadora (entrega)"
  Add the tag "seq-tcp"
  End workflow.
```

## 4 · WF4 · Entrada · Guía

```
Create a workflow named "WF4 · Entrada · Guía".
Trigger: Contact Tag is added, tag "lm-guia-seleccion". No re-entry.
Steps, in a straight line with no conditions:
  Send email template "EAC · S1 TCP · D0c · Guía de selección (entrega)"
  Add the tag "seq-tcp"
  End workflow.
```

## 5 · WF4 · Entrada · Anuncios TCP

```
Create a workflow named "WF4 · Entrada · Anuncios TCP".

Trigger: Contact Tag is added, tag "lead-tcp". No re-entry.

First step, an If/Else condition where ALL of the following must be true (AND):
  Tags contains "lead paid"
  Tags does not contain "lm-test-tcp"
  Tags does not contain "lm-calc-sueldo"
  Tags does not contain "lm-guia-seleccion"

If the condition is NOT met → End workflow.
If the condition IS met:
  Send email template "EAC · S1 TCP · D0p · Bienvenida (anuncios)"
  Add the tag "seq-tcp"
  End workflow.

This workflow exists to stop a paid lead who already downloaded a lead magnet
from receiving two different welcome emails.
```

## 6 · WF4 · Despachador

```
Create a workflow named "WF4 · Despachador".
Trigger: Contact Tag is added, tag "lm-temario-fd". No re-entry.
Steps, in a straight line with no conditions:
  Send email template "EAC · S2 FD · D0 · Temario"
  Wait 2 days → send "EAC · S2 FD · D2 · No es controlador"
  Wait 3 days → send "EAC · S2 FD · D5 · Perfil"
  Wait 4 days → send "EAC · S2 FD · D9 · Cierre"
  End workflow.
Simple day delays only. No time-window steps.
```

## 7 · WF4 · Cabina o tierra

```
Create a workflow named "WF4 · Cabina o tierra".
Trigger: Contact Tag is added, tag "lm-test-perfil". No re-entry.
Steps, in a straight line with no conditions:
  Send email template "EAC · S3 Perfil · D0 · Comparativa"
  Wait 2 days → send "EAC · S3 Perfil · D2 · Tierra"
  Wait 3 days → send "EAC · S3 Perfil · D5 · Formación"
  Wait 4 days → send "EAC · S3 Perfil · D9 · Cierre"
  End workflow.
Simple day delays only. No time-window steps.
```

## 8 · WF4 · Lead caliente blog

```
Create a workflow named "WF4 · Lead caliente blog".

Trigger: Contact Tag is added, tag "caliente". Allow re-entry.

First step, an If/Else condition:
  If the contact has the tag "lead-magnet" → continue.
  Otherwise → End workflow.

If it continues:
  Create a task assigned to the contact owner, titled
    "Llamar en menos de 1 hora — lead caliente del blog"
  Send an internal notification to the sales team
  Remove the contact from these workflows:
    "WF4b · Secuencia TCP D1-D14"
    "WF4 · Despachador"
    "WF4 · Cabina o tierra"
  End workflow.
```

Hot leads coming from ads are already handled by `WF1 · Speed-to-Lead Hot TCP`;
this one only covers hot leads coming from the blog lead magnets.

---

## What the assistant cannot do — finish these by hand

Open ⚙️ Settings on the three workflows that contain waits — **1, 6 and 7** — and set:

- **Time window**: Monday to Friday · 09:00–19:00 · Europe/Madrid
- **Stop on response**: on
- **Goals** → *End workflow* when:
  - the opportunity stage changes to `Entrevistado` or `Negociación`
  - the opportunity is marked as won
  - the tag `no-cumple-requisitos` or `descartado` is added

On workflow **8**: open the task step and set the due date to **1 hour**.

## Test before publishing number 5

Create a contact with your own email and the tags `lead-tcp` + `lead paid`.
It should receive the D0p email and land in WF4b carrying `seq-tcp`.
Then add `caliente` + `lead-magnet`: it should drop out of WF4b and a task
should appear. Delete the test contact, then publish.

**Watch out for the two things that broke the first draft:** actions placed
before the condition instead of inside a branch, and the emails chained under
the "None" branch of an If/Else so nobody ever received them.

---

## Bonus · Master prompt for writing the email copy (English)

Only needed if you want to rewrite or extend the copy. The 18 templates already
exist in the account. Put this first, then describe the specific email.

```
You are an email marketing copywriter for Escola Aeronàutica de Catalunya (EAC),
an aviation training school in Barcelona. EAC trains:
- Cabin crew / flight attendants (official certificate recognised by AESA)
- Ground hostess and airport operations staff
- Flight dispatchers

WRITE IN SPANISH (Spain), using informal "tú".

WHO READS THESE EMAILS
People aged 18 to 45 who left their details on the website after taking a quiz
or downloading a guide. They are exploring, not decided. Most worry about whether
they meet the requirements, what it costs, and whether the job has a real future.

TONE
- Warm and direct. No corporate padding, no "estimado alumno".
- Focused on employability: people want to work, not to study.
- Honest before salesy. If something has a downside, say it.
- Aspirational but grounded. Never "fulfil your dream of flying".
- Short sentences. Zero filler.

RULES
1. Open with something useful, not a long greeting. The first line already gives value.
2. One idea per email. One call to action.
3. Use {{contact.first_name}} once, near the start. Never repeat it.
4. Between 120 and 220 words. If it does not fit, it is not needed.
5. Subject line under 50 characters. No shouting caps, no "!!".
6. Preview text different from the subject: it should extend it, not repeat it.
7. End with a one-line CTA, imperative and concrete.

NEVER
- Invent salary figures, timelines, employment rates or market data.
  If a number is needed, write [DATO A CONFIRMAR] and move on.
- Promise or imply guaranteed employment. The airline does the hiring.
- Call the certificate a "título" or "homologación". It is the official
  cabin crew certificate recognised by AESA.
- Use false urgency: "last places", countdowns, "today only".
- Use emojis beyond an occasional ✈️ in the subject line.

OUTPUT FORMAT
Asunto:
Vista previa:
Cuerpo:
```

---

## 9 · WF11 · Recordatorios de cita (24 h y 2 h)

La medida pendiente con más impacto: el plantón lleva dos meses entre el 55 % y
el 58 %, y en el formulario instantáneo de Meta llega al 75 %. Los recordatorios
son la palanca estándar contra eso y no cuestan nada.

```
Create a workflow named "WF11 · Recordatorios de cita".

Trigger: Appointment Status is "Confirmed", on all calendars. Allow re-entry.

Then, as a straight line:
  Wait until 24 hours before the appointment start time
  Send SMS/WhatsApp to the contact with this text:
    "Hola {{contact.first_name}}, te recordamos tu entrevista con la Escola
     Aeronàutica mañana a las {{appointment.start_time}}. Si no te va bien,
     respóndenos a este mensaje y la cambiamos sin problema."
  Wait until 2 hours before the appointment start time
  Send SMS/WhatsApp to the contact with this text:
    "{{contact.first_name}}, tu entrevista es hoy a las {{appointment.start_time}}.
     Te esperamos. Si surge algo, respóndenos aquí."
  End workflow.

Add a Goal that ends the workflow if the appointment status changes to
Cancelled, No Show or Showed, so nobody gets a reminder for an appointment
that no longer applies.
```

**Por qué pedir que respondan y no solo avisar:** quien contesta «no puedo»
libera el hueco y se puede reagendar. Hoy ese plantón se pierde entero y además
ocupa una franja que nadie aprovecha.

**Para la cita presencial, además**, conviene mandar en el de 24 h la dirección
exacta y cómo llegar: la presencial planta al 74 % contra el 44 % de la online.
