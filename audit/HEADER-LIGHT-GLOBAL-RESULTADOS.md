# DOFI — Header nuevo + lienzo blanco global — Resultados

Fecha: 2026-08-27
Alcance: Header/Navbar (arquitectura Converzzo) + corrección del mecanismo global de color. Sin tocar Hero (composición), Servicios, Clientes, FENIAX, El Socio, Contacto, Footer ni páginas internas — solo se les midió el fondo, no se rediseñó nada de ellas.

---

## 1. Estructura del Header

3 zonas reales sobre lienzo blanco cálido (`--color-canvas`, vidrio translúcido con blur):

```
[ redes ]        [ LOGO DOFI centrado ]        [ navegación + Empecemos ]
```

- **Desktop (≥1280px, breakpoint `xl`):** las 3 zonas, logo centrado matemáticamente respecto al viewport.
- **1024–1279px:** barra compacta (logo izquierda + CTA + hamburguesa) — ver §5, es una decisión deliberada, no un recorte forzado.
- **Tablet/mobile (<1280px):** misma barra compacta; redes pasan al panel del menú.

## 2. Redes utilizadas

Mismo origen de datos que el pie (`socialLinks` de `src/config/company.ts`, ya filtrado a URLs reales por variable de entorno `NEXT_PUBLIC_INSTAGRAM_URL` / `_TIKTOK_URL` / `_LINKEDIN_URL`).

**Hoy ese arreglo está vacío — ninguna red tiene URL configurada** — así que la zona de redes se renderiza intencionalmente sin iconos, sin inventar ninguna URL. El código ya está listo: en cuanto se configure una de esas variables, el icono aparece solo (borde morado sutil, hover morado sólido, `aria-label`, `target="_blank"`, `rel="noopener noreferrer"`, `<a>` real — nunca `div onClick`), sin tocar `Nav.tsx`.

## 3. Rutas

Se inspeccionó la arquitectura existente antes de escribir ningún `href` (`src/app/*`). Rutas de la navegación nueva:

| Label | Ruta | Estado |
|---|---|---|
| Inicio | `/` | ya existía |
| Marketing Digital | `/marketing-digital` | **nueva** — placeholder mínimo |
| Tráfico / Ads | `/trafico-ads` | **nueva** — placeholder mínimo |
| ChatBots / CRM | `/chatbots-crm` | **nueva** — placeholder mínimo |
| Asesorías | `/asesorias` | **nueva** — placeholder mínimo |

Las 4 rutas nuevas reutilizan `PaginaEnConstruccion` (el mismo componente que ya usan `/feniax` y `/el-socio` con el mismo propósito) — confirman que la ruta existe y navega, sin inventar copy de servicio. No se diseñó contenido de esas páginas en este sprint, según lo pedido.

**Cambio de arquitectura de información:** las 5 rutas anteriores del nav (DOFI/FENIAX/EL SOCIO/CLIENTES/CONTÁCTANOS) fueron reemplazadas por las 5 nuevas — no coexisten. `/feniax`, `/el-socio`, `/clientes` y `/contactanos` **siguen existiendo y funcionando** (enlazadas desde el pie y desde bloques internos de la home), simplemente ya no están en la navegación principal. Marco esto explícitamente porque es un cambio real de qué rutas son "primarias" — avisar antes de que se note solo, no porque estuviera fuera de lo pedido (el brief fue explícito: "usar exactamente estas etiquetas").

## 4. Active state

Texto morado (`--color-brand`) + subrayado de 2px animado (`layoutId` de Framer Motion, mismo mecanismo ya aprobado del Nav anterior, ahora aplicado a una barra en vez de una cápsula). Verificado por ruta:

| Ruta visitada | Link marcado activo |
|---|---|
| `/` | Inicio |
| `/marketing-digital` | Marketing Digital |

Hover (no activo): `ink-muted` → `brand-lift` (morado más vivo). **No es naranja de acento** — corregido durante la verificación (ver §10).

## 5. Centrado del logo

Medido con Puppeteer, centro del logo vs. centro del viewport:

| Viewport | Layout | Diferencia |
|---|---|---|
| 1440 | 3 zonas | **0px** |
| 1280 | 3 zonas | **0px** |
| 1440 (scrolled) | 3 zonas | **0px** |
| 1024 | barra compacta, logo izquierda | n/a — no centrado a propósito |

0px, no una aproximación: el logo va posicionado en `absolute; left: 50%; transform: translateX(-50%)` sobre el header, fuera del flujo de redes/nav — así ninguno de los dos lados puede empujarlo, sin importar cuánto contenido tengan.

