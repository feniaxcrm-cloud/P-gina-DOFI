# DOFI — Crear 4 secciones de contenido debajo del Hero — Resultados

Sprint acotado a la arquitectura/layout/CMS de las 4 nuevas secciones de contenido
(texto + imagen) entre las tarjetas del Hero y `LogoWall`. **No se tocó** Hero, imagen
del Hero, overlays, CTA del Hero, las 4 tarjetas de capacidades (contenido/altura/
glow), Header, Footer, ni ninguna otra página. Contenido comercial definitivo:
explícitamente **fuera de alcance** (spec §6/§42) — todo el texto de las 4 secciones
es placeholder, literalmente el mismo ejemplo del brief ("Sección 01" / "Contenido de
esta sección..." / "Conocer más").

## 1. Componente creado

`src/components/ContentSection.tsx` — **uno solo**, reutilizado 4 veces vía
`.map()` (spec §14/§36, nunca `Section01.tsx`...`Section04.tsx`). Recibe
`{ titulo, descripcion, imagen, imagenAlt, hotspot, ctaTexto, ctaEnlace, index }`.

## 2. Estructura de datos

```ts
export type SeccionContenido = {
  titulo: string;
  descripcion: string;
  imagen: string | null;   // URL ?w=1400 o null si Sanity todavia no la tiene
  imagenAlt: string;
  hotspot: { x: number; y: number } | null;
  ctaTexto: string;
  ctaEnlace: string;       // ruta interna o URL completa
};
```

## 3. Schema de Sanity

**Se reutilizó `paginaInicio`** (spec §8, "si el proyecto ya tiene una estructura de
Home, reutilizarla") — no se creó un segundo documento. Nuevo campo `seccionesContenido`
(array de objetos `seccionContenido`), en su propio grupo/tab del formulario
("Secciones de contenido"), junto a "Hero" y "Capacidades" — exactamente la jerarquía
que pedía §32.

`studio/schemaTypes/objects/seccionContenido.ts` (nuevo tipo `object`):

| Campo | Tipo | Obligatorio |
|---|---|---|
| `titulo` | string | Sí |
| `descripcion` | text | Sí |
| `imagen` | image (`hotspot: true`, incluye crop) | Sí |
| `imagenAlt` | string | Sí |
| `ctaTexto` | string | Sí |
| `ctaEnlace` | string (ruta o URL) | Sí |

`options: { hotspot: true }` ya activa tanto el hotspot como el recorte (crop) en el
editor de Sanity — es la misma herramienta, no existe una opción "crop" separada.

**El lado (texto/imagen) NO es un campo** (spec §5/§10): no existe en el schema. El
orden del arreglo en el Studio (arrastrar para reordenar) *es* el 01/02/03/04 de la
página, y el frontend calcula el lado solo.

## 4. Campos (recordatorio de accesibilidad)

`imagenAlt` es obligatorio y separado del título — no se deriva del título porque el
título inicial (placeholder) no describe la imagen. Ver §12 más abajo (accesibilidad).

## 5. Query GROQ

Agregada a la consulta existente de `paginaInicio` (mismo round-trip, no una query
aparte):

```groq
seccionesContenido[]{
  titulo,
  descripcion,
  "imagen": imagen.asset->url + "?w=1400&auto=format",
  "imagenAlt": coalesce(imagenAlt, ""),
  "hotspot": imagen.hotspot{ x, y },
  ctaTexto,
  ctaEnlace
}
```

## 6. Integración frontend

`src/lib/sanity.ts`: `normalizarSeccionesContenido()` descarta items sin
título/descripción/CTA completo (la imagen es la única excepción — puede faltar sin
descartar el item, igual que el Hero). Si no queda ninguna sección válida, usa las 4
de respaldo completas — nunca menos de 4 ni un hueco a medio llenar.
`getPaginaInicio()` devuelve `seccionesContenido` junto a `secciones`/`hero`/
`capacidades`. `page.tsx` las pinta inmediatamente después de `<Hero />` (que ya
incluye las tarjetas) y antes de `<LogoWall />` — exactamente donde pedía §2.

## 7. Alternancia

**100% en el frontend**, vía `index % 2` sobre la posición real en el arreglo (spec
§5/§10/§37) — nunca un campo de Sanity. Par → texto a la izquierda; impar → imagen a
la izquierda. El mismo índice alterna también el fondo (`bg-canvas` / `bg-canvas-raised`,
ambos tokens ya existentes) para reforzar el ritmo visual sin salir del sistema de
diseño (spec §3/§18).

En el DOM el markup siempre va imagen → texto; el reordenamiento visual es puramente
CSS (`lg:order-1`/`lg:order-2`), mismo patrón que ya usa el Hero para su imagen
full-bleed. En mobile (sin `lg:`) eso da directamente imagen → título → descripción →
CTA en las 4 secciones, tal como pedía §22 — no se intenta simular
"izquierda/derecha" en una sola columna.

## 8. CTA

Botón píldora (mismo lenguaje visual que el CTA secundario del Hero: borde, texto
`ink`, ícono de flecha que se desplaza en hover), editable por sección desde Sanity
(`ctaTexto` + `ctaEnlace`).

## 9. Navegación externa vs. interna

```ts
const esExterno = /^https?:\/\//i.test(ctaEnlace);
```
Externo → `<a target="_blank" rel="noopener noreferrer">`. Cualquier otra cosa (ruta
interna `/algo`, ancla `#algo`) → `next/link`, navegación interna normal. Verificado
con Puppeteer sobre las 4 secciones con datos reales de Sanity:

| Sección | `ctaEnlace` | `target` | `rel` |
|---|---|---|---|
| 01 | `/contactanos` | *(ninguno)* | *(ninguno)* |
| 02 | `/clientes` | *(ninguno)* | *(ninguno)* |
| 03 | `/marketing-digital` | *(ninguno)* | *(ninguno)* |
| 04 | `https://example.com` | `_blank` | `noopener noreferrer` |

## 10. Responsive

Sin overflow horizontal verificado en los 6 anchos pedidos (§24):

| Ancho | scrollWidth | clientWidth |
|---|---|---|
| 1440px | 1440 | 1440 ✓ |
| 1280px | 1280 | 1280 ✓ |
| 1024px | 1024 | 1024 ✓ |
| 768px | 768 | 768 ✓ |
| 390px | 390 | 390 ✓ |
| 360px | 360 | 360 ✓ |

Desktop (`lg:` = 1024px+): grid de 2 columnas, `gap-16`, imagen `aspect-[4/3]` con
buena presencia (no miniatura). Mobile: una columna, imagen a `width: 100%` con la
misma proporción — nunca reducida a thumbnail (spec §23).

## 11. Animación de entrada

Reutiliza el componente `<Reveal>` existente (el mismo que ya usan Tools/Socio/
Services) — opacity 0→1 + translateY 24px→0, una sola vez al entrar en viewport
(`whileInView`, `once: true`), sin bounce/zoom/rotación. Texto e imagen son dos islas
de `Reveal` separadas con un leve stagger (0.05s). No se creó ninguna animación nueva.

## 12. Accesibilidad

- `alt` de cada imagen sale de `imagenAlt` (Sanity), con `titulo` como respaldo si
  llegara vacío.
- CTA son elementos semánticos reales (`<a>`/`next/link`), nunca un `<div onClick>`.
- Título de cada sección en `<h2>` (ver punto 13, SEO) — hereda el foco visible y el
  contraste del sistema de diseño existente (`text-ink`/`text-ink-muted`, ya AA).
- Targets táctiles: botones a `h-[52px]`, mismo alto que los CTA del Hero.

## 13. SEO

`<h2>` en las 4 secciones — el Hero conserva su único `<h1>` (spec §26, "no convertir
todo en H1"). Jerarquía semántica intacta.

## 14. Performance

- `next/image` con `sizes="(min-width: 1024px) 45vw, 100vw"` (responsive real, no una
  sola resolución fija).
- `loading="lazy"` en las 4 imágenes (a diferencia del Hero, que sí es `priority` por
  ser LCP — estas secciones están más abajo, nunca son el contenido inicial visible).
- Sanity ya devuelve la imagen optimizada (`?w=1400&auto=format`), sin instalar
  `@sanity/image-url` (mismo criterio "sin SDK" del resto de `sanity.ts`).

## Prueba real de Sanity (spec §33)

Con `scripts/test-content-sections-sanity.mjs` (nuevo, mismo patrón que
`test-hero-sanity.mjs`: imágenes **sintéticas** generadas con `sharp`, cero riesgo de
derechos de autor, nunca una foto real de un cliente):

1. **`seed`**: subió 4 imágenes de prueba y publicó título/descripción/CTA/imagen de
   las 4 secciones — verificado leyendo directo la API de Sanity (no solo confiando en
   el script).
2. **Verificación 1**: capturas `section-01.png`...`section-04.png` con el contenido
   recién publicado, alternancia correcta, fondo alternado, alturas iguales (213px las
   4 en desktop, heredado sin cambios de la banda de capacidades).
3. **`editar`**: cambió título, descripción, **imagen** (nueva subida) y CTA
   (texto + URL) de las secciones 1 y 2 — repetido en una segunda sección, tal como
   pedía §33 ("repetir al menos con otra sección").
4. **Verificación 2**: `section-01-editada.png` muestra el título/descripción/CTA/
   imagen nuevos. Nota real de aprendizaje: el primer intento de verificación mostró
   el contenido viejo — el ISR de 60s (`next: { revalidate: 60 }`) todavía no había
   vencido. Se llamó manualmente al webhook `/api/revalidate` (lo mismo que hace
   Sanity automáticamente en producción cuando el webhook está configurado) y el
   cambio se reflejó al toque. **Pendiente real, no de este sprint:** el webhook de
   Sanity en `manage.sanity.io` todavía dispara solo en `cuenta`/`contenido`/
   `servicio` — agregar `paginaInicio` ahí (ya estaba anotado como pendiente desde el
   sprint del Hero) para que los cambios de estas secciones también sean instantáneos
   en producción sin esperar los 60s del ISR.
5. **`limpiar`**: sacó el campo `seccionesContenido` del documento (`unset`, no un
   `set` con strings vacíos) y borró los 6 assets de imagen de prueba subidos. Se
   verificó que el frontend cae de vuelta al respaldo del código
   (`SECCIONES_CONTENIDO_FALLBACK`) — mismo patrón defensivo que el resto de
   `sanity.ts`.

## Regresión (Hero + tarjetas intactos)

Verificado con Puppeteer sobre el mismo build:
- `<h1>` del Hero: `"Ventas Inteligentes"` (sin cambios).
- 4 tarjetas de capacidades presentes, **213px de alto cada una** (mismo valor exacto
  del sprint de altura pareja — no se movió ni un píxel).
- Glow de borde de las tarjetas: no se tocó ningún archivo relacionado
  (`CapabilityBand.tsx`, la sección de `.capacidad-card` en `globals.css`) en este
  sprint.

## Capturas

- [audit/home-sections/sections-desktop.png](home-sections/sections-desktop.png) — las 4 secciones completas, 1440px
- [audit/home-sections/section-01.png](home-sections/section-01.png) — texto|imagen
- [audit/home-sections/section-02.png](home-sections/section-02.png) — imagen|texto
- [audit/home-sections/section-03.png](home-sections/section-03.png) — texto|imagen
- [audit/home-sections/section-04.png](home-sections/section-04.png) — imagen|texto, CTA externo
- [audit/home-sections/sections-mobile.png](home-sections/sections-mobile.png) — 390px, orden imagen→texto en las 4
- [audit/home-sections/section-01-editada.png](home-sections/section-01-editada.png) — prueba de edición/republish reflejada

**`sanity-sections.png`: no se pudo generar.** Igual que en el sprint del Hero, el
Studio (`dofi-cms.sanity.studio`) requiere un login interactivo (Sanity, no Vercel)
que esta sesión no puede completar — se intentó navegar y no hay sesión guardada. Se
compensó con una prueba más fuerte: el ciclo real seed → verificar → editar → verificar
→ limpiar contra la API de escritura de Sanity, documentado arriba con capturas del
resultado en el frontend en cada paso.

## Archivos modificados/creados

- `src/components/ContentSection.tsx` — **nuevo**, componente único reutilizable.
- `src/lib/sanity.ts` — tipos `SeccionContenido`/`SeccionContenidoRaw`, query GROQ,
  `normalizarSeccionesContenido()`, `SECCIONES_CONTENIDO_FALLBACK`, wiring en
  `getPaginaInicio()`.
- `src/app/page.tsx` — import + `.map()` de las 4 secciones entre `<Hero />` y
  `<LogoWall />`.
- `studio/schemaTypes/objects/seccionContenido.ts` — **nuevo**, tipo `object`.
- `studio/schemaTypes/index.ts` — registra `seccionContenido`.
- `studio/schemaTypes/paginaInicio.ts` — nuevo grupo "Secciones de contenido" + campo
  `seccionesContenido`.
- `scripts/test-content-sections-sanity.mjs` — **nuevo**, script de un solo uso para
  la prueba real de Sanity (no es parte del runtime de producción).
- `.gitignore` — ignora el log local de assets del script anterior.
- Studio redesplegado (`npx sanity deploy`) para que el campo nuevo sea editable en
  `dofi-cms.sanity.studio`.

## Checklist de aceptación (spec §40)

| Criterio | Estado |
|---|---|
| Hero intacto | ✅ (verificado, H1 sin cambios) |
| Cards del Hero intactas | ✅ (verificado, 213px sin cambios) |
| Nuevas secciones debajo de las cards | ✅ |
| Exactamente 4 secciones | ✅ |
| Texto + imagen | ✅ |
| Alternancia izquierda/derecha | ✅ (`index % 2`, verificado en capturas) |
| Cada sección tiene CTA | ✅ |
| CTA editable desde Sanity | ✅ (probado: editar → publicar → verificar) |
| URL editable desde Sanity | ✅ (ídem) |
| Imagen editable desde Sanity | ✅ (ídem, con imagen nueva) |
| Título editable desde Sanity | ✅ (ídem) |
| Descripción editable desde Sanity | ✅ (ídem) |
| Imágenes con hotspot/crop | ✅ (`options.hotspot: true`) |
| CTA externo abre nueva pestaña | ✅ (verificado `target="_blank"` + `rel`) |
| Diseño blanco DOFI | ✅ (`bg-canvas`/`bg-canvas-raised`, sin bloques oscuros) |
| Morado y naranja DOFI | ✅ (tokens existentes, sin colores nuevos) |
| Responsive | ✅ (6 anchos, sin overflow) |
| Animación de entrada sutil | ✅ (`<Reveal>` reutilizado) |
| Reduced motion | ✅ (verificado: opacity 1 sin scroll bajo `prefers-reduced-motion`) |
| Sin overflow | ✅ (verificado, tabla arriba) |
