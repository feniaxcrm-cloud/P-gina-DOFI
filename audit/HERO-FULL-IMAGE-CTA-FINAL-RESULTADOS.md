# DOFI — Corrección Hero final: imagen integrada + overlays + nuevos CTA — Resultados

Fecha: 2026-08-27
Alcance: **solo Hero.** Header, capability cards (contenido/comportamiento), Servicios, Clientes, Footer, páginas internas y el seccionado general de la home — sin tocar.

---

## 1. Eliminación de la caja lateral

Eliminados por completo, no reutilizados ni dejados estáticos:

- El contenedor `aspect-[4/5] ... rounded-[24px] border border-brand/10 bg-canvas-raised` que encerraba la imagen en su propia tarjeta a la derecha (columna 45%).
- La clase `.hero-media-gradient` y su `@keyframes` en `globals.css` (el degradado en barrido que corría dentro de esa caja) — borrados, no comentados.
- El grid `lg:grid-cols-[55fr_45fr]` que producía el split texto/caja.

Verificado con grep: cero referencias vivas a ninguno de los tres en el código — solo quedan menciones en comentarios que explican qué se eliminó y por qué.

## 2. Estructura del Hero

Una sola composición integrada, no dos columnas:

```
<section>
  <div (contenedor del sitio, mismo ancho que el Header)>
    <div (banda del Hero, un solo contenedor relativo)>
      · Copy — z-20, delante de todo
      · Imagen — position: absolute; inset: 0 desde `md:` (detrás del copy,
        llena TODO el contenedor); en mobile vive en flujo normal, después
        del CTA, en su propio bloque contenido
        · Imagen de Sanity (o atmósfera si aún no hay imagen)
        · Scrim de legibilidad (fijo)
        · 3 overlays geométricos animados (solo desde `md:`)
    </div>
    <div (banda de capacidades, superpuesta al borde inferior)>
  </div>
</section>
```

Sin slider: `content.imagen` es un único asset, sin array, sin estado de slide, sin flechas ni dots — verificado leyendo el componente completo, no hay ningún `useState` de índice ni lógica de carrusel.

## 3. Integración de imagen Sanity

Mismo mecanismo que ya existía (sin instalar `@sanity/image-url`): `object-position` calculado en el cliente desde el hotspot `{x, y}` de Sanity. Lo que cambia es **cuánto espacio ocupa**:

| | Antes | Ahora |
|---|---|---|
| Área que llena | ~45vw (columna derecha) | Todo el contenedor del Hero |
| Ancho pedido a Sanity | `?w=1600` | `?w=2400` (para no perder nitidez retina al tamaño nuevo, mucho mayor) |
| `sizes` | `(min-width: 1024px) 45vw, 100vw` | `(min-width: 768px) 1320px, 100vw` |
| Sin imagen todavía | Atmósfera en una caja de 45vw | Misma atmósfera, ahora ocupando todo el Hero |

**Cómo se cambia desde Sanity** (spec §7): Studio → `paginaInicio` → campo `hero` → `imagen` (con hotspot editable arrastrando el punto de foco) + `alt`. No hace falta tocar código — la imagen y su encuadre se resuelven solos en el próximo build/revalidación.

## 4. Overlays geométricos

Reemplazan por completo al degradado en barrido anterior (que el propio brief señaló como "únicamente un gradient", justo lo que pedía evitar):

- **`.hero-scrim`** — gradiente fijo, sin animar, morado/tinta oscura de izquierda (82%) a transparente (68%). Protege la legibilidad del copy sin depender de que la foto real tenga contraste propio (spec §22).
- **`.hero-shape-1`** — panel diagonal grande vía `clip-path: polygon(...)`, morado/lila, el que más aporta a "proteger" visualmente la zona del copy.
- **`.hero-shape-2`** — franja diagonal secundaria, lila, cruzando hacia la derecha.
- **`.hero-shape-3`** — acento naranja **pequeño** (un triángulo, spec §11 "naranja únicamente como acento muy pequeño").

