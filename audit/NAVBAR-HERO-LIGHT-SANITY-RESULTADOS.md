# Navbar + Hero + Sanity — lienzo claro: resultados

> Implementa el brief del propietario *"DOFI — REPLANTEO DEFINITIVO NAVBAR + HERO + SANITY"*. Alcance: **Navbar, Hero, Banda de capacidades y el Sanity de esos tres elementos** — nada más se tocó a propósito (§2 y §82 del brief).

## 0. Cómo se construyó esta vez

El brief fijaba cada decisión visual con precisión inusual (paleta exacta, timings, comportamiento de hover, jerarquía, responsive). Con la dirección ya resuelta por el propio documento, se construyó directo sobre el brief — sin la ronda exploratoria de dirección visual que usa normalmente el skill de diseño para casos donde el rumbo todavía está abierto. Queda registrado como comentario de contrato al inicio de `src/app/layout.tsx` (THESIS/OWN-WORLD/STORY/FIRST VIEWPORT/FORM/FINISH).

**Limitación de esta sesión, dicha sin rodeos:** el panel de navegador de este entorno no llegó a componer frames (`the Browser pane is not displayed, so the page is not compositing frames`), así que **no se pudieron capturar screenshots reales** ni confirmar visualmente el hover con el cursor. La verificación se hizo por:
- Inspección estructural del DOM y de estilos computados reales (`getComputedStyle`) sobre el sitio corriendo en `npm run dev`, en desktop 1440, tablet 768 y mobile 375.
- Contraste WCAG **medido** (fórmula de luminancia relativa), no estimado — ver §11.
- Confirmé que el mecanismo de hover es correcto a nivel de CSS (regla presente, especificidad correcta, `:hover` reconocido por el navegador) probando además que el mismo problema de "no se refleja el cambio" ocurre con un `hover:` de Tailwind que YA estaba en el Navbar antes de esta sesión — es una limitación de esta herramienta de automatización con el compositor apagado, no un defecto nuevo.
- `npm run build:next` y `npx tsc --noEmit` (Studio) compilan limpios.
- `node .claude/skills/impeccable/scripts/detect.mjs` sobre los archivos cambiados: **0 hallazgos**.

No se generaron las capturas obligatorias del §73 del brief por esta misma razón. Quedan pendientes de una verificación visual manual del propietario (o de una sesión con el panel de navegador visible).

## 1. Nueva dirección: lienzo claro

Tokens nuevos en `globals.css` (sección "LIENZO CLARO — tokens preparatorios"), **sin tocar ni un token oscuro existente**:

| Token | Valor | Rol |
|---|---|---|
| `--color-canvas` | `#FDFBF7` | Fondo base, blanco cálido |
| `--color-canvas-raised` | `#F6F1EA` | Superficie clara elevada |
| `--color-ink` | `#1A0F3D` (= `--color-deep`, reutilizado) | Texto principal sobre claro |
| `--color-ink-muted` | `#57516B` | Texto secundario |
| `--color-ink-subtle` | `#6C6480` | Texto terciario |
| `--color-pill-active-bg` / `-fg` | mezcla morada 10% / `--color-brand` | Píldora activa del nav |

El morado (`--color-brand` `#4B2A93`) y el naranja (`--color-accent` `#F47B20`) **no se duplicaron**: son los mismos tokens que ya usaba el tema oscuro, solo cambia su rol (antes acento sobre oscuro, ahora acento sobre claro). Body/html siguen en `--color-abyss` (oscuro) a propósito — el resto del sitio (Servicios, Procesos, Manifiesto, Herramientas, Socio, Contacto, Footer, LogoWall, Clientes) **no se tocó**, sigue 100% oscuro. Ver §16 (pendientes) para el riesgo conocido de ese límite.

## 2. Navbar

`src/components/Nav.tsx`: vidrio claro (`bg-canvas/80` en reposo, `/92` tras scroll, `/96` con el panel móvil abierto + `backdrop-blur`), borde `border-brand/10-14`. Contenido sin cambios (mismos 5 links + Empecemos). Píldora activa: fondo morado muy suave, texto `--color-brand` — **medido**: `rgb(75, 42, 147)` sobre `color(srgb 0.92 0.90 0.93)`, confirmado en el navegador real vía `getComputedStyle`.

