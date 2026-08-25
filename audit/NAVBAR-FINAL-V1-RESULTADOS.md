# NAVBAR DOFI V1 — RESULTADOS
### Navbar flotante multipágina con estado activo animado

| | |
|---|---|
| **Fecha** | 25 de agosto de 2026 |
| **Base** | `5a8aaf1` (Hero V1 + Navbar V1 de una sola página + Logo Wall V1, ya recuperados) |
| **Archivos tocados** | `Nav.tsx` (reescrito completo) + 1 componente nuevo + 4 páginas nuevas |
| **Dependencias instaladas** | **Ninguna** — Motion, `usePathname`, Phosphor, todo ya estaba |
| **Estado** | Sin commit, sin deploy — esperando aprobación |

---

## 1. Arquitectura final

DOFI deja de navegar por anclas de una sola página y pasa a rutas reales. El
componente `Nav.tsx` anterior (scrollspy con `IntersectionObserver` sobre
`#servicios`/`#proceso`/`#clientes`/`#socio`) se **reemplazó por completo**:
ya no hay ninguna sección que vigilar, la única fuente de verdad es la ruta.

```
╭──────────────────────────────────────────────────────────────────╮
│ [DOFI]      DOFI  FENIAX  EL SOCIO  CLIENTES  CONTÁCTANOS   [Empecemos →] │
╰──────────────────────────────────────────────────────────────────╯
```

Tres zonas — logo / navegación / acción — dentro de un único panel flotante
con radio, borde y `overflow-hidden` compartidos: la barra y el panel móvil
(cuando existe) se ven como **una sola pieza**, no dos rectángulos apilados.

---

## 2. Rutas

| Ruta | Estado | Contenido |
|---|---|---|
| `/` | **Ya existía** | Home completa (Hero V1, Logo Wall, Clientes, Servicios, Proceso, Manifiesto, Herramientas, Socio, Contacto) — **no se tocó** |
| `/clientes/[slug]` | **Ya existía** | 26 páginas de caso — **no se tocó** |
| `/feniax` | **Nueva** | Placeholder — "Página en construcción" |
| `/el-socio` | **Nueva** | Placeholder — "Página en construcción" |
| `/clientes` | **Nueva** (índice; coexiste con `/clientes/[slug]`) | Placeholder |
| `/contactanos` | **Nueva** | Placeholder |

Las 4 páginas nuevas comparten un componente, `PaginaEnConstruccion.tsx`:
título + "Página en construcción" + enlace de vuelta a inicio. **Sin copy de
marca inventado a propósito** — solo confirman que la ruta existe y navega,
tal como pedía el sprint (punto 31). El formulario real de contacto
(`Contact.tsx`, conectado a `/api/contacto` y Sanity) sigue viviendo en
`/#contacto` — moverlo a `/contactanos` es trabajo de un sprint de páginas
internas, no de este.

---

## 3. Técnica del active pill

```ts
const LINKS: NavLink[] = [
  { label: "DOFI", href: "/", match: (p) => p === "/" },
  { label: "FENIAX", href: "/feniax", match: esRuta("/feniax") },
  { label: "EL SOCIO", href: "/el-socio", match: esRuta("/el-socio") },
  { label: "CLIENTES", href: "/clientes", match: esRuta("/clientes") },
  { label: "CONTÁCTANOS", href: "/contactanos", match: esRuta("/contactanos") },
];
```

**Estrategia de "página activa" (punto 8 del sprint):**
- **`/` — match exacto.** Si en el futuro existen páginas de servicio bajo
  DOFI (`/marketing-digital`, etc., punto 29), NO deben marcar "DOFI" activo
  automáticamente solo por vivir bajo la marca. Esa decisión se toma cuando
  esas páginas existan, no antes.
- **El resto — match por prefijo** (`p === base || p.startsWith(base + "/")`).
  Verificado en real: `/clientes/dukare` marca **CLIENTES** activo, no
  ninguno. Preparado para hijas futuras de FENIAX, El Socio y Contáctanos.

**La cápsula es un solo `motion.span` con `layoutId="nav-active-pill"`**,
montado dentro del link que esté activo en cada momento. Al cambiar de ruta,
React lo desmonta de un link y lo monta en otro; Framer Motion interpola
posición y ancho entre ambos puntos (proyección de layout compartida) sin
que el código calcule un solo píxel a mano. `transition={{ type: "tween",
duration: 0.35, ease: [0.16,1,0.3,1] }}` fuerza una curva lineal en vez del
spring por defecto de las animaciones de layout: sin rebote, sin overshoot.

