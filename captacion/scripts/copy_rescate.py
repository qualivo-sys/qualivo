#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Construye el copy del rescate del funnel de Meta de febrero.
#
# No es cold email y no se escribe como tal. Esta gente levanto la mano, dejo su
# telefono y en varios casos puso fecha. El unico angulo honesto es reconocer
# que la pelota se quedo en nuestro tejado, porque es lo que paso.
#
# Tres textos, segun lo que ocurrio de verdad:
#   A (cita)    ya habia una fecha concreta acordada -> se nombra
#   B (hablo)   hubo conversacion y se apago         -> se reconoce sin inventar
#   C (nunca)   dejo el formulario y nadie le llamo  -> se dice tal cual
# Mandarle a un "C" un "lo que dejamos a medias" seria mentirle, y de los seis
# de ese grupo cinco ni cogieron el telefono: lo que les debemos es la verdad.
#
# Uso: python3 copy_rescate.py <funnel.json> --out <payload.json>
import json
import sys

FIRMA = ("\n\n--\nMaikel Echevarría · CEO\nQualivo · qualivo.io\n663 375 205")
DIAG = "https://qualivo.io/diagnostico/"
LLAMADA = "https://qualivo.io/llamada/"

# Lo que quedo por escrito en la ficha de cada uno. Se usa literal dentro del
# email: es lo unico que demuestra que hay alguien al otro lado y no un envio.
CITA = {
 "f.sardinero@vortexrenovables.es":
   ("quedamos un sábado a las once que nunca llegó a pasar",
    "Hablamos de fotovoltaica y aerotermia, de tickets de trece a treinta mil, y "
    "me quedé con una frase tuya: que el servicio que cerráis ya os es rentable."),
 "info@peaceofmindvalencia.es":
   ("teníamos una videollamada un viernes a las 16:30 que se quedó en el aire",
    "Hablamos de los viajes en grupo, del público de cuarenta para arriba y de que "
    "querías poner dos mil euros a trabajar."),
 "contacto@mujeresencia.es":
   ("quedamos para el jueves siguiente y ese jueves no llegó nunca",
    "Me dijiste que estabas mirando otras opciones, y me parece justo: yo tampoco "
    "volví a darte motivos para elegirnos."),
 "jose.alvez@kriontek.com":
   ("teníamos llamada el jueves 19 y no se hizo",
    "Se quedó agendada y ahí se quedó."),
 "jestrems@bigpoma.com":
   ("quedó pendiente cerrar la hora de una sesión y nadie la cerró",
    "Me contaste que generáis leads pero que no se acaban cerrando ventas."),
 "gabrielhernalsteens@hotmail.com":
   ("quedamos el día 14 a las 11:30 y no llegué a llamarte",
    "Me contaste que compras leads a cincuenta euros y que mueves entre dos y tres "
    "mil, con clientes de Holanda, Bélgica, Alemania y Francia."),
}

# Los que dejaron el formulario y con los que nunca se llego a hablar.
NUNCA = {"armandoguerrasegura@hotmail.com", "anatiger123@gmail.com",
         "info@ahorroysolutions.com", "cenesameuropa@gmail.com",
         "ainaraypaco2011@gmail.com", "dejesusmerchan@hotmail.com"}

CIERRE = (f"Puedes ver cómo trabajamos ahora aquí: {DIAG}\n"
          f"Y si prefieres hablarlo, son quince minutos: {LLAMADA}")


def construir(l):
    nom = l["nombre"]
    em = l["email"]
    if em in CITA:
        cuando, contexto = CITA[em]
        asunto = "lo que dejamos a medias en febrero"
        cuerpo = (
          f"Hola {nom},\n\n"
          "He estado repasando conversaciones que se quedaron a medias y me he "
          f"encontrado con la nuestra: {cuando}.\n\n"
          f"{contexto}\n\n"
          "La pelota estaba en mi tejado y no la moví. Así que esto no es un "
          "seguimiento, es una disculpa con una pregunta detrás.\n\n"
          "¿Sigue ahí el problema? Si ya lo tienes resuelto me lo dices y no te "
          "escribo más. Y si sigue, son quince minutos y te digo qué veo.\n\n"
          f"{CIERRE}")
    elif em in NUNCA:
        asunto = "te apuntaste y nadie te llamó"
        cuerpo = (
          f"Hola {nom},\n\n"
          "En febrero dejaste tus datos para que habláramos y nadie te llamó. "
          "Eso es culpa nuestra y es justo lo contrario de lo que vendemos, así "
          "que te lo digo sin adornos.\n\n"
          "Te escribo por si aquello que te hizo dejar el formulario sigue "
          "pendiente. Nosotros miramos dónde se pierden clientes entre que entra "
          "una solicitud y se firma, y lo arreglamos dentro del sistema que ya "
          "tengas.\n\n"
          "Si ya no te interesa, respóndeme BAJA y te saco. Y si sí, son quince "
          "minutos.\n\n"
          f"{CIERRE}")
    else:
        asunto = "te escribo siete meses tarde"
        cuerpo = (
          f"Hola {nom},\n\n"
          "Hablamos en febrero y la conversación se apagó por mi parte. He "
          "estado repasando las que se quedaron a medias y la tuya estaba ahí.\n\n"
          "No voy a retomarlo como si no hubieran pasado siete meses. Solo quiero "
          "saber una cosa: lo que te preocupaba entonces, ¿sigue igual?\n\n"
          "Si lo resolviste, me alegro y no te molesto más. Si sigue, son quince "
          "minutos y te digo qué veo desde fuera.\n\n"
          f"{CIERRE}")

    seg = (
      f"Hola {nom},\n\n"
      "Te dejo el ejemplo que mejor explica a qué me dedico ahora.\n\n"
      "Una clienta tenía años de contactos y nadie detrás. No captamos ni un lead "
      "nuevo: ordenamos la base, priorizamos y perseguimos con fecha. Recuperó "
      "6,45 veces lo que invirtió.\n\n"
      "Es literalmente lo que acabo de hacer contigo: mirar quién se quedó a "
      "medias y volver a llamar.\n\n"
      "¿Te va bien esta semana o la que viene?")

    ultimo = (
      f"Hola {nom},\n\n"
      "Lo dejo aquí y no insisto más.\n\n"
      "Si tuvieras que apostar dónde se pierde más negocio en tu empresa hoy: "
      "¿captación, conversión o seguimiento?\n\n"
      "Contéstame con una palabra y te digo si coincide con lo que veo desde "
      f"fuera.\n\nY si lo prefieres en directo: {LLAMADA}")

    return asunto, cuerpo + FIRMA, seg + FIRMA, ultimo + FIRMA


def main():
    leads = json.load(open(sys.argv[1], encoding="utf-8"))
    payload = []
    for l in leads:
        s, b1, b2, b3 = construir(l)
        payload.append({
            "email": l["email"], "first_name": l["nombre"],
            "last_name": l["apellido"], "company_name": l["empresa"],
            "phone_number": l["tel"],
            "custom_fields": {"subject1": s, "body1": b1, "body2": b2,
                              "body3": b3, "puerta": "rescate"}})
    if "--out" in sys.argv:
        d = sys.argv[sys.argv.index("--out") + 1]
        json.dump(payload, open(d, "w", encoding="utf-8"), ensure_ascii=False)
        print(f"{len(payload)} leads escritos en {d}")
        return
    for p in payload[:3]:
        print("=" * 72)
        print("PARA:", p["email"], "· ASUNTO:", p["custom_fields"]["subject1"])
        print(p["custom_fields"]["body1"])


if __name__ == "__main__":
    main()
