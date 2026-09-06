# Campaña de reactivación de cartera pasada · Septiembre 2026

> Encargo del cerebro (6-sep, aprobado por Maikel). Objetivo: subir el recurrente de ~4.100 €/mes a ~6.800 €/mes sin depender de captación fría. Objetivo del mes según cerebro.md v3: **1 cliente recurrente nuevo de 1.000-1.500 €/mes** — esta campaña es el camino más corto.
> Regla: **todos los mensajes son borradores; los envía Maikel.** Nada se autoenvía.
> Fuentes de los datos: llms.txt y casos publicados de la landing (`claude/qualivo-landing-vercel-nubk1i`), ramas de proyecto de cada cliente, y el encargo del cerebro. Lo que no está en ninguna fuente va marcado `[PARA CEREBRO]` — no hay ningún número inventado.

## Ficheros

- `fichas.md` — dossier por cliente: qué se hizo, resultado real, por qué se paró, gancho de hoy.
- `mensajes.md` — borrador de mensaje personalizado por cliente (WhatsApp/email), listo para que Maikel lo revise, complete los huecos marcados y lo envíe.

## Orden de prioridad (los 5 primeros)

| # | Cliente | Por qué primero |
|---|---|---|
| 1 | **Inspyria** | No hay que reactivar nada: **ya han pedido hablar** (pipeline del cerebro, 2-sep, "reunión por agendar"). Cliente pasado + demanda entrante = la probabilidad más alta de toda la lista. Solo hay que poner fecha esta semana. |
| 2 | **Nuria Roure** | Relación reciente y viva: checkout Redsys→ThriveCart construido y la integración Ringover→GHL operativa, cuya **Fase 2 (transcripción + IA de llamadas) quedó escrita y sin ejecutar** — el gancho de IA no es un pitch, es retomar algo ya pactado. Y el caso tiene número: 2.000 € → 12.900 € (6,45x). |
| 3 | **VegLiss** | Hay activo construido (flows de Klaviyo: bienvenida, carrito y producto abandonado) que genera valor medible cada mes. Gancho natural de IA en e-commerce (atención + recuperación). Falta el dato de € atribuidos a los flows `[PARA CEREBRO]`. |
| 4 | **Focus Practical** | Caso publicado con números fuertes (CPL −53%, cursos cortos a 2,86 €/lead, lead al CRM en ~8 s) y vertical formación, donde Qualivo tiene la mejor artillería. Reactivar campañas de captación de temporada + agente de primer contacto es una continuación lógica. |
| 5 | **BelloVinilo** | 3.600 € → 30.000 € (8,3x) con sistema construido desde cero: el cliente ya vio el retorno una vez. Gancho: el sistema que se construyó en 2024/25 hoy se opera con agentes por menos coste. |

**Razonamiento general:** primero quien ya mostró intención (Inspyria), después quien tiene un siguiente paso ya escrito (Nuria), después quien tiene activos nuestros en producción (VegLiss), y después los casos con mejor número y encaje vertical (Focus, BelloVinilo). Los grandes (Adigital, Selectra, Cloud District) tienen ciclos largos de decisión — mal encaje con "caja en noviembre". Los infoproductores (Miquel Baixas, The Hit, Formación Ninja) dependen de la relación personal de Maikel: mensajes cortos de relación, no de oferta.

## Estimación de cierre (opinión del agente, no dato)

- **Más probable que cierre algo en septiembre:** Inspyria (reunión ya pedida) y la subida de EAC (`ventas/pricing/`).
- **Más probable como cliente recurrente 1.000-1.500 €:** Nuria Roure (Fase 2 + growth partner) o Focus Practical (temporada de matrículas).
- **Apuesta de volumen:** con 13 mensajes enviados y la tasa 5-10x de cartera propia, esperar 3-5 conversaciones y 1-2 propuestas en 2 semanas.

## Proceso

1. Maikel revisa `mensajes.md`, completa los huecos `[PARA CEREBRO]` que solo él conoce (motivo real de la parada, relación personal) y envía por el canal indicado.
2. Cada envío se registra en `ventas/seguimiento.md` con cadencia 3-7-14.
3. Toda respuesta entrante se contesta en <2h (directriz vigente) y se reporta con `[PARA CEREBRO]` si abre dinero.
