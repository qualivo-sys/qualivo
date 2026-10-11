# Revisión de Paid · Plan de Meta Ads "Ruta Perruna" ronda 1 (150 €) · 11-oct-2026

Pedida por la sesión "Validación de productos ecommerce" (rama `claude/validacion-producto`,
`research/validacion-producto/funnel-viajar-con-perro/paid-meta-plan.md`). Leído el plan
entero, los umbrales de `plan-prueba.md` y la matriz de 9 anuncios. No he tocado su rama.

## Veredicto corto

El plan es serio: ABO, Purchase, público amplio, mejoras automáticas apagadas, Shopify como
fuente de verdad, [PRUEBA] antes de afirmar. Lo publicaría con cuatro cambios: **menos
anuncios por euro**, **la regla de parada de los 75 € con una segunda condición**, **umbrales
de CPM de cuarto trimestre**, y **decidir la ronda 1 por embudo (hook, CTR, coste por IC), no
por CPA**, que con 150 € es ruido. Los textos pasan las políticas de Meta; dos cautelas.

## 1 · Estructura

| pregunta | mi respuesta |
|---|---|
| ABO o CBO | **ABO**, como está. Con 150 € y cuenta fría, CBO concentra en un anuncio el día 1 y no se aprende nada de los otros ángulos. |
| Purchase o ATC | **Purchase**, como está, con el plan B por entrega (no por falta de ventas). Cambiar a ATC optimiza a gente que añade al carrito y no paga. Lo único que añadiría: comprobar que el Purchase llega por API de conversiones con calidad ≥ 6/10 antes del D1; sin eso, Purchase en cuenta nueva entrega mal y el plan B salta sin culpa de la creatividad. |
| Advantage+ Sales | **No en la ronda 1**, como está. Sí en la 2 con los ganadores. |
| Anuncios por conjunto | **Aquí cambiaría.** 9 anuncios a 150 € son ~17 € por anuncio: a CPM 10-15 € son 1.100-1.700 impresiones por anuncio. Da para hook rate y CTR, no para ATC ni compras. Dos opciones: (a) **2 conjuntos × 15 €/día × 3 ganchos** (A1 barro, A2 pelo) y A3 Navidad a la ronda 2 a finales de noviembre, cuando es su momento y el kit tenga margen recalculado; (b) 3 conjuntos × 2 ganchos. Prefiero (a): +50 % de datos por anuncio y la Navidad se prueba cuando vende. |
| Ubicaciones | Advantage+ sin Audience Network, bien. Vigilar **Facebook Stories**: en nuestra cuenta ha costado CPM 87 € (ver §4). No excluirla de salida; sí al día 2 si se come > 15 % del gasto con CPM > 40. |
| Tope | Campaña 150 + cuenta 160: bien. Recordad que Meta puede gastar hasta un 25 % más del diario (10 → 12,5 €); el tope de campaña lo absorbe. |
| Cuenta nueva | Dos riesgos reales que el plan menciona de pasada: límite diario inicial de Meta en cuentas nuevas (a veces 25-50 €/día, aquí no afecta) y **revisión de anuncios > 24 h, con riesgo de revisión de cuenta** al ser cuenta, píxel y dominio nuevos. Subir todo en D-2, no en D-1. |

## 2 · Umbrales

- **CPM "bien ≤ 8 €"** es optimista para España en cuarto trimestre con público amplio; noviembre y diciembre suben. Pondría: bien ≤ 12, aceptable 12-20, mal > 25. Y **no disparar el plan B por CPM > 20 € solo**: con pocas impresiones el CPM del día 1-2 baila; que salte solo por gasto < 50 %.
- **CTR de enlace** (≥ 1,5 / 1-1,5 / < 0,8): bien. **Hook rate** (≥ 30 / 20-30 / < 15): bien.
- **CPC ≤ 0,40 "bien"**: exigente; con CPM 12 y CTR 1,5 % sale 0,80. Lo dejaría como información, no como criterio.
- **Regla de los 75 € sin compra → pausar la campaña.** Es el punto más peligroso del plan. Con un CPA esperado de 25-40 € (vuestro propio cálculo), la probabilidad de 0 compras a 75 € con un embudo sano es alta (del orden del 15-30 %). Mataríais una prueba correcta. Propuesta: pausar a 75 € **solo si además hay 0 pagos iniciados**; si hay IC, seguir hasta los 150 €. La regla automática puede llevar las dos condiciones.
- **Apagar un anuncio el día 2 con ≥ 6 €**: a 6 € son ~500 impresiones y el CTR a 500 impresiones tiene ± 0,5 puntos de ruido. Usar el umbral que ya mencionáis: **≥ 1.000 impresiones**, no 6 €.
- **La tabla del día 5 decide por CPA.** Con 0-10 compras el CPA no es una tasa. Lo diría explícito: la ronda 1 se decide por **hook rate, CTR de enlace, coste por ATC y coste por IC**; el CPA solo cuenta con ≥ 5 compras. Vuestro "ganador por coste por IC" ya va por ahí; subidlo a regla principal.

