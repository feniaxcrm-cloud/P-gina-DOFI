# NAVBAR V1 — RESULTADOS
### Infraestructura de orientación y conversión

| | |
|---|---|
| **Fecha** | 20 de agosto de 2026 |
| **Base** | `762945f` + Sprint 0.1 + Hero V1 (todo intacto) |
| **Archivos tocados** | **1** — `src/components/Nav.tsx` |
| **Dependencias instaladas** | **Ninguna** |
| **Estado** | Sin commit, sin deploy |

---

## Resumen

Se corrigieron los **ocho** problemas que la auditoría había detectado en la navegación:

| Problema | Solución |
|---|---|
| Sin CTA por debajo de 640px | CTA **siempre visible**, también en 360 |
| CTA del menú indistinguible de los enlaces | Caja propia, filete separador y línea de expectativa |
| Sin estado activo | **Scrollspy** con `IntersectionObserver` |
| Hover roto (`group-hover` sin `group`) | Corregido: filete de 2px que se despliega |
| "Herramientas" en 3.ª posición | **Fuera** de la navegación principal |
| CTA genérico "Iniciar proyecto" | **"Solicitar diagnóstico"**, igual que el Hero |
| `max-width: 1400px` sin alinear con el Hero | `container.page` 1320 — alineación **exacta** |
| Hamburguesa de 40 × 40px | **44 × 44px** |

---

## 1. Arquitectura final

```
┌──────────────────────────────────────────────────────────────────────┐
│  DOFI        Servicios  Sistema  Casos  Nosotros    Solicitar diag. →│
└──────────────────────────────────────────────────────────────────────┘
   x=60         ← centro →                                    right=1380
```

Tres zonas: **marca · navegación · acción**. Sin selector de idioma, sin modo oscuro, sin buscador, sin redes, sin teléfono.

---

## 2. Navegación elegida

| Etiqueta | Destino actual | Destino futuro |
|---|---|---|
| **Servicios** | `#servicios` | definitivo |
| **Sistema** | `#proceso` | → sección *Ventas Inteligentes* |
| **Casos** | `#clientes` | → sección *Casos* |
| **Nosotros** | `#socio` | → sección *Equipo* |

**Cuatro entradas**, ordenadas por valor comercial: *qué hacemos → cómo lo hacemos → a quién se lo hemos hecho → quiénes somos*.

**Eliminados:** "Herramientas" (software de terceros, no es razón de compra) y "Proceso" como etiqueta literal, absorbida por "Sistema" — el cliente compra un sistema, no un procedimiento interno.

**No se inventó ningún ancla.** Los nombres ya son los definitivos; los destinos apuntan a las secciones que existen hoy y se actualizarán cuando se rediseñen.

**CTA:** `Solicitar diagnóstico` → `#contacto`, idéntico al del Hero. **Una sola acción comercial en toda la página.**

---

## 3. Breakpoint de escritorio: **`lg` (1024)**

Se verificó antes de decidir, midiendo el ancho que ocupa la navegación completa:

| Elemento | Ancho |
|---|---:|
| Logo | 48 |
| 4 enlaces | 225 |
| 3 gaps de 32 | 96 |
| CTA | 234 |
| **Total** | **603** |

| Viewport | Contenido útil | Libre |
|---:|---:|---:|
| **1024** | 928 | **325px** |
| 1280 | 1168 | 565px |
| 1440 | 1320 | 717px |

**A 1024 sobran 325px: no hay compresión alguna.** No hizo falta retrasar la navegación hasta `xl` ni inventar un breakpoint intermedio. Se respeta el Design System, que fija `lg` como el punto en que aparece la navegación completa.

---

## 4. Medidas escritorio `[medido]`

### 1440 × 900

