# Reactivación general · 15-oct-2026

Orden de Maikel, 15-oct por la tarde: «quiero volver a los 300 envíos diarios y que todo vuelva a funcionar, si hay que reactivar las pausadas dale caña a todo». Autorizado de forma explícita: «activalo y ya esta te autorizo yo».

## Qué se hizo

- Los 5 buzones de novaqualivo pasan de 20 a 30 correos al día. Con los 10 buzones de Qualivo son 300 al día.
- Arrancan las 3 campañas del Playbook Q4 (Formación 4156230, Reformas 4156231, Clínicas 4156233). El copy es literal de Notion, con el pie de siempre y cadencia de días 0, 4 y 8. Leads cargados: 12 de Formación, 5 de Reformas y 16 de Clínicas.
- Se reanudan los 194 leads que se habían pausado por la mañana: 147 de Servicios B2B, 37 de Formación y 10 de Clínica.
- Se reactivan 20 campañas que estaban pausadas: las de señal (CRM, anuncios y listas), Construcción, Clínicas Q3, Solar, Obra, Asesorías, Academias, Inmobiliarias e Infoproducto. Quedan fuera DKR UK, que es del cliente, y las 4 campañas Intelligence vacías.

## Riesgos aceptados por Maikel

- Puede haber reenvíos al despausar campañas que tenían leads a medias. `guardia_reenvios.py` pausa sola cualquier campaña que acumule 3 o más.
- Las campañas antiguas usan el copy antiguo.
- El pie legal es el de siempre; la revisión legal sigue pendiente.

## Depósito después de la reactivación

1.590 leads sin empezar, pero 1.296 están en Infoproducto, que tiene un tope de 15 al día. Sin Infoproducto quedan unos 300 leads nuevos, menos de 2 días. El volumen de los próximos días saldrá sobre todo de los seguimientos de los leads a medias que se han reanudado. Para mantener 300 envíos al día hay que cargar leads nuevos cada día.

## 16-oct: corrección por respuestas malas

Al reactivar, 229 de los 300 envíos del día fueron seguimientos («RE:», «no insisto más») a gente sin contacto desde hacía 15 a 60 días. Resultado: una baja («saturadores», GoalDental) y un rechazo sarcástico (17 WOODyART). Con el ok de Maikel («sí, para los seguimientos antiguos y autorizo los créditos») se pausaron todos los leads en curso cuyo envío anterior tenía más de 15 días: 287 en la segunda pasada, más los de la primera, que se cortó por un error de conexión antes de guardar el registro. Siguen enviando los primeros correos a leads sin empezar y los seguimientos recientes. Lección: reactivar campañas con secuencias a medias no reenvía el primer correo, pero sí manda seguimientos fuera de contexto. Eso se trata igual que un reenvío.
