# Estudio · ¿Google Ads para Qualivo? (v0.9 · 14-oct-2026 · cierre 17-oct con Trends y revisión de Maikel)

Pedido de Maikel (14-oct): "¿crees que sería interesante hacer una campaña en Google Ads? ¿podríamos hacer un estudio?" → "haz eso porfa".
Alcance: estudio de mesa, sin gasto. Decide si Google Ads arranca en noviembre, con qué estructura, presupuesto y fecha de muerte.
Regla: cero cifras inventadas. Cada número lleva valor, fuente y fecha; lo que no tiene fuente va marcado como **estimación** o **pendiente**.

## 0 · Resumen

**Formación: no.** En España se buscan unas 70 veces al mes "agencia de marketing educativo" y menos de 10 cualquier variante con "academias" o "centros de formación". Las búsquedas informativas ("qué es el marketing educativo") suman 160/mes. No hay demanda suficiente para una campaña de búsqueda; el canal para formación sigue siendo Meta (y, en fase 2, YouTube con los vídeos 3V2 sobre audiencias).

**Clínicas: sí, pequeño y caro, pero con intención.** Unas 870 búsquedas/mes de "quiero una agencia" (CPC medio ponderado 5,9 €, dental hasta 14-30 €) más unas 1.950 de "marketing para clínicas / dental / estética" (CPC 5,2 €), casi todo dental y médico. Con una cuota de impresiones realista, el canal absorbe **200-350 €/mes como máximo**: 30-60 clics, 2-5 leads, 60-150 € por lead. Es un complemento de alta intención, no un canal de volumen. La primera página de Google para estas búsquedas es una pared de agencias con "auditoría gratuita"; nuestra diferencia tiene que ser el sistema (seguimiento + CRM + medición hasta el paciente), no el diagnóstico gratis.

**Recomendación:** no arrancar en octubre. Si el 20-oct el funnel v2 sigue en pie, montar en pausado una campaña de búsqueda solo para clínicas (dental + estética + médico), 10 €/día, 6 semanas desde el 3-nov, con etiqueta de conversión, gclid en GHL e importación de "reunión celebrada". Muere el 15-dic si no hay ≥ 3 reuniones celebradas atribuidas o el coste por reunión supera 2× el de Meta (236 €). Marca (qualivo) a 1 €/día desde ya cuando Growth tenga la etiqueta.

Fuentes de los números: DinoRANK API, keyword-research, país ES, 14-oct-2026 (45 semillas, 2.779 términos relacionados, 92 relevantes tras filtrar inglés, marcas y formación académica; CSV en `paid/estudios/2026-10-14-google-ads-keywords-es.csv`). Competencia: investigación de mesa 14-oct (§3). Benchmarks: §5.

## 1 · Qué sabemos ya (datos propios)

**Meta, 17-sep → 12-oct (GHL + Meta API, 12-oct):** 50 leads de formulario nativo, CPL 23,6 €, 50 % nivel A+B, 20 % llegan a reunión celebrada, coste por reunión celebrada 118 €, 1 piloto (CAC ~1.179 € con n=1). Dolor declarado: clínicas 60 % "seguimiento"; formación "anuncios" y "respuesta". Es la vara de medir: Google tiene que dar reuniones celebradas a menos de 118 €, o leads con mejor encaje a un coste similar.

**Google Ads B2B en español, cuenta de cliente operada por Qualivo (repo `outthink-google-ads/ESTADO.md`, sep-2026):** lección directa para un nicho pequeño:
- 4 de 17 palabras clave hipernicho en concordancia de frase quedaron `RARELY_SERVED` por volumen insuficiente; la campaña de búsqueda sirvió 4 impresiones en 11 horas hasta que se abrió a concordancia amplia (75 impresiones/día después).
- Techo de CPC necesario (3,00 €) porque "maximizar clics" sin límite y amplia disparan el CPC.
- La medición (conversión, GTM, Consent Mode) decidió el ritmo: sin conversiones no se puede optimizar a conversiones.
- Ejemplo de informe en el mandato Paid (`docs/agent-os/04-systems/70-paid.md`, 14-sep): CPL 45,8 €, CPL cualificado 103 €, campaña de consultoría IA CPL 31 € con 4 de 4 cualificados. **Benchmark B2B en español, no de nuestro nicho.**

**Medición en la landing (rama Growth, `assets/consent.js`, 13-oct):** GA4 `G-LVDQS0MXF4` con Consent Mode v2 ya implementado; no hay etiqueta de conversión de Google Ads (`AW-…`), ni captura de `gclid` hacia GHL. A diferencia de Meta, Google modela las conversiones sin consentimiento vía Consent Mode: el aviso de cookies penaliza menos aquí.

