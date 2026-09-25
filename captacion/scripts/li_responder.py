# -*- coding: utf-8 -*-
# Contesta las 22 conversaciones de LinkedIn que llevaban semanas sin respuesta.
#
# Tres criterios que no son negociables y por eso estan escritos aqui:
#
# 1. A quien ya ha dicho que no NO se le pide reunion. Se le deja un dato util
#    y la puerta abierta. Insistir a un no es lo que hace que el canal se queme.
# 2. Tres no llevan propuesta de valor a proposito: Maria Carrascal (le
#    prometimos no venderle y le entro un automatico igual, asi que es una
#    disculpa), Felipe Lloreda (se quejo de que el mensaje no era personalizado,
#    contestarle con otro argumentario le daria la razon) y Ximo Prieto (vende
#    lo mismo que nosotros).
# 3. Alberto Mayor contesto en catalan, asi que se le contesta en catalan.
#
# Antes de mandar el de Maria Carrascal se bloqueo su correo en Smartlead y se
# pauso el lead en las dos campanas donde estaba. El mensaje dice "ya esta
# hecho" y tiene que ser verdad cuando se lea.
#
# Uso: python3 li_responder.py            (seco)
#      python3 li_responder.py --envia
import json, os, sys, time, urllib.request

S = os.path.dirname(os.path.abspath(__file__))
K = open(os.path.join(S, ".heyreach_key")).read().strip()
H = {"X-API-KEY": K, "Content-Type": "application/json",
     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}
CUENTA = 201834
ENVIA = "--envia" in sys.argv

