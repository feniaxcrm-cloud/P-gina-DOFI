# DOFI — CTA sobre los 4 banners — Resultados

Los 4 banners full-width recuperan su botón, pero como **capa HTML encima de la imagen**,
no dentro de ella: texto, enlace y posición se editan en Sanity sin volver a exportar la
pieza gráfica. **No se tocó** la imagen de ningún banner, ni el Hero, ni las 4 tarjetas,
ni el Header, ni el Footer.

## Cómo se eligió la posición de cada CTA

No a ojo. Se midió la **ocupación visual** de cada pieza: energía de bordes (magnitud del
gradiente de luminancia) por región, con una imagen integral para poder consultar
cualquier rectángulo. Texto, rostros, logos e iconos dan energía alta; un fondo
degradado da casi cero. Después se deslizó un rectángulo del tamaño real del botón por
toda la superficie y se ordenaron los huecos de menor a mayor energía.

Ese mapa se cruzó con el recorte real: el botón se posiciona respecto del **contenedor**,
no de la imagen, así que la misma coordenada cae sobre distinta parte de la pieza según
cuánto recorte `object-cover` en cada ancho. Las piezas son de 2077×757 (2,74:1) y el
banner desktop es 2,4:1, así que se recorta un 6,3% por lado.

Por último se renderizaron los finalistas con el botón real encima y se eligió mirando.
Un dato que el número solo no capta: en el banner 03 la región con menos energía caía
sobre la camiseta negra del DOFI (superficie lisa, energía baja) — descartada, porque
tapaba a una persona y su logo.

### Posición final: debajo del titular de cada pieza

Segunda pasada, a pedido: cada botón se movió a la banda que queda inmediatamente
**debajo del título** de su banner.

| Banner | Desktop | Color | Qué hay debajo del título |
|---|---|---|---|
| 01 · Redes Sociales que SÍ VENDEN | izquierda / centro | **morado** | Justo bajo el subrayado de "SÍ VENDEN". Se apoya sobre el icono de Instagram: esa banda es la fila de redes. |
| 02 · PAUTA INTELIGENTE = VENTAS INTELIGENTES | derecha / centro | naranja | Ya estaba debajo de "VENTAS INTELIGENTES" — la posición no cambió, sí el color y el tamaño. |
| 03 · con RESPUESTAS RÁPIDAS hay CLIENTES FELICES | izquierda / centro | naranja | Bajo "CLIENTES FELICES". Cubre parte de WhatsApp y Facebook: es el precio de ponerlo bajo el título en esta pieza. |
| 04 · ASESORÍAS UNO A UNO | centro-derecha / centro-arriba | naranja | Misma altura que "debajo de ASESORÍAS UNO", pero corrido al morado libre: justo debajo de esa chapa está la cara de la persona. |

Medido: `(18,4%, 50%)`, `(81,6%, 50%)`, `(18,4%, 50%)`, `(67%, 28%)`.

En mobile los cuatro van centrados abajo `(50%, 86,6%)`. La pieza se recorta a su 37%
central y el titular no llega a verse, así que "debajo del título" no significa nada ahí;
centrado abajo entra siempre y no tapa el foco de la imagen.

### El color: por qué no puede ser uno solo

Los 4 banners tienen fondos opuestos — naranja saturado, blanco, azul casi negro y
morado. **Ningún relleno único destaca sobre los cuatro.** El naranja DOFI funciona en
tres, pero sobre el banner 01 se mezcla con el fondo y deja de leerse; ahí va morado DOFI,
que es el máximo contraste posible contra ese naranja sin salirse de la marca.

Por eso el color pasó a ser un campo más del banner en Sanity, con cuatro opciones. Las
cuatro pasan WCAG AA con margen:

| Opción | Relleno | Texto | Contraste |
|---|---|---|---|
| Naranja DOFI | `#F47B20` | `#1A0F3D` | 6,53:1 |
| Morado DOFI | `#4B2A93` | `#FFFFFF` | 10,2:1 |
| Blanco | `#FFFFFF` | `#1A0F3D` | 17,8:1 |
| Oscuro | `#120A26` | `#FFFFFF` | 19,1:1 |

Los cuatro llevan además un **aro sólido de 3px** y sombra. El aro no es decorativo: es
lo que garantiza que el botón no se funda con la imagen aunque debajo caiga una zona del
mismo tono que el relleno. Va como primera capa del `box-shadow` y no como `border`, para
no alterar el tamaño de la caja ni el cálculo de posición. No hay rectángulo ni velo
detrás: el banner nunca se oscurece.

