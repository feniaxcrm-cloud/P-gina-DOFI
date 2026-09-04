# DOFI — Mejorar diseño visual de las 4 secciones de contenido — Resultados

Sprint acotado a la presentación visual de las 4 secciones de contenido debajo de las
tarjetas del Hero. **No se tocó** Header, Hero, tarjetas del Hero, el glow de las
tarjetas, Footer, otras páginas, ni la estructura de Sanity (mismos campos de siempre:
título, descripción, imagen, texto de CTA, URL de CTA — nada nuevo, nada roto).

## 1. Componentes modificados

- **`src/components/ContentSection.tsx`** — reescrito. Sigue siendo un solo componente
  reutilizado 4 veces vía `.map()` (nunca 4 archivos separados).
- **`src/components/Reveal.tsx`** — extendido de forma aditiva (`x`/`y` configurables,
  antes fijo en `y: 24`) y con un fix de accesibilidad real (ver §12). Cero cambio de
  comportamiento para quien ya lo usaba con los valores por defecto.
- **`src/app/globals.css`** — nuevo token `--color-canvas-lilac` (lila extremadamente
  sutil) y una regla de respaldo para `prefers-reduced-motion` (ver §12).

## 2. Estilos modificados

- **Container**: pasó de `max-w-[1400px] px-5 md:px-8` a `max-w-page px-5 sm:px-6
  md:px-10 lg:px-12 xl:px-14` — el mismo contenedor que ya usa el Hero (mismo ancho
  máximo, más pasos de padding responsive), en vez de un valor arbitrario propio.
- **Fondo**: revierte el sprint anterior (colores sólidos naranja/blanco/morado/naranja)
  a un lienzo predominantemente blanco — alterna `bg-canvas` / `bg-canvas-lilac` (4% de
  marca sobre canvas, dif. casi imperceptible), tal como pedía este sprint.
- **Jerarquía de texto**: eyebrow (número de sección + línea naranja) → título
  (`text-4xl md:text-6xl`, subió desde `text-3xl md:text-5xl`) → descripción → CTA.
- **CTA**: de un botón-píldora con borde (`h-[52px]`) a un botón sólido naranja mucho
  más grande (`h-16`, `px-10`, `text-base`), con la sombra tintada que ya usa
  `MagneticCta` para su variante primaria, y **centrado respecto al bloque de texto**
  (`flex justify-center` dentro del contenedor de `max-w-[38rem]`, el título y la
  descripción se quedan alineados a la izquierda).
- **Imagen**: mismo `aspect-[4/3]` y radio de siempre, con un velo de marca casi
  imperceptible (`from-brand/12`) y un micro-glow decorativo — ambos dentro del propio
  contenedor `overflow-hidden` (ver §11, por qué).

## 3. Animaciones implementadas

- **Entrada escalonada** (spec §17-18): eyebrow → título → descripción → CTA, cada uno
  en su propio `<Reveal>` con `delay` 0 / 0.1 / 0.2 / 0.3s — no un solo bloque animado de
  una vez. La imagen entra en paralelo (`delay: 0.05`).
- **Imagen con dirección** (spec §19-20): la imagen entra desde el lado en el que va a
  quedar — `x: +28` si queda a la derecha, `x: -28` si queda a la izquierda — calculado
  automáticamente desde la misma alternancia que decide el lado (`index % 2`), no una
  tabla aparte.
- **Hover de imagen**: `scale(1.02)` muy sutil, 650ms, misma curva de easing que ya usa
  `ClientCard` para su propio hover de foto. Solo la imagen escala — el contenedor no se
  mueve. Envuelto en `motion-safe:` (se desactiva entero con reduced-motion, no solo se
  acorta).
- **Hover de CTA**: fondo pasa a `accent-lift`, eleva 2px (`-translate-y-0.5`), la flecha
  se desplaza 4px — verificado con Puppeteer, no solo a ojo (ver tabla en §9).