**Hallazgo antes de tocar nada:** el logo (`logo-dofi-compact.png`) tiene el delfín + "DO" en **blanco puro** — invisible sobre un nav claro. Se confirmó compositando el PNG real sobre `#FDFBF7` antes de escribir una sola línea de componente. Se generó `public/logo-dofi-compact-on-light.png` con `scripts/make-logo-on-light.mjs`: reclasifica cada píxel por matiz (blanco/neutro → `--color-deep`; naranja → sin tocar) preservando el alfa original, sin redibujar el trazo. `Wordmark.tsx` ahora acepta `tone="light" | "dark"`; el Nav pide `tone="light"`, el pie sigue con el asset oscuro original.

## 3. Hero

`src/components/Hero.tsx`: split 55/45 en desktop (`lg:grid-cols-[55fr_45fr]`, medido en el navegador: 633.6px/518.4px a 1440px = 55/45 exacto), columna izquierda de copy, columna derecha de imagen. Alineación izquierda, sin centrado. Mismo copy aprobado (H1 "Un Mar de Ideas", marca, propuesta, 2 CTA) — **ahora 100% prop**, viene de Sanity con `HERO_FALLBACK` centralizado en `src/lib/sanity.ts` si el CMS no responde o falta la imagen.

Responsive verificado en el navegador real:
- **Desktop (1440px):** split 55/45, imagen 4:5.
- **Tablet (768px):** se apila a 1 columna (el split de un contenedor de ~350px por lado se veía apretado; se decidió no forzarlo — el brief permite "mantener split hasta que deje de ser legible").
- **Mobile (375px):** orden real medido por posición vertical: H1 → CTA → imagen → banda de capacidades, exactamente el orden pedido en §51. No hace falta ningún CSS `order`: al apilarse a una columna, el orden del DOM (copy primero, imagen segundo) ya produce ese resultado solo.

## 4. Imagen — Sanity, hotspot, sin SDK nuevo

Sin instalar `@sanity/image-url` (el brief prohíbe dependencias nuevas, §72): el foco de la imagen se resuelve en el cliente con `object-position` calculado desde el hotspot `{x,y}` (0–1) que ya trae el GROQ, sobre un contenedor `aspect-[4/5]` con `object-fit: cover`. Logra lo mismo que un recorte de servidor (el sujeto nunca queda forzado al centro) sin la librería de URLs de Sanity, y además se adapta solo si el contenedor cambia de proporción entre breakpoints — un `rect` fijo calculado en el servidor no lo haría. El campo `crop` (recorte manual) no se usa todavía; si en algún momento se quiere un recorte pixel-perfect por servidor, hay que agregar `@sanity/image-url` con aprobación explícita.

Sin imagen todavía cargada en el Studio (el estado real hoy): el slot no rompe — se pinta la misma atmósfera de manchas de luz que ya existía como placeholder, ahora en paleta clara. Verificado en el navegador: sin `SANITY_PROJECT_ID`, no se renderiza ningún `<img>` roto, solo los dos blobs decorativos `aria-hidden`.

**Nota de performance heredada:** el propio README/handoff de este proyecto documenta que `/_next/image` no redimensiona correctamente en el Worker de Cloudflare (bug de OpenNext, no de este cambio). Cuando se cargue una imagen real en Sanity, esa imagen viajará sin optimizar en producción hasta que se resuelva ese bug aparte.

## 5. Degradado animado sobre la imagen

`.hero-media-gradient` en `globals.css`: `repeating-linear-gradient` con el mismo color (`--color-canvas`) en la parada 0% y 100% — matemáticamente periódico, así que animar `background-position` nunca deja costura sin tener que calcular el largo exacto del período a mano. Paradas: blanco → morado translúcido (60%) → acento naranja (42%) → transparente. 14s, lineal, infinito. Capa aparte (no toca `object-position` ni transform de la foto — la foto queda perfectamente fija). Con `prefers-reduced-motion: reduce` la animación se apaga (y además la regla global del sitio ya fuerza `animation-duration: 0.001ms` en todo, como red de seguridad doble).

