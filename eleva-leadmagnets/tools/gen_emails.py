#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera los 5 emails de la secuencia de bienvenida de Eleva Academy en HTML apto para email.

Formato de marca Eleva adaptado a email (tablas, estilos inline, fuentes web-safe con los
colores de marca, logo alojado en blog.elevanails.es, botón rosa). Salida en ../emails/.
Merge fields de GoHighLevel: {{contact.first_name}}, {{location.name}}, etc.
"""
import os, html

OUT = os.path.join(os.path.dirname(__file__), "..", "emails")
os.makedirs(OUT, exist_ok=True)

LOGO = "https://blog.elevanails.es/logo.png"
WA = "https://wa.me/34722792501"
BOOKING = "https://wa.me/34722792501?text=Hola,%20quiero%20reservar%20mi%20sesión%20de%20orientación"
HOT, DEEP, SHD, DARK, BLUSH = "#FF2D9E", "#CC0A78", "#8C0055", "#0D0208", "#FFF8FC"


def shell(preheader, blocks, cta_text=None, cta_url=BOOKING):
    cta = ""
    if cta_text:
        cta = f"""
      <tr><td align="center" style="padding:8px 32px 4px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td align="center" bgcolor="{HOT}" style="border-radius:999px;">
            <a href="{cta_url}" target="_blank"
               style="display:inline-block;padding:15px 34px;font-family:Arial,Helvetica,sans-serif;
                      font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">
              {html.escape(cta_text)}
            </a>
          </td>
        </tr></table>
      </td></tr>"""
    body = "".join(blocks)
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Eleva Academy</title></head>
<body style="margin:0;padding:0;background:{BLUSH};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">{html.escape(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{BLUSH};">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0"
         style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;
                box-shadow:0 6px 24px rgba(140,0,85,.08);">
    <tr><td align="center" bgcolor="{DEEP}"
            style="background:{DEEP};padding:26px 24px;">
      <img src="{LOGO}" width="120" alt="Eleva Academy"
           style="display:block;height:auto;max-width:120px;">
    </td></tr>
    <tr><td style="height:6px;background:{HOT};line-height:6px;font-size:6px;">&nbsp;</td></tr>
    {body}
    {cta}
    <tr><td style="padding:26px 32px 30px;">
      <div style="border-top:1px solid #F0D9E7;padding-top:16px;font-family:Arial,Helvetica,sans-serif;
                  font-size:12px;line-height:1.6;color:#8a6079;">
        Eleva Academy · Formación profesional en uñas<br>
        ¿Prefieres escribirnos? <a href="{WA}" style="color:{DEEP};">WhatsApp aquí</a><br>
        <span style="color:#b58aa8;">Recibes este email porque usaste una de nuestras herramientas.
        Si no quieres seguir recibiéndolos, {{{{unsubscribe}}}}.</span>
      </div>
    </td></tr>
  </table>
</td></tr></table></body></html>"""


def h1(t):
    return (f'<tr><td style="padding:28px 32px 6px;"><h1 style="margin:0;'
            f'font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.2;'
            f'font-weight:bold;color:{DARK};">{t}</h1></td></tr>')


def p(t):
    return (f'<tr><td style="padding:8px 32px;"><p style="margin:0;'
            f'font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;'
            f'color:#3a2a33;">{t}</p></td></tr>')


def bullets(items):
    lis = "".join(
        f'<tr><td width="22" valign="top" style="font-family:Arial;font-size:16px;color:{HOT};">✓</td>'
        f'<td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;'
        f'color:#3a2a33;padding-bottom:8px;">{t}</td></tr>' for t in items)
    return (f'<tr><td style="padding:6px 32px;"><table role="presentation" cellpadding="0" '
            f'cellspacing="0" width="100%">{lis}</table></td></tr>')


# ─────────────────────────── EMAILS ───────────────────────────
EMAILS = []

