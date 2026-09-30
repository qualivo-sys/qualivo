# Encargo de Creative Performance para el agente de Growth · test de dolor en formación

30-sep-2026. Escrito por el agente Creative Performance.

**Autoriza Maikel:** «Pásale el encargo con todo a él y dile cómo lo montaría, pero no pongas 30 euros al día. Yo pondría de momento 15 o 20, que él lo decida». Antes: «probemos con la F, adaptalos todos con esa musica y después pasaselo a al agente de paid o de growth que lo monten sobre todo en algo nuevo que no afecte a lo que ya tenemos».

## Qué hay que montar

Tres anuncios de vídeo 9:16, listos, con la voz de Javier y la música F:

| Nombre del anuncio en Meta | Archivo | Duración | Dolor |
|---|---|---|---|
| `S1_VEL_v2_9x16` | `produccion/video-anuncios/finales/s1-octubre/S1_VEL_v2_9x16.mp4` | 41 s | Velocidad |
| `S1_PLA_v2_9x16` | `produccion/video-anuncios/finales/s1-octubre/S1_PLA_v2_9x16.mp4` | 34 s | Plantones |
| `S1_CUR_v2_9x16` | `produccion/video-anuncios/finales/s1-octubre/S1_CUR_v2_9x16.mp4` | 41 s | Curiosos |

Guiones, hipótesis y criterio de decisión: `content/agentes/creative-performance/2026-10-s1-test-creativo.md`.

## Cómo montarlo sin tocar lo que ya corre

1. **Campaña nueva y separada**, por ejemplo `QV_S1_TEST_DOLOR_FORMACION`.
   - Objetivo: clientes potenciales, con el formulario nativo.
   - **No se edita, pausa ni duplica nada** de las campañas actuales (`QV_VERTICALES`, `QV_3VERTICALES` ni el anuncio 02).
2. **Tres conjuntos de anuncios idénticos, uno por anuncio**, con presupuesto por conjunto (sin CBO). Así cada creativo gasta lo mismo y la comparación es limpia.
   - Misma audiencia que el conjunto actual de formación: la misma segmentación, copiada, no compartida.
   - Mismas ubicaciones.
3. **Formulario:** el nativo de formación que ya se usa, el mismo en los tres. Solo se enlaza; no se modifica.
4. **Botón:** «Más información».
5. **Nombre del anuncio exactamente** como en la tabla. Growth lo necesita para cruzar cada lead con su creativo.

## Presupuesto: 15 o 20 €/día por conjunto (lo decide Growth)

- **Maikel (30-sep):** «no pongas 30 euros al día. Yo pondría de momento 15 o 20, que él lo decida». La cifra la eliges tú dentro de ese margen.
- **Qué implica cada una:**
  - A 15 €/día, llegar a 150 € por anuncio lleva unos 10 días.
  - A 20 €/día, unos 7,5 días.
- **Lectura:** a los 150 € por anuncio o a los 10 días, lo que llegue antes. Si a los 7 días hay un anuncio claramente peor (el doble de coste por A/B), se puede parar antes.
- **Arranque:** el lunes 5-oct, o cuando esté montado.

## Antes de activar (checklist)

- [ ] Licencia de la música F comprobada. Sale del catálogo de HeyGen (Astral Generated Music, id `25be1b745a6343058755d7ca88ef79d9`) y la licencia para anuncios de pago **no está comprobada**. Si no se puede usar, se remonta con otra en un minuto.
- [ ] El formulario sigue diciendo «desde 750 €/mes», precio viejo. No lo cambies en esta campaña: si cambia a mitad del test, se estropea la lectura. Díselo a Maikel igualmente.
- [ ] Growth confirma que el nombre del anuncio llega al CRM en cada lead.
- [ ] Solapamiento: la audiencia es la misma que la del conjunto actual de formación. Las dos campañas pujarán por la misma gente. Si Maikel prefiere evitarlo, hay que decidir si el conjunto actual baja mientras dura el test. **No lo toques sin su ok.**

## Copy de Meta

La descripción es la misma en los tres: «Diagnóstico gratuito · 30 minutos».

**S1_VEL_v2**
- **Texto principal:** Te piden información de un curso a las 12:10. Contestáis a las 19:30. Para entonces, ya han hablado con otros dos centros. No se van por el precio. Se van porque otro contestó antes. Para centros de formación que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** No fue el precio. Llegaste tarde.

**S1_PLA_v2**
- **Texto principal:** Diez reservan la visita. Vienen cuatro. Y las otras seis ya las habías pagado: anuncio, formulario y llamada. Casi nunca es mala suerte: reservan a varios días vista y nadie vuelve a hablar con ellos hasta el día. Para centros de formación que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** Tu agenda llena. Tu aula, no.

**S1_CUR_v2**
- **Texto principal:** Leads a 5 €. Parece una ganga, hasta que les llamas: uno solo miraba, otro no puede pagarlo y otro no se acuerda de haberlo pedido. El lead barato que no se matricula es el más caro. Para centros de formación que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** El lead barato te sale carísimo.

## Qué necesito de vuelta, por anuncio

**De Paid (API de Meta, por anuncio y nunca por conjunto):**
- gasto, impresiones, CPM y frecuencia;
- reproducciones de 3 s / impresiones, y ThruPlay o 50 % / impresiones;
- CTR (aperturas del formulario / impresiones);
- envíos / aperturas del formulario;
- leads y CPL.

**De Growth (CRM, por lead, con el nombre del anuncio):**
- nivel A/B/C/D del día de entrada;
- conversación;
- cita;
- si vino o no vino.

**Cuándo:**
- El viernes 9-oct, los datos de Meta.
- El viernes 16-oct, las citas y las reuniones.

Lo cruzo en `content/agentes/creative-performance/memoria-creativa.md`, en la tabla «Resultados por creativo».

## Qué NO se hace en este encargo

- No se pausa el anuncio 02, aunque sugiere respuesta de madrugada. Maikel ha pedido no tocar lo que ya corre. Queda como decisión suya.
- No se sube «Las fugas» ni los anuncios del 30-sep de `finales/anuncios-30sep/`, que llevan promesas falsas.
