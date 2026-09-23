# Plantilla · Acuerdo de prestación de servicios

Nace del contrato firmado con Al Milímetro (23-sep-2026). Campos entre `{{ }}` se
rellenan por cliente; el resto (cláusulas 1 a 18) es fijo y no se toca salvo que
cambie el alcance real de lo que se vende. No contiene datos de ningún cliente:
la copia rellenada con datos reales nunca se sube a este repositorio (es público),
se guarda en la carpeta de Drive del cliente.

Uso: copiar el documento base (Drive, carpeta plantillas de Qualivo) y sustituir
los campos. Los campos con `{{DEFECTO: ...}}` traen un valor por defecto que se
puede dejar tal cual si no cambia nada en la reunión.

## Campos a rellenar

- `{{FECHA}}` — fecha del acuerdo
- `{{CLIENTE_NOMBRE}}`, `{{CLIENTE_NIF}}`, `{{CLIENTE_DOMICILIO}}`,
  `{{CLIENTE_TELEFONO}}`, `{{CLIENTE_EMAIL}}`
- `{{SECTOR}}` y lista de servicios del punto 1 (`{{DEFECTO: se ajusta al
  sector del cliente}}`)
- `{{PRECIO_PRIMER_MES}}` (DEFECTO: 1.000 €), `{{PAGO_1}}` (DEFECTO: 500 € al
  confirmar el proyecto), `{{PAGO_2}}` (DEFECTO: 500 € el día de la reunión de
  arranque), `{{CUOTA_MENSUAL}}` (DEFECTO: 750 €/mes desde el segundo mes)
