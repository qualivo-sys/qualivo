# Encargo de Creative Performance para el agente de Growth · test de dolor en formación y clínicas

30-sep-2026. Escrito por el agente Creative Performance.

**Autoriza Maikel (30-sep):**
- «se lo puedes pasar a growth para que lo monte porfa, la campaña actual que la deje. y que monte dos campañas o conjuntos lo que el decida con los anuncios para clinicas y para formacion»
- Antes: «no pongas 30 euros al día. Yo pondría de momento 15 o 20, que él lo decida».

## Resumen

- Seis anuncios nuevos, tres por sector.
- Van en **estructura nueva**. **La campaña actual se deja como está**: no se edita, no se pausa y no se duplica.
- Tú decides si son dos campañas o dos grupos de conjuntos.
- Se decide por **coste por lead A/B**, no por CPL.

## Qué hay que montar

Todos son vídeos 9:16 con la voz de David (ElevenLabs) y la música H (urbano, generada con ElevenLabs Music). Están en la rama `claude/qualivo-creative-performance`.

**Formación** (`produccion/video-anuncios/finales/s1-octubre/`):

| Nombre del anuncio en Meta | Archivo | Duración | Dolor |
|---|---|---|---|
| `S1_VEL_v2_9x16` | `S1_VEL_v2_9x16.mp4` | 39 s | Velocidad: contestar tarde |
| `S1_PLA_v2_9x16` | `S1_PLA_v2_9x16.mp4` | 41 s | Plantones: reservan y no vienen |
| `S1_CUR_v2_9x16` | `S1_CUR_v2_9x16.mp4` | 45 s | Curiosos: leads baratos que no se matriculan |

**Clínicas** (`produccion/video-anuncios/finales/clinicas-octubre/`):

| Nombre del anuncio en Meta | Archivo | Duración | Dolor |
|---|---|---|---|
| `CLI_VEL_v1_9x16` | `CLI_VEL_v1_9x16.mp4` | 47 s | Velocidad: el WhatsApp de recepción |
| `CLI_HUE_v1_9x16` | `CLI_HUE_v1_9x16.mp4` | 42 s | Huecos: la primera visita no viene |
| `CLI_PRI_v1_9x16` | `CLI_PRI_v1_9x16.mp4` | 48 s | Prioridad: el implante y la limpieza reciben la misma llamada |

**Guiones, hipótesis y criterio de decisión:**
- `content/agentes/creative-performance/2026-10-s1-test-creativo.md` (formación)
- `content/agentes/creative-performance/2026-10-clinicas-test-creativo.md` (clínicas)

## Cómo lo montaría yo (la decisión final es tuya)

1. **Dos campañas nuevas, una por sector:** `QV_TEST_DOLOR_FORMACION` y `QV_TEST_DOLOR_CLINICAS`.
   - Objetivo: clientes potenciales, con el formulario nativo del sector.
   - Separarlas deja leer cada sector limpio y evita que Meta mueva el dinero de uno a otro.
   - Si prefieres dos grupos de conjuntos dentro de una sola campaña, vale igual, pero **sin CBO**.
2. **Tres conjuntos idénticos por campaña, uno por anuncio,** con presupuesto por conjunto (ABO). Así cada creativo gasta lo mismo y la comparación es justa.
   - Misma segmentación y ubicaciones que el conjunto actual del sector, copiadas, no compartidas.
3. **Formulario:** el nativo actual de cada sector, el mismo en sus tres anuncios. Solo se enlaza; no se modifica.
4. **Botón:** «Más información».
5. **Nombre del anuncio exactamente** como en las tablas. Hace falta para cruzar cada lead con su creativo en el CRM.
6. **La campaña actual se deja como está.** Ni `QV_VERTICALES`, ni `QV_3VERTICALES`, ni el anuncio 02.

## Presupuesto: 15 o 20 €/día por conjunto (lo decides tú)

- **Ojo con el total.** Con 6 conjuntos son **90-120 €/día**, además de lo que ya corre. Si a Maikel le parece mucho, hay dos alternativas:
  - arrancar formación ya y clínicas cuando haya lectura de formación (viernes 9-oct);
  - o bajar a 10 €/día por conjunto en clínicas.
  - **Confírmale el total antes de activar.**
