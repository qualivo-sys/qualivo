# LinkedIn · Líneas de servicio (multicanal)

Segundo canal para las mismas cuentas de las campañas de email "líneas de
servicio" (Adelantta, PRL, Fincas) más olas 1-2. Preparado y ARRANCADO el 18-ago: campaña HeyReach 557348, estado IN_PROGRESS,
73 perfiles en cola, 18 invitaciones al día (~4 días de cobertura).

## Lo que ya está hecho

- **73 perfiles de LinkedIn** subidos a la lista de HeyReach
  "Líneas de servicio · multicanal ago26" (id 871142), recuperados del
  enriquecimiento de Apollo ya pagado (0 créditos nuevos).
- Cada lead lleva DOS campos personalizados construidos con las líneas de
  servicio reales investigadas en su web:
  - `nota`: la nota de invitación (todas bajo 300 caracteres, la más larga 281)
  - `msg1`: el mensaje tras aceptar, con el análisis por escrito como oferta
    y el enlace de calendario como cierre

## Ejemplo real (Contamar)

> **Nota de invitación**: Hola Oscar, he visto que en Contamar combináis
> gestión contable con asesoría jurídica mercantil. Ayudo a empresas con
> varias líneas a ver cuál genera el negocio de verdad. Te escribí también
> por email; me gustaría conectar. Un saludo, Maikel

## Secuencia al activar la campaña

1. **Invitación** con la nota personalizada ({{custom.nota}})
2. **Mensaje 1** al aceptar, +1 día ({{custom.msg1}})
3. **Mensaje 2** a +4 días si no responde: "¿Lo viste? El análisis es gratis
   y por escrito. Si no toca, dime más adelante y no insisto."

## Nota operativa

La cuenta estaba Available (el isActive=false de la API solo significaba
sin campañas activas). La secuencia usa las variables {{nota}} y {{msg1}}
de los campos personalizados, con mensajes de respaldo sin variables por
si alguna no resuelve. Verificar en las primeras invitaciones de mañana
que la nota personalizada renderiza bien (lo revisa el triaje diario).
La campaña Q-Flow antigua (pausada) no se ha tocado.

## Por qué multicanal ahora

El email de estas cuentas ya está en vuelo: la invitación de LinkedIn que
menciona "te escribí también por email" convierte dos toques fríos en una
presencia coherente. Y con agosto de vacaciones, la invitación espera en
LinkedIn hasta la vuelta sin quemar nada.
