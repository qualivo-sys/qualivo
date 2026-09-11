#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Emails adicionales de Eleva: reactivación de leads fríos + secuencias por segmento
(principiante vs. ya trabaja). Reutiliza la plantilla de marca de gen_emails.py."""
from gen_emails import shell, h1, p, bullets, WA, BOOKING, OUT
import os

EXTRA = []

# --- Reactivación 1 (lead frío ~30 días) ---
EXTRA.append(("EA_React_1_Mes1",
    "EA · Reactivación 1 · Volvemos a por ti (mes 1)",
    "¿Seguimos donde lo dejamos?", [
    h1("¿Retomamos lo de las uñas?"),
    p("Hola {{contact.first_name}},"),
    p("Hace unas semanas te interesaste por formarte con nosotras y luego la vida se puso por medio "
      "—nos pasa a todas—. Pero esa idea de <strong>dedicarte a las uñas</strong> sigue ahí, ¿verdad?"),
    p("Te escribo porque acabamos de abrir nuevas fechas y quería que lo supieras antes de que se llenen. "
      "Nada de presión: solo que no pierdas la oportunidad por no enterarte."),
    p("Si te sigue rondando, reserva una llamada corta y lo vemos sin compromiso."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Retomar mi plaza"))

# --- Reactivación 2 (mes 3, última oportunidad) ---
EXTRA.append(("EA_React_2_Mes3",
    "EA · Reactivación 2 · Última oportunidad (mes 3)",
    "Cerramos tu ficha, salvo que...", [
    h1("Antes de despedirnos del todo"),
    p("Hola {{contact.first_name}},"),
    p("Han pasado unos meses desde que mostraste interés y no queremos seguir escribiéndote sin motivo. "
      "Así que esta es la última, de verdad."),
    p("Si en algún momento vuelve a apetecerte dar el paso, aquí seguiremos y te trataremos igual de bien "
      "que el primer día. Y si ahora no es tu momento, lo entendemos perfectamente."),
    p("¿Lo hablamos una última vez? Una llamada de 15 minutos y decides tú."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Sí, hablemos una última vez"))

# --- Segmento Principiante ---
EXTRA.append(("EA_Seg_Principiante",
    "EA · Segmento · Principiante desde cero",
    "Empezar de cero es más fácil de lo que crees", [
    h1("Nunca has tocado unas uñas. Perfecto."),
    p("Hola {{contact.first_name}},"),
    p("Si te frena pensar \"es que yo no tengo ni idea\", tranquila: <strong>la mayoría de nuestras alumnas "
      "empezaron exactamente así</strong>, sin experiencia ninguna."),
    bullets([
        "Empezamos por lo básico, sin dar nada por sabido.",
        "Practicas desde el primer día, con acompañamiento.",
        "No necesitas material caro para arrancar: te decimos qué comprar y qué no.",
    ]),
    p("De cero a hacer tus primeras uñas con soltura hay menos distancia de la que imaginas. "
      "Te lo contamos en una llamada y ves si te encaja."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Empezar desde cero"))

# --- Segmento Profesional / ya trabaja ---
EXTRA.append(("EA_Seg_Profesional",
    "EA · Segmento · Ya trabajas las uñas",
    "Sube de nivel y cobra lo que vales", [
    h1("Ya trabajas las uñas. Ahora, a profesionalizarlo."),
    p("Hola {{contact.first_name}},"),
    p("Si ya haces uñas —en un salón o por tu cuenta— seguramente lo que buscas no es empezar, "
      "sino <strong>perfeccionar técnica, especializarte y ganar más</strong>."),
    bullets([
        "Técnicas avanzadas y acabados que te diferencian.",
        "Certificado para dar confianza y subir precios.",
        "La parte de negocio: captar clientas, fidelizar y cobrar lo que vales.",
    ]),
    p("No es un curso de iniciación más: es dar el salto de \"hago uñas\" a \"vivo muy bien de esto\". "
      "Te enseñamos cómo en una llamada."),
    p("Un abrazo,<br><strong>El equipo de Eleva Academy</strong>"),
    ], "Quiero subir de nivel"))

for slug, subject, pre, blocks, *rest in EXTRA:
    cta_text = rest[0] if rest else None
    cta_url = rest[1] if len(rest) > 1 else BOOKING
    open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8").write(shell(pre, blocks, cta_text, cta_url))
    print(f"{slug}  |  Asunto: {subject}")
print("\nGenerados", len(EXTRA), "emails extra en", os.path.abspath(OUT))
