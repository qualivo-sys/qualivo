# CAMPAÑA CONSTRUIDA EN PAUSADO · «QV_CRM_VIDEO_Sep26» · 15-sep-2026

```
AGENTE      qualivo.paid
PETICIÓN    Maikel: «una campaña sola con ese ad en vídeo, con intereses de captación y CRM»
ESTADO      campaña y conjunto creados en PAUSADO · falta el anuncio (esperando el vídeo)
COLOR       🟢 construir en pausado · 🔴 activar es de Maikel
FUENTE      Meta Marketing API v21.0 sobre act_3453332464718877 · 15-sep-2026
```

---

## 1 · El hallazgo antes de construir: los intereses ya estaban, y no ataban

El conjunto que acabamos de apagar **ya llevaba nueve intereses** de captación y CRM: HubSpot,
Salesforce, generación de leads, automatización de marketing, conversion marketing, AdWords,
marketing digital, pequeña empresa y espíritu empresarial.

Y llevaba también esto:

```json
"targeting_automation": { "advantage_audience": 1 }
```

**Con esa bandera encendida, los intereses son una sugerencia.** Meta puede entregar fuera de ellos
cuando cree que encontrará la conversión más barata en otro sitio. No es una sospecha: es lo que
hace el público Advantage+ por definición. Poner intereses y dejar la bandera a 1 es pedir algo y
autorizar lo contrario en la misma frase.

**Por eso el conjunto nuevo va con `advantage_audience: 0`.** Es el cambio que hace que la petición
signifique algo.

---

## 2 · El segundo problema: cuatro intereses se comían a los otros cinco

Alcance estimado en España, 25-65, feed + stories, uno a uno
(`/act_.../delivery_estimate`, 15-sep):

| Interés | Alcance en España |
|---|---|
| Espíritu empresarial | **7.100.000 – 8.300.000** |
| Pequeña empresa | **5.500.000 – 6.500.000** |
| Marketing digital | **3.200.000 – 3.700.000** |
| CRM · gestión de relaciones con clientes | 936.200 – 1.100.000 |
| AdWords | 842.000 – 990.600 |
| HubSpot | 689.900 – 811.600 |
| Generación de clientes potenciales | 565.100 – 664.800 |
| Conversion marketing | 551.400 – 648.700 |
| Salesforce.com | 261.300 – 307.400 |
| Automatización de marketing | 151.500 – 178.200 |
| Software empresarial | 1.600.000 – 1.900.000 |

Los intereses de un conjunto se combinan con **O**, no con **Y**. Así que meter «Espíritu
empresarial» junto a «HubSpot» no afina: **diluye**. El resultado medido:

| Conjunto | Alcance en España |
|---|---|
| El que había · 9 intereses con los cuatro amplios | **9.000.000 – 10.600.000** |
| El nuevo · 7 intereses, solo señal de CRM y captación, 25-65 | **2.700.000 – 3.200.000** |
| El nuevo con edad mínima 30 · **el que queda montado** | **2.400.000 – 2.900.000** |

Se pasa de un público donde el CRM era una minoría a uno donde es toda la señal. Sigue siendo
grande de sobra para 20 €/día.

---

## 3 · Cuatro intereses que Meta ya no acepta

Busqué también SugarCRM, Zoho, Microsoft Dynamics y Odoo. El buscador los devuelve, pero al usarlos
la API los rechaza por obsoletos y propone sustitutos ella misma:

| Pedido | Meta responde |
|---|---|
| SugarCRM `6002880154372` | → usa `6003206992086` **CRM** |
| Zoho `6004025515789` | → usa `6003388372512` **Software empresarial** |
| Microsoft Dynamics `6003401421147` | → usa `6003388372512` **Software empresarial** |
| Odoo `6002962720846` | → usa `6003388372512` **Software empresarial** |

Los dos sustitutos ya están dentro del conjunto nuevo, así que esa señal no se pierde.

---

## 4 · Lo que queda montado

```
CAMPAÑA   QV_CRM_VIDEO_Sep26                        120245657051570358   PAUSADA
CONJUNTO  ES 25-65 · CRM e intereses de captación   120245657053020358   PAUSADO
          · SIN Advantage+ · Lead form
ANUNCIO   —                                                              falta el vídeo
```

| Ajuste | Valor | Por qué |
|---|---|---|
| Presupuesto | **20,00 €/día** | el mismo tope que protege tu atención |
| Objetivo | `LEAD_GENERATION`, destino `ON_AD` | formulario nativo, sin salto a la web |
| Geografía | España · residentes y recientes | igual que antes, comparable |
| Edad | **30-65** | subida de 25 a 30 el 15-sep a peticion de Maikel · quita la franja con menos probabilidad de decidir sobre un CRM |
| Colocaciones | feed y stories de Facebook e Instagram | sin overlay de Reels, el arreglo que sí funcionó |
| **Público Advantage+** | **APAGADO** | para que los intereses aten de verdad |
| Intereses | los 7 del núcleo | CRM, HubSpot, Salesforce, generación de leads, automatización de marketing, conversion marketing, software empresarial |
| Exclusiones | 3 públicos ya existentes | no volver a pagar por quien ya está dentro |

Verificado por API después de crearlo. Nada activo: la cuenta sigue con 0 campañas capaces de gastar.

---

## 5 · Lo que falta y lo que hay que decidir

1. **El vídeo.** Sin el fichero no se puede crear el anuncio. En cuanto llegue lo subo y lo dejo
   apuntando al formulario, también en pausado.
2. **El vídeo necesita su CTA.** La pieza que vi esta tarde termina en una frase y una marca de agua
   de 12 px. Si el nuevo mantiene eso, el conjunto puede estar perfecto y el anuncio seguirá sin
   pedir nada. Es el arreglo más barato que queda.
3. **Formulario, no landing.** Lo he asumido yo: el vídeo no lleva a ningún sitio concreto y un salto
   a la web añade un escalón donde ya sabemos que se cae la gente. Si lo prefieres a landing, se
   cambia en un minuto.
4. **H0.1 sigue abierta.** Meta decía `lead: 1` y el formulario decía 0 de pago. Si activas esto sin
   cerrarlo, el marcador volverá a ser dudoso. Se cierra mirando GoHighLevel y no cuesta nada.
5. **El token de Meta sigue sin rotar.** Séptimo día.

**Activar es tuyo.** Yo no enciendo.
