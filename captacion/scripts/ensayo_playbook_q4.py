# -*- coding: utf-8 -*-
# Ensayo del Outbound Playbook V1 · Secuencias Q4 2026 (Notion, 15-oct).
# Fuente unica del copy: https://app.notion.com/p/3fa56e1ad6ed813b8b04d23d0c156877
# Regla del playbook: usar la secuencia del sector y sustituir SOLO nombre y
# empresa. No reescribir ni mezclar versiones. Solo Formacion, Reformas y
# Clinicas: B2B, inmobiliaria y solar siguen fuera de la biblioteca aprobada.
#
# Solo filtra y pinta los correos tal y como llegarian. No toca Smartlead.
# Uso: python3 ensayo_playbook_q4.py <dir_datos> [salida.md]
# Entrada: <dir_datos>/playbook_leads.json
#   [{email, email_status, nombre, empresa_visible, dominio, sector, senales,
#     actividad_ok, nota}]  sector en {"Formación","Reformas","Clínicas"}
#          <dir_datos>/enviados_reales.json
import json, sys, re

COPY = {
"Formación": [
("las solicitudes de {{empresa}}", """Hola {{nombre}},

Una pregunta sobre {{empresa}}: cuando alguien pide información sobre un curso y no acaba matriculándose, ¿tenéis identificado si no cumplía los requisitos, si no estaba preparado o si se quedó sin seguimiento?

En Qualivo analizamos todo el recorrido, identificamos qué perfiles de alumnos generan más negocio y diseñamos el sistema de captación: anuncios, landings y formularios.

Después incorporamos IA para cualificar interesados, responder por WhatsApp y teléfono, agendar entrevistas y automatizar seguimientos. Todo conectado a un panel para medir qué campañas generan matrículas.

Podemos enseñarte una demo adaptada a {{empresa}}.

¿Te encaja verla en 15 minutos, sin compromiso?

Maikel"""),
("Re: las solicitudes de {{empresa}}", """Hola {{nombre}},

Te escribo por una cuestión concreta: muchas solicitudes de formación necesitan varios contactos antes de convertirse en matrícula.

El sistema que planteamos permite distinguir quién cumple los requisitos, quién está preparado para matricularse y quién necesita más información, sin que vuestro equipo tenga que perseguir manualmente cada solicitud.

Además, avisa al equipo de admisiones cuando conviene intervenir.

¿Te interesaría ver un ejemplo con uno de vuestros cursos?

Maikel"""),
("Re: las solicitudes de {{empresa}}", """{{nombre}}, cierro el hilo por mi parte.

La idea no es enseñarte otro CRM ni un chatbot genérico.

Es mostrarte cómo podría funcionar en {{empresa}} un recorrido completo: desde el anuncio hasta la matrícula, con cualificación, seguimiento y métricas de conversión.

¿Tiene sentido enseñártelo o no es una prioridad ahora?

Maikel"""),
],
"Reformas": [
("presupuestos de {{empresa}}", """Hola {{nombre}},

Una pregunta sobre {{empresa}}: cuando enviáis un presupuesto y el cliente deja de responder, ¿tenéis un proceso para recuperar esa oportunidad o depende del seguimiento de cada comercial?

En Qualivo analizamos desde la captación hasta la firma. Identificamos los proyectos más rentables y diseñamos anuncios, landings y formularios para atraer solicitudes de ese perfil.

Después implementamos IA para cualificar contactos, responder consultas, agendar visitas y automatizar seguimientos, con avisos al comercial y un panel para medir qué campañas acaban generando obras.

¿Te encajaría ver una demo adaptada a {{empresa}} en 15 minutos?

Maikel"""),
("Re: presupuestos de {{empresa}}", """Hola {{nombre}},

Te pongo un ejemplo de lo que podríamos enseñarte.

Alguien solicita una reforma. El sistema recoge qué necesita, zona, plazo y presupuesto orientativo, y ayuda a priorizar los proyectos que encajan.

Si el interesado no está listo, mantiene el seguimiento. Si quiere avanzar, facilita la visita y avisa al comercial.

Todo queda registrado para saber qué solicitudes acaban convirtiéndose en proyectos.

¿Te interesaría verlo aplicado a {{empresa}}?

Maikel"""),
("Re: presupuestos de {{empresa}}", """{{nombre}}, último correo por mi parte.

La idea es sencilla: captar solicitudes que encajen mejor, evitar que los presupuestos se queden sin seguimiento y dar visibilidad sobre qué acciones generan proyectos firmados.

Podemos mostrarte un ejemplo con el tipo de trabajos de {{empresa}}, sin compromiso.

¿Te vendría bien verlo o lo dejamos para otro momento?

Maikel"""),
],
"Clínicas": [
("consultas y citas en {{empresa}}", """Hola {{nombre}},

Una pregunta sobre {{empresa}}: cuando alguien consulta por un tratamiento pero no reserva cita, ¿sabéis qué ocurre después con ese posible paciente?

En Qualivo analizamos todo el recorrido, identificamos qué tratamientos y perfiles generan más negocio y diseñamos campañas, landings y formularios para atraer consultas con mayor encaje.

Después implementamos IA para atender consultas habituales, cualificar interesados, facilitar citas, enviar recordatorios y hacer seguimiento, derivando al equipo los casos que requieren atención personal.

Todo conectado a un panel para medir consultas, citas y resultados comerciales.

¿Te gustaría ver una demo adaptada a vuestra clínica? Son 15 minutos, sin compromiso.

Maikel"""),
("Re: consultas y citas en {{empresa}}", """Hola {{nombre}},

Te explico qué podríamos enseñarte en la demo.

Un posible paciente solicita información. El sistema responde las dudas administrativas habituales, recoge los datos necesarios, facilita la cita y envía recordatorios.

Si necesita atención del equipo o muestra interés en reservar, se deriva a recepción con el contexto de la conversación.

Así podéis medir qué campañas generan citas efectivas y dónde hay margen de mejora.

¿Te encajaría verlo aplicado a {{empresa}}?

Maikel"""),
("Re: consultas y citas en {{empresa}}", """{{nombre}}, cierro el hilo.

No se trata de sustituir a recepción ni de poner un chatbot más.

La idea es mejorar la captación, facilitar la gestión de consultas y citas, y ayudar a vuestro equipo a centrarse en los pacientes que necesitan atención.

Si tiene sentido, te enseño una demo adaptada a {{empresa}} en 15 minutos.

¿Lo vemos o preferís dejarlo para otro momento?

Maikel"""),
],
}
DIAS = [0, 4, 8]