## Verificación (medida, no a ojo)

**Geometría del CTA en 7 anchos** — 1440 / 1280 / 1024 / 768 / 560 / 430 / 390:

- Los 4 botones **caen enteros dentro de su banner** en los 7 anchos (`dentroDelBanner=true`).
- Tamaño estable: 358×64 en desktop, 313×56 en mobile. Sin partirse en dos líneas.
- Los 4 son `<a>` **hermanos** de la imagen, no hijos (`hijoDeImg=false`), con
  `position:absolute` y `z-index:10` sobre ella.
- Colores renderizados: banner 01 `rgb(75,42,147)` sobre texto blanco; banners 02-04
  `rgb(244,123,32)` sobre `rgb(26,15,61)`. Los 4 con aro `rgb(255,255,255) 0 0 0 3px`.

**Hover** (§11): `scale` `none → 1.04`, flecha `translate` `none → 4px`, fondo
`#4B2A93 → #6D4BC9` (y `#F47B20 → #FF9440` en los naranjas), transición **0,3s** sobre
`background-color, box-shadow, scale`.

**Tarjeta del Hero**: dice `$+3M Vendidos en Redes` / "Resultados reales impulsados por
estrategia y ejecución." Ese texto vivía en el respaldo de `sanity.ts`, no en Sanity: el
campo `capacidades` del documento está en `null`, así que la home pinta las 4 tarjetas
desde el código.

**Sin movimiento infinito** (§13): `animation-name: none` en el botón, la flecha y su
envoltorio, en los 4 banners y en todos los anchos.

**Enlaces** (§14) — probado de punta a punta cambiando un enlace en Sanity y revirtiéndolo:

| Enlace en Sanity | Se renderiza como |
|---|---|
| `/marketing-digital`, `/trafico-ads`, `/chatbots-crm`, `/asesorias` | `<Link>` interno, sin `target` |
| `https://pagina-dofi.feniax-crm.workers.dev/asesorias` | `target="_blank" rel="noopener noreferrer"` |

**Sin overflow horizontal** en 8 anchos: 1440 / 1280 / 1024 / 768 / 430 / 390 / 360 / 320.

**Reduced motion**: los 8 elementos animados quedan en `opacity:1` y `transform:none`;
los 4 CTA visibles y sin escala.

**Hero / Header / Footer intactos**: `<h1>` = "Ventas Inteligentes", 4 tarjetas de 213px
(el mismo valor de siempre), 2 CTAs del Hero, header y footer presentes. Ni un archivo de
esos componentes fue tocado.

## Dos bugs que aparecieron al medir

Los dos los encontró la medición, no la vista. Van documentados porque el código lleva la
explicación al lado.

**1. El botón del banner 02 se partía en dos líneas** (medía 170×109 en vez de 333×60).
Un elemento `absolute` sin ancho declarado se encoge hasta lo que queda entre su `left` y
el borde derecho del contenedor. Con el anclaje "derecha" (`left: 94%`) eso son 86px de
1440: el ancho ya estaba decidido cuando el `translate: -100%` lo recolocaba. Se
arregla con `width: max-content`. Iba a pasar lo mismo con "centro-derecha" por debajo
de ~1000px.

**2. En mobile el botón se salía del banner** en 3 de los 4 (15px por izquierda en el 01
y el 03, 15px por derecha en el 04) y el `overflow-hidden` lo cortaba. No es opinión sino
geometría: un botón centrado en el 33% necesita un contenedor de ~1,85 veces su ancho
para que el borde no cruce el margen del 6% — con el botón de 288px de mobile son ~533px,
más que cualquier teléfono. Por debajo de 560px cada anclaje intermedio cae al borde más
cercano; de 560px para arriba se respeta el valor tal cual.

## Sanity

Cada banner suma 4 campos, agrupados en un bloque plegable **"Botón (CTA)"**:

```
Banner
  Imagen de fondo del banner     (sin cambios)
  Texto alternativo              (sin cambios)
  ── Botón (CTA) ──────────────────────────────
  Texto del botón                [Quiero Mejorar mis Ventas]
  Enlace del botón               [/marketing-digital]
  Color del botón                (o) Naranja DOFI  ( ) Morado DOFI  ( ) Blanco  ( ) Oscuro
  Posición en desktop            Horizontal [Izquierda]  Vertical [Centro]
  Posición en mobile             Horizontal [Centro]     Vertical [Abajo]
```

