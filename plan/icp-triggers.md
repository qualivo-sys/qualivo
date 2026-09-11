# ICP + Trigger · Matriz ejecutable

Implementación del marco de Maikel (14-ago-2026): dejar de construir listas por
sector y construirlas por **ICP más disparador**. Cada fila de aquí abajo es una
consulta de Apollo lista para ejecutar, no una idea.

Contexto de mercado que sostiene el enfoque de Agent to Me: el INE sitúa el uso
de IA en empresas de 10 o más empleados en el 21,1% (T1 2025) y la OCDE señala
que las pymes españolas siguen rezagadas en tecnologías digitales avanzadas. La
oportunidad no está en quien ya usa IA, está en la empresa tradicional de 20
personas que sigue tirando de email, Excel y WhatsApp.

---

## QUALIVO

### Q1 · Servicios B2B con equipo comercial (prioridad máxima)

Empresa con suficiente complejidad comercial como para tener fugas.

- **Tamaño**: 10-50 empleados. **País**: España.
- **Sectores**: consultoría, formación B2B, IT, software, servicios
  profesionales, ingeniería, industrial B2B, RRHH y selección.
- **Decisor**: fundador, CEO, director general, director comercial.
- **Trigger obligatorio**: al menos uno de estos.
  1. Vacante de comercial, SDR o account executive en los últimos 10 días.
  2. Píxel de Meta o LinkedIn Ads en su web.
  3. CRM instalado (HubSpot, Salesforce, Pipedrive).
  4. Crecimiento de plantilla en los últimos 6 meses.
- **Hipótesis**: no les falta demanda, les falta conversión. La fuga está entre
  marketing, cualificación y seguimiento.
- **Apertura**: "He visto que estáis creciendo el equipo comercial y captando
  leads por varios canales. ¿Tenéis claro dónde se pierden las oportunidades que
  entran pero no cierran?"

**Consulta Apollo**
```
person_seniorities: founder, owner, c_suite, director
person_titles: CEO, director general, director comercial, fundador
organization_num_employees_ranges: 11,50
person_locations / organization_locations: Spain
q_organization_job_titles: comercial, sales, ventas, account executive
organization_job_posted_at_range: últimos 10 días
currently_using_any_of_technology_uids: hubspot, salesforce, pipedrive
contact_email_status: verified
```
Variante sin vacante: quitar `q_organization_job_titles` y exigir CRM más
`organization_headcount_growth_range` mínimo 10% en 6 meses.

### Q2 · Formación y educación privada (prioridad máxima)

Donde ya hay casos, lenguaje y respuestas reales.

- **Perfil**: academias, escuelas, formación online, FP, bootcamps, educación
  ejecutiva. 10-50 empleados.
- **Trigger**: campañas activas visibles, formularios de admisión, webinars,
  becas, catálogo amplio de cursos, equipo de admisiones en LinkedIn.
- **Hipótesis**: muchas fuentes de leads y ninguna atribución. No saben qué canal
  genera matrículas y cuál solo genera contactos.
- **Ventaja de lenguaje**: aquí no se habla de venta, se habla de **matrícula**.
  Lead a matrícula es mucho más tangible que lead a venta.
- **Apertura**: "He visto que estáis captando alumnos desde varios canales.
  ¿Tenéis identificado qué canal acaba generando matrículas y cuál simplemente
  genera leads?"

**Sub-segmento confirmado por datos**: academias de **idiomas y FP**. Cinco de
las respuestas reales del vertical vienen de ahí. Sobreponderar la keyword de
escuela de idiomas en la próxima carga.

### Q3 · B2C de alto volumen de leads (prioridad media)

- **Perfil**: inmobiliarias, clínicas, seguros, automoción, servicios del hogar,
  energía, reformas.
- **Trigger**: Meta Ads o Google Ads activos, formulario web, WhatsApp Business,
  call center, CRM, varios comerciales.
- **Hipótesis**: con mil leads al mes, perder un porcentaje pequeño ya es mucho
  dinero. El problema no es volumen, es qué pasa con lo que ya se paga.
- **Frase**: "No necesitas más leads. Necesitamos saber qué ocurre con los que ya
  estás pagando."

### Fuera de Qualivo, por ahora
Autónomos, empresas de 1 a 5 personas, negocios sin captación, empresas que viven
de recomendación, empresas sin proceso comercial. El problema que resuelve
Qualivo solo aparece con suficiente complejidad.

---

## AGENT TO ME

Principio: no buscar empresas interesadas en IA. Puede ser mejor que no sepan qué
hacer con ella. Y no empezar por tecnológicas: ya tienen developers,
automatizaciones y agentes probados.