- Todo lo animado es `transform`/`opacity` (o las propiedades modernas `translate`/
  `scale` que usa Tailwind v4 para lo mismo) — nunca width/height/margin/padding/top/
  left. Cero layout shift medido.

## 4. Alternancia — sin cambios en la lógica

`index % 2` decide el lado (par → texto izquierda; impar → imagen izquierda), igual que
antes. Lo único que cambió es que el FONDO ya no sale del mismo cálculo (antes
alternaba junto con el lado); ahora alterna por su cuenta, también con `index % 2`.

## 5. Sanity — funcionando, prueba real

Verificado contra el contenido que **vos mismo ya cargaste** en Sanity (no datos de
prueba míos esta vez — la sesión encontró tu contenido real al hacer las capturas):

| Sección | Título real en Sanity |
|---|---|
| 01 | "Redes Sociales que SI VENDEN" |
| 02 | "PAUTA INTELIGENTE = VENTAS INTELIGENTES" |
| 03 | "con RESPUESTAS RÁPIDAS hay CLIENTES FELICES" |
| 04 | "RESCATANDO EMPRENDEDORES" |

Título, descripción, imagen (la foto de Daniel Vallejo que subiste) y CTA se leen
correctamente desde Sanity en las 4. Título/descripción/imagen/CTA siguen editables
exactamente igual que antes — no se tocó el schema ni la query.

## 6. CTA — interno vs. externo

