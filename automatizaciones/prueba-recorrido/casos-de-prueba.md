# Prueba del recorrido completo · Formación y Reformas

> Agente de Automatización · encargo del Chief of Staff (22-oct) · entrega 28-oct · estado a **25-oct**.
> Alcance: verificación con **datos internos**; nada se activa con prospectos. Lo que requiere acceso (GHL, n8n, Meta, GA4) queda marcado **PENDIENTE** con su caso de prueba definido para ejecutarlo en cuanto haya credenciales.
> Verificado hasta ahora por análisis estático de lo publicado: `qualivo.io/formacion/` y `/reformas/` (HTML descargado 22-oct), `assets/consent.js`, `diagnostico/landing.js` y `api/diagnostico.js` (rama de Landing).

## Resumen ejecutivo

| Bloque | Estado |
|---|---|
| 5 · Eventos y cookies (Paid) | 🔴 **Causa del "55 clics → 3 visitas" confirmada en código** (ver T5.1) |
| 2 · UTM al CRM | 🟠 Llegan en crudo; `medium` y `campaign` no se separan en campos; código de cuenta sin campo propio |
| 1 · Recorrido E2E | 🟠 Diseño verificado en código; ejecución con contacto interno pendiente de acceso |
| 3 · Lógica outbound | ⏳ Casos definidos; ejecución pendiente (dueño: Outbound + acceso) |
| 4 · Newsletter | ⏳ Casos definidos; ejecución pendiente de saber la herramienta de envío |

---

## 5 · Eventos y audiencias (píxel Meta + GA4) — lo más urgente

**T5.1 · Banner de cookies vs. medición — NO PASA [C].** En `consent.js`, GA4 (`G-LVDQS0MXF4`) y el píxel de Meta (`879197745226987`) **solo se cargan tras pulsar "Aceptar"**. Con "Rechazar" o sin tocar el banner no se carga ni `gtag.js`, así que tampoco hay pings sin cookies de Consent Mode: la visita es invisible para GA4 y para Meta. Es la causa directa del caso reportado (55 clics → 3 visitas ≈ solo quienes aceptan). Vercel Analytics sí mide siempre (sin cookies): el dato real de visitas está ahí para contrastar.
**Propuesta (decisión de Landing/Maikel, no desplegada):** cargar `gtag.js` siempre con Consent Mode v2 en `denied` por defecto (pings anónimos + modelado de GA4, sin cookies hasta aceptar) y dejar Meta como está, apoyándose en la Conversions API server-side que **ya existe** en `api/diagnostico.js` con `eventID` compartido para deduplicar. Así se recupera la visibilidad sin tocar el criterio de privacidad del banner.

**T5.2 · Eventos definidos para las dos landings — PASA (diseño) [C].** `consent.js` mapea ya: `formacion_vsl_play`/`VSLPlay`, `formacion_agenda_abierta`, `formacion_reserva`, `reformas_agenda_abierta`, `reformas_reserva`, `diagnostico_lead`→`Lead`, `diagnostico_solicitado`→`Contact`, más los tres de entrada al formulario (view/start/abandon). La reserva va como evento propio y el `Schedule` estándar lo manda el servidor al entrar la cita — comentado en el propio código para no contar dos veces.

**T5.3 · Disparo real de los 5 eventos que pide Paid (visita, vídeo, demo, formulario, reserva) en píxel y GA4 — PENDIENTE.** Ejecución: visita de prueba aceptando cookies, reproducir el VSL, enviar el formulario con email interno y reservar en el calendario; verificar en Events Manager (test events) y GA4 DebugView. Requiere: acceso a Events Manager/GA4 o capturas de Maikel.

**T5.4 · Deduplicación píxel↔CAPI — PASA (diseño) [C] / ejecución PENDIENTE.** `landing.js` genera `evento_id` aleatorio (ya no deriva del email — corregido el 13-oct según comentario) y lo comparte navegador/servidor. Verificar en Events Manager que el Lead llega "deduplicated".

## 2 · UTM hasta el CRM

**T2.1 · Las UTM llegan al servidor — PASA [C].** `landing.js` envía `utm: location.search` (cadena completa) + `origen` (ruta real de la página) a `/api/diagnostico`. La ruta real evita que todas las landings caigan como la misma página.

