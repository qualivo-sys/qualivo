# 3 · Cold email · informe de Outbound · auditoría oct-2026

> Entregado el 19-oct-2026 como página hija de la auditoría en Notion:
> https://app.notion.com/p/3fe56e1ad6ed81e5be59ca4c1c417052
> Esta es la copia en el repo. Sin nombres, correos ni teléfonos de contactos.

**Fuente y su límite.** No tengo claves de Smartlead ni de GoHighLevel en esta sesión, así que **no he
consultado las APIs**: todas las cifras salen de los ficheros medidos que los scripts dejaron en el
repo entre el 19-sep y el 16-oct, y cada una lleva su fichero. **Lo que no está medido va como NO
MEDIDO y no lo estimo** salvo que lo diga. Fase de solo lectura: no he enviado, lanzado ni cambiado
nada.

**Aviso sobre la ventana:** `captacion/datos/campanas-diario.csv` **termina el 16-oct**, le falta el
15-oct (el script falló con un 401) y no tiene los días 17, 18 y 19. Cubre **17 días con dato de 21
laborables**. No he rellenado los huecos.

---

## 1 · Situación actual

**El canal está vivo y es el que menos produce.** ~2.000 correos, 21 respuestas y **un cliente
cobrado** — y ese cliente no vino de un envío de la ventana: su conversación empezó el 16-sep.

1. **La mitad de la capacidad está muerta desde el 1-oct** y sigue muerta 18 días después: goqualivo
   y gotqualivo en SURBL, y Smartlead inyecta el píxel y el enlace de baja con el dominio emisor.
2. **De la capacidad limpia usamos entre un tercio y poco más**, y de forma muy irregular: 525 correos
   un día, 1 correo otro.
3. **El paso que pierde el dinero es la respuesta, no el envío.** De las respuestas con interés real,
   **cero se contestaron** y ninguna acabó en reunión.

| Pieza | Estado | Fuente |
|---|---|---|
| Smartlead como tubería | operativo, 75 campañas | `datos/reporte-campanas-15oct-0740.json` |
| Carga con señal verificada | operativo: Mailerfind → curl → Apollo | `sdr/informe-2026-10-13.md` |
| Supresión antes de contactar | operativo, lo ejecuta Growth | `api/_supresion.js` |
| Medición diaria | **intermitente**: 401 el 15-oct, huecos | `datos/funnel-diario.csv` |
| Tracking de clics | **0 clics en toda la ventana** | `datos/campanas-diario.csv` |
| Identificación del remitente | **roto y reparado a medias** | `propuestas-areas/2026-10-07-abm-identificacion-remitente.md` |

---

## 2 · Datos verificables

### 2.1 Buzones, dominios y capacidad

| Dominio | Buzones | Capacidad/día | Estado |
|---|---:|---:|---|
| qualivoedge.com | 5 | 150 | limpio, enviando |
| novaqualivo.com | 5 | 150 (eran 100 hasta el 15-oct) | limpio, enviando |
| goqualivo.com | 3 | ~165 | **en SURBL, fuera de las campañas** |
| gotqualivo.com | 2 | ~110 | **en SURBL, fuera de las campañas** |
| **Total** | **15** | **~575 nominal / 300 vivo** | **5 quemados = 48% de la capacidad nominal** |

**Activos 10 · en calentamiento 0 · quemados 5.** Capacidad diaria real **300/día** desde el 15-oct
(antes 250). Fuentes: `control/presupuesto-outbound-octubre.md`, `control/reactivacion-15oct.md`.

### 2.2 Envíos y resultados · 19-sep a 16-oct · solo campañas de Qualivo

Excluidas las de clientes (DKR, Scubalight, Kubysoft, Infoproducto, Mailerfind), que suman 336 envíos
y 9 respuestas y **no son nuestras**. Esa separación se corrigió el 14-oct.

| Métrica | Valor | Tasa |
|---|---:|---:|
| Enviados | **2.019** | — |
| Aperturas (referencia) | 337 | 16,7% |
| **Clics** | **0** | **0,00%** |
| Rebotes | 20 | 0,99% |
| **Respuestas** | **21** | **1,04%** |
| Bajas en Smartlead | 0 | — |

**Respuestas positivas: no están clasificadas de forma fiable y no invento el número.** Medido: del
triaje de las 108 respuestas acumuladas, **6 con interés real (5,6%)** y **ninguna contestada**.
Aplicada esa tasa a 21 respuestas sale **≈1**. El 14-oct se releyeron los 130 hilos donde hablamos
últimos: los tres candidatos buenos son **noes explícitos** leídos enteros.

### 2.3 Sin mezclar etapas · lo que produjo el canal en la ventana

| Etapa | Cuántas |
|---|---|
| Envíos | 2.019 (cuentas únicas: **NO MEDIDO**, el CSV cuenta envíos) |
| Respuestas | 21 |
| Respuestas positivas | **≈1** (estimación por tasa base) |
| Reuniones reservadas | **2 cuentas** |
| **Reuniones celebradas** | **3** (dos con la que cerró, una con la de analítica el 25-sep) |
| Propuestas | **2** (una lleva 9+ días en silencio tras tres seguimientos) |
| **Clientes cobrados** | **1** · Alpha Media Group, cerrado el 2-oct |

**Importe en conflicto, y no lo resuelvo yo:** el brief del 2-oct dice **750 € el primer mes**; el bus
de Growth del mismo día dice **1.200 € primer mes y cuota desde noviembre**. La cuota recurrente:
**NO MEDIDO**.

**Atribución honesta:** esa conversación empezó el **16-sep**, fuera de la ventana. Con los envíos de
la ventana, los clientes cobrados son **0**.

### 2.4 Comparativa de 90 días

| | Septiembre | Ventana | Lectura |
|---|---|---|---|
| Enviados | 4.500 | 2.019 | menos de la mitad del ritmo |
| Aperturas | 16,4% | 16,7% | igual |
| Clics | 15 · 0,33% | **0** | desaparecieron |
| Respuestas | 46 · 1,02% | 21 · **1,04%** | igual |
| Rebotes | 1,44% | 0,99% | mejor |
| Reuniones | 3 | 3 celebradas | igual |
| Clientes | 0 | 1 | el primero del canal |

**La tasa de respuesta no se ha movido en dos meses.** Agosto: **NO MEDIDO** por mí.

### 2.5 Regularidad del envío

`525 · 372 · 45 · 106 · 167 · 179 · 7 · 13 · 76 · 30 · 103 · 0 · 20 · 74 · 15 · 1 · 286`

Media ≈96/día contra 250-300 de capacidad: **uso del 32-38%**. El 14-oct salió **un solo correo**, y
el motivo está medido: el 12, 13 y 14-oct el registro dice «depósito sin empezar: 0». No faltaban
buzones, faltaban leads.

---

## 3 · El test ABM · qué se envió de verdad

**Aclaración de fechas:** el encargo pide «el test ABM del 13-oct» y son dos cosas distintas. El test
ABM se lanzó el **6-oct**. El 13-oct se cargaron **13 leads** en Formación y Servicios B2B Intelligence
por el embudo Mailerfind → curl → Apollo, que es el motor de ICP, no la cohorte ABM.

| | Previsto | Enviado |
|---|---|---|
| Nivel 1 | 5 | **3** |
| Nivel 2 | 20 | **0** |
| **Total** | **25** | **3 · el 12%** |

`ABM Type A · L1 · semana 1 (6-oct)`: **COMPLETED, 3 leads, 5 envíos, 1 respuesta, 0 rebotes.**

### Por qué no salieron las otras 22

| Cuántas | Motivo | Confianza |
|---|---|---|
| 1 de nivel 1 | La recomendé yo para la semana 2: contacto previo en Smartlead **y** ficha en Apollo desde 2024 con actividad en ago-2025 | **Confirmado** |
| 1 de nivel 1 | Dudas sobre el decisor: cargo de Commercial Director pero Apollo lo clasificaba en operaciones | **Inferencia**: no encuentro el registro de la decisión final |
| 20 de nivel 2 | Nunca se revelaron sus contactos: hacían falta 20 créditos que no se aprobaron, y **los 2.304 restantes caducaron el 14-oct** | **Confirmado** |

Dato previo que explica el tamaño: al pasar Level 0 sobre un pool nuevo de 442 personas salieron
**5 cuentas limpias, no las 7 pedidas**; cayeron 9 por sector, 3 por medios y **4 por competencia
directa**.

### El resultado del test, y es el dato más incómodo

**De las 3 cuentas del ABM, una pidió la baja.** La petición estuvo **7 días sin ejecutar** mientras
la persona seguía activa en la cohorte, o sea podía recibir los correos 2 y 3. Se ejecutó el 14-oct
junto con otras once bajas pendientes.

Y los tres primeros correos **salieron sin firma y sin identificar quién los mandaba ni a qué nos
dedicamos**. Es un fallo mío: quité `{{signature}}` para proteger la entregabilidad y no devolví la
identificación al cuerpo. No es estilo: es el **artículo 20.1 de la LSSI**.

**Balance: 3 cuentas, 5 envíos, 1 respuesta, 1 baja, 0 reuniones.** Con 3 cuentas no se concluye nada
del ICP Type A. **El test no se ha ejecutado: se quedó en el 12% de su tamaño.**

---

## 4 · Coste mensual real

**No tengo ni una factura, así que el coste mensual del canal es NO MEDIDO.** No pongo un número
inventado en una auditoría de rentabilidad.

| Herramienta | Qué sé | Coste | ¿Se usa? |
|---|---|---|---|
| Smartlead | 75 campañas, 15 buzones. Hubo un impago que dejó 151 leads pausados, resuelto | **NO MEDIDO** | sí, a diario |
| 4 dominios | qualivoedge, novaqualivo, goqualivo, gotqualivo | **NO MEDIDO** · referencia 10-15 €/año | 2 de 4; los otros 2 quemados **y se siguen pagando** |
| 15 buzones | 10 enviando, 5 inservibles | **NO MEDIDO** · ref. 3-6 €/buzón → **45-90 €/mes estimado** | **10 de 15** |
| Apollo | 4.000 créditos/ciclo. Consumidos 1.663; **2.304 caducaron sin usar el 14-oct**. Teléfono directo: 4.000 de 4.000 gastados | **NO MEDIDO** | **parcial, se perdió más de la mitad del ciclo** |
| Mailerfind | aporta dominios desde el 13-oct | **NO MEDIDO** | sí |

**Lo que necesito:** importe mensual de Smartlead, Apollo y Mailerfind, y proveedor y precio de los
buzones. Cuatro números y el coste por respuesta y por reunión sale en diez minutos.

**El desperdicio que sí puedo cuantificar sin facturas:** se pagan **5 buzones y 2 dominios que no
pueden enviar** desde el 1-oct, y **2.304 créditos se evaporaron** el 14-oct. Eso último no era dinero
nuevo: era dinero ya pagado.

---

## 5 · Problemas, por impacto económico

**1 · Las respuestas con interés no se contestan.** Seis con interés real, **cero contestadas**, cero
reuniones. Y hay un caso vivo: la única oportunidad real del mes tuvo reunión el 25-sep, propuesta el
30-sep, tres seguimientos y **9+ días en silencio**. Arreglarlo **no cuesta dinero**.

**2 · El cuello se movió de la señal a Apollo.** Embudo del 13-oct: 732 prospectos → 544 dominios →
380 tras ICP y dedupe → **222 con señal verificada** → 79 buscados en Apollo → **27 personas** → **13
leads**. De 79 dominios con señal comprobada en su web, solo 27 dieron persona con correo verificado.
**Apollo no tiene gente en la empresa pequeña española.** Y los créditos caducaron.

**3 · La mitad de la capacidad en lista negra desde hace 18 días.** 275 correos/día muertos, dos
dominios que se siguen pagando, y una incoherencia en cada correo: **la firma dice qualivo.io y el
remitente es qualivoedge.com**. Además el 14-oct apareció **un rechazo de SURBL escondido en una
etiqueta HTML** que la detección no veía.

---

## 6 · Hipótesis, no demostradas

| Hipótesis | Qué la apoya | Cómo se comprueba |
|---|---|---|
| Los 0 clics son un fallo técnico | En septiembre hubo 15; ahora 0 en 17 días. Hay un «404 latente en el copy» anotado el 10-oct | Mandar una prueba a un buzón propio y pulsar. Media hora |
| El 16,7% de apertura está infravalorado | En septiembre el 40% de los envíos no registraba aperturas | Revisar campaña por campaña |
| El problema es el seguimiento, no el ICP | Tasa idéntica en dos meses con copys distintos, y respuesta→reunión 0 de 6 | Contestar en 4 h a las próximas 6 y medir |
| La radiografía como oferta no convence | El mejor no del mes: «observaciones genéricas sobre la web… las que sí aplican ya las teníamos identificadas» | Pedir esa crítica a los próximos tres noes |
| Reactivar campañas antiguas quema | El 16-oct, 229 de 300 envíos eran seguimientos de 15-60 días: **una baja y un rechazo sarcástico** el mismo día | Ya se pausaron 287 leads. Medir si caen las bajas |

---

## 7 · Riesgos

**Entregabilidad · alto.** Dos dominios en SURBL sin resolver en 18 días; la retirada necesita el
formulario web y averiguar antes por qué entraron. **Ningún buzón en calentamiento**, no hay plan B.
Rebote sano (0,99%).

**Cumplimiento · el más grave, y el que yo elevaría primero.**

| Qué | Detalle |
|---|---|
| **LSSI art. 20.1** | Correos sin identificar remitente ni actividad. No fue solo el ABM: es una regresión de la plantilla V3, que cierra con «Maikel» a secas. La antigua sí decía «Soy Maikel, fundador de Qualivo» |
| **Bajas sin ejecutar** | **12 peticiones de baja o RGPD**, de hasta **40 días**. Los dominios estaban excluidos pero **los leads seguían activos**. Una estaba dentro de la cohorte ABM viva |
| **Revisión legal del pie** | **Pendiente**, anotado como riesgo aceptado el 15-oct |
| **Histórico** | De 108 respuestas, 11 fueron cabreo, bloqueo o RGPD. Hay un expediente de un delegado de protección de datos |

**Dependencia de Maikel · alto.** El envío arranca y para con una orden verbal suya (la reactivación
del 15-oct fue «activalo y ya esta te autorizo yo», con tres riesgos aceptados). Las respuestas las
contesta él o no se contestan. La llamada que puede salvar la única oportunidad del mes es suya. Y el
precio y el copy nuevo son suyos, así que el canal no puede corregir su propio mensaje sin esperarle.

---

## 8 · Oportunidades

1. **Contestar en 4 horas.** 0 €. Única con pérdida demostrada detrás: 6 de 6 sin contestar.
2. **No entregar propuesta a una sola persona.** 11 propuestas, 1 cierre, y en 6 el decisor no estaba.
3. **Jubilar los dos dominios quemados.** Recupera 275 correos/día y arregla firma/remitente.
4. **Comprobar el enlace del copy.** Si es un 404, media hora.
5. **Gastar los créditos antes de que caduque el ciclo.** Ya se perdieron 2.304.
6. **Cargar leads todos los días.** Con depósito a 0 tres días, el canal mandó 1 correo el 14-oct.

---

## 9 · Recomendación · OPTIMIZAR, no escalar. Y no comprar buzones

1 cliente en 30 días con ~2.000 envíos y tasa plana en dos meses: subir volumen es multiplicar ruido
y riesgo de dominio. Pero tampoco lo pausaría: de aquí salió el único cierre del trimestre y la única
oportunidad real abierta.

Orden propuesto, y los tres primeros no cuestan dinero:

1. **Las dos reglas de 0 €**: contestar en 4 h, y no entregar propuesta sin el decisor.
2. **Cerrar el riesgo de cumplimiento**: identificación del remitente y revisión legal. No es
   optimización, es exposición.
3. **Comprobar enlace y tracking.** Media hora.
4. **Dos dominios nuevos**, 30-50 €/mes estimado. **Tres semanas de calentamiento: no arregla
   octubre, arregla noviembre.**
5. **Créditos de datos, no buzones.** Volumen y créditos van 1 a 1.

**Lo que NO recomiendo:** comprar buzones (usamos 32-38% de los que hay), abrir verticales, ni
reactivar campañas con secuencias a medias, que el 16-oct costó una baja y un rechazo en un día.

---

## 10 · Reparto en los tres escenarios · solo mi área

**No puedo dar euros del gasto comprometido porque no tengo facturas.** Doy prioridad e importes
conocidos.

**Antes de proponer compras, lo que pide el encargo: con lo que ya hay se pueden enviar 300
correos/día, unos 6.000 al mes. En la ventana mandamos 2.019. Hay margen para triplicar el volumen
sin gastar un euro nuevo** — lo que falta no es capacidad, son leads cargados y una razón para
mandarlos.

| Escenario | Mi petición | Comprometido | Inversión nueva |
|---|---|---|---|
| **500 €/mes** | **0 € nuevos.** Las tres acciones de coste cero y comprobar el enlace. El dinero va a los canales que convierten | Smartlead + buzones + Apollo (**NO MEDIDO**) | **0 €** |
| **1.000 €/mes** | **30-50 €** para los dos dominios nuevos. Nada más | idem | **30-50 €** est. |
| **1.500 €/mes** | Los dos dominios **+ créditos para 2.000-2.500 leads/mes**, que es lo que exige llenar la capacidad limpia | idem | 30-50 € + créditos (**precio NO MEDIDO**) |

**Y algo que sería deshonesto no decir, aunque juegue contra mi canal:** en el mismo mes el embudo de
anuncios y WhatsApp produjo reuniones con una fracción de los toques. Si la pregunta del informe final
es *qué compra más reuniones que acaban comprando*, el dato de octubre no señala al correo frío. No es
mi área y no opino sobre cuánto meter ahí, pero pedir dinero nuevo para esto sin decirlo sería ocultar
la mitad del cuadro.

---

## 11 · Coste y esfuerzo

| Acción | Dinero | Horas de Maikel | Depende de |
|---|---|---|---|
| Contestar en 4 h | 0 € | ~2 h/semana | solo de él |
| No entregar propuesta sin decisor | 0 € | 0 h | disciplina en la reunión |
| Identificación del remitente | 0 € | 15 min de ok | es copy: lo aprueba él |
| Revisión legal del pie | **NO MEDIDO** | 1 h | asesor externo |
| Comprobar enlace y tracking | 0 € | 0 h | **necesito clave de Smartlead** |
| Retirada de SURBL | 0 € | 1-2 h | formulario web: **no puedo hacerlo yo** |
| Dos dominios + 6 buzones | 30-50 €/mes est. | 1 h | 3 semanas de calentamiento |
| Créditos de datos | **NO MEDIDO** | 30 min | precio del plan |
| Cargar leads a diario | 0 € | 0 h | **necesito claves** |

---

## 12 · Lo que no sé

- **El coste real del canal.** Sin facturas no hay coste por respuesta, por reunión ni CAC. Es el
  agujero más grande de este informe.
- **Cuántas de las 21 respuestas fueron positivas.** El campo de clasificación está casi vacío.
- **Cuántas cuentas únicas se contactaron.** El CSV cuenta envíos.
- **Los días 15, 17, 18 y 19 de octubre.**
- **Si los 0 clics son técnicos o reales.** Es la comprobación más barata y no he podido hacerla.
- **Agosto**, para los 90 días completos.
- **El importe exacto del único cliente y su cuota desde noviembre.**
