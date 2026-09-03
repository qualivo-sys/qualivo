# Incidente: reenvíos a leads ya contactados (Smartlead, agosto 2026)

Registro interno de incidente y respuesta, a efectos de responsabilidad proactiva
(art. 5.2 RGPD). Actualizar si llega cualquier reclamación.

## Qué pasó
Los reemplazos de secuencia vía API (POST /campaigns/{id}/sequences) del 4-5 de
agosto (copy nuevo "radiografía") y del 11 de agosto (firma nueva) reiniciaron el
progreso de los leads en las campañas antiguas. Smartlead volvió a tratar como
"pendientes" a leads que ya habían completado la secuencia, y les reenvió el
paso 1 del copy nuevo.

## Alcance (medido con statistics de la API, 13-ago)
- 228 leads que completaron su secuencia en julio recibieron correos nuevos en
  agosto: 197 en Academias (3608540) y 31 en Construcción Q3 (3715161).
- Reenvíos del 12-ago: 42 Academias, 46 Clínicas Q3, 54 Constr Q3, 20 Clínicas
  PERS (estos dos últimos grupos eran leads a mitad de secuencia, no terminados).
- El 10-ago: 117 de 135 envíos de Academias fueron a ya contactados.
- Caso extremo: paso 1 idéntico enviado dos veces (5-ago y 12-ago) al mismo lead.
- 0 leads con respuesta previa fueron recontactados. 0 leads con baja previa
  (Smartlead respeta la lista de unsubscribe, que no se tocó).

## Consecuencia visible
- 1 queja LOPD: paco.abril@gesforgroup.com (12-ago 08:26, texto literal:
  "Reportado LOPD"). Había recibido 5 correos en 5 semanas por el bug.

## Respuesta ejecutada
- 13-ago ~06:10Z: lead dado de baja de la campaña y dominio gesforgroup.com
  añadido a la block list global de Smartlead.
- 13-ago ~09:35Z: pausadas las 4 campañas afectadas (3608540, 3715571, 3715161,
  3766939) para cortar nuevos reenvíos. Las campañas con listas nuevas no están
  afectadas y siguen activas.
- Borrador de respuesta de supresión entregado a Maikel para enviar a Paco
  (confirmación de borrado, origen de los datos, disculpa).

## Valoración de riesgo (no es asesoramiento jurídico)
- Base de tratamiento: interés legítimo sobre datos de contacto profesionales
  (art. 19 LOPDGDD). El fallo no cambió la base, pero multiplicó la frecuencia
  de contacto, que es lo que genera quejas.
- Factores a favor: 0 recontactos a personas que hubieran respondido u objetado;
  supresión ejecutada el mismo día de detectar la queja; envíos B2B a direcciones
  corporativas; incidente contenido en horas y documentado.
- Riesgo real: bajo. Una reclamación ante la AEPD requiere que el afectado la
  presente; la AEPD normalmente da traslado a la empresa antes de nada. Con la
  supresión hecha y documentada, el recorrido habitual de un caso así es el
  archivo. El riesgo sube solo si se ignora al afectado o se le vuelve a escribir.
- Punto débil a corregir: los correos deben llevar siempre identificación del
  remitente, origen de los datos y vía de baja visible (LSSI art. 21-22 y RGPD
  art. 14). Revisar el pie de todos los copies antes de reactivar.

## Prevención (reglas de operación)
1. NUNCA hacer POST de secuencia completa sobre una campaña con leads en curso o
   terminados. Para tocar copy o firma: crear campaña nueva o editar variante
   sin reemplazar la secuencia entera.
2. Antes de reactivar las 4 campañas: decidir con Maikel el método (marcar como
   terminados los leads que completaron secuencia, o migrar pendientes a campaña
   nueva) y verificar el pie legal de los emails.
3. Tras cualquier cambio de secuencia, comprobar al día siguiente que los envíos
   van solo a leads nuevos (query de statistics: envíos del día vs histórico).