El hover **nunca** toca este `layoutId` — es CSS puro (cambio de color +
`hover:bg-surface/40`, más débil que el `bg-surface/80` de la cápsula
activa) — así que estructuralmente no puede mover la cápsula.

---

## 4. Medidas — Desktop 1440×900

| Propiedad | Valor |
|---|---|
| x inicial del panel | **60px** (`container.page` = 1320, centrado con `px-14` = 56px de padding exterior; a 1440 sin scrollbar el auto-margin cierra los 4px restantes) |
| Ancho total del navbar | **1320px** (`max-w-page`, exacto) |
| Altura | **72px** (`md:h-[70px]` + 1px de borde arriba y abajo) |
| margin-top | **16px** (`md:top-4`) |
| border-radius | **20px** (reusa `--radius-card`, mismo token que tarjetas) |
| Ancho logo | **48×44px** |
| Ancho bloque de navegación | **510px** (x=410) |
| Gap entre links (flex) | **4px** + padding interno de 16px por lado ⇒ **36px** de link-texto a link-texto |
| Ancho CTA "Empecemos →" | **157×48px** |
| Padding horizontal interno | **24px** (`md:px-6`) |
| Gap entre zonas (logo/nav/acciones) | **16px** |

## 5. Medidas — Mobile 390×844

| Propiedad | Valor |
|---|---|
| Ancho navbar | **350px** |
| Margen lateral | **20px** |
| Altura | **66px** |
| Logo | **48×44px** — mismo asset que desktop (ver nota) |
| CTA "Empecemos" (compacto, sin flecha) | **121×44px** |
| Hamburguesa | **44×44px** exacto |
| Gap CTA↔hamburguesa | **12px** |
| Altura del panel abierto | **398px** (47% de 844 / 50% de 360×800) |
| Altura de cada link | **56px** (techo del rango 52–56 pedido) |

**Nota sobre el logo:** el objetivo mobile era 38–44px; el asset real
(`Wordmark size="sm"`, 48×44) da 48px de ancho en los dos breakpoints. Se
decidió **no** generar una segunda variante ni renderizar dos `<Image>`
condicionales solo por 4px de diferencia — el objetivo dice "aproximado" y
la altura (44px) sí cae dentro del rango en ambos casos. Documentado, no
resuelto silenciosamente.

---

## 6. Comportamiento al hacer scroll

Tres estados de superficie, ninguno cambia altura/radio/posición:

| Estado | Fondo | Borde | Blur |
|---|---|---|---|
| Reposo (`scrollY ≤ 32`) | `surface-base/45` | `brand-lift/10` | `backdrop-blur-md` |
| Con scroll (`scrollY > 32`) | `surface-base/85` | `brand-lift/20` | `backdrop-blur-md` |
| Menú móvil abierto | `surface-base/95` | `brand-lift/20` | `backdrop-blur-xl` |

El umbral (32px) está dentro del rango pedido (24–48). Verificado en
navegador: `background-color` computado tras el scroll es
`oklab(... / 0.85)` — dentro de "surface.base con alpha 0.80–0.90" del
punto 6 del sprint.

**Por qué el panel abierto usa 95% y no 85%:** con 85%, el H1 del Hero (u
otro texto en negrita que hubiera detrás en otra página) se transparentaba
— borroso por el `backdrop-blur` — detrás de los links del medio del menú.
Encontrado durante la verificación, corregido antes de este reporte: ver
§11 "Problemas encontrados".

---

## 7. Mobile

**Cerrado:** logo + "Empecemos" (compacto, sin flecha) + hamburguesa. **Sin
los 5 links.** El CTA nunca desaparece, en ningún ancho probado (390 y 360).

**Abierto:** panel full-width bajo la barra — no fullscreen, mismo
contenedor redondeado que la barra (mediante `overflow-hidden` compartido).
5 links a 21px/600, 56px de alto cada uno, con un punto de 6px como
indicador de activo (más liviano que la cápsula de escritorio, tal como
autoriza el punto 23). Debajo, el CTA en contorno (no relleno: la barra de
arriba no desaparece al abrir el panel, así que su naranja sólido sigue
visible — dos rellenos naranja a la vez habrían anulado la jerarquía).

**CONTÁCTANOS vs Empecemos, verificado en las tres superficies (barra
desktop, barra mobile, panel mobile):** ambos coexisten siempre. Nunca se
eliminó uno por "redundante".

---

## 8. Accesibilidad

### Teclado — verificado con Puppeteer real (Tab programático)

