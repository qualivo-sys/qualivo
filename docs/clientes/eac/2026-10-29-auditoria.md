# EAC · Auditoría de la caída de leads (19 al 29-oct-2026)

Encargo del Chief of Staff (29-oct). **Solo lectura**: no se ha tocado ninguna campaña, formulario, presupuesto, CRM ni automatización.
Leyenda: **[C]** = comprobado con la API en esta sesión · **[E]** = estimación o hipótesis.
No incluye datos personales de leads: solo recuentos.

Notas de método:
- La cuenta de Meta `act_10151404080652508` factura en **USD**, no en euros, y su zona horaria es America/Los_Angeles [C]. Las cifras de gasto van en $. El «~70 €/día» del encargo son en realidad unos 61-69 $/día [C].
- Los insights (gasto, impresiones y clics) van por día de Los Ángeles. Los envíos reales se han contado leyendo los propios formularios, por fecha UTC [C].
- Corte de datos: 29-oct, hacia las 16:00 UTC. El 29-oct es un día parcial.

## Accesos

| Acceso | Estado |
|---|---|
| `META_ADS_TOKEN` | ✅ Lee la cuenta de EAC (está compartida con el usuario de sistema de Qualivo) y da token de página, así que se pueden leer los envíos de cada formulario [C] |
| `N8N_API_KEY` / `N8N_BASE_URL` | ✅ [C] |
| Variables `EAC_*` | No existe ninguna [C] |
| **GHL de EAC** (location `5Eylu2xUj1SoQaQnfmF8`) | ❌ **Sin acceso.** `GHL_API_KEY` y `AM_GHL_API_KEY` devuelven 403 y `GHL_AGENCY_API_KEY` devuelve 401 [C]. El punto 3 se ha hecho de forma indirecta, con las ejecuciones de n8n. |
| Aperturas del formulario y tasa de finalización | ❌ **La API no las da.** Ninguna acción de insights de la cuenta devuelve aperturas de formulario [C]. Solo se ven en el Administrador de anuncios. |

## Lo esencial

1. **La causa principal de la caída es la pausa de `ad02 regis_video` en Clientes Potenciales (CP), no el formulario v3.** Ese anuncio solo traía **63 de los 68 envíos** de CP entre el 21 y el 26-oct, a unos **3,5 $ por lead** y con formulario New 2026 [C]. Se editó el 27-oct a las 09:34 UTC y se pausó a las 11:10 UTC [C]. Desde entonces CP depende de `ad02 regis`, que antes gastaba unos 2,1 $/día y ahora absorbe todo el presupuesto con un CTR que va de 0,70 a 0,20 % [C].
2. **El recorte de presupuesto amplifica el efecto.** CP pasó de 40 a 20 $/día y VIDEOS_TEST de 25 a 20 $/día, ambos el 27-oct a las 10:58 UTC [C]. El gasto total de la cuenta casi no baja (61-69 $/día) porque ese dinero se fue a campañas de landing y remarketing que se reactivaron el mismo día [C].
3. **El v3 convierte, pero a casi 3 veces el coste.** En VIDEOS_TEST, del 21 al 26-oct, 18 envíos por 173,8 $, es decir, **9,7 $ por lead**. CP con New 2026 salía a 3,5 $ por lead [C]. Comparar ambos tiene sesgo de audiencia y creatividad [E].
4. **La entrega no está rota.** Los conjuntos activos gastan su presupuesto completo y no hay anuncios rechazados en conjuntos activos [C]. Lo que se reinició es el aprendizaje de CP, que vuelve a estar en LEARNING con 1 conversión desde el cambio del 27-oct a las 09:34 UTC [C].
5. **El sincronizador de n8n estuvo caído unas 12 horas, del 26-oct a las 22:30 al 27-oct a las 10:45 UTC** (40 ejecuciones con error) [C]. La primera causa fue un teléfono con prefijo de país inválido, que bloqueó todo el lote. La segunda, un error de código durante el arreglo. **Por el pago fallido de n8n del 28-oct no hubo ningún hueco**: todas las ejecuciones del 28 y el 29 terminaron bien [C]. Que no se perdiera ningún lead es muy probable, porque cada pasada vuelve a leer los últimos 50 envíos [E].
6. **Citas a cero desde el 26-oct:** la explicación más probable es que el canal que generaba citas (New 2026 → integración nativa de GHL → workflows de GHL) dejó de recibir leads el 27-oct, y que los leads del v3 entran por API, que no dispara los workflows de GHL [E]. No se puede confirmar sin acceso a GHL.

## 1. Meta, día a día

### Cuenta completa (insights, día de Los Ángeles) [C]

