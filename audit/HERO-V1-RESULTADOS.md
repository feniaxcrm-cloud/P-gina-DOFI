# HERO V1 — RESULTADOS
### Primer componente del Design System V1

| | |
|---|---|
| **Fecha** | 20 de agosto de 2026 |
| **Base** | `762945f` + Sprint 0.1 (sin commitear, intacto) |
| **Archivos tocados** | **3** — `globals.css`, `Hero.tsx`, `SmartSalesSystem.tsx` (nuevo) |
| **Dependencias instaladas** | **Ninguna** |
| **Estado** | Sin commit, sin deploy |

---

## Resumen

El hero anterior era una portada: *"Un mar de ideas"*, un delfín de 430px, cero CTA y el contenido ocupando el **36 %** de la pantalla. El nuevo dice qué se vende, con qué se hace, qué resultado persigue y qué hacer a continuación — todo en el primer viewport, todo en HTML real, y todo pintado en el primer frame.

**El grid ganador es 7/5**, y no por gusto: se midió el H1 real en el navegador y el 8/4 resultó frágil (§1).

---

## 1. Grid elegido: **7 / 5**

Se compararon las dos candidatas con el H1 aprobado (*"Convertimos atención en ventas inteligentes."*, 44 caracteres) midiendo el wrapping real en Sora 800 con `tracking -0.02em`. `[medido]`

| Tamaño | **7/5** — columna 760px | **8/4** — columna 872px |
|---:|---|---|
| 72px | 3 líneas · [474, 678, 456] | **2 líneas** · [808, 814] |
| 76px | 3 líneas · [501, **716**, 481] | **2 líneas** · [853, **859**] |
| 78px | 3 líneas · [514, 735, 494] | **3 líneas** ← rompe |
| 80px | 3 líneas · [527, **753**, 507] | 3 líneas |

### Por qué gana 7/5

**1. Estabilidad.** En 760px el titular da **3 líneas en todo el rango 72–80px**. En 872px hay un acantilado entre 76 y 78: a 76px son 2 líneas, a 78px son 3. Un diseño que depende de estar exactamente en 76px no es un diseño, es una coincidencia.

**2. Holgura real.** A 76px la línea más larga del 8/4 mide **859 de 872px — el 98,5 %**. Cualquier variación de renderizado de fuente (otro sistema, la fuente de respaldo mientras carga) la rompe a 3 líneas y cambia la altura del hero. En 7/5, la línea más larga mide 716 de 756: **40px de margen**.

**3. El sistema necesita ancho.** El 7/5 deja **540px** para el Smart Sales System; el 8/4 solo 424px. Con 424px los tres módulos y sus etiquetas se apretaban.

> El 8/4 daba una composición más contundente —dos líneas casi idénticas de 853 y 859px— y estéticamente era la mejor. Se descartó por frágil. Queda anotado: si el copy del H1 cambiara a algo más corto, merece volver a evaluarse.

### Por debajo de `xl`, una sola columna

A 1024px la columna de texto del 7/5 se queda en 531px y el titular se iría a 4 líneas. Por eso el split solo se activa desde `xl` (1280); por debajo, el hero es de una columna y el H1 aprovecha todo el ancho.

### Sin columna vacía

El Design System contemplaba `7 + 1 vacía + 4`. **No se usó.** Con el sistema ocupando 540px, el aire ya lo dan el gutter y los márgenes. Una columna vacía aquí habría sido un gesto sin función — exactamente lo que el sprint pedía evitar.

---

## 2. Medidas finales `[medido en navegador]`

### Escritorio 1440 × 900

```
Viewport                        1440
Margen óptico                     60      (padding 56 + auto-margin 4)
Contenido                       1320      ← exacto, según container.page
Split                7fr / 5fr · gap 24
  Columna de texto               756      x =  60
  Columna del sistema            540      x = 840   fin = 1380 = 60 + 1320 ✓

VERTICAL                          y      alto
  Barra de navegación (fija)      0        68
  padding-top                    68       144
  eyebrow            12px        144        17
  gap (mt-6)                                24
  H1                 76px        185       228   ← 3 líneas [501, 716, 481]
  gap (mt-10)                               40
  lead               18px        453        86   ← 3 líneas, ancho 560
  gap (mt-8)                                32
  CTA                            573        52
  padding-bottom                            96
                          HERO = 721 px
```

