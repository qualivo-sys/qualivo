# Despliegue de las 6 oportunidades SDR del 21-ago

Las seis oportunidades aprobadas del informe del 21 de agosto salen por los
dos canales a la vez. El email lleva el argumento largo; LinkedIn llega con
la misma observación en corto y sirve de segundo toque cuando el correo se
queda en la bandeja sin abrir.

## Email · Smartlead 3835362

Campaña **SDR · Señales de crecimiento (21-ago)**, activa desde el 21-ago.

- **Remitentes**: 3 buzones @goqualivo.com (18811459, 18807275, 18807274).
- **Ritmo**: laborables 9:00-18:00 Europe/Madrid, 25 min entre correos, tope
  6 nuevos/día. Con 6 leads salen todos el mismo día.
- **Secuencia**: email 1 personalizado uno por uno vía `{{subject1}}` /
  `{{body1}}` en `custom_fields`; emails 2 y 3 genéricos, mismo hilo, a +3 y
  +4 días.
- **Carga**: 6 subidos, 0 duplicados, 0 bloqueos, 0 emails inválidos.

## LinkedIn · HeyReach 562752

Campaña **SDR · Señales de crecimiento (21-ago)**, lista 878729, cuenta
201834 (Maikel). Activa desde el 21-ago con los 6 perfiles en curso.

Árbol de la secuencia:

1. `VIEW_PROFILE` inmediato. Visita antes de pedir conexión: sube bastante la
   tasa de aceptación y deja rastro de que hay una persona detrás.
2. `CONNECT` a +1 día con `{nota}`, la solicitud escrita a mano por lead
   (240-277 caracteres, tope de LinkedIn 300). Se retira sola a los 25 días
   si no la aceptan, para no acumular invitaciones pendientes.
3. Si aceptan: `MESSAGE` a +1 día con `{msg1}`, el mensaje largo con la
   observación concreta y una pregunta abierta (420-452 caracteres).
4. Si no contestan: `MESSAGE` de cierre a +4 días, igual para todos, que da
   la conversación por cerrada sin insistir.
5. Si no aceptan la invitación, `END` a +5 días. Sin InMail ni segundo
   intento.

### Dos cosas que costaron encontrar

- **Llave simple, no doble**. `{nota}` funciona; `{{nota}}` imprime las
  llaves literalmente en el mensaje. Es el mismo fallo que salió en la
  campaña de líneas de servicio y que Maikel vio en su bandeja.
- **El campo al subir leads es `customFields`**, no `customUserFields`. La
  API acepta el segundo sin quejarse y devuelve `addedLeadsCount: 6`, pero
  los campos quedan vacíos y los mensajes se envían con el texto de reserva.
  Se detectó releyendo la lista antes de que saliera la primera invitación.
- **`campaign/UpdateSequence` no acepta una lista de pasos**: la secuencia es
  un árbol de nodos anidados (`unconditionalNode` / `conditionalNode`) y todo
  camino tiene que terminar en `END`. Cualquier otra forma devuelve un 500
  sin explicación. La forma buena se saca de
  `GET campaign/GetCampaignSequence` de una campaña que ya funcione.
- **`StartCampaign` quiere el `campaignId` en la query**, no en el cuerpo.

### Los fallbacks

Los seis leads tienen sus dos campos rellenos, así que el texto de reserva no
debería usarse nunca. Aun así está escrito sin variables (la API rechaza un
`fallbackMessage` que las lleve) y es genérico pero honesto, por si entra
alguien nuevo a la lista más adelante.

## Las seis

| Empresa | Persona | Señal |
|---|---|---|
| Dost | Fernando Martín | Serie A y equipo de 7 personas para Reino Unido |
| Club Pilates Spain | Jorge Lago | de 29 a 40 centros: Zaragoza, Alicante, Palma, Málaga |
| Eholo | Sonia Torras | alianzas con 5 Colegios de Psicología |
| tugesto | Rubén Muñoz | autónomos y gestorías por el mismo formulario de demo |
| Carralero Clínica Dental | David Carralero | 20 aniversario, dos píxeles de Meta y un GA apagado |
| Joppy | David Mundo | ronda, compra de Rviewer y cuatro hubs europeos |

## Rutina

Creada la rutina **Agente SDR autónomo**, laborables a las 8:00 de Madrid:
busca señales frescas, cualifica con score 0-100, escribe hipótesis y
secuencias completas, y deja el informe en `sdr/` esperando el ok. No activa
nada por su cuenta.
