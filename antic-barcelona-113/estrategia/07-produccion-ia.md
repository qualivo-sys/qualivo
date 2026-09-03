# 07 · Producción con IA — qué se hizo y qué falta

## 1. Por qué se usó IA aquí

No por moda. Por un problema concreto y medible:

Antic Barcelona 113 fabrica piezas excepcionales y las tiene fotografiadas sobre hormigón
de nave industrial, con etiquetas de precio manuscritas visibles en el propio tablero
("438", "445"), muebles de stock amontonados al fondo y luz mixta de fluorescente. En Meta
esas fotos compiten contra interiorismo editorial: bajan el CTR, suben el CPM y
**devalúan el ticket percibido**. Una mesa de 4.000 € fotografiada junto a una etiqueta de
almacén parece una mesa de saldo.

La solución correcta es una sesión de fotos. La solución disponible esta semana es
recontextualizar la pieza real.

## 2. Qué se produjo

Con **Seedream 5.0 Pro** (vía Higgsfield), a 2352×1760, partiendo siempre de la fotografía
real de la pieza:

| # | Pieza original | Ambientación generada | Uso | Estado |
|---|---|---|---|---|
| 01 | Mesa de teca monolítica con encajes de cola de milano | Comedor mediterráneo: cal blanca, barro cocido, luz de tarde, sillas de enea, lámpara de latón | **Hero de la landing** + creatividades 1A y 3B | ✅ En producción |
| 02 | Mesa de tronco de canto vivo con patas cilíndricas | Masía catalana rehabilitada: piedra vista, vigas, microcemento, luz fría de mañana | Sección "materia" + creatividad 2A | ✅ En producción |
| 03 | Bañera tallada en un solo bloque de piedra | Baño de hotel boutique: piedra seca, ventanal a un olivar, lino, latón envejecido | — | 📦 Archivada en `creatividades/descartados/` |

En las tres, la pieza se conserva con fidelidad verificable: misma silueta, misma veta,
mismos encajes, mismas proporciones, mismo color. Lo sustituido es exclusivamente el entorno.

**Coste:** 9 créditos (3 por imagen a 2K) de los 10,12 disponibles. Saldo actual: **1,12**.
Tres de esos nueve se fueron en la pieza de piedra, que sale de la campaña; la imagen queda
archivada y sigue sirviendo el día que se abra la línea de piedra.

## 3. La regla que aplicamos, y por qué importa

| Se puede | No se puede |
|---|---|
| Recontextualizar una pieza real en un ambiente ilustrativo | Inventar una pieza que el taller no fabrica |
| Mejorar luz, limpiar fondo, quitar etiquetas de precio | Alterar dimensiones o material de la pieza |
| Generar ambiente aspiracional para el anuncio | Etiquetar una imagen IA como "proyecto realizado" |
| Usar IA en creatividades de frío | Usar IA en la sección "Proyectos reales" |

Cada creatividad con ambientación generada lleva impresa la nota **"Ambientación recreada
digitalmente"**, y la landing lleva la misma advertencia en el pie.

Esto no es escrupulosidad excesiva. La Ley General de Publicidad y la Ley de Competencia
Desleal sancionan la publicidad engañosa; Meta rechaza creatividades que presenten como real
algo que no lo es; y, sobre todo, un cliente que llega al taller esperando el comedor de la
foto y se encuentra la nave **no compra**. La expectativa hay que gestionarla en el anuncio,
no en la visita.

## 4. Qué falta y qué cuesta

### 4.1 Con más créditos de Higgsfield

Todo en madera, alineado con el alcance actual de la campaña:

| Pieza | Créditos aprox. | Valor |
|---|---|---|
| 4 recontextualizaciones más (banco, cajonera, vitrina, mesa de centro) | 12 | Completa el catálogo visual de madera |
| 3 macros de material a 2K (prompt C del documento 03) | 9 | Conceptos 01B y 05, muy baratos de producir |
| 2 vídeos de 5 s imagen-a-vídeo (dolly lento sobre la veta) | 40-60 | Test de Reels del mes 2 |
| Versiones 9:16 nativas de las 2 piezas actuales | 6 | Mejor encuadre que el recorte |

Con **~90 créditos** queda cerrada toda la producción visual de los tres primeros meses.
El top-up más pequeño (500 créditos) cubre eso y deja margen para la línea de piedra cuando
llegue su momento.

### 4.2 Lo que la IA no resuelve

**Personas.** El anuncio que mejor funciona en esta categoría es una mesa puesta, con gente
comiendo, luz de domingo y desorden real. Eso no se genera de forma creíble ni legítima: hay
que fotografiarlo. Media jornada, 400-800 €.

**Prueba de proyecto entregado.** La sección "Proyectos reales" de la landing sigue con
marcadores `[Pendiente]` a propósito. Necesita fotos de casas de clientes reales, aunque sean
de móvil, con el problema del espacio, la solución ejecutada y una frase del cliente. Es el
activo que más falta hace y el único que no podemos fabricar nosotros.

**Reseñas.** Los tres testimonios de la landing están vacíos por el mismo motivo: solo se
publican reseñas literales del perfil de Google, con nombre.

## 5. Prompt base reutilizable

```
Fotografía de interiorismo editorial. CONSERVA EXACTAMENTE la pieza de la
imagen de referencia: misma forma, mismas proporciones, misma veta, mismo
color, mismos detalles constructivos. No modifiques el mueble.

Sustituye ÚNICAMENTE el entorno: [DESCRIPCIÓN DEL ESPACIO].
[MATERIALES DEL SUELO Y LAS PAREDES]. [DIRECCIÓN Y HORA DE LA LUZ].
[2-3 OBJETOS DE ATREZO CONCRETOS].

Estilo: fotografía de revista de interiorismo, óptica de [35/50] mm,
profundidad de campo media, luz natural, sombras suaves, grano sutil, sin HDR.

Elimina cualquier etiqueta de precio, cartel, suelo de hormigón industrial,
mobiliario amontonado y desorden de almacén. Sin texto, sin marcas de agua,
sin personas.
```

Las tres claves que hacen que funcione: **nombrar los detalles constructivos concretos** de
la pieza a conservar (los encajes, el canto vivo, las patas de tronco), **dar dirección y
hora a la luz** en vez de pedir "buena iluminación", y **listar explícitamente lo que hay
que eliminar** — sin esa última línea, el modelo conserva las etiquetas de precio.
