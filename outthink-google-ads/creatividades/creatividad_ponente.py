#!/usr/bin/env python3
"""Genera las creatividades de ponente para OutThink 2026 a partir de una foto.

Salidas (en --out):
  Search (recursos de imagen, foto limpia, sin texto ni logo — requisito de la política):
    <slug>_search_SQ.jpg  1200×1200 (1:1)    <slug>_search_HZ.jpg  1200×628 (1.91:1)
  Social / Demand Gen (con marca, estilo P5):
    <slug>_brand_SQ.png   1080×1080          <slug>_brand_HZ.png   1200×628
    <slug>_brand_VT.png   1080×1350

Uso: python3 creatividad_ponente.py foto.jpg --nombre "Germán Zarama" --cargo "OCDE · Conducta Empresarial Responsable" \
        --claim "Pregunta cara a cara a la OCDE" --logo logo.png --out ./salida
El encuadre se centra en la cara con --face-y (0–1, posición vertical del centro de la cara en la foto original; 0.35 por defecto).
"""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ORANGE = (224, 90, 60)
CREAM = (250, 245, 235)
BLACK = (14, 14, 14)
FONT_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def crop_to(im, w, h, face_y=0.35):
    """Recorta a proporción w:h manteniendo el centro de la cara a ~40 % de la altura."""
    iw, ih = im.size
    target = w / h
    if iw / ih > target:            # sobra anchura
        nw = int(ih * target); x0 = (iw - nw) // 2; box = (x0, 0, x0 + nw, ih)
    else:                           # sobra altura
        nh = int(iw / target)
        cy = int(face_y * ih); y0 = max(0, min(ih - nh, cy - int(nh * 0.40)))
        box = (0, y0, iw, y0 + nh)
    return im.crop(box).resize((w, h), Image.LANCZOS)


def pill(draw, xy, text, f, fill=BLACK, color=CREAM, pad=(26, 16)):
    x, y = xy
    tw = draw.textlength(text, font=f); th = f.size
    draw.rounded_rectangle((x, y, x + tw + pad[0] * 2, y + th + pad[1] * 2), radius=(th + pad[1] * 2) // 2, fill=fill)
    draw.text((x + pad[0], y + pad[1] - 2), text, font=f, fill=color)
    return y + th + pad[1] * 2


def wrap(draw, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines


def brand(photo, W, H, args, logo):
    """Panel naranja a la izquierda con textos, foto a la derecha (o arriba en vertical)."""
    im = Image.new("RGB", (W, H), ORANGE); d = ImageDraw.Draw(im)
    vertical = H > W
    if vertical:
        ph = int(H * 0.52); p = crop_to(photo, W, ph, args.face_y); im.paste(p, (0, 0)); tx, ty, tw = 54, ph + 44, W - 108
    else:
        pw = int(W * 0.44); p = crop_to(photo, pw, H, args.face_y); im.paste(p, (W - pw, 0)); tx, ty, tw = 54, 54, W - pw - 100
    s = W / 1080
    y = pill(d, (tx, ty), "FORO PRESENCIAL · MADRID · 24 SEPT", font(FONT_B, int(22 * s)))
    y += int(48 * s)
    for line in wrap(d, args.claim.upper(), font(FONT_B, int(64 * s)), tw):
        d.text((tx, y), line, font=font(FONT_B, int(64 * s)), fill=CREAM); y += int(72 * s)
    y += int(26 * s)
    d.text((tx, y), args.nombre, font=font(FONT_B, int(40 * s)), fill=CREAM); y += int(50 * s)
    for line in wrap(d, args.cargo, font(FONT_R, int(28 * s)), tw):
        d.text((tx, y), line, font=font(FONT_R, int(28 * s)), fill=CREAM); y += int(36 * s)
    # CTA + logo abajo
    by = H - int(150 * s)
    pill(d, (tx, by), "Regístrate ahora", font(FONT_B, int(30 * s)), pad=(int(44 * s), int(18 * s)))
    d.text((tx, by + int(78 * s)), "Plazas limitadas · Un solo día", font=font(FONT_R, int(22 * s)), fill=CREAM)
    if logo is not None:
        lw = int(190 * s); lg = logo.resize((lw, int(lw * logo.height / logo.width)), Image.LANCZOS)
        lx = (W - lg.width - 54) if vertical else (tx + tw - lg.width)
        im.paste(lg, (lx, H - lg.height - int(54 * s)), lg if lg.mode == "RGBA" else None)
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("foto"); ap.add_argument("--nombre", required=True); ap.add_argument("--cargo", required=True)
    ap.add_argument("--claim", default="Pregunta cara a cara a la OCDE"); ap.add_argument("--logo")
    ap.add_argument("--out", default="salida"); ap.add_argument("--face-y", type=float, default=0.35)
    ap.add_argument("--slug", default=None)
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    slug = a.slug or a.nombre.split()[0].lower()
    photo = ImageOps.exif_transpose(Image.open(a.foto)).convert("RGB")
    logo = Image.open(a.logo).convert("RGBA") if a.logo else None
    # Search: foto limpia
    crop_to(photo, 1200, 1200, a.face_y).save(out / f"{slug}_search_SQ.jpg", quality=92)
    crop_to(photo, 1200, 628, a.face_y).save(out / f"{slug}_search_HZ.jpg", quality=92)
    # Marca
    brand(photo, 1080, 1080, a, logo).save(out / f"{slug}_brand_SQ.png")
    brand(photo, 1200, 628, a, logo).save(out / f"{slug}_brand_HZ.png")
    brand(photo, 1080, 1350, a, logo).save(out / f"{slug}_brand_VT.png")
    print("OK →", sorted(p.name for p in out.iterdir()))


if __name__ == "__main__":
    main()
