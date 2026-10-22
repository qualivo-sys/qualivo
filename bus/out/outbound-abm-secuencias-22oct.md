# Outbound → Chief of Staff · secuencias del piloto ABM montadas en borrador (22-oct)

Respuesta al encargo del 22-oct, que pide la entrega el viernes 23 a las 18:00. **No se ha enviado nada a ningún prospecto y ninguna campaña está activa.** Los nombres de las personas solo están en Notion.

## 1. Campañas en Smartlead, en borrador

| Campaña | Id | Estado | Leads | Secuencia |
|---|---|---|---:|---|
| ABM · Formación · anuncios en Meta (BORRADOR, no activar) | 4213037 | DRAFTED | 2 | 4 correos: días 0, 3, 7 y 12, con el texto de las secciones 3 y 5 del documento de Staff |
| ABM · Reformas · anuncios en Meta (BORRADOR, textos el 26-oct) | 4213038 | DRAFTED | 6 | Sin secuencia todavía: se carga cuando Growth y Copy entreguen los textos el lunes 26 |

Enlace a cada una: `https://app.smartlead.ai/app/email-campaign/<id>/overview`.

**Configuración de las dos:**
- **Buzón:** maikel@novaqualivo.com. Reputación al 100%, calentado y con capacidad para 30 envíos al día.
- **Envíos:** texto plano, sin seguimiento de aperturas ni de clics, y como mucho 10 leads nuevos al día.
- **Horario:** de lunes a viernes, de 9:00 a 17:00, hora de Madrid.
- **Paradas:** la secuencia se para en cuanto la persona responde. Las bajas y los rebotes se paran por la lista de bloqueo global.

**Variables por cuenta** (campos del lead):
- `saludo`: «Hola, Nombre:» solo si el nombre está verificado; si no, «Hola:».
- `apertura_anuncio`: el anuncio comprobado y su destino, tal como figura en Notion.
- `programa`: solo en formación.
- `canal_principal` y `origen`.

**El enlace de formación** va como URL completa, porque el correo sale en texto plano. Es /formacion/ con las UTM del documento: `utm_source=email&utm_medium=outbound&utm_campaign=abm-formacion&utm_content=formacion-v22`.

## 2. Prueba interna

El 22-oct a las 14:15 se mandaron los correos 1 y 2 de formación a maikel@qualivo.io, con las variables de Postal3. **Llegaron a la bandeja de entrada, no a spam**, y el correo 2 va en el mismo hilo («RE: Una idea sobre vuestros anuncios»).

## 3. Las 10 cuentas y su canal principal

| Cuenta | Sector | Canal principal | Tipo de email | Estado |
|---|---|---|---|---|
| AcademiaPostal Tres | Formación | Email | Personal verificado | Cargada en 4213037 |
| Centro de Estudios Kuma | Formación | Email | Buzón de cargo (coordinador@) | Cargada en 4213037. Ojo: puede vernos como competencia |
| Grupo Inventia | Reformas | Email | Personal verificado | Cargada en 4213038 |
| Grupo LyN | Reformas | Email | Personal, dominio catch-all | Cargada en 4213038; riesgo de rebote |
| Reforma T360 | Reformas | Email | Genérico (hola@) | Cargada en 4213038. Mejor por LinkedIn al director comercial cuando haya cuenta |
| Atehome | Reformas | Email | Genérico (info@) | Cargada en 4213038; el decisor está publicado en su web |
| Urban Project Barcelona | Reformas | Email | Genérico (administracion@) | Cargada en 4213038. Mejor por LinkedIn al gerente cuando haya cuenta |
| Finalis Reformas | Reformas | Email | Genérico (info@) | Cargada en 4213038; sin decisor |
| **Duchanet** | Reformas | **Pendiente** | — | **Smartlead la rechaza:** hola@ ya se contactó en agosto desde la campaña de Construcción, el correo rebotó y la dirección está bloqueada |
| **Grup Gres** | Reformas | **Pendiente** | — | **Igual que Duchanet:** info@ se contactó en agosto, rebotó y está bloqueada |

**Para Growth:** Duchanet y Grup Gres ya recibieron un correo frío de Qualivo en agosto, aunque no estén en el CRM. Hace falta otro contacto (LinkedIn o teléfono) o sacarlas del piloto.

## 4. LinkedIn: bloqueado

HeyReach sigue con **0 cuentas de LinkedIn conectadas** (comprobado el 22-oct a las 14:20). No se puede crear la campaña de LinkedIn hasta que Maikel reconecte su cuenta. Los textos están listos en la sección 4 del documento de Staff: invitación, primer mensaje después de revisar el perfil a mano y un único seguimiento a los 5-7 días. Se montan el mismo día de la reconexión.

**Consecuencia para formación:** sin LinkedIn no hay contacto el día 5, así que el correo del día 7 sale siempre. Si se reconecta y se manda una invitación el día 5, el lead se pausa a mano antes del día 7. Smartlead no puede quitar ese correo automáticamente.

## 5. Buzón, herramienta y quién contesta

- **Buzón:** maikel@novaqualivo.com, no qualivo.io.
- **Herramienta:** Smartlead, con parada automática al responder.
- **Quién contesta:**
  - Outbound revisa las respuestas cada hora, de lunes a viernes.
  - Con cada respuesta, aviso al móvil de Maikel y borrador con la respuesta de la sección 5 que toque.
  - Las respuestas automáticas se pausan y se revisan a mano.
  - Antes de cada envío se revisa el estado de cada lead.

## 6. Lo que queda

- **Viernes 23, 13:00:** si Growth cambia la versión de formación (la regla del día 5 frente al día 7 o lo del «cliente de prueba»), actualizo la secuencia de 4213037. Se puede hacer porque la campaña está en borrador y todavía no ha enviado nada.
- **Lunes 26:** cargar los textos de reformas en 4213038.
- **Para activar:** el ok de Maikel. Activar es arrancar la campaña en Smartlead.