| Elemento | Valor |
|---|---|
| **Altura del hero** | **721px** |
| Siguiente sección visible | **179px** en un viewport de 900 |
| H1 | 76px · `leading 1.0` · `tracking -0.02em` · peso 800 · **3 líneas** · ancho 756 |
| Lead | 18px · `leading 1.6` · **3 líneas** · ancho **560** (`container.copy`) |
| CTA primario | **252 × 52** |
| CTA secundario | **228 × 52** · gap 16 |
| Sistema | **540 × 379** · x = 840 |

### Escritorio 1280 × 800

```
Margen 56 · contenido 1168 · texto 667 · sistema 477
H1 68px · 3 líneas [448, 640, 431]
HERO = 697 px
```

### Tablet 768 × 1024

```
Margen 40 · contenido 688 · una sola columna
H1 55,4px · 2 líneas [622, 626]
Sistema a ancho completo (688)
HERO = 958 px
```

### Móvil 390 × 844 y 360 × 800

```
Margen 20 · contenido 350 / 320
H1 44px · 4 líneas [290, 259, 148, 279]
Lead 17px · 5 líneas
CTA 350 × 52 y 320 × 52, apilados, gap 16
Sistema compacto 288px
HERO = 1019 px  (idéntico en 390 y 360)
CTA primario a y = 507 → visible sin scroll ✓
```

---

## 3. Copy

| Elemento | Texto |
|---|---|
| **Eyebrow** | `Marketing · Tecnología · Estrategia` |
| **H1** | `Convertimos atención en ventas inteligentes.` |
| **Lead** | `Unimos estrategia, contenido, Meta Ads, TikTok Ads, producción audiovisual, CRM y automatización para convertir atención en oportunidades comerciales y darles seguimiento.` |
| **CTA primario** | `Solicitar diagnóstico` → `#contacto` |
| **CTA secundario** | `Ver cómo funciona` → `#proceso` |

Copy aprobado, sin modificar.

**Tratamiento del eyebrow:** texto en `fg-subtle` (6,00:1) precedido de **un punto naranja de 6px**. El acento está presente pero no compite: el único bloque de naranja sólido de la composición es el CTA primario. Nada de "Ventas Inteligentes" en naranja dentro del H1 — el titular va entero en `fg-primary`.

**Nota sobre el tracking del eyebrow:** 0,14em desde `sm`, pero **0,10em por debajo**. A 0,14em la línea mide 344px y el contenido de un 360 son 320: se partía en dos. Medido, no supuesto.

---

## 4. Smart Sales System

Tres módulos conectados que representan el recorrido del ecosistema.

| Módulo | Marca | Contenido |
|---|---|---|
| **01 · Atraer** | DOFI | Meta Ads · TikTok Ads · Contenido · Audiovisual |
| **02 · Convertir** | FENIAX | CRM · Automatizaciones · Seguimiento · Pipeline |
| **03 · Escalar** | El Socio | Estrategia · Consultoría · Capacitación |

### Cómo se representa la jerarquía

**No son tres tarjetas iguales.** El módulo 02 ocupa el ancho completo de la columna; los extremos van indentados 48px en direcciones opuestas (01 hacia la izquierda, 03 hacia la derecha). La composición se **estrecha, se ensancha y vuelve a estrecharse**: el peso visual cae donde el marketing se convierte en proceso comercial, que es el argumento del negocio.

El módulo 02 lleva además el borde en acento (`accent/45`) frente a `brand-lift/25` de los otros dos.

**FENIAX no reemplaza a DOFI:** la marca que firma la página sigue siendo DOFI (navegación, pie, favicon, eyebrow). Aquí solo se representa un recorrido, y FENIAX ocupa su tramo central porque es donde está el pivote del modelo.

### Por qué no parece un dashboard comprado

Ni gráficas, ni cifras, ni barras de progreso, ni KPIs. **No hay ni un número inventado.** Es una retícula de tres bloques con etiquetas reales del negocio: se parece a un diagrama de sistema, no a una captura de software.

### Renderizado en servidor

`SmartSalesSystem.tsx` **no lleva `"use client"`**. La animación es perpetua y sin estado, así que vive en CSS y la resuelve el compositor. No hidrata, no entra en el bundle del cliente.

---

## 5. Móvil — qué cambia respecto a escritorio