BLOQUEADOS = {"growitschool.com", "growthhackingcourse.io", "anticbarcelona113.es",
              "formacion.ninja", "kubysoft.com", "escolaeronauticadecatalunya.cat"}
ROL = re.compile(r"^(info|hola|contacto|admin|ventas|comercial|marketing|rrhh|"
                 r"office|hello|sales|soporte|support|recepcion|clinica|secretaria)@")
SENAL = {"hubspot", "salesforce", "zoho", "pipedrive", "activecampaign", "meta", "ads"}

def rinde(t, nombre, empresa):
    return t.replace("{{nombre}}", nombre).replace("{{empresa}}", empresa)

def comprueba_copy():
    for s, pasos in COPY.items():
        for asunto, cuerpo in pasos:
            assert "—" not in cuerpo + asunto and "–" not in cuerpo + asunto, s
            assert not re.findall(r"\{\{(?!nombre\}\}|empresa\}\})", cuerpo + asunto), s

def motivo_fuera(l, enviados):
    em = (l.get("email") or "").lower()
    dom = l.get("dominio") or ""
    return ((l.get("sector") not in COPY and "sector fuera del playbook")
        or (not em and "sin correo")
        or (l.get("email_status") != "verified" and "correo no verificado")
        or (ROL.match(em) and "buzón de rol")
        or (em.split("@")[-1] != dom and "dominio cruzado")
        or (dom in BLOQUEADOS and "cliente bloqueado")
        or (em in enviados and "ya contactado")
        or (not SENAL & set(l.get("senales") or []) and "sin señal verificada")
        or (not l.get("actividad_ok") and "su actividad no encaja con el copy del sector")
        or (not (l.get("nombre") or "").strip() and "sin nombre")
        or (not (l.get("empresa_visible") or "").strip() and "sin empresa"))

def main():
    d = sys.argv[1]
    salida = sys.argv[2] if len(sys.argv) > 2 else None
    comprueba_copy()
    gente = json.load(open(f"{d}/playbook_leads.json"))
    enviados = set(json.load(open(f"{d}/enviados_reales.json"))["correos"])
    entran, fuera = [], []
    for l in gente:
        m = motivo_fuera(l, enviados)
        (fuera if m else entran).append((l, m))
    por = {}
    for l, _ in entran: por.setdefault(l["sector"], []).append(l)
    print("ENTRAN", len(entran), {s: len(v) for s, v in por.items()}, "· FUERA", len(fuera))
    for l, m in fuera:
        print(f"  fuera: {l.get('nombre')} ({l.get('empresa_visible')}) · {m}")
    if not salida: return
    out = []
    for s, leads in por.items():
        out.append(f"## {s}\n")
        for l in leads:
            n, e = l["nombre"], l["empresa_visible"]
            out.append(f"### {n} · {e} ({l['dominio']})\n")
            out.append(f"Señal en su web: {', '.join(l['senales'])}. {l.get('nota') or ''}\n")
            for dia, (asunto, cuerpo) in zip(DIAS, COPY[s]):
                out.append(f"**Día {dia}** · asunto: *{rinde(asunto, n, e)}*\n")
                out.append("\n".join("> " + x if x else ">" for x in rinde(cuerpo, n, e).split("\n")) + "\n")
    out.append("## No entran\n")
    for l, m in fuera:
        out.append(f"- {l.get('nombre')} · {l.get('empresa_visible')}: {m}")
    open(salida, "w").write("\n".join(out) + "\n")
    print("escrito", salida)

if __name__ == "__main__":
    main()