MSJ = [
 # --- puertas abiertas -------------------------------------------------
 ("Raquel Rebelo", "2-Y2MwZTFjNTMtMzE1MS00ZDMxLWI1OTAtYWMzYTdmOWZlZDcyXzEwMA==",
  "Hola Raquel, perdona la tardanza, me dijiste a partir de septiembre y aquí estamos.\n\n"
  "Escribo a Remi esta semana. Para que sepas de qué va: nosotros miramos dónde se pierde "
  "gente entre que alguien pide información de un curso y acaba matriculado, y lo arreglamos "
  "dentro del CRM que ya tenéis, sin cambiar de herramientas.\n\n"
  "Con una escuela de aviación pasamos de no saber qué anuncio traía matrículas a tener cada "
  "euro conectado con la matrícula final. Si a Remi le cuadra, le enseño eso mismo.\n\n"
  "Gracias por pasarme el contacto."),

 ("Eduard Estrella", "2-ZGNmZDU2YmItYzhiYy00OTc4LThmMjAtNTBmNGQzMTRlMjBiXzEwMA==",
  "Gracias por decírmelo, Eduard, y suerte con lo nuevo.\n\n"
  "Le escribo a Loli. Por si te sirve a ti también donde estés ahora: lo que hacemos es "
  "detectar en qué punto se cae la gente entre que pide información y se matricula, y taparlo "
  "dentro del CRM que ya exista. En admisiones suele estar en los que piden info y no reciben "
  "nada en las 48 horas siguientes.\n\n"
  "Si alguna vez te viene bien que lo mire donde estés, me dices."),

 # --- los que solo dijeron gracias -------------------------------------
 ("Alberto Mayor", "2-NGFhMmJiOTQtODc0MC00OTJhLWFmM2YtYTBiOTBiMDFlYWU2XzEwMA==",
  "Gràcies a tu, Alberto.\n\n"
  "T'explico en dues línies què faig, que l'altre dia em vaig quedar a mitges. Mirem per on es "
  "perd negoci entre el primer contacte i la signatura, i ho arreglem amb IA dins del sistema "
  "que ja teniu, sense canviar d'eines.\n\n"
  "En una gestoria el forat sol ser el mateix: pressupostos enviats que ningú torna a tocar i "
  "que no apareixen enlloc. Si vols, t'ho miro i t'ho dic per escrit, sense reunió."),

 ("Noe Rivas", "2-MzAxNDYxYzctNjQ4MC00NTk2LWIxZmYtYzA3ZDYxNmQzNjc4XzEwMA==",
  "Gracias a ti, Noe.\n\n"
  "Te cuento qué hago, que quedó en el aire. Detectamos dónde se pierden clientes entre el "
  "primer contacto y la venta, y lo arreglamos con IA dentro del CRM que ya tiene el cliente.\n\n"
  "Trabajando en SEO seguro que lo ves: llevas tráfico y leads, y luego no hay forma de saber "
  "cuáles acabaron facturando. Ese trozo es justo el nuestro. Si alguna vez te viene bien "
  "comparar notas, encantado."),

 ("Maria Quesada", "2-YzRmOWFmZGYtZTVjMy00ZTVjLTg2ZTUtZTI2MjZhNWNjZDc1XzEwMA==",
  "Hola María, te debo una disculpa: el mensaje que te llegó hablaba de academias de formación "
  "y vosotros sois distribución industrial. Se me coló y era evidente.\n\n"
  "Lo que hacemos de verdad es esto: miramos por dónde se pierde negocio entre que alguien pide "
  "un presupuesto y firma, y lo arreglamos con IA dentro del sistema que ya tenéis.\n\n"
  "En distribución suele estar en los presupuestos enviados que nadie persigue. Si quieres te lo "
  "miro y te lo cuento por escrito, sin reunión ni compromiso."),

 ("Pablo Iglesias", "2-NmRiNTE1ZDQtZGVkZi00MTdmLWI5YzEtZTJmN2JlNTIzY2IyXzEwMA==",
  "Gracias a ti, Pablo.\n\n"
  "Te cuento a qué me dedico, que no llegué a decírtelo. Detectamos dónde se pierden clientes "
  "entre el primer contacto y la venta, y lo arreglamos con IA dentro del sistema que ya tenéis.\n\n"
  "En e-learning a medida para empresas el punto flojo casi siempre es el mismo: propuestas que "
  "se envían, se comentan una vez y se quedan ahí sin que nadie sepa cuántas acabaron en "
  "proyecto. Si te pica la curiosidad de saber ese número en the three axis, te lo miro gratis y "
  "por escrito."),

 ("Ignacio Orrios", "2-MGVjY2Y3MmUtNDJmYy00N2IwLWE5YTUtN2E5YTJhYzhkZDg5XzEwMA==",
  "Gracias a ti, Ignacio.\n\n"
  "Te resumo qué hacemos, que me quedé corto. Miramos dónde se pierde negocio entre el primer "
  "contacto y la firma, y lo arreglamos con IA dentro del sistema que ya tengáis.\n\n"
  "En prevención de riesgos el agujero suele ser la renovación: contratos que vencen y nadie "
  "persigue a tiempo, y presupuestos que se mandan y se quedan sin respuesta. Si quieres te digo "
  "qué veo desde fuera, por escrito y sin llamada."),

 ("Luis Alonso", "2-MGMxYzkyYWYtYTgzOC00ZDg0LWE2OTItYTk2MjI5ZDk1ZTUyXzEwMA==",
  "Gracias a ti, Luis.\n\n"
  "Te explico qué hago. Detectamos dónde se pierden clientes entre el primer contacto y la "
  "venta, y lo arreglamos con IA dentro del sistema que ya tenéis.\n\n"
  "En Tecnofor Sur tenéis dos negocios distintos conviviendo: formación subvencionada y el "
  "centro de soldadura. Cuando pasa eso, el marketing suele ser común y nadie tiene medido qué "
  "línea trae de verdad el dinero. Si quieres te lo miro y te lo paso por escrito, gratis."),

 # --- noes educados: sin pedir reunion ---------------------------------
 ("Johanna Ruiz", "2-ZmJhODg2MTEtYzQyZC00OTZmLWIyMzItODljNDg0OWQ5NDZmXzEwMA==",
  "Perfecto Johanna, gracias por contestar y sin problema.\n\n"
  "Te dejo solo el dato por si algún día os sirve: en empresas que llevan selección y trabajo "
  "temporal a la vez, el número que casi nunca está medido es cuál de las dos líneas trae el "
  "cliente que más factura. Cuando aparece, suele sorprender.\n\n"
  "Si en algún momento queréis mirarlo, aquí estoy. Suerte con el trimestre."),

 ("Isabel Nieto", "2-NmM4NDExNzMtMzNmNS00NTQ1LTkyZDgtNGNhYmEyN2RmODliXzEwMA==",
  "Gracias por la claridad, Isabel, y me alegro de que lo tengáis atado.\n\n"
  "Una cosa y lo dejo: con Salesforce bien montado lo que suele quedar suelto no es el dato, es "
  "la atribución entre portales. Saber si el comprador que firmó venía de idealista, de fotocasa "
  "o de vuestra web, y no solo dónde entró el primer clic.\n\n"
  "Si algún día queréis ese número, sabéis dónde encontrarme. 27 años y tres oficinas no se "
  "sostienen por casualidad."),

 ("Alicia Pomares", "2-NDZkM2Y3OTAtYTNlZC00YTJjLWE2YjItNjEzNzBhOGM3NGI0XzEwMA==",
  "Gracias por contestar, Alicia, y tranquila.\n\n"
  "Te dejo una idea por si os vale sin mí: en consultoras que hacen evaluación del desempeño y "
  "transformación cultural, lo que casi nadie tiene medido es cuál de las dos líneas trae al "
  "cliente que luego compra la otra. Suele ser una la que abre la puerta y otra la que factura.\n\n"
  "Suerte y gracias por el tiempo."),

 ("Miguel Valenzuela", "2-NjY3MWEwZjQtNDFlZC00MGIyLTkzMGItMzU1YWQ1MTY5N2U1XzEwMA==",
  "Gracias Miguel, y bien por llevar tiempo con Zoho.\n\n"
  "Justo por eso te lo digo: lo que nosotros hacemos no es cambiarte de CRM, es hacer que el que "
  "ya tienes deje de perder gente por el camino. Con Zoho el punto flojo suele estar en los "
  "contactos de hace 12 o 24 meses que nadie vuelve a tocar.\n\n"
  "No te doy más la lata. Si algún día quieres que lo mire, me dices."),

 ("David Morillo", "2-ZmNhMDliZjctMGQwNC00NGQ4LTljZDEtOGJhZjg1NjkzMzE3XzEwMA==",
  "Gracias por contestar claro, David, se agradece.\n\n"
  "Lo dejo aquí. Solo por si algún día cambia: lo nuestro no es traer más leads, es que los que "
  "ya entran no se caigan entre el primer contacto y la firma. En IT recruiting eso suele estar "
  "en las vacantes que se quedan a medio proceso.\n\n"
  "Suerte a ti también."),

 ("Alejandro Pineiro", "2-ODIyYWQ5ZTYtYmEyMS00ZjdkLWI5NTUtNDIwZGQ2M2QwZTY5XzEwMA==",
  "Sin problema Alejandro, gracias por decirlo directo.\n\n"
  "Te dejo una cosa y no insisto más: en e-learning lo que casi nunca está medido es cuántos de "
  "los que piden información acaban matriculándose, y por qué se caen los demás. Si algún día "
  "queréis ese número, es gratis preguntármelo.\n\nSuerte."),

 ("Jose Luis Soler", "2-NjNlMmQ4MTQtZGMwZC00MGU3LWI2YmQtMzk5NGRlZDA4ZGNhXzEwMA==",
  "Entendido José Luis, gracias por contestar.\n\n"
  "Solo una cosa por si os sirve en algún momento: en academias, la matrícula que más se pierde "
  "es la del que pide información y no recibe nada en las 48 horas siguientes. No hace falta "
  "invertir más para recuperarla, hace falta que alguien la persiga.\n\n"
  "Si algún día lo queréis mirar, aquí estoy. Buen curso."),

 ("Josele Lafuente", "2-MDVmNTY1YmMtNDY3ZS00ZWY3LTlhMTItMWIzYTA1MDkyY2VlXzEwMA==",
  "Gracias por explicarlo, Josele, y si llenáis las plazas no hay nada que arreglar.\n\n"
  "Te digo una cosa con honestidad: con conversión alta y control manual, meter sistema no os "
  "aporta gran cosa. Donde sí lo notaríais es el día que queráis abrir una segunda línea o más "
  "plazas, porque ahí lo manual deja de aguantar.\n\n"
  "Si ese día llega, me dices. Suerte."),

 ("Luis Miguel Soto", "2-MTNmZTljNDAtODVmYy00NzA4LTgyOGYtNWE5MDYzNTRkZDExXzEwMA==",
  "Gracias Luis Miguel, y gracias por guardar el contacto.\n\n"
  "Te dejo el dato por si algún día toca: en formación para transporte, lo que suele estar sin "
  "medir es cuántos de los que preguntan por un curso acaban matriculándose, y cuántos se caen "
  "simplemente porque nadie les vuelve a llamar. Recuperar eso no cuesta más inversión.\n\n"
  "Cuando queráis, aquí estoy."),

 ("Roman Alvarez", "2-NDAwMmUzYzAtNTk3OS00OWYzLTk3MzctYTRhZjAxNGEyMTQ2XzEwMA==",
  "Perfecto Román, gracias.\n\n"
  "Una sola cosa y lo dejo: tener el sistema montado y tener medido dónde se cae la gente no "
  "siempre es lo mismo. La pregunta que casi nadie sabe responder es qué porcentaje de los que "
  "piden información acaba matriculado, y por qué el resto no.\n\n"
  "Si algún día queréis ese número, es gratis preguntar. Suerte."),

 ("Elisa Puerto", "2-YWM5NzFmOTYtZGU4MC00NmU1LWIxYzEtYTkxNTIwNmRhYzUxXzEwMA==",
  "Gracias por contestar, Elisa.\n\n"
  "Te dejo algo por si os vale más adelante: en e-learning la matrícula se suele perder en los "
  "días siguientes a la solicitud de información, no en la captación. Es el trozo más barato de "
  "arreglar y el que menos se mira.\n\n"
  "Si algún momento queréis que lo mire, me decís. Suerte."),

 # --- sin venta, a proposito -------------------------------------------
 ("Maria Carrascal", "2-ZDNmNjdhNWEtNjM2OS00MzJlLWE0ZmMtODU3MzcwMTU0NmJjXzEwMA==",
  "María, tienes toda la razón y te pido perdón.\n\n"
  "Te dije que nada de venta y luego te entró un correo automático de una secuencia. No fue a "
  "propósito, pero da igual: el resultado es el que tú dices, no te saqué de la lista. Ya está "
  "hecho y no te va a volver a llegar nada.\n\n"
  "Me sabe mal porque la conversación que tuvimos sobre Emana me pareció de las buenas. Si algún "
  "día te apetece retomarla, será sin venderte nada. Y si no, lo entiendo perfectamente."),

 ("Felipe Lloreda", "2-OTgzYjJkM2QtOGQ1MC00NWNhLWIwYWEtY2FlMDdkNGFhMTk1XzEwMA==",
  "Tienes razón, Felipe, y gracias por decírmelo en vez de callarte.\n\n"
  "Ese mensaje hablaba de academias de formación y tú no te dedicas a eso. Fue un fallo mío al "
  "segmentar, no un descuido tuyo al leerlo. Lo he corregido.\n\n"
  "No te escribo para reconducirlo a nada. Solo para decirte que el aviso me sirvió."),

 ("Ximo Prieto", "2-NWM4Nzk0MTYtZTZhNy00MmY0LTlkOTEtMWViNjU0NTI0MWYzXzEwMA==",
  "Justo, Ximo, le he echado un ojo a onnadigital y vais a lo mismo que nosotros por otro lado.\n\n"
  "Nada que venderte entonces. Si algún día te sale un cliente al que le encaje más lo que "
  "hacemos nosotros, o al revés, me dices y lo hablamos.\n\nSuerte con ello."),
]


def manda(cid, texto):
    cuerpo = {"conversationId": cid, "linkedInAccountId": CUENTA,
              "message": texto, "subject": ""}
    req = urllib.request.Request("https://api.heyreach.io/api/public/inbox/SendMessage",
                                 data=json.dumps(cuerpo).encode(), headers=H, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=90) as f:
            return "ok", f.read().decode()[:120]
    except urllib.error.HTTPError as e:
        return "FALLO", f"{e.code} {e.read().decode()[:200]}"
    except Exception as e:
        return "FALLO", str(e)


if __name__ == "__main__":
    ok = fallo = 0
    for nombre, cid, texto in MSJ:
        if not ENVIA:
            print(f"[seco] {nombre:20} {len(texto):4} car · {texto.splitlines()[0][:70]}")
            continue
        est, det = manda(cid, texto)
        print(f"[{est}] {nombre:20} {det[:90]}")
        ok += est == "ok"
        fallo += est != "ok"
        time.sleep(5)
    if ENVIA:
        print(f"\nenviados {ok} · fallidos {fallo} · total {len(MSJ)}")
