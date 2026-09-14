# Propuesta de ampliación · Google Ads OutThink 2026 (14-09, 11 días restantes, 854 €)

Fuente de datos: Google Ads API (cuenta 918-811-5388), 31-08 → 14-09. El planificador de
palabras clave no está disponible con nuestro token (nivel explorer), así que el volumen se
estima con impresiones reales ÷ cuota de impresiones (IS) de nuestras propias keywords.

## 1. Cuánto mercado hay en Madrid y cuánto captamos

| Semana | Impresiones | IS media | Subastas elegibles/semana | Clics | Registros |
|---|---|---|---|---|---|
| 31-08 → 06-09 | 2.512 | 28 % | ≈ 8.900 | 152 | 8 |
| 07-09 → 13-09 | 5.514 | 25 % | ≈ 22.400 | 340 | 9 |

Por grupo (últimos 7 días): EventosIA ≈ 12.800 subastas/semana elegibles, captamos el 25 %.
La keyword que convierte, `evento ia madrid` (amplia): 2.521 impresiones en 14 días con IS 28 %
→ ≈ 9.000 subastas quincenales solo en Madrid. **Todavía no hemos agotado Madrid en cuota,
pero sí en calidad**: la conversión de Search ha bajado del 5,3 % (semana 1) al 1,6 % (desde el
jueves). Los que buscaban activamente ya han hecho clic; lo que queda es cola larga.

Lo que NO ha funcionado en Madrid y no se replica fuera: keywords sin intención de evento
(`ai act`, `reglamento ia`, `conferencia ia españa`: 400 € y 2 registros).

## 2. Radios que se pueden abrir, por qué y con qué volumen

Regla: fuera de Madrid solo keywords con **Madrid explícito** (`evento ia madrid`, `congreso
ia madrid`, `evento inteligencia artificial madrid`, `eventos ia madrid`). Quien busca eso
desde Barcelona tiene intención de desplazarse; quien busca `evento ia` en Barcelona quiere
un evento en Barcelona.

| Nivel | Zona | Tiempo a Madrid | Volumen estimado vs Madrid | Conversión esperada | Recomendación |
|---|---|---|---|---|---|
| 1 | Corona de 1 h: Toledo, Guadalajara, Segovia, Ávila, Cuenca | ≤ 1 h coche/AVE | +10–15 % | igual que Madrid | **Abrir ya**, en la misma campaña |
| 2 | Ciudades AVE ≤ 2,5 h: Barcelona, Valencia, Zaragoza, Valladolid, Sevilla, Málaga, Córdoba | 1–2,5 h AVE | +120–150 % (Barcelona ≈ Madrid, Valencia ≈ 0,4×, resto 0,1–0,2×) | 40–60 % de Madrid | **Abrir como campaña aparte** con presupuesto propio y solo keywords "madrid" |
| 3 | Resto de España | > 2,5 h | +40 % adicional, cola larga | < 30 % de Madrid | No, salvo streaming |
| — | América Latina (la tarde se emite en streaming) | — | grande | solo si hay registro de streaming | Preguntar a Adigital si existe registro online; si sí, es una campaña distinta |

Estimaciones de volumen por peso de empresas y población (Cataluña ≈ Madrid; C. Valenciana ≈
0,45; Andalucía ≈ 0,6; Aragón/CyL ≈ 0,15). Para volúmenes exactos: Planificador de palabras
clave en la UI, pegar las 4 keywords "madrid" y filtrar por ciudad.

**Estructura propuesta**

- `OT26_Search` (Madrid + corona 1 h): 50 €/día. Grupo EventosIA + Marca, como está.
- `OT26_Search_AVE` (7 ciudades, presencia física): 12 €/día, Maximizar clics con tope 2,5 €,
  4 keywords "madrid" en frase + `evento ia madrid` amplia, RSA con "Madrid, 24 de septiembre"
  y "A 2,5 h en AVE" como titular opcional. Corte: si a los 60 € no hay registro, se pausa.
- Negativas y programación (noche y fin de semana al 50 %) copiadas de la actual.

## 3. PMax optimizada · qué cambia respecto a la de la semana pasada

Lo que pasó: 1.064 clics, 144 €, 2 registros (CPL 72 €). El 70 % del gasto fue Display en apps
móviles y webs basura (0 registros), YouTube 0 registros, Search/Discover 1 registro cada uno.

Verificado en la API: **los controles de canal de PMax (desactivar Display/YouTube) no están
disponibles en esta cuenta** (`OPERATION_NOT_PERMITTED_FOR_CONTEXT`); sí se puede desactivar
la red de socios de búsqueda. Por tanto la optimización va por estas palancas:

| Palanca | Antes | Ahora |
|---|---|---|
| Puja | Maximizar conversiones sin objetivo (1 registro en cuenta) | **CPA objetivo 45 €** con 19 registros de señal |
| Señales | audiencia ComplianceLegal + 10 temas (AI Act, regulación…) | **Solo intención de evento**: lista de convertidores + visitantes (200) + temas `evento ia madrid`, `congreso ia madrid`, `eventos ia 2026`; fuera AI Act y regulación |
| Creatividades | P1/P2/P3/P5/R1/C5, copy AI Act | **Solo P5 y C5** (mejor CTR) + copy de evento; sin vídeo generado; sin expansión de URL; sin texto automático |
| Ubicaciones | 0 exclusiones al arrancar | **246 apps y 76 sitios ya excluidos** a nivel de cuenta; revisión diaria |
| Negativas de campaña | outthink, adigital | + reglamento, ley, ai act, peligro, curso, empleo, otros eventos |
| Red de socios | activa | **desactivada** |
| Geo | Madrid presencia | Madrid + corona 1 h, presencia |
| Horario | 24/7 | lunes–viernes 7–22 h |
| Presupuesto y corte | 16,67 → 26,67 €/día | **15 €/día, 7 días**; se pausa si a los 100 € no hay registro o el CPL supera 60 € |

Expectativa honesta: con 19 registros de señal y sin poder cerrar Display, lo razonable son
3–6 registros por 100–120 €. Es un complemento, no la palanca principal.

## 4. Reparto de los 854 € restantes (11 días)

| Campaña | €/día | Total | Registros esperados |
|---|---|---|---|
| Search Madrid + corona | 50 | 550 | 10–13 |
| Search AVE (prueba 5 días, luego decidir) | 12 | 60–130 | 1–3 |
| PMax optimizada (prueba 7 días) | 15 | 105 | 3–6 |
| **Total** | **77** | **≈ 850** | **14–22** → cierre en 33–41 registros |

Todo se construye en pausado y se activa con OK de Maikel. Lo que no cambia: sin landing
nueva, la conversión de Search seguirá entre el 2 % y el 3 %; el techo lo pone la página, no
el presupuesto.
