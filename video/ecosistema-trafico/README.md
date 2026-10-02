# El ecosistema de Tráfico/Ads — video de la sección "Ecosistema"

Motion graphic de 10 s en bucle (1080 x 1080, sin audio) hecho con
[HyperFrames](https://hyperframes.heygen.com): el velero de DOFI recorre las cuatro
plataformas de la frase del documento -- Instagram (descubre tu marca), Google (te busca),
tu web (la visita) y WhatsApp (te escribe) --, cada una se enciende al llegar y al final
aparece "Todo ese recorrido es tráfico."

Lo que ve la web son los archivos ya renderizados:

- `public/trafico/ecosistema.mp4` (H.264, CRF 27, ~0,4 MB)
- `public/trafico/ecosistema.jpg` (póster: el cuadro de los 8,65 s, con el recorrido completo)

## Editar y volver a renderizar

`index.html` se genera: **no se edita a mano**. Se edita `fuente/plantilla.html` (estilos,
textos y la línea de tiempo) o `fuente/construir.mjs` (posición de las plataformas y
curvatura de la ruta) y se regenera.

```bash
cd video/ecosistema-trafico
node fuente/construir.mjs          # plantilla -> index.html
npx hyperframes@0.8.104 check      # lint + layout + contraste
npx hyperframes@0.8.104 render -o renders/ecosistema-maestro.mp4
```

Requiere FFmpeg en el PATH. Para exportar a la web (mismo ajuste que se usó):

```bash
ffmpeg -i renders/ecosistema-maestro.mp4 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart ../../public/trafico/ecosistema.mp4
ffmpeg -ss 8.65 -i renders/ecosistema-maestro.mp4 -frames:v 1 -q:v 3 ../../public/trafico/ecosistema.jpg
```

## Cómo está armado

- La ruta es una curva suave (Catmull-Rom) que pasa por los cuatro nodos y se parte en 3
  tramos; el velero recorre cada uno con GSAP MotionPath y el tramo se ilumina a la vez
  (misma duración y misma curva: la punta de la luz es el velero).
- El velero va por debajo de los nodos: al llegar a una plataforma entra por detrás de
  ella (atraca) y su logo queda siempre visible.
- Guion en segundos (`LLEGADA`, `VIAJES`, `BANNER`, `SALIDA` en la plantilla). Al final
  todo vuelve al estado del primer cuadro: el bucle no tiene salto.
- `assets/`: GSAP + MotionPath y Sora locales (el render no depende de la red), y los
  trazos de los íconos (simple-icons y el velero de Phosphor).
