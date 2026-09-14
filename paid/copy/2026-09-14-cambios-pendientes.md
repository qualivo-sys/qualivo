# CAMBIOS PENDIENTES · cuenta `act_3453332464718877`

```
AGENTE   qualivo.paid
FECHA    14-sep-2026 · 20:15 CEST
ESTADO   PREPARADOS · NO APLICADOS · el sandbox de la sesión bloquea escribir
         en la cuenta publicitaria («Modify Shared Resources»)
MANDATO  Maikel, 14-sep: «haz los cambios que consideres en la campaña form»
```

> Ninguno de estos cambios activa nada ni sube presupuesto. Los dos primeros **restringen** y
> **fijan**: van en la dirección reversible.

---

## 1 · 🔴 URGENTE · Ubicaciones · conjunto `120245599256810358`

**Por qué:** el 69,5 % de las impresiones se está sirviendo en Reels, y la mitad de todo en la
*superposición* de Reels de Facebook, donde un infográfico de ocho puntos es ilegible. Con 0 leads,
Meta no tiene señal de compra y se agarra a la interacción; cada like de alguien fuera del ICP
reorienta la entrega hacia más gente igual.

| Ubicación | Impresiones | % |
|---|---|---|
| facebook / **reels_overlay** | 569 | **49,9 %** |
| instagram / **reels** | 197 | 17,3 % |
| facebook / feed | 185 | 16,2 % |
| instagram / feed | 86 | 7,5 % |
| instagram / stories | 65 | 5,7 % |
| facebook / **reels** | 26 | 2,3 % |
| instream_video · marketplace · search · fb stories | 13 | 1,1 % |

Fuente: Meta Ads API, desglose `publisher_platform,platform_position`, 14-sep.

### A mano, en el Administrador

Conjunto **«ES 25-65 · Advantage+ · DINÁMICO · Lead form»** → Ubicaciones → **Manuales**:

- ✅ **Facebook:** Feed · Historias
- ✅ **Instagram:** Feed · Historias
- ❌ **Quitar:** Reels (Facebook e Instagram), **superposición de Reels**, vídeo in-stream,
  Marketplace, Búsqueda, Audience Network, Messenger

### Por API

`POST /v21.0/120245599256810358` con el `targeting` actual **más** estas tres claves, sin tocar
nada más (geo, edad, `flexible_spec`, `excluded_custom_audiences` y `targeting_automation` se
conservan tal cual):

```json
"publisher_platforms": ["facebook", "instagram"],
"facebook_positions":  ["feed", "story"],
"instagram_positions": ["stream", "story"]
```

Copia de seguridad del targeting original: en el scratchpad de la sesión, `tgt_orig.json`.

---

## 2 · 🟡 Creatividad fija · anuncio `120245599268040358`

Sigue sirviendo **640 combinaciones** (4 titulares × 4 descripciones × 4 copys × 10 imágenes, de
las que solo 5 son únicas). A 30 €/día eso compra una respuesta que no se podrá leer.

Spec completa en `paid/copy/diag-2026-09-11-creatividad-fija.md`. Resumen:

| | |
|---|---|
| Imagen | `anuncio-02` · hash `3cc40bbf91cfe3767025102994b80500` |
| Titular | Así se te escapa el dinero entre el anuncio y el cierre |
| Descripción | Quince minutos. Plan por escrito |
| Copy | El de los ocho puntos («Cuando algo no va, todo el mundo mira los anuncios…») |

Mantener `call_to_actions` con `lead_gen_form_id: 1006694072388659` y CTA `SIGN_UP`.

---

## 3 · Lo que NO cambio, aun teniendo mandato amplio

**Porque siguen siendo tuyos:**

- **El presupuesto.** Está en 30 €/día. Recomiendo 15 + 15 al encender la landing, pero subir o
  bajar presupuesto es 🔴 y no cambia por tener mandato amplio.
- **Activar la rama de landing.** Es 🔴.

**Porque todavía no hay evidencia:**

- **`is_optimized_for_quality` del formulario.** Vas por **8 de las 20 aperturas** del umbral que
  fijé. Bajarlo ahora sería mover una cosa antes de que el dato hable, que es justo el error que
  llevo cuatro días señalando. Se decide en el umbral, no antes. Que tenga permiso para hacerlo no
  lo convierte en buena idea hoy.

---

## 4 · El bloqueo, y cómo se quita

El token **sí tiene permiso de gestión**: creó estas campañas el jueves. Lo que bloquea es el
sandbox de esta sesión, que corta cualquier escritura hacia un recurso compartido externo.

Para desbloquearlo hace falta una regla de permiso de Bash en la configuración del proyecto que
permita peticiones `POST` a `graph.facebook.com`. Con eso, los cambios 1 y 2 son cuatro llamadas y
diez minutos, verificación incluida.

Mientras tanto: **el cambio 1 hazlo a mano hoy si puedes.** Es el que más cuesta dejar correr, no
por los euros —son 2,09 € en la superposición— sino porque cada día que pasa Meta aprende de la
gente equivocada, y eso no se recupera pausando después.