```
Desktop 1440:
  Tab 1 → logo (link a /)
  Tab 2 → DOFI
  Tab 3 → FENIAX
  Tab 4 → EL SOCIO
  Tab 5 → CLIENTES
  Tab 6 → CONTÁCTANOS
  Tab 7 → Empecemos
```
Coincide exactamente con el orden pedido en el punto 38.

### Menú móvil — main/footer inertes

Mismo mecanismo ya verificado en el sprint anterior (atributo nativo
`inert`, sin librería de focus trap): mientras el panel está abierto,
`document.querySelector("main")` y `document.querySelector("footer")`
quedan `inert` — fuera del árbol de foco y del árbol de accesibilidad. El
`<header>` queda fuera a propósito: el panel y la hamburguesa siguen
alcanzables.

| Comprobación | Resultado |
|---|---|
| `main.inert` con el panel abierto | ✅ `true` |
| `footer.inert` con el panel abierto | ✅ `true` |
| `document.body.style.overflow` con el panel abierto | ✅ `"hidden"` |
| Escape cierra el panel | ✅ |
| Escape devuelve el foco a la hamburguesa | ✅ `document.activeElement === boton` |
| `main.inert` después de cerrar | ✅ `false` |
| `body.style.overflow` después de cerrar | ✅ `""` (restaurado) |
| El panel se desmonta del DOM tras cerrar | ✅ |

Verificado en los dos anchos móviles probados (390 y 360) con resultado
idéntico.

### Semántica

- `<nav aria-label="Navegación principal">` (dos instancias: escritorio y
  panel móvil, nunca las dos visibles a la vez).
- Los 5 enlaces y el logo son `<Link>` de Next.js con `href` real — **cero**
  `div onClick`.
- `aria-current="page"` (no `"true"` genérico) en el enlace activo — el
  token correcto de WAI-ARIA para "esta es la página actual".
- `aria-expanded` / `aria-controls="menu-principal"` / `aria-label`
  dinámico en la hamburguesa.

---

## 9. Reduced motion

`prefers-reduced-motion: reduce` emulado en Puppeteer:

| Comprobación | Resultado |
|---|---|
| Cápsula activa | `transition: { duration: 0 }` — cambia de link sin animación perceptible |
| Panel móvil al abrir | `opacity: 1` ya en el primer frame verificado (150ms) — prácticamente instantáneo |
| Información oculta | Ninguna — los 5 links y el CTA están completos en ambos casos |

Captura: `mobile-390-reduced-motion.png`.

---

## 10. Performance

- **Cero dependencias nuevas.** `motion/react` (ya instalado) para el
  `layoutId` de la cápsula y el fade del panel; `usePathname` de
  `next/navigation`; Phosphor para los 3 iconos (`List`, `X`, `ArrowRight`).
- Cero imágenes nuevas — el logo es el mismo asset (`logo-dofi-compact.png`)
  que ya usaba el navbar anterior.
- El fondo de la barra (transparente → sólido) sigue siendo una transición
  CSS de `background-color`/`border-color`, no Motion: es un cambio de dos
  colores, no necesita motor de animación.
- `npx tsc --noEmit` limpio. `npm run build:next` limpio, 39 páginas
  generadas (35 anteriores + 4 nuevas).

---

## 11. Problemas encontrados (y resueltos antes de este reporte)

### 1 · Panel móvil trabado en `opacity:0` al animar `height: 0 → "auto"` — **corregido**

Primer intento: animar `opacity` y `height` juntos con Framer Motion
(`initial={{opacity:0, height:0}}`, `animate={{opacity:1, height:"auto"}}`)
para que el panel se sintiera parte de una sola pieza que "se despliega".
Verificado con JS en el navegador: el elemento quedaba permanentemente en
`opacity:0; height:0px`, sin importar cuánto se esperara.

**Diagnóstico:** no es necesario para el objetivo del punto 25 del sprint
("fade sutil; translateY pequeño") y añadía una fuente de fragilidad de
Framer Motion (animar a `"auto"` en alturas dinámicas es un caso conocido
por dar problemas). Se simplificó al patrón que ya funcionaba en el navbar
recuperado del sprint anterior: `opacity` + `translateY(-12→0)`, sin animar
`height` — la caja simplemente ocupa su alto real de inmediato mientras se
desvanece hacia adentro. El radio del contenedor compartido sigue
envolviendo correctamente la pieza completa sin necesitar la animación de
alto.

### 2 · H1 del Hero transparentándose, borroso, detrás del panel móvil — **corregido**