**Por qué 1024 no usa las 3 zonas** (spec §39, "si las zonas dejan de caber: activar layout mobile, no apretar artificialmente"): medido con Puppeteer, la navegación nueva (5 etiquetas más largas que las anteriores, p. ej. "Marketing Digital", "ChatBots / CRM") + el CTA necesitan ~550-650px reales. La mitad disponible del header a 1024px es ~464px — no entra sin invadir el logo bajo ningún recorte razonable de tipografía. A 1280 y 1440 sí entra limpio (ver §9 para el bug real que esto destapó y cómo se corrigió).

## 6. Comportamiento sticky/scroll

Verificado por estilos computados (no solo visual — la diferencia es sutil a propósito):

| Estado | Fondo | Blur | Borde inferior |
|---|---|---|---|
| Top | `canvas` 85% | 8px | `brand` 8% |
| Scrolled (>32px) | `canvas` 97% | 12px | `brand` 14% |

Sin cambio de altura entre estados (spec §37).

## 7. Mobile

- Barra: `[DOFI]` — `[Empecemos]` `[☰]`.
- Panel: blanco, los 5 links exactos + redes al final (hoy vacío, ver §2).
- Verificado: `Escape` cierra el panel, devuelve el foco al botón hamburguesa, `main` deja de estar `inert`. `aria-expanded`, `aria-controls`, scroll lock y contención de foco — mismos mecanismos ya aprobados del Nav anterior, sin cambios de comportamiento.
- Sin overflow horizontal en 390 ni 360.

## 8. Cambios de tokens

Ningún token nuevo — se reutilizan los tokens `canvas`/`ink`/`brand`/`accent` que el sprint anterior ("Navbar + Hero + Sanity") ya había preparado para Hero. Este sprint los declara la **base real** de `html`/`body` en vez de un caso especial:

```css
/* antes */
html { background-color: var(--color-abyss); color-scheme: dark; }
body  { background-color: var(--color-abyss); color: var(--color-foam); }

/* ahora */
html { background-color: var(--color-canvas); color-scheme: light; }
body  { background-color: var(--color-canvas); color: var(--color-ink); }
```

Se eliminaron 2 tokens muertos (`--color-pill-active-bg`, `--color-pill-active-fg`) que solo usaba la cápsula del Nav anterior, reemplazada por el subrayado.

## 9. Cómo se hizo prevalecer el blanco — y qué se rompió en el camino

**Diagnóstico** (spec §22): la causa real de que el sitio siguiera viéndose oscuro era literal — `html`/`body` seguían pintados en `--color-abyss`. El Hero ya era claro desde el sprint anterior, pero **todas las demás secciones pintan su propio fondo explícito** (`bg-abyss`, `bg-deep`, o un gradiente inline) — cambiar `html`/`body` no las toca ni las rompe, pero tampoco alcanza para que el blanco predomine si esas secciones siguen todas oscuras.

**Se migraron a lienzo claro** (fondo + texto + bordes, sin tocar layout/composición/copy): LogoWall, Manifesto, Proceso, Herramientas — ninguna estaba en la lista explícita de "no rediseñar" del brief.

**Se dejaron intactas** (protegidas explícitamente por el brief, §1): Hero (ya claro), Servicios, Clientes, El Socio, Contacto, Footer, páginas internas.

**Bug real encontrado y corregido durante la migración de Herramientas:** las tarjetas de Kommo y CapCut usan logos propios (`public/marcas/kommo.png`, `capcut.png`) en blanco sólido sobre transparente, pensados para la tarjeta oscura anterior. Sobre el lienzo claro nuevo eran prácticamente invisibles. Se corrigió con un chip oscuro propio detrás del logo (sin tocar el archivo — spec §24, adaptar no reemplazar el asset). También se restauró el color oficial de TikTok (negro): el cian que tenía era un sustituto explícito para que no desapareciera sobre fondo oscuro, ya no hace falta.

**Resultado medido, honesto:**

| | Altura | % |
|---|---:|---:|
| Claro (Hero + LogoWall + Proceso + Manifiesto + Herramientas) | 3 939px | **41,6%** |
| Oscuro (Clientes + Servicios + El Socio + Contacto + Footer) | 5 529px | **58,4%** |

