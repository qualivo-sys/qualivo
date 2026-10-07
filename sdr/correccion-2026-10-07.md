# Corrección al informe SDR del 7-oct · me equivoqué filtrando

Esta mañana dije que nada superaba el umbral y que el motivo era que el pool
venía «dominado por selección de personal». **Lo segundo era una suposición mía,
no una regla, y por culpa de ella descarté 22 empresas que sí encajan.**

## Qué regla hay de verdad

Comprobado en `estrategia/mensajes-v3.md` y `estrategia/siete-puertas.md`: **no
existe ninguna exclusión por sector.** Lo que el ICP excluye es, literal:

> sin tracción, sin capacidad de atender más, ciclo >6 meses, <500 EUR/mes, quien
> solo quiere leads sin tocar su proceso, quien busca «que le lleven las redes».

Y el 11-sep el ICP se **amplió**, no se estrechó: «las empresas de software y
tecnología entran». Una firma de selección de 11-50 personas, con CRM, campañas
y alguien que vende, con honorarios de varios miles por colocación, encaja
literalmente en «B2B con sistema comercial montado y ticket >1.000 €».

Es el mismo error que el 2-oct con DOMINIO-CRUZADO: **mi filtro era más estricto
que la regla**, y como el filtro es mío y la regla no, gana la regla.

## Las que recupero

Sondeadas las 14 que había tirado. **11 pasan el filtro de piezas:**

| Cuenta | Piezas verificadas por curl | Formularios |
|---|---|---|
| **Mentes Expertas** | GTM · GA4 · pixel de Meta · pixel de LinkedIn | **8** |
| **Talent Match** | GTM · GA4 · **Google Ads** · pixel de LinkedIn | 0 |
| **etalentum** | GTM · GA4 · **Google Ads** | 2 |
| **Blu Selection** | GTM · GA4 · pixel de Meta | 0 |
| S&you · W Hunt · The Valley Talent · Ayanet · Talent-R · Betancourt · Grupo Arestora | GTM o GA4 | 0-2 |

Caen tres: Auren Personas, Nuclio Talent y KRIMDA, sin piezas detectables.

Las cuatro primeras son **la puerta «invierte en anuncios»** con la señal
verificable por curl, que es justo lo que pide la carga diaria para ICP02.

## Decisor: solo dos utilizables

De las 11, Apollo da decisor con correo disponible en **dos**:

| Cuenta | Persona | Cargo | Correo |
|---|---|---|---|
| Mentes Expertas | Marina Za… | CEO | disponible, sin revelar |
| Blu Selection | Kevin Vi… | Partner & Chief Revenue Officer | disponible, sin revelar |

Pedro (el otro CEO de Mentes Expertas) y Mar (Sales Director de etalentum)
figuran **sin correo**, así que no entran. Las otras siete no devuelven decisor
con esos cargos; habría que mirarlas con la lección de ayer, que el cargo viene
acotado y hay que buscar también por «business development» y «chief commercial».

## Secuencias · formato V3 · puerta «invierte en anuncios»

### Mentes Expertas · correo 1 · 84 palabras

**Asunto:** `vuestros anuncios`

> Hola Marina,
>
> He estado mirando Mentes Expertas y he visto que estáis invirtiendo en anuncios. Lo que casi nadie sabe decirme es qué campaña trajo al último cliente que firmó, no el último lead.
>
> Nosotros detectamos dónde se pierden clientes en el proceso de captación y ventas, y lo arreglamos metiendo IA dentro del sistema que ya tenéis.
>
> El primer paso es una llamada corta: me cuentas cómo lo tenéis montado y te digo qué veo. Si sale algo claro, lo probamos un mes sin coste y luego decidís si tiene sentido seguir.
>
> ¿Te va bien esta semana?
>
> Maikel

### Blu Selection · correo 1 · 84 palabras

**Asunto:** `vuestros anuncios`

> Hola Kevin,
>
> He estado mirando Blu Selection y he visto que estáis invirtiendo en anuncios. Lo que casi nadie sabe decirme es qué campaña trajo al último cliente que firmó, no el último lead.
>
> Nosotros detectamos dónde se pierden clientes en el proceso de captación y ventas, y lo arreglamos metiendo IA dentro del sistema que ya tenéis.
>
> El primer paso es una llamada corta: me cuentas cómo lo tenéis montado y te digo qué veo. Si sale algo claro, lo probamos un mes sin coste y luego decidís si tiene sentido seguir.
>
> ¿Te va bien esta semana?
>
> Maikel

### Correo 2 (+3 días) · el caso de anuncios, para las dos

> Hola {Nombre},
>
> Un ejemplo de lo que te decía.
>
> Una cuenta que perdía dinero pasó de 0,1 a 7,6 de retorno sin tocar el presupuesto. Solo cambiamos qué se optimizaba: estaban comprando leads baratos que no compraban.
>
> No hace falta que me creas. La llamada es para mirar vuestro caso, no para contaros el nuestro.
>
> ¿Esta semana o la que viene?
>
> Maikel

### Correo 3 (+7 días)

> Hola {Nombre},
>
> Lo dejo aquí, pero te hago una última pregunta por si te sirve a ti.
>
> Si tuvieras que apostar dónde se pierde más negocio en {Empresa} hoy, captación, conversión o seguimiento, ¿qué dirías?
>
> Contéstame con una palabra y te digo si coincide con lo que veo desde fuera.
>
> Y si lo prefieres en directo: https://api.leadconnectorhq.com/widget/bookings/qualivo-20
>
> Maikel

## Lo que falta antes de que esto salga

1. **Dedupe contra Smartlead.** Sin la clave no se puede, y es obligatorio.
2. **Revelar los dos correos**, 2 créditos. No los gasto antes del dedupe: es el
   orden que la propia rutina manda y ayer me costó 2 créditos no respetarlo.
3. **Tu ok**, que la rutina pide explícitamente para el copy nuevo en producción.

Nada enviado y nada cargado.

## Y una consecuencia que no es mía de hoy

Si el filtro de sector estaba mal aquí, conviene mirar si la misma suposición
tiró leads en las rondas anteriores. El informe del 2-oct habla de 20
competidores sobre 133, y de esos, los que vendían captación de leads eran
competencia de verdad; pero los que eran agencias de otra cosa, o firmas de
talento, puede que no lo fueran. **No lo reviso por mi cuenta porque implicaría
reabrir descartes ya comunicados**, pero es una pregunta que vale dinero.
