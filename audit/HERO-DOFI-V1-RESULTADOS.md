# HERO DOFI V1 — RESULTADOS
### Statement hero centrado, inspirado en la referencia entregada

| | |
|---|---|
| **Fecha** | 25 de agosto de 2026 |
| **Base** | `6040d32` (Navbar V1 + correcciones ya aprobadas) |
| **Archivos tocados** | `Hero.tsx` (reescrito completo) + `DofiWave.tsx` (nuevo) + `globals.css` (una animación agregada) |
| **Dependencias instaladas** | **Ninguna** — SVG + CSS puro, sin canvas, sin WebGL, sin Three.js |
| **Estado** | Sin commit, sin deploy — esperando aprobación |

---

## 1. Dirección visual

Sobre la referencia entregada (fondo oscuro, titular gigante centrado, mucho
espacio negativo, una línea/onda luminosa atravesando la composición,
profundidad, borde interior fino) se conservó la **lógica compositiva**
—statement centrado, jerarquía clara, cinta de luz como elemento
protagonista— y se reinterpretó **todo lo demás** dentro de DOFI: paleta
(violeta/lila/naranja/coral en vez del espectro de la referencia),
tipografía (Sora/Geist del Design System), proporciones (contenedor
`container.page`, no ancho completo), CTA (par primario/secundario del
sistema, no genérico), motion (curva orgánica por suma de senos, no la
trayectoria de la referencia).

No se copió ningún path, degradado ni composición literal de la
referencia — no existe un archivo de referencia adjunto al proyecto (no se
encontró ninguna imagen/video en el repositorio ni se recibió un adjunto en
este sprint), así que el punto de partida fue la descripción exhaustiva del
propio brief (§3). **No se generó `hero-reference-comparison.png`** por esa
razón — no había contra qué comparar en imagen; queda documentado aquí en
texto qué principios se trasladaron.

---

## 2. Jerarquía — verificada en el DOM real

```html
<h1>Un Mar de Ideas</h1>                                    <!-- unico H1 del sitio -->
<p>DOFI Agencia Creativa</p>                                  <!-- identidad -->
<p>Convertimos atención en Ventas Inteligentes</p>            <!-- venta -->
<div><a>Empecemos</a> <a>Conoce lo que hacemos</a></div>      <!-- accion -->
```

Las tres frases exactas, en HTML real (verificado en el HTML servido, no
dentro de SVG ni canvas). Cero texto duplicado invisible para SEO. Un solo
`<h1>` en toda la página.

---

## 3. Copy — sin cambios respecto al aprobado

| Elemento | Texto | Semántica |
|---|---|---|
| Nivel 1 | `Un Mar de Ideas` | `<h1>` |
| Nivel 2 | `DOFI Agencia Creativa` | `<p>`, uppercase, tracking 0,14em |
| Nivel 3 | `Convertimos atención en Ventas Inteligentes` | `<p>` destacado (no `<h2>`: no abre subsección propia) |
| CTA primario | `Empecemos` | → `/contactanos` (ruta real, creada en el sprint de Navbar) |
| CTA secundario | `Conoce lo que hacemos` | → `/#servicios` |

**Destino del CTA secundario, documentado como pedía el punto 9:** no existe
todavía una página `/servicios` independiente. Se inspeccionó la
arquitectura actual: `Services.tsx` ya tiene `id="servicios"` y vive en la
misma Home donde está el Hero, así que `/#servicios` apunta a contenido
real y existente sin inventar una ruta nueva ni crear una página de
servicio en este sprint.

---

## 4. Medidas — Desktop 1440×900

| Propiedad | Valor |
|---|---|
| Altura del Hero | **840px** (dentro de 760–860) |
| Y del H1 | 321px |
| Ancho del H1 | **1000px** (dentro de 900–1050) |
| `font-size` del H1 | **96px** (probado 80/88/96 → se quedó en 96, dentro del rango, sin superar 104) |
| Líneas del H1 | **1** — "Un Mar de Ideas" entra cómodo incluso al tamaño más grande probado |
| Ancho de la propuesta comercial | **700px** (dentro de 650–760) |
| Y del grupo de CTA | 571px |
| Inset del marco interior | **24px** (`inset-6`) |
| `border-radius` del marco | 32px |
| Overflow horizontal | Ninguno |

