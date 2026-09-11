# Tanda 1 · Andorra, Alt Urgell i Lleida · 27 d'agost de 2026

Primera aplicación del sistema de outbound B2B (`sistema/outbound-b2b.md`).
Ángulo: fugas comerciales. Una fuga por cuenta, con evidencia verificada.

## Resultado del cribado

**21 cuentas investigadas, 10 aprobadas, 11 descartadas.** La regla de
descarte se ha aplicado 11 veces, que era exactamente el objetivo: no
fabricar personalización para rellenar hueco.

| Descartada | Motivo |
|---|---|
| Grup 90 Advocats | web tras muro anti-bots, no se puede verificar nada |
| Helitrans Pyrinees | web tras muro anti-bots |
| Grauvell | fuga clarísima, pero **cero decisores accesibles** |
| Hotel El Castell de Ciutat | sin decisor con email verificado |
| Archimedes | sin decisor con email verificado |
| BDP Software | el único contacto es un desarrollador, no decide |
| EADe Consultors | dominio catchall |
| Reig Patrimonia | dominio catchall |
| Grup Heracles | dominio catchall |
| Movimer World | dominio catchall |
| The Value Search Team | consultoría de ventas, competidor |

Tres de los once mueren por **accesibilidad del decisor**, el eje que se
añadió ayer al scoring. Sin él habrían entrado y habrían sido trabajo tirado.

## Aviso metodológico

El primer barrido de webs dio **falsos positivos**: detectaba el chat "crisp"
en casi todas por una regla CSS (`image-rendering: crisp-edges`), no por el
widget. Se repitió buscando los dominios reales de cada widget
(`client.crisp.chat`, `embed.tawk.to`, etc.). Todo lo que sigue son hechos
comprobados, no inferencias.

Lo que **no** se afirma en ningún mensaje: ausencia de newsletter (no se puede
verificar desde la portada), comportamiento del cliente, uso de CRM, volumen
de leads, inversión publicitaria.

## Bloque A+

### 1. Augé Holding Group · Andorra la Vella

```
CONTACTO         Pere Augé, Founding President · perejr@augegroup.org
                 linkedin.com/in/pereauge · 33 empleados
ICP FIT      9   POTENCIAL     8   DOLOR        9   EVIDENCIA    9
TRIGGER      4   ACCESIBILIDAD 9   PERSONALIZ.  9   PROB. REUNIÓN 8
IDIOMA           catalán (Andorra, contacto fundador local)
OBSERVACIÓN      3 formularios, 34 campos en total, WhatsApp visible,
                 Google Tag Manager instalado, y el único correo público
                 de la web es info@augelegalfiscal.com
FUENTE           augelegalfiscal.com, 27-ago-2026
FUGA             D · Seguimiento
HIPÓTESIS        Legal, fiscal, contable e inmobiliaria entran por la misma
                 dirección genérica. Es habitual que consultas de naturaleza
                 muy distinta acaben en la misma bandeja sin señal de por
                 dónde vinieron ni quién debe cogerlas.
IMPACTO          Ticket de despacho legal-fiscal: cada consulta mal enrutada
                 es una relación de años que no empieza.
CTA              variante comercial (evidencia sólida)
CONFIANZA        alta en el hecho, media en la hipótesis
```

**Email 1** · Assumpte: `els 34 camps i una sola adreça`

> Hola Pere,
>
> He estat mirant el web d'Augé. Compto tres formularis amb 34 camps en total, i tots porten a la mateixa adreça general.
>
> Amb quatre àrees tan diferents, és habitual que una consulta de constitució de societat i una de compliance entrin igual, sense cap senyal de per on han vingut ni de qui les ha de recollir.
>
> Si vols, ho mirem 15 minuts i et dic on crec que hi ha la fuga.
>
> Maikel

**Follow-up** (+4 días, evidencia nueva de otro tramo)

> Pere, mirant-ho una mica més hi he vist una altra cosa, aquesta del tram d'abans.
>
> Teniu el Tag Manager posat però cap píxel de publicitat connectat. Vol dir que teniu la infraestructura de mesura muntada i no la feu servir per saber quin contingut porta les consultes bones.
>
> Les dues coses estan lligades: no saber d'on ve una consulta i no saber què fer-ne quan arriba. T'ho ensenyo en 15 minuts si et sembla.

**LinkedIn** (238)

> Pere, he estat mirant el web d'Augé, sobretot com entren les consultes de les quatre àrees. Em dedico a mirar per on es perd negoci entre el primer contacte i la signatura. M'agradaria connectar.

