# Montar las campañas en Meta Ads

No hay conector de Meta Ads en esta sesión: los únicos conectores de "campañas"
disponibles son HeyReach (LinkedIn) y Apollo (email), que no sirven para esto.
La Graph API sí es alcanzable desde aquí — responde 400 "falta token" —, así que
lo único que falta para montarlo todo es un token con permiso `ads_management`.

## Qué crea

Toda la estructura del documento `estrategia/02-plan-de-medios-meta.md`:

| | |
|---|---|
| `AB113 \| FRIO \| Lead` | CBO 22 €/día · 1 conjunto amplio · 10 anuncios |
| `AB113 \| RTG \| Lead` | 8 €/día · 1 conjunto · 3 anuncios |

**Todo se crea en `PAUSED`.** El script no activa nada ni gasta presupuesto:
activar es una decisión manual en el Administrador de anuncios, y solo después
de la checklist que imprime al terminar.

## Antes de ejecutar

Rellenar en `config.json`:

- `cuenta.ad_account_id` → `act_123456789`
- `cuenta.page_id` → ID de la página de Facebook
- `cuenta.pixel_id` → ID del píxel
- `cuenta.instagram_actor_id` → opcional, para que el anuncio salga con la cuenta de IG

## Ejecutar

```bash
# Simulacro: imprime la estructura completa sin llamar a la API
node scripts/meta/build-campaigns.mjs

# Real: crea todo en PAUSED
META_TOKEN=EAAB... node scripts/meta/build-campaigns.mjs --apply
```

El token se pasa por variable de entorno y no se guarda en ningún fichero.
Al terminar con `--apply` deja el mapa de IDs en `ultimo-despliegue.json`.

## Lo que el script NO hace

- **Públicos de retargeting.** Se crean a mano en Públicos: web 180 d,
  cuestionario abandonado 90 d, IG/FB 365 d, vídeo 50 % 365 d, excluyendo
  conversores 90 d. El conjunto RTG queda creado pero sin esas audiencias.
- **Verificación de dominio, CAPI ni priorización de eventos (AEM).** Son pasos
  del Business Manager, no de la API de campañas. Ver documento 04.
- **Activar.** A propósito.

---

## Notas de la primera ejecución real (cuenta AnticBarcelona113)

Cosas que la API rechazó y cómo se resolvieron. Sirven para la próxima cuenta:

| Error | Causa | Solución |
|---|---|---|
| `Falta agregar una ubicación` | `custom_locations` al nivel superior de `targeting` | Va anidado dentro de `geo_locations` |
| `No se indicó ningún anunciante` | Ley de Servicios Digitales (UE) | Añadir `dsa_beneficiary` y `dsa_payor` al conjunto |
| `edad mínima no puede ser > 25` | Advantage+ audience viene **activado por defecto** en `OUTCOME_LEADS` y es incompatible con el filtro de edad | `targeting_automation: { advantage_audience: 0 }` |
| `El contenido no debería incluir mejoras estándar` | `standard_enhancements` está obsoleto | Quitarlo; las funciones se desactivan una a una desde el Administrador |
| `User request limit reached` al **listar** | La cuenta está en nivel `development_access`: `GET /adsets` y `GET /ads` se limitan enseguida, aunque crear sí funcione | La idempotencia no puede depender de consultar a Meta: se apoya en `.state.json` local y la consulta queda como respaldo que nunca aborta |
| `Ningún método de pago` al crear el **anuncio** | La cuenta no tiene forma de pago | **Bloqueante.** Meta no crea anuncios ni en pausa. Lo tiene que añadir el cliente |

También se cachean los hashes de imagen en `.image-hashes.json`: cada reintento
se ahorra 10 llamadas, que en nivel `development_access` es la diferencia entre
completar la pasada o agotar el cupo.

---

## Públicos personalizados

```bash
node scripts/meta/build-audiences.mjs                    # simulacro
META_TOKEN=... node scripts/meta/build-audiences.mjs --apply
```

Idempotente vía `.audiences.json`. Los públicos tardan **24-48 h en poblarse**:
crearlos no es lo mismo que poder usarlos.