### A1 · Contratando puesto administrativo u operativo (prioridad máxima)

El trigger más fuerte de los dos negocios. Ya han declarado públicamente que
necesitan trabajo humano para tareas concretas.

- **Tamaño**: 10-50 empleados. **País**: España.
- **Trigger**: vacante publicada de administrativo, back office, atención al
  cliente, customer support, asistente, gestor documental u operaciones.
- **Hipótesis**: una parte grande de ese puesto no necesita una persona.
- **Ángulo**: "He visto que buscáis un administrativo. Antes de contratarlo,
  hemos analizado el puesto" y devolver un porcentaje concreto: *el 52% de ese
  puesto podría hacerlo un empleado digital*.
- **Entregable**: Plan de Equipo Digital aplicado a la vacante, no a la empresa.
  Es más concreto y más difícil de ignorar.

**Consulta Apollo**
```
q_organization_job_titles: administrativo, back office, atención al cliente,
  customer support, asistente, operaciones
organization_job_posted_at_range: últimos 10 días
organization_num_employees_ranges: 11,50
person_seniorities: founder, owner, c_suite
person_locations / organization_locations: Spain
not_organization_naics_codes: 5415 (excluir software y servicios IT)
contact_email_status: verified
```

### A2 · PYMEs de servicios con mucha administración (prioridad máxima)

- **Sectores**: instaladoras, mantenimiento, inmobiliarias, constructoras,
  ingeniería, logística, distribución, despachos, industrial pequeño.
- **Trigger**: varios puestos de back office en LinkedIn, uso intensivo de Excel
  o Google Sheets en su stack, muchas herramientas sin integrar, y el más
  valioso de todos: **el fundador sigue metido en operaciones** (se detecta
  mirando su LinkedIn: publica sobre obra, entregas, incidencias, no sobre
  estrategia).
- **Hipótesis**: los procesos que funcionaban con 5 personas se rompen con 30.

### A3 · Equipos de atención y soporte (prioridad media)

- **Sectores**: ecommerce, distribución, clínicas, educación, SaaS, postventa.
- **Trigger**: vacante de customer support, o equipo de atención de 3 a 10
  personas visible en LinkedIn.
- **Tareas evidentes**: responder preguntas repetidas, clasificar solicitudes,
  abrir tickets, buscar información, actualizar CRM, derivar casos.

### A4 · Empresas en crecimiento (segmento transversal)

- **Trigger**: plantilla que pasa de 10 a 25, o de 20 a 50, en 12 meses. Filtro
  de Apollo: `organization_headcount_growth_range` con ventana de 12 meses.
- **Ángulo**: "Antes de contratar para cada nuevo proceso, descubre qué trabajo
  puede asumir un equipo digital."

---

## Regla de reparto entre marcas

Los dos negocios comparten el trigger de contratación, así que la separación se
hace por **el puesto que se publica**, no por el sector:

| Vacante publicada | Marca | Por qué |
|---|---|---|
| Comercial, SDR, AE, y la empresa tiene CRM y ads | Qualivo | Ya venden, el problema es conversión |
| Comercial, SDR, AE, sin CRM ni ads | Agent to Me | Van a pagar precio de comercial por trabajo administrativo |
| Administrativo, back office, soporte | Agent to Me | El puesto es repetitivo por definición |
| Marketing, growth | Qualivo | Están montando captación |

Y por encima de todo, la regla de la casa: **lista de supresión compartida**. Un
dominio contactado por una marca no entra en la otra hasta pasados 90 días. Al
cruzar las 39 empresas con vacante comercial de esta semana contra el histórico,
20 ya estaban contactadas por Qualivo. Sin ese cruce, la mitad de la primera
campaña de Agent to Me habría escrito a gente que ya tiene un correo de Maikel.

---

## Orden de ejecución propuesto

1. **Q1 con trigger de vacante comercial.** Ya hay lista de 19 cuentas nuevas y
   mensaje escrito (`plan/campana-senales-v2.md`). Solo falta tu ok.
2. **Q2 formación, sub-segmento idiomas.** Aprovecha los casos y las respuestas
   que ya tenemos. Campaña de Academias ya reactivada y limpia.
3. **A1 contratando administrativo.** Es el mejor trigger de Agent to Me, pero
   está bloqueado por infraestructura de envío hasta que haya dominio y warmup.
4. **A2 y A3** cuando A1 dé las primeras 50 tareas reales.
5. **Q3 B2C de volumen** se queda como está, alimentando el sistema con las
   campañas de inmobiliarias y solar ya activas.
