# Ajustes del 2026-10-28 · Tarjetas del Home y velocidad de los banners

Publicado con el commit `a71da85`; el build de Cloudflare terminó bien. No hubo cambios en Sanity ni en el Studio.

Pedido: en la computadora de un amigo, los botones del hero quedaban encima de las tarjetas. Además, los banners del Home no cargaban rápido.

## 1. Tarjetas del Home montadas

**Causa**
- El hero tenía un alto fijo: el de la pantalla.
- En ventanas bajas no entraba todo y los botones caían sobre las tarjetas. Pasaba con:
  - una laptop de 1366×768 con la barra de favoritos abierta (queda una ventana de unos 1366×650);
  - un navegador con zoom o con la letra más grande.
- La captura enviada coincide con una ventana de unos 1440×650.
- En la revisión del 2026-10-27 no apareció porque se probó con el tamaño de pantalla completo, sin descontar las barras del navegador.

**Arreglo**
- **Alto mínimo:** el hero mide al menos una pantalla, pero crece si el texto no entra. Los botones ya no pueden quedar encima de las tarjetas, con cualquier tamaño de letra o zoom.
- **Ventanas bajas** (hasta 760 px de alto, en computadora), para que todo siga entrando en una pantalla:
  - el texto bajo el título baja de 20 a 18 px;
  - los botones, de 64 a 56 px de alto;
  - la etiqueta «DOFI Agencia Creativa» queda un poco más delgada.
- **Medido entre los botones y las tarjetas:**

| Ventana | Antes | Ahora |
|---|---|---|
| 1440×650 (como la del amigo) | encimados (la captura) | 23 px de aire, en una pantalla |
| 1366×650 | 5 px | 23 px, en una pantalla |
| 1280×600 | 0 px | 21 px; el hero crece 28 px |
| Con letra un 12% más grande | — | 23–27 px, sin encimarse |

## 2. Banners del Home lentos

**Causa principal**
- En Cloudflare, el optimizador de imágenes de Next no está activo: entregaba cada imagen en su tamaño y formato originales.
- **Foto del hero:** un PNG de Sanity de **6,2 MB**, y se bajaba **dos veces** (la versión de computadora y la de celular).
- **Total del Home:** **13,5 MB**. Con una conexión de 8 Mbps la página tardaba **14,8 s** en terminar de cargar.
- Mientras tanto, las fotos y animaciones de los banners competían por la misma conexión.

**Arreglos**
- **Imágenes de Sanity:** el CDN de Sanity entrega cada una al ancho que se necesita y en WebP o AVIF (`src/lib/cargador-imagenes.ts`). Las fotos siguen editándose igual en el Studio.
  - Foto del hero: de 6,2 MB a **40–47 KB**.
  - Fotos de los banners: de 143–213 KB a **40–65 KB** cada una.
- **Foto del hero una sola vez:** cada pantalla baja solo la copia que muestra.
- **Logos livianos** (mismo dibujo y transparencia, en WebP):
  - logo de la barra: de 128 KB a 20 KB;
  - logo del pie y de Redes: de 254 KB a 66 KB.
- **Logo de «Rescatando Emprendedores» en la escena animada:** de 276 KB a 117 KB.
- **Animaciones de los banners:** su código se descarga apenas la página queda libre, sin esperar a que el visitante llegue a ellas. La escena se prepara cuando el banner está a 900 px de aparecer (antes, a 600).

**Resultado (Home en computadora, sin caché)**
- Descarga total: de **14,9 MB** a **1,4 MB**.
- En celular: **1,3 MB** (antes también bajaba la foto del hero de 6,2 MB).

## Archivos
- **Nuevos:**
  - `src/lib/cargador-imagenes.ts`
  - `public/logo-dofi-compact-160.webp`, `public/logo-dofi-compact-on-light-160.webp` y `public/logo-dofi-320.webp`
  - `public/asesorias/rescatando-emprendedores-1400.webp`
- **Modificados:**
  - `next.config.ts`: usa el cargador nuevo.
  - `src/components/Hero.tsx`: alto mínimo, ventanas bajas y foto sin doble descarga.
  - `src/components/home/EscenaBanner.tsx`: precarga de la animación.
  - `src/components/Wordmark.tsx` y `src/app/redes/page.tsx`: logos livianos.
  - `src/remotion/home/EscenaAsesorias.tsx`: logo liviano.
- Los archivos originales siguen en `public/`.

## Validación
- `tsc` sin errores y `next build` correcto (44 páginas).
- **Imágenes:** ninguna rota en las 7 páginas, a 1440×900 y a 390×844.
- **Revisión de solapes:** sin elementos encimados en las 212 combinaciones probadas:
  - las 7 páginas en los 29 tamaños de siempre;
  - el Home en 9 ventanas reales de navegador, con las barras descontadas (de 1280×550 a 1920×880).
- **Único aviso:** el falso positivo conocido de la imagen transparente de la portada de Marketing (ver el reporte del 2026-10-27).

## En vivo, antes y después
Home en pagina-dofi.feniax-crm.workers.dev, ventana de 1536×730 (laptop Full HD con Windows al 125%), sin caché y con la red limitada a 8 Mbps.

| | Antes | Después |
|---|---|---|
| Descarga total | 14,6 MB | 1,4 MB |
| La página termina de cargar | 14,8 s | 0,8 s |
| Título del hero visible (LCP) | 1,5 s | 1,3 s |

**Cada banner al bajar hasta él (desglose después del cambio):**
- La foto y la animación ya están listas cuando el visitante llega: 0 a 9 ms después de bajar, aunque baje a los 3 s de abrir la página.
- Lo único que queda es la **animación de entrada** del banner (un fundido de 0,75 s, por diseño). Arranca cuando el banner asoma y termina entre 0,5 y 1 s después.
- Antes, la foto y la escena llegaban a tiempo en esta medición, pero con los 12 MB de la foto del hero bajando de fondo. En conexiones más lentas que 8 Mbps esa descarga competía con los banners durante 15 s o más.
- **Opcional:** si se quiere que aparezcan todavía más rápido, se puede acortar o quitar ese fundido de entrada.

**Hero en vivo:**
| Ventana | Aire entre botones y tarjetas |
|---|---|
| 1440×650 | 23 px |
| 1366×650 | 23 px |
| 1280×600 | 21 px |

En ninguna de las tres hay elementos encimados.
