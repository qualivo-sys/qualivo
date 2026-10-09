# LinkedIn lleva 7 días apagado, y es el canal que mejor convierte · 8-oct-2026

Encargo de Maikel: más reuniones cualificadas, solo email y LinkedIn. Al mirar LinkedIn
por HeyReach, que funciona por conector y no por clave de fichero, sale esto.

---

## 1 · Los números, del 15-sep al 8-oct

| Métrica | Valor |
|---|---:|
| Invitaciones enviadas | **207** |
| Invitaciones aceptadas | **103** |
| **Tasa de aceptación** | **49,8%** |
| Conversaciones iniciadas | 84 |
| Respuestas | 4 |
| **Tasa de respuesta** | **4,76%** |
| Leads únicos contactados | 208 |
| Etiquetados como interesados | 2 |

**Contra el correo frío:** su mejor semana fue **1,97%** (6 de 305) y en octubre lleva 285
envíos con 8 respuestas y **cero reuniones**.

LinkedIn responde a **2,4 veces** la tasa del correo frío.

**Honestidad sobre la regla de corte:** las 84 conversaciones se quedan justo por debajo
del mínimo de 100 que exige la regla, así que el 4,76% es prometedor pero **todavía no
decidido**. Lo que sí pasa el umbral con holgura son las **207 invitaciones**, y ahí el
49,8% de aceptación es un dato firme. No repito el error del 7-oct de dar por medido lo
que no lo está.

## 2 · Y está apagado

La serie diaria lo dice sin ambigüedad: actividad todos los días laborables del 17-sep al
**1-oct**, y desde el 2-oct **todo a cero**. Una respuesta suelta el 3-oct y nada más.
Hoy, cero.

**La causa:** el perfil remitente de LinkedIn ya no está conectado a HeyReach.
Comprobado por dos vías independientes:

- `get_all_linked_in_accounts` devuelve **totalCount 0**. No hay ni una cuenta conectada.
- Las 9 campañas apuntan todas a `campaignAccountIds: [201834]`, y pedir esa cuenta
  devuelve **404 NotFound**.

Sin remitente conectado, ninguna campaña puede enviar nada.

## 3 · Hay 376 personas congeladas a mitad de secuencia

| Campaña | Estado | Total | **En curso** | Terminados |
|---|---|---:|---:|---:|
| `605109` Qualivo · segundo toque LinkedIn | **PAUSED** | 377 | **262** | 106 |
| `436352` Q-Flow · LinkedIn Oleada 1 | **PAUSED** | 326 | **114** | 203 |

**376 personas a medio contactar** que no van a recibir el siguiente toque. Es
exactamente el mismo fallo silencioso que los 36 leads atascados de Smartlead del 6-oct:
nadie ve nada roto porque la campaña no da error, simplemente no sale nada.

Y la campaña `605109` es la de **segundo toque sobre gente ya tocada por email**, o sea
la pieza multicanal. Esa es la que más duele tener parada.

**Corrección a la rutina del SDR:** dice «4 campañas activas con copy conversacional v2
(572444, 567062, 562752, 557348)». Las cuatro están **FINISHED**. **Ninguna de las nueve
campañas está IN_PROGRESS.** El estado que describe la rutina es viejo.

## 4 · Cuatro respuestas sin contestar, y una está caliente

| Fecha | Quién | Qué dijo | Días |
|---|---|---|---:|
| **3-oct** | **Joaquín Castiella · LexaGo · CEO** | **«Pregunto a mi equipo»** | **5** |
| 30-sep | Mehdi Alaoui · ERA Group · Socio | «?» | 8 |
| 7-oct | Alberto Mayor | «👍» | 1 |
| 1-oct | Rafa Calle · magnettu · CEO | ver abajo | 7 |

**Joaquín es un CEO que dijo que lo consulta con su equipo y lleva cinco días sin
respuesta.** Es la misma pérdida por latencia que diagnostiqué en el correo frío,
pasando otra vez y a la vista.

## 5 · Un problema de calidad del copy, dicho por el propio destinatario

Rafa Calle, CEO de magnettu, contestó:

> «Hola Maikel, supongo que es la prospección con IA la que ha sacado la conclusión.
> **No invertimos 1€ en LinkedIn**»

Nuestro mensaje le dijo «con lo que invertís en LinkedIn…». **La señal era falsa.** Y
además él identificó el mensaje como prospección automática, que es justo lo que el copy
intenta evitar.

Dos cosas que arreglar en el copy de LinkedIn:

1. **La señal de inversión publicitaria no está verificada** como sí lo está en el motor
   de email. Si decimos «lo que invertís en LinkedIn» hay que haberlo comprobado.
2. **«Una duda que me ha surgido mirando X»** es primo hermano de «me han surgido
   hipótesis», que está en la lista de prohibidos de V3 por ser un rodeo. El mensaje
   abre con un hedge en vez de con el hecho.

## 6 · Qué hago y qué necesito

**Necesito de ti, y solo tú puedes:** reconectar el perfil de LinkedIn en HeyReach. Es
tu sesión de LinkedIn, no se hace por API. Cinco minutos.

**En cuanto esté conectado, yo:**

1. Reanudo `605109` y `436352` y los 376 congelados siguen su secuencia.
2. Contesto a Joaquín, Mehdi y Alberto. El de Joaquín va primero.
3. Corrijo el copy: la señal de inversión solo si está verificada, y el primer renglón
   sin rodeo.

**Y lo que no haría:** subir volumen de LinkedIn antes de pasar de 100 conversaciones
para poder aplicar la regla con muestra suficiente. Con 84 vamos a 16 de cerrar ese dato.
