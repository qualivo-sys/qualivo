# Revisión Paid · landing formación v2.1 (13-oct-2026)

URL revisada: `https://qualivo.io/formacion/v21/?utm_content=formacion` (borrador, banner "BORRADOR V2.1 · sin publicar"). Leída el 13-oct 08:40 UTC como texto renderizado; no he podido medir velocidad ni comprobar el píxel (la descarga directa desde el entorno falló por TLS; no es dato de la web).

Dos usos que propone Maikel: (A) destino del anuncio 3V2 formación en un test contra el formulario nativo V2b; (B) página a la que redirigir a quien ya ha dejado el formulario.

## Veredicto

Sirve para los dos usos, pero **no con el mismo recorrido**. Para tráfico frío de pago hay que acortarla y añadir las preguntas de tamaño; para leads que ya han rellenado el formulario hay que quitar el formulario y dejar vídeo, prueba y agenda.

## Lo que está bien

- Titular y pre-titular nombran el vertical y la tesis: "Para academias y centros de formación" / "Del primer anuncio a la matrícula". Coherente con el gancho del 3V2 (el problema no es el anuncio, es lo que pasa después).
- VSL de 5:38 con gancho "100 contactos… ¿y clientes?": es exactamente la tesis a contrarrestar (más leads ≠ más clientes).
- Prueba con dos casos de formación y enlace a caso completo (EAC). Sección problema ("No basta con conseguir solicitudes") alineada con el dolor declarado en formación (anuncios / respuesta).
- Prueba de llamada con Raquel: demo real, nadie más la tiene. FAQ honesta (presupuesto depende; la inversión en medios se paga a la plataforma).
- Formulario en 3 pasos con "objetivo principal" como primera pregunta: buena para cualificar intención.

## Lo que hay que arreglar antes de mandar un euro

1. **Borrador visible**: banner "BORRADOR V2.1" y dos campos con placeholder "No preguntado (formación v2.1)" dentro del formulario. Fuera.
2. **Faltan las preguntas de tamaño del funnel v2**: el formulario pregunta centro, web y objetivo, pero no solicitudes/mes, ticket, decisor ni momento. Sin ellas el webhook no reconoce el envío como v2 (claves `decisor` + `solicitudes`), no pone `fit-paid-*` y **el test landing vs formulario nativo no es comparable**. Mínimo: solicitudes/mes y ticket en el paso 1 (dos desplegables), decisor y momento en el paso 2 o inferidos.
3. **Demasiado larga para frío**: héroe → VSL → casos → problema → 5 pasos → panel → Raquel → alcance → formulario → FAQ. El formulario está a 8 pantallas en móvil. Para la versión de pago: héroe + VSL + prueba + formulario; panel, Raquel y alcance debajo del formulario.
4. **Precio ausente**: la decisión de Maikel fue precio en landing / paso 2 ("desde 1.200 €"). Hoy el precio solo aparece en `/gracias/`. Una línea junto al formulario o en la FAQ de presupuesto basta y filtra antes de la reunión.
5. **Cifras sin fuente ni fecha**: 10,2× ROAS, 44.000 €, 1.160 solicitudes, 21 matrículas. Regla de oro: valor, fuente y fecha ("marzo 2026, cuenta publicitaria + CRM del cliente"). Y el muro de 16 logos: solo clientes reales con permiso; Meta no lo revisa, pero un lead que conozca a uno de ellos sí.
6. **Medición**: evento Lead del píxel al enviar el paso 2 (no al cargar), evento Schedule al reservar, `utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{placement}}` guardados en GHL. La comparación con el formulario nativo se hace en GHL por etiqueta de origen, no en Meta: el píxel pierde un 20-30 % de atribución frente al lead nativo.
7. **Velocidad**: VSL + 16 logos + capturas. Pedir PageSpeed móvil ≥ 70 antes de activar; una landing que tarda 5 s en 4G duplica el CPL antes de empezar.

## Uso B: redirigir a quien ya dejó el formulario

No a esta página tal cual: pediría rellenar el formulario otra vez. Ayer mismo un contacto de julio reenvió el formulario y no recibió primer toque. Propuesta: misma URL con `?lead=1` (o `/formacion/v21/lead/`) que oculte el formulario y muestre VSL + casos + Raquel + agenda directa. Es la "página de prellamada" que le copiamos a Impulso, con el vídeo que ya existe. El enlace iría en el WhatsApp de confirmación (hoy solo lo lleva el `funnel-v2`) y en el W2 de quien no ha reservado.

## Diseño del test (uso A), para decidir con Maikel

- Secuencial, no partido: 30 €/día no da para dos brazos simultáneos con lectura (lo dije el 7-oct). Opción: 7 días formación 3V2 → landing a 15 €/día, manteniendo el V2b nativo de referencia (ya tiene 5 leads / 56 €).
- Alternativa si Maikel quiere simultáneo: duplicar el conjunto formación 3V2 con destino landing a 15 €/día y pausar clínicas VIEJO esa semana. Decisión de Maikel.
- Lectura: coste por lead **tipo B** y coste por **cita confirmada**, en GHL. Esperable: CPL de landing 2-3× el nativo (35-60 € frente a 11-13 €), con mayor % de B y mayor asistencia. Si el coste por cita de la landing no baja del nativo en 150 € por brazo, gana el nativo.
- Muerte: 150 € por brazo o 8 leads, lo que llegue antes. Fecha: si arranca el 15-oct, lectura el 26-oct, junto con el resto del funnel v2.
