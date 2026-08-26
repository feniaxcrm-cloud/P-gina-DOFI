# DOFI — Replanteo completo Navbar + Hero — Resultados

Fecha: 2026-08-26
Alcance: **solo** Navbar + Hero + banda de capacidades. LogoWall, Clientes, Servicios, FENIAX, El Socio, Contacto y Footer no se tocaron.

---

## 1. Composición — qué se tomó de la referencia y qué no

Se tomó **solo la arquitectura** descrita en el brief: navbar integrado como parte del mismo bloque visual del Hero, split en dos columnas (copy a la izquierda / espacio reservado a la derecha), y una franja de capacidades superpuesta al borde inferior del Hero. No se copió paleta, tipografía, fotografía, iconografía ni contenido de ninguna referencia — no había ningún archivo de referencia adjunto en la conversación (se verificó con `Glob` sobre `audit/`, sin resultados), así que la interpretación se hizo 100% a partir de la descripción textual del brief, manteniendo la identidad visual DOFI existente (paleta lila/violeta + acento naranja, tipografía y componentes ya aprobados en sprints anteriores).

## 2. Cambios en el Navbar

- Posición del header: `top-3 md:top-4` → **`top-2 md:top-3`** (margen superior reducido de 12/16px a 8/12px) para que se sienta integrado con el Hero en vez de flotando con un salto grande.
- **Sin cambios** en: contenido, 5 rutas, active pill (`layoutId`), menú móvil, lógica `inert`, CTA "Empecemos", colores, técnica de animación — tal como pedía el brief.

## 3. Layout split del Hero

- Grid de 2 columnas en desktop: **55/45** (`lg:grid-cols-[55fr_45fr]`), columna izquierda con el copy alineado a la izquierda (ya no centrado), columna derecha con el media slot.
- Ambas columnas viven dentro de un mismo marco (`rounded-[32px]`, borde lila, `surface-raised/25`) que actúa como "un solo header" visual junto al Navbar.
- Mismo copy exacto, sin cambios de texto: H1 "Un Mar de Ideas", "DOFI Agencia Creativa", "Convertimos atención en Ventas Inteligentes", CTA "Empecemos" / "Conoce lo que hacemos".
- **Corrección durante la verificación:** la primera versión pasaba el chequeo de `tsc`/build pero al medirla con Puppeteer el Hero medía 937.5px (muy por encima del target de 680-780px) porque dependía de `min-h` + `items-center` para dar forma a la columna. Se rehizo el espaciado del marco con padding explícito (`lg:pt-8 lg:pb-[72px]`) en vez de altura mínima, lo que además destapó y resolvió un segundo problema real: con el marco más compacto, la banda de capacidades (superpuesta 56px) quedaba tapando la mitad inferior de los botones CTA. Ambos se corrigieron juntos antes de tomar las capturas finales.

## 4. Media slot

Columna derecha, vacía a propósito: sin imagen, sin ilustración, sin stock, sin texto de placeholder. Solo atmósfera — un gradiente diagonal sutil + dos manchas de luz con blur alto en las esquinas, sobre `surface-base/60` con borde lila tenue. Preparado para recibir después una imagen real (`object-cover`) sin tener que tocar la estructura.

## 5. Eliminación de la onda (DofiWave)

Eliminada por completo, no reubicada ni dejada estática:
- Archivo `src/components/DofiWave.tsx` — borrado.
- Clase `.dofi-wave-track`, `@keyframes dofi-wave-drift` y su bloque de documentación en `globals.css` — borrados.
- Verificado con `grep -rn "DofiWave|dofi-wave|HeroCards" src/` → solo quedan 3 menciones, todas dentro de comentarios de documentación en `Hero.tsx` y `CapabilityBand.tsx` que explican históricamente qué se eliminó/renombró — cero imports, cero JSX, cero CSS activo.

## 6. Motion de texto/CTA

Se reutilizan sin cambios las clases `hero-anim-h1/brand/proposal/cta` del sprint de motion anterior (entrada + flotación continua muy leve, CSS puro, transform-only). Verificado con Puppeteer en el nuevo layout:
- H1 se desplaza continuamente (ej. y: 116.31px → 115.21px → 114.28px en 1.8s de muestreo) — la flotación sigue activa.
- CTA se desplaza en conjunto con el mismo patrón.

## 7. Banda de capacidades (antes "4 tarjetas")

Un solo contenedor (`rounded-[20px]`, borde lila `brand-lift/15`, `surface-raised/95`) con divisores internos (`divide-x`/`divide-y` de Tailwind, borde solo entre módulos) en vez de 4 tarjetas separadas con gap. 4 iconos Phosphor (Compass, ChatCircle, VideoCamera, Calendar), 32px, color `brand-lift`. Mismo copy exacto de los 4 módulos, sin cambios.