---

### 2. Clínica Nexus · Lleida

```
CONTACTO         Montse Monjo, CEO · montse.monjo@grupnexus.com
                 linkedin.com/in/montsemonjo · 20 empleados · 2,4 M€
ICP FIT      8   POTENCIAL     8   DOLOR        9   EVIDENCIA    10
TRIGGER      3   ACCESIBILIDAD 9   PERSONALIZ.  9   PROB. REUNIÓN 8
IDIOMA           catalán (web en lang="ca", confirmado)
OBSERVACIÓN      4 formularios con 42 campos y 3 campos de correo distintos,
                 WhatsApp visible, Tag Manager instalado, cero píxeles de
                 publicidad conectados, y el correo público es info@
FUENTE           grupnexus.com, 27-ago-2026
FUGA             H · Medición
HIPÓTESIS        Cuatro vías de entrada y ninguna medición de publicidad
                 conectada. En estética con financiación, saber qué campaña
                 trae tratamiento firmado y cuál solo trae consulta es la
                 diferencia entre invertir bien o a ciegas.
IMPACTO          Ticket con financiación a plazos: un tratamiento firmado
                 vale muchas consultas.
CTA              variante comercial
CONFIANZA        alta en el hecho, alta en la hipótesis
```

**Email 1** · Assumpte: `quatre formularis i cap píxel`

> Hola Montse,
>
> He estat mirant el web de Nexus. Compto quatre formularis amb 42 camps i tres adreces de correu diferents. També veig que teniu el Tag Manager posat, però no hi ha cap píxel de publicitat connectat.
>
> Amb tractaments finançats, la diferència entre una campanya que porta consultes i una que porta tractaments signats és molta. Ara mateix aquesta diferència no es pot veure.
>
> Si vols, ho mirem 15 minuts i et dic on crec que hi ha la fuga.
>
> Maikel

**Follow-up** (+4 días)

> Montse, hi ha una segona cosa, aquesta del tram de després.
>
> Els quatre formularis porten a la mateixa adreça general. Una consulta de làser i una d'una unitat capil·lar arriben igual, i qui les recull no sap de quina campanya venien.
>
> Sense això, quan toca decidir on posar el pressupost es decideix per intuïció. Les dues coses estan connectades i t'ho ensenyo en 15 minuts.

**LinkedIn** (241)

> Montse, he estat mirant el web de Nexus, sobretot els quatre formularis i com es mesura el que hi entra. Em dedico a veure quina campanya porta de veritat tractament signat. M'agradaria connectar.

---

### 3. CADÍ Cooperativa · La Seu d'Urgell

```
CONTACTO         Julien Morales Trallero, Director Comercial
                 julien.morales@cadi.es
                 linkedin.com/in/julien-morales-trallero-a15a7097
                 27 empleados · fundada el 1915 · DOP
ICP FIT      8   POTENCIAL     8   DOLOR        8   EVIDENCIA    9
TRIGGER      3   ACCESIBILIDAD 9   PERSONALIZ.  8   PROB. REUNIÓN 8
IDIOMA           catalán (web en lang="ca")
OBSERVACIÓN      La portada no té cap formulari. Cap. L'única via de
                 contacte és el correu cadi@cadi.es. Tag Manager instalado.
FUENTE           cadi.es, 27-ago-2026
FUGA             B · Conversión
HIPÓTESIS        Marca de 1915 con DOP y notoriedad regional, y quien llega
                 a la web solo puede escribir a una dirección genérica. Un
                 distribuidor, una tienda gourmet y un particular acaban
                 igual, y probablemente muchos no escriben.
IMPACTO          Cada distribuidor que no llega a escribir es volumen anual.
CTA              variante comercial
CONFIANZA        alta en el hecho, media-alta en la hipótesis
PROXIMIDAD       sí, usar el cierre presencial
```

**Email 1** · Assumpte: `cap formulari a cadi.es`

> Hola Julien,
>
> He estat mirant el web de CADÍ. Una cosa em va sorprendre: a la portada no hi ha cap formulari. L'única manera de contactar-vos és escrivint a l'adreça general.
>
> Per una marca amb DOP i el nom que teniu, això vol dir que un distribuïdor, una botiga gourmet i un particular acaben tots al mateix lloc, i que una part ni tan sols arriba a escriure.
>
> Si vols, ho mirem 15 minuts i et dic on crec que hi ha la fuga. Som aquí al costat, així que si té sentit fins i tot ho podem veure en persona.
>
> Maikel

