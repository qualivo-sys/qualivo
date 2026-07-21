# El Diagnóstico de Captación — Sistema completo de lead magnet

Sistema de captación premium para **Qualivo**, construido sobre un cambio de enfoque:
en vez de otra «Guía de Meta Ads» (hay miles), un **diagnóstico del sistema comercial**.

> **La tesis:** *No tienes un problema de publicidad. Tienes un problema de sistema.*
> Los CEOs no quieren aprender Meta Ads. Quieren saber por qué no crecen. Este material
> atrae a ese perfil —empresas que ya venden y quieren escalar— y diferencia a Qualivo
> desde el primer contacto.

**Título:** El Diagnóstico de Captación
**Subtítulo / promesa:** *Las 27 preguntas que toda empresa debería responder antes de invertir 1 € más en publicidad.*
**Oferta final (no venta):** Auditoría de Adquisición con IA — se diagnostica, no se vende.

---

## Qué hay en esta carpeta

| Archivo | Qué es | Cómo se usa |
|---|---|---|
| **`analizador.html`** ⭐ | El lead magnet **interactivo**: una web-app que lleva al usuario bloque a bloque (9 eslabones, 27 preguntas con escala Sí / Parcialmente / No) y al final le devuelve un **diagnóstico personalizado** — índice de madurez (0-100), mapa de fugas por eslabón y un plan priorizado de por dónde empezar. Con captura de email para enviar el resultado + reservar la Auditoría. | Publícala como página. Es la pieza de mayor conversión: el usuario obtiene un resultado propio, no un PDF genérico. Conecta el envío a tu CRM (ver abajo). |
| **`diagnostico-de-captacion.html`** | La versión **documento** del mismo contenido: premium, listo para leer en el navegador o **imprimir a PDF**. Portada, la tesis, el Sistema de 9 eslabones, los 10 errores, las 27 preguntas y casos antes/después. Sirve como entregable descargable y como pieza para compartir con el equipo. | Ábrelo en el navegador → `Imprimir` → *Guardar como PDF* (A4, ya está maquetado para impresión). |
| **`landing.html`** | Landing de descarga con captura de email (nombre, email, empresa) y toda la argumentación de por qué descargarlo. | Publícala como página de aterrizaje. Conecta el formulario a tu CRM/automatización (ver abajo). |
| **`secuencia-emails.md`** | Secuencia de 5 emails: entrega → idea central → prueba → oferta de Auditoría → cierre. | Cárgala en tu herramienta de email marketing / GHL. |
| **`secuencia-whatsapp.md`** | Secuencia de WhatsApp (4 mensajes + reactivaciones) para el canal de mayor apertura. | Requiere opt-in. Cárgala en tu plataforma de WhatsApp Business. |
| **`anuncios-y-creatividades.md`** | Anuncios de Meta (3 variantes), anuncio de LinkedIn, guion de vídeo corto para Instagram y **prompt para generar creatividades con IA**. | Material para las campañas que llevan tráfico frío a la landing. |

---

## El embudo, de un vistazo

```
   ANUNCIOS (Meta · LinkedIn · Reel IG)
        │   ← anuncios-y-creatividades.md
        ▼
   ┌────────────────────────────┬───────────────────────────┐
   │  ANALIZADOR INTERACTIVO     │   LANDING + DESCARGA PDF   │
   │  (diagnóstico a medida)     │   (documento premium)      │
   │  ← analizador.html          │   ← landing.html +         │
   │    captura email al final   │     diagnostico-...html    │
   └────────────────────────────┴───────────────────────────┘
        │  el momento "esta gente me entiende de verdad"
        ├───────────────┬───────────────┐
        ▼               ▼                │
   SECUENCIA EMAIL   SECUENCIA WA        │
   (5 correos)       (4 mensajes)        │
        └───────────────┴───────────────┘
                        ▼
        AUDITORÍA DE ADQUISICIÓN CON IA  ← la conversión real (reunión)
```

> **Recomendación:** usa el **analizador** como lead magnet principal (convierte mejor porque
> el usuario se lleva un resultado propio) y el **documento/PDF** como pieza de refuerzo y
> descarga. Ambos comparten contenido y diseño, así que la marca se percibe consistente.

---

## Diseño

Dirección de arte: **«instrumento de diagnóstico / blueprint de sistemas»**, deliberadamente
alejada de las plantillas típicas de lead magnet.

- **Color:** porcelana fría `#F3F5F7` · grafito `#16181D` · señal cobalto `#1E3AE0` (acento único) ·
  coral `#D6363B` **solo** para fugas/errores/antes · verde `#12855F` **solo** para resuelto/después.
- **Tipografía:** titulares serif de alto contraste · cuerpo sans de sistema · **mono** para números,
  códigos y etiquetas (la «voz de instrumento»). Sin webfonts externas (funciona sin conexión y sin CDNs).
- Ambos archivos HTML son **autónomos** (un solo fichero, sin dependencias), responsive, con **modo claro/oscuro**
  y botón de tema. El documento incluye estilos de impresión (`@page A4`) para exportar a PDF con buen acabado.

---

## Puesta en marcha (checklist)

1. **Genera el PDF descargable:** abre `diagnostico-de-captacion.html` → Imprimir → Guardar como PDF.
2. **Publica la landing:** sube `landing.html` a tu hosting/dominio (p. ej. `captacion.qualivo…`).
3. **Conecta el formulario:** en `landing.html`, en el `<script>`, sustituye el comentario
   *«Aquí conectas tu CRM / automatización»* por tu webhook (GHL, Zapier, Make, etc.) que:
   guarda el contacto → envía el PDF → dispara la secuencia de emails.
4. **Carga las secuencias:** email y WhatsApp, con las variables `{{...}}` mapeadas a tu CRM.
5. **Lanza las campañas:** usa las creatividades y segmenta por dirección (excluye «aprender ads», freelancers).
6. **Enlace de reserva:** apunta `{{url_reserva}}` a la agenda de la Auditoría (Calendly / GHL).
7. **Mide lo que importa:** CPA y reuniones reservadas, no CPL ni descargas. (El propio documento lo predica.)

---

## Nota sobre los casos

Los casos «antes/después» del documento son **representativos y anonimizados**: ilustran dónde
suele estar la palanca, no prometen un resultado concreto. Antes de usarlos en producción,
sustitúyelos por resultados reales de Qualivo (con permiso del cliente) para máxima credibilidad.
