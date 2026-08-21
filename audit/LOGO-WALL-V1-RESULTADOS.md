# LOGO WALL / SOCIAL PROOF V1 — RESULTADOS

| | |
|---|---|
| **Fecha** | 20 de agosto de 2026 |
| **Base** | `762945f` + Sprint 0.1 + Hero V1 + Navbar V1 (todo intacto) |
| **Archivos tocados** | **3** — `LogoWall.tsx`, `Nav.tsx` (preflight), `globals.css` |
| **Dependencias instaladas** | **Ninguna** |
| **Estado visual** | 🔴 **BLOCKED BY ASSETS** |
| **Estado técnico** | ✅ Completado |

---

## Resumen

**No existe ni un solo logotipo de cliente en el proyecto.** Cero de 26.

Siguiendo la regla del sprint —*si no tenemos el logo, no lo inventamos*— **no se construyó un muro de logos**. Se implementó la solución temporal del §5: se eliminaron los monogramas, se muestra lo único real y verificable (el nombre de cada empresa), y la arquitectura queda lista para recibir logos sin rediseñar nada.

También se cerró el preflight del navbar: **el foco ya no escapa al Hero** con el menú móvil abierto.

---

## 1. Inventario de logos

### Dónde se buscó

| Ubicación | Resultado |
|---|---|
| `/public` | Solo logos de **DOFI** (`logo-dofi.png`, `-compact`, `-mark`) |
| `/public/clientes` | **No existe** |
| `/public/clients` | **No existe** |
| `/public/logos` | **No existe** |
| `/public/marcas` | Solo software: `kommo.png`, `capcut.png` |
| `/public/media` | 2 portadas de relleno + 1 retrato |
| `clients.ts` | Campo `logo?: string` **declarado — 0 de 26 cuentas lo usan** |
| Sanity (GROQ) | **La consulta ni siquiera pide un logo**: solo `titulo`, `descripcion`, `categoria`, `imagen` |
| Assets importados por componentes | Ninguno |

Formatos buscados: SVG · PNG · WebP · AVIF · URLs remotas desde el CMS.

```
LOGOS REALES ENCONTRADOS:  0 / 26
LISTOS PARA V1:            0
```

### Faltantes — las 26

| Empresa | slug | Logo |
|---|---|:---:|
| Dukare | `dukare` | ❌ |
| Proavic | `proavic` | ❌ |
| SpartaGym | `spartagym` | ❌ |
| Cuenca Tour 360 | `cuenca-tour-360` | ❌ |
| Mi Escondite | `mi-escondite` | ❌ |
| BonDía | `bondia` | ❌ |
| El Horno | `el-horno` | ❌ |
| La Cazona de Zam | `la-cazona-de-zam` | ❌ |
| Taitico | `taitico` | ❌ |
| El Cobayo | `el-cobayo` | ❌ |
| Dar Ceramics | `dar-ceramics` | ❌ |
| Blue 360 | `blue-360` | ❌ |
| Chico Gato | `chico-gato` | ❌ |
| Silvestra | `silvestra` | ❌ |
| Ceviches de la Huayna Capac | `ceviches-huayna-capac` | ❌ |
| Comercial Luna Pazmiño | `comercial-luna-pazmino` | ❌ |
| Baby Dance | `baby-dance` | ❌ |
| Dr. Christian Jetón | `dr-christian-jeton` | ❌ |
| Electro MZ | `electro-mz` | ❌ |
| Tecno MZ | `tecno-mz` | ❌ |
| Hospi Spa | `hospi-spa` | ❌ |
| Casa del Repuesto Japonés | `casa-del-repuesto-japones` | ❌ |
| Cardona Shoes | `cardona-shoes` | ❌ |
| Comercial JyC | `comercial-jyc` | ❌ |
| Importadora GP | `importadora-gp` | ❌ |
| El Carbonazo | `el-carbonazo` | ❌ |

**No se generó, descargó, reconstruyó ni aproximó ningún logotipo.** Ni con IA, ni desde buscadores, ni desde redes, ni con Clearbit, ni usando favicons.

---

## 2. Qué se implementó

Con **0 logos** aplica el tercer caso del §5: *menos de 6 → no construir una marquesina mediocre*.

### Franja de prueba social **en modo texto**

```
┌──────────────────────────────────────────────────────────────────┐
│  Empresas que han confiado en nosotros                           │
│                                                                   │
│   SpartaGym    Cuenca Tour 360    Mi Escondite    BonDía   →     │
└──────────────────────────────────────────────────────────────────┘
```