```
Altura de la barra                 68 px
Contenedor            x = 60 · w = 1320 · fin = 1380
Logo                  x = 60 · 48 × 44
Navegación            x = 467 · w = 320
  Servicios           x =  467 · 63 × 44
  Sistema             x =  562 · 56 × 44
  Casos               x =  650 · 43 × 44
  Nosotros            x =  724 · 63 × 44
Gaps                  32 · 32 · 32
CTA                   x = 1146 · 234 × 48 · fin = 1380
Scroll horizontal     no
```

### 1280 × 800

```
Altura 68 · contenedor x = 56 · w = 1168 · fin = 1224
Navegación x = 387 · CTA x = 990 · 234 × 48 · fin = 1224
```

### Alineación con el Hero — verificada

| | Navbar | Hero V1 |
|---|---:|---:|
| Borde izquierdo del contenedor | **60** | **60** |
| Borde derecho | **1380** | **1380** |
| Ancho | **1320** | **1320** |

El logo cae exactamente sobre el borde izquierdo del H1, y **el CTA termina exactamente donde termina el Smart Sales System** (x = 840 + 540 = 1380). Las dos piezas pertenecen visiblemente al mismo diseño.

> **Nota:** las secciones aún no migradas (Servicios, Clientes, Proceso…) siguen con el contenedor antiguo de 1400px y arrancan en **x = 52**. Son 8px de desfase respecto a la barra, visibles al comparar. Se resolverá conforme cada sección pase por su sprint; el Design System ya fija el contenedor común.

---

## 5. Medidas móvil `[medido]`

### 390 × 844 y 360 × 800

```
Altura de la barra                 64 px
Contenedor            390: x = 20 · w = 350   ·   360: x = 20 · w = 320
Logo                  48 × 44
CTA "Diagnóstico"     120 × 44
Hamburguesa            44 × 44
Espacios              logo → CTA = 126   ·   CTA → hamburguesa = 12
Scroll horizontal     no (en ambos)

PANEL ABIERTO
Altura del panel      378 px   (45 % de 844)
Altura de cada enlace  56 px
Tipografía            21 px / 600
CTA del panel         350 × 52 (contorno)
```

**Los tres objetivos táctiles superan el mínimo de 44px.** El espacio entre el CTA y la hamburguesa se subió de 8 a 12px: con 8 quedaban demasiado juntos y a 360 sobraban 100px de holgura.

### Texto del CTA móvil

Se eligió la **Opción A: "Diagnóstico"**. A 360px el contenido son 320 y el texto completo dejaba las tres zonas sin aire. Dentro del panel sí aparece completo: *"Solicitar diagnóstico"*.

---

## 6. Estado arriba

```
background:  transparent
border:      transparent
blur:        activo pero sin nada que difuminar
```

La barra desaparece visualmente sobre el hero. Sin caja, sin línea, sin sombra.

---

## 7. Estado con scroll

Se activa a partir de **32px** (rango del sistema: 24–48).

```
background:  surface.base al 85 %
border-bottom: brand-lift al 15 %, 1px
backdrop-filter: blur(12px)
transición:  320 ms · cubic-bezier(0.16, 1, 0.3, 1)
altura:      68 px — sin cambio
```

Moderado a propósito: nada de *glassmorphism*, ni borde blanco, ni blur de 40px, ni sombra de SaaS. **La altura no cambia**, así que la transición no desplaza el contenido.

La transición corre por **CSS**, no por Motion: es un cambio de dos colores y no necesita un motor de animación detrás.

---

## 8. Scrollspy

`IntersectionObserver` nativo, sin librerías ni umbrales de `scrollY` escritos a mano.

```
rootMargin: "-72px 0px -65% 0px"
threshold: 0
Secciones: #servicios · #proceso · #clientes · #socio · #contacto
```

La banda de detección va desde justo debajo de la barra hasta el 35 % de la altura de la ventana: una sección cuenta como activa cuando su contenido cruza el primer tercio de la pantalla, que es donde el ojo está leyendo. Si hay varias en la banda, gana la primera en orden del documento.