## 2 · Demanda: qué busca la gente y cuánto (DinoRANK, ES, 14-oct-2026)

Método: 45 búsquedas semilla (22 formación, 23 clínicas) a la API de DinoRANK (`keyword-research`, país ES, fuente "visibility"); devuelve términos relacionados con volumen mensual, CPC y competencia. Se filtran inglés, marcas, cursos/estudios de marketing y software. Intención: **S** quiere agencia/servicio · **S?** "marketing para X" (mixta: dueños, empleados, estudiantes) · **I** informarse · **H** herramienta.

| Vertical · intención | Términos | Búsquedas/mes ES | CPC medio (pond. por volumen) |
|---|---|---|---|
| Formación · S | 1 | 70 | sin CPC (nadie puja) |
| Formación · S? | 5 | 150 | sin CPC |
| Formación · I | 7 | 160 | sin CPC |
| Clínicas · S | 21 | 870 | 5,94 € |
| Clínicas · S? | 52 | 1.950 | 5,17 € |
| Clínicas · I | 6 | 100 | 1,78 € |

**Formación.** "agencia de marketing educativo" 70/mes; "marketing para centros educativos" 40; "marketing digital para academias" 20; "estrategias de captación de alumnos" 10. Las semillas "agencia marketing para academias", "captación de alumnos", "publicidad para academias" **no aparecen con volumen** (< 10/mes o sin dato). Nadie puja: CPC 0 en todas. Conclusión: no hay mercado de búsqueda; quien busca "marketing educativo" suele ser estudiante o colegio.

**Clínicas (términos S con volumen y CPC real):**

| Búsqueda | Vol/mes | CPC € | Competencia |
|---|---|---|---|
| agencia marketing digital médico | 170 | sin puja | 0,00 |
| agencia de marketing para clínicas (con/sin tilde) | 70 + 40 | 4,57 | 0,24-0,53 |
| agencia marketing salud | 70 | sin puja | 0,20 |
| agencia de marketing para dentistas | 50 | 13,92 | 0,24 |
| agencia de marketing dental | 50 | 30,22 | 0,22 |
| agencia de marketing para psicólogos | 50 + 40 | 2,11 | 0,04 |
| agencia marketing médico (variantes) | 40 + 30 + 30 + 30 | 3,68-4,08 | 0,22-0,56 |
| agencia de marketing sanitario / para médicos | 20 + 10 | sin puja | |

**Clínicas (S?, "marketing para…", en español):** marketing digital para clínicas dentales 260 (2,93 €) · marketing para clínicas dentales 210 (4,37 €) · marketing médico 140 (5,07 €) · marketing digital para clinicas dentales 140 (14,03 €) · marketing para clinicas dentales 110 (5,56 €) · marketing sanitario 110 · marketing digital para clínicas 70 (8,87 €) · marketing clínica dental 70 (7,89 €) · marketing para clínicas estéticas 50 (7,26 €).

Lectura: **dental** concentra la demanda y los CPC más altos (hay agencias dentales pujando fuerte); **estética** es pequeña en búsqueda (50-70/mes); **psicólogos** aparece como nicho barato (2 €) que no teníamos en el radar. Fisioterapia no devuelve términos con volumen.

**Cuánto se puede gastar.** Suma relevante clínicas S + S? ≈ 2.800 búsquedas/mes. Con cuota de impresiones del 30-50 % en posiciones altas (realista para una cuenta nueva con 10 €/día) → 850-1.400 impresiones/mes; CTR de búsqueda 4-6 % → 35-85 clics; CPC 4-8 € → **140-680 €/mes de gasto posible**, con la parte alta solo si se entra en dental contra agencias que pagan 14-30 €. Conclusión operativa: 10 €/día es el presupuesto natural; más no se puede gastar sin abrir a términos de intención floja.

## 3 · Competencia en Google (investigación de mesa, 14-oct-2026)

Limitación: no se pudo ver el número real de anuncios en Google ni el Centro de Transparencia (requieren navegador con JavaScript). Lo que sigue es orgánico + webs de las agencias; "Google Ads" indica que gestionan Google Ads para clientes, no que anuncien ellas.

