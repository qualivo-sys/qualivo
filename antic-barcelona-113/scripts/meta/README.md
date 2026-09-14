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