`#contacto` se vigila aunque no sea un enlace: al llegar al formulario **ninguna entrada queda marcada**, que es lo correcto.

**Verificado:** al desplazarse a Servicios el activo es `Servicios`; al desplazarse a Clientes, `Casos`. `[medido]`

### Estado activo

| Estado | Color | Indicador |
|---|---|---|
| Inactivo | `fg-muted` (8,43:1) | — |
| Hover | `fg-primary` | filete al 50 % de opacidad |
| **Activo** | `fg-primary` (17,08:1) | **filete de 2px en acento, ancho completo** |

Sin píldora naranja: el naranja sólido sigue perteneciendo al CTA. En el panel móvil el activo se marca con un **punto de 6px** y el texto en `fg-primary`.

**El bug del hover está corregido:** el `<span>` del filete usaba `group-hover` pero el enlace no tenía la clase `group`, así que el efecto estaba escrito y nunca se disparaba.

---

## 9. Menú móvil

**Panel a ancho completo bajo la barra**, no superposición a pantalla completa. Motivo: conserva el contexto de la página detrás, no parece una app y permite ver dónde estaba el usuario.

### Contenido y orden

```
Servicios
Sistema
Casos
Nosotros
─────────────────────────
Solicitar diagnóstico  →      (contorno)
Respondemos en menos de 24 horas hábiles.
```

### Por qué el CTA del panel va en contorno

**La primera versión tenía tres CTA naranjas simultáneos en pantalla:** el de la barra (que no desaparece al abrir el panel), el del panel, y el del Hero detrás. El propio Design System lo prohíbe — *"dos CTA juntos deben verse distintos: uno relleno, otro contorno"* — y el sprint avisaba de no repetir el CTA de forma molesta.

El panel usa ahora **contorno** con la flecha en acento. Sigue siendo claramente distinto de los enlaces (caja, altura, filete separador) y el naranja sólido se reserva para el CTA de la barra.

### Bloqueo de scroll: **sí**

El panel ocupa **378px de 844 — el 45 % de la pantalla**. No es una franja pequeña: dejar el cuerpo desplazándose detrás permitiría navegar por accidente a contenido tapado. Se bloquea `overflow` mientras está abierto y **se restaura el valor previo** (el `body` ya lleva `overflow-x: clip`).

**Verificado:** `hidden` con el panel abierto, `clip visible` tras cerrar — tanto con Escape como al pulsar un enlace. `[medido]`

### Cierre al pasar a escritorio

Un `matchMedia("(min-width: 1024px)")` cierra el panel al ensanchar. Sin él, al girar el móvil el panel se ocultaría por CSS pero el estado seguiría abierto y **el scroll bloqueado**.

---

## 10. Accesibilidad

### Teclado — verificado `[medido]`

**Escritorio 1440:**
```
tab 1 → logo        tab 4 → Casos
tab 2 → Servicios   tab 5 → Nosotros
tab 3 → Sistema     tab 6 → CTA
```

**Móvil 390 cerrado:**
```
tab 1 → logo   tab 2 → Diagnóstico   tab 3 → Abrir menú
```

**Móvil 390 con el panel abierto:**
```
tab 1–4 → los cuatro enlaces   tab 5 → CTA del panel
```

**Escape:** cierra el panel y **devuelve el foco a la hamburguesa** ✓

Los tres órdenes coinciden exactamente con lo que pedía el sprint.

### Resto

