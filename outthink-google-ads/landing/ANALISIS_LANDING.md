# Landing OutThink 2026 · análisis de conversión y justificación de la propuesta

Datos: Google Ads API v25, cuenta 918-811-5388, 31-08 → 10-09. Conversión = `OT26_Registro`
(envío del formulario de espacio.adigital.org). Vista previa de la propuesta:
https://qualivo.io/outthink-preview/ (noindex).

## 1. Cómo convierte la landing actual (rai.outthink.es)

| Segmento | Clics | Registros | Conversión |
|---|---|---|---|
| Search (tráfico con intención) | 316 | 13 | **4,1 %** |
| · escritorio | 201 | 10 | 5,0 % |
| · móvil | 114 | 3 | 2,6 % |
| · grupo EventosIA | 207 | 11 | 5,3 % |
| · grupo AI Act | 81 | 2 | 2,5 % |
| Demand Gen (Discover/YouTube/Gmail) | 332 | 0 | 0,0 % |
| PMax (Display/YouTube) | 1.067 | 2 | 0,2 % |
| **Total** | 1.715 | 15 | **0,9 %** |

Lecturas:
- Con tráfico de intención alta la landing convierte un 4 %. Para un evento gratuito con
  ponentes institucionales de primer nivel, la referencia razonable es 8–12 %.
- **Móvil convierte la mitad que escritorio** (2,6 % vs 5,0 %). Es donde más pesa el doble
  salto: landing → pestaña nueva → formulario en otro dominio.
- El tráfico de descubrimiento (DG, PMax) no convierte casi nada: la página no retiene a
  quien no llega ya convencido. No explica el evento en la primera pantalla.
- La prueba de enviar Demand Gen **directo al formulario** (02–03/09, 150 clics) dio 0
  registros: el formulario solo, sin contexto, tampoco convierte. Hace falta la landing y el
  formulario juntos.

## 2. Diagnóstico de la página actual

- **Mensaje**: H1 "Outthink the Future" y un subtítulo institucional. No dice qué es, cuándo,
  para quién ni que es gratis. Los anuncios prometen "Comprende el AI Act en 1 día" y
  "Pregunta cara a cara a la AEPD y la OCDE"; la landing no lo repite (ruptura anuncio →
  página).
- **Autoridad enterrada**: Secretaria de Estado, presidente de la AEPD, OCDE y ONU aparecen a
  mitad de scroll en tarjetas que hay que girar.
- **Fricción de registro**: un solo CTA arriba, `target="_blank"`, dominio distinto, sin
  formulario en la página (0 formularios en la home). Sin segundo CTA ni botón fijo en móvil.
- **Contenido ausente**: qué te llevas, para quién es, agenda resumida, lugar y horario.
- **Técnico**: 5,9 MB de recursos estáticos en la home (cuatro fotos de ponentes pesan
  1,1–1,7 MB cada una); logos de patrocinadores servidos desde postimg.cc; schema.org con
  fecha errónea (15-10 en vez de 24-09); etiqueta "Patrocinadores" repetida tres veces.

## 3. Por qué proponemos esta estructura

Orden de la página = orden en que decide un director de compliance:

1. **Hero con mensaje del anuncio + formulario en la misma pantalla.** Repite la promesa
   del anuncio ("qué exige el AI Act a tu empresa"), fija fecha/lugar/gratuito en la primera
   línea y elimina el doble salto. Ataca directamente el 2,6 % de móvil.
2. **Franja de instituciones.** La autoridad como primer impacto tras el hero: es la razón
   por la que este evento merece un día de agenda.
3. **Qué te llevas (3 puntos).** Convierte "temas" en resultados: saber qué te exige, poder
   preguntar a quien regula, criterios de empresas que ya lo aplican.
4. **Muro de ponentes.** Nombre, cargo e institución siempre visibles.
5. **Agenda en tres bloques.** Quien decide con la agenda delante no tiene que salir de la
   página.
6. **Para quién es + dónde y cuándo.** Autoselección y logística (acceso, certificado).
7. **Cierre naranja con el claim de las creatividades + botón.** Segundo CTA para quien ha
   leído hasta el final. En móvil, botón fijo que desaparece cuando el formulario está a la
   vista.

## 4. Por qué este copy

- **"Un día para entender qué exige el AI Act a tu empresa"**: lo que buscan (AI Act +
  empresa), el formato (un día) y el resultado (entender qué exige). Sustituye a un claim de
  marca por una promesa.
- **"Con quienes lo regulan y lo aplican"**: nombra la ventaja diferencial real del evento
  frente a cualquier webinar.
- **"Reservar mi plaza"** en vez de "Inscríbete": plaza implica escasez y compromiso bajo;
  "Sin coste · 1 minuto" quita las dos objeciones del formulario.
- Textos de las creatividades validadas reutilizados ("1 día. Todo lo que tu empresa necesita
  saber sobre IA", "Plazas limitadas · Un solo día").
- Nada de urgencia artificial: "Últimas plazas" existe como opción y solo se activa si es
  verdad.

## 5. Qué esperar y cómo medirlo

Objetivo: pasar del 4 % al 8 % en Search y del 2,6 % al 5 % en móvil. Con el presupuesto
actual (85 €/día, CPC 1,45 €) eso son 2–3 registros diarios más. Medición: misma conversión
`OT26_Registro`; comparar CVR por dispositivo semana anterior vs semana posterior al cambio;
si Adigital puede, test A/B por URL desde los anuncios (50/50) durante 5 días.

Pendiente de Adigital: horario, agenda con horas, certificado, conexión del formulario con
su registro (o envío de los datos a espacio.adigital.org) y paso de UTM al listado.
