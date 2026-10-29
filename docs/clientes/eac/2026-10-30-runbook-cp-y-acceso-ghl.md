# EAC · Pasos si Maikel da el OK (CP con New 2026) y propuesta de acceso a GHL

Preparado el 29-oct para la revisión del 30-oct a las 8:30. **No se ha ejecutado nada**: solo hay lecturas.
Contexto y cifras: [`2026-10-29-auditoria.md`](2026-10-29-auditoria.md). [C] = comprobado con la API · [E] = estimación.

## Parte 1 · Volver a New 2026 en CP

### Identificadores (comprobados el 29-oct) [C]

| Qué | ID | Estado actual |
|---|---|---|
| Campaña CP `[AD] Clientes Potenciales (Intereses)` | `6506611992909` | Activa, CBO a 20 $/día (antes, 40 $) |
| Conjunto `[Ad] Conversión CP: Intereses Educación` | `6875325518909` | Activo, en LEARNING |
| Anuncio `ad02 regis_video` | `52562282418313` | Pausado. Su creatividad actual (`1994628671941941`) apunta al **v3** |
| **Creatividad original de regis_video** | **`1985400128724595`** | Sigue existiendo, con vídeo y formulario **New 2026** (`1426910559105314`) |
| Anuncio `ad02 regis` | `6978086969109` | Activo, con el v3 (creatividad `1158250563208087`) |
| Campaña `EAC_TCP_CAT_PROSPECCIO_Oct26` | `52663064493113` · conjunto `52663064826513` | Activa, 5 $/día, 0 conversiones |

### Pasos si dice OK (unos 10 minutos)

Los da Maikel en el Administrador de anuncios, o yo por API si se me autoriza expresamente. Por API son 4 llamadas.

1. **Crear un anuncio nuevo** en el conjunto `6875325518909` con la creatividad original `1985400128724595`. Nombre: `ad02 regis_video · New2026 · 30oct`. En el Administrador de anuncios equivale a duplicar `ad02 regis_video` y, en «Formulario instantáneo», elegir **New 2026**. Ese formulario ya está conectado a GHL por la integración nativa.
   - API: `POST /act_10151404080652508/ads` con `adset_id=6875325518909`, `creative={"creative_id":"1985400128724595"}` y `status=ACTIVE`.
   - **No reactivar `52562282418313`**: saldría con el v3.
2. **CP de 20 a 40 $/día.** API: `POST /6506611992909` con `daily_budget=4000`.
3. **Pausar CAT_PROSPECCIO** para compensar parte del gasto. API: `POST /52663064493113` con `status=PAUSED`.
4. **No tocar nada más**: ni `ad02 regis` (v3), ni VIDEOS_TEST, ni AZAFATA, DESPACHADOR o RMK. Cada cambio adicional vuelve a reiniciar el aprendizaje.
5. **Comprobar después:**
   - El anuncio nuevo pasa la revisión, que normalmente tarda unos minutos [E], y empieza a entregar.
   - En la primera hora con envíos, que llega un lead de New 2026 a GHL. Eso requiere el acceso de la Parte 2; mientras no lo haya, lo comprueba el equipo de EAC.

**Gasto total esperado:** unos 80 $/día, frente a 65-70 $ ahora. Son +20 $ en CP y −5 $ al pausar CAT [E].

### Cómo se mide (a las 24 y a las 48 h)

| Métrica | De dónde sale | Umbral a las 48 h |
|---|---|---|
| Envíos de New 2026 del anuncio nuevo | Lectura del formulario `1426910559105314` (no de insights) | ≥ 12 → causa confirmada · 6-11 → esperar 48 h más · < 6 → revisar la creatividad o el público [E] |
| Coste por lead de CP | Gasto de CP dividido entre los envíos de los dos anuncios | ≤ 6 $ |
| Citas nuevas | 4 calendarios de GHL | ≥ 1 (requiere el acceso de la Parte 2, o que lo compruebe EAC) |
| Contactos de New 2026 en GHL | GHL, con `GET /contacts/{id}` | Los mismos que los envíos de Meta |

### Cómo deshacerlo (5 minutos, sin perder datos)

1. Pausar el anuncio nuevo `ad02 regis_video · New2026 · 30oct`. No borrarlo, para conservar su historial.
2. CP de vuelta a 20 $/día: `POST /6506611992909` con `daily_budget=2000`.
3. Reactivar CAT_PROSPECCIO: `POST /52663064493113` con `status=ACTIVE`.

Así queda exactamente como hoy. El único efecto que queda es otro cambio significativo en el conjunto de CP, que vuelve a reiniciar su aprendizaje.

**Cuándo deshacerlo:** si a las 48 h hay menos de 6 envíos con al menos 80 $ gastados en CP, o si Maikel decide priorizar la cualificación del v3 sobre el volumen.

### Riesgo a tener en cuenta

New 2026 no hace las preguntas de cualificación del v3 (en qué punto estás y cuándo empezar). Si se acepta, se recupera volumen a cambio de leads menos cualificados. El v3 sigue funcionando en VIDEOS_TEST y en `ad02 regis`, así que hay comparación directa entre los dos formularios [E].

## Parte 2 · Recuperar el acceso al GHL de EAC

**Situación [C]:** ninguna clave de este entorno puede leer la location de EAC `5Eylu2xUj1SoQaQnfmF8`. `GHL_API_KEY` y `AM_GHL_API_KEY` son de otra location y devuelven 403; `GHL_AGENCY_API_KEY` devuelve 401 (no es válida o no tiene alcance).

**Qué hace falta:** un **Private Integration Token (PIT) de la subcuenta de EAC**, solo de lectura.
- **Quién lo crea:** un administrador de la subcuenta de EAC en GHL, o el dueño de la agencia si EAC cuelga de la agencia de Qualivo [E]. Se crea en *Settings → Private Integrations → Create new integration*, con el nombre «Qualivo · lectura auditoría».
- **Permisos (solo lectura):**
  - `contacts.readonly`
  - `opportunities.readonly`
  - `calendars.readonly`
  - `calendars/events.readonly`
  - `locations.readonly`
  - `users.readonly`
  - `workflows.readonly`
  - `forms.readonly`
- **Ningún permiso de escritura.** El sincronizador de n8n ya tiene su propia credencial de escritura y no se toca.
- **Dónde se guarda:** como secreto del entorno en la nube, en el menú del entorno → *Edit* → *Network secrets* o variable de entorno, con el nombre **`EAC_GHL_TOKEN`**. Se ve desde la sesión siguiente. **Nunca se pega en el chat.**
- **Comprobación al recibirlo:** `GET /opportunities/pipelines?locationId=5Eylu2xUj1SoQaQnfmF8` debe devolver 200, y `GET /calendars/events` sobre los 4 calendarios debe devolver datos.
- **Qué desbloquea:**
  - Los leads del 19-oct en adelante por formulario y origen.
  - Las citas.
  - Los movimientos del pipeline.
  - Comprobar si los contactos del v3 (`lead-tcp`) entran en el workflow de reserva.
  - Medir las citas del experimento de la Parte 1.
- **Rotación:** revocar el token cuando termine la auditoría o rotarlo cada 90 días.