| Regla | Estado |
|---|---|
| `aria-expanded` en la hamburguesa | ✅ alterna `false`/`true` |
| `aria-controls="menu-principal"` | ✅ |
| `aria-label` "Abrir menú" / "Cerrar menú" | ✅ alterna |
| `aria-current="true"` en el enlace activo | ✅ |
| `<nav aria-label="Navegación principal">` | ✅ |
| Escape cierra | ✅ |
| Pulsar fuera cierra | ✅ |
| Cierra al seleccionar un enlace | ✅ |
| Foco visible | ✅ contorno global de 2px en acento |
| Objetivos táctiles ≥ 44px | ✅ los cuatro tipos |
| Enlaces reales `<a href="#…">` | ✅ ninguno sustituido por botón |
| Decoración fuera del árbol | ✅ filetes y puntos con `aria-hidden` |
| Sin scroll horizontal | ✅ en los 5 viewports |

**Sin *focus trap*:** no es una superposición a pantalla completa, y el sprint solo lo exige en ese caso. Con el panel abierto, seguir tabulando lleva al contenido del Hero — que está detrás y con el scroll bloqueado. Es una limitación conocida del patrón de panel; ver desviación 2.

---

## 11. Motion

| Elemento | Duración | Curva |
|---|---:|---|
| Fondo de la barra | 320 ms | `ease.standard` |
| Color del enlace | 200 ms | `ease.standard` |
| Filete del indicador | 300 ms | `ease.standard` |
| Panel (fade + translateY −12) | 320 ms | `ease.standard` |

**Lo que no hay:** escala, salto vertical, glow, cursor magnético en la navegación, ni secuenciado de los enlaces uno a uno.

### `prefers-reduced-motion` — verificado `[medido]`

| Comprobación | Resultado |
|---|---|
| Panel a los 250 ms | presente, `opacity: 1`, `transform: none` |
| Los 4 enlaces | presentes |
| CTA del panel | presente |
| `scroll-behavior` del `html` | `auto` |

**El panel aparece instantáneamente y no se pierde ninguna información.**

---

## 12. Rendimiento

| | |
|---|---|
| Dependencias nuevas | **0** |
| Scrollspy | `IntersectionObserver` nativo |
| Fondo de la barra | CSS puro, sin Motion |
| Motion | solo el panel (`AnimatePresence`, ya en el proyecto) |
| Imágenes nuevas | ninguna |
| Listener de scroll | uno, `{ passive: true }` |

### Peso del logo — documentado, no resuelto

El logo sigue siendo `logo-dofi-compact.png`: **162 KB para renderizarse a 48 × 44px.** No es un problema del navbar sino del optimizador de imágenes, que en Cloudflare devuelve el PNG original sin redimensionar (`?w=48` → 162 KB, `Content-Type: image/png`).

**No existe un asset alternativo trivial:** en `/public` solo hay PNG (`logo-dofi.png` 254 KB, `logo-dofi-mark.png` 93 KB). **Haría falta un SVG del logo o arreglar el optimizador** — ambas cosas fuera del alcance de este sprint. Queda documentado como estaba en la auditoría (`PERF-019`).

---

## 13. Test de 5 segundos del navbar

| Pregunta | Respuesta |
|---|---|
| ¿Sé qué secciones importantes existen? | **Sí** — cuatro, nombradas por valor comercial |
| ¿Sé qué acción principal puedo tomar? | **Sí** — un solo botón naranja |
| ¿DOFI sigue siendo la marca principal? | **Sí** — logo a la izquierda, sin competencia |
| ¿Hay demasiadas opciones? | **No** — cuatro (antes cinco, con una irrelevante) |
| ¿Compite con el Hero? | **No** — transparente arriba |
| ¿En móvil puedo convertir sin abrir el menú? | **Sí** — CTA siempre visible, también en 360 |

---

## 14. Criterios de aceptación

### Escritorio

| Criterio | Estado |
|---|---|
| No roba protagonismo | ✅ transparente arriba |
| Máximo 4 enlaces | ✅ exactamente 4 |
| CTA visible | ✅ 234 × 48 |
| Existe estado activo | ✅ scrollspy verificado |
| El contenedor alinea con el Hero | ✅ x = 60 · fin = 1380, idéntico |
| Transición suave al hacer scroll | ✅ 320 ms, sin cambio de altura |
| Sin hover roto | ✅ corregido |