- `{{CIUDAD_FIRMA}}` (DEFECTO: `{{CLIENTE_CIUDAD}}` / La Seu d'Urgell)

## ACUERDO DE PRESTACIÓN DE SERVICIOS

**{{CLIENTE_NOMBRE_CORTO}} × QUALIVO**

**Fecha:** {{FECHA}}

### REUNIDOS

De una parte, **{{CLIENTE_NOMBRE}}**, con NIF **{{CLIENTE_NIF}}**, con domicilio
en **{{CLIENTE_DOMICILIO}}**, teléfono {{CLIENTE_TELEFONO}} y correo electrónico
{{CLIENTE_EMAIL}}, en adelante, **"EL CLIENTE"**.

Y de otra parte, **Maikel Echevarria Franconetti**, con NIF **53395879E**, con
domicilio en **C/ Guillem Plandolit nº 11, 3º 4ª, 25700 La Seu d'Urgell,
Lleida**, en representación de **QUALIVO**, en adelante, **"QUALIVO"**.

Ambas partes se reconocen capacidad suficiente para formalizar el presente
acuerdo y,

### EXPONEN

Que EL CLIENTE desarrolla su actividad en el ámbito de {{SECTOR}}, y desea
mejorar sus sistemas de captación, cualificación y seguimiento comercial.

Que QUALIVO presta servicios de consultoría, estrategia, marketing,
automatización, CRM e implementación de sistemas de captación y seguimiento
comercial.

Por ello, ambas partes acuerdan lo siguiente:

---

### 1. OBJETO DEL SERVICIO

El objeto del presente acuerdo es la implantación y gestión de un sistema de
captación, cualificación y seguimiento comercial para **{{CLIENTE_NOMBRE_CORTO}}**,
orientado a generar oportunidades comerciales de mayor calidad y mejorar la
conversión de las oportunidades existentes.

El proyecto estará especialmente orientado a servicios relacionados con:

- {{SERVICIO_1}}
- {{SERVICIO_2}}
- {{SERVICIO_3}}
- Otros servicios que se definan durante la fase de arranque.

El objetivo no será únicamente aumentar el volumen de leads, sino mejorar la
calidad de las oportunidades y establecer un sistema medible para identificar
qué acciones generan negocio real.

---

### 2. ALCANCE DEL PROYECTO

Durante la fase inicial y posterior gestión del proyecto, QUALIVO trabajará
sobre los siguientes bloques:

**2.1. Captación.** Configuración, gestión y optimización de campañas
publicitarias en Meta Ads (Instagram y Facebook){{Y_GOOGLE_SI_APLICA}}. Las
campañas podrán estructurarse según diferentes tipos de proyecto, servicios,
públicos, zonas geográficas, necesidades y mensajes comerciales. Se realizarán
pruebas de diferentes mensajes, propuestas y ángulos de captación, optimizando
progresivamente en función de las oportunidades generadas, usando siempre que
sea posible información procedente del CRM y del proceso comercial.

**2.2. Sistema de cualificación.** Se diseñará e implementará un
formulario/calculadora destinado a recoger información relevante sobre el
proyecto del potencial cliente. El sistema podrá ofrecer al usuario una primera
orientación en pocos minutos, siempre entendida como una estimación inicial y
no como un presupuesto contractual. El objetivo será utilizar esta información
para filtrar y priorizar las oportunidades comerciales.

**2.3. CRM y pipeline comercial.** QUALIVO implementará y/o configurará el CRM
acordado para centralizar la información comercial, con etapas como: lead
recibido, lead cualificado, contactado, visita/reunión, presupuesto enviado,
seguimiento, obra ganada, obra perdida. Se establecerán criterios de
cualificación y priorización de oportunidades, pudiendo utilizarse categorías
A/B/C/D u otro sistema que ambas partes acuerden.

**2.4. Automatización del seguimiento.** Cuando técnicamente sea viable y las
herramientas utilizadas lo permitan, se implementarán automatizaciones de
seguimiento mediante WhatsApp, email, voz, recordatorios, seguimientos
automáticos y reactivación de oportunidades. El objetivo será reducir la
pérdida de oportunidades por falta de seguimiento y aumentar la capacidad
comercial del equipo.

**2.5. Recuperación de oportunidades antiguas.** Se trabajará sobre la base de
datos disponible del CLIENTE para identificar antiguos leads, presupuestos no
cerrados, oportunidades paradas, clientes anteriores y contactos susceptibles
de nuevas necesidades. Cuando sea viable, se diseñarán secuencias de
reactivación para recuperar oportunidades que no llegaron a convertirse.

**2.6. Medición y dashboard.** Se establecerá un sistema de medición que
permita analizar, en la medida en que los datos estén disponibles: inversión
publicitaria, leads generados, leads cualificados, coste por lead, coste por
oportunidad, visitas/reuniones, presupuestos enviados, obras cerradas,
facturación generada, fuente de cada oportunidad y rendimiento por campaña y
tipo de proyecto. El objetivo será disponer de información suficiente para
tomar decisiones de optimización basadas en datos reales.

**2.7. Sistema de recomendación.** Podrá plantearse e implementar un sistema de
recomendación/referral destinado a incentivar la generación de nuevas
oportunidades a partir de clientes satisfechos. Su desarrollo concreto se
definirá durante el proyecto en función de las posibilidades y necesidades de
EL CLIENTE.

---

### 3. FASE INICIAL

Durante la reunión de arranque se revisarán, entre otros aspectos: servicios
prioritarios, tipos de proyecto, proyectos considerados de mayor interés,
rangos de presupuesto, zonas geográficas, proceso comercial actual, fuentes
actuales de leads, CRM y herramientas existentes, base de datos disponible,
presupuestos antiguos, material audiovisual, fotografías de proyectos, casos de
éxito, testimonios, proceso de seguimiento y criterios actuales de cierre.

Esta información servirá para adaptar el sistema a la realidad comercial de
**{{CLIENTE_NOMBRE_CORTO}}**.

---

### 4. INVERSIÓN PUBLICITARIA

La inversión correspondiente a las campañas publicitarias en Meta Ads
(Instagram y Facebook){{Y_GOOGLE_SI_APLICA}} no está incluida en los honorarios
de QUALIVO. Dicha inversión será asumida directamente por EL CLIENTE y se
gestionará, siempre que sea posible, desde sus propias cuentas publicitarias.

La inversión publicitaria será independiente de los honorarios de gestión de
QUALIVO y su importe se determinará de forma conjunta en función de los
objetivos y necesidades del proyecto. Cualquier modificación relevante de la
inversión publicitaria será comunicada y acordada previamente con EL CLIENTE.

---

### 5. INVERSIÓN Y FORMA DE PAGO

La inversión correspondiente al primer mes de implantación será de
**{{PRECIO_PRIMER_MES}}**, más los impuestos que correspondan.

El pago se realizará de la siguiente forma:

- **{{PAGO_1}}**
- **{{PAGO_2}}**

A partir del segundo mes, la gestión tendrá un coste de **{{CUOTA_MENSUAL}}**,
más los impuestos que correspondan. La cuota mensual no implica compromiso
mínimo de permanencia.

Las cantidades correspondientes a periodos ya iniciados o trabajos ya
realizados serán exigibles aunque posteriormente se solicite la cancelación
del servicio.

---

### 6. DURACIÓN, CANCELACIÓN Y GARANTÍA

El proyecto comenzará en la fecha acordada por ambas partes. No existe
compromiso mínimo de permanencia para EL CLIENTE. A partir del segundo mes, el
servicio tendrá carácter mensual y cualquiera de las partes podrá solicitar su
finalización sin penalización por permanencia.

**Garantía de continuidad.** QUALIVO establece una garantía comercial vinculada
al periodo inicial de tres meses. Si, una vez transcurridos los tres primeros
meses de trabajo, no se hubiera recuperado la inversión realizada por EL
CLIENTE en los servicios de QUALIVO y en la inversión publicitaria gestionada
dentro del proyecto, QUALIVO continuará prestando el servicio durante tres
meses adicionales sin coste de gestión para EL CLIENTE.

La finalidad de esta garantía es permitir disponer de un periodo adicional
para optimizar y consolidar el sistema cuando los resultados obtenidos durante
los primeros tres meses no hayan permitido recuperar la inversión. A efectos
de esta garantía, la recuperación de la inversión se valorará tomando como
referencia los ingresos efectivamente generados y razonablemente atribuibles
al sistema implantado, utilizando la información disponible en el CRM,
campañas y proceso comercial.

La garantía no constituye una garantía de un número determinado de leads,
visitas, ventas, facturación o rentabilidad. Para que la garantía sea
aplicable, EL CLIENTE deberá: mantener activa la inversión publicitaria
acordada, facilitar los accesos, datos y materiales necesarios, mantener
operativo el proceso comercial acordado, atender de forma razonable las
oportunidades generadas, y facilitar información suficiente sobre
presupuestos, visitas y cierres para poder medir los resultados.

---

### 7. RESPONSABILIDADES DEL CLIENTE

EL CLIENTE se compromete a: facilitar los accesos necesarios a las plataformas
y herramientas; proporcionar información veraz y actualizada sobre sus
servicios; facilitar fotografías, vídeos, testimonios y otros materiales
disponibles; facilitar, cuando corresponda, la base de datos y presupuestos
históricos que puedan utilizarse para acciones de reactivación; validar los
materiales o campañas cuando sea necesario; atender las oportunidades
comerciales generadas; mantener actualizado el estado de los leads y
oportunidades en el CRM cuando corresponda; informar sobre presupuestos,
visitas y cierres para permitir una correcta medición; y garantizar que
dispone de las bases legales y autorizaciones necesarias para el tratamiento y
utilización de los datos que facilite a QUALIVO.

Los retrasos derivados de la falta de accesos, información, materiales,
aprobaciones o colaboración por parte del CLIENTE podrán afectar a los plazos
de implementación.

---

### 8. RESPONSABILIDADES DE QUALIVO

QUALIVO se compromete a: diseñar y configurar el sistema acordado; gestionar y
optimizar las campañas dentro del alcance contratado; implementar los sistemas
de cualificación y seguimiento acordados; configurar el CRM dentro del alcance
establecido; analizar los datos disponibles; proponer mejoras y
optimizaciones; mantener una comunicación periódica sobre la evolución del
proyecto; y trabajar orientado a la generación de oportunidades comerciales de
calidad.

QUALIVO no garantiza un número concreto de leads, clientes, ventas,
facturación o retorno de inversión. Los resultados dependerán, entre otros
factores, de la inversión publicitaria, mercado, oferta, precios, competencia,
demanda, capacidad comercial, tiempos de respuesta y comportamiento de los
potenciales clientes.

---

### 9. PROPIEDAD Y ACCESOS

Las cuentas publicitarias, bases de datos, CRM y activos digitales
pertenecientes previamente a EL CLIENTE seguirán siendo propiedad de EL
CLIENTE. QUALIVO podrá utilizar metodologías, estructuras, plantillas,
procesos, conocimientos, automatizaciones y sistemas propios desarrollados
previamente a este proyecto. Los materiales específicos creados para EL
CLIENTE dentro del proyecto podrán ser utilizados por EL CLIENTE durante y
después de la relación contractual, sin perjuicio de las herramientas,
metodologías y sistemas preexistentes propiedad de QUALIVO o de terceros.

---

### 10. CONFIDENCIALIDAD

Ambas partes se comprometen a mantener confidencial toda información
comercial, técnica, estratégica, financiera o de cualquier otra naturaleza que
reciban como consecuencia de la relación profesional. Esta obligación
continuará vigente incluso después de la finalización de la relación
contractual.

---

### 11. PROTECCIÓN DE DATOS

Ambas partes se comprometen a cumplir la normativa aplicable en materia de
protección de datos personales, incluyendo el RGPD y la normativa española
aplicable. Cuando QUALIVO trate datos personales por cuenta de EL CLIENTE, las
partes formalizarán, cuando resulte necesario, el correspondiente acuerdo de
encargo de tratamiento. EL CLIENTE será responsable de garantizar que los
datos facilitados para campañas, CRM, seguimiento y reactivación han sido
obtenidos y pueden ser utilizados legalmente para las finalidades
correspondientes. QUALIVO tratará los datos únicamente en el marco de los
servicios contratados y siguiendo las instrucciones acordadas con EL CLIENTE.

---

### 12. HERRAMIENTAS Y SISTEMAS

QUALIVO podrá utilizar diferentes herramientas, plataformas, sistemas de
automatización, CRM, inteligencia artificial y servicios tecnológicos para la
ejecución del proyecto. La selección y utilización de estas herramientas
formará parte de la metodología de trabajo de QUALIVO y podrá modificarse
cuando se considere necesario para mejorar la ejecución del servicio.

---

### 13. LIMITACIÓN DE RESPONSABILIDAD

QUALIVO realizará los servicios con diligencia profesional y conforme al
alcance acordado. No obstante, no será responsable de resultados derivados de
factores externos a su control, incluyendo cambios en plataformas
publicitarias, bloqueos de cuentas, cambios de algoritmos, disponibilidad de
APIs, decisiones de terceros, fluctuaciones de demanda o circunstancias
propias del mercado. La garantía prevista en la cláusula 6 constituye una
garantía comercial de continuidad del servicio y no supone una garantía
económica de resultados.

---

### 14. COMUNICACIÓN Y SEGUIMIENTO

La comunicación ordinaria del proyecto podrá realizarse mediante email,
WhatsApp, reuniones online u otras herramientas acordadas entre las partes. Se
establecerá una dinámica de seguimiento y revisión periódica de los
principales indicadores del proyecto, con el objetivo de mantener una visión
compartida sobre qué se está haciendo, qué resultados está generando, qué
oportunidades están entrando, qué está funcionando, qué debe modificarse y qué
siguientes acciones deben ejecutarse.

---

### 15. MODIFICACIONES DEL ALCANCE

Cualquier servicio o desarrollo que quede fuera del alcance descrito en este
documento podrá ser acordado entre ambas partes. Las modificaciones
sustanciales del alcance deberán ser aceptadas por ambas partes antes de su
ejecución.

---

### 16. RESOLUCIÓN DEL ACUERDO

Cualquiera de las partes podrá solicitar la finalización de la relación
profesional. La finalización no afectará a: cantidades ya devengadas,
servicios ya prestados, obligaciones de confidencialidad, obligaciones
relativas a protección de datos, y otras obligaciones que, por su naturaleza,
deban continuar después de la finalización.

---

### 17. LEGISLACIÓN APLICABLE

El presente acuerdo se regirá por la legislación española. Las partes
procurarán resolver de buena fe cualquier discrepancia que pueda surgir en
relación con la interpretación o ejecución del presente acuerdo.

---

### 18. ACEPTACIÓN

Mediante la firma del presente documento, ambas partes manifiestan haber
leído y comprendido las condiciones anteriores y aceptan el alcance, inversión,
forma de trabajo y condiciones establecidas.

En **{{CIUDAD_FIRMA}}**, a **{{FECHA}}**.

**EL CLIENTE**
{{CLIENTE_NOMBRE}}
NIF: {{CLIENTE_NIF}}
Firma:

**QUALIVO**
Maikel Echevarria Franconetti
NIF: 53395879E
C/ Guillem Plandolit nº 11, 3º 4ª
25700 La Seu d'Urgell, Lleida
Firma:
