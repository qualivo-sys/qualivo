# Auditoría de Meta Ads de Qualivo · 11-nov-2026

> Preparada por Paid para que Maikel la contraste con ChatGPT.
> **Fuentes:** Meta Marketing API (cuenta de Qualivo) y GHL (pipeline Prospección), consultadas el 11-nov a las 10:00 de Madrid.
> **Marcas:** [C] = dato confirmado, [E] = estimación.
> **Sin datos personales.**

## 0. Contexto del negocio (para quien lea esto sin conocernos)

- **Qué es Qualivo:** una agencia en España que monta y opera el sistema comercial de sus clientes: captación con anuncios, formularios, respuesta rápida por WhatsApp y teléfono, seguimiento y CRM (GoHighLevel). También tiene un panel propio, Intelligence.
- **A quién vende:** academias y centros de formación (el nicho principal ahora), clínicas y empresas de reformas.
- **Qué cuenta como éxito:** una «RC», reunión cualificada. Es una reunión celebrada con quien decide, con un problema que resolvemos y capacidad de pagar 1.200 €/mes o más, o 1.500 € o más de puesta en marcha.
- **Ticket de referencia:** el cliente ganado en octubre vale 3.600 € [C, GHL].
- **Objetivo de Maikel:** unas 20 reuniones al mes. El objetivo formal de noviembre para Meta es 6 RC.
- **Presupuesto de noviembre:** tope de 1.450 €. Llevamos 499,52 € gastados del 1 al 11 [C].
- **Cómo funciona el embudo:**
  1. Anuncio de vídeo con formulario nativo de Meta (lead ad).
  2. El lead entra en GHL por API.
  3. Un agente de WhatsApp le escribe al momento y lo puntúa del nivel A al D.
  4. Se intenta agendar una reunión.
  5. Las etapas del CRM vuelven a Meta como eventos de Conversions API: Contacted, Schedule, Qualified, Converted y Disqualified.

## 1. Evolución mensual de la cuenta [C]

| Mes | Gasto | Impresiones | Precio por mil impresiones | Clics al enlace | Leads (Meta) | Coste por lead |
|---|---|---|---|---|---|---|
| Septiembre | 697,99 € | 27.053 | 25,80 € | 341 | 38 | **18 €** |
| Octubre | 1.142,79 € | 39.381 | 29,01 € | 401 | 29 | **39 €** |
| Noviembre (1-11) | 499,52 € | 21.900 | 22,80 € | 161 | 11 | **45 €** |

### Embudo en GHL, solo leads de Meta [C]

| Mes | Leads | Nivel A | Nivel B | Nivel C | Nivel D | Reunión agendada | Reunión celebrada | Qualified | Cliente |
|---|---|---|---|---|---|---|---|---|---|
| Septiembre | 33 | 12 | 2 | 7 | 12 | **21** | **9** | 3 | 1 (señal Converted) |
| Octubre | 27 | 8 | 7 | 6 | 3 | 12 | 3 | 8 | 1 (3.600 €) |
| Noviembre (1-11) | 11 | 2 | 3 | 2 | 4 | **2** | 0 (y 1 no presentado) | 0 | 0 |

- RC marcadas por Maikel en noviembre: 0 [C].
- **El hallazgo principal:** cada mes hemos «cualificado» más los formularios y el volumen se ha hundido.
  - Septiembre: 21 reuniones agendadas y 9 celebradas.
  - Noviembre: 2 agendadas y 0 celebradas.
  - El coste por lead se ha multiplicado por 2,5, de 18 € a 45 €.

## 2. Qué se usaba en septiembre y qué se usa ahora (formación)

| | Septiembre: «AD · VERT · formacion» | Ahora: «AD · VERT · formacion · FORM CUALIF» |
|---|---|---|
| Formulario | 1786744439184083: **3 preguntas** y los datos de contacto | 2063720777591278: **6 preguntas** y los datos de contacto, con la pantalla de «mayor intención» |
| Preguntas | Cuánto inviertes en captar clientes · solicitudes al mes · dónde se escapa el negocio | Solicitudes al mes · valor de un cliente · inversión en publicidad · qué mejorar · cuándo · y otra más |
| Resultado | Sep: 179,94 € y 14 leads (13 € por lead). Oct: 250,50 € y 11 leads (23 € por lead) | Desde el 20-oct: 532,02 € y 11 leads (**48 € por lead**) |
| Calidad | No se separó en GHL por anuncio en septiembre | De 11 leads, unos 5 buenos (A, B o con reunión). El cliente de 3.600 € salió de aquí |