| | Escritorio | Móvil |
|---|---|---|
| **Composición** | 2 columnas (7/5) | 1 columna |
| **Orden** | Texto y sistema en paralelo | eyebrow → H1 → lead → CTA1 → CTA2 → **sistema** |
| **Módulos** | Escalonados (48px de sangría alterna) | Ancho completo, sin escalonado |
| **Items** | Píldoras con borde | **Línea corrida separada por puntos** |
| **CTAs** | En línea, ancho automático | Apilados, ancho completo |
| **H1** | 76px · 3 líneas | 44px · 4 líneas |
| **Lead** | 18px | 17px |
| **Eyebrow** | tracking 0,14em | tracking 0,10em |

**La acción va antes que la explicación:** el sistema aparece después de los dos CTA, no antes. El CTA primario queda a `y = 507` en un viewport de 844 — **visible sin hacer scroll**.

**Los items son el mismo nodo del DOM**, no dos versiones. Solo cambia la presentación: nada se oculta, nada se duplica. En móvil las píldoras se partían en dos filas y engordaban el hero sin aportar.

---

## 6. Motion

Un único ciclo de **6 segundos** en CSS puro.

| Elemento | Qué hace | Por qué |
|---|---|---|
| Borde del módulo | Se enciende en acento 2s y se apaga | Marca en qué tramo del recorrido estamos |
| Número (01/02/03) | Pasa a acento a la vez que su módulo | Refuerza sin añadir un elemento nuevo |
| Punto del conector | Baja por el tramo justo antes de que se encienda el siguiente | **Explica la dirección**: atraer → convertir → escalar |

**Máximo 2 elementos perceptiblemente animados a la vez** (el módulo activo y, en la transición, el punto que baja). El límite del sistema es 3.

**Lo que NO hay:** partículas, canvas, parallax, flotación perpetua, números animados, movimiento en el H1.

### `prefers-reduced-motion` — verificado

`[medido con emulación de la media feature]`

| Comprobación | Resultado |
|---|---|
| Animaciones activas | `none` en los 8 elementos |
| Módulos visibles | 3 de 3, `opacity: 1` |
| Texto completo | Atraer · Convertir · Escalar presentes |
| Módulo central marcado | Conserva el borde en acento |
| Información perdida | **Ninguna** |

Captura: `audit/hero-v1/desktop-1440-reduced-motion.png`

---

## 7. Accesibilidad

| Regla | Estado |
|---|---|
| El sistema es texto HTML real, no imagen | ✅ `Atraer`, `DOFI`, `Convertir`, `FENIAX`, `Escalar`, `El Socio` |
| Estructura semántica del recorrido | ✅ `<ol>` con `<h3>` por tramo — el lector anuncia el orden |
| Decoración fuera del árbol | ✅ conectores, punto, filetes y viñeta con `aria-hidden` |
| Un solo `<h1>` | ✅ |
| Área táctil de los CTA | ✅ **52px** (mínimo 44) |
| Contraste del H1 | ✅ 17,08:1 |
| Contraste del lead | ✅ 8,43:1 |
| Contraste del eyebrow | ✅ 6,00:1 |
| Contraste del CTA primario | ✅ 6,53:1 |
| Foco visible | ✅ regla global heredada |
| Sin scroll horizontal | ✅ en los 5 viewports |

---

## 8. SEO / GEO `[verificado sobre el HTML servido]`

| Comprobación | Resultado |
|---|---|
| H1 exacto en HTML real | ✅ `Convertimos atención en ventas inteligentes.` |
| Número de `<h1>` | ✅ 1 |
| **`<canvas>` en la página** | ✅ **0** — el canvas del hero anterior desapareció |
| `Meta Ads` en HTML real | ✅ |
| `TikTok Ads` | ✅ |
| `producción audiovisual` | ✅ |
| `CRM` | ✅ |
| `automatización` | ✅ |
| H1 duplicado invisible | ✅ ninguno |
| `display:none` con keywords | ✅ ninguno |

---

## 9. Rendimiento

390 × 844 · 4G lento · CPU ×4 · caché desactivada · mediana de 5 cargas.

