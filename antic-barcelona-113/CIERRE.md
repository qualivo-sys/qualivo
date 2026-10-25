# Inventario de cierre · Antic Barcelona 113

**Fecha:** 25 de octubre de 2026
**Motivo:** el cliente deja de trabajar con Qualivo.
**Alcance de este documento:** inventario para que Maikel decida. **No se ha apagado nada, no se ha borrado nada y no se ha contactado con nadie.**

Cada dato va marcado **[C]** confirmado o **[E]** estimado. Esta sesión **no tiene credenciales** de Meta, Google Sheets ni n8n, así que todo lo que dependa de consultarlas va como [E]. Lo público sí lo he comprobado en vivo hoy.

---

## ⚠️ Lo urgente, antes del inventario

**El formulario sigue vivo y sigue recogiendo datos personales.** Comprobado hoy: `POST /api/lead` responde y escribe en la hoja de Google **[C]**. Si alguien entra por un enlace antiguo, una historia de Instagram o el PDF de la guía, su nombre, teléfono, email e IP se guardan en una hoja de un cliente que ya no lo es.

No lo he tocado porque el encargo dice que no apague nada. **Es la primera decisión que hay que tomar**, y antes que cualquier otra de esta lista.

Segundo punto del mismo orden: la página `/privacidad` que servimos nosotros sigue nombrando **info@anticbarcelona113.es** como contacto de protección de datos **[C]**. Estamos publicando una dirección del cliente en una web que controlamos nosotros.

---

## 1 · Accesos que tenemos del cliente

| Activo | Identificador | Quién lo dio | Qué hacer |
|---|---|---|---|
| Cuenta publicitaria Meta | `act_1581533106801110` | **[E]** Ahmed, dando acceso de socio al Business Manager | Retirar a Qualivo como socio |
| Página de Facebook | `383844784821243` | **[E]** Ahmed | Retirar acceso |
| Instagram | `17841469981930192` | **[E]** Ahmed | Retirar acceso |
| Píxel de Meta | `1002102899517167` | **[E]** Ahmed | Es del cliente; se queda con él |
| Token de Meta | guardado solo en el scratchpad de sesión, **nunca en el repo** **[C]** | Qualivo | Revocar |

`dsa_payor` y `dsa_beneficiary` son «Antic Barcelona 113» **[C]**, lo que apunta a que **la inversión publicitaria la paga el cliente** y no nosotros. Conviene confirmarlo mirando el método de pago de la cuenta.

### Infraestructura que es nuestra, no suya

| Activo | Dónde | Nota |
|---|---|---|
| Proyecto Vercel | `antic-barcelona-113` | Cuenta de Qualivo. El enlace a git se desconectó en septiembre tras un incidente **[C]** |
| Hoja de Google (CRM) | `11-rbXqLFf9rnHYNmvvTv_OkTeuzQ4y-dBf3H4n2O3YM` | **[E]** propiedad de una cuenta de Qualivo, no del cliente |
| Service account de Google | `apiclaude@kinetic-dream-377917` | Proyecto de Qualivo |
| n8n | `qualivo.app.n8n.cloud` · 3 workflows | Cuenta de Qualivo. EAC los está desactivando sin borrarlos |
| Repositorio | rama `claude/antic-barcelona-campaign-627pq7` | Privado, de Qualivo |

**Pendiente de seguridad, independiente de este cierre:** la clave del service account `apiclaude@kinetic-dream-377917` viajó por chat en septiembre. Hay que borrarla en Google Console → IAM → Claves, se cierre esta cuenta o no.

### Dominios

| Dominio | De quién | Estado |
|---|---|---|
| `anticbarcelona113.es` | **Del cliente** | WordPress con Elementor sobre Apache/PHP, correo en OVH. **No lo tocamos nosotros** **[C]** |
| `antic-barcelona-113.vercel.app` | **Nuestro** | Es donde vive todo el embudo **[C]** |
| `anticbarcelona113.com` | **[E]** del cliente | Sin registros MX ni A: no recibe correo ni sirve web **[C]** |

---

## 2 · Qué sigue publicado a nuestro nombre

Comprobado en vivo hoy, 25-oct **[C]**:

| Recurso | Estado | ¿Recoge datos? |
|---|---|---|
| `/` landing | 200 | No |
| `/cuestionario` | 200 | **Sí** — es el formulario principal |
| `/guia` | 200 | **Sí** — pide email para el PDF |
| `/crm` | 200 | Panel interno, protegido por contraseña |
| `POST /api/lead` | 400 con cuerpo vacío = **validación viva y endpoint operativo** | **Sí — escribe en la hoja** |
| `/privacidad` | 200 | No, pero nombra al cliente como responsable |
| PDF de la guía | `/descargas/guia-mesa-perfecta-antic-barcelona-113.pdf` | No |

**El píxel del cliente sigue cargando en nuestras páginas** tras aceptar cookies **[C]**, así que el tráfico que llegue sigue alimentando sus públicos de retargeting.

