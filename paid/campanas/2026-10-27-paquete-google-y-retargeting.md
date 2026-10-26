# Paquete Paid · Google Ads por sector y retargeting en Meta · entrega del martes 27-oct

Encargo de Chief of Staff, de parte de Maikel (22-oct). **Nada activo ni con gasto.** La inversión y el lanzamiento los decide Maikel.

**Encaje con el plan de noviembre** (bloque del 26-oct): se mantienen 20 €/día y una sola prueba a la vez. Este paquete queda **listo para diciembre**, o antes si Maikel lo decide.

**Etiquetas:** [C] confirmado · [E] estimación.

---

## 1 · Google Ads

### 1.1 Estado de partida [C, 22-26 oct]

- Paid no tiene acceso a ninguna cuenta de Google Ads. Por eso **se entrega un paquete listo para cargar** con Google Ads Editor (CSV en `paid/campanas/google-ads/`).
- Las landings `/formacion/` y `/reformas/` llevan el píxel de Meta y GA4 (G-LVDQS0MXF4). **No tienen etiqueta de Google Ads.**
- El formulario manda la query string completa a `/api/diagnostico`, así que el gclid viajaría con ella. **Falta guardarlo en un campo propio de GHL.**

### 1.2 Demanda real (DinoRANK, España, 14, 21 y 26-oct) [C de la herramienta, E en lo real]

| Sector | Búsquedas B2B con intención (al mes) | Ejemplos (vol. · CPC) |
|---|---|---|
| Formación | unas 150-200 | agencia de marketing educativo 70 · marketing para centros educativos 40 · marketing para escuelas 30 (2,53 €) · captación de alumnos 20 · marketing para academias 20 |
| Reformas, ventanas e instalaciones | **menos de 100** | cómo conseguir clientes para reformas 40 · publicidad para empresas de reformas 20 · agencia de marketing para constructoras 20 · cómo conseguir obras privadas 20 · crm para constructoras 10 (3,88 €) |
| Genéricas | Miles, pero sin sector | «agencia de marketing» 5.400 (3,18 €) · «crm» 33.100 · «software para presupuestos de obra» 210. **No se usan:** traen a todo tipo de negocio o a quien busca software |

**Conclusión:** la búsqueda B2B por sector da muy poco volumen. Las dos campañas de búsqueda sirven para **no perder a quien ya busca**, no para escalar. El alcance en Google lo daría Demand Gen (sección 1.5).

### 1.3 Estructura (en pausa)

| Campaña | Grupos de anuncios | Palabras clave | Presupuesto | Puja | Idioma y ubicación | Horario | Landing |
|---|---|---|---|---|---|---|---|
| QV_SEARCH_Formacion_B2B | Agencia captación alumnos · Seguimiento admisiones | 15, exacta y de frase (`palabras-clave.csv`) | 5 €/día | Maximizar clics, CPC máximo 4 € (no hay conversiones todavía) | Español · España | L-V 8-20 h | /formacion/ con UTM |
| QV_SEARCH_Reformas_B2B | Captación clientes reformas · Seguimiento presupuestos | 12, exacta y de frase | 5 €/día | Igual | Igual | Igual | /reformas/ con UTM |

- **Exclusiones** (`negativas.csv`, 30 por campaña): gratis, curso, máster, oposiciones, empleo, prácticas, qué es, pdf, ejemplos, plantilla, reformar mi casa, precio reforma, particular, alumno, becas, FP, universidad, sueldo… Así se deja fuera a **particulares y alumnos**.
- **Anuncios** (`anuncios-rsa.csv`): un anuncio adaptable por grupo, con 15 titulares (todos de 30 caracteres o menos) y 4 descripciones (90 o menos). Las pruebas son las mismas que en las landings: EAC (10 matrículas en un mes) y Bellovinilo (8,3× la inversión).
- **UTM:** `utm_source=google&utm_medium=cpc&utm_campaign=qv_search_<sector>&utm_content={creative}&utm_term={keyword}`.
- **Recursos a añadir al cargar:** enlaces de sitio («Ver cómo funciona», «Caso real», «Diagnóstico 30 min») y textos destacados («Sin cambiar tu CRM», «Respuesta en minutos»). Sin precios.

### 1.4 Conversiones en Google (con Growth y Automations)

| Evento | Dónde nace | Uso en Google | Volumen hoy [C, píxel de Meta, 28 días] |
|---|---|---|---|
| Solicitud (envío del formulario) | `/api/diagnostico` | Secundaria | unas 8-9 al mes en la web |
| Reserva | GHL / agenda | **Principal** al empezar | 19 en 28 días (todos los canales) |
| Reunión con encaje | GHL, etiqueta `reunion-encaja` o etapa | Importación offline por gclid | pocas al mes |
| Cliente (con importe) | GHL, ganada | Importación offline con valor | 1 en octubre de Meta |

**Requisitos antes de gastar** (unas 6-8 h) [E]:
1. Etiqueta de Google Ads y Conversion Linker en la web (Growth).
2. Guardar el gclid en un campo propio de GHL (Automations).
3. Crear las conversiones e importarlas offline desde GHL (Paid, con acceso a la cuenta).

