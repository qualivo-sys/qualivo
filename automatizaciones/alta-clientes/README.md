# A1 · Alta de cliente en un clic

Automatización del [playbook de alta de clientes](../../playbooks/alta-clientes/README.md).
**Estado: APAGADA**, lista para importar. No escribe al cliente: solo a Todoist, a Notion y a Maikel.

```bash
curl -sS -X POST "https://qualivo.app.n8n.cloud/webhook/clientes/alta" \
  -H "Content-Type: application/json" -H "X-Qualivo-Token: $QUALIVO_AVISOS_TOKEN" \
  -d '{"cliente":"Aula Inmobiliaria","fecha_firma":"2026-10-30","contacto":"Olga","servicio":"Captación + CRM + BI","variante":"larga"}'
```

Qué hace:

1. **Todoist:** crea el proyecto `Cliente · <Nombre>` (tablero) con las 26 tareas del playbook, fechadas desde el día 0 (los fines de semana pasan al lunes) y etiquetadas por responsable (`maikel`, `automatización`, `growth`, `cfo`, `chief-of-staff`). Con `variante: "larga"`, todo lo que va desde la semana 2 se retrasa 7 días.
2. **Notion:** crea `<Nombre> · Client OS (interna)` bajo *02 · Clientes*, con la ficha, la lista de accesos, las 3 condiciones de la puesta en marcha y las secciones vacías. El resto de la estructura se copia de la plantilla.
3. **Aviso a Maikel** por [Avisar a Maikel](../../docs/agentes/avisar-a-maikel.md) con los enlaces.

La página para el cliente («tu plan de arranque») se duplica a mano desde la plantilla: se comparte con él y no debe salir sin que Maikel la lea.

Probado en local: con firma el viernes 30-oct-2026 salen 26 tareas; la puesta en marcha cae el 17-nov y la revisión el 23-nov. Sin `fecha_firma`, da error.

## Para encenderlo

1. Importar `workflow.json` en `qualivo.app.n8n.cloud`.
2. Credenciales: `Qualivo · Todoist (Bearer)` (*Header Auth* `Authorization: Bearer <token de Todoist>`), `Qualivo · Notion (Bearer)` (*Header Auth* `Authorization: Bearer <secreto de una integración interna>`, con la integración invitada a la página *02 · Clientes*) y `Qualivo · Avisos agentes (X-Qualivo-Token)`, la misma de Avisar a Maikel.
3. Probarlo con un cliente ficticio («Prueba SL») y borrar después el proyecto y la página; el borrado lo hace Maikel.