**Follow-up** (+4 días)

> Julien, hi ha una segona cosa, del tram de mesura.
>
> Teniu el Tag Manager instal·lat però sense cap píxel connectat. O sigui que la infraestructura hi és i no s'està fent servir per saber qui arriba ni d'on.
>
> Sense formulari i sense mesura, el web no us està dient res de qui us busca. T'ho ensenyo en 15 minuts.

**LinkedIn** (233)

> Julien, he estat mirant el web de CADÍ i em va sorprendre que a la portada no hi hagi cap formulari. Em dedico a mirar per on es perd negoci abans que ningú arribi a escriure. M'agradaria connectar.

---

## Bloque A

### 4. Universal Gestió · Andorra la Vella

```
CONTACTO      Alberto Mayor, Director General · alberto.mayor@universalgestio.com
              linkedin.com/in/alberto-mayor-8749536 · 17 empleados
ICP 8 · POT 9 · DOLOR 8 · EVIDENCIA 9 · TRIGGER 3 · ACCES 8 · PERS 8 · REUNIÓN 7
IDIOMA        catalán (web en lang="ca")
OBSERVACIÓN   1 formulario con 9 campos, sin Tag Manager, sin ningún píxel,
              y el único correo público de la web es el de protección de datos.
FUGA          H · Medición
HIPÓTESIS     Entidad financiera de inversión sin ninguna analítica instalada
              en portada. No hay forma de saber qué trae a un cliente de
              patrimonio, que es de los tickets más altos que existen.
```

**Email 1** · Assumpte: `res instal·lat a universalgestio.com`

> Hola Alberto,
>
> He estat mirant el web d'Universal Gestió. No hi trobo ni Tag Manager ni cap píxel, i l'únic correu públic de la pàgina és el de protecció de dades.
>
> En gestió de patrimonis, on un sol client val molts anys, no poder veure què porta la gent al web és car. I amb un únic formulari de nou camps, tampoc queda gaire rastre del que sí arriba.
>
> Si et sembla interessant, t'ensenyo en 15 minuts què hi veig.
>
> Maikel

**Follow-up**: segunda evidencia del tramo de conversión (formulario único
para perfiles muy distintos), cerrando con la conexión entre ambas.

---

### 5. Fimarge · Andorra la Vella

```
CONTACTO      Josep Palomera, Managing Director · jpalomera@fimarge.com
              linkedin.com/in/josep-palomera-742aa6166 · 17 empleados
ICP 8 · POT 9 · DOLOR 8 · EVIDENCIA 9 · TRIGGER 2 · ACCES 8 · PERS 7 · REUNIÓN 6
IDIOMA        CASTELLANO. Su web está en lang="en", no en catalán. Aplica la
              regla nueva: comunica en inglés al cliente internacional, así
              que el catalán aquí sería un gesto vacío.
OBSERVACIÓN   Portada sin ningún formulario y sin ningún campo de entrada.
              Tag Manager instalado. Web en inglés.
FUGA          B · Conversión
HIPÓTESIS     Gestora de patrimonios desde 1988 cuya portada no ofrece
              ninguna vía de contacto. Quien llega interesado tiene que
              buscarse la vida.
```

**Email 1** · Asunto: `ni un solo formulario en fimarge.com`

> Hola Josep,
>
> He estado mirando la web de Fimarge. En la portada no hay ningún formulario ni ningún campo de entrada. Sí veo el Tag Manager instalado, así que la voluntad de medir está.
>
> En gestión de patrimonios eso significa que alguien que llega interesado tiene que buscarse la vida para contactaros, y una parte no lo hace. Con vuestro ticket, esa parte es mucho dinero.
>
> Si te parece interesante, te enseño en 15 minutos qué veo.
>
> Maikel

---

### 6. Hubel Kitchen & Home · Lleida

```
CONTACTO      Ignasi Banzo, Director General · ibanzo@hubelsa.com
              linkedin.com/in/ignasi-banzo-vilà · 13 empleados
ICP 7 · POT 7 · DOLOR 8 · EVIDENCIA 8 · TRIGGER 3 · ACCES 8 · PERS 7 · REUNIÓN 7
IDIOMA        castellano (web en lang="es", sin versión catalana detectada)
OBSERVACIÓN   2 formularios con 11 campos, 2 de correo, Tag Manager puesto,
              ningún píxel de publicidad, correo público hubelsa@hubelsa.com
FUGA          H · Medición
HIPÓTESIS     Cocinas y armarios a medida: proyectos de ticket alto y
              decisión larga. Sin píxeles conectados no hay forma de saber
              qué trae al que acaba encargando un proyecto entero.
```

