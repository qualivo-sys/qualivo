# Clínica Dental Marín · presentación (reunión 10-nov, 11:00)

Primera reunión, de 20 a 30 minutos. Se pasa de pantalla con las flechas del teclado.

## URLs
- Presentación: https://qualivo.io/propuestas/clinica-dental-marin/presentacion/
- Raíz (redirige a la presentación): https://qualivo.io/propuestas/clinica-dental-marin/
- Landing A, implantes: https://qualivo.io/propuestas/clinica-dental-marin/landing-a/
- Landing B, ortodoncia invisible: https://qualivo.io/propuestas/clinica-dental-marin/landing-b/
- Intelligence (botón de la pantalla 13): https://qualivo.io/intelligence/?sector=clinica&empresa=Cl%C3%ADnica%20Dental%20Mar%C3%ADn&objetivo=conversion

## Orden de pantallas (14)
1. Portada: Qualivo × Marín. «Más primeras visitas que acaban en tratamiento».
2. Qué hacemos: los 5 pasos, con el CRM y el panel debajo.
3. Paciente ideal: cualificado frente a «todavía no» (con la etiqueta «Lo validamos hoy»).
4. Hoy frente a con Qualivo, como «lo habitual en clínicas». Incluye el detalle de la web: el botón de Torrent llama al número de Valencia.
5. Anuncio 1: implantes con financiación (sin precios).
6. Anuncio 2: ortodoncia invisible para adultos.
7. Anuncio 3: primera visita en tu sede (Valencia o Torrent).
8. Landings A y B: dos maquetas, qué cambia entre ellas y botones para abrirlas.
9. Formulario que cualifica: 5 preguntas y la regla A, B y C.
10. Recorrido de una petición: minuto 0, minuto 2 con WhatsApp, recordatorios, día +1, +3 y +7. Qué hace el sistema y qué hace el equipo.
11. CRM: tablero con sus 7 etapas y filtro por sede (Todas, Valencia y Torrent; funciona al pulsar).
12. CRM: ficha de una petición de ejemplo, con respuestas, historial y próxima acción.
13. Intelligence: 3 paneles de ejemplo (resumen, anuncio que trae tratamientos y comparativa por sede) y el botón a la demo en directo.
14. Siguiente paso: una segunda reunión esta semana y la lista de lo que necesitamos. Sin precios.

## Revisar antes de las 11:00 (importante)
- **No he encontrado su web.** clinicadentalmarin.es no existe (no resuelve). clinicadentalmarin.com es otra Clínica Dental Marín, de Horta (Barcelona). dentalmarin.es es «Marín Clínica Dental», con una sola sede en Patraix (Valencia) y sin Torrent. Ninguna encaja del todo con «Valencia y Torrent».
  - Por eso no hay logo descargado ni fotos. La marca va como texto («MARÍN · CLÍNICA DENTAL», en Montserrat) con un diente dibujado. Los colores son un azul clínico neutro, porque no he podido confirmar los suyos.
  - Si su web es dentalmarin.es, su logo es negro: un diente de línea con «MARÍN / CLÍNICA DENTAL» en Montserrat. Lo que he hecho se parece y se puede cambiar por el logo real en cinco minutos.
- **El detalle del botón de Torrent (pantalla 4) no lo he podido comprobar**, porque no he encontrado la web con las dos sedes. Comprobadlo antes de decirlo o quitad ese recuadro (el `div.det` de la sección `#s3`).
- Todas las personas y cifras son de ejemplo y van rotuladas así (Lucía G. y las demás tarjetas, y los números de Intelligence).

## Lo que no ha dado tiempo o he dejado fuera adrede
- El cuarto anuncio, de estética de la sonrisa. Se menciona en la pantalla 7 como tema para la segunda reunión. Lo he dejado fuera para que la presentación quede corta.
- No hay fotos reales de la clínica, porque no he podido confirmar su web. Todo es composición en CSS y SVG.
- En las landings, las direcciones y los teléfonos de cada sede están como texto genérico, sin datos.
- No he creado un sector propio en `intelligence/sectores/`. El enlace usa `sector=clinica`, que ya existe.

