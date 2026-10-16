# ABM — Stack Apollo + Smartlead (SOP + entregabilidad)

Apollo = base de datos y enriquecimiento. Smartlead = envío en frío con
deliverability. La secuencia de `abm-secuencia-emails.md` es para Gmail/1-a-1;
**para envío en frío en volumen usa la versión de este archivo** (sin links en
el email 1, con spintax y CTA de respuesta).

---

## Flujo de trabajo (SOP)

1. **Apollo — sourcing.** `organizations_search` + `mixed_people_api_search` con
   el ICP (academias/formación España, 5–100 empleados, decisores).
2. **Apollo — enriquecer.** Solo emails **verified**. Descartar "guessed".
3. **Verificar aparte.** Pasar el CSV por un verificador (MillionVerifier /
   NeverBounce) → objetivo **bounce < 3 %**. Un bounce alto quema el dominio.
4. **Importar a Smartlead.** CSV con las columnas de abajo.
5. **Campaña en Smartlead.** Cargar los 5 emails, cadencia 0/2/5/9/14, con
   rotación de inboxes y spintax activado.
6. **Respuestas.** Positivas → tarjeta en Notion "Captación Qualivo" (o GHL) →
   agenda con Alba. Smartlead detiene la secuencia al detectar respuesta.

## Columnas del CSV (Apollo → Smartlead)
`email, first_name, last_name, company_name, website, city, title`
(Opcional: `nicho`, `presupuesto_estimado` para personalizar aún más.)

---

## Checklist de entregabilidad (lo que decide si llegas a inbox o a spam)

- [ ] **No enviar desde el dominio principal.** Compra 2–3 dominios secundarios
      (p.ej. getqualivo.com, tryqualivo.com) y redirígelos al principal.
- [ ] **2–3 buzones por dominio** (Google Workspace / Outlook).
- [ ] **SPF + DKIM + DMARC** configurados en cada dominio.
- [ ] **Warmup en Smartlead 2–3 semanas** antes de enviar nada en frío.
- [ ] **20–30 emails/buzón/día máximo.** Con 6 buzones = 120–180 envíos/día.
- [ ] **Rotación de inboxes** activada (Smartlead reparte el envío).
- [ ] **Tracking de apertura DESACTIVADO** en frío (el píxel mete un enlace que
      penaliza). Sin link-tracking en el email 1.
- [ ] **Dominio de tracking personalizado** en Smartlead (no el compartido).
- [ ] **Texto plano**, sin imágenes ni firma HTML pesada. Máx. 1 link, y nunca
      en el primer email.
- [ ] **Spintax** en subject y primera línea para variar cada envío.
- [ ] Volumen creciente gradual (ramp-up), no 0→200 de golpe.

---

## Secuencia optimizada para envío en frío (Smartlead)

Variables Smartlead: `{{first_name}}`, `{{company_name}}`. Spintax: `{a|b|c}`.

### Email 1 · Día 0 — SIN links, CTA de respuesta
**Subject:** {¿Cuántos leads se te enfrían?|leads que pagas y se enfrían|una pregunta sobre {{company_name}}}

{Hola {{first_name}},|{{first_name}},}

{Una pregunta directa:|Sin rodeos:} ¿cuántos de los leads que pagasteis el mes
pasado no volvieron a tener noticias vuestras en las primeras 24h?

En la mayoría de academias, la respuesta honesta es "más de la mitad". Y casi
nunca es problema de anuncios: es de velocidad de respuesta y seguimiento.

Nosotros conectamos anuncios + CRM para que ningún interesado se enfríe, y
optimizamos hacia matrículas, no hacia el formulario más barato.

¿Te interesa que te cuente cómo lo montamos? Responde "sí" y te paso los detalles.

Maikel — Qualivo

---

### Email 2 · Día 2 — Prueba social (1 link máx.)
**Subject:** {De 3.600 € a 30.000 €|un número que no suelo enseñar}

{{first_name}}, un dato rápido.

Un cliente pasó de 3.600 € a 30.000 € de retorno con la misma inversión, solo
cambiando dónde iba el presupuesto y cómo seguía a cada lead.

Y en una escuela de formación, en 3 meses: CPL de 16 € a 5,6 € (−66 %), de 244 a
425 leads/mes, ROAS 8,1×.

La diferencia no fue "mejores anuncios": fue optimizar hacia la matrícula real.

¿Le echamos un ojo a tus números? Responde y te mando un hueco.

Maikel · Qualivo

---

### Email 3 · Día 5 — Break-up soft (sin links)
**Subject:** {¿mal momento?|cierro esto}

{{first_name}}, te escribí un par de veces sin respuesta. Asumo una de dos: o no
es el momento, o no me expliqué bien.

Si es mal momento, dímelo y te escribo en un par de meses. Si no encaja, también
me sirve saberlo. ¿Cuál de las dos?

Maikel · Qualivo

---

### Email 4 · Día 9 — Loom personalizado (1 link)
**Subject:** {te grabé algo (90s)|90 segundos sobre {{company_name}}}

{{first_name}}, en vez de otro correo me grabé 90s mirando la web de
{{company_name}} y por dónde se te escapan matrículas. 3 cosas concretas, una
gratis que puedes aplicar tú solo: [LOOM_URL]

Si te sirve y quieres profundizar, responde y montamos 15 min.

Maikel · Qualivo

---

### Email 5 · Día 14 — Último contacto + recurso (1 link)
**Subject:** {cierro tu ficha|último, lo prometo}

{{first_name}}, este es mi último correo. Antes de cerrar tu ficha te dejo algo
que sirve aunque nunca trabajemos juntos: un diagnóstico de 10 min de tus
campañas, con tus números, señalando dónde pierdes presupuesto.

Sin coste: [CALENDLY_URL]

Gracias por leer hasta aquí. Muchas matrículas igualmente.

Maikel Echevarria · Qualivo

---

### Benchmark (de tu agente ABM)
Open > 40 % · Reply > 3 % · Meeting 0,5–1 %. Revisar reply rate por segmento a
los 7 días y cortar el segmento que no responda.