**Por qué dos desplegables y no uno de 9 opciones**: las piezas están llenas de borde a
borde y los huecos reales no caen en una grilla de 3×3 — el banner 01 necesita algo entre
"izquierda" y "centro", y el 04 entre "centro" y "derecha". El eje vertical también se
abrió a 5 pasos (arriba · centro-arriba · centro · centro-abajo · abajo) al pedir que
cada botón quede debajo del título de su pieza: en el banner 04 el título termina cerca
del 20% de la altura, y ni "arriba" (6%) ni "centro" (50%) caen ahí. Con 5 pasos por eje
hay ubicación útil en las 4 piezas y siguen siendo dos listas cortas en vez de una de 25.

Si dejás vacío el texto o el enlace, ese banner se muestra **sin botón** (no un botón a
medias). El campo de enlace valida que empiece con `/` o con `https://`.

**Un solo componente** (`ContentBanner.tsx`) para los 4 banners; no existen
`Banner01`…`Banner04`. Y **un solo `<a>` en el DOM** por banner: el cambio entre la
posición de mobile y la de desktop lo hace una media query en CSS, no React — pintarlo
dos veces (uno oculto por breakpoint) duplicaría el enlace para lectores de pantalla y
buscadores.

## Ojo con esto: mobile recorta la pieza al 37% central

**No lo causan los CTA** — viene del sprint anterior y conviene decidirlo aparte.

Las piezas son de 2077×757 (2,74:1) y el banner en mobile mide 390×380 (1,03:1). Con
`object-cover` eso deja visible **solo el 37,4% central** de la imagen: en las capturas de
mobile se ve "s que EN", "PAUTA / VEN / INT", "DAS / CES", "S UNO" — los titulares quedan
cortados.

Las dos condiciones son incompatibles con una sola imagen apaisada: para que se vea
entera en 390px de ancho, el banner tendría que medir 142px de alto, que es justamente la
"tira" que pediste no hacer. Las salidas reales son tres:

1. **Una segunda imagen para mobile** en Sanity (la misma pieza recompuesta en 4:5 o 1:1).
   Es la que mejor se ve, y la que más trabajo de diseño pide.
2. **Que en mobile el alto siga la proporción de la imagen** — se ve la pieza completa,
   pero queda baja.
3. **Dejarlo como está** y usar el punto focal (hotspot) de cada imagen para elegir qué
   franja se conserva.

No hice ninguna: cambiar el banner estaba fuera de lo pedido. Decidime cuál y lo aplico.

## Capturas

- [audit/cta-banners/banners-desktop.png](cta-banners/banners-desktop.png) — los 4 seguidos
- [audit/cta-banners/banner-01-desktop.png](cta-banners/banner-01-desktop.png) … `banner-04-desktop.png`
- [audit/cta-banners/banners-mobile.png](cta-banners/banners-mobile.png)
- [audit/cta-banners/banner-01-mobile.png](cta-banners/banner-01-mobile.png) … `banner-04-mobile.png`

De los anchos intermedios (1280 / 1024 / 768 / 560 / 430) no se guardan capturas: eran
para diagnóstico y lo que importa de ellos son los números de la tabla de arriba, que sí
quedan acá.

## Archivos modificados

- `src/components/ContentBanner.tsx` — el CTA como capa sobre la imagen; tabla de anclajes
  y paletas.
- `src/lib/sanity.ts` — tipos `PosicionCta`/`ColorCta`/`CtaBanner`, GROQ y normalizador del
  CTA; y el texto de la tarjeta `$+3M Vendidos en Redes` en `CAPACIDADES_FALLBACK`.
- `src/components/Reveal.tsx` — prop `duration` opcional (0,75s por defecto: ningún
  llamador existente cambia; el CTA usa 0,6s).
- `src/app/globals.css` — `.banner-cta` (posición por variables + media queries) y foco
  visible propio, porque el contorno naranja global es invisible sobre un botón naranja.
- `studio/schemaTypes/objects/posicionCta.ts` — **nuevo**, el selector de posición.
- `studio/schemaTypes/objects/seccionContenido.ts` — los 4 campos del CTA.
- `studio/schemaTypes/index.ts` — registro del tipo nuevo.
- `scripts/sembrar-cta-banners.mjs` — **nuevo**, siembra de un solo uso (dry-run por defecto).

`npx tsc --noEmit` limpio en la web y en el Studio.