## Comprobaciones hechas
- Sin scroll horizontal a 390 y a 1440 px en la presentación y en las dos landings (Playwright).
- Revisadas las capturas de cada pantalla. El formulario de las landings da A, B o C al enviarse y no envía nada.
- Las 4 páginas llevan `noindex,nofollow,noarchive`.
- No he hecho commit ni push.

## Plan y anuncios (agente de plan/anuncios, 10-nov)
URLs:
- Plan (la raíz ya no redirige; ahora es el plan): https://qualivo.io/propuestas/clinica-dental-marin/
- Anuncios: https://qualivo.io/propuestas/clinica-dental-marin/anuncios/
  - Lo que vemos hoy: https://qualivo.io/propuestas/clinica-dental-marin/anuncios/#hoy
  - Los 4 anuncios: #implantes, #ortodoncia, #sede y #estetica. Las ideas plegadas están en #mas.

Qué hay:
- **Plan:** qué hacemos (5 pasos, CRM y panel), lo que ya tienen (real), paciente ideal (hipótesis) y dónde se pierde, rotulado «Lo habitual en clínicas». Después, las piezas enlazadas (anuncios, landings A y B, recorrido, CRM, Intelligence, presentación y formulario), los primeros 30 días y el siguiente paso: segunda reunión con sus números del último mes. Sin precios.
- **Anuncios:**
  - «Lo que vemos hoy»: datos de la Biblioteca de anuncios que pasó el coordinador y 4 de sus anuncios redibujados con su texto (limpieza + TAC 19,90 €, implante 1 €/día, ortodoncia 3 €/día, carillas con diseño de sonrisa gratis). Cada uno va emparejado con nuestra propuesta, y debajo van las 4 lecturas, en tono de oportunidad.
  - Paciente ideal y petición cualificada, y el formulario de 5 preguntas con la regla A, B y C.
  - 4 anuncios con maqueta 4:5 en CSS y SVG, sin fotos. Cada uno lleva gancho, ganchos alternativos, texto, titular, botón, por qué funciona, landing y qué medimos.
  - 3 ideas plegadas: revisión, presupuesto sin respuesta y vídeo del especialista.
  - Recuadro de publicidad sanitaria prudente.
- **Marca real:** logo de dentalmarin.es, recortado y recoloreado en `assets/brand/`: `logo-marin.png` (oscuro), `logo-marin-blanco.png` y `diente-blanco.png` para el avatar. Su azul #2EA3F2 y Montserrat ya eran los de la paleta. Las sedes van como «Patraix (Valencia)» y Torrent.
- Menú común: Plan · Anuncios · Landings (va a landing-a) · Recorrido · CRM (demo/) · Intelligence (`sector=dentalmarin`) · Presentación.

Falta o conviene revisar:
- La landing de estética no existe. El anuncio 4 lo dice y propone, mientras tanto, el formulario instantáneo de Meta.
- El anuncio 3 lleva a la landing A (bloque de sedes). No hay una landing propia «por sede».
- La presentación (que no he tocado) sigue con la marca de texto, «Valencia» y el recuadro del botón de Torrent. Conviene alinearla con la marca real y quitar ese recuadro.
- El enlace de Intelligence apunta a `sector=dentalmarin`. Si ese sector no está publicado, el panel no carga.
- Los textos de sus anuncios están abreviados con «…». Solo uso lo que nos pasaron, sin nombrar a nadie.

Comprobado: sin scroll horizontal a 390 y a 1440 px (Playwright) en el plan y en anuncios. He revisado las capturas de las dos páginas y de cada creatividad. Las dos páginas llevan `noindex,nofollow,noarchive`. Sin commit.