**T2.2 · source/medium/campaign/content como campos separados en el CRM — NO PASA [C].** `api/diagnostico.js` extrae `utm_content` (etiqueta `creativo-…`), `utm_term` (`ubicacion-…`), `utm_id` (id de anuncio) y usa `utm_source` solo para detectar si viene de Meta. **`utm_medium` y `utm_campaign` no se extraen a ningún campo**: quedan solo dentro de la cadena cruda guardada. Para el informe por campaña que pide el encargo hay que añadir su extracción (cambio pequeño en `api/diagnostico.js`, dueño: Landing).

**T2.3 · Código de cuenta en campo aparte — NO PASA [C].** No hay rastro de un campo de código de cuenta en el flujo del formulario. Definir qué parámetro lo lleva (¿`utm_content`? ¿parámetro propio `cta=`?) y a qué campo del CRM va. Decisión del CoS/Paid antes del lunes.

**T2.4 · Persistencia de UTM entre páginas — NO PASA [C].** Las UTM se leen de la URL **en el momento de enviar el formulario**. Si el visitante aterriza en `/formacion/?utm_…` y navega a otra página antes de enviar, se pierden (no se guardan en sessionStorage). Caso de prueba: aterrizar con UTM → navegar → enviar; esperado: UTM presentes. Arreglo: persistirlas al aterrizar (Landing).

## 1 · Recorrido completo con datos internos

Diseño verificado en código [C]: formulario 2 pasos con honeypot y RGPD obligatorio → `/api/diagnostico` → CRM (GHL) con etiquetas por página/creativo → calendario GHL embebido (widget `zBlsw8BEKA2zah81YlOl`) con datos prerellenados → CAPI Lead. El flujo `?paso=agenda` para quien viene del lead form de Meta usa token corto en vez de datos en la URL (bien: evita fugas en referers).

**T1.1–T1.6 · Ejecución E2E con contacto interno — PENDIENTE de acceso.** Secuencia: enviar formulario con email interno etiquetado `qa-interno` → comprobar contacto + oportunidad + etiquetas + UTM en GHL → reservar → confirmación recibida → responsable asignado → marcar asistencia → resultado registrado. Criterio: cada paso deja rastro en <2 min y el contacto `qa-interno` queda excluible de métricas (etiqueta de exclusión definida antes de lanzar). Requiere: token GHL (o capturas guiadas de Maikel, 15 min).

## 3 · Lógica de outbound — casos definidos, ejecución pendiente

Los seis controles pedidos quedan definidos como casos de prueba (canal principal único por cuenta; registro compartido de contactos; cancelación de envíos en cola al responder, reservar o darse de baja; supresión cruzada entre canales; control de rebotes; control de duplicados). Mi workflow de parada (`automatizaciones/radiografia/workflow-parada.json`) ya cubre la cancelación por respuesta/cita vía etiqueta para la secuencia de la radiografía. La ejecución de estos casos toca las herramientas y secuencias de Outbound: se prueba **con ellos y con contactos internos**, nunca con prospectos, cuando el CoS cierre el calendario. Nada que añadir por escrito aquí sin pisar su terreno.

## 4 · Newsletter — casos definidos, ejecución pendiente

Casos: (a) alta interna y baja desde el enlace del email, verificando que la baja se respeta en el siguiente envío; (b) el mismo email con mayúsculas/alias no recibe dos copias; (c) un contacto dado de baja de newsletter no entra en otras listas por error. Requiere: saber desde qué herramienta sale la newsletter (¿GHL? ¿Resend?) — pregunta abierta al CoS.

---

## Qué falta para cerrar el 28-oct

1. **Accesos** (lista única, sin cambios desde el 9-sep): token GHL · URL+API key de n8n · acceso o capturas de Events Manager y GA4. Con eso ejecuto T1.x, T5.3 y la verificación post-corte de n8n.
2. **Decisiones**: campo y parámetro del código de cuenta (T2.3) · herramienta de la newsletter (bloque 4) · ok de Landing a los arreglos T2.2/T2.4/T5.1.
3. Sin accesos el miércoles, la entrega será esta matriz con los PASA/NO PASA de código ya cerrados y los PENDIENTE listos para ejecutar en 1h con Maikel delante.