### Otros anuncios de septiembre y octubre [C]
- **Clínicas («AD · VERT · clinicas»):** 405,89 € y 11 leads, 37 € por lead.
- **Reformas («AD · 3V · reformas»):** 186,38 € y 15 leads, 12 € por lead, pero de calidad baja según Maikel.
- **«HERO 06 · tipográfico», estático:** 11,48 € y 2 leads.

## 3. Semana a semana del anuncio actual [C]

| Semana | Gasto | Impresiones | Alcance | Frecuencia | Precio por mil | Clics | Leads | Vio el 25 % | Vio el 50 % | Vio el 100 % |
|---|---|---|---|---|---|---|---|---|---|---|
| 20-26 oct | 128,27 € | 6.673 | 3.913 | 1,70 | 19,22 € | 46 | 3 | 282 | 173 | 56 |
| 27 oct-2 nov | 119,41 € | 6.947 | 4.538 | 1,53 | 17,18 € | 38 | 2 | 275 | 163 | 51 |
| 3-9 nov | 214,30 € | 11.927 | 7.589 | 1,57 | 17,96 € | 43 | 6 | 408 | 229 | 81 |
| **10-11 nov** | 70,04 € | 1.780 | 1.593 | 1,11 | **39,34 €** | 4 | **0** | 48 | 23 | 8 |

Lo que se lee:
- **El gancho del vídeo es débil:** solo un 3-4 % de quien lo ve llega al 25 %.
- **El clic al enlace también es bajo:** en torno al 0,5 % de las impresiones.
- **El formulario largo convierte:** alrededor del 8 % de los clics acaban en lead.

## 4. Qué pasó el 10-nov (el cambio de Reels)

- **El cambio:** el 10-nov, a las 16:45, se añadieron Reels de Instagram y de Facebook al conjunto del anuncio actual. Es un «cambio significativo» y Meta reinició el aprendizaje.
- **Reels no ha salido nunca:** 0 impresiones [C].
  - El creativo tiene reglas por ubicación: la versión 4:5 para feed y la 9:16 para stories, pero ninguna para Reels.
  - Lo más probable es que por eso no salga [E].
- **Las impresiones se han encarecido:** pasan de 17-19 € a 39 € por mil.
- **El dinero se ha ido al feed de Facebook:** 41,99 € de 70 € [C]. Es la peor ubicación del histórico: 1 lead en 117 €.
- **Facebook stories:** 7,22 € por 11 impresiones, una cifra anómala.
- **Último lead de Meta:** 9-nov a las 07:16. Llevamos más de 50 h sin ninguno.

### Ubicaciones del anuncio actual del 20-oct al 9-nov [C]

| Ubicación | Gasto | Leads | Coste por lead |
|---|---|---|---|
| Feed de Instagram | 258,75 € | 8 | 32 € |
| Feed de Facebook | 116,67 € | 1 | 117 € |
| Stories de Instagram | 78,58 € | 1 | 79 € |
| Stories de Facebook | 7,98 € | 1 | 8 € |

### Edad y sexo [C]
- **Hombres de 45-54:** 4 leads con 78 €.
- **Mujeres de 25-34:** 3 leads con 29 €.
- **Mujeres de 35-44:** 0 leads con 62 €.
- **Mayores de 55:** 1 lead con 98 €.

## 5. Estructura actual de la cuenta

- **Campaña:** QV_VERTICALES_Sep26, con objetivo Leads. El presupuesto se fija en cada conjunto (ABO) y la puja es al menor coste.
- **Conjunto «VIEJO»:**
  - 40 €/día, España, 25-65 años, público abierto con Advantage+ audience.
  - Ubicaciones: feed y stories de Facebook e Instagram, más los Reels añadidos el 10-nov.
  - Excluye a quien ya abrió formularios antiguos, a quien vio vídeos y un público similar (lookalike).
  - Estado de aprendizaje: «LEARNING» desde el 10-nov. Antes estaba en «aprendizaje limitado».
- **Conjunto de retargeting (desde el 10-nov):**
  - 10 €/día, con fin el 24-nov.
  - Públicos de 90 días: web, interacción en Instagram y Facebook, formulario abierto sin enviar y vídeo visto al 25 %.
  - Excluye a quien ya envió el formulario y a quien ya compró.
  - Anuncio: el vídeo de «arranque» de Javier con el mismo formulario.
  - Resultado hasta ahora: 12,91 €, 183 impresiones y 0 leads.
  - **Problema:** el público es muy pequeño. La web tiene unas 20 personas y el resto anda por las 1.000.