- **Sin monogramas.** El patrón `name.slice(0, 2)` está eliminado del render — verificado en el HTML servido.
- **Sin cajas, sin círculos, sin tarjetas, sin fondos individuales.**
- Solo el claim y los nombres reales.
- **No finge ser un muro de logos:** es tipografía, y se lee como tipografía.

### Claim

> **Empresas que han confiado en nosotros**

Sustituye a *"Cuentas que confían su marca y su CRM a este equipo"*, que afirmaba que todas contrataron CRM — y eso no está confirmado.

**No se añadió el número.** El sprint lo permitía pero no lo exigía; se prefirió la versión sin cifra. Cuando existan logos y el bloque gane peso visual, merece probarse *"26 empresas han trabajado con DOFI"* (el 26 sale del propio arreglo de datos, no de una afirmación escrita a mano).

### Arquitectura lista para logos reales

El componente **ya pinta logos**: si una cuenta trae `logo`, renderiza la imagen; si no, el nombre. Para activarlos:

```
1. Dejar cada archivo en   /public/clientes/<slug>.svg
   Monocromo, preferiblemente SVG. Si es raster: WebP o AVIF.
2. Añadir  logo: "/clientes/<slug>.svg"  a esa cuenta en clients.ts
```

Sin rediseño, sin tocar el componente.

> **Aviso:** mientras haya mezcla (unas con logo y otras sin él) la franja se verá inconsistente. Cuando llegue el material hay que decidir el umbral a partir del cual se pasa a modo logos y se dejan fuera las cuentas sin archivo. **Esa decisión es del sprint de Casos.**

---

## 3. Medidas `[medido]`

### Escritorio 1440 × 900

```
El Hero termina en           y = 721
La franja empieza en         y = 721      ← sin hueco
Altura total                     150 px    (objetivo 140–180 ✓)
Padding                       40 / 40
Borde superior              border.subtle (brand-lift 15%)
Fondo                       surface.base  ← sin cambio de superficie

Label       x = 60 · 14px · fg-subtle     ← MISMA línea vertical que el H1
Nombres     15px · Sora 600 · fg-muted (8,43:1)
Separación entre nombres     64 px
Nombres reales                 26
Copias para el bucle           26  (aria-hidden)
Ancho de la tira            8 467 px
Duración                        92 s
VELOCIDAD                     46 px/s     (objetivo 35–55 ✓)

Visible en el primer viewport   179 px  ✓
Scroll horizontal del documento  no
```

### Móvil 390 × 844

```
Altura                          129 px    (objetivo 120–160 ✓)
Padding                       32 / 32
Label       x = 20 · 14px
Nombres     14px
Separación                      56 px
Ancho de la tira            7 708 px
Duración                        92 s
VELOCIDAD                     41,9 px/s
Visibles a la vez            ~2,5 nombres
Scroll horizontal del documento  no
```

### 1280 · 768 · 360

| | 1280 | 768 | 360 |
|---|---:|---:|---:|
| Altura | 150 | 150 | 129 |
| Label x | 56 | 40 | 20 |
| Velocidad | 46 px/s | 46 px/s | 41,9 px/s |
| Scroll horizontal | no | no | no |

---

## 4. Velocidad

**46 px/s en escritorio · 41,9 px/s en móvil.** Ambas dentro del rango sobrio (35–55).

La duración **no es un número fijo**: se calcula a partir de cuántas cuentas hay.

```
recorrido = nº de cuentas × 160 px  (ancho medio de un elemento, medido)
duración  = recorrido / 45 px/s
```

Si se añaden o quitan cuentas, la velocidad real se mantiene. La diferencia de 4 px/s entre escritorio y móvil viene de que la tira es más estrecha en pantallas pequeñas (texto y separación menores) con la misma duración: **un 9 % más lenta en móvil, no más rápida**, que es lo que pedía el sprint.

**Movimiento lineal, sin easing, en un solo sentido, una sola fila.**

---

## 5. Transición desde el Hero

```
Hero termina           y = 721
Franja empieza         y = 721        ← sin padding intermedio
Label                  y = 761        ← a 40px del final del Hero
Primer nombre          y = 809
```

En un viewport de 900, **179px de la franja quedan visibles sin hacer scroll**: el usuario ve la propuesta y, sin moverse, ya ve que hay empresas detrás. La separación se resuelve con un **filete de 1px**, no con un cambio de superficie — la auditoría midió que entre `#120A26` y `#1A0F3D` solo hay 1,08:1 y el cambio no se percibe.

Ver `hero-to-proof-desktop.png`.