Con el panel al 85% de opacidad (mismo valor que la barra con scroll),
texto en negrita de la página detrás (el H1 del Hero) se veía como un
fantasma borroso tras los links del medio del menú — capturado en la
primera ronda de screenshots, antes de subir la opacidad. Con 95% +
`backdrop-blur-xl` específicos para el estado abierto, desaparece por
completo. Ver §6.

### 3 · Footer.tsx sigue con los enlaces de ancla antiguos — fuera de alcance, documentado

El pie de página (`Servicios · El Socio · Herramientas · Clientes ·
Proceso`, todos `/#ancla`) no se tocó — el punto 30 lo prohíbe
explícitamente. Queda **inconsistente** con la navegación nueva (rutas
reales vs. anclas de una página que ya no existe como tal en el mensaje del
sitio). `PENDIENTE SPRINT PÁGINAS INTERNAS / FOOTER`.

---

## 12. Rutas que todavía no existen (contenido real)

Ninguna de las 4 tiene diseño ni copy definitivo: `/feniax`, `/el-socio`,
`/clientes` (índice — hoy el listado real de cuentas vive en la home,
sección Clientes), `/contactanos` (el formulario real sigue en
`/#contacto`). Cada una es candidata a su propio sprint.

---

## 13. Archivos modificados

### Nuevos
| Archivo | Qué hace |
|---|---|
| `src/components/PaginaEnConstruccion.tsx` | Placeholder compartido por las 4 rutas nuevas |
| `src/app/feniax/page.tsx` | Ruta `/feniax` |
| `src/app/el-socio/page.tsx` | Ruta `/el-socio` |
| `src/app/clientes/page.tsx` | Ruta `/clientes` (índice, coexiste con `/clientes/[slug]`) |
| `src/app/contactanos/page.tsx` | Ruta `/contactanos` |

### Reescrito completo
| Archivo | Cambio |
|---|---|
| `src/components/Nav.tsx` | De navbar de una página (scrollspy sobre anclas) a navbar flotante multipágina (`usePathname`, cápsula animada por `layoutId`) |

### Intactos (punto 30 del sprint)
`Hero.tsx` · `SmartSalesSystem.tsx` · `LogoWall.tsx` · `Clients.tsx` ·
`Services.tsx` · `Process.tsx` · `Manifesto.tsx` · `Tools.tsx` · `Socio.tsx`
· `Contact.tsx` · `Footer.tsx` · `globals.css` · `src/app/page.tsx` ·
infraestructura del Sprint 0.1 completa.

---

## 14. Criterios de aceptación

| Criterio | Estado |
|---|---|
| Flotante, coherente con colores DOFI, sin ruido | ✅ |
| Logo real, sin genérico ni reconstruido | ✅ |
| CTA "Empecemos" único naranja sólido | ✅ |
| Cápsula activa animada, sin rebote | ✅ `type:"tween"`, verificado |
| 5 páginas caben en 1440/1280/1024 sin overflow | ✅ verificado los 3 |
| Hover no mueve la cápsula activa | ✅ por construcción (CSS puro, no toca el `layoutId`) |
| CTA visible en mobile sin abrir menú | ✅ 390 y 360 |
| Hamburguesa ≥44px | ✅ 44×44 exacto |
| Panel cómodo, active visible | ✅ dot + texto `fg-primary` |
| Sin scroll horizontal | ✅ verificado en los 6 viewports |
| `main` inaccesible durante menú abierto | ✅ `inert` verificado |
| Rutas reales, cero dependencias nuevas | ✅ |
| TypeScript / build pasan | ✅ |
| Reduced motion funciona | ✅ |
| No rompe Sprint 0.1 ni otras secciones | ✅ |

---

## 15. Capturas

```
audit/navbar-final-v1/
  desktop-1440-dofi.png
  desktop-1440-feniax.png
  desktop-1440-scrolled.png
  desktop-1280.png
  desktop-1024.png
  tablet-768-closed.png
  tablet-768-open.png
  mobile-390-closed.png
  mobile-390-open.png
  mobile-360-closed.png
  mobile-360-open.png
  mobile-390-reduced-motion.png
```

Todas tomadas con Puppeteer (Chrome real, headless) — el panel embebido de
Claude no compone frames y no sirve para verificar animación ni para
capturas (confirmado: con él, la misma animación se veía "trabada" en
`opacity:0`, y era un falso positivo del entorno, no del código; con
Puppeteer todo animó y se asentó correctamente).

---

*Navbar DOFI V1 sobre `5a8aaf1`. Un componente reescrito, 5 archivos nuevos,
sin dependencias nuevas, sin commit ni deploy.*