| Día | Gasto $ | Impresiones | Leads (insights) |
|---|---|---|---|
| 19-oct | 64,09 | 22.508 | 16 |
| 20-oct | 64,23 | 17.000 | 10 |
| 21-oct | 72,25 | 16.385 | 12 |
| 22-oct | 82,63 | 17.043 | 15 |
| 23-oct | 77,99 | 16.184 | 15 |
| 24-oct | 79,10 | 16.785 | 19 |
| 25-oct | 86,94 | 22.939 | 14 |
| 26-oct | 65,95 | 15.841 | 12 |
| **27-oct** | 60,61 | 11.096 | 9 |
| **28-oct** | 68,86 | 13.233 | 2 |
| 29-oct (parcial) | 25,37 | 4.685 | 0 |

### Envíos reales por formulario y anuncio (leídos del formulario, fecha UTC) [C]

| Formulario · campaña · anuncio | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| New 2026 · CP · `ad02 regis_video` | 13 | 8 | 10 | 11 | 10 | 13 | 12 | 7 | **1** | 0 | 0 |
| New 2026 · CP · `ad02 regis` | – | – | 1 | 1 | 1 | – | – | 2 | 0 | 0 | 0 |
| New 2026 · VIDEOS_TEST · Vídeo A | 3 | – | – | – | – | – | – | – | – | – | – |
| v3 · CP · `ad02 regis` | – | – | – | – | – | – | – | – | 0 | **1** | 0 |
| v3 · VIDEOS_TEST · Vídeo A | – | 1 | 2 | 1 | 3 | 2 | 3 | 4 | 1 | 0 | 0 |
| v3 · VIDEOS_TEST · Vídeo B | – | – | – | – | – | 1 | – | – | – | – | – |
| v3 · VIDEOS_TEST · Objeciones | – | – | – | 1 | 1 | – | – | – | 1 | – | – |
| v3 · IMG_CUALIFICADO (pausada el 26-oct) | – | – | – | – | 1 | 1 | – | – | – | – | – |
| **Total** | 16 | 9 | 13 | 14 | 16 | 17 | 15 | 13 | **3** | **1** | **0** |

Totales desde el 17-oct: **New 2026, 127 envíos; v3, 27 envíos** [C]. El formulario New 2026 lleva 747 leads en toda su vida; el v3, 32 [C].

### CP · `[AD] Clientes Potenciales (Intereses)` › `[Ad] Conversión CP: Intereses Educación` [C]

| Día | Anuncio | Gasto $ | Impresiones | CTR % | CPM $ | Clics al enlace | Leads |
|---|---|---|---|---|---|---|---|
| 19 a 26-oct (media diaria) | `ad02 regis_video` (New 2026) | 37,6 | 11.060 | 1,35-1,97 | 2,85-4,02 | 147 | 10,5 |
| 19 a 26-oct (media diaria) | `ad02 regis` (New 2026) | 2,1 | 463 | 0-2,84 | 3,06-7,03 | 4,5 | 0,6 |
| 27-oct | `ad02 regis_video` (pausado a las 11:10 UTC) | 4,09 | 946 | 1,16 | 4,32 | 10 | 2 |
| 27-oct | `ad02 regis` (v3) | 12,63 | 3.268 | 0,70 | 3,86 | 16 | 1 |
| 28-oct | `ad02 regis` (v3) | 20,71 | 4.847 | 0,53 | 4,27 | 21 | 0 |
| 29-oct (parcial) | `ad02 regis` (v3) | 6,69 | 1.481 | 0,20 | 4,52 | 3 | 0 |

- Coste por lead del 21 al 26-oct: `regis_video`, 219,84 $ para 63 envíos, es decir, **3,49 $**; `regis`, 15,97 $ para 5 envíos, **3,19 $** [C].
- Coste por lead del 27 al 29-oct: 44,12 $ para 2 envíos, es decir, **22 $** [C].
- Ahora mismo los dos anuncios de CP apuntan al formulario v3, incluido el `regis_video` pausado [C]. Si se reactiva tal cual, sale con el v3, no con New 2026.
- Aprendizaje: **LEARNING**, 1 conversión, último cambio significativo el 27-oct a las 09:34 UTC [C]. El presupuesto de la campaña es de 20 $/día (antes, 40 $) [C].

### VIDEOS_TEST · `VIDEOS_TEST · Intereses Educación · BCN` (v3 desde el 19-oct) [C]

| Periodo | Gasto $ | Envíos v3 | Coste por lead | CTR del Vídeo A |
|---|---|---|---|---|
| 21 a 26-oct | 173,8 | 18 | 9,7 $ | 0,66-0,90 % |
| 27 a 29-oct (parcial) | 49,8 | 2 | 24,9 $ | 0,36 · 0,30 · 0,94 % |

