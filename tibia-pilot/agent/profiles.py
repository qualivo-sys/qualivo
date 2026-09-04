"""Perfiles por vocacion.

Cada vocacion juega tan distinto que no comparten policy util: lo que cambia
no son los numeros, es que reglas existen. El caballero es el perfil del
piloto por ser el mas simple (cuerpo a cuerpo, sin gestion de distancia ni
municion) y el mas robusto a que la percepcion falle.

AVISO: las palabras de los hechizos y sus costes de mana varian entre
datapacks de OTServer. Antes de la primera sesion real hay que contrastarlos
con el servidor concreto; el bucle lento (n8n) los puede corregir en caliente
via POST /config sin tocar codigo.
"""
from __future__ import annotations

from .config import Config


def knight() -> Config:
    """Caballero: aguanta de cerca y se cura a base de potions.

    La particularidad que hay que respetar: un caballero tiene poco mana, asi
    que la potion es su curacion principal y el hechizo el recurso secundario.
    Al reves que un druida. Invertir esto es el error clasico al escribir un
    bot de caballero.
    """
    return Config(
        heal_at_pct=0.75,          # aguanta menos que un mago: se cura antes
        emergency_at_pct=0.40,
        mana_at_pct=0.30,          # el mana solo importa para exori

        prefer_potion_over_spell=True,
        heal_spell="exura ico",
        heal_spell_cost=70,
        strong_heal_spell="exura ico",
        strong_heal_spell_cost=70,
        health_potion="strong health potion",
        mana_potion="strong mana potion",

        area_attack_spell="exori",
        area_attack_cost=115,
        area_attack_min_targets=3,

        max_target_distance=1,     # melee: no persigue a distancia
        surrounded_threshold=5,    # aguanta mas rodeado que cualquier otro
        min_health_potions=40,     # gasta muchas mas potions que el resto
        min_mana_potions=10,
    )


def paladin() -> Config:
    """Paladin: distancia media y municion. Sin verificar contra datapack."""
    return Config(
        heal_at_pct=0.70, emergency_at_pct=0.35, mana_at_pct=0.40,
        heal_spell="exura", heal_spell_cost=20,
        strong_heal_spell="exura san", strong_heal_spell_cost=160,
        health_potion="health potion", mana_potion="mana potion",
        max_target_distance=4, surrounded_threshold=3,
    )


def mage() -> Config:
    """Druida o hechicero: lejos, y el mana es el recurso critico."""
    return Config(
        heal_at_pct=0.65, emergency_at_pct=0.35, mana_at_pct=0.55,
        heal_spell="exura", heal_spell_cost=20,
        strong_heal_spell="exura gran", strong_heal_spell_cost=80,
        health_potion="health potion", mana_potion="strong mana potion",
        max_target_distance=5, surrounded_threshold=2,
        min_mana_potions=60,
    )


PROFILES = {"knight": knight, "paladin": paladin, "mage": mage}


def load(name: str) -> Config:
    if name not in PROFILES:
        raise ValueError(f"perfil desconocido: {name!r}. Opciones: {sorted(PROFILES)}")
    return PROFILES[name]()