**Clínicas: la primera página es 100 % agencias en las 4 búsquedas comprobadas** (agencia marketing para clínicas, agencia captación pacientes, agencia marketing clínica dental, agencia marketing clínicas estética). El CTA estándar del sector es la **auditoría gratuita**: UpDent ("El 70 % de la inversión en marketing dental se pierde", auditoría gratuita), Sayonara (dental, Google Partner, inversión mínima 500 €/mes, clientes > 250.000 € de facturación), +consultas/Más Pacientes (auditoría gratuita, Meta Partner), Yuppi (diagnóstico 30 min; vía Sortlist: desde 600 €/mes, fee 30 % de la inversión), Eleva tu Clínica (**el más parecido a Qualivo: Google + Meta + CRM médico + automatización**, "auditoría gratis en 15 minutos"), Lokality (garantía "10 pacientes nuevos al mes o no cobra"), Kliniksolutions ("auditoría gratuita, exclusividad de zona"), Playmedic, Hazboom, MyNucleo, Docmedia, Multiplica Salud, Arimetrics. Implicación: "diagnóstico sin coste" no diferencia en clínicas; lo que nadie promete igual es "del anuncio al paciente, medido en tu CRM" y la llamada de Raquel.

**Formación: menos especialistas y SERP mixta.** "agencia marketing para academias" sí da 10/10 agencias (Agencia Nous con Método CIMA, precio público 1.000-5.000 €/mes, Google Partner, "sistema de seguimiento"; La Luna "aulas llenas todo el año", auditoría 15 min; Marketinhouse, escuelas de negocio y universidades, Google Premier Partner; Scire, Local Max desde 500 €/mes, Branderlust, Unlimited Growth, Adsplorer, Englody). Pero "captación de alumnos agencia" ya mezcla agencias con how-to y software (Clientify, Sydle), y "marketing para centros de formación" la dominan artículos. Leads Formación vende leads por API. Coherente con los volúmenes de §2: hay agencias posicionadas para muy pocas búsquedas.

**Impulso Business Lab (Impulso 360):** público declarado coaches, consultores, mentores, agencias y negocios de servicios; **no aparece en ninguna búsqueda de academias ni clínicas**; canal Meta, no Google; garantía "si no lo logras no pagas" con disclaimer. Competidor indirecto por lenguaje ("sistema de captación y cierre", WhatsApp con IA), no por palabras clave.

**Otros canales que usan los competidores:** notas de prensa pagadas en que.es / moncloa.com / merca2.es (Discovery, Lokality, Oli Media, Nous en Emprendedores) para ocupar SERP de marca y long tail. Barato; a valorar junto a Ads.

## 4 · Encaje con la oferta

- **Clínicas S** (870/mes): quien busca "agencia de marketing para clínicas/dentistas/médico" ya ha decidido externalizar. Es el tráfico más cercano a tipo B que podemos comprar. Riesgo: dental está dominado por agencias dentales puras con CPC de 14-30 €; nuestra entrada natural es "clínicas" y "médico" (4-5 €) y estética (7 €), dejando dental para términos de frase baratos.
- **Clínicas S?** ("marketing para clínicas dentales", 2,9-5,6 €): intención mixta; sirve con landing que cualifique en el paso 1 (la de clínicas aún no existe en v2.1) y negativas fuertes (curso, máster, empleo, software, qué es).
- **Psicólogos** (90/mes, CPC 2 €): nicho no previsto, barato, encaja en "clínicas" si Ops acepta tickets más bajos. Para decidir con Maikel, no para arrancar.
- **Formación**: sin demanda de búsqueda. El encaje de Google aquí es **YouTube con los 3V2** sobre audiencias personalizadas (gente que buscó "marketing educativo", visitantes de /formacion/), fase 2.
- **I y H**: fuera. Solo como negativas o remarketing.

## 5 · Números (clínicas, con los datos de §2)

Benchmarks externos, ninguno de nuestro nicho: LocaliQ/WordStream (EE. UU., jun-2026) servicios a empresas CPC 5,87 $, CVR 4,85 %, CPL 93,69 $; dentistas CPC 8,00 $, CVR 10,67 %; B2B puro (Metadata.io, 2025) CVR 1,9 %, CPL 524 $; blogs españoles sin metodología: CPL B2B 25-65 € (Yakyak 2026), 110-140 € (Borja Aranda), 40-150 € en B2B consultivo (Roger Montero 2026). Propios: Meta 118 € por reunión celebrada; cuenta B2B de Google operada por Qualivo, CPL 31-46 € con 4 de 4 cualificados en la mejor campaña (14-sep).

Supuestos (marcados): CPC 4-8 € (dato DinoRANK §2); CVR visita→lead 4-8 % (**estimación**, intención alta pero landing de clínicas por hacer); reunión celebrada por lead 25-40 % (**estimación**; Meta da 20 %, búsqueda debería mejorar); gasto máximo posible 140-680 €/mes (§2).

