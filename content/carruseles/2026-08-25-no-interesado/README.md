# Carrusel · «No interesado» (martes 25-ago)

7 láminas, 1080×1350, generadas con `video-factory/remotion/Carrusel.tsx`.
Fugas: `D-COM-10` · Ángulo: el error · Nivel de consciencia: 2 · Carril: orgánico.

| # | Texto |
|---|-------|
| 1 | «NO INTERESADO» — *La etiqueta más cara que existe en un CRM* |
| 2 | Y CASI NUNCA **ES VERDAD** |
| 3 | LO QUE HAY CASI SIEMPRE **ES «AHORA NO»** |
| 4 | Y NO ES **LO MISMO** |
| 5 | UN «AHORA NO» **CADUCA EN SEMANAS** — *Un «no interesado» no caduca nunca: te lo quitas de la lista y ya está.* |
| 6 | ESO TIENE NOMBRE **ES UNA FUGA** — *Dinero que ya entró en tu negocio y se va por un sitio que nadie mira.* |
| 7 | ¿QUIERES SABER DÓNDE ESTÁN LAS TUYAS? · Escríbeme **FUGAS** |

## Pie de publicación

> Revisa los «no interesado» de los últimos seis meses y pregúntate cuántos eran
> de verdad un no.
>
> Me apuesto lo que quieras a que la mayoría eran «ahora no» y nadie se acordó
> de volver. Un «ahora no» caduca en semanas. Un «no interesado» no caduca nunca:
> te lo quitas de la lista y ya está.
>
> Escríbeme FUGAS y te digo por dónde miraría en tu caso.

## Para regenerar o cambiar textos

Los textos viven en `LAMINAS` dentro de `Carrusel.tsx`. Después:

```bash
for i in 0 1 2 3 4 5 6; do
  npx remotion still Carrusel out/carrusel/lamina-$((i+1)).png --props="{\"i\":$i}"
done
```

Sistema visual: fondo casi negro, filo naranja a la izquierda, rejilla al 5 %,
tipografía Anton para el titular y Space Grotesk para el pie, logo y contador
abajo a la izquierda. La palabra que gira el argumento va siempre en naranja.
