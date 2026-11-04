# Copy v4 (4-nov). Pedido de Maikel: mensajes mas cortos y mejores, y sin el
# "responde BAJA" en el cuerpo. La baja sigue estando (LSSI/RGPD): una linea
# discreta al pie que no pide nada.
# Mismo contrato que carga_v3.construir(): devuelve asunto, body1, body2, body3
# para los custom fields de Smartlead. La secuencia de la campana no se toca.
# Sin enlaces en el email 1: con dos dominios en SURBL, cada enlace es riesgo de
# bandeja, y la llamada se pide con una pregunta, no con un link.
import sys
sys.path.insert(0, "/home/user/qualivo/captacion/scripts")
import carga_v3
from carga_v3 import limpia_empresa

PIE = ("Maikel Echevarría · Qualivo\n"
       "Si no te encaja, dímelo y no vuelvo a escribirte.")

APERTURA = {
    "anuncios": ("{emp} y vuestros anuncios",
                 "Veo que {emp} está invirtiendo en anuncios. Pregunta directa: "
                 "¿sabéis qué campaña os trajo el último cliente que firmó?"),
    "crm": ("{emp} y vuestro {crm}",
            "Veo que en {emp} trabajáis con {crm}. Pregunta directa: ¿cuántas "
            "oportunidades llevan más de un mes abiertas sin que nadie las toque?"),
    "lista": ("{emp} y vuestra lista",
              "Veo que en {emp} mandáis campañas con {herramienta}. Pregunta directa: "
              "¿sabéis cuántas ventas salen de cada envío?"),
}

def _puerta(p):
    return "anuncios" if p in ("google_ads", "meta_ads", "linkedin_ads", "anuncios") else (
        "crm" if p == "crm" else "lista" if p == "lista" else "anuncios")

def construir(l):
    emp = limpia_empresa(l.get("company_name") or "") or "vuestra empresa"
    crm = ((l.get("v") or {}).get("crm")) or "el CRM"
    herr = ((l.get("v") or {}).get("herramienta")) or "vuestra herramienta"
    nom = l.get("first_name") or ""
    saludo = f"Hola {nom}," if nom else "Hola,"
    asunto, pregunta = APERTURA[_puerta(l.get("puerta") or "")]
    f = lambda s: s.format(emp=emp, crm=crm, herramienta=herr)
    duda = ("Si no lo sabes de memoria" if _puerta(l.get("puerta") or "") == "crm"
            else "Si la respuesta es «más o menos»")
    b1 = (f"{saludo}\n\n{f(pregunta)}\n\n"
          f"{duda}, ahí suele estar el dinero que se escapa. "
          "Ayudo a empresas como la vuestra a verlo y a arreglarlo.\n\n"
          "¿Te cuento en 15 minutos lo que veo desde fuera?\n\n"
          f"{PIE}")
    b2 = (f"{saludo}\n\nUn ejemplo concreto: a una escuela de formación le conectamos cada "
          "euro de anuncios con la matrícula final. Salieron unos diez euros en matrículas "
          "por cada euro invertido.\n\n"
          f"¿Lo miramos para {emp}? Quince minutos y te digo si hay algo que rascar.\n\n"
          f"{PIE}")
    b3 = (f"{saludo}\n\nÚltimo correo, prometido. Si tuvieras que apostar dónde pierde más "
          f"negocio {emp}: ¿captación, conversión o seguimiento?\n\n"
          "Con una palabra me vale.\n\n"
          f"{PIE}")
    for b in (b1, b2, b3):
        if len(b.split()) > 80:
            print(f"  aviso: email largo ({len(b.split())} palabras) para {l.get('email')}")
    return f(asunto), b1, b2, b3

if __name__ == "__main__":
    # Vista previa: python3 carga_v4.py
    ej = {"first_name": "Laura", "company_name": "Clínica Ejemplo S.L.", "puerta": "google_ads", "email": "x"}
    for parte in construir(ej):
        print(parte, "\n----")
    ej2 = {"first_name": "Jordi", "company_name": "Instalaciones Demo", "puerta": "crm", "v": {"crm": "Odoo"}, "email": "y"}
    print(construir(ej2)[0], "\n", construir(ej2)[1])
