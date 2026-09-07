# DOFI — Corrección de fondos + contraste + diseño tipográfico — Resultados

Corrige la interpretación del sprint anterior (que había dejado las 4 secciones en
blanco) y recupera el color como identidad, sumándole composición tipográfica real.
**No se tocó** Header, Hero, tarjetas del Hero, glow de las tarjetas, Footer, otras
páginas, ni la estructura de Sanity.

## 1. Fondos recuperados

Verificado leyendo el `background-color` renderizado, no el código:

| Sección | Fondo | Token | Medido |
|---|---|---|---|
| 01 | Naranja DOFI | `bg-accent` | `rgb(244, 123, 32)` |
| 02 | Blanco cálido | `bg-canvas` | `rgb(253, 251, 247)` |
| 03 | Morado DOFI | `bg-brand` | `rgb(75, 42, 147)` |
| 04 | Naranja DOFI | `bg-accent` | `rgb(244, 123, 32)` |

Mismo resultado en mobile (§26) — el color no se pierde en pantallas chicas.
**Ningún color nuevo**: solo tokens que ya existían (§24).

## 2. Contraste — medido, no estimado

Calculé la luminancia relativa (fórmula WCAG) de cada combinación **antes** de
elegirla. Estos números decidieron el diseño:

**Sobre naranja (#F47B20)**
| Color | Ratio | Uso |
|---|---|---|
| `ink` | 6.53:1 | texto base + eyebrow + descripción (al 80%: 4.87:1) |
| `brand` | 3.75:1 | **solo** el destacado del título (texto grande, ≥40px) |
| blanco | 2.73:1 | **descartado** — es exactamente lo que tu §4 prohibía |

**Sobre blanco (#FDFBF7)**
| Color | Ratio | Uso |
|---|---|---|
| `brand` | 9.90:1 | texto base — el "texto morado DOFI" de tu §3 |
| `ink` | 17.22:1 | destacado del título |
| `accent` | 2.64:1 | **no se usa como texto** — el naranja acá es solo línea y subrayado (decorativo, sin requisito de contraste) |

**Sobre morado (#4B2A93)**
| Color | Ratio | Uso |
|---|---|---|
| `foam` | 9.13:1 | texto base |
| `accent-lift` | 4.66:1 | destacado + eyebrow — es el naranja que **sí** pasa sobre morado |
| `accent` | 3.75:1 | descartado para texto chico; `accent-lift` lo reemplaza |
| blanco | 10.24:1 | texto del CTA morado |

**Nota honesta**: el destacado sobre naranja (`brand`, 3.75:1) cumple AA para *texto
grande* (≥24px, o ≥18.7px en negrita) — y ahí siempre mide 40px o más, así que
cumple. No llega a 4.5:1, que es el umbral de texto normal. Por eso ese color **nunca**
se usa en la descripción ni en el eyebrow, que sí son texto chico.

## 3. Títulos como composición, no como texto grande

Lo más importante del sprint. El título ya no es un `<h2>` plano: se descompone en
líneas con palabras destacadas más grandes y en otro color.

**Cómo decide qué destacar, sin inventar contenido ni tocar Sanity:** el énfasis ya
estaba en lo que vos escribiste — usás MAYÚSCULAS para lo que te importa. El código
solo lee esa intención:

1. **"A = B"** → lo que va después del `=` es el resultado, y es lo destacado.
2. **Mezcla de MAYÚSCULAS y minúsculas** → los tramos en mayúsculas son el énfasis.
3. **Sin mezcla** (todo mayúsculas o todo minúsculas) → una sola línea; si es todo
   mayúsculas, el título entero es el énfasis.

Además, un conector de 1–2 palabras no se queda solo en su renglón: se pega como
entrada del tramo destacado que sigue.

Resultado con tu contenido real:

| Sección | Título en Sanity | Cómo se compone |
|---|---|---|
| 01 | Redes Sociales que SI VENDEN | `Redes Sociales que` / **SI VENDEN** |
| 02 | PAUTA INTELIGENTE = VENTAS INTELIGENTES | `PAUTA INTELIGENTE =` / **VENTAS INTELIGENTES** |
| 03 | con RESPUESTAS RÁPIDAS hay CLIENTES FELICES | `con` **RESPUESTAS RÁPIDAS** / `hay` **CLIENTES FELICES** |
| 04 | RESCATANDO EMPRENDEDORES | **RESCATANDO EMPRENDEDORES** (todo énfasis) |

La sección 02 quedó exactamente como pedía tu §6 ("VENTAS INTELIGENTES con mayor peso
visual"), y la 03 como tu §34.

**Convención editorial que te queda disponible**: lo que escribas en MAYÚSCULAS en el
título se destaca solo. No hay que tocar código ni agregar campos para cambiar el
énfasis — se controla desde Sanity, escribiendo.

## 4. Elementos gráficos (§8-9)

- **Eyebrow**: número + línea + punto, los tres en el color que contrasta con ese fondo
  (ink+morado sobre naranja, morado+naranja sobre blanco, naranja sobre morado).
- **Subrayado que se dibuja** bajo la última palabra destacada, una sola vez al entrar
  (§17). Uno solo por sección, no en cada tramo — para no recargar.
- **Aura de fondo**: forma difusa muy suave del lado contrario al texto, para que la
  sección no sea un rectángulo plano de color.
- **Ring + glow en la imagen** adaptados al fondo (§12-13): morado sobre naranja, blanco
  sobre morado.

## 5. Animaciones

| Qué | Cómo | Verificado |
|---|---|---|
| Entrada de texto | opacity 0→1 + translateY 20px→0, una sola vez | ✅ |
| Stagger | eyebrow → cada línea del título (80ms entre sí) → descripción → CTA | ✅ |
| Título línea por línea | cada línea es su propio reveal (§16, nunca letra por letra) | ✅ |
| Subrayado | `scaleX` 0→1 desde la izquierda, al entrar | ✅ |
| Imagen | entra desde su lado (x ±28px), derivado de la misma alternancia | ✅ |
| Hover CTA | fondo `rgb(75,42,147)` → `rgb(109,75,201)`, sube 2px, flecha +4px | ✅ medido |
| Hover imagen | `scale: 1.0199` (≈1.02), 650ms | ✅ medido |

Todo es `transform`/`opacity` (o las propiedades modernas `translate`/`scale` de
Tailwind v4). Nunca width/height/margin/padding/top/left.

## 6. Reduced motion (§29)

Con `prefers-reduced-motion: reduce`, sin hacer scroll: los 27 elementos animados de
las 4 secciones están en `opacity: 1` y `transform: none`. El contenido se muestra
directo, sin animación ni desplazamiento.

## 7. Sanity y CTA — sin cambios

Los 5 campos siguen igual (título, descripción, imagen, texto CTA, URL CTA). Tu
contenido real se lee correctamente en las 4 secciones. La detección interno/externo no
se tocó: las 4 URLs que cargaste son absolutas, así que abren en pestaña nueva con
`rel="noopener noreferrer"` — igual que antes.

El CTA sí cambia de color según el fondo (§18): naranja sobre blanco y morado, **morado
con texto blanco cuando el fondo ya es naranja** — nunca naranja sobre naranja.

## 8. Bug real encontrado y corregido

En la sección 04, **"EMPRENDEDORES" se estaba recortando** en mobile y en 1024px: al ser
un tramo destacado es `inline-block`, y una palabra larga hace crecer esa caja más que
su columna (medido: 374px de palabra en un contenedor de 350px a 390px de viewport, y de
320px a 360px). El `overflow-hidden` de la sección lo ocultaba, por eso el chequeo de
scroll horizontal daba OK — el texto se cortaba en silencio.

Detalle técnico del arreglo: `break-words` (`overflow-wrap: break-word`) **no alcanzó**,
porque no reduce el tamaño intrínseco de un `inline-block` — la caja sigue midiendo la
palabra entera. Hubo que usar `overflow-wrap: anywhere`, que sí lo reduce, más
tipografía fluida (`clamp`) para que el tamaño acompañe el ancho real del viewport y la
partición casi nunca haga falta.

Verificado después del fix: **0 títulos recortados y 0 overflow de página en los 6
anchos** (1440 / 1280 / 1024 / 768 / 390 / 360).

## 9. Verificación final (§37)

| Criterio | Estado |
|---|---|
| Se mantienen los fondos de color | ✅ medido en los 4 |
| No todas las secciones son blancas | ✅ naranja/blanco/morado/naranja |
| Texto con contraste correcto | ✅ calculado por combinación |
| Naranja / morado / blanco DOFI bien usados | ✅ solo tokens existentes |
| Títulos más expresivos | ✅ composición en líneas |
| Palabras importantes destacadas | ✅ derivado del contenido, sin inventar |
| Eyebrows diseñados | ✅ número + línea + punto por tono |
| Elementos gráficos sutiles | ✅ aura, subrayado, ring/glow |
| CTA grandes y centrados | ✅ h-16, `justify-center`, full-width en mobile |
| Hover CTA / imagen | ✅ medido |
| Scroll reveal + stagger + animación tipográfica | ✅ |
| Sin animaciones exageradas | ✅ solo opacity/translate/scale sutiles |
| Mobile correcto | ✅ color, orden y CTA táctil |
| Sin overflow | ✅ 6/6, con un recorte real encontrado y corregido |
| Sanity funcionando | ✅ contenido real |
| Hero intacto | ✅ ningún archivo del Hero tocado |

## Capturas

- [audit/home-sections-v4/full-page.png](home-sections-v4/full-page.png) — el ritmo naranja → blanco → morado → naranja
- [audit/home-sections-v4/section-01.png](home-sections-v4/section-01.png)
- [audit/home-sections-v4/section-02.png](home-sections-v4/section-02.png)
- [audit/home-sections-v4/section-03.png](home-sections-v4/section-03.png)
- [audit/home-sections-v4/section-04.png](home-sections-v4/section-04.png)
- [audit/home-sections-v4/mobile.png](home-sections-v4/mobile.png)

## Archivos modificados

- `src/components/ContentSection.tsx` — paleta por sección (`TONOS`), motor de
  composición tipográfica (`componerTitulo`), eyebrow gráfico, aura, tratamiento de
  imagen por fondo, CTA por tono.
- `src/components/Reveal.tsx` — nuevo export `SubrayadoReveal` (subrayado que se dibuja
  al entrar). El `Reveal` existente no cambió su comportamiento.
