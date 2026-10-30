# Kubysoft · lista preseleccionada para noviembre · resumen

Para la revisión de Maikel del 30-oct a las 16:00. Después la valida Marc. **No se ha
enviado nada ni se ha cargado nada en Smartlead.** [C] dato comprobado, [E] estimación.

Ficheros:

- `lista-29oct.csv`: **las 169 empresas**, con el motivo de encaje de cada una.
- `revision-29oct.csv`: las 372 revisadas, dentro y fuera, con el motivo de cada descarte.
- `../copy/mensajes-noviembre.md`: los mensajes por segmento.
- `../diseno-alerta-clics.md`: la alerta de 3 clics.
- `../scripts/lista_apollo.py`: cómo se ha construido la lista, para repetirlo.

## Buzones, en una línea

**3 buzones en 3 dominios `.es` nuevos en IONOS: unos 3 € el primer mes y unos 40 € el
primer año sin IVA [E]. Se compran y configuran en 1 día, y necesitan 14 días de
calentamiento [E]: comprados el 30-oct, envían a pleno hacia el 13-nov.**

Por qué 3 y no 2: `hola@kubysoft.es` no sirve para esta tanda. Está pausado, con la
reputación al 66 % y un 5,8 % de rebotes [C, guardia del 29-oct]. 169 empresas por 3
correos son 507 envíos. Con 3 buzones a 30 al día entran 90 empresas nuevas al día y la
tanda arranca entera en 2 días hábiles [E]. Con 2 buzones serían 3 días. Precios de
IONOS sacados de agregadores (dominio a unos 1 € el primer año y buzón a unos 1 € al
mes), no de su tarifa oficial: confirmarlos al comprar. Lo compra Kubysoft, como
`kubysoft.es`.

## La lista en cifras

| | |
|---|---|
| Empresas en la lista | **169** [C] |
| Revisadas a mano | 372 [C] |
| Candidatas sacadas de Apollo | 1.179 [C] |
| Créditos de Apollo gastados | unos 13, 1 por búsqueda [E] |
| Ya contactadas en el piloto y excluidas | 69 empresas [C] |

**Por segmento** [C]:

| segmento | empresas | mensaje |
|---|---:|---|
| Climatización y calefacción | 83 | partes digitales con firma |
| Mantenimiento de edificios e industria | 53 | planificación y rutas de los técnicos |
| Protección contra incendios | 17 | checklist de la revisión RIPCI y el acta |
| Frío y refrigeración | 13 | checklist con valores y registro de gases |
| Legionela | 2 | checklist con parámetros |
| Puertas automáticas | 1 | parte de revisión preventiva |

**Por zona** [C, ciudad de la web o de Apollo]: Cataluña 34, Madrid 33, Andalucía 32,
C. Valenciana 17, Aragón 13, Galicia 8, y 32 entre otras comunidades o sin ciudad
visible. **Ninguna de Navarra ni Euskadi**: no se buscó allí y se comprobó en la web.

## Cómo se ha hecho

1. **Apollo**, búsqueda por comunidad autónoma con 5 a 20 empleados y etiquetas de
   climatización, aire acondicionado, refrigeración, frío industrial, servicio técnico,
   mantenimiento industrial, protección contra incendios y calefacción. **Sin Navarra
   ni País Vasco.**
2. **Filtro por código de actividad**: fuera fabricantes, mayoristas, ingenierías,
   informática y comercio.
3. **Fuera las 69 empresas ya contactadas** en el piloto.
4. **Revisión a mano empresa por empresa**, por nombre, dominio y actividad. 372
   revisadas: dentro 169 y fuera 203. Los descartes más habituales: sin encaje claro
   o fuera de sector (94), solo electricidad (22), constructoras y reformas (15),
   grupos o empresas de más de 20 empleados (8) y asociaciones (6).
5. **Lectura de la web de cada superviviente**: oficio, ciudad, si mantienen o solo
   instalan, y una señal concreta para abrir el correo.

## Lo que Marc tiene que mirar, por orden

La columna `confianza` dice cuánto hemos podido comprobar de cada empresa:

| confianza | empresas | qué significa |
|---|---:|---|
| alta: web revisada | 79 | la web confirma que instalan **y** mantienen con técnicos propios |
| media: web revisada sin confirmar mantenimiento | 40 | encajan por oficio, pero la web habla más de instalar que de mantener |
| web sin verificar | 50 | la web no cargó desde nuestro entorno. Muchas cargan en un navegador normal, y Marc avisó de que el dominio del decisor a veces no tiene web. **No se descartan, se revisan a mano** |

**Propuesta:** si Marc valida las 79 de confianza alta, esas salen primero mientras
se revisan las otras 90.

## La personalización

- **113 de 169** tienen una primera línea sacada de su propia web, por ejemplo: "Vi en
  vuestra web que hacéis las revisiones trimestrales, semestrales y anuales de PCI."
- **Las 56 restantes** usan la frase por defecto del segmento.
- Columnas `senal_web` y `primera_linea` del CSV.
- No se ha inventado nada: lo que no está en su web, no va.

## Lo que la lista no lleva, a propósito

- **Ni nombres ni correos de personas.** Solo datos de empresa: nombre, web, teléfono
  general y zona. Así puede ir en el repositorio.
- **El contacto se enriquece después de que Marc valide.** Si se hace con Apollo, son
  unos 169 créditos [E] de la bolsa de Qualivo, y es decisión de Maikel. La
  alternativa gratis es el correo general de la web, que es lo que se usó en octubre.

## Las cifras del piloto hasta hoy

| | según lo acordado con Marc el 27-oct | según `clics-estado.json` (27-oct 17:09) |
|---|---|---|
| Envíos | 147 | 156 |
| Empresas | 69 | 69 |
| Aperturas | 24 | no se guardan |
| Clics | 15 | 17 |
| Respuestas | 0 | 0 |

La diferencia probablemente viene de que el fichero cuenta también envíos rebotados y
clics posteriores al dato que se dio a Marc [E].

## Pendiente de OK de Maikel

1. Mandar lista y mensajes a Marc.
2. Que Kubysoft compre los 3 dominios con sus buzones.
3. Enriquecer contactos con Apollo (unos 169 créditos) o ir al correo general.
4. Cambiar el enlace de la campaña a la página de SAT (pendiente desde el 27-oct).
5. Encender la alerta de 3 clics (`diseno-alerta-clics.md`).
