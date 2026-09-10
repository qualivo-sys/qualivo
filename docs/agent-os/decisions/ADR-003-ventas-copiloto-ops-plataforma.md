# ADR-003 · Ventas se convierte en copiloto y Automatización en plataforma

**Fecha** 2026-09-10 · **Estado** propuesta · **Resuelve** hallazgo H9

**Contexto.** Dos agentes fichados en `cerebro.md` con rama y encargo, que Maikel no usa. Uno
tiene pendiente y sin ejecutar el encargo de mayor valor: subir el recurrente de 4.100 a 6.800.

**Diagnóstico.** No es un fallo de configuración. En Qualivo el que vende es Maikel, así que un
agente que intenta cerrar compite con él y no se usa.

**Decisión.** Ninguno se retira.
- **Ventas → Sales, copiloto.** Prepara la reunión, redacta la propuesta en 48 h, persigue a 3-7-14
  días, mantiene el pipeline. Precio, alcance, plazo y firma siguen siendo de Maikel.
- **Automatización → Ops, plataforma.** Se le da lo que hoy no tiene dueño: salud de rutinas,
  secretos, workflows, mapa de n8n e integridad del repo.

**Consecuencias.** El encargo de expansión recupera ejecutor. Los peores hallazgos (H4, H7)
adquieren dueño. Alternativa descartada: retirarlos, que habría dejado esas responsabilidades
huérfanas otra vez.