- **En pausa:** todo lo demás (Javier, reformas, clínicas, G1/G4, HERO, DIN).

## 6. Pruebas de noviembre que no funcionaron [C]

| Prueba | Gasto | Leads | Lectura |
|---|---|---|---|
| Javier, 7 versiones (formulario corto, de 4 preguntas, con filtro y con landing) | 146,53 € | 4 | 2 tenían buen perfil pero no contestaron al WhatsApp. **No fue una prueba justa:** el formulario se cambió casi a diario y cada versión recibió unos 20 € |
| Reformas con formulario de 4 preguntas | 35,62 € | 1 | Descartado por el filtro |
| E-02 (QV_11 y QV_11-nolose) | 52,95 € | 0 | Sin ganador |

## 7. Medición y CRM

- **Señales a Meta (Conversions API):** se mandan Contacted, Schedule, Qualified, Converted y Disqualified desde el 3-nov.
  - Pero el anuncio optimiza por «lead», no por calidad.
  - Con el volumen actual no hay datos suficientes para optimizar por Qualified.
- **Filtro automático:** desde el 4-nov se descarta a quien declara «no invierto nada» o un ticket menor de 300 €.
- **Del lead a la reunión:**
  - Varios leads A y B se quedan en «conversación abierta» o «no responde».
  - El contacto es solo por WhatsApp. No hay llamada en los primeros 5 minutos.
- **La landing de formación convierte poco:** solo 2 de 52-66 personas empiezan el formulario de diagnóstico [C, píxel y GA4, 21-oct a 4-nov].

## 8. Diagnóstico de Paid

1. **El problema principal es el volumen, no la calidad.**
   - El formulario largo filtra bien, pero con 40 €/día da en torno a 1 lead al día, en el mejor caso.
   - Con 1 lead al día no se llega a 20 reuniones al mes, ni aunque todos fueran buenos.
2. **Septiembre funcionó mejor en lo que importa, las reuniones,** con el formulario de 3 preguntas: 21 agendadas y 9 celebradas con 698 €. Muchos de esos leads eran de nivel D, pero el volumen compensaba.
3. **Hemos cambiado demasiado y demasiado seguido.** Desde el 1-nov se han hecho 7 versiones de Javier, 5 formularios nuevos y el cambio de Reels. Meta no ha podido aprender nada.
4. **El vídeo engancha poco** (3-4 % llega al 25 %). Mejorar el gancho y el creativo es la palanca más barata para bajar el coste por lead.
5. **Del lead a la reunión se pierde mucho:** hay leads buenos que no contestan al WhatsApp. Falta la llamada.
6. **El cambio de Reels del 10-nov se hizo sin comprobar que el creativo tenía versión para Reels.** Ha costado unos 70 € y 2 días sin leads.

## 9. Opciones que barajamos (para que ChatGPT opine)

- **A) No tocar el anuncio viejo hasta el viernes 13** y dejar que se estabilice. Si sigue sin leads, quitar Reels.
- **B) Quitar Reels ya** y volver a la configuración del lunes. El inconveniente: sería otro reinicio del aprendizaje.
- **C) Recuperar el formulario de 3 preguntas de septiembre** con el vídeo actual, en un conjunto nuevo de 15-20 €/día. Busca volumen y deja que el WhatsApp y la llamada filtren después.
- **D) Lanzar los estáticos v3:** 4 imágenes sobre pantallas reales del panel con datos simulados, en un conjunto nuevo a 8 €/día.
- **E) Ubicaciones Advantage+** en el viejo o en un conjunto aparte.
- **F) Llamar en los primeros 5 minutos** a todo lead A o B. No cuesta nada.
- **G) Google Search de alta intención:** el paquete está listo, pero no hay cuenta ni medición.

## 10. Preguntas concretas para ChatGPT

1. Con estos datos, ¿priorizarías volumen (formulario corto, como en septiembre) o calidad (formulario largo, como ahora) para conseguir unas 20 reuniones al mes con unos 1.400 €/mes?
2. ¿Deshacer Reels ya (otro reinicio) o esperar 3-5 días?
3. ¿Advantage+ en ubicaciones y público, o seguir acotando?
4. Con una sola campaña de leads y presupuesto por conjunto, ¿qué estructura recomendarías para probar sin romper lo que funciona?
5. ¿Cómo mejorarías un gancho de vídeo que solo retiene al 3-4 % hasta el 25 %?