| Métrica | Antes *(hero anterior)* | **Hero V1** |
|---|---:|---:|
| FCP | 4 800 ms | 3 584 ms |
| **LCP** | **10 772 ms** | **3 584 ms** |
| **Brecha FCP → LCP** | **5 972 ms** | **0 ms** |
| CLS | 0,000 | **0,0002** |
| TBT | 4 793 ms | 2 139 ms |
| Elemento LCP | `<p>` "DOFI AGENCIA CREATIVA" | **el `<h1>`** |

**`LCP === FCP` en las 5 cargas, sin excepción.** El elemento LCP es ahora el H1 —el contenido más importante de la página— y se pinta en el primer frame.

> Las cifras absolutas son ruidosas: la máquina estuvo bajo carga toda la sesión (el FCP varió entre 2 740 y 3 748 ms sobre el mismo build). El dato que importa es la brecha, que no depende de la carga.

**El objetivo del sprint —que el nuevo hero no reintrodujera el problema del Sprint 0.1— se cumple.** Ni el eyebrow, ni el H1, ni el lead, ni los CTA tienen `opacity` inicial ni `delay`: **0 ocurrencias de `opacity:0` dentro del hero** `[verificado sobre el HTML]`.

El hero además **quitó peso**: desapareció el canvas `OceanCurrent` (26 curvas bezier por frame) y las ~13 letras animadas de `WaveText`.

---

## 10. Prueba de los primeros 5 segundos

| Pregunta | Antes | Ahora |
|---|---|---|
| ¿Entiendo que es marketing? | No | **Sí** — eyebrow + Meta Ads, TikTok Ads, contenido |
| ¿Entiendo que hay tecnología/CRM? | No | **Sí** — el lead lo nombra y el módulo 02 lo muestra |
| ¿Está orientado a resultados comerciales? | No | **Sí** — "ventas inteligentes", "oportunidades comerciales", "seguimiento" |
| ¿Sé qué hacer? | No | **Sí** — "Solicitar diagnóstico", naranja sólido |
| ¿Se entiende "Ventas Inteligentes"? | No aparecía | **Sí** — está en el H1 y el sistema lo explica |
| ¿DOFI es la marca principal? | Sí | **Sí** — logo, eyebrow y módulo 01 |
| ¿FENIAX y El Socio compiten con DOFI? | No aparecían | **No** — son tramos de un recorrido, no marcas rivales |

---

## 11. Criterios de aceptación

### Escritorio

| Criterio | Estado |
|---|---|
| H1 ≤ 3 líneas | ✅ 3 líneas a 1440 y 1280 · 2 a 768 |
| Sin elementos pegados a los bordes | ✅ margen óptico 60px a 1440 |
| Equilibrio texto / visual | ✅ 756 vs 540 |
| El visual no parece un dashboard comprado | ✅ sin gráficas ni cifras |
| El CTA naranja es el foco de color | ✅ único naranja sólido |
| Espacio negativo sin parecer vacío | ✅ contenido = 78 % del hero |
| Se percibe contenido después del hero | ✅ 179px de la sección siguiente |

### Móvil

| Criterio | Estado |
|---|---|
| Sin scroll horizontal | ✅ 390 y 360 |
| H1 legible | ✅ 44px |
| CTA dentro del primer viewport | ✅ y = 507 de 844 |
| Botones ≥ 44px | ✅ 52px |
| Sin canvas | ✅ |
| No son 3 tarjetas reducidas de escritorio | ✅ composición propia |
| El sistema no lo vuelve interminable | 🟡 ver problema 1 |

### Técnica

| Criterio | Estado |
|---|---|
| TypeScript | ✅ `tsc --noEmit` sin errores |
| Build | ✅ 34 páginas |
| Lint | ⚠️ N/A — ESLint no está configurado (igual que en Sprint 0.1) |
| Sin dependencias nuevas | ✅ |
| Contact / Footer intactos | ✅ |
| Sprint 0.1 intacto | ✅ WhatsApp `593984472869`, 0 apariciones del falso, noindex, sitemap 200, robots |
| Resto de secciones intacto | ✅ las 7 con `id` + muro, manifiesto y pie |

---

## 12. Problemas encontrados

### 1 · El hero móvil mide 1019px, no 720–820 🟡

**Es la única desviación real del sprint.** Desglose del contenido a 390px:

| Bloque | Alto |
|---|---:|
| padding superior | 96 |
| eyebrow | 17 |
| H1 · 4 líneas × 44px | 176 |
| lead · 5 líneas × 27px | 136 |
| 2 CTA + gap | 120 |
| sistema compacto | 288 |
| gaps + padding inferior | 186 |
| **Total** | **1019** |