No se pudo capturar los 3 frames pedidos en el §78 por la limitación de screenshots de esta sesión — la mecánica quedó verificada por código (la regla `repeating-linear-gradient` con extremos iguales es correcta por construcción), pero no confirmada por ojo.

## 6. Motion de texto/CTA

Sin cambios de técnica: se reutilizan las mismas clases `hero-anim-h1/brand/proposal/cta` del sprint anterior (entrada `transform`-only + flotación continua, CSS puro, nunca `opacity` — el H1 no puede nacer invisible por la regla de LCP ya vigente en el proyecto). Solo cambiaron los colores que envuelven ese texto.

## 7. Banda de capacidades

`src/components/CapabilityBand.tsx`: 4 tarjetas **individuales** (antes era una sola banda con divisores internos; el brief pide tarjetas con su propio borde y sombra, §39), grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — verificado en el navegador: 1 columna a 375px, 2 a 768px, 4 a 1440px. Overlap contra el borde inferior del Hero: `-mt-14` en desktop = **56px medidos**, dentro del rango 40–80px del §46.

Contenido: mismo copy exacto de las 4 capacidades (Planificación Estratégica / Conversación / Producción Audiovisual / Publicación de Contenido), ahora prop desde Sanity con `CAPACIDADES_FALLBACK` centralizado.

## 8. Hover de las tarjetas

Reemplaza **por completo** la técnica anterior (spotlight radial que seguía el cursor vía `--mouse-x`/`--mouse-y`, prohibida explícitamente en el §42). Nueva técnica, puramente CSS, sin JS ni listeners de `pointermove`:

- `.capacidad-card::before` es un pseudo-elemento con el degradado DOFI (`linear-gradient(135deg, brand → brand-lift → accent)`), `opacity: 0` en reposo, `z-index: -1` (pinta encima del fondo blanco de la tarjeta pero debajo del texto — orden de apilamiento estándar de CSS para z-index negativo dentro de un `isolation: isolate`).
- En hover/`focus-within` (dentro de `@media (hover: hover) and (pointer: fine)`, así que en touch no se simula), la opacidad sube a 1 y el texto/ícono pasan a blanco vía `group-hover:` de Tailwind.
- **Cero transform**: verificado por código — ninguna clase de la tarjeta anima `transform`, `scale` ni `rotate`. Medido en el navegador con `:hover` real activo: `getComputedStyle(tarjeta).transform === "none"`.
- Transición 300ms, `cubic-bezier(0.16, 1, 0.3, 1)` (la curva del Design System).
- Sin enlace (`enlace: null`, el caso de hoy), la tarjeta es un `<div>` sin `cursor:pointer`; con enlace, se renderiza como `<Link>` real — nunca un `<div onClick>` fingiendo botón (§67).

**No se pudo confirmar por ojo** que el cross-fade se vea correctamente (misma limitación de compositor apagado del §0) — sí se confirmó que la regla CSS existe, tiene la especificidad correcta y `:hover` es reconocido por el navegador sobre ese elemento exacto.

## 9. Schemas de Sanity

**Hallazgo importante antes de escribir el schema nuevo:** el documento `paginaInicio` que `src/lib/sanity.ts` ya consultaba (desde una sesión anterior) **no existía en absoluto** en `studio/schemaTypes/` — ni el documento, ni `seccionHacemos`/`seccionSocio`/`seccionCierre`/`seccionPilares`. Es decir: aunque las variables de Sanity estuvieran cargadas en Cloudflare, **nadie podía haber editado nunca el texto de "Lo que hacemos", "El Socio" ni el cierre desde el Studio** — esa parte de la migración a Sanity de sesiones anteriores quedó a medias del lado del CMS. Esto es anterior a este sprint y está fuera de su alcance arreglarlo por completo, pero **si esto se hereda sin decirlo puede parecer un bug de esta sesión** — no lo es, y queda documentado en §16.

Lo que sí se creó ahora, dentro del alcance de este sprint:

- **`studio/schemaTypes/paginaInicio.ts`** — documento singleton (un único registro, se abre directo desde el menú "Página de inicio" en `deskStructure.ts`, sin lista ni botón de "crear nuevo"). Campos: `hero` (objeto) y `capacidades` (array). `secciones[]` (Hacemos/Socio/Cierre) **no se agregó** — está fuera de este sprint y agregarlo a ciegas dejaría un editor a medio construir.
- **`hero`**: `titulo` (requerido), `marca`, `mensaje`, `imagen` (tipo `image`, `hotspot: true`, con subcampo `alt`, **requerida** — el diseño depende visualmente de ella, §55), `ctaPrincipalTexto/Enlace`, `ctaSecundarioTexto/Enlace`.
- **`studio/schemaTypes/objects/capacidad.ts`**: `titulo` (requerido), `descripcion` (requerida, máx. 140 caracteres), `icono` (select controlado — radio con 4 opciones en español, nunca texto libre), `activa` (boolean), `enlace` (opcional). Preview configurado: título + clave de ícono + estado activa/inactiva (§57).

## 10. GROQ

Se extendió la única consulta existente (`QUERY_PAGINA_INICIO` en `src/lib/sanity.ts`) en vez de crear una segunda consulta — mismo documento, un solo fetch:

```groq
*[_type == "paginaInicio"][0]{
  titulo,
  secciones[]{ ... },
  hero{
    titulo, marca, mensaje,
    "imagen": imagen.asset->url + "?w=1600&auto=format",
    "imagenAlt": coalesce(imagen.alt, ""),
    "hotspot": imagen.hotspot{ x, y },
    ctaPrincipalTexto, ctaPrincipalEnlace,
    ctaSecundarioTexto, ctaSecundarioEnlace
  },
  capacidades[]{ titulo, descripcion, icono, activa, enlace }
}
```

`getPaginaInicio()` reemplaza a `getSeccionesPaginaInicio()` (mismo patrón de respaldo: si falta el título del hero, cae completo a `HERO_FALLBACK`; si `capacidades` queda vacío tras filtrar inactivas/incompletas, cae a `CAPACIDADES_FALLBACK`). `page.tsx` pasa `hero`/`capacidades` como props a `<Hero>`/`<CapabilityBand>` — mismo patrón ya establecido para Services/Socio/Contact (presentacionales, sin fetch propio).

## 11. Accesibilidad

Contraste **medido** con la fórmula de luminancia relativa WCAG, sobre `--color-canvas` (`#FDFBF7`):

| Combinación | Ratio | AA (4.5:1 texto normal) |
|---|---|---|
| `--color-ink` | 17,2:1 | ✅ |
| `--color-ink-muted` | 7,3:1 | ✅ |
| `--color-ink-subtle` | 5,4:1 | ✅ |
| `--color-brand` (píldora activa) | 9,9:1 | ✅ |

`--color-ink-subtle` se ajustó **durante** esta sesión: el primer valor elegido (`#7A7290`) medía 4,38:1 — insuficiente, porque se estaba usando en la etiqueta de marca a 14–16px semibold, que no califica con certeza como "texto grande" de WCAG. Se corrigió a `#6C6480` (5,4:1), seguro para cualquier tamaño.

Otros puntos verificados:
- Un solo `<h1>` en la página (confirmado por el árbol de accesibilidad).
- Foco visible: `:focus-visible` global ya existente, sin cambios; las tarjetas sin enlace no son focables (correcto, no son interactivas); las tarjetas con enlace heredan el foco nativo de `<Link>`.
- `prefers-reduced-motion`: el degradado del Hero se apaga: `.hero-media-gradient { animation: none }`, reforzado por la regla global del sitio que ya fuerza duración casi cero en toda animación/transición.
- Imagen del Hero: `alt` editable desde Sanity, nunca se usa el nombre de archivo.
- Tarjetas sin enlace no llevan `cursor: pointer` ni ningún rol de botón falso.

## 12. Performance

- `npm run build:next`: compila limpio, sin warnings nuevos.
- No se agregó ninguna dependencia (`package.json` sin cambios de paquetes).
- El degradado del Hero es una sola capa CSS animando `background-position` — costo de compositor, no de layout.
- El hover de las tarjetas anima `opacity`/`color`, nunca `transform` ni propiedades que disparen layout.
- No se pudo medir FCP/LCP/CLS real (requiere el panel de navegador componiendo frames, no disponible esta sesión — ver §0). Pendiente de una medición real antes de dar por cerrado el §80 del brief.

