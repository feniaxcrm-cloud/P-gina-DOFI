# DOFI — Nueva animación hover para las 4 cards — Resultados

Sprint acotado exclusivamente a la interacción hover de las 4 capability cards del
Hero (`src/components/CapabilityBand.tsx` + `src/app/globals.css`). No se tocó el
Hero, imagen, overlays, textos, CTA, Header, Sanity, Footer, estructura/tamaño/
contenido de las cards.

## 1. Qué se eliminó

El hover anterior ("cambio cromático") cross-fadeaba **toda la superficie** de la
card de blanca a un degradado morado→naranja, invirtiendo el color de icono/título/
descripción a blanco. Se eliminó por completo: ya no hay ningún `group-hover:*` en
el componente, ni el `::before` de fondo completo en el CSS. Confirmado que no queda
ningún `transform` (scale/translate/tilt/rotate) en la card — nunca lo hubo en la
versión anterior tampoco, pero se revisó explícitamente.

## 2. Qué se implementó

Un **borde iluminado que sigue al cursor**, nunca un spotlight central:

- El pseudo-elemento `.capacidad-card::before` pinta un `radial-gradient` centrado en
  `var(--mouse-x) var(--mouse-y)` sobre toda la tarjeta, pero un `mask` de dos capas
  (`content-box` + `padding-box`) con `mask-composite: exclude` recorta ese gradiente
  a un **anillo** del grosor de `padding: 1.5px` — el interior de la card queda
  siempre 100% transparente, sin importar qué tan grande sea el gradiente de fondo.
  Esto es deliberado: es la única forma de garantizar "glow en el borde, nunca un
  brillo grande adentro" sin recurrir a hacks de posicionamiento.
- `filter: blur(1px)` sobre el propio anillo da el halo exterior sutil pedido, sin
  necesitar una segunda capa.
- `--mouse-x`/`--mouse-y` se actualizan con `el.style.setProperty(...)` directo sobre
  el DOM real de la card (`CapabilityBand.tsx`), nunca con `setState` de React —
  acotado además a un `requestAnimationFrame` para no saturar el hilo principal.
- La aparición/desaparición del glow es 100% CSS (`:hover`/`:focus-within` +
  `transition: opacity 350ms`), no JS — así el fade-out al salir el cursor siempre es
  suave, sin saltos.

### Nota sobre una decisión anterior que este sprint revierte

El código tenía un comentario documentando que un sprint previo ("Replanteo
definitivo Navbar + Hero + Sanity", §42) había **prohibido explícitamente**
`--mouse-x`/`--mouse-y`, spotlight y máscara dinámica en estas cards, y por eso se
había reemplazado por el cambio cromático. Este sprint pide exactamente esa técnica
de vuelta (con el matiz del anillo enmascarado, no un spotlight suelto) — lo marco
para que quede visible que es un cambio de dirección respecto a esa decisión anterior,
no un descuido.

## 3. Estilo DOFI

Gradiente: `color-mix(white 35%, accent-lift)` → `accent` (naranja) → `brand-lift`
(lila) → transparente. Sin azules de la referencia, sin convertir la card completa en
un color sólido.

## 4. Verificación (con Puppeteer, servidor temporal — ver nota abajo)

**Card completamente estática:** medí `getBoundingClientRect()` de la card en los 5
estados (normal, hover arriba/derecha/abajo/izquierda) — **posiciones únicas
detectadas: 1** (misma x/y/width/height en los 5, cero movimiento, cero resize).

**Glow sigue al cursor:** confirmado visualmente en las 5 capturas — el brillo
aparece en el borde superior cuando el cursor está arriba, en el derecho cuando está
a la derecha, etc. (ver capturas). El interior de la card se mantiene limpio en los 5
casos.

**Tracking independiente por card:** con el cursor sobre la card 1, medí la opacidad
computada del `::before` de las 4 cards: `["1", "0", "0", "0"]` — solo la card bajo
el cursor reacciona.

**`prefers-reduced-motion: reduce`:** el `::before` pasa a `display: none` — sin
glow, sin transición, card siempre en su estado limpio normal.

**Touch/mobile:** el listener de `pointermove` ni siquiera se adjunta si
`matchMedia("(hover: hover) and (pointer: fine)")` da falso (chequeado una sola vez
al montar, sin listeners de más). Doble guarda además dentro del handler
(`pointerType !== "mouse"` → return inmediato) por si un dedo dispara `pointermove`
en un arrastre.

**Build:** `npx tsc --noEmit` limpio y `npm run build:next` compila y genera las 43
rutas sin errores.

### Nota sobre cómo se generaron las capturas

El brief pide screenshots como criterio de aceptación (§26), lo cual requiere un
servidor corriendo. Como choca con la instrucción de no levantar servidores en
background, te pregunté antes de hacerlo — confirmaste "servidor temporal solo para
esto". Levanté `next dev` en el puerto 3100 únicamente para esta verificación, lo
cerré apenas terminé, y no quedó ninguna dependencia nueva instalada en el proyecto
(`puppeteer-core` se instaló con `--no-save` y se desinstaló después — `package.json`
y `package-lock.json` no cambiaron, confirmado con `git status`).

## 5. Capturas

- [audit/cards-hover/cards-normal.png](cards-hover/cards-normal.png) — estado normal, sin glow
- [audit/cards-hover/cards-hover-top.png](cards-hover/cards-hover-top.png) — cursor arriba
- [audit/cards-hover/cards-hover-right.png](cards-hover/cards-hover-right.png) — cursor a la derecha
- [audit/cards-hover/cards-hover-bottom.png](cards-hover/cards-hover-bottom.png) — cursor abajo
- [audit/cards-hover/cards-hover-left.png](cards-hover/cards-hover-left.png) — cursor a la izquierda

## 6. Archivos modificados

- `src/components/CapabilityBand.tsx` — quita el hover cromático (clases
  `group-hover:*`), agrega refs + `pointermove` + `requestAnimationFrame` por card,
  gateo por `matchMedia` para no adjuntar listeners en touch.
- `src/app/globals.css` — reemplaza el `.capacidad-card::before` de fondo completo
  por el anillo enmascarado que trackea el cursor, con su `@media (hover: hover) and
  (pointer: fine)` y su `@media (prefers-reduced-motion: reduce)`.

## 7. Sin cambios (confirmado)

Contenido, iconos, alturas (siguen las 4 exactamente iguales — no se tocó esa lógica),
Hero, imagen, overlays, CTA, Header, Sanity, Footer.