---

## 6. `prefers-reduced-motion` — verificado

| Comprobación | Resultado |
|---|---|
| Animación | `none` |
| Comportamiento | `overflow-x: auto` — **desplazamiento manual** |
| Empresas visibles | **26 de 26** — no se oculta ninguna |
| Copias del bucle | ocultas (`display: none`) — no se duplica la lista |
| Desplazable | sí |
| Scroll horizontal del documento | no |

El usuario recorre la franja cuando quiere. **No se muestran "solo los primeros cuatro".**

---

## 7. Accesibilidad

| Regla | Estado |
|---|---|
| Estructura semántica | ✅ `<section aria-labelledby>` + `<p id>` + `<ul>/<li>` |
| Claim como etiqueta accesible | ✅ "Empresas que han confiado en nosotros" |
| Copias fuera del árbol | ✅ 26 `<li>` con `aria-hidden="true"` |
| Sin lectura duplicada | ✅ el lector anuncia 26 empresas, no 52 |
| Pausa al pasar el cursor | ✅ `running → paused → running` verificado |
| Pausa al recibir foco | ✅ `:focus-within` (activo cuando los logos sean enlaces) |
| Contraste de los nombres | ✅ `fg-muted` 8,43:1 |
| Contraste del claim | ✅ `fg-subtle` 6,00:1 |
| Movimiento reducido | ✅ ver §6 |
| Fades sin ocultar contenido | ✅ 48–80px, nunca tapan un nombre entero |

**Los logos no son enlaces.** Se decidirá si deben serlo cuando exista la sección Casos; enlazarlos ahora a las páginas actuales sería adelantar esa decisión.

---

## 8. Rendimiento

| Métrica | Valor |
|---|---|
| Imágenes cargadas por el bloque | **0** |
| Peso en imágenes | **0 KB** |
| Peso del HTML del bloque | 10,8 KB sin comprimir |
| **Total del bloque** | **≈ 10,8 KB** (objetivo ≤ 150 KB ✓) |
| CLS aportado | **0** — no hay imágenes que puedan reflowear |
| Dependencias nuevas | 0 |
| JS del bloque | **0** — componente de servidor, animación en CSS |

Cuando lleguen los logos: 26 SVG monocromos deberían pesar **1–3 KB cada uno (≈50 KB en total)**, cómodamente bajo el objetivo. Si llegan como PNG, hay que optimizarlos antes de usarlos.

---

## 9. Preflight del Navbar — verificado

Se aplicó el atributo nativo **`inert`** sobre `<main>` y `<footer>` mientras el panel móvil está abierto.

**Por qué `inert` y no una trampa de foco:** `inert` hace las dos cosas necesarias a la vez — saca el subárbol del orden de tabulación **y** del árbol de accesibilidad. Una trampa de foco solo resolvería el teclado y dejaría el fondo anunciable por el lector de pantalla, que es incoherente con un contenido tapado y con el scroll bloqueado. Sin librerías. El `<header>` queda fuera para que el panel siga siendo alcanzable.

```
MENÚ CERRADO
  main inert = false          footer inert = false
  Tab recorre la página = sí
    logo → Diagnóstico → Abrir menú → Solicitar diagnóstico → Ver cómo funciona → …

MENÚ ABIERTO
  main inert = TRUE           footer inert = TRUE
  Tab escapa al Hero = NO
    Servicios → Sistema → Casos → Nosotros → Solicitar diagnóstico
    → Diagnóstico → logo → Diagnóstico → Cerrar menú   (ciclo cerrado)
  scroll del body = hidden

ESCAPE
  menú cerrado = sí
  foco en la hamburguesa = sí
  main inert = false          footer inert = false
  scroll del body = restaurado

DESPUÉS DE CERRAR
  Tab normal = sí
    Solicitar diagnóstico → Ver cómo funciona → Movilidad → Alimentos
```

**Todos los puntos del §38 pasan.** El panel sigue siendo un panel, no se convirtió en modal a pantalla completa.

---

## 10. Test de 5 segundos

| Pregunta | Respuesta |
|---|---|
| ¿Entiendo qué hace DOFI? | **Sí** — el Hero lo dice |
| ¿Entiendo qué acción tomar? | **Sí** — un solo CTA naranja |
| ¿Veo que existen clientes reales? | **Sí** — 26 nombres desfilando bajo el Hero |
| ¿Los nombres se sienten reales o placeholder? | **Reales** — son nombres de empresa, no cuadrados con dos letras |
| ¿La prueba social compite con el Hero? | **No** — 150px, tipografía apagada, sin naranja |
| ¿La transición invita a continuar? | **Sí** — 179px asoman en el primer viewport |