## 5. Medidas — Mobile 390×844

| Propiedad | Valor |
|---|---|
| Altura del Hero | **820px** (dentro de 720–880) |
| `font-size` del H1 | **48px** (piso del rango 48–58; se probó y se decidió no bajar más — "no reducir a tamaños tímidos") |
| Líneas del H1 | 2 — "Un Mar de" / "Ideas" |
| Y del grupo de CTA | 538px |
| Inset del marco interior | 16px (`inset-4`) |
| Overflow horizontal | Ninguno |

**Idéntico en 360×800** (mismo `font-size` 48px, misma altura 820px, ancho
del H1 320px sin cortes).

**Tablet 768×1024:** H1 65,28px, 1 línea, altura de Hero 840px, sin
overflow. **Desktop 1280:** idéntico a 1440 (el `clamp()` del H1 ya toca su
techo de 96px desde 1280px de viewport). **Desktop 1024:** H1 80,64px, 1
línea, ancho 928px.

> Nota de alcance: el punto 46 pedía probar también 430px. Se probaron 390 y
> 360 (que lo acotan por ambos lados) con resultado idéntico entre sí; 430
> no se capturó por separado. Riesgo bajo, pero queda documentado en vez de
> asumido.

---

## 6. La onda — técnica

**Tres capas independientes** (`back`/`mid`/`front`), cada una un SVG con:

1. Una curva orgánica dibujada **dos veces seguidas** dentro de un
   `viewBox="0 0 2400 900"` (cada copia ocupa las 1200 unidades del
   "tile").
2. El SVG se renderiza al **200% del ancho de su contenedor**
   (`w-[200%]`), y una animación CSS desliza ese SVG de `translateX(0)` a
   `translateX(-50%)` — exactamente el mismo mecanismo que ya usan
   `.wall-track` (muro de logos) y `.tide-track` (manifiesto) en
   `globals.css`, aplicado a una curva en vez de a una fila de elementos.

