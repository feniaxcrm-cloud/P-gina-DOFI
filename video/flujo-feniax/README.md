# "Así trabaja FENIAX" — video del bloque editorial de /chatbots-crm

Motion graphic de 10 s en bucle (1080 x 1080, sin audio) hecho con
[HyperFrames](https://hyperframes.heygen.com): los mensajes de WhatsApp,
Instagram, Facebook y la web llegan a la IA de FENIAX, se responden y cada
cliente avanza por el embudo del CRM (Nuevo → Seguimiento → Venta).

Lo que ve la web son los archivos ya renderizados:

- `public/feniax/flujo-feniax.mp4` (H.264, CRF 27, ~0,5 MB)
- `public/feniax/flujo-feniax.jpg` (póster: el cuadro de los 8,6 s, con las dos ventas cerradas)

## Editar y volver a renderizar

Los íconos de canal se inyectan desde `simple-icons`, así que **no se edita
`index.html` a mano**: se edita `fuente/plantilla.html` y se regenera.

```bash
cd video/flujo-feniax
node fuente/construir.mjs          # plantilla -> index.html (necesita assets/si*.txt, ver abajo)
npx hyperframes@0.8.104 check      # lint + layout + contraste
npx hyperframes@0.8.104 render -o renders/flujo-maestro.mp4
```

Requiere FFmpeg en el PATH. Para exportar a la web (mismo ajuste que se usó):

```bash
ffmpeg -i renders/flujo-maestro.mp4 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart ../../public/feniax/flujo-feniax.mp4
ffmpeg -ss 8.6 -i renders/flujo-maestro.mp4 -frames:v 1 -q:v 3 ../../public/feniax/flujo-feniax.jpg
```

Los trazos de los íconos (`assets/si*.txt`) no se guardan en el repo: se
regeneran con

```bash
node -e "const s=require('simple-icons');for(const k of ['siWhatsapp','siInstagram','siFacebook'])require('fs').writeFileSync('video/flujo-feniax/assets/'+k+'.txt',s[k].path)"
```

(desde la raíz del proyecto, donde `simple-icons` ya es dependencia).

## Qué hay en cada archivo

- `fuente/plantilla.html` — la composición: estilos, capas y la línea de tiempo GSAP.
  Los movimientos del embudo se describen como eventos (`eventos`: segundo, tarjeta,
  columna); el orden dentro de cada columna y el cierre de huecos se calculan solos.
- `assets/` — GSAP y Sora locales (el render no depende de la red) y el isotipo.
- `BRIEF.md` — qué se pidió y con qué reglas.