**Campañas de Meta:** las 2 campañas y los 3 conjuntos quedaron en `PAUSED` el 23-sep, verificado por API el 30-sep **[C]**. **No están borradas** y **[E]** siguen pausadas: nada las reactiva solo.

**n8n:** los 3 workflows (aviso de lead, seguimiento diario a las 10:00, vigilante web cada 10 min) los está desactivando EAC sin borrarlos.

---

## 3 · Datos personales que guardamos

**17 leads** captados entre el 15 y el 22 de septiembre **[C]**.

### Dónde están

| Ubicación | Qué contiene | Retención |
|---|---|---|
| **Hoja de Google (CRM)** | La copia principal: nombre, teléfono, email, IP, user-agent, `fbclid`, más las notas comerciales de Ahmed | Indefinida |
| **Ejecuciones de n8n** | Los mismos datos en los payloads de cada webhook | **[E]** según el plan |
| **Buzón de `info@maikelechevarria.com`** | Los correos que se enviaron **a los leads** salieron de la dirección de la agencia, no del cliente **[C]** | Indefinida |
| **Logs de funciones de Vercel** | **[E]** pueden incluir cuerpos de petición | **[E]** corta, por plan |
| **Públicos personalizados de Meta** | Listas de retargeting construidas con el tráfico de la web | En la cuenta **del cliente** |

### Las 33 columnas de la hoja incluyen

`nombre · telefono · email · ip · user_agent · fbclid`, además de `notas`, que contienen detalle comercial sobre personas identificables.

### El punto que conviene resolver bien

En esta relación **el responsable del tratamiento es Antic Barcelona 113 y Qualivo actuaba como encargado**. Al terminar, lo normal es **devolver los datos al cliente y después borrarlos de nuestros sistemas**, dejando constancia. Son 17 personas que dieron su consentimiento a una ebanistería, no a nosotros.

No es una conclusión jurídica cerrada y no la decido yo: depende de qué firmasteis. Pero la hoja, los payloads de n8n y el buzón no deberían quedarse en la infraestructura de Qualivo de forma indefinida sin decidirlo.

---

## 4 · Facturación pendiente

Lo que sé, con poca certeza — **no tengo acceso a facturación ni al contrato**:

- **Modelo a comisión** sobre venta cerrada **[C]**.
- **0 ventas** en todo el periodo **[C]** → **[E]** no hay comisión que facturar.
- **175,06 €** de inversión en Meta **[C]**, **[E]** pagados por el cliente: `dsa_payor` es Antic Barcelona 113. **Confirmar de qué tarjeta salió.**
- Coste de Vercel, n8n y Google: infraestructura de Qualivo, **[E]** nunca repercutida al cliente.
- **Sin acceso** para saber si hubo cuota de alta, mínimo mensual o algo firmado al margen de la comisión.

---

## 5 · Qué conviene entregar al cliente

Trabajo pagado o hecho sobre su marca. Yo lo entregaría:

| | Qué es |
|---|---|
| **Los 17 leads** | Export de la hoja. Es lo primero: son contactos comerciales suyos, y varios siguen abiertos |
| **Creatividades** | 10 estáticos 4:5 en `creatividades/meta/`. Los dos Reels que mejor funcionaron ya son suyos: salieron de su Instagram |
| **Copys** | Los 10 textos con titular y descripción, en `scripts/meta/config.json` |
| **Guiones de vídeo** | 5 en el repo, 8 en Notion. Sirven los grabe quien los grabe |
| **Guía en PDF** | «Cómo elegir la mesa perfecta», maquetada con su marca |
| **Informe de septiembre** | Cifras, aprendizajes y el hallazgo del desajuste de precio |
| **Lógica del cuestionario** | Las preguntas y los tramos de precio, por si lo reaprovechan |

**No entregable:** tokens, claves ni el service account. Son credenciales de Qualivo, no activos del cliente.

### Lo que tiene valor para ellos aunque no lo pidan

Dos conclusiones que les costaron un mes y 175 €:

1. **Sus propios Reels rinden el doble que las creatividades de agencia** — 0,15-0,19 €/clic frente a 0,29-0,36 € **[C]**.
2. **El 50 % de los leads del cuestionario chocaron con el precio** porque ningún anuncio lo mencionaba **[C]**. Quien siga con esto, que lo sepa.

---

## Orden que propongo

1. **Decidir qué pasa con `/api/lead`** — hoy sigue recogiendo datos personales.
2. **Quitar la dirección del cliente** de la página de privacidad que servimos.
3. **Entregar los 17 leads** y acordar el borrado.
4. Retirar accesos de Meta y revocar el token.
5. Borrar la clave del service account (toca igual, por seguridad).
6. Confirmar quién pagó los 175,06 € y si queda algo por facturar.
7. Entregar creatividades, copys y guiones.

Los pasos 1 a 3 son los que tienen consecuencias si se dejan correr. Del 4 al 7 pueden esperar unos días.