**Por qué no se recortó:** el H1 tiene 44 caracteres y el lead 171. Para que el H1 cupiera en 3 líneas a 390px habría que bajarlo a **36px** — por debajo del mínimo del Design System y en contra de la regla explícita del sprint (*"No reducir tipografía para cumplir un número arbitrario"*). El copy está aprobado y no se toca.

**Lo que sí se hizo** para contenerlo: lead a 17px, items del sistema en línea corrida en vez de píldoras (ahorró ~50px), tracking del eyebrow reducido para que no partiera en dos líneas, y gap del grid ajustado.

**Lo que importa se cumple:** el CTA primario queda visible sin scroll (y = 507 de 844) y no hay scroll horizontal. 1019px es **1,2 viewports**, no una sección interminable.

**Decisión pendiente:** si prefieres bajar de 1000px, la palanca es acortar el lead. Con ~120 caracteres bajaría a 3 líneas y el hero a ~950px. Es una decisión de copy, no de diseño.

### 2 · El hero de escritorio mide 721px, algo por debajo de 740–820 ⚪

No se forzó relleno para alcanzar el rango. **El propósito del rango —que se vea la sección siguiente— se cumple con creces: 179px** frente a los 80–160 que daría el rango. Añadir padding solo para llegar a 740 sería exactamente el vacío sin función que el Design System prohíbe.

### 3 · Dos componentes quedan sin uso ⚪

`WaveText.tsx` y `OceanCurrent.tsx` ya **no los referencia ningún archivo**. También quedan sin uso los `@keyframes` `letter-wave` y `logo-float` de `globals.css`.

**No se borraron:** eliminar archivos que no se pidió eliminar es una decisión tuya. Dilo y los quito en un minuto.

### 4 · La barra de navegación sigue sin CTA en móvil ⚪

Conocido y fuera de alcance. `PENDIENTE SPRINT NAVBAR`.

### 5 · El muro de cuentas sigue debajo del hero con monogramas ⚪

Fuera de alcance. La transición hero → muro funciona, pero el contraste entre superficies sigue siendo imperceptible (1,08:1). Se resuelve en su sprint.

---

## 13. Capturas

```
audit/hero-v1/
  desktop-1440.png                    primer viewport, 1440 × 900
  desktop-1280.png                    primer viewport, 1280 × 800
  tablet-768.png                      primer viewport, 768 × 1024
  mobile-390.png                      primer viewport, 390 × 844
  mobile-360.png                      primer viewport, 360 × 800
  desktop-1440-full.png               página completa
  mobile-390-full.png                 página completa
  desktop-1440-reduced-motion.png     con prefers-reduced-motion
  hero-before-desktop.png             ANTES
  hero-after-desktop.png              DESPUÉS
  hero-before-mobile.png              ANTES
  hero-after-mobile.png               DESPUÉS
```

---

## 14. Tokens añadidos

Al `@theme` de `globals.css`, **conviviendo** con los existentes. No se retiró ninguno legacy ni se migró ningún otro componente.

```
--color-surface-base / -raised / -overlay      (= abyss / deep / surface)
--color-fg-primary / -muted / -subtle / -on-accent   (= foam / mist / mist-dim)
--container-page: 1320px
--container-copy: 560px
--text-h1        clamp(2.75rem, 2rem + 3.05vw, 4rem)     44 → 64
--text-h1-wide   clamp(4.25rem, 0.25rem + 5vw, 4.75rem)  68 → 76
--text-body-lg / --text-eyebrow / --text-button
```

**El H1 sube en dos tramos y no en una sola rampa** porque en `xl` la maqueta pasa de una columna a 7/5 y la columna de texto se estrecha de golpe (1183 → 671px a 1280). Con una rampa continua el mismo titular saltaba de 2 a 4 líneas justo en ese punto. Medido, no estimado.

**La escala de espaciado del Design System no necesitó tokens:** 4·8·12·16·20·24·32·40·48·64·80·96·112·128·160 coincide exactamente con la escala numérica que Tailwind v4 ya genera (`p-1` … `p-40`).

---

*Hero V1 sobre `762945f` + Sprint 0.1. 3 archivos tocados, sin dependencias nuevas, sin commit ni deploy.*