## 3 · Políticas de Meta sobre los 9 textos

Pasan. No hay atributos personales (ni "tienes perro", ni salud, ni edad, ni dinero), no hay
reseñas, urgencia, precio tachado ni derechos legales como ventaja. Dos cautelas:

1. **A2H3 "lo que falla en otras fundas" / "3 cosas que miraría antes de comprar"**: es
   comparativa implícita. Vale mientras sean categorías (resbala, correas, SUV) y no marcas ni
   capturas de reseñas ajenas, como ya decís. Si V8 lleva planos de otra funda fallando, que
   sea una comprada por vosotros y sin marca visible.
2. **A2H2 pantalla partida**: Meta no prohíbe el "antes/después" en sí, pero lo revisa como
   posible resultado engañoso. Vuestra regla (mismo coche, misma semana, sin rótulo
   "antes/ahora") es la correcta; añadid en el texto en pantalla "mismo coche, misma semana"
   para que el revisor lo vea.

Menores: "Probada con agua antes de venderla" solo si V3 se publica; "accidente" (orina) está
bien; "Comprar" como CTA está bien; el precio en el titular está bien y además filtra.

## 4 · Datos reales de Qualivo (con fuente y límites)

Cuenta `act_3453332464718877`, 17-sep → 11-oct-2026, leída por API el 11-oct. **No es
comparable del todo**: son anuncios de vídeo a formulario de contacto, servicio B2B, España
25-65 público amplio. Sirve como techo de lo que puede costar el CPM en España ahora, no
como referencia de e-commerce.

| | gasto | CPM | CTR enlace | CPC enlace |
|---|---|---|---|---|
| cuenta | 1.146,66 € | **29,8 €** | 1,12 % | 1,28 € |
| Facebook feed | 297,85 € | 22,1 € | 1,20 % | |
| Instagram feed | 651,83 € | 32,6 € | 0,96 % | |
| Instagram stories | 138,57 € | 32,1 € | 1,18 % | |
| Facebook stories | 58,41 € | **86,8 €** | 3,56 % | |

Frecuencia 2,35 en 24 días. Lo que sí se traslada: Facebook Stories cara, Instagram feed se
lleva más de la mitad del gasto, y el CTR de enlace de vídeo a público amplio ronda el 1 %.
Hay más cuentas en el negocio (clientes de Qualivo, alguna de e-commerce); no las he leído
sin OK de Maikel. Si lo da, saco CPM y CTR agregados sin identificar al cliente.

## 5 · Mejoras por impacto

1. **2 conjuntos × 15 €/día (A1, A2), A3 a la ronda 2.** Más datos por anuncio y Navidad en su fecha.
2. **Regla de parada: 75 € sin compra y sin pagos iniciados.** Evita el falso negativo más probable.
3. **Ronda 1 se decide por embudo, no por CPA.** Hook ≥ 20 %, CTR ≥ 1 %, coste por IC ≤ 7,5 € = seguir, aunque haya 0-2 compras.
4. **CPM de cuarto trimestre**: 12 / 20 / 25, y plan B solo por gasto < 50 %.
5. **Purchase por API de conversiones verificado antes del D1** (calidad ≥ 6/10, deduplicado). Sin eso la prueba no es de creatividad.
6. **Subir en D-2** y pedir verificación del negocio ya: cuenta, píxel y dominio nuevos = revisión larga.
7. **Umbral de apagado por impresiones (≥ 1.000), no por euros.**
8. **Añadir `{{placement}}` a `utm_content`** o leer Meta por desglose de ubicación: a 150 € saber si vende Reels o feed vale más que saber el ángulo.
9. **Visitas a la landing / clics de enlace ≥ 70 %** como primera comprobación del día 1; por debajo, la landing tarda y nada de lo demás se lee.
10. **Un solo precio en todos los titulares de la funda** (44,90 €), como está: no probar precio en la ronda 1.

Nada de esto cambia la tesis del plan. Es el mismo test, con menos probabilidad de matarlo
por azar y con una lectura que sí cabe en 150 €.
