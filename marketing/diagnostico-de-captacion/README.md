# El Diagnóstico de Captación — Kit completo (Lead Magnet Qualivo)

> **Las 27 preguntas que toda empresa debería responder antes de invertir 1 € más en publicidad.**

Lead magnet premium para Qualivo. No es un ebook: es un **diagnóstico** que posiciona a Qualivo
como quien entiende el problema de negocio del CEO (por qué no crece), no como quien vende tácticas
de Meta Ads. El objetivo del embudo no es vender, es generar la sensación de *"esta gente entiende
exactamente mi problema"* y que la consecuencia natural sea reservar una **Auditoría de Adquisición
con IA**.

---

## Contenido del kit

```
diagnostico-de-captacion/
├─ documento/
│   └─ diagnostico-de-captacion.html   ← EL LEAD MAGNET (documento premium, imprimible a PDF)
├─ landing/
│   └─ landing.html                    ← Página de descarga (captura de email)
├─ copy/
│   ├─ secuencia-email.md              ← 5 emails (entrega → auditoría)
│   ├─ secuencia-whatsapp.md           ← 5 mensajes de WhatsApp
│   ├─ anuncio-meta.md                 ← Anuncio Meta (3 variantes + titulares)
│   ├─ anuncio-linkedin.md             ← Anuncio LinkedIn (3 variantes)
│   ├─ guion-instagram.md              ← Guion de Reel/Short (30–40 s)
│   └─ prompt-creatividades-ia.md      ← Prompts para generar creatividades con IA
└─ README.md                           ← este archivo
```

---

## El documento (pieza estrella)

`documento/diagnostico-de-captacion.html` es un archivo **autónomo** (todo el CSS va incrustado,
sin dependencias externas). Estructura:

1. **Portada** — título, subtítulo, autor.
2. **Introducción** — *no tienes un problema de publicidad, tienes un problema de sistema*.
3. **Framework: El Sistema de Captación de 9 etapas** — Sistema → Oferta → Mensaje → Creativos →
   Landing → CRM → Seguimiento → Ventas → Optimización, con la *señal de fallo* de cada etapa y la
   *regla de la cascada*.
4. **Los 10 errores más comunes** — cada uno con diagnóstico y ejemplo.
5. **Las 27 preguntas** — 3 por etapa (Q01–Q27), con marcador de puntuación (cuenta tus "no").
6. **Casos antes / después** — con marcadores para rellenar con datos reales.
7. **CTA** — Auditoría de Adquisición con IA (un diagnóstico, no una venta).

### Cómo verlo y exportarlo a PDF
1. Abre `documento/diagnostico-de-captacion.html` en cualquier navegador.
2. Botón *Tema* arriba a la derecha para alternar claro/oscuro.
3. Para el PDF que se descargan los leads: **Imprimir → Guardar como PDF** (los estilos de impresión
   ya están optimizados: fondo blanco, cortes de página limpios).

### ⚠️ Antes de publicar — dato pendiente
La sección **Casos (04 · Evidencia)** usa marcadores `[ ]` en ámbar en las métricas
(p. ej. `CPL −[ %]`). **Sustitúyelos por resultados verificados de clientes reales** (con su permiso)
antes de publicar. La estructura antes/después ya está lista; solo faltan tus cifras reales.
También revisa el **autor** en la portada (ahora *Maikel Echevarría · Fundador · Qualivo*).

---

## La landing

`landing/landing.html` — página de descarga autónoma, misma identidad visual. Captura nombre, email
de empresa y empresa. El `<form>` es una maqueta: conéctalo a tu herramienta (GoHighLevel, HubSpot,
Mailchimp…) apuntando el `action`/evento al endpoint de tu CRM y disparando la secuencia de email.

Filtra el perfil desde el propio copy ("es para ti si… / no es para ti si…") para atraer decisores y
repeler freelancers, tal y como pedía el brief.

---

## Identidad visual (para mantener coherencia en todo)

| Rol | Valor |
|---|---|
| Papel hueso | `#EDEBE4` |
| Tinta | `#17181A` |
| Grafito (páginas oscuras) | `#1E2126` |
| Acento petróleo (estructura / señal "sistema") | `#0C6B63` |
| Ámbar (alerta / error — semántico) | `#B4712A` |
| Serif (titulares) | Iowan Old Style / Palatino / Georgia |
| Sans (lectura) | system-ui |
| Mono (datos: S1–S9, Q01–Q27, KPIs) | SF Mono / JetBrains Mono |

Concepto: *informe de instrumento de diagnóstico*. Minimalista, mucho aire, retículas finas, la
monoespaciada como "voz del dato". Deliberadamente lejos de la estética de ebook genérico.

---

## Flujo recomendado

```
Anuncio (Meta / LinkedIn / Reel)
        ↓
Landing (landing.html) → captura email
        ↓
Email 1 + WhatsApp 1  → entrega del documento
        ↓
Emails 2–5 / WhatsApp 2–5 → idea central, caso, invitación
        ↓
Auditoría de Adquisición con IA  (conversión final)
```

## Marcadores a sustituir antes de lanzar
- `{{nombre}}`, `{{link_descarga}}`, `{{link_auditoria}}`, `{{firma}}` en los copys.
- Métricas `[ ]` de los casos del documento.
- Enlace del botón CTA del documento (`#reservar`) → URL real de reserva.
- `action` del formulario de la landing → endpoint de tu CRM.
