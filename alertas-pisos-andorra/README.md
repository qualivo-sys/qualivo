# 🏠 Alertas de pisos en Andorra

Monitor automático que vigila los portales inmobiliarios de Andorra y te avisa
**por email** (y opcionalmente por Telegram) **en cuanto aparece un piso nuevo**
que cumple tus filtros — para llegar el primero y ser el primero en contactar.

Está construido sobre **Google Apps Script**: corre solo en la nube de Google,
sin servidor y **gratis**, cada X minutos.

---

## Qué vigila

| Portal | Estado |
|--------|--------|
| **Pisos.ad** | ✅ Activo (agrega casi todas las inmobiliarias de Andorra) |
| **Habitaclia** | ✅ Activo |
| **Pisos.com** | ✅ Activo (incluye particulares) |
| **EnAlquiler** | ✅ Activo (incluye particulares) |
| BuscoCasa.ad | ⚠️ Descartado: su listado mezcla venta/alquiler y no tiene precio/habitaciones estructurados (van en texto libre) → poco fiable. Su alquiler ya lo cubren las mismas agencias vía Pisos.ad. |
| Idealista · Fotocasa · Trovit | 🔒 Bloquean bots (necesitan servicio de scraping de pago) |

Cada aviso incluye la **ficha completa**: foto, precio, habitaciones, m²,
parroquia, terraza/balcón confirmado, agencia y botón directo al anuncio.

## Filtros actuales (editables en `CONFIG`)

- Precio ≤ **1.500 €/mes**
- Habitaciones ≤ **2**
- Con **terraza o balcón**
- Parroquias: Andorra la Vella, Santa Coloma, Escaldes-Engordany, Encamp,
  La Massana, Ordino, Canillo, Sant Julià de Lòria (toda Andorra)

---

## Puesta en marcha (10 minutos, una sola vez)

1. Entra en **https://script.google.com** con tu cuenta de Google → **Nuevo proyecto**.
2. Borra el contenido por defecto y **pega el contenido de `Alertas.gs`**.
3. (Opcional pero recomendado) En ⚙️ *Configuración del proyecto* marca
   *"Mostrar el archivo de manifiesto `appsscript.json`"* y pega el `appsscript.json` de este repo.
4. En el objeto **`CONFIG`** (arriba del todo) revisa:
   - **`EMAILS`** → pon los correos separados por comas (ej. `info@maikelechevarria.com, isa@...`).
   - Ajusta filtros si quieres (precio, habitaciones, parroquias…).
5. Arriba, selecciona la función **`instalar`** y pulsa **Ejecutar** ▶️.
   Autoriza los permisos que pida (leer webs, enviar email, crear disparadores).
6. Recibirás un **email de confirmación** con lo que ya cumple ahora mismo.
   A partir de ahí, solo te llegarán avisos de **pisos nuevos**. ✅

### Comprobar que funciona
Ejecuta la función **`pruebaEmail`** ▶️ y mira tu bandeja de entrada.

---

## Funciones disponibles

| Función | Qué hace |
|---------|----------|
| `instalar()` | Crea el disparador periódico + primer barrido (sin spam). |
| `revisarAhora()` | Una revisión manual (la que corre el disparador). |
| `desinstalar()` | Deja de vigilar (borra los disparadores). |
| `pruebaEmail()` | Envía un email de prueba. |
| `reset()` | Olvida los anuncios vistos (empezar de cero). |

---

## Telegram (opcional, aún más rápido)

1. En Telegram, habla con **@BotFather** → `/newbot` → copia el **token**.
2. Escríbele algo a tu bot y abre
   `https://api.telegram.org/bot<TOKEN>/getUpdates` para ver tu **chat_id**.
3. Pega `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` en `CONFIG`.

---

## Añadir más portales

### Añadir un portal nuevo
En `Alertas.gs`, al final, duplica un bloque de `FUENTES` y escribe su función
`parse` (igual que `parsePisosAd`, `parseHabitaclia`, `parsePisosCom` o
`parseEnAlquiler`):

```js
{
  nombre: 'MiPortal',
  activa: function () { return true; },
  url: function (p) { return 'https://.../andorra/' + p; },
  parse: function (html) { return parseMiPortal(html); }  // <- función de parseo nueva
}
```

Cada portal tiene su propia maquetación, así que `parse` cambia de uno a otro.
Requisito para que sea fiable: que el listado tenga **precio y habitaciones en
campos estructurados** (no en texto libre). Por eso BuscoCasa.ad quedó fuera.

### Los bloqueados: Idealista, Fotocasa, Trovit
Estos portales detectan y bloquean bots (captcha geográfico, *Access Denied*).
Desde un script gratuito no se pueden leer directamente. Opciones para añadirlos:

1. **API de scraping de pago** (ScraperAPI, ScrapingBee, Zyte, Bright Data…):
   se les pasa la URL y ellos devuelven el HTML ya resuelto (rotan IP y captchas).
   En `fetchHtml` bastaría con enrutar esas URLs a través del proxy del proveedor.
   Coste orientativo: desde ~30–50 €/mes según volumen.
2. **API oficial de Idealista**: existe, pero es de acceso restringido y hay que
   solicitar credenciales (aprueban pocos casos).
3. **Navegador headless** (Puppeteer/Playwright) en un pequeño servidor propio:
   más trabajo de mantenimiento y no cabe en Apps Script.

> Recomendación: Pisos.ad ya agrega casi toda la oferta de las inmobiliarias
> andorranas, así que la cobertura real con los portales gratuitos ya es alta.
> Idealista/Fotocasa aportan sobre todo anuncios de particulares.

---

## Nota

Uso responsable: frecuencia moderada y solo para búsqueda personal. El scraping
puede ir contra los términos de uso de algunos portales; se incluyen únicamente
los que sirven HTML público y con una cadencia respetuosa.