| Presupuesto/mes | Clics | Leads | CPL | Reuniones celebradas | Coste/reunión |
|---|---|---|---|---|---|
| 300 € (10 €/día) | 40-75 | 2-6 | 50-150 € | 0,5-2,4 | 125-600 € |
| 500 € (17 €/día) | 60-125 | 3-10 | 50-150 € | 0,8-4 | 125-600 € |

Lectura: con 300 €/mes se compran 2-6 leads al mes de alta intención; en 6 semanas, 3-9 leads y 1-4 reuniones. Es poco para una tasa, pero suficiente para ver si los leads de búsqueda son B y llegan a reunión. 500 €/mes **no se puede gastar** sin abrir a dental caro o a intención floja. Google no sustituye a Meta para clínicas; lo complementa con 2-6 leads mejores al mes.

## 6 · Requisitos técnicos antes de gastar

1. Etiqueta de conversión de Google Ads (`AW-…`) en la landing, disparada al enviar el paso 2 y al reservar, bajo el Consent Mode ya existente. Growth.
2. Capturar `gclid` (y `gbraid/wbraid`) en la URL y guardarlo en el contacto de GHL, igual que las UTM. Growth.
3. Importar conversiones offline a Google Ads desde GHL: "reunión celebrada" y "cliente", con el `gclid`. Es lo que convierte a Google en una máquina de reuniones y no de formularios. Growth + Paid.
4. Página de destino propia por vertical (formación v2.1 sirve; clínicas no tiene landing nueva todavía).
5. Vinculación GA4 ↔ Google Ads y audiencias de remarketing (visitantes de /formacion/ y /clinicas/ sin lead) para YouTube con los vídeos 3V2.

## 7 · Estructura propuesta (para montar en pausado el 20-oct si Maikel da el OK)

- **Una campaña de búsqueda, solo clínicas**, España, español, 10 €/día. Tres grupos: "agencia clínicas/médico/salud" (frase: agencia marketing clínicas, agencia marketing médico, agencia marketing salud, agencia marketing sanitario), "marketing para clínicas" (frase: marketing para clínicas, marketing digital para clínicas, marketing para clínicas estéticas, marketing clínica estética), "dental barato" (frase: marketing para clínicas dentales, marketing digital para clínicas dentales; **excluir** "agencia marketing dental" y "agencia para dentistas" por CPC 14-30 €). Techo de CPC 6 €. Negativas desde el día 1: curso, máster, grado, empleo, trabajo, sueldo, qué es, ejemplos, pdf, software, crm, gratis, plantilla, para pacientes, odontología (estudios), psicólogo (hasta decidir).
- **Formación: ninguna campaña de búsqueda.** YouTube/Demand Gen con los 3V2 sobre audiencias personalizadas, fase 2, solo si clínicas funciona.
- **Marca** (qualivo, qualivo agencia) a 1 €/día, desde que exista la etiqueta de conversión.
- Puja: maximizar clics con techo 2 semanas; maximizar conversiones cuando haya 15-20 conversiones (con importación offline de "reunión celebrada" la conversión que optimiza es la reunión, no el formulario).
- Landing: hace falta la de clínicas (hoy solo existe formación v2.1); mientras no exista, no arranca.

## 8 · Fecha de muerte

Si arranca el 3-nov con 10 €/día: lectura el 1-dic (4 semanas, ~280 €) y decisión el 15-dic (6 semanas, ~420 €). Muere si en 6 semanas no hay ≥ 3 reuniones celebradas atribuidas a Google (gclid) o el coste por reunión supera 236 € (2× Meta). Si vive: subir a 15 €/día y abrir estética y psicólogos.

## 9 · Decisiones para Maikel

1. ¿Arranca búsqueda para clínicas en noviembre a 10 €/día? (Mi recomendación: sí, si el funnel v2 sigue en pie el 20-oct.)
2. ¿Formación fuera de Google Search? (Recomendación: sí; YouTube en fase 2.)
3. ¿Psicólogos entra como nicho? (Decisión de oferta, no de Paid.)
4. OK a Growth para etiqueta de conversión + gclid en GHL + importación offline, a partir del 20-oct.
5. Landing de clínicas v2: quién y cuándo (Growth/Creative).

Pendiente para el cierre del 17-oct: estacionalidad con Google Trends (decisión B2B de contratar agencia: hipótesis mayo-julio y noviembre-diciembre) y revisión de Maikel. Los volúmenes de DinoRANK son medias de 12 meses; el Planificador de Google puede diferir ±30 %, pero no cambia la conclusión (formación no; clínicas poco y caro).
