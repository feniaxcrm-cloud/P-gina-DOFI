# El panel de FENIAX CRM — video del hero de /chatbots-crm

Motion graphic de 10 s en bucle (1080 x 1080, sin audio) hecho con
[HyperFrames](https://hyperframes.heygen.com): una ventana de FENIAX CRM donde los clientes
avanzan por Nuevo → En curso → Cerrado, cada venta cerrada dispara el aviso «Venta cerrada» y
una lluvia de chispas, las barras de Mensajes y Ventas crecen y la gráfica de crecimiento se
dibuja hasta arriba. «IA activa» pulsa en el encabezado todo el tiempo.

Lo que ve la web son los archivos ya renderizados:

- `public/feniax/crm-crecimiento.mp4` (H.264, CRF 26, ~0,6 MB)
- `public/feniax/crm-crecimiento.jpg` (póster: el cuadro 0, que es la composición completa)

## Editar y volver a renderizar

`index.html` se genera: **no se edita a mano**. Se edita `fuente/plantilla.html` (estilos y la
línea de tiempo) o `fuente/construir.mjs` (las filas de clientes, las barras y los íconos) y se
regenera.

```bash
cd video/crm-hero-feniax
node fuente/construir.mjs          # plantilla -> index.html
npx hyperframes@0.8.104 check      # lint + layout + contraste
npx hyperframes@0.8.104 snapshot . --at 0,1.3,2.6,3.9,5.5,7,8.3,9.2
npx hyperframes@0.8.104 render -o renders/crm-maestro.mp4
```

Requiere FFmpeg **y FFprobe** en el PATH. Para exportar a la web (mismo ajuste que se usó):

```bash
ffmpeg -i renders/crm-maestro.mp4 -an -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart ../../public/feniax/crm-crecimiento.mp4
ffmpeg -ss 0 -i renders/crm-maestro.mp4 -frames:v 1 -q:v 3 ../../public/feniax/crm-crecimiento.jpg
```

## Cómo está armado

- **El cuadro 0 es el estado final**: todo en su sitio y el último aviso a la vista. Así el póster
  (y lo que ve quien pidió menos movimiento) es la composición completa y el bucle no tiene
  salto. El CSS inicial de cada elemento ya es ese estado; entre 0,9 y 1,5 s se limpia el
  tablero y entre 1,5 y 9 s se cuenta la historia hasta volver a él.
- Todos los `fromTo` llevan `immediateRender: false`: así un salto a cualquier instante (el
  render salta entre cuadros) respeta el estado inicial y no hereda el último `fromTo` escrito.
- La gráfica es una curva suave (Catmull-Rom) partida en 60 tramos RECTOS: en cada tramo la
  línea, el recorte del área y la cabeza avanzan a la vez y a la misma velocidad, así los tres
  coinciden exactamente. Cinco ráfagas dibujan la curva, cuatro de ellas a la par de una venta.
- El aviso «Venta cerrada» entra y sale deslizándose desde arriba (sin fundidos de opacidad: un
  texto a medio fundir no pasa la auditoría de contraste).
- Todo lo continuo (cinta de líneas, flotación de la ventana, resplandor, pulso de «IA activa»)
  tiene un periodo que divide 10 s: el bucle no se nota.
- `assets/`: GSAP y Sora locales (el render no depende de la red), el isotipo y los trazos de los
  íconos de canal (simple-icons).