Ningún rectángulo semitransparente ni gradient plano como única decoración — las 3 formas son polígonos reales.

## 5. Técnica y duración de la animación

- **Técnica**: `transform` puro (`translate3d` + `rotate` + `scale`, "compositor-friendly") sobre capas con `clip-path` fijo — nunca se anima el propio `clip-path`, nunca layout. La fotografía (o la atmósfera de respaldo) nunca lleva animación propia — verificado: su `<Image>`/`<div>` no tiene ninguna clase de animación.
- **Duración**: 11s / 13s / 16s (una por capa, para que no se sincronicen visualmente), `ease-in-out`, `infinite alternate` — va y vuelve sobre sí misma, sin necesitar contenido duplicado (no es un tile) y sin salto perceptible al invertir.
- **Verificado que realmente anima** (no solo leído del código): se midió `getBoundingClientRect()` de `.hero-shape-1` en 3 instantes reales (0.8s / 5.3s / 9.8s tras la carga) — posición X: 103,9 → 107,8 → 109,0px, con la matriz de `transform` cambiando de forma continua. El movimiento es deliberadamente sutil (spec §12 "no agresivo"): perceptible en los datos, apenas perceptible a simple vista entre dos capturas — que es exactamente el efecto pedido.
- **Mobile**: los 3 overlays animados se ocultan (`hidden md:block`) — spec §27 "los overlays pueden simplificarse". El scrim de legibilidad se queda (aunque en mobile la imagen ya no está detrás del texto, se mantiene por consistencia visual).
- **`prefers-reduced-motion`**: verificado con Puppeteer — el `transform` computado de `.hero-shape-1` pasa a `none` y no cambia entre dos muestras separadas por 1,5s. El H1 se queda con `opacity: 1` fijo (nunca oculto). Sin media query propia: se apoya en la regla global ya existente del proyecto (`animation-duration` aplastada + `iteration-count: 1`), mismo patrón que ya usan las marquesinas y el motion del copy.

## 6. Nuevos CTA

| | Antes | Ahora |
|---|---|---|
| Principal | "Empecemos" | **"Quiero Mejorar mis Ventas"** |
| Secundario | "Conoce lo que hacemos" | **"Mira Nuestro Trabajo"** |

Verificado por texto real renderizado (no solo el código fuente), en los 5 viewports probados.

El icono de flecha se conserva en el principal (ya era parte del lenguaje visual). El secundario pierde el ícono de reproducción (`PlayCircle`): apuntaba a contenido audiovisual y ahora apunta a un portafolio de casos — mantenerlo habría sido engañoso.

## 7. Destinos finales de CTA

Se inspeccionó `src/app/` antes de escribir cualquier `href` — no existen `/casos` ni `/portfolio` en el proyecto.

| CTA | Destino | Nota |
|---|---|---|
| Principal | `/contactanos` | Ruta real ya existente, sin cambios — sigue siendo la de conversión. |
| Secundario | `/clientes` | Ruta real de portafolio/casos ya existente. No se creó ninguna página nueva. |

## 8. Mobile

Orden verificado por posición Y real en el DOM (no supuesto): **copy → CTA → imagen → cards**, exactamente el pedido en spec §27.

- La imagen deja de ser `position: absolute` y pasa a `position: relative` (bloque normal, con `border-radius: 20px`) — verificado con estilos computados en 390px, distinto del comportamiento en `md:` (`position: absolute`, `border-radius: 0`).
- CTA apilados a ancho completo, `h-[52px]` (por encima del mínimo táctil de 44px pedido).
- Sin overflow horizontal en 390 ni 360 (verificado, `scrollWidth === viewportWidth` en ambos).

## 9. Accesibilidad

- H1 sigue siendo el único `<h1>` de la página, HTML real, sin `opacity: 0` inicial (regla de LCP intacta) — confirmado con reduced-motion activo: `opacity: 1` constante.
- Imagen y atmósfera de respaldo llevan `alt` real (del CMS) o quedan `aria-hidden` cuando son puramente decorativas (scrim, overlays geométricos, atmósfera de respaldo).
- Los dos CTA son `<Link>` reales, navegables por teclado.
- El grupo de CTA anima como una sola unidad (`.hero-anim-cta` envuelve ambos botones) — confirmado por código: una sola clase, ningún botón animado por separado.
- Contraste: se corrigió un problema real encontrado durante la propia verificación (ver "Errores encontrados" más abajo).

