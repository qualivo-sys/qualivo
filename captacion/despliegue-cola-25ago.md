# Despliegue de la cola aprobada · 25 de agosto de 2026

Maikel aprueba en bloque el 25 de agosto ("dale, lo que consideres"). Se
ejecuta todo lo que llevaba entre uno y cuatro días escrito y parado.

## Respuestas enviadas a mano (LinkedIn)

- **Oscar Martínez, Contamar Asesores**. Contestada su petición del 21 de
  agosto de casos reales de asesorías con métricas. Se envía la versión
  honesta: no existe un dossier de asesorías con números, se le dice tal
  cual, y se le ofrece a cambio el análisis escrito de su propio recorrido
  comercial como prueba. También se le quita de en medio la palabra "growth",
  que era lo que le hacía dudar del encaje. De paso queda registrado su
  email: `omce@contamar.com`.
- **María Carrascal, Emana Formación**. Aceptó la invitación con un límite
  explícito ("encantada de conectar si no es para que me vendas nada"). Se
  respeta entero: cero venta, cero enlace de calendario, solo el interés
  profesional por el contraste entre su formación abierta y sus proyectos de
  transformación a medida, y la puerta abierta.

## LinkedIn · campaña HeyReach 567062 "Cola aprobada 25-ago"

Ocho perfiles, lista 885119, cuenta 201834. Misma secuencia que las
anteriores: visita, invitación con nota a mano a +1 día, mensaje largo a +1
día si aceptan, cierre a +4 días, y fin si no aceptan.

| Persona | Empresa | Gancho |
|---|---|---|
| Alfredo Alonso Quintana | Farmaconsulting | 2.800 transacciones, cinco oficinas y cuatro líneas de servicio |
| Samuel Toribio | Caterina Corporate House | RRHH corporativo y nómada digital por el mismo embudo |
| Isabel Osorio | Atipika | cuatro portales más web propia, cuatro líneas de negocio |
| Rafael Zurita | Muñoz Zurita Asesoría | extranjería urgente frente a fiscal recurrente |
| Miguel Navarro | Seis Solar | altas nuevas frente a recompra del instalador |
| Luis Damas | Consultorfarma | salida de Andalucía a Madrid y Cataluña |
| Nabil Salah | Harper & Neyer | primera tienda full price y plan de aperturas |
| Ricard Garriga | Trioteca | Centro de Estudios y dos rutas de entrada |

## Email · campaña Smartlead 3848494 "SDR · Expansión y contenido (25-ago)"

Los dos que tienen email verificado y no catchall: Nabil Salah y Ricard
Garriga. Tres emails cada uno, **los tres personalizados uno a uno** vía
`custom_fields` (`subject1`/`body1`/`body2`/`body3`), no solo el primero.
Remitentes: los tres buzones de goqualivo al 100% de reputación. Ritmo de 5
nuevos al día, así que salen los dos hoy.

Los otros seis no llevan email: tres ya están en secuencia de otra campaña y
no se tocan, dos son de dominio catchall o no verificado, y Consultorfarma no
tiene ninguna dirección en Apollo.

## El fallo de HeyReach, ahora entendido del todo

Los campos personalizados de una lista **tardan un par de minutos en
aparecer**. Las lecturas inmediatas devuelven `customFields: []` aunque la
escritura haya ido bien, y eso lleva a repetir el alta pensando que ha
fallado. Hoy costó cinco intentos, una lista duplicada tirada (885130) y una
pausa de campaña.

Lo aprendido, para no repetirlo:

1. En **listas** el campo se llama `customFields`. En **campañas**
   (`campaign/AddLeadsToCampaignV2`) se llama `customUserFields`. Son
   distintos y no son intercambiables.
2. Tras subir leads con campos, **esperar dos minutos antes de verificar**.
   Antes de eso la lectura miente.
3. Pausar es `campaign/Pause?campaignId=`, reanudar es
   `campaign/Resume?campaignId=`. `PauseCampaign` y `StopCampaign` dan 404.
4. `campaign/GetLeadsFromCampaign` no devuelve los campos personalizados
   nunca. Para verificar hay que leer la lista, no la campaña.
