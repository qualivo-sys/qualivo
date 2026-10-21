# Hipótesis de Outbound para noviembre · aportación al banco de Growth

Encargo de Growth del 21-oct. Entrega: viernes 23-oct a las 18:00. Lo ha escrito Outbound. Es solo análisis: no se ha tocado ninguna campaña, mensaje ni CRM.
Corrige H-08, H-09 y H-10 del banco v0 (`docs/chief-of-staff/2026-10-21-sistema-experimentacion-q4.md`, sección 4) y añade dos.

**Fuente de casi todo:** `docs/outbound/2026-10-21-lookalike-conversaciones-ganadoras.md`, que es la ingeniería inversa de las cinco conversaciones que salieron del correo frío con señal. Tiene los hilos de Smartlead, Gmail y Apollo consultados el 21-oct.

Etiquetas: **[C]** comprobado · **[E]** estimación · **[H]** hipótesis.

---

## H-13 (nueva) · Escribimos a la empresa equivocada, no con el mensaje equivocado
*Pregunta 1: ¿por qué no llegan leads de calidad? · Etapa: lead · O1*

> **Creemos que** filtrar por sector y por tamaño pequeño (1 a 50) **provoca** que la mayoría de los envíos vayan a empresas que no se parecen a las que sí responden, **porque observamos que** las 5 reuniones del correo frío con señal son empresas asentadas, con equipo y con una inversión visible (LinkedIn Ads, Google Ads o HubSpot): publicidad exterior, branding, capital riesgo, software y alimentación. Ninguna es de los tres sectores del Playbook Q4. **Si** cargamos solo lookalikes (inversión visible, 5 años o más, de 11 a 200 personas, agencias que no compiten incluidas), **esperamos** pasar de unas 2,7 reuniones por cada 1.000 envíos a 3 o más.

- **Evidencia:** las 5 reuniones de Alpha, TALKUAL, Dataslayer, Faraday y Morillas salieron de 1.885 envíos de las campañas de señal desde el 16-sep [C, Smartlead]. Los tres Playbook Q4 llevan unos 19 envíos diarios cada uno y 0 respuestas en el embudo del 20-oct [C]. **Confianza media:** son 5 casos de una sola semana de septiembre.
- **La refutaría:** que 600 cuentas lookalike den 0 o 1 reuniones.
- **Experimento:**
  - Variable: el filtro de carga. Métrica: reuniones por cada 1.000 envíos. Duración: 3 semanas más 1 de cola.
  - Presupuesto: 0 €; unos 1.200 créditos de Apollo ya pagados.
  - Horas: unas 2 horas al día de agente, dentro de la rutina. Maikel: 0 minutos salvo las reuniones.
  - Éxito: 3 o más reuniones por cada 1.000 envíos. Parada: bajas por encima del 1% o cualquier queja formal.
  - Contaminación: baja, va sobre las campañas de señal que ya existen.
- **I 7:** es el canal del único cliente nuevo de octubre. **C 5:** pocos casos y buzones distintos a los de septiembre. **E 8:** el cargador ya existe; solo cambia el filtro.
- **Coste:** 0 €. **Días hasta lanzar:** 1 después del ok.

## H-09 (corregida) · El correo 1 actual pide dos clics en vez de una respuesta
*Pregunta 1 · Etapa: lead → conversación · O2*

> **Creemos que** el correo 1 actual, con dos enlaces (diagnóstico y llamada) y la garantía guardada para el correo 2, **provoca** menos respuestas al primer correo, **porque observamos que** las dos respuestas al correo 1 (Alpha a los 4 minutos y TALKUAL a las 3,5 horas) llegaron con la versión sin enlaces en el cuerpo y con la garantía de pagar solo si el número se mueve. Desde que se añadieron los enlaces, el 17-sep, las respuestas con interés han llegado en el correo 2 (Faraday, Morillas y Dataslayer). **Si** volvemos a la versión sin enlaces y con la garantía en el correo 1, **esperamos** más respuestas positivas en el correo 1.

- **Corrige H-09 del v0.** El v0 apuntaba a que la «radiografía» suena genérica. Las campañas de señal ya no la ofrecen en frío, así que la variable viva es esta.
- **Evidencia:** los hilos de Smartlead de las 5 conversaciones [C]. **Confianza baja-media:** son 2 respuestas al correo 1 frente a 3 al correo 2, y el corte del 17-sep coincide con otros cambios (buzones y volumen).
- **La refutaría:** que con 1.500 envíos por grupo no haya diferencia en respuestas positivas.
- **Experimento:**
  - Prueba A/B dentro de las mismas campañas, con el copy por lead. No hay que tocar la secuencia.
  - Métrica: respuestas positivas por cada 1.000 envíos del correo 1. Duración: 3 semanas.
  - Coste: 0 €. Horas: 1 hora para preparar el copy. Maikel: 5 minutos para aprobar el texto, porque es un cambio de copy.
  - Éxito: la versión sin enlaces saca el doble de positivas en el correo 1. Parada: las mismas que H-13.
  - Contaminación: **va dentro de H-13.** Se lanzan juntas y se lee cada una por separado.