# B1 · Apertura (D0)
EMAILS.append(("EA_B1_Apertura_D0",
    "Bienvenida a Eleva · esto es lo que sigue",
    "Ya diste el primer paso 👋", [
    h1("¡Bienvenida! Ya has dado el primer paso"),
    p("Hola {{contact.first_name}},"),
    p("Gracias por usar nuestra herramienta. Que estés aquí significa que te ronda una idea: "
      "<strong>dedicarte a las uñas y vivir de ello</strong>. Y déjame decirte una cosa: es mucho "
      "más posible de lo que crees."),
    p("En Eleva Academy llevamos años formando a mujeres que empezaron justo donde estás tú ahora "
      "—con ganas y cero experiencia— y hoy trabajan de esto, muchas por cuenta propia."),
    p("Durante los próximos días te voy a contar cómo lo hacen: lo que de verdad hace falta para "
      "empezar, cuánto se puede ganar y cómo es nuestra formación. Sin humo."),
    p("De momento, si tienes cualquier duda, respóndeme a este email o escríbenos por WhatsApp. "
      "Leemos todo."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Hablar con nosotras por WhatsApp", WA))

# B2 · Autoridad (D2)
EMAILS.append(("EA_B2_Autoridad_D2",
    "Por qué confían en Eleva (y los resultados reales)",
    "Resultados reales de alumnas como tú", [
    h1("No es teoría: son resultados reales"),
    p("Hola {{contact.first_name}},"),
    p("Sé que cuando buscas formarte aparecen mil cursos y es difícil saber en quién confiar. "
      "Así que en vez de prometerte nada, te cuento lo que consiguen nuestras alumnas:"),
    bullets([
        "Aprenden una profesión con demanda real, esté donde estén.",
        "Salen sabiendo hacer uñas de gel y acrílico de principio a fin.",
        "Muchas empiezan a cobrar sus primeros trabajos antes de terminar.",
        "Reciben acompañamiento, no un vídeo y adiós.",
    ]),
    p("La diferencia no está solo en la técnica: está en que te enseñamos también a <strong>conseguir "
      "clientas y a cobrar lo que vales</strong>, que es lo que de verdad convierte un hobby en un trabajo."),
    p("En el próximo email te enseño cómo es la formación por dentro."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Quiero ver la formación", BOOKING))

# B3 · Sistema (D4)
EMAILS.append(("EA_B3_Sistema_D4",
    "Cómo es la formación de Eleva por dentro",
    "Así es nuestro método paso a paso", [
    h1("Así es nuestra formación por dentro"),
    p("Hola {{contact.first_name}},"),
    p("Te resumo cómo trabajamos, para que sepas exactamente qué esperar:"),
    bullets([
        "<strong>Técnica desde cero:</strong> preparación, gel, acrílico, nivelación y acabados.",
        "<strong>Práctica de verdad:</strong> no te quedas en la teoría, se aprende haciendo.",
        "<strong>Certificado</strong> al terminar para que puedas demostrar tu formación.",
        "<strong>Parte de negocio:</strong> cómo darte de alta, qué precios poner y cómo captar clientas.",
    ]),
    p("El objetivo no es que salgas sabiendo pintar uñas bonitas. Es que salgas preparada para "
      "<strong>trabajar de esto y ganar dinero</strong>, ya sea en un salón o por tu cuenta."),
    p("Si te encaja, el siguiente paso es una llamada corta para ver tu caso y decirte con sinceridad "
      "si esto es para ti. Te la propongo mañana."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Reservar mi sesión de orientación"))

# B4 · Llamada (D6)
EMAILS.append(("EA_B4_Llamada_D6",
    "¿Hablamos 15 minutos? (te ayudamos a decidir)",
    "Tu sesión de orientación gratuita te espera", [
    h1("¿Damos el paso? Hablemos 15 minutos"),
    p("Hola {{contact.first_name}},"),
    p("Has visto qué hacemos, cómo formamos y los resultados. Ahora toca lo importante: <strong>tu "
      "caso concreto</strong>."),
    p("Te propongo una <strong>sesión de orientación gratuita y sin compromiso</strong>. En 15 minutos:"),
    bullets([
        "Vemos de dónde partes y qué quieres conseguir.",
        "Te decimos con honestidad si nuestra formación te encaja.",
        "Resolvemos todas tus dudas (fechas, precios, financiación).",
    ]),
    p("Sin presión y sin venderte nada a la fuerza. Si no es para ti, te lo diremos. Y si lo es, "
      "saldrás con un plan claro."),
    p("Reserva tu hueco aquí abajo 👇"),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Reservar mi sesión gratuita"))

# C1 · Ruptura (D10)
EMAILS.append(("EA_C1_Ruptura_D10",
    "Cierro tu solicitud (última llamada)",
    "¿Lo dejamos aquí o seguimos?", [
    h1("¿Seguimos, o lo dejamos aquí?"),
    p("Hola {{contact.first_name}},"),
    p("Te he escrito estos días porque de verdad creo que podrías dedicarte a esto. Pero no quiero "
      "ser pesada, así que este es mi último email por ahora."),
    p("Si sigues dándole vueltas, es normal: dar el paso da respeto. Por eso justamente existe la "
      "sesión de orientación —para quitarte las dudas sin compromiso ninguno."),
    p("Si te interesa, reserva tu hueco hoy y lo hablamos. Si no, no pasa nada: te dejo tranquila y "
      "aquí estaremos cuando sea tu momento."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Vale, quiero mi sesión"))


for slug, subject, pre, blocks, *rest in EMAILS:
    cta_text = rest[0] if rest else None
    cta_url = rest[1] if len(rest) > 1 else BOOKING
    doc = shell(pre, blocks, cta_text, cta_url)
    path = os.path.join(OUT, slug + ".html")
    open(path, "w", encoding="utf-8").write(doc)
    # guardamos también el asunto para referencia
    print(f"{slug}  |  Asunto: {subject}")

# índice de asuntos
idx = "\n".join(f"- **{s}** — Asunto: “{subj}”" for s, subj, *_ in EMAILS)
open(os.path.join(OUT, "_asuntos.md"), "w", encoding="utf-8").write(
    "# Asuntos de los emails (secuencia de bienvenida)\n\n" + idx + "\n")
print("\nGenerados", len(EMAILS), "emails en", os.path.abspath(OUT))