## 13. Screenshots

**No se generaron.** Ver la limitación explicada en el §0 — el panel de navegador de este entorno no llegó a componer frames. No existe la carpeta `audit/navbar-hero-light-sanity/` que pedía el brief. Recomendado: abrir `npm run dev` en una sesión con panel de navegador visible (o revisar en `localhost:3000` directo) y confirmar por ojo, especialmente el hover de las tarjetas y el degradado animado — las dos piezas que esta sesión no pudo validar visualmente.

## 14. Archivos modificados

**Nuevos:**
- `studio/schemaTypes/paginaInicio.ts`
- `studio/schemaTypes/objects/capacidad.ts`
- `scripts/make-logo-on-light.mjs`
- `public/logo-dofi-compact-on-light.png`
- `audit/NAVBAR-HERO-LIGHT-SANITY-RESULTADOS.md` (este archivo)

**Modificados:**
- `src/app/globals.css` — tokens claros, hover de tarjetas, degradado del Hero, limpieza de CSS muerto (ver §15)
- `src/app/layout.tsx` — comentario de contrato de dirección
- `src/app/page.tsx` — usa `getPaginaInicio()`, pasa props a Hero/CapabilityBand
- `src/components/Nav.tsx` — superficie clara
- `src/components/Hero.tsx` — reescrito: prop-driven, imagen Sanity, superficie clara
- `src/components/CapabilityBand.tsx` — reescrito: prop-driven, hover cromático, sin glow de cursor
- `src/components/Wordmark.tsx` — prop `tone`
- `src/lib/sanity.ts` — tipos `HeroContent`/`Capacidad`, fallback centralizado, `getPaginaInicio()`
- `studio/schemaTypes/index.ts`, `studio/deskStructure.ts` — registro de los tipos nuevos + singleton

**Eliminados:**
- `src/components/WaveText.tsx` — componente muerto (0 referencias), tipografía cinética de un hero anterior. Su CSS asociado (`.wave-letter`, `@keyframes letter-wave`) y `.logo-float`/`@keyframes logo-float` (también sin uso) se limpiaron de `globals.css` — cumple el pedido explícito del §5 de eliminar por completo la onda anterior, sin dejar CSS muerto.

## 15. Sin dependencias nuevas

`package.json` sin cambios — se cumplió el §72 al pie de la letra. El recorte del logo se hizo con `sharp`, que ya era dependencia del proyecto.

## 16. Problemas / pendientes

1. **`paginaInicio.secciones[]` sigue sin schema en el Studio** (Hacemos/Socio/Cierre/Pilares) — hallazgo de esta sesión, anterior a este sprint, fuera de su alcance. Sin esto, esas 3 secciones de la home nunca van a poder editarse desde Sanity aunque las variables de entorno estén cargadas. Recomendado como próximo sprint.
2. **Sin verificación visual real** (screenshots, hover, degradado, performance) por la limitación de esta sesión — ver §0, §5, §8, §12, §13. Es el pendiente más importante antes de dar esto por aprobado.
3. **`SANITY_PROJECT_ID`/`SANITY_DATASET`/`CONTACT_WEBHOOK_URL` siguen sin estar cargadas en el Worker de Cloudflare** (confirmado en una sesión anterior con `wrangler`) — mientras tanto, todo lo de Sanity de este sprint (Hero, imagen, capacidades) sirve `HERO_FALLBACK`/`CAPACIDADES_FALLBACK` en producción, no contenido real del Studio.
4. **Ningún dato real cargado todavía en `paginaInicio`** — hasta que el propietario entre al Studio y complete al menos el Hero (imagen requerida), la home sigue mostrando el respaldo. Es el comportamiento esperado, no un bug.
5. **Optimización de imágenes de Sanity en Cloudflare Workers** — bug heredado (`/_next/image` no redimensiona en el Worker), afecta a la imagen del Hero en cuanto se cargue una real. No se intentó resolver, está fuera de este sprint.
6. **Tablet (768px):** el Hero se apila a 1 columna en vez de mantener el split — decisión de esta sesión, no una instrucción literal del brief. Confirmar si el propietario lo prefiere así o quiere forzar el split hasta un punto de quiebre distinto.
