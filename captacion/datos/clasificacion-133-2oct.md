# Clasificación de los 133 leads de Apollo · A/B/C/Fuera · 2-oct-2026

> Preparación, no carga. Cargar necesita el ok de Maikel (regla de gobernanza del 1-oct).
> Fuente: `captacion/datos/apollo-nuevos-1oct.json` (133 registros).
> Método: sonda a las 133 webs + cruce contra los 6.311 emails que ya existen en Smartlead.

## El resultado en una línea

**De 133 leads, 13 son A.** El resto se cae por motivos que no son de higiene de dato: 39 ya
los habíamos contactado, 20 son competidores directos nuestros y 7 son demasiado grandes.

| Clase | Leads | Qué es |
|---|---|---|
| **A** | 13 | Encaje claro + señal verificada de que invierten en captación hoy |
| **B** | 16 | Encajan con una puerta blanda (producto en vez de servicio, ticket bajo, sin instrumentar) |
| **C** | 24 | Plausibles pero no verificables sin trabajo manual |
| **Fuera** | 31 | Competidor, tamaño, entidad equivocada o registro roto |
| *Caídos antes de clasificar* | 49 | Ya enviados (39), duplicados internos (8), >150 empleados (2 no repetidos) |

## Los tres hallazgos que importan más que la lista

### 1. Veinte de los 133 son competidores directos

No "parecidos". Competidores: agencias de marketing, consultoras de growth, agencias SEO.
WeRise se describe como **«Agencia de crecimiento con IA»**, que es nuestra propia frase.
LeadPro Agency lo lleva en el nombre.

| Empresa | Dominio | Cómo se describe |
|---|---|---|
| WeRise | werise.es | WeRise® — Agencia de crecimiento con IA |
| ALCALINK E-COMMERCE PrestaShop y Marketi | alcalink.com | Sosteniendo e impulsando el crecimiento:líderes en automatización, d |
| Media Power | themediapower.com | Agencia de marketing digital en Madrid |
| SEOCOM.Agency | seocom.agency | Agencia SEO y GEO |
| Roas Hunter | roashunter.com | AGENCIA DE MARKETING DIGITAL |
| LeadPro Agency | leadproagency.com |  |
| Inka Marketing Estratégico 360º | inkamarketing.es | Agencia de marketing digital en Madrid |
| LIN3S ≡ Digital Consulting | lin3s.com | Consultora de negocio digital | LIN3S |
| ADG Media Group | adgmediagroup.es | Soluciones de Marketing Digital 360º |
| Why Ads Media - Digital Consulting Firm | whyadsmedia.com | La consultora digital estratégicaque multiplica tus ventas. |
| E-com Growth Partners | ecomgrowthpartners.com | Choose your country |
| Asiri Marketing | asiri.es | Agencia de Marketing Digital Especializada en Turismo |
| Agencia Nous | agencianous.com | Agencia de Marketing Digital en Madrid |
| Snowball | agenciasnowball.com | CONSULTORA DE GROWTH MARKETING |
| Agencia Seoinnova | seoinnova.es | Agencia SEO Alicante |
| MARCO | marco.agency | Marco Agency - MARCO |
| Marketalia Marketing Online | marketalia.com | We are |
| Actimundi - Creative Agency | actimundi.com | Actimundi Creative Agency | Agencia creativa transmedia |
| Summa Branding | summa.es | Summa Branding | Branding Agency |
| Windup Business | windup.es | Windup: Agencia Marketing Digital y Formación en Málaga |

**Esto es el mismo error que mató el canal de LinkedIn.** Ayer encontramos 4 competidores en
la lista de HeyReach (Marton Partners, Glocally, Sincrolab, Persuadis). Hoy aparecen 20 en la
lista de Apollo. Dos fuentes distintas, el mismo fallo: **la consulta de origen no excluye
agencias.** No es una lista mala, es una definición de objetivo mala.

### 2. Treinta y nueve de los 133 ya estaban en Smartlead

El 29% de una lista etiquetada como «nuevos» ya había recibido correo nuestro. Entre ellos
ie.edu y bse.eu, que **ayer mismo pausé por ser demasiado grandes** y hoy han vuelto a entrar
por la puerta de delante. El pull de Apollo no deduplica contra Smartlead ni contra lo que ya
he descartado.

### 3. Retiro un filtro propio que era un falso positivo