- Aprendizaje: **FAIL** según la API a las 16:00 UTC del 29-oct, con 21 conversiones y último cambio significativo el 19-oct a las 15:45 UTC [C]. El diagnóstico parcial lo daba por superado el 29: aquí discrepan.
- Presupuesto: de 25 a 20 $/día el 27-oct [C].
- La caída del CTR del Vídeo A desde el 27-oct no se explica por ningún cambio en el propio conjunto. Puede ser solapamiento de subasta con CP, que desde ese día empuja `ad02 regis` sobre los mismos intereses de educación [E].

### Resto de campañas activas desde el 27-oct [C]

Se reactivaron AZAFATA_TIERRA_DCO (10 $/día), DESPACHADOR_DCO (6 $/día) y RMK_2026_09 (3 conjuntos, 1-3 $/día), y se creó EAC_TCP_CAT_PROSPECCIO_Oct26 (5 $/día, optimiza el evento LEAD del píxel y está en aprendizaje con 0 conversiones). Entre todas, del 27 al 29-oct suman unos 61 $ y 7 leads de web o formulario según insights. Estas campañas se llevan el gasto que antes iba a CP.

### Lo que cambió el 27-oct (registro de actividad, UTC) [C]

| Hora | Cambio |
|---|---|
| 09:34 | Se editan las creatividades de `ad02 regis` y `ad02 regis_video`, que pasan al formulario v3. Esto genera una creatividad nueva y reinicia el aprendizaje |
| 09:40 | Se reactivan AZAFATA_TIERRA y DESPACHADOR |
| 10:35-10:47 | Se edita y reactiva el remarketing |
| 10:44 | Se crea CAT_PROSPECCIO |
| 10:58 | Recortes de presupuesto: CP de 40 a 20, VIDEOS_TEST de 25 a 20, AZAFATA de 20 a 10, DESPACHADOR de 20 a 6, RMK de 4/4/4 a 3/1/1 y CAT de 10 a 5 ($/día) |
| 11:10 | **Pausa de `ad02 regis_video`** |

## 2. El sincronizador de n8n (`2xEgeV1Ix9ViTDG4`)

«EAC · Leads de Meta → GHL». Se ejecuta cada 15 minutos y solo vigila el formulario v3 (`1625782112285020`). New 2026 entra por la integración nativa de GHL [C].

| Tramo (UTC) | Ejecuciones | Estado |
|---|---|---|
| 25-oct a 26-oct 22:15 | 4 por hora | todas bien [C] |
| **26-oct 22:30 a 27-oct 07:00** | 4 por hora | **error**: «Invalid country calling code» en el alta de GHL. Un teléfono mal formado bloquea el lote entero [C] |
| 27-oct 07:00 a 10:45 | mezcla | errores intermitentes; a las 10:00, «ReferenceError: de is not defined» en el nodo de mapeo [C] |
| 27-oct 11:00 a 29-oct 16:00 | 4 por hora | **todas bien. Por el pago del 28-oct no hubo ningún hueco** [C] |

- En total, 40 ejecuciones con error en unas 12 horas [C]. El diagnóstico parcial hablaba solo del tramo de 09:30 a 10:00 del 27-oct: el hueco real fue mucho mayor.
- Que no se perdiera ningún lead es probable: cada pasada relee los últimos 50 envíos, y el v3 solo tiene 32 en total [C/E]. El diagnóstico parcial confirma uno a uno en GHL los 2 leads del 27 al 28-oct, pero no queda verificado aquí el lead del teléfono inválido [E].
- Según la salida de los nodos de n8n, se crearon contactos nuevos así: 25-oct, 2; 26-oct, 1; 27-oct, 1; 28-oct, 1. Y tratos nuevos: 26-oct, 3; 27-oct, 2; 28-oct, 1; 29-oct, 0 [C]. El resto son actualizaciones repetidas, unas 450-900 al día, porque cada pasada vuelve a dar de alta los mismos leads (ruido, no fallo).
- Riesgo de fondo: según el propio comentario del workflow, los contactos que crea por API no disparan los workflows de GHL [C].

## 3. GHL de EAC

**Sin acceso** (403 y 401, ver Accesos). No se han podido sacar los leads por formulario y origen, las citas ni los movimientos del pipeline. Lo único indirecto es lo de n8n del punto 2. La comprobación de que hay 0 citas en los 4 calendarios desde el 26-oct viene del encargo y no está verificada aquí.

## 4. Diagnóstico: causas ordenadas por peso

