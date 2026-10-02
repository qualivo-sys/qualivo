# -*- coding: utf-8 -*-
# Clasificador de respuestas en frio. Compartido entre Qualivo y los clientes.
#
# Vive aparte desde el 2-oct porque lo necesitaban dos sitios: el libro de
# respuestas de Qualivo (respuestas_xlsx.py) y el filtro de ruido del piloto de
# Kubysoft (clientes/kubysoft/scripts/respuestas_aire.py). Un solo clasificador,
# dos consumidores: si se afina una expresion, se afina para los dos.
#
# Lo que NO esta aqui a proposito: propuesta(), que se queda en el libro de
# Qualivo porque lleva dentro su precio y su caso de exito. Eso es copy, y el
# copy no se hereda entre clientes. Aqui solo vive el criterio.
import re

# 100 quiere hablar o pregunta algo concreto · 80 deriva con nombre
# 60 pide informacion · 40 no es ahora · 20 autorespuesta · 0 no


def puntuar(t, clase):
    b = (t or "").lower()
    if clase in ("CABREO / LEGAL",) or re.search(r"lopd|rgpd|ilegal|denunc|bórre|borrar|no me escrib|elimin", b):
        return 0, "Descartar · pidio no ser contactado"
    if re.search(r"no me interesa|no estamos interesad|no nos interesa|no necesito|ya lo tenemos|"
                 r"todo ya organizado|lo tenemos todo|ya lo hacemos|no encaja|no es el momento|"
                 r"prefiero no seguir|no seguir adelante|tenemos todas las necesidades|no vendemos|"
                 r"no tenemos problem|declinamos|no procede", b):
        return 0, "Descartar · no interesado"
    if re.search(r"vacacion|vacaci|vacances|ferias|fuera de la oficina|out of office|estare fuera|estaré fuera|"
                 r"tancat|tancad|romandra|romandrà|de baja|cerrados por|cerrado por|estoy fuera|estic fora|"
                 r"absent|ausente|fora de|no estoy disponible|no me encuentro disponible", b):
        return 20, "Autoreply · reintentar a la vuelta"
    if re.search(r"ha cambiado a|nueva direccion de correo|nueva dirección|dejara de estar activa|dejará de estar activa|mi nueva direccion", b):
        return 20, "Actualizar email y recontactar"
    # OJO: "gracias por contactar con nosotros" aparece en casi toda respuesta
    # educada. La derivacion exige que nos manden a ALGUIEN concreto.
    if re.search(r"pongo en contacto|te pido que contactes|por favor contactar con|contacta con|"
                 r"responsable de marketing|persona adecuada|traslado el email|traslado tu|he derivado|"
                 r"derivado a|project manager (de la empresa )?es|no soy decisor|no soy quien decide|"
                 r"habla con|escribe a|dirigete a|dirígete a", b):
        return 80, "Seguir la derivacion · pedir nombre y correo"
    if re.search(r"cuanto|cuánto|precio|cobras|coste|como crees que|cómo crees que|en que consiste|en qué consiste|mas info|más info|envianos|envíanos|quiero saber|me gustaria saber|me gustaría saber|reunion|reunión|llamada|agenda|\?", b):
        return 100, "Contestar hoy · pregunta abierta"
    if re.search(r"mas adelante|más adelante|ahora no|no es prioridad|reducir la inversion|reducir la inversión|en el futuro", b):
        return 40, "Timing · guardar y retomar"
    return 60, "Revisar"