> Con logos reales esta respuesta sería considerablemente más fuerte. Hoy es honesta y digna; no es todavía impactante.

---

## 11. Criterios de aceptación

### Visual

| Criterio | Estado |
|---|---|
| Sin monogramas placeholder | ✅ eliminados y verificados en el HTML |
| Logos reales | 🔴 **no existen** — ver blocker |
| Ninguna caja individual | ✅ |
| Altura corta | ✅ 150 / 129px |
| Buen aire | ✅ 40/40 y 32/32 |
| Alineación con el Hero | ✅ label en x = 60, igual que el H1 |
| Movimiento sobrio | ✅ una fila, lineal, un sentido |
| Loop sin salto | ✅ tira duplicada, recorrido 0 → −50 % |
| No compite con el CTA | ✅ sin naranja en el bloque |

### Móvil

| Criterio | Estado |
|---|---|
| Sin columna vertical | ✅ sigue siendo franja |
| Sin scroll horizontal del documento | ✅ 390 y 360 |
| Movimiento legible | ✅ 41,9 px/s |
| Movimiento reducido útil | ✅ desplazamiento manual con las 26 |
| Altura razonable | ✅ 129px |

### Accesibilidad · Rendimiento · Preflight

Todos ✅ — ver §7, §8 y §9.

### Técnica

| | |
|---|---|
| TypeScript | ✅ `tsc --noEmit` limpio |
| Build | ✅ 34 páginas |
| Lint | ⚠️ N/A — ESLint no configurado |
| Hero / Navbar / Sprint 0.1 | ✅ intactos |

---

## 12. Capturas

```
audit/logo-wall-v1/
  desktop-1440.png                    la franja en su sitio
  desktop-1440-full.png               página completa
  desktop-1280.png
  tablet-768.png
  mobile-390.png
  mobile-390-full.png
  mobile-360.png
  desktop-1440-reduced-motion.png     desplazamiento manual
  mobile-390-reduced-motion.png
  hero-to-proof-desktop.png           ← la transición
  hero-to-proof-mobile.png            ← la transición
```

---

## 13. Blockers y desviaciones

### 🔴 1 · `BLOCKER — faltan logos reales para el Logo Wall definitivo`

**0 de 26.** Es el único motivo por el que este sprint no entrega un muro de logos. El código está listo; falta el material.

### ⚪ 2 · Hueco heredado entre la franja y Clientes

La sección Clientes conserva su `padding-top` de **192px** (128 en móvil). Entre el final de la franja y el título *"Marcas que ya están en el agua"* quedan esos 192px.

**No se corrigió.** Modificar Clientes está fuera del alcance, y el sprint prohíbe compensarlo inflando la franja. → `PENDIENTE SPRINT CASOS`.

### ⚪ 3 · La franja no entra en el primer viewport en móvil

A 390 el Hero mide 1 019px, así que la franja empieza fuera de pantalla. Es la desviación ya documentada del Hero V1 (H1 de 44 caracteres + lead de 171), no de este bloque. Se resuelve acortando el lead — decisión de copy.

### ⚪ 4 · Sin número en el claim

Se implementó sin cifra. Recomiendo probarlo con *"26 empresas han trabajado con DOFI"* cuando el bloque tenga logos: la marquesina en movimiento no transmite bien **cuántas** son.

---

## 14. Assets que necesitamos pedir

Para desbloquear el Logo Wall definitivo:

| Qué | Formato | Detalle |
|---|---|---|
| **Logotipo de cada cliente** | **SVG** (ideal) · WebP/AVIF | Versión monocroma o que admita recolorearse. Fondo transparente. |
| Autorización de uso | — | Permiso para mostrar la marca del cliente en la web de DOFI |
| Prioridad | — | Con **12 o más** se puede construir el muro completo. Con **6–11**, una V1 más corta. Por debajo de 6, seguimos como ahora. |

**Con qué empezar:** las cuentas de las que hay contexto confirmado — Proavic, Dukare, SpartaGym, Mi Escondite, BonDía, El Horno, Cuenca Tour 360, Taitico, Silvestra, El Carbonazo, Dr. Christian Jetón y Hospi Spa. **Son 12: exactamente el umbral del muro completo.**

---

*Logo Wall V1 sobre `762945f` + Sprint 0.1 + Hero V1 + Navbar V1. 3 archivos tocados, sin dependencias nuevas, sin commit ni deploy.*