- **I 5:** mueve la tasa, no el volumen. **C 4:** muestra muy pequeña. **E 9:** es un párrafo.
- **Coste:** 0 €. **Días hasta lanzar:** 1 después del ok.

## H-10 (corregida) · El cuello no es Apollo: es lo que se pierde después de pagar
*Pregunta 1 · Etapa: lead · O1*

> **Creemos que** revelar antes de filtrar **provoca** que la mitad de los créditos se pierdan, **porque observamos que** el 21-oct, de 240 personas reveladas, se cayeron 46 por catch-all, 23 por correo de otro dominio, 40 por empresas ya contactadas y 11 por otros motivos (sector, buzón de rol, duplicado) que solo se descubrieron después de pagar. Salieron 120 leads cargados, a unos 2 créditos por lead. **Si** filtramos por dominio antes de revelar (búsqueda gratuita de empresas por dominio y sonda de catch-all), **esperamos** bajar a 1,3 créditos por lead cargado.

- **Corrige H-10 del v0.** El v0 decía que Apollo no tiene personas en la pyme española. Para empresas de 11 a 200 personas sí las tiene: 2.246 con LinkedIn Ads, 3.162 con HubSpot y 3.923 con Google Ads [C, Apollo 21-oct]. El problema es el orden de los pasos.
- **Evidencia:** los informes de los agentes de carga del 21-oct [C]. **Confianza alta** en la pérdida; **media** en que el arreglo la recupere entera.
- **La refutaría:** que con el filtro previo se siga por encima de 1,8 créditos por lead cargado.
- **Experimento:**
  - Variable: el orden (filtrar y luego revelar). Métrica: créditos por lead cargado. Duración: 1 semana.
  - Coste: 0 €. Horas: unas 3 horas para el script. Maikel: 0 minutos.
  - Éxito: 1,5 créditos o menos por lead cargado.
  - Contaminación: ninguna, porque no toca lo que se envía.
- **I 5:** con los créditos que caducan el 14-nov, es la diferencia entre 1.500 y 2.300 leads. **C 7.** **E 8.**
- **Coste:** 0 €. **Días hasta lanzar:** 2.

## H-14 (nueva) · El que decide deriva, y la conversación sigue con quien opera
*Pregunta 2: ¿por qué no tenemos reuniones efectivas? · Etapa: reunión · O2*

> **Creemos que** escribir solo al CEO o al socio **provoca** que perdamos las conversaciones en las que el decisor no se toma la molestia de derivar, **porque observamos que** en 4 de las 5 reuniones el destinatario pasó el correo a otra persona: Betlem en TALKUAL, Adela en Dataslayer, Nicole en Faraday y Eric en Morillas. Esa otra persona es la que reservó o pidió la llamada. **Si** escribimos en paralelo al decisor y a la persona de marketing o de clientes de la misma cuenta, con 3 días de desfase y un mensaje distinto para cada uno, **esperamos** más reuniones por cuenta trabajada.

- **Evidencia:** los hilos de Smartlead y Gmail [C]. **Confianza baja:** puede que los que no derivan simplemente no tengan interés.
- **La refutaría:** que el segundo contacto no añada reuniones y sí bajas.
- **Experimento:**
  - Mitad de las cuentas de H-13 con dos contactos y la otra mitad con uno. Métrica: reuniones por cuenta.
  - Duración: 3 semanas. Coste: unos 300 créditos más. Horas: 1 hora al día. Maikel: 5 minutos para el texto del segundo contacto.
  - Éxito: un 50% más de reuniones por cuenta en el grupo de dos contactos. Parada: cualquier queja por escribir a dos personas de la misma empresa.
  - Contaminación: **media**, porque comparte cuentas con H-13. Mejor lanzarla después, en diciembre.
- **I 6.** **C 4.** **E 6.**
- **Coste:** 0 €. **Días hasta lanzar:** 3.

## H-08 (corregida) · Ya no es una hipótesis: es una obligación operativa
*Pregunta 2 · Etapa: reunión · O2*

**Propongo sacarla del banco.** Desde el 14-oct el triaje de respuestas es cada hora y las respuestas con interés se contestan el mismo día [C, Outbound]. Lo que queda no es un experimento: es mantener la norma.

Dos datos para el registro:
- Adelantta acabó en reunión aunque Maikel tardó 16 días en contestar [C]. La rapidez ayuda, pero un decisor que pide concreción también espera.
- Las respuestas que se perdieron después de la reunión son de seguimiento, no de primera respuesta: Dataslayer acumula tres toques sin contestar [C]. Eso es de Growth y Ventas: qué se manda en las 48 horas siguientes a la reunión.

**Puntuación, si se mantiene:** I 3 · C 5 · E 9.

---

## Lo que dejo como pregunta (no hace falta respuesta de Maikel ahora)

1. ¿Cómo acabaron TALKUAL, Faraday y Dataslayer después de la primera reunión? Sin eso no se puede escribir la hipótesis de cierre (pregunta 3).
2. Sobre la edad del comprador no hay ningún dato en outbound: Apollo no la da. No la uso en ninguna hipótesis.