### Móvil

| Criterio | Estado |
|---|---|
| CTA visible sin abrir el menú | ✅ 120 × 44 |
| Hamburguesa ≥ 44px | ✅ 44 × 44 |
| CTA ≥ 44px | ✅ 44 de alto |
| Menú cómodo | ✅ enlaces de 56px, 21px de tipografía |
| Enlaces ≥ 44px | ✅ 56px |
| Escape funciona | ✅ + devuelve el foco |
| El foco funciona | ✅ orden verificado |
| Sin scroll horizontal | ✅ 390 y 360 |
| No tapa contenido por accidente | ✅ scroll bloqueado |

### Técnica

| Criterio | Estado |
|---|---|
| Enlaces reales | ✅ |
| Sin dependencias | ✅ |
| TypeScript | ✅ `tsc --noEmit` limpio |
| Build | ✅ 34 páginas |
| Lint | ⚠️ N/A — ESLint no configurado |
| No rompe el Hero | ✅ intacto |
| No rompe el Sprint 0.1 | ✅ WhatsApp, noindex, sitemap y formulario intactos |

---

## 15. Capturas

```
audit/navbar-v1/
  desktop-1440-top.png                 transparente sobre el hero
  desktop-1440-scrolled.png            sólido + "Servicios" activo
  desktop-1280-top.png
  desktop-1280-scrolled.png
  tablet-768-closed.png                CTA completo + hamburguesa
  tablet-768-open.png
  mobile-390-closed.png                logo + Diagnóstico + hamburguesa
  mobile-390-open.png                  panel desplegado
  mobile-390-scrolled.png              barra sólida sobre contenido
  mobile-360-closed.png
  mobile-360-open.png
  mobile-390-open-reduced-motion.png   panel con movimiento reducido
```

---

## 16. Problemas y desviaciones

### 1 · Las secciones sin migrar arrancan 8px a la izquierda de la barra ⚪

El navbar y el Hero comparten `container.page` (x = 60). Las secciones que aún no han pasado por su sprint siguen con el contenedor de 1400px y arrancan en **x = 52**. Visible al comparar la barra con "Lo que hacemos".

**No se corrigió:** migrar el contenedor de las demás secciones está fuera del alcance y tocaría 8 componentes. Se resolverá conforme cada sección pase por su sprint.

### 2 · Sin *focus trap* en el panel ⚪

Con el panel abierto, seguir tabulando después del CTA lleva a los elementos del Hero, que están detrás con el scroll bloqueado.

**No se implementó** porque el sprint solo lo exige para superposiciones a pantalla completa, y el patrón elegido es un panel corto. Si más adelante se decide que el panel debe comportarse como diálogo modal, hace falta añadir `role="dialog"`, `aria-modal` y trampa de foco. Es una decisión de patrón, no un olvido.

### 3 · El logo sigue pesando 162 KB ⚪

Documentado en §12. No hay solución trivial dentro de este sprint.

### 4 · El CTA del panel cambió a contorno 🟡

**Es la única desviación respecto a la lectura literal del sprint.** La estructura pedida (§23) situaba el CTA al final del menú, y así está — pero en contorno en vez de relleno, porque el CTA naranja de la barra **no desaparece al abrir el panel** y quedaban tres naranjas a la vez en pantalla.

Se siguió la regla del Design System (*"dos CTA juntos deben verse distintos"*) sobre la lectura literal. **Si prefieres el relleno, es un cambio de una línea.**

### 5 · `WaveText.tsx` y `OceanCurrent.tsx` siguen sin uso ⚪

Tal como pedía el sprint (§45), **no se eliminaron**. Quedan para la limpieza general posterior.

---

*Navbar V1 sobre `762945f` + Sprint 0.1 + Hero V1. Un archivo tocado, sin dependencias nuevas, sin commit ni deploy.*