**Puja:** con menos de 15 reservas de Google al mes, maximizar clics con CPC máximo. Cambiar a maximizar conversiones cuando haya volumen.

### 1.5 Demand Gen (opcional, en pausa)

- **Formato:** vídeos de YouTube, Discover y Gmail para personas que buscaron cosas como «crm para academias», «software gestión academias», «marketing para escuelas», «software presupuestos obra» o «crm instaladores» (segmentos personalizados).
- **Creatividad:** los vídeos de Creative (09 formación, 3V reformas).
- **Presupuesto:** 10 €/día como máximo, 3 semanas.
- **Riesgo:** el filtro depende del vídeo y de la landing.

### 1.6 Presupuesto, fechas y paradas que se proponen

| | Search por sector | Demand Gen |
|---|---|---|
| Presupuesto | 5 €/día por sector (unos 300 €/mes los dos) | 10 €/día |
| Cuándo | **Diciembre**, o antes si Maikel lo decide | Después de Search |
| Éxito | ≥1 reunión con encaje a 200 € o menos por sector | ≥1 reunión con encaje a 200 € o menos |
| Parada | 100 € sin ninguna reserva que pase el filtro | 100 € sin reservas |

**Condición del plan Q4** (cierre del 15 % o más): con el cliente de E-01, Meta lleva 2 de 11 reuniones celebradas que terminan en piloto o cliente, un 18 % [E: muestra pequeña]. Se acerca, pero hace falta más volumen para darla por cumplida.

---

## 2 · Retargeting en Meta

### 2.1 Audiencias (creadas el 26-oct solo para medir, sin anuncios ni gasto) [C]

| Audiencia | ID | Regla | Tamaño |
|---|---|---|---|
| QV_RT · web formación 180d | 120246254484410358 | Píxel, URL contiene `/formacion`, 180 días | **Rellenándose**: Meta tarda hasta 24-48 h en dar la cifra |
| QV_RT · web reformas 180d | 120246254485190358 | Píxel, URL contiene `/reformas`, 180 días | Rellenándose |
| QV_EXCL · reservaron o compraron 180d | 120246254485290358 | Eventos Schedule, Qualified, Converted o Purchase | Rellenándose (para **excluir**) |
| Vídeos (ya existía) | 120236339828020358 | Interacción con vídeo, 365 días | Menos de 1.000 |
| Forms_abiertos (ya existía) | 120236339793530358 | Abrieron un formulario, 90 días | Menos de 1.000 |

**Contexto de tamaño:** el píxel registró 478 PageView en 28 días en toda la web [C], solo con consentimiento. Es muy probable que las audiencias por sector se queden **por debajo de 1.000 personas**.

**No se usan:**
- Aperturas de email.
- Listas de seguidores sacados de otras cuentas: hay unas 17 en la cuenta. Se propone borrarlas.

### 2.2 Exclusiones

- `QV_EXCL` (quien ya reservó o compró, por eventos del píxel y de la API de conversiones).
- **Clientes y oportunidades activas:** por ahora no se sube una lista de clientes a Meta (datos personales; necesita la revisión legal pendiente). Se cubre con `QV_EXCL`, porque los clientes ya llegan como Converted.

### 2.3 Propuesta (solo si la audiencia llega a 1.000 o más; si no, no se monta)

| | Valor |
|---|---|
| Estructura | 1 campaña `QV_RT`, 1 conjunto por sector, presupuesto en el conjunto |
| Público | Web del sector (180 días) más los que vieron vídeo, menos `QV_EXCL` |
| Mensajes | El caso real del sector (EAC o Bellovinilo) y «Diagnóstico de 30 min con tus datos». Formato corto (15-20 s) del vídeo que ya existe |
| Presión | 3 €/día por conjunto; frecuencia máxima unas 2 por semana [E]; ventana de 180 días |
| Parada | 45 € por sector sin ninguna reserva |

**Si no llega a 1.000:** se queda documentado y **no se fuerza**. Las audiencias siguen acumulando y se revisan el 30-nov.

### 2.4 Adaptaciones que pedir a Creative (sin brief nuevo)

- Un corte de 15-20 s del 09 (formación) y del 3V (reformas): solo el caso y la llamada a la acción. Formatos 4:5 y 9:16.
- Para Demand Gen: versión 16:9 del 09, si se aprueba.

---

## 3 · Pendientes explícitos

| Pendiente | Quién | Qué hace falta |
|---|---|---|
| Acceso a Google Ads | Maikel | Invitar a Paid o confirmar que no hay cuenta |
| Etiqueta de Google Ads y gclid en GHL | Growth y Automations | Etiqueta en la web y campo propio del gclid |
| Tamaño real de las audiencias | Paid | Leerlo el 27 y 28-oct |
| Borrar las listas de seguidores de otras cuentas | Maikel | OK |
| Revisión legal de audiencias de clientes | Legal (revisión ya pendiente) | Antes de subir cualquier lista |