Superposición sobre el borde inferior del marco del Hero: **56px** en desktop/tablet (`md:-mt-14`), dentro del rango pedido (40-80px).

**Estabilidad verificado:** posición del primer módulo muestreada 3 veces en una ventana de 1.8s tras el reveal — **cero desplazamiento** (`x: 117, y: 490.84` en las 3 muestras). Los módulos no flotan después de su aparición.

## 8. Glow interactivo

Técnica sin cambios (pointermove nativo → `--mouse-x`/`--mouse-y` en el propio nodo DOM, sin `setState`). Verificado moviendo el cursor entre dos esquinas de un módulo: las variables CSS se actualizan con la posición real del cursor (`10px,10px` → `290.5px,179.5px`).

## 9. Responsive

| Viewport | Layout | Hero total height | Overflow horizontal |
|---|---|---|---|
| 1440 | split 55/45 | 765.3px | No |
| 1280 | split 55/45 | 763.7px | No |
| 1024 | split 55/45 (breakpoint `lg`) | 768.2px | No |
| 768 (tablet) | apilado, banda 2×2 | 1208.9px | No |
| 390 (mobile) | apilado: Navbar → H1 → marca → propuesta → CTA → media slot → capacidades | 1587.8px | No |
| 360 (mobile) | igual que 390 | 1633.3px | No |

Los 3 anchos desktop (1024/1280/1440) quedan dentro del target de **680-780px** pedido en el brief. Tablet y mobile no tenían un target numérico — se dejó el apilado natural del contenido, sin recortes ni solapamientos.

## 10. Accesibilidad

- Un solo `<h1>` en la página.
- Media slot marcado `aria-hidden="true"` (es decorativo, sin contenido semántico que anunciar).
- Iconos de la banda de capacidades `aria-hidden="true"` (el título/descripción en texto real ya comunican el contenido).
- CTAs son `<Link>` reales, navegables por teclado, con foco visible heredado del sistema existente.
- Contraste sin cambios respecto al Hero anterior (mismos tokens de color).
- `prefers-reduced-motion`: verificado con Puppeteer (`emulateMediaFeatures`) — H1, CTA y primer módulo quedan exactamente estáticos entre dos muestras (900ms de diferencia), y ambos mantienen `opacity: 1` (el contenido no se oculta, solo se congela la animación).

## 11. Performance

- Cero dependencias nuevas.
- Cero WebGL/Canvas/GSAP/Three.js.
- Bundle de `/` en build de producción: 19.9 kB (First Load JS 178 kB) — build completo (`npm run build:next`) compiló limpio, 39/39 rutas generadas.
- `npx tsc --noEmit` sin errores.

## 12. Archivos modificados

- `src/components/Hero.tsx` — reescrito completo (split layout, media slot, marco, espaciado corregido).
- `src/components/CapabilityBand.tsx` — nuevo (reemplaza a `HeroCards.tsx`, eliminado).
- `src/components/Nav.tsx` — solo `top-3 md:top-4` → `top-2 md:top-3`.
- `src/app/globals.css` — eliminado bloque completo de la onda; corregido un comentario que aún mencionaba `HeroCards.tsx`.
- `src/components/DofiWave.tsx` — eliminado.
- `src/components/HeroCards.tsx` — eliminado.

## 13. Screenshots

Todas en `audit/navbar-hero-reframe-final/`:
`desktop-1440.png`, `desktop-1280.png`, `desktop-1024.png`, `tablet-768.png`, `mobile-390.png`, `mobile-360.png`, `desktop-cards-detail.png`, `desktop-layout-debug.png`, `mobile-cards-detail.png`.

## 14. Pendientes

- La imagen real del media slot — **no se diseñó ni se define en este sprint**, según lo pedido explícitamente en el brief.
- Ningún otro pendiente dentro del alcance de este sprint.

---

## Checklist de validación (brief §51)

| Pregunta | Resultado |
|---|---|
| ¿Navbar se siente integrado con el Hero? | Sí |
| ¿Hero coincide con la estructura de la referencia (split, no centrado)? | Sí |
| ¿El sitio sigue sintiéndose DOFI y no la referencia? | Sí — paleta, tipografía y componentes sin cambios |
| ¿Copy organizado a la izquierda? | Sí |
| ¿Hay espacio real reservado para la imagen futura? | Sí — media slot vacío, sin placeholder visible |
| ¿La onda desapareció por completo? | Sí — archivo, CSS y toda referencia viva eliminados |
| ¿La banda de capacidades se superpone como en la referencia? | Sí — 56px de superposición |
| ¿Las tarjetas quedan estáticas después del reveal? | Sí — cero desplazamiento verificado |

No se avanzó a ninguna otra sección del sitio ni se diseñó la imagen futura del media slot, según lo pedido.