- **Lectura:** a los 150 € por anuncio o a los 10 días, lo que llegue antes. Si a los 7 días un anuncio dobla el coste por A/B del mejor de su sector, se puede parar antes.
- **Clínicas va más lenta:** su CPM es un 50 % más caro que el de formación (35,59 € frente a 23,93 € en la semana 38), así que traerá menos leads con el mismo dinero.

## Antes de activar (checklist)

- [ ] Maikel confirma el presupuesto total.
- [ ] Música: la H se generó con ElevenLabs Music en la cuenta de Maikel (plan Creator). Confirmar que el plan cubre el uso comercial en anuncios.
- [ ] El formulario de formación sigue diciendo «desde 750 €/mes», precio viejo. No lo cambies a mitad del test, pero díselo a Maikel.
- [ ] El nombre del anuncio llega al CRM en cada lead.
- [ ] Solapamiento: cada campaña nueva puja por el mismo público que el conjunto actual de su sector. **No toques la actual sin el ok de Maikel.**

## Copy de Meta

La descripción es la misma en los seis: «Diagnóstico gratuito · 30 minutos».

### Formación

**S1_VEL_v2**
- **Texto principal:** Te piden información de un curso a las 12:10. Contestáis a las 19:30. Para entonces, ya han hablado con otros dos centros. No se van por el precio. Se van porque otro contestó antes. Para centros de formación que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** No fue el precio. Llegaste tarde.

**S1_PLA_v2**
- **Texto principal:** Diez reservan la visita. Vienen cuatro. Y las otras seis ya las habías pagado: anuncio, formulario y llamada. Casi nunca es mala suerte: reservan a varios días vista y nadie vuelve a hablar con ellos hasta el día. Para centros de formación que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** Tu agenda llena. Tu aula, no.

**S1_CUR_v2**
- **Texto principal:** Leads a 5 €. Parece una ganga, hasta que les llamas: uno solo miraba, otro no puede pagarlo y otro no se acuerda de haberlo pedido. El lead barato que no se matricula es el más caro. Para centros de formación que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** El lead barato te sale carísimo.

### Clínicas

**CLI_VEL_v1**
- **Texto principal:** Una paciente escribe al WhatsApp de tu clínica a las 12:30 para pedir cita. Recepción tiene a tres personas delante. Le contestan a las 20:00, y para entonces ya tiene cita en otra clínica. Para clínicas que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** No fue el precio. Nadie le contestó.

**CLI_HUE_v1**
- **Texto principal:** Martes, 10:30. El gabinete, preparado. La primera visita no viene, no avisa y no coge el teléfono. Y ese hueco ya estaba pagado: el anuncio, la llamada y la hora del profesional. Casi nunca es mala suerte. Para clínicas que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** Ese hueco ya lo habías pagado.

**CLI_PRI_v1**
- **Texto principal:** El que quiere un implante y el que pregunta cuánto cuesta una limpieza reciben la misma llamada, por orden de llegada. No es que falte gente en recepción: es que nadie decide a quién se llama primero. Para clínicas que ya invierten en anuncios. Si todavía no inviertes, esto no es para ti.
- **Título:** No contrates a nadie más en recepción todavía.

## Qué necesito de vuelta, por anuncio

**De Meta (por anuncio, nunca por conjunto):**
- gasto, impresiones, CPM y frecuencia;
- reproducciones de 3 s / impresiones, y ThruPlay o 50 % / impresiones;
- CTR (aperturas del formulario / impresiones);
- envíos / aperturas del formulario;
- leads y CPL.

**Del CRM (por lead, con el nombre del anuncio):**
- nivel A/B/C/D del día de entrada;
- conversación;
- cita;
- si vino o no vino.

**Cuándo:** una semana después de activar, los datos de Meta; dos semanas después, las citas y las reuniones.

Escríbelo en `paid/devoluciones/` o en el bus con tipo `montaje-s1`. Lo cruzo en `content/agentes/creative-performance/memoria-creativa.md`, en la tabla «Resultados por creativo».

## Qué NO se hace en este encargo

- No se toca la campaña actual, ni siquiera el anuncio 02, aunque sugiera respuesta de madrugada. Queda como decisión de Maikel.
- No se sube «Las fugas» ni nada de `finales/anuncios-30sep/`, que llevan promesas falsas.