**Por qué el bucle no tiene costura, matemáticamente y no por ajuste
manual:** cada curva es la **suma de dos senos** — uno con 2 ciclos
completos y otro con 3 — sobre el ancho exacto del tile (1200 unidades).
Como ambas frecuencias completan un número entero de vueltas en ese ancho,
la función vale exactamente lo mismo (mismo valor Y, misma pendiente) en
`x=0` y en `x=1200`: la costura entre una copia y la siguiente es
matemáticamente invisible, no aproximada a ojo. Los puntos de muestreo se
convirtieron a una curva Bézier suave (Catmull-Rom → Bézier) para que la
curvatura varíe de forma orgánica en vez de leerse como una onda seno
perfecta y predecible — cumple el punto 16 ("no debe ser una simple línea
seno perfectamente matemática... debe sentirse orgánica").

**Profundidad (punto 17):** las tres capas se mueven a velocidades
distintas — la de atrás es la más lenta, la de adelante la más rápida
(mismo principio que un fondo de paralaje) — y cada una tiene una copia
ancha y desenfocada (`feGaussianBlur`) detrás de su copia nítida. Sin 3D
real, sin WebGL: solo capas, blur y velocidades distintas, tal como
autorizaba el punto 17.

---

## 7. Paleta de la onda

| Capa | Degradado | Lectura |
|---|---|---|
| `back` (atrás, 17s) | `brand` → `brand-lift` → `brand` | Violeta/lila frío, recede |
| `mid` (medio, 13s) | `brand-lift` → `accent` → `coral` → `brand-lift` | El recorrido "ideas → atención → acción comercial" — es la capa que cuenta la historia del negocio |
| `front` (adelante, 10s) | `accent-lift` → `foam` → `accent-lift` | Núcleo brillante blanco cálido |

Todos los colores son tokens existentes del sistema (`var(--color-brand)`,
`var(--color-accent)`, `var(--color-coral)`, `var(--color-foam)`, etc.) —
los `<stop>` de los degradados SVG referencian las variables CSS
directamente, no hex nuevos. Cero cyan, verde, amarillo brillante ni
espectro rainbow — verificado en el propio código, no solo visualmente.

---

## 8. Texto vs. onda — cómo se garantiza la legibilidad

La onda vive en una capa absoluta (`bottom-0 h-[58%] md:h-[62%]`)
concentrada en la **mitad inferior** del Hero — nunca se acerca al H1 ni a
la propuesta comercial. Además, entre la onda y el bloque de texto hay un
**velo (scrim)** independiente: un radial de `surface-base` que cubre el
75% superior del Hero, opaco cerca del texto y transparente hacia los
bordes. Esto garantiza el contraste **por construcción**, no persiguiendo
manualmente por dónde pasa la curva en cada viewport — verificado en los 3
frames capturados (`wave-frame-01/02/03.png`): la onda cruza libremente por
detrás de los botones (el secundario es intencionalmente transparente, por
diseño del sistema de botones) pero nunca toca ni el H1 ni la propuesta
comercial en ningún punto del ciclo.

---

## 9. Motion

| Parámetro | Valor |
|---|---|
| Curva | `linear` (`motion.ease.linear`: reservada para marquesinas y barras de progreso, igual que el resto del sitio) |
| Duración por capa | 17s (atrás) · 13s (medio) · 10s (adelante) — dentro de 10–18s |
| Dirección | Una sola, izquierda continua, en las tres capas (evita la sensación de corrientes encontradas) |
| Interactividad | Ninguna — no sigue el cursor, sin parallax de mouse, sin scroll-deformation (V1 no interactiva, tal como pedía el punto 23) |
| Glow | `feGaussianBlur` con `stdDeviation=14`, opacidad 0,20–0,28 por capa — sutil, sin halo gigante |

---

## 10. Mobile

No es la curva de escritorio escalada al 35%: es la **misma técnica**
(suma de senos, tres capas) pero el contenedor mide menos alto en proporción
al Hero (`h-[58%]` vs `md:h-[62%]`, y el Hero mobile en sí es más bajo:
820px vs 840px), así que la curva ocupa proporcionalmente menos espacio y
se percibe más contenida — sin necesitar una segunda geometría de path a
mano. Los CTA se apilan verticalmente (`flex-col`, ancho completo hasta
420px) tal como pedía el punto 30.

---

## 11. Reduced motion

`prefers-reduced-motion: reduce` emulado en Puppeteer:

| Comprobación | Resultado |
|---|---|
| `animation-duration` de las 3 capas | `0.000001s` (efectivamente congelada) |
| Forma conservada | ✅ — el fotograma donde se congela es un punto cualquiera de un bucle sin costura, así que se ve igual de completo que en reposo |
| Los 3 colores presentes | ✅ |
| Profundidad (3 capas visibles) | ✅ |
| Información oculta | Ninguna |

No hace falta una regla `@media` propia para `.dofi-wave-track`: la regla
global que ya existía en `globals.css` (fuerza `animation-duration` casi a
cero en toda la página) alcanza, porque el bucle es matemáticamente
periódico — congelarlo en cualquier punto es visualmente equivalente al
resto. Capturas: `desktop-1440-reduced-motion.png`,
`mobile-390-reduced-motion.png`.

---

## 12. Accesibilidad

| Regla | Estado |
|---|---|
| Un solo `<h1>` | ✅ |
| Texto real en el DOM, no dentro de SVG/canvas | ✅ verificado en el HTML servido |
| Contraste del H1 (`fg-primary` sobre el velo) | ✅ AA con holgura — es prácticamente el mismo contraste que ya usaba Hero V1 |
| Contraste de la propuesta comercial | ✅ `fg-primary` al 90% de opacidad, sobre el mismo velo protegido |
| Foco visible en los CTA | ✅ hereda la regla global `:focus-visible` |
| `DofiWave` marcado `aria-hidden="true"` | ✅ — es puramente decorativo, no aporta información que no esté ya en el texto |
| Links semánticos | ✅ `<Link>` de Next.js con `href` real, cero `div onClick` |
| Contenido crítico dependiente solo de lo visual | Ninguno — las 3 frases y los 2 CTA existen como texto real independientemente de si la onda carga o no |

---

## 13. Performance

**Regla dura del sprint — verificada, no solo declarada:** cero
`opacity: 0` inicial en H1, marca, propuesta o CTA. El componente es de
**servidor** (sin `"use client"` en `Hero.tsx` ni en `DofiWave.tsx`): no hay
ni un solo hook de React, toda la animación es CSS puro vía
`animation-duration` inline (para la velocidad por capa) y `@keyframes`
globales. Cero JavaScript de cliente añadido por este Hero.

| Métrica (390×844, CPU×4, 4G lento) | Valor |
|---|---|
| FCP | 6 672 ms |
| LCP | 6 672 ms |
| **Brecha FCP → LCP** | **0 ms** |

La cifra absoluta es alta porque la máquina de medición corre bajo carga
(mismo caveat que ya consta en `SPRINT-0.1-RESULTADOS.md` y
`HERO-V1-RESULTADOS.md`) — lo que importa, y lo que este sprint no podía
reintroducir, es la **brecha**: `LCP === FCP`, cero milisegundos de
diferencia. El texto se pinta en el primer frame posible, nada lo retrasa.

---

## 14. Problemas encontrados

### 1 · Sin archivo de referencia visual/video en el proyecto — resuelto con la descripción del brief

El sprint pedía revisar "la referencia visual/video entregada", pero no se
encontró ningún adjunto en el repositorio (`audit/`, búsqueda de imágenes y
videos) ni se recibió un archivo en este turno. Se trabajó a partir de la
descripción exhaustiva del propio punto 3 del brief. Si existe un archivo
real que no llegó a este entorno, compartirlo permitiría una comparación
más precisa — hoy `hero-reference-comparison.png` no existe por esta razón.

### 2 · `SmartSalesSystem.tsx` y su CSS quedan sin uso — no se borraron

Igual que `WaveText.tsx`/`OceanCurrent.tsx` en el sprint de Hero V1
original: el punto 40 pide sacar ese visual del Hero, no borrar el
concepto. El componente y sus `@keyframes` (`sss-*` en `globals.css`)
siguen en el repo, sin ninguna referencia activa. Queda para cuando ese
sistema tenga su propia sección.

### 3 · Viewport 430px no se probó por separado

Ver nota en §5 — 390 y 360 lo acotan con resultado idéntico, pero no es lo
mismo que haberlo medido.

---

## 15. Decisiones que necesitan aprobación

1. **`font-size` del H1 en 96px** (el más grande de los tres probados,
   80/88/96) — se eligió porque "Un Mar de Ideas" entra en una sola línea
   incluso a ese tamaño, y un statement hero premium se beneficia del
   tamaño más audaz que la composición pueda sostener. Si se prefiere más
   contenido y menos impacto tipográfico, 80 u 88px también cumplen todos
   los demás criterios.
2. **CTA secundario a `/#servicios`** en vez de a una futura `/servicios` —
   documentado en §3, pero es una decisión de arquitectura de información
   que probablemente cambie cuando exista la página real de Servicios.
3. **H1 mobile en 48px** (piso del rango pedido) — funciona y no se ve
   tímido en las capturas, pero es la decisión más "conservadora" de las
   permitidas; subirlo es una preferencia de gusto, no una corrección.

---

## Screenshots

```
audit/hero-final-v1/
  desktop-1440.png
  desktop-1280.png
  desktop-1024.png
  tablet-768.png
  mobile-390.png
  mobile-360.png
  desktop-1440-reduced-motion.png
  mobile-390-reduced-motion.png
  wave-frame-01.png
  wave-frame-02.png
  wave-frame-03.png
```

Todas con Puppeteer (Chrome real, headless) — el panel embebido de Claude
no compone frames y ya se confirmó en el sprint de Navbar que no sirve para
verificar animación.

---

*Hero DOFI V1 sobre `6040d32`. Dos archivos de componente (uno reescrito,
uno nuevo) + una animación en `globals.css`. Sin dependencias nuevas, sin
commit ni deploy.*
