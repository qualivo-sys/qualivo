# -*- coding: utf-8 -*-
# Lanza la cola de llamadas de Raquel con el guion v4.
#
# Dos cosas que aprendimos a base de llamadas malas y que estan resueltas aqui:
#
# 1. La mitad de estos numeros son FIJOS de empresa. Contesta recepcion, no
#    quien decide. Por eso cada lead trae su propia "apertura": si sabemos el
#    nombre de la persona se pregunta por ella, y si solo tenemos la empresa se
#    pregunta por quien lleva la captacion. Mandar la misma frase a los dos
#    casos es lo que hacia que la llamada empezara torcida.
#
# 2. Vapi va detras de Cloudflare y tumba las peticiones sin User-Agent de
#    navegador. Da un 1010 que no dice nada.
#
# Uso: python3 llamadas.py            (seco, enseña lo que diria)
#      python3 llamadas.py --envia    (marca de verdad)
import json, os, sys, time, urllib.request

S = os.path.dirname(os.path.abspath(__file__))
K = open(os.path.join(S, ".vapi_key")).read().strip()
AID = open(os.path.join(S, ".vapi_assistant_id")).read().strip()
PID = open(os.path.join(S, ".vapi_phone_id")).read().strip()
H = {"Authorization": f"Bearer {K}", "Content-Type": "application/json",
     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
     "Accept": "application/json"}
ENVIA = "--envia" in sys.argv
DIAS = "mañana a las diez o el jueves a las doce"

# Que le duele a cada sector, en una frase que se pueda decir en voz alta.
DOLOR = {
 "clinicas": ("lo de las consultas que se quedan sin cita",
              "que muchos que preguntan precio por WhatsApp no acaban pidiendo cita"),
 "obra": ("lo de los presupuestos que se quedan sin respuesta",
          "que se envian presupuestos y nadie vuelve a saber de ellos"),
 "formacion": ("lo de las solicitudes que no acaban en matricula",
               "que mucha gente pide informacion de un curso y nadie vuelve a llamarla"),
 "asesorias": ("lo de los presupuestos que se quedan por el camino",
               "que se mandan propuestas y no se sabe cuantas acaban en alta"),
}

# telefono, empresa, sector, persona (vacio si no la sabemos), aperturas
COLA = [
 # Numeros sacados uno a uno de la ficha del lead en Smartlead, NO de la tabla
 # del informe: la tabla los recorta a la derecha y cuatro de los ocho que
 # reconstrui a ojo estaban mal. Un digito de mas o de menos es llamar a un
 # desconocido.
 ("+34689072412", "FIND IN CORPORATE", "asesorias", "", 7),
 ("+34711268234", "MN Welding Academy", "formacion", "", 5),
 ("+34934353688", "MICROFUSA", "formacion", "Ignasi", 5),
 ("+34618223366", "Nusiveta Fusteria", "obra", "", 4),
 ("+34931178853", "Fana Dental Care", "clinicas", "", 4),
 ("+34932426950", "Reformas Koncepto", "obra", "", 4),
 ("+34669768577", "Reformas Actur 3000", "obra", "", 4),
 # Este telefono sale de su web, no de Smartlead. El nombre, de su correo.
 ("+34932927570", "Plastic Academia", "formacion", "Pep", 4),
]


def apertura(persona):
    if persona:
        return f"¿Podría hablar con {persona}?"
    # Sin nombre no se puede preguntar por nadie, asi que se pregunta por el
    # puesto. Pedir "el responsable" a secas suena a comercial; pedir "quien
    # lleva la captacion" suena a que sabes de que hablas.
    return ("Perdona que te moleste. ¿Quién lleva ahí la parte de captación de "
            "clientes o de marketing?")


def lanza(tel, empresa, sector, persona, ab):
    corto, concreto = DOLOR[sector]
    cuerpo = {
        "assistantId": AID,
        "phoneNumberId": PID,
        "customer": {"number": tel},
        "assistantOverrides": {
            "variableValues": {
                "apertura": apertura(persona),
                "nombre": persona or "",
                "empresa": empresa,
                "dato_corto": corto,
                "dato_concreto": concreto,
                "dias_ofrecidos": DIAS,
                "n_aperturas": str(ab),
            }
        },
    }
    if not ENVIA:
        print(f"  [seco] {empresa:24} {tel:14} · \"Hola, buenos días. "
              f"{apertura(persona)}\"")
        return None
    req = urllib.request.Request("https://api.vapi.ai/call",
                                 data=json.dumps(cuerpo).encode(), headers=H, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as f:
            d = json.loads(f.read().decode())
        print(f"  [marcando] {empresa:24} {tel:14} id={d.get('id')}")
        return d.get("id")
    except Exception as e:
        try:
            print(f"  [FALLO] {empresa}: {e.code} {e.read().decode()[:200]}")
        except Exception:
            print(f"  [FALLO] {empresa}: {e}")
        return None


if __name__ == "__main__":
    cuantas = int(sys.argv[sys.argv.index("--n") + 1]) if "--n" in sys.argv else len(COLA)
    ids = []
    for tel, emp, sec, per, ab in COLA[:cuantas]:
        i = lanza(tel, emp, sec, per, ab)
        if i:
            ids.append({"id": i, "empresa": emp, "tel": tel, "sector": sec})
        time.sleep(4)
    if ENVIA and ids:
        p = os.path.join(S, "llamadas_en_curso.json")
        json.dump(ids, open(p, "w"), ensure_ascii=False, indent=1)
        print(f"\n{len(ids)} llamadas lanzadas -> {p}")