| # | Causa | Peso | Evidencia |
|---|---|---|---|
| 1 | **Pausa de `ad02 regis_video`**, que era el 93 % de los envíos de CP | ~70 % de la caída [E] | Del 21 al 26-oct traía 10,5 envíos al día; desde el 27, 0 [C]. Los envíos de la cuenta pasan de 13-17 al día a 1-3, y casi toda esa diferencia es este anuncio [C] |
| 2 | **Cambio a v3 + reinicio del aprendizaje en CP** | ~15 % [E] | `ad02 regis` con v3: 1 envío por 40 $ y CTR en caída [C]. Con v3, VIDEOS_TEST cuesta 2,8 veces lo de New 2026 por lead [C] |
| 3 | **Recorte de presupuesto** (CP de 40 a 20 $) | ~10 % [E] | Con un coste por lead de 3,5 $, 20 $ menos al día son unos 5-6 leads menos [E]. Pero sin el anuncio ganador, más presupuesto en `ad02 regis` no los habría traído [E] |
| 4 | **Entrega** | ~0 % | Los conjuntos gastan su presupuesto y no hay rechazos en conjuntos activos [C]. El CTR de VIDEOS_TEST baja desde el 27 (¿solapamiento?) [E] |
| — | Sincronizador | 0 % de la caída de Meta | Meta ya registra menos envíos; n8n no influye en eso [C]. Sí pudo retrasar unas 12 h los leads del v3 del 26 al 27-oct [E] |

Respuesta corta: **el problema no está en el formulario sino en el anuncio.** El v3 encarece el lead (3,5 $ → ~10 $) [C/E], pero la caída de 15 a 1 al día viene de haber pausado el anuncio que generaba el volumen.

## 5. Recomendación (reversible)

**A. Recuperar el volumen en CP en las próximas 48 h**
1. Duplicar `ad02 regis_video` dentro del mismo conjunto de CP, con su vídeo original y el formulario **New 2026** (`1426910559105314`). No reactivarlo tal cual, porque hoy apunta al v3 [C]. Dejar `ad02 regis` con el v3 como está.
2. Devolver el presupuesto de CP a **40 $/día**.
3. Para compensar el gasto, pausar o bajar CAT_PROSPECCIO, que lleva 0 conversiones de 5 $/día. El resto se deja quieto. Gasto total esperado: unos 85 $/día, frente a 65-70 $ ahora [E].
- **Coste esperado:** unos 80 $ en 48 h en CP. Con la referencia de 3,5 $ por lead más un sobrecoste del 30-50 % por el reaprendizaje, salen entre **4,5 y 5 $ por lead, es decir, entre 16 y 18 leads en 48 h** [E].
- **Medición a las 48 h:** envíos leídos del formulario (no de insights) por anuncio. Si el duplicado con New 2026 trae 12 o más, se confirma la causa; si trae menos de 6, se revisa la creatividad o el público. Además: aprendizaje de CP (debería salir de LEARNING al llegar a unas 50 conversiones semanales), coste por lead de CP ≤ 6 $ y que entren contactos nuevos de New 2026 en GHL.
- **Para deshacerlo:** pausar el duplicado y volver a 20 $/día.

**B. La cualificación del v3, sin matar el volumen**
- Mantener VIDEOS_TEST con v3 a 20 $/día como banco de pruebas del v3. Cuando el volumen vuelva, decidir con datos: comparar coste por lead cualificado (v3) frente a coste por lead con cita o entrevista (New 2026), no coste por lead bruto [E].
- La idea del v3 corto (3 preguntas) del diagnóstico parcial tiene sentido como paso siguiente, pero no antes de A.

**C. Sincronizador** (lo debe cambiar quien sea responsable de n8n; desde aquí no se ha tocado)
- Normalizar o validar el teléfono antes del alta y, si no es válido, darlo de alta sin teléfono, para que un solo lead no bloquee el lote.
- Avisar por Slack o email de cualquier ejecución con error. Esta caída de 12 horas pasó desapercibida.

**D. Citas a cero**
1. Dar acceso de lectura al GHL de EAC: guardar como secreto del entorno el PIT de la location `5Eylu2xUj1SoQaQnfmF8` (`GHL_TOKEN`).
2. Comprobar en GHL si los contactos del v3 (fuente «Facebook · formulario de cualificacion», etiqueta `lead-tcp`) entran en el workflow de reserva o confirmación. Los contactos creados por API no disparan los workflows de GHL [C], así que probablemente no reciben el enlace de cita [E]. Arreglo reversible: un workflow de GHL con disparador de etiqueta añadida (`lead-tcp`) o de oportunidad creada en «Nuevo Lead», que lance la misma secuencia de cita que New 2026.
3. Con A en marcha, New 2026 vuelve a entrar por la integración nativa y debería reactivar las citas por sí solo. **Medición a las 48 h:** 1 cita nueva o más en los 4 calendarios. Si siguen a cero con leads de New 2026 entrando, el fallo está en GHL o en Calligence, no en Meta [E].