---

### 7. Grup L'Home del Sac · Andorra la Vella

```
CONTACTO      Eusebi Andrade, Director General · eusebi@homedelsac.ad
              linkedin.com/in/eusebi-gratacós-andrade-2062b22a7 · 11 empleados
ICP 7 · POT 6 · DOLOR 7 · EVIDENCIA 8 · TRIGGER 3 · ACCES 8 · PERS 7 · REUNIÓN 6
IDIOMA        catalán (web en lang="ca")
OBSERVACIÓN   Portada sin ningún formulario. WhatsApp visible. Sin Tag
              Manager y sin ningún píxel. Correo público info@homedelsac.ad
FUGA          B · Conversión
HIPÓTESIS     Gestión de residuos industriales vendida a empresas, y la única
              vía es WhatsApp o una dirección general. Un contrato de gestión
              de residuos de obra no se pide por WhatsApp igual que una
              recogida puntual.
```

---

## Bloque B

### 8. Índice Consultoría y Formación · Lleida

```
CONTACTO      Maria Soro, Marketing Director · msoro@indiceformacion.com
              linkedin.com/in/mariasoro · 34 empleados
ICP 7 · POT 6 · DOLOR 7 · EVIDENCIA 7 · TRIGGER 4 · ACCES 9 · PERS 6 · REUNIÓN 6
IDIOMA        castellano (lang="es")
OBSERVACIÓN   1 formulario de 10 campos para toda la web, Tag Manager puesto,
              ningún píxel de publicidad conectado
FUGA          H · Medición
NOTA          Es directora de marketing con pasado en Deloitte y en marcas de
              consumo. Va a juzgar el mensaje con criterio. El ángulo tiene
              que ser de aliada, no de auditora externa.
```

### 9. Urquía & Bas · Lleida

```
CONTACTO      Inma Mayoral, Directora Área Comercial · imayoral@urquiabas.com
              linkedin.com/in/inmamayoral · 31 empleados
ICP 7 · POT 6 · DOLOR 7 · EVIDENCIA 7 · TRIGGER 3 · ACCES 8 · PERS 6 · REUNIÓN 6
IDIOMA        castellano (lang="es-ES")
OBSERVACIÓN   Portada sin ningún formulario, solo 4 campos sueltos.
              Tag Manager instalado, sin píxeles.
FUGA          B · Conversión
HIPÓTESIS     Correduría con productos muy especializados (turismo activo,
              eventos deportivos, ciberprotección) y una portada sin
              formulario. Cada producto atrae a un comprador distinto y
              todos acaban en el mismo sitio.
```

### 10. Grup Asysum · Lleida

```
CONTACTO      Carme Carrión, CFO · carme.carrion@asysum.com
              linkedin.com/in/carme-carrión-b5262b39 · 55 empleados · 3,4 M€
ICP 6 · POT 7 · DOLOR 7 · EVIDENCIA 8 · TRIGGER 3 · ACCES 7 · PERS 6 · REUNIÓN 5
IDIOMA        castellano (lang="es-ES")
OBSERVACIÓN   2 formularios con 9 campos, sin Tag Manager, sin ningún píxel,
              correo público info@asysum.com
FUGA          H · Medición
NOTA          El contacto es CFO, no comercial. El ángulo económico tiene que
              ir por delante: qué se está gastando sin saber qué devuelve.
```

## Reparto de CTA para el experimento

| Bloque | CTA |
|---|---|
| A+ | `Si vols, ho mirem 15 minuts i et dic on crec que hi ha la fuga.` |
| A | `Si et sembla interessant, t'ensenyo en 15 minuts què hi veig.` |
| B | `Si vols, t'ensenyo en 15 minuts què hi veig.` (control) |

## Idiomas de la tanda

Catalán: Augé, Nexus, CADÍ, Universal Gestió, Home del Sac.
Castellano: Fimarge (web en inglés), Hubel, Índice, Urquía & Bas, Asysum.

Cinco y cinco. Y la regla nueva ya ha cambiado dos decisiones: Fimarge sale
en castellano pese a ser Andorra, y Hubel sale en castellano pese a ser
Lleida.

## Pendiente antes de enviar

1. **Revisión del catalán por un nativo.** Cinco mensajes.
2. Decidir si se recupera Grup 90 mirando su web a mano.
3. Cargar en Smartlead y HeyReach con la cadencia multicanal del sistema.