| Error | Causa | Solución |
|---|---|---|
| `El parámetro "subtipo" no se admite` | `subtype` dejó de aceptarse en v21 | Quitarlo: el tipo se deduce del `event_source` de la regla |
| `Formato JSON de regla no válido` | Regla de sitio web sin `filter` | El filtro es obligatorio, aunque el público sea "todos los visitantes" |
| `(#2663) Terms of service has not been accepted` | Faltan las Condiciones de Públicos Personalizados | Las acepta una persona en business.facebook.com/ads/manage/customaudiences/tos/ — **solo afecta a los públicos de sitio web**; los de interacción con IG y Facebook se crean sin ellas |

---

## Campaña de formulario instantáneo

```bash
META_TOKEN=... node scripts/meta/build-leadform.mjs --apply
```

Test en paralelo a la de landing, con 8 €/día. El formulario vive dentro de Meta,
así que **no depende de la captura de leads de la web**: puede rodar aunque el
Apps Script no esté conectado todavía.

Lleva **cuatro preguntas de cualificación** (pieza, espacio, medidas, plazo) en
lugar de los tres campos de rigor. Un formulario de tres campos da leads baratos
y basura; con estas preguntas el comercial recibe lo mismo que por la web y se
puede comparar la **calidad**, no solo el precio.

| Error | Causa | Solución |
|---|---|---|
| `Condiciones del servicio no aceptadas` | La **página de Facebook** no ha aceptado las condiciones de generación de clientes potenciales | Un administrador de la página las acepta en facebook.com/ads/leadgen/tos — es una condición distinta de la de públicos personalizados |

Los leads del formulario **no llegan a la hoja de cálculo**: se descargan del
Administrador de anuncios, o se conecta una integración (Zapier, Make o el
webhook de leadgen) para que caigan en el mismo sitio que los de la web.

---

## Publicaciones de Instagram promocionables

`creatividades/instagram-posts-analisis.json` guarda el análisis de las 12
publicaciones con más alcance de @antic.barcelona113 (128 en total, 123 Reels).

Las seis primeras se comprobaron una a una contra la API: **todas admiten
promoción**. Se crea la creatividad con `source_instagram_media_id` más
`instagram_user_id`, no con `object_story_id`.

## El techo de 600 €/mes

`ajustar-presupuesto.mjs` dejó la cuenta así:

| Campaña | €/día | Estado |
|---|---|---|
| `AB113 \| FRIO \| Lead` | 15 | En pausa, lista |
| `AB113 \| RTG \| Lead` | 4 | En pausa, lista |
| `AB113 \| FRIO \| Formulario` | 4 | En pausa, en reserva |

**Al arrancar son 19 €/día**, o 589 € en un mes de 31 días. Se eligió 19 y no 20
justamente por eso: 20 × 31 son 620 €.

Once anuncios quedan encendidos dentro de campañas en pausa (6 en frío, 2 en
retargeting, 3 en el de formulario). Los otros ocho se apagaron: con 15 €/día,
trece anuncios se reparten 1,15 € cada uno y ninguno acumula eventos suficientes
para salir de la fase de aprendizaje. Están ahí para sustituir a un ganador
cuando lo haya, no borrados.

> **Cuidado al activar.** Si se encendieran las tres campañas a la vez serían
> 23 €/día = 713 € en un mes de 31 días, por encima del techo. El formulario
> entra en la semana 5 **quitando del frío**: 15 + 4 pasan a 11 + 4 + 4.

### La única garantía dura

Los presupuestos diarios son una promesa, no un tope. Si se quiere un límite que
Meta no pueda superar, el campo es el **límite de gasto de la cuenta**
(Configuración de facturación → Límite de gasto de la cuenta).

Tiene una trampa que hay que conocer antes de ponerlo: **es un tope acumulado,
no mensual**. Se pone en 600 y, al llegar, Meta pausa *todo* hasta que alguien lo
suba. Sirve de red de seguridad el primer mes, pero a partir del segundo hay que
acordarse de subirlo cada mes o la campaña se apaga sola a mitad de mes sin
avisar. No se ha puesto por eso: es una decisión del cliente, no nuestra.