## 10. Performance

- Cero dependencias nuevas. Cero canvas/WebGL/Three.js/Remotion — todo CSS (`transform`, `clip-path` estático, `linear-gradient`).
- Una sola instancia de `<Image>` en el DOM (nunca dos, para no duplicar la descarga): el mismo elemento cambia de estrategia de posicionamiento por breakpoint vía CSS (`relative` en mobile → `md:absolute`), nunca se renderiza dos veces.
- `priority` se mantiene en la imagen (ya lo tenía) — sigue siendo la candidata a LCP.
- `sizes` ajustado a la nueva área real ocupada (antes subestimaba el ancho en desktop, ahora es preciso).
- Build de producción (`npm run build:next`) compila limpio, 43/43 rutas.

## 11. Screenshots

`audit/hero-full-image-cta-final/`: `desktop-1440.png`, `desktop-1280.png`, `tablet-768.png`, `mobile-390.png`, `mobile-360.png`.

`audit/`: `hero-overlay-frame-01.png`, `hero-overlay-frame-02.png`, `hero-overlay-frame-03.png` — capturados en instantes reales distintos (0,8s / 5,3s / 9,8s) para documentar el movimiento (ver §5 para las coordenadas medidas en cada uno).

## 12. Archivos modificados

- `src/components/Hero.tsx` — reescrito completo (composición única, imagen integrada, overlays, nuevos CTA, colores responsivos del copy).
- `src/app/globals.css` — `.hero-media-gradient` eliminado; nuevo bloque `.hero-scrim` + `.hero-shape-1/2/3`.
- `src/lib/sanity.ts` — `HERO_FALLBACK` con los nuevos textos/enlaces de CTA; ancho de imagen pedido a Sanity subido a 2400px.
- `src/app/layout.tsx` — corregido un comentario de documentación (THESIS/STORY) que todavía citaba el CTA y la composición anteriores.

---

## Errores encontrados y corregidos durante la propia verificación

No se entrega esto a ciegas — dos problemas reales aparecieron al verificar con Puppeteer, antes de mostrar cualquier captura:

1. **Contraste roto en desktop**: la primera versión mantenía los tokens de texto oscuro (`ink`, `ink-subtle`) pensados para el lienzo claro anterior, pero el copy ahora vive sobre el scrim morado oscuro desde `md:`. "DOFI AGENCIA CREATIVA" quedaba casi invisible. Corregido con tokens responsivos: oscuros en mobile (donde el copy sigue sobre lienzo claro, la imagen es un bloque aparte), claros desde `md:` (donde el copy se superpone a la imagen). Documentado en el propio componente.
2. **Altura fuera de rango**: la primera versión medía 871,5px a 1280px (el objetivo era 720-860px). Se ajustó el `min-height` de la banda del Hero y quedó en 823,5-851,5px en los tres anchos de escritorio probados.

---

## Checklist de aceptación (brief §34)

| Pregunta | Resultado |
|---|---|
| ¿La imagen ocupa el Hero como gran visual integrado? | Sí |
| ¿La caja lateral fue eliminada? | Sí |
| ¿No existe slider? | Sí — confirmado, un solo asset, sin estado de slide |
| ¿Existen formas geométricas moradas animadas? | Sí — 3 capas con `clip-path`, movimiento verificado con datos reales |
| ¿El CTA principal dice exactamente "Quiero Mejorar mis Ventas"? | Sí |
| ¿El CTA secundario dice exactamente "Mira Nuestro Trabajo"? | Sí |
| ¿Las cards siguen integradas abajo y estáticas después del reveal? | Sí — sin cambios de comportamiento, contenido intacto |

No se avanzó a ninguna otra sección.
