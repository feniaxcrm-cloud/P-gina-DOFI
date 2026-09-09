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

| Banner | Desktop | Por qué |
|---|---|---|
| 01 · Redes Sociales que SÍ VENDEN | centro-izquierda / abajo | El titular ocupa arriba a la izquierda y los iconos de redes bajan hasta el pie. El hueco real está a la derecha del racimo de iconos, antes de la chapa "LO COMPRUEBAN". La *inferior izquierda* que sugerías está ocupada por Messenger y WhatsApp. |
| 02 · PAUTA INTELIGENTE = VENTAS INTELIGENTES | derecha / centro | Justo debajo de "VENTAS INTELIGENTES", sobre el blanco limpio que separa el titular del icono de Claude. Acompaña al mensaje principal en vez de competir con él. La inferior derecha estaba ocupada por el megáfono y Claude. |
| 03 · con RESPUESTAS RÁPIDAS hay CLIENTES FELICES | centro / abajo | Pasillo oscuro entre el diagrama de herramientas y la chapa "ES DINERO". Abajo a la izquierda no entra: ahí están n8n y el icono del CRM. |
| 04 · ASESORÍAS UNO A UNO | centro-derecha / centro | El único banner con medio lienzo libre. El botón se apoya en ese morado vacío, lejos de la persona y de las dos chapas. |

Las 4 posiciones son distintas entre sí, medido: `(33%, 89%)`, `(82,5%, 50%)`,
`(50%, 89%)`, `(67%, 50%)`.

## Verificación (medida, no a ojo)

**Geometría del CTA en 7 anchos** — 1440 / 1280 / 1024 / 768 / 560 / 430 / 390:

- Los 4 botones **caen enteros dentro de su banner** en los 7 anchos (`dentroDelBanner=true`).
- Tamaño estable: 333×60 en desktop, 288×52 en mobile. Sin partirse en dos líneas.
- Los 4 son `<a>` **hermanos** de la imagen, no hijos (`hijoDeImg=false`), con
  `position:absolute` y `z-index:10` sobre ella.
- Colores: fondo `rgb(244,123,32)` (naranja DOFI) y texto `rgb(26,15,61)` — **6,53:1**,
  pasa WCAG AA con margen.
- Sombra aplicada: `rgba(244,123,32,.55) 0 10px 30px -8px` + `rgba(18,10,38,.28) 0 2px 10px`.
  Sin rectángulo ni velo detrás: ningún banner se oscurece.

**Hover** (§11): `scale` `none → 1.03`, flecha `translate` `none → 4px`, fondo
`#F47B20 → #FF9440`, transición **0,3s** sobre `background-color, box-shadow, scale`.

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
  Posición en desktop            Horizontal [Centro-izquierda]  Vertical [Abajo]
  Posición en mobile             Horizontal [Centro-izquierda]  Vertical [Abajo]
```

**Por qué dos desplegables y no uno de 9 opciones**: las piezas están llenas de borde a
borde y los huecos reales no caen en una grilla de 3×3 — el banner 01 necesita algo entre
"izquierda" y "centro", y el 04 entre "centro" y "derecha". Con 5 pasos horizontales × 3
verticales hay hueco en las 4 piezas sin taparle nada a ninguna, y siguen siendo dos
listas cortas en vez de una de 15.

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

- `src/components/ContentBanner.tsx` — el CTA como capa sobre la imagen; tabla de anclajes.
- `src/lib/sanity.ts` — tipos `PosicionCta`/`CtaBanner`, GROQ y normalizador del CTA.
- `src/components/Reveal.tsx` — prop `duration` opcional (0,75s por defecto: ningún
  llamador existente cambia; el CTA usa 0,6s).
- `src/app/globals.css` — `.banner-cta` (posición por variables + media queries) y foco
  visible propio, porque el contorno naranja global es invisible sobre un botón naranja.
- `studio/schemaTypes/objects/posicionCta.ts` — **nuevo**, el selector de posición.
- `studio/schemaTypes/objects/seccionContenido.ts` — los 4 campos del CTA.
- `studio/schemaTypes/index.ts` — registro del tipo nuevo.
- `scripts/sembrar-cta-banners.mjs` — **nuevo**, siembra de un solo uso (dry-run por defecto).

`npx tsc --noEmit` limpio en la web y en el Studio.