Marqué 39 leads como «dominio cruzado» comparando el dominio del email contra el campo
`dominio` de Apollo. Sondeé los 39 dominios de email: **36 son la misma empresa en otro TLD o
en el dominio del grupo** (`grupo360rh.com` / `360rrhh.com`, `robotnik.es` / `robotnik.eu`).
Si hubiera aplicado ese filtro habría tirado 36 leads buenos. Solo FeaturIT era otra entidad
de verdad (el email es de LambdaLoopers).

Dos avisos de método del mismo día:
- La sonda usó el campo `dominio` de Apollo, no el del email. En 39 casos miré la web
  equivocada hasta que lo corregí.
- Seis dominios devuelven **202** y uno **403**: eso es un WAF bloqueando la sonda, **no**
  «no tienen web». Ninguno se descarta por eso.

## A · 13 leads

Encaje de servicios o formación, 5-50 personas, cargo que decide, y al menos una etiqueta de
medición activa en su web (prueba de que gastan en captación hoy).

| Empresa | Cargo | Pers. | Ciudad | Por qué | Hecho verificado |
|---|---|---|---|---|---|
| Worldwide Recruitment Energy | Managing Partner / Execu | 16 | Madrid | reclutamiento para transicion energetica, 16p, GTM+GA4, Managing Partner | web wrenergy.eu responde 200; detectado GTM, GA4; 0 formularios; titulo: "Agencia de reclutamiento | WRE" |
| The Key Talent | Founder & Managing Direc | 29 | Madrid | consultora de evaluacion de talento, 29p, servicios puros, Founder & MD | web thekeytalent.org responde 200; detectado GA4; 0 formularios; titulo: "The Key Talent — Más poder para las personas" |
| Netun Solutions, S.L. | CFO | 27 | Vigo | balizas V16, 27p, GTM + etiqueta de Google Ads activa: gastan en captacion hoy | web netun.com responde 200; detectado GTM, Google Ads; 6 formularios; titulo: "Balizas V16 conectadas | Help Flash IoT | Tecnología para salvar vidas" |
| Hanaley | CEO & co-Founder | 30 | Barcelona | viajes a medida de ticket alto, 30p, GTM, CEO cofundador | web hanaleytravel.com responde 200; detectado GTM; 1 formularios; titulo: "Viajes a medida exclusivos por el mundo | HanaleyTravel" |
| Secur0 | Co-Founder | 22 | Madrid | ciberseguridad como servicio, 22p, GTM, 3 formularios | web secur0.com responde 200; detectado GTM; 3 formularios; titulo: "Bug Bounty y Pentesting | Seguridad para Empresas | Secur0" |
| Mairu | CEO | 29 | Bilbao | software de procesos industriales, 29p, GA4 + Google Ads activo | web mairu.digital responde 200; detectado GA4, Google Ads; 2 formularios; titulo: "Software de gestión de procesos | Mairu" |
| Gastrouni | Director General | 13 | L'Altet | formacion HORECA, 13p, GTM + pixel de Meta: invierten en anuncios | web gastrouni.com responde 200; detectado GTM, pixel Meta; 3 formularios; titulo: "Gastrouni | Formación para restaurantes y F&B hotelero" |
| Startups Institute SL | Founder & CEO | 30 | Las Rozas | escuela de negocios para emprendedores, 30p, GTM+GA4 | web startupsinstitute.com responde 200; detectado GTM, GA4; 2 formularios; titulo: "Startups Institute. Formación práctica para crear nuevos negocios" |
| TREKFORM | Commercial Director | 43 | Cornella de  | formacion de carretillero y PRL, 43p, GTM+GA4+Meta: los tres montados | web trekform.com responde 200; detectado GTM, GA4, pixel Meta; 1 formularios; titulo: "Trekform - Curso de Carretillero, maquinaria y PRL" |
| ISEIE Innovation School | Chief CEO | 23 | Mislata | formacion universitaria online, 23p, GA4 + Google Ads activo | web iseie.com responde 200; detectado GA4, Google Ads; 4 formularios; titulo: "ISEIE Innovation School | Cursos, diplomados y más Online" |
| Dribo - La autoescuela online  | Chief Executive Officer | 38 | Barcelona | autoescuela digital con app, 38p, GTM, CEO; negocio de volumen que vive de captacion | web dribo.es responde 200; detectado GTM; 1 formularios; titulo: "Autoescuela Online: Carnet de conducir con Dribo a la 1ª" |
| Cima Corporate | Chief Revenue Officer (C | 17 | Badajoz | interim management, 17p, GTM+GA4+Meta; servicios de ticket alto a direccion general | web cimacorporate.com responde 200; detectado GTM, GA4, pixel Meta; 0 formularios; titulo: "Cima Corporate Interim Management- Impulsamos tu negocio" |
| Vecdis | Chief Executive Officer  | 30 | Madrid | consultoria de innovacion, 30p, GA4 + Google Ads activo | web vecdis.es responde 200; detectado GA4, Google Ads; 1 formularios; titulo: "Vecdis - Observatorio de Tendencias - Innovación Empresarial" |

## B · 16 leads

Encajan, pero con una puerta blanda. Van en segunda tanda, después de medir los A.

| Empresa | Cargo | Pers. | Ciudad | Por qué | Hecho verificado |
|---|---|---|---|---|---|
| Hierros Paco Reyes | CEO | 31 | Seville | distribucion de hierro, no servicios; pero 40 anos, B2B y GTM montado | web hierrospacoreyes.es responde 200; detectado GTM; 1 formularios; titulo: "Home HPR - Almacén de Hierros Sevilla" |
| Permisso | CEO & Co-founder | 35 | Barcelona | SaaS de onboarding/KYC, 35p, GTM. Producto, no servicios: ciclo distinto | web permisso.io responde 200; detectado GTM; 1 formularios; titulo: "Permisso" |
| AdjudicacionesTIC (TendersTool | Co-Fouder & CEO | 19 | Las Rozas de | SaaS de licitaciones, 19p, solo GA4 | web tenderstool.com responde 200; detectado GA4; 0 formularios; titulo: "TendersTool — Plataforma de Licitaciones y Datos TIC Sector Público - " |
| Wolly | CEO | 27 | Madrid | marketplace de reformas, 27p, GTM; financiado por VC, compra distinta | web wollyhome.com responde 200; detectado GTM; 0 formularios; titulo: "Wolly - Instalaciones, Reformas y Servicios para el Hogar en España" |
| Paradise | Co Founder & Chief Opera | 15 | Madrid | eventos y despedidas, 15p, B2C de alto volumen; solo GA4 | web paradise.es responde 200; detectado GA4; 0 formularios; titulo: "Paradise - Despedidas, Catering, Eventos de Empresa, Bodas y Celebraci" |
| Blu Selection - Recruitment Ag | Partner & Chief Revenue  | 27 | Barcelona | agencia de reclutamiento, 27p, GTM+GA4+Meta+Ads: gastan de verdad. No competidor nuestro | web bluselection.com responde 200; detectado GTM, GA4, pixel Meta, Google Ads; 0 formularios; titulo: "Blu Recruitment Agency · Blu Selection" |
| Vilalta Studio | Managing Director | 22 | Barcelona | estudio de arquitectura, 22p, etiqueta de Google Ads; proyecto a medida de ticket alto | web vilalta.studio responde 200; detectado Google Ads; 0 formularios; titulo: "Vilalta Studio | We Design Places That Belong" |
| Knox Media Hub | Chief Sales Officer (CSO | 15 | Alicante | SaaS de gestion de activos de medios, 15p, GTM+GA4; comprador internacional | web knoxmediahub.com responde 200; detectado GTM, GA4; 1 formularios; titulo: "Knox Media Hub — Manage your media across the supply chain" |
| Grupo International Formation  | Director General | 18 | Madrid | centro de formacion en idiomas, 18p, sin instrumentacion visible | web ifcenter.es responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "International Formation Center | Formación personalizada |
| Frogames | CEO | 11 | Palma | cursos online de programacion, 11p, GTM; ticket bajo | web frogamesformacion.com responde 200; detectado GTM; 1 formularios; titulo: "Frogames Formación: cursos de programación en español" |
| TYC GIS | CEO | 28 | Madrid | formacion GIS, 28p, solo GA4 | web tycgis.com responde 200; detectado GA4; 3 formularios; titulo: "TYC GIS – GIS, Teledetección y Drones – Soluciones con GIS, Teledetecc" |
| Aula Siena Educación | Commercial Director | 13 | Madrid | formacion para profesorado, 13p, GTM+GA4+Ads; ticket y volumen pequenos | web aulasiena.com responde 200; detectado GTM, GA4, Google Ads; 2 formularios; titulo: "Aula Siena - Formación para profesionales de la enseñanza" |
| INADHOC | CEO y Director Comercial | 25 | Barcelona | consultoria, 25p, GTM+GA4 | web inadhoc.com responde 200; detectado GTM, GA4; 2 formularios; titulo: "INADHOC - Innovación - Colaboración - Productividad - Bienestar" |
| Globalzia | Director General - CEO & | 20 | Cordoba | obra civil e ingenieria, 20p, GA4; comprador por licitacion | web globalzia.es responde 200; detectado GA4; 2 formularios; titulo: "Globalzia: Obra Civil, Energía y Telecomunicaciones" |
| Comet Global Innovation | Socio Fundador CEO y Dir | 12 | Tiana | consultoria de financiacion de I+D+i, 12p, GA4 | web comet.technology responde 200; detectado GA4; 1 formularios; titulo: "From IDEA to MARKET | Comet Global Innovation" |
| PESA Medioambiente, S.A.U. | Director General-CEO | 12 | Madrid | tratamiento de aguas, 12p, etiqueta de Ads; nicho industrial | web pesa-ma.com responde 200; detectado Google Ads; 2 formularios; titulo: "PESA MA – Tratamiento de aguas rentable" |

## C · 24 leads

No los descarto, pero no se cargan sin verificación manual: o no tienen ninguna etiqueta de
medición (no sé si invierten en captación), o están fuera de la banda 5-50, o su web bloquea
la sonda, o no se entiende qué venden.

| Empresa | Cargo | Pers. | Ciudad | Por qué | Hecho verificado |
|---|---|---|---|---|---|
| 360 Recursos Humanos | Board Member | 81 | Barcelona | 81 empleados, por encima de la banda 5-50; consultora RRHH independiente | web 360rrhh.com responde 200; detectado GTM; 0 formularios; titulo: "Grupo 360 | Asesoramiento global en soluciones de RRHH" |
| Grup Essentia | Socio Fundador - Directo | 30 | Barcelona | sin instrumentacion detectada y la web del email no responde: no puedo verificar gasto en captacion | web grupessentia.com responde 500; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| PREVITALIA | CEO | 15 | Gijon | 15p encaja, pero cero instrumentacion: ninguna senal de que inviertan en captacion | web previtalia.net responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "Soluciones para la prevención de riesgos laborales |  |
| PRV Prevención | Owner | 28 | Malaga | 28p encaja; sin instrumentacion. El email es del grupo matriz (Dabo), no de PRV | web prvprevencion.com responde 200; ninguna etiqueta de medicion detectada; 2 formularios; titulo: "PRV Prevención - Prevención de Riesgos Laborales - |
| Robotnik Automation | CEO | 55 | Paterna | 55p, roza la banda por arriba; robotica industrial, ciclo de venta largo | web robotnik.eu responde 200; detectado GTM; 2 formularios; titulo: "Mobile Robotics Solutions | Autonomous Mobile Robots | Robotnik" |
| Triskell Software | CEO | 51 | Madrid | 51p, software PPM enterprise; comprador corporativo, no dueno | web triskellsoftware.com responde 200; detectado GTM; 0 formularios; titulo: "Enterprise Portfolio Management software - Triskell Software" |
| TALVION | CEO | 28 | Valencia | 28p, GTM+GA4, pero no se entiende que venden ("Rethink Value", holding de inversion) | web talvion.com responde 200; detectado GTM, GA4; 1 formularios; titulo: "Inicio - Talvion" |
| Developair Technologies | Chief Sales Officer (CSO | 17 | San Sebastia | 17p encaja; cero instrumentacion y venden a ingenieria de software critico | web developair.tech responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "Developair | AI-Based Verification and Validation fo |
| CeGe Global | Chairman | 79 | Barcelona | 79 empleados, fuera de banda; artes graficas | web cegeglobal.com responde 202; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| Gridfy | Co-Founder & CEO | 11 | Granada | 11p, sin instrumentacion; digitalizacion de redes electricas, comprador utility | web gridfy.es responde 404; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| Neurologyca Science & Marketin | CEO | 25 | Madrid | 25p, sin instrumentacion; venden "capa de contexto humano para IA", comprador indefinido | web neurologyca.com responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "Neurologyca" |
| Formatelia | CEO | 11 | Madrid | 11p, centro de formacion; cero instrumentacion | web formatelia.com responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "Cursos Online y Formación para Empresas | Formatelia" |
| Lacunza - ih San Sebastian | Director Comercial y de  | 75 | San Sebastia | 75 empleados, fuera de banda; escuela de idiomas | web lacunza.es responde 200; detectado GTM, GA4; 0 formularios; titulo: "Cursos de inglés y francés | Lacunza" |
| Tetuan Valley | CEO | 46 | Gijon | 46p; es una aceleradora/hub, no se si compra captacion | web tetuanvalley.com responde 200; detectado GTM, GA4; 0 formularios; titulo: "Tetuan Valley - Innovation HUB - Tetuan Valley -" |
| Cybertix Simulation Technologi | CEO | 16 | Vitoria-Gast | 16p, ciberseguridad; sin instrumentacion | web cybertix.tech responde 200; ninguna etiqueta de medicion detectada; 1 formularios; titulo: "Cybertix — Empresa de ciberseguridad en Euskadi | OT/I |
| Clicollege | Director General | 13 | Madrid | 13p; la web bloquea la sonda con 202, no puedo verificar nada | web clicollege.org responde 202; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| IEF - Institut d'Estudis Finan | Director General | 81 | Barcelona | 81 empleados; instituto financiero con patronato bancario | web iefweb.org responde 200; detectado GTM, Google Ads; 3 formularios; titulo: "Instituto de Estudios Financieros - Líder en conocimiento financiero" |
| Grup CIEF | Commercial Director | 94 | Barcelona | 94 empleados | web grupcief.com responde 200; detectado GTM; 0 formularios; titulo: "WebCief2026" |
| Hack by Security | Commercial Director | 18 | Malaga | 18p, formacion en ciberseguridad; sin instrumentacion | web hackbysecurity.com responde 200; ninguna etiqueta de medicion detectada; 1 formularios; titulo: "Ciberseguridad con Hack By Security" |
| IDELAB Ingeniería SL | Director General - CEO | 15 | Valencia | 15p, ingenieria de seguridad industrial; sin instrumentacion | web idelabingenieria.com responde 200; ninguna etiqueta de medicion detectada; 1 formularios; titulo: "INGENIERÍA Y CONSULTORÍA - IDELAB INGENIERÍA" |
| Agem Consultores y Auditores | Director General (CEO) | 19 | San Sebastia | 19p, auditoria; la web no resuelve | web agem.es responde 000; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| Excem Technologies | Chief Revenue Officer (C | 53 | Madrid | 53p, defensa y ciberseguridad; comprador publico | web excemtech.com responde 200; detectado GTM; 1 formularios; titulo: "Seguridad, telecomunicaciones e inteligencia | Excem Technologies" |
| Recodme | Business Development Dir | 49 | Madrid | 49p, tecnologia; la web no dice que venden ni tiene instrumentacion | web recodme.es responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "RECODME_ Bienvenidos" |
| ISCAL – Instrumentación y Serv | CEO y Director Comercial | 51 | Gijon | 51p, calibracion industrial; sin instrumentacion | web iscal.net responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "Iscal :: Instrumentación y Servicios de Calibración - ISCA |

## Fuera · 31 leads

| Empresa | Cargo | Pers. | Ciudad | Por qué | Hecho verificado |
|---|---|---|---|---|---|
| RCR Industrial Flooring | Chief Operating Officer | 97 | Boadilla del | 97 empleados y el dominio Apollo es rinolbolivia.com (Bolivia) | web rinolbolivia.com responde 000; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| GCN Group | CEO and Co-Founder | 98 | Sant Cugat d | 98 empleados y la web devuelve 503: no verificable | web gcngroup.org responde 503; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| WeRise | Chief Commercial Officer | 16 | Barcelona | COMPETIDOR DIRECTO: "Agencia de crecimiento con IA" es literalmente nuestra propia frase | web werise.es responde 200; detectado GTM, pixel Meta; 0 formularios; titulo: "WeRise® — Agencia de crecimiento con IA" |
| FeaturIT | Chief Executive Officer | 3 | Barcelona | 3 empleados (suelo 5) y el email es de LambdaLoopers, otra entidad | web featurit.com responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "FeaturIT — Feature flags + event tracking" |
| Proyectos y Seguros S.A. | Director de Operaciones  | 110 | Madrid | 110 empleados | web proyectosyseguros.com responde 000; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| Altostratus | Part of Telefóni | COO | 140 | Barcelona | 140 empleados y es parte de Telefonica Tech: no hay dueno que decida | web altostratus.es responde 200; detectado GA4; 0 formularios; titulo: "Telefónica Tech | Leading NextGen Solutions Provider" |
| ALCALINK E-COMMERCE PrestaShop | CEO | Socio Fundador en  | 44 | Murcia | COMPETIDOR DIRECTO: agencia de marketing y automatizacion | web alcalink.com responde 200; detectado GTM, pixel Meta, Google Ads; 1 formularios; titulo: "Alcalink Agencia De Marketing Digital 360 Prestashop Exp |
| Media Power | Chief Sales Officer (CSO | 77 | Madrid | COMPETIDOR DIRECTO: agencia de marketing digital, 77p | web themediapower.com responde 200; detectado GTM; 0 formularios; titulo: "Media Power | Agencia de Marketing Digital en Madrid" |
| SEOCOM.Agency | Founder & CEO | 42 | Barcelona | COMPETIDOR DIRECTO: agencia SEO con 30 personas y 500 proyectos | web seocom.agency responde 200; detectado GTM, GA4; 1 formularios; titulo: "Agencia SEO y GEO en España desde 2008 | SEOCOM" |
| Roas Hunter | Chief Revenue Officer (C | 24 | Madrid | COMPETIDOR DIRECTO: agencia de marketing digital 360 | web roashunter.com responde 200; detectado GTM, GA4, pixel Meta, Google Ads; 0 formularios; titulo: "Roas Hunter | Agencia De Marketing Digital" |
| LeadPro Agency | Director General | Estra | 6 | Barcelona | COMPETIDOR DIRECTO: el nombre es LeadPro Agency | web leadproagency.com responde 202; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "" |
| Inka Marketing Estratégico 360 | CEO and Founder | 18 | Madrid | COMPETIDOR DIRECTO: agencia de captacion, conversion y fidelizacion | web inkamarketing.es responde 200; detectado GTM; 1 formularios; titulo: "Agencia de Marketing Digital en Madrid | Inka Marketing" |
| LIN3S ≡ Digital Consulting | Head of CRO & Online Exp | 92 | Barcelona | COMPETIDOR DIRECTO: consultora digital de "Generacion de Demanda", 92p | web lin3s.com responde 200; detectado GTM, Google Ads; 0 formularios; titulo: "Consultora de negocio digital | LIN3S" |
| ADG Media Group | Chief Strategy Officer | 64 | Alcobendas | COMPETIDOR DIRECTO: holding de publicidad y AdTech | web adgmediagroup.es responde 200; detectado GTM; 1 formularios; titulo: "ADG Media Group — Growth Partner, AdTech, Data & Branded Content" |
| Brutal Media | Grupo BBC Studi | CEO | 100 | Barcelona | 100 empleados y es parte de BBC Studios | web brutalmedia.tv responde 200; detectado GA4; 0 formularios; titulo: "Home | BrutalmediaTV" |
| Why Ads Media - Digital Consul | ⚡️ Co Founder | 23 | Madrid | COMPETIDOR DIRECTO: consultora de SEO, SEM y marketing automation | web whyadsmedia.com responde 200; detectado GTM; 0 formularios; titulo: "Consultora digital | Soluciones de marketing 360º - Why Ads Media" |
| E-com Growth Partners | Founder & CEO | 120 | Madrid | COMPETIDOR DIRECTO y 120p; ademas vende "gana 5-10k al mes", infoproducto | web ecomgrowthpartners.com responde 200; detectado GTM, GA4, Google Ads; 1 formularios; titulo: "E-com Growth Partners" |
| Asiri Marketing | CEO y Co-founder | 15 | Madrid | COMPETIDOR DIRECTO: agencia de marketing digital para turismo | web asiri.es responde 200; detectado GTM, Google Ads; 2 formularios; titulo: "Agencia de Marketing Digital Especializada en Turismo" |
| Agencia Nous | CEO en Agencia Nous | 14 | Madrid | COMPETIDOR DIRECTO: agencia de marketing digital en Madrid | web agencianous.com responde 200; detectado GTM; 2 formularios; titulo: "Agencia de marketing digital en Madrid | Agencia Nous" |
| Snowball | CEO & Founder | 12 | Barcelona | COMPETIDOR DIRECTO: consultora de growth marketing | web agenciasnowball.com responde 200; detectado GTM; 3 formularios; titulo: "Consultora Growth Marketing | Snowball" |
| Agencia Seoinnova | CEO | 12 | Alicante | COMPETIDOR DIRECTO: agencia SEO | web seoinnova.es responde 200; detectado GTM, GA4; 4 formularios; titulo: "Agencia SEO en Alicante | SEOInnova | Posicionamiento Web" |
|  |  | ? | Seville | registro roto: sin empresa, sin cargo, sin empleados | web digittal.es responde 200; ninguna etiqueta de medicion detectada; 3 formularios; titulo: "Digittal | Desarrollo de Software e Inteligencia Artific |
| MARCO | Founder and Executive Ch | 97 | Madrid | COMPETIDOR: Marco es agencia de comunicacion y marketing, 97p | web marco.agency responde 200; ninguna etiqueta de medicion detectada; 0 formularios; titulo: "Marco Agency - MARCO" |
| Marketalia Marketing Online | Head of SEO & CRO | 32 | Madrid | COMPETIDOR DIRECTO: Marketalia, marketing online | web marketalia.com responde 200; detectado GTM; 0 formularios; titulo: "Marketalia Marketing Online | Agencia Digital Premium" |
| Actimundi - Creative Agency | CEO | 53 | Barcelona | COMPETIDOR: agencia creativa transmedia, 53p | web actimundi.com responde 200; detectado GA4; 0 formularios; titulo: "Actimundi Creative Agency | Agencia creativa transmedia" |
| Summa Branding | CEO & Partner. Brand and | 77 | Barcelona | COMPETIDOR: agencia y consultora de branding, 77p | web summa.es responde 200; ninguna etiqueta de medicion detectada; 2 formularios; titulo: "Summa Branding | Branding Agency" |
| Barcelona Institute of Science | Director General (CEO) | 29 | Barcelona | centro de investigacion de siete institutos catalanes: financiacion publica, no compra captacion | web bist.eu responde 200; detectado GTM, Google Ads; 1 formularios; titulo: "Barcelona Institute of Science and Technology – BIST – Barcelona Insti" |
| Windup Business | Chief Executive Officer | 32 | Malaga | COMPETIDOR DIRECTO: Windup es agencia de marketing digital (y escuela) | web windup.es responde 200; detectado GTM; 0 formularios; titulo: "Windup: Agencia Marketing Digital y Formación en Málaga" |
| Mundo Posgrado | Commercial Director | 11 | Madrid | Mundo Posgrado vende leads a escuelas: es proveedor de lo que nosotros vendemos | web mundoposgrado.com responde 200; detectado GTM, pixel Meta; 4 formularios; titulo: "Mundo Posgrado ▷ Orientación y Asesoría Académica Efectiva" |
| EBIS Business Techschool | Director General | 140 | Las Palmas d | 140 empleados | web ebiseducation.com responde 200; detectado GTM, pixel Meta; 2 formularios; titulo: "EBIS Business Techschool" |
| QATRO | Director General - CEO | 110 | A Coruna | 110 empleados | web qatrogroup.com responde 200; ninguna etiqueta de medicion detectada; 1 formularios; titulo: "Qatro Group – Energía que impulsa tu industria. Preci |

## Los 49 que caen antes de clasificar

| Empresa | Dominio | Motivo |
|---|---|---|
| Fiction Express Education | fictionexpress.com | EMAIL-YA-ENVIADO |
| Newlink Spain | newlinkspain.com | TAMANO-160p |
| Becolve Digital | AVEVA Select Iberia | becolve.com | TAMANO-160p |
| Vestel Ingenieros | vestelingenieros.com | TAMANO-200p |
| ESNECA Business School | esneca.com | EMAIL-YA-ENVIADO |
| Hazerta Formación | cursoshazerta.es | EMAIL-YA-ENVIADO |
| Galicia Business School | galiciabusinessschool.es | EMAIL-YA-ENVIADO |
| ITAérea Aeronautical Business School | itaerea.es | EMAIL-YA-ENVIADO |
| EIG Education | esgerencia.com | EMAIL-YA-ENVIADO, TAMANO-160p |
| CESMA Business School (Madrid) | cesma.es | EMAIL-YA-ENVIADO |
| Liceo de Farmacia | liceodefarmacia.com | EMAIL-YA-ENVIADO |
| Elev8 School | elev8.school | EMAIL-YA-ENVIADO |
| Tutellus | tutellus.com | EMAIL-YA-ENVIADO |
| Docencia Online | docencia-online.com | EMAIL-YA-ENVIADO |
| Universidad de las Hespérides | hesperides.edu.es | EMAIL-YA-ENVIADO |
| Namencis Education | namenciseducation.com | EMAIL-YA-ENVIADO |
| Traders Business School | tradersbusinessschool.com | EMAIL-YA-ENVIADO |
| target business school | target.edu.es | EMAIL-YA-ENVIADO |
| IDEP BARCELONA Escuela Superior de Ima | idep.es | EMAIL-YA-ENVIADO |
| Escuela Internacional de Protocolo y E | protocolo.com | EMAIL-YA-ENVIADO |
| Hispania Education | hispania-valencia.com | EMAIL-YA-ENVIADO |
| Didascalia Educational Group | didascalia.es | EMAIL-YA-ENVIADO |
| Academia Industrial by Orbelgrupo | academiaindustrial.com | EMAIL-YA-ENVIADO |
| FORST Tourism Business School | forst.es | EMAIL-YA-ENVIADO |
| Summit Business School | summitbusinessschool.com | EMAIL-YA-ENVIADO |
| Cumbres School Valencia | cumbresschool.es | EMAIL-YA-ENVIADO |
| CEDEU Centro de Estudios Universitario | cedeu.es | EMAIL-YA-ENVIADO |
| EUNCET | euncet.com | TAMANO-200p |
| EALDE Business School | ealde.es | EMAIL-YA-ENVIADO |
| tekman education | tekmaneducation.com | EMAIL-YA-ENVIADO |
| Penta Learning | pentalearning.com | EMAIL-YA-ENVIADO |
| The Lemon Tree Education | tlteducation.com | EMAIL-YA-ENVIADO |
| InOrbis School | inorbis.school | EMAIL-YA-ENVIADO |
| GDOCE | gdoceformacion.es | TAMANO-170p |
| IMEFOR- Instituto de Metodologías Form | institutoimefor.com | EMAIL-YA-ENVIADO |
| Barcelona School of Economics | bse.eu | EMAIL-YA-ENVIADO, TAMANO-160p |
| MBIT School | mbitschool.com | EMAIL-YA-ENVIADO |
| IE School of Politics, Economics & Glo | ie.edu | EMAIL-YA-ENVIADO, DUPLICADO-INTERNO-x2 |
| NEOLAND | neoland.es | EMAIL-YA-ENVIADO, DUPLICADO-INTERNO-x2 |
| FARO Educación | faroeducacion.com | EMAIL-YA-ENVIADO |
| Expanish - Cultural Immersion Programs | expanish.com | EMAIL-YA-ENVIADO |
| NEOLAND | neoland.es | DOMINIO-YA-TOCADO, DUPLICADO-INTERNO-x2 |
| MRC International People Training | mrctraining.com | EMAIL-YA-ENVIADO |
| Instituto Marítimo Español, IME | ime.es | EMAIL-YA-ENVIADO |
| Imagine Montessori School | imaginemontessori.es | EMAIL-YA-ENVIADO |
| IE Foundation | ie.edu | DOMINIO-YA-TOCADO, DUPLICADO-INTERNO-x2 |

## Lo que pido

1. **Ok para cargar los 13 A.** Con `body2` y `body3` rellenos lead a lead desde el primer
   minuto: la secuencia de Smartlead es una carcasa vacía y un lead sin `body2` recibe un
   correo en blanco el día 3. Ayer casi pasó con 39.
2. **Nada.** El filtro aguas arriba ya está escrito: `captacion/scripts/prefiltro_leads.py`.
   Es obligatorio antes de cualquier carga a partir de hoy.
3. Los B y C **no se tocan** hasta que los 13 A tengan 100 envíos y una tasa medida.

## Lo que no sé

- Si los 13 A invierten **500 €/mes o más** en captación, que es el suelo del ICP oficial. La
  etiqueta de Google Ads prueba que la etiqueta está puesta, no cuánto gastan. No es
  verificable desde fuera y no lo voy a estimar.
- Si el segmento de formación compra o solo reserva. Sigue abierto desde el 29-sep y es la
  tensión de ICP sin resolver: 6 de los 13 A son formación.

## El arreglo, con su control

`captacion/scripts/prefiltro_leads.py`. Cruza contra todos los emails que ya existen en
Smartlead, aplica la lista negra de clientes, los buzones de rol, la banda 5-50, los
duplicados internos y el patrón de competidor.

Lo controlé contra estos mismos 133:

| Versión | Competidores cazados | Falsos positivos | Clase A que mataría |
|---|---|---|---|
| Solo el nombre de la empresa | 17 de 20 | 1 (Blu Selection) | 0 |
| Nombre + texto de su propia web | **20 de 20** | **0** | **0** |

La primera versión se le escapaban WeRise, Snowball y Windup: **su nombre no dice que sean
agencias, solo su web lo dice.** Por eso el filtro lee el texto sondeado, y si un lead llega
sin sondear lo avisa en voz alta en vez de dar un falso limpio.

El falso positivo fue Blu Selection, agencia de *reclutamiento*. Lleva «Agency» en el nombre y
no es competencia nuestra. Añadida una lista de agencias que no compiten con nosotros
(reclutamiento, selección, talento, eventos, viajes, seguros, inmobiliaria).

**Lo que el prefiltro no hace, y no debe hacer:** decidir el encaje de sector. Eso lo miro yo
sobre los que sobreviven. El prefiltro solo garantiza que no vuelva a escribir a alguien a
quien ya escribimos, ni a un competidor.