Mismo mecanismo de siempre (`ctaEnlace` empieza con `http(s)://` → externo,
`target="_blank" rel="noopener noreferrer"`; cualquier otra cosa → interno,
`next/link`). Verificado con Puppeteer sobre tus 4 CTAs reales — los 4 abren en pestaña
nueva porque las 4 URLs que cargaste son absolutas
(`https://pagina-dofi.feniax-crm.workers.dev/marketing-digital`, etc.), aunque apunten a
páginas de tu propio sitio. **Esto es correcto según la regla que ya existía** (definida
en el sprint original: "externa" = empieza con http(s)://), no un bug — si preferís que
esas 4 abran en la MISMA pestaña (por ser rutas internas), es cuestión de cambiar la URL
en Sanity a la ruta relativa (`/marketing-digital` en vez de la URL completa), no de
tocar código. Te lo señalo para que decidas, no lo cambié por mi cuenta.

## 7. Responsive

Sin overflow horizontal en los 6 anchos pedidos, verificado con Puppeteer:

| Ancho | Resultado |
|---|---|
| 1440px | OK |
| 1280px | OK |
| 1024px | OK |
| 768px | OK |
| 390px | OK |
| 360px | OK |

Mobile: imagen → eyebrow → título → descripción → CTA en las 4 secciones (nunca se
duplica la imagen — mismo `<Image>`, reordenado por CSS). CTA a ancho automático con
padding generoso, no forzado a 100%.

## 8. Bugs reales encontrados y corregidos durante la verificación

No asumí que todo funcionaba por que compilaba — encontré y corregí 3 problemas reales
con Puppeteer, no a ojo:

1. **Overflow horizontal real** (77px en 1024px, 20px en mobile) causado por la
   animación de entrada con `x` de la imagen: antes de que una sección entre en
   viewport, su `translateX` inicial la corre geométricamente fuera del contenedor, y un
   navegador cuenta ese desborde (aunque sea invisible, `opacity:0`) para el ancho de la
   página. Fix: `overflow-hidden` en la propia `<section>` (mismo patrón que ya usa
   Hero.tsx para sus overlays animados).
2. **El micro-glow decorativo** también sumaba a ese overflow por su cuenta. Fix: se
   movió adentro del contenedor `overflow-hidden` de la imagen en vez de vivir afuera.
3. **Bug de accesibilidad preexistente en `<Reveal>`** (no introducido por este sprint —
   ya afectaba a Tools/Socio/Services, que también usan este componente): el hook
   `useReducedMotion()` de Framer Motion no se re-evalúa de forma reactiva y siempre
   arranca en `false` durante el render de servidor (no hay `window` en SSR) — el
   resultado real, confirmado con Puppeteer, era contenido con `opacity:0` bajo
   reduced-motion en vez de mostrarse directo. Fix: una regla CSS con `!important` que
   el navegador evalúa directamente sobre el propio `motion.div`, sin pasar por ese
   hook. Verificado: `opacity:1, transform:none` en las 4 secciones bajo
   `prefers-reduced-motion: reduce`.

## 9. Verificación (todo con Puppeteer, no a ojo)

| Criterio | Resultado |
|---|---|
| CTA más grande | ✅ h-16 vs. h-[52px] anterior |
| CTA centrado respecto al texto | ✅ `flex justify-center` |
| Jerarquía de títulos | ✅ text-4xl → md:text-6xl |
| Eyebrow / número de sección | ✅ "01" + línea naranja |
| Spacing entre secciones | ✅ py-24 md:py-36 (antes py-20 md:py-28) |
| Imágenes con presencia | ✅ sin cambios de tamaño, velo + glow sutiles |
| Alternancia izquierda/derecha | ✅ sin cambios, verificado en capturas |
| Animación al entrar en viewport | ✅ opacity+y, una sola vez |
| Animación escalonada | ✅ delays 0/0.1/0.2/0.3s verificados |
| Animación sutil de imagen (dirección) | ✅ x:±28 según el lado |
| Hover de imagen | ✅ scale(1.02), verificado via propiedad `scale` (Tailwind v4) |
| Hover del CTA | ✅ bg accent→accent-lift, -2px, flecha +4px |
| Sin movimiento continuo | ✅ `once: true` en todos los Reveal |
| Mobile correcto | ✅ imagen→eyebrow→título→descripción→CTA |
| Sin overflow | ✅ 6/6 anchos, con 2 bugs reales encontrados y corregidos |
| Sanity funcionando | ✅ tu contenido real, verificado |

## 10. Nota técnica (por si es útil después)

Tailwind v4 usa las propiedades CSS modernas `translate`/`scale`/`rotate` (separadas de
`transform`) para las utilidades de hover/active de transformación — `getComputedStyle
(el).transform` NO refleja estos cambios, hay que revisar `.translate`/`.scale`. Lo dejo
anotado porque me hizo perder tiempo verificando (pensé que el hover no funcionaba
cuando sí funcionaba, solo estaba mirando la propiedad equivocada) — puede ser útil si
alguna vez se depura esto de nuevo.

## Capturas

- [audit/home-sections-v2/sections-full-desktop.png](home-sections-v2/sections-full-desktop.png) — las 4 completas
- [audit/home-sections-v2/section-01-desktop.png](home-sections-v2/section-01-desktop.png)
- [audit/home-sections-v2/section-02-desktop.png](home-sections-v2/section-02-desktop.png)
- [audit/home-sections-v2/section-03-desktop.png](home-sections-v2/section-03-desktop.png)
- [audit/home-sections-v2/section-04-desktop.png](home-sections-v2/section-04-desktop.png)
- [audit/home-sections-v2/sections-mobile.png](home-sections-v2/sections-mobile.png)
- [audit/home-sections-v2/cta-hover.png](home-sections-v2/cta-hover.png)
- [audit/home-sections-v2/section-scroll-animation.png](home-sections-v2/section-scroll-animation.png) — captura a los 90ms del trigger: el eyebrow "02" ya apareció, título/descripción/CTA/imagen todavía no — el stagger real, no el estado final asentado.

## Archivos modificados

- `src/components/ContentSection.tsx` — rediseño visual completo.
- `src/components/Reveal.tsx` — `x`/`y` configurables (aditivo) + fix de accesibilidad.
- `src/app/globals.css` — token `--color-canvas-lilac` + regla de respaldo reduced-motion.
- `audit/HOME-SECTIONS-V2-RESULTADOS.md` + `audit/home-sections-v2/` — este reporte.