**Esto no llega al 60-80% que pide la spec §25.** No lo estoy maquillando: con Servicios, Clientes, El Socio, Contacto y Footer — que juntas son la mayoría del alto de la página — protegidos explícitamente de rediseño en este sprint, el blanco no puede predominar todavía en términos de área real, aunque el Header, el primer scroll completo (Hero) y varias secciones intermedias ya son 100% claras. Ver captura de página completa (§11) para juzgarlo visualmente. **Llegar al 60-80% real requiere un sprint aparte que sí toque el fondo de esas 5 secciones** (adaptando colores, no rediseñando — el mismo patrón usado aquí).

## 10. Contraste

Verificado con la fórmula WCAG (no estimado):

| Combinación | Contraste | Resultado |
|---|---:|---|
| `ink` sobre `canvas` | 17,2:1 | AAA |
| `ink-muted` sobre `canvas` | 7,3:1 | AAA |
| `ink-subtle` sobre `canvas` | 5,4:1 | AA |
| `brand` sobre `canvas` (activo/logo) | ~9,9:1 | AAA |
| `brand-lift` sobre `canvas` (hover nav) | ~5,8:1 | AA |

**Bug real encontrado y corregido:** la primera versión usaba `hover:text-accent` (naranja) en los links del nav. `DOFI-DESIGN-SYSTEM-V1.md` §5.2 ya había medido que el naranja de acento sobre superficie clara da 2,42:1 — reprueba AA por mucho, y el propio documento lo marca como **prohibido como texto sobre claro**. Se cambió a `brand-lift` antes de mostrar esto.

Foco visible: outline 2px sólido en todo elemento enfocable del header (verificado por teclado, Tab real) — el color exacto del outline varía porque hereda `currentColor` de una regla global preexistente (no introducida en este sprint), pero el indicador en sí siempre está presente y es claramente visible.

Objetivo táctil: iconos de redes y botón hamburguesa a 44×44px (spec §34).

## 11. Screenshots

`audit/header-light-global/`: `desktop-1440.png`, `desktop-1280.png`, `desktop-1024.png`, `tablet-768.png`, `mobile-390-closed.png`, `mobile-390-open.png`, `mobile-360-open.png`, `desktop-scrolled.png`.

`audit/fullpage-1440-light-direction.png` — página completa, para juzgar el balance claro/oscuro real (ver §9).

## 12. Archivos modificados

- `src/components/Nav.tsx` — reescrito completo (header de 3 zonas).
- `src/components/Wordmark.tsx` — nuevo tamaño `nav` (52px alto, ~57px ancho).
- `src/components/Hero.tsx` — punto de quiebre del padding superior movido de `lg` a `xl` (coincide con la nueva altura del header).
- `src/app/globals.css` — `html`/`body` a lienzo claro; `.tool-mark` a `ink-subtle`; tokens muertos eliminados; comentarios actualizados.
- `src/components/LogoWall.tsx`, `Manifesto.tsx`, `Process.tsx`, `Tools.tsx` — migrados a tokens claros.
- `src/app/marketing-digital/page.tsx`, `trafico-ads/page.tsx`, `chatbots-crm/page.tsx`, `asesorias/page.tsx` — nuevos, placeholder mínimo.

## 13. Problemas pendientes

- **El blanco todavía no predomina globalmente** (41,6% vs. el 60-80% pedido) — requiere un sprint aparte que adapte colores de Servicios, Clientes, El Socio, Contacto y Footer (ver §9).
- Redes sociales: 0/3 configuradas — la zona aparece vacía hasta que se definan `NEXT_PUBLIC_INSTAGRAM_URL` / `_TIKTOK_URL` / `_LINKEDIN_URL`.
- `/marketing-digital`, `/trafico-ads`, `/chatbots-crm`, `/asesorias` son placeholders — sin diseñar a propósito.
- El color exacto del outline de foco varía por elemento (hereda `currentColor` de una regla preexistente, no de este sprint) — funciona, pero no es uniforme.

---

## Checklist de aprobación (brief §45)

| Pregunta | Resultado |
|---|---|
| ¿La arquitectura se parece a Converzzo? | Sí |
| ¿El logo está realmente centrado? | Sí — 0px medido a 1280/1440 |
| ¿Las redes están claras y ordenadas? | Sí (hoy sin redes reales configuradas — código listo) |
| ¿La navegación es exactamente Inicio / Marketing Digital / Tráfico / Ads / ChatBots / CRM / Asesorías? | Sí |
| ¿Se siente DOFI y no Converzzo? | Sí — paleta, tipografía y logo sin cambios |
| ¿El blanco prevalece claramente en el sitio? | **No todavía — 41,6% medido, ver §9** |

No se avanzó a Hero (composición) ni a ninguna otra sección más allá de la adaptación de color descrita.
