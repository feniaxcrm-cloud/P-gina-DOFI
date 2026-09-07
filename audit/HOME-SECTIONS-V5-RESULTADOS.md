# DOFI — CTA debajo de la imagen con texto — Resultados

Corrección de estructura de las 4 secciones de contenido. **No se tocó** Header, Hero,
tarjetas del Hero, Footer, ni los colores.

## Antes de empezar: dos cosas del brief no coincidían con el código

Las verifiqué y las consulté antes de tocar nada, en vez de asumir:

1. **`imageWithText` / `normalImage` no existían.** Cada sección tenía *una sola*
   imagen y un bloque de texto. Confirmaste que querías **dos imágenes distintas**.
2. **El brief no mostraba el bloque de texto** (número + título + descripción).
   Confirmaste que **lo reemplaza la imagen con texto**.
3. **§11 decía "todas blancas" pero también "no modificar colores"**, y los colores se
   habían restaurado a pedido tuyo en el sprint anterior. Como el brief se titula
   "corrección de layout" y cierra con "NO realizar ningún otro cambio", **no toqué los
   colores** — siguen naranja / blanco / morado / naranja (verificado abajo).

## Estructura nueva

```
[ imagen con texto ]   [ imagen normal ]
[       CTA        ]
```

El CTA vive **dentro de la misma columna** que la imagen con texto. Nunca
`grid-column: 1 / -1`, nunca centrado respecto a toda la sección.

## Sanity

El campo `imagen` **no se renombró** (renombrarlo dejaría huérfano el contenido ya
publicado). Cambió solo su etiqueta en el Studio para que se entienda cuál es cuál:

| Campo | Etiqueta en el Studio | Estado |
|---|---|---|
| `imagen` | **Imagen CON TEXTO (la principal)** | Ya cargada en las 4 |
| `imagenAlt` | Texto alternativo de la imagen con texto | Ya cargado |
| `imagenSecundaria` | **Imagen NORMAL (la de apoyo)** | **Nuevo — falta subir** |
| `imagenSecundariaAlt` | Texto alternativo de la imagen normal | **Nuevo** |
| `ctaTexto` / `ctaEnlace` | Sin cambios | Editables como siempre |
| `titulo` / `descripcion` | Sin cambios | Ya no se pintan (ver abajo) |

`imagenSecundaria` es **opcional** a propósito: si fuera obligatoria, las 4 secciones ya
publicadas quedarían inválidas y el Studio te bloquearía cualquier edición (aunque solo
quieras cambiar un CTA) hasta subir las 4 fotos. Mientras falte, la web muestra un
panel suave en su lugar — nunca un hueco roto.

**Studio ya desplegado** a `dofi-cms.sanity.studio` con el campo nuevo.

## Sobre el título y la descripción

Dejaron de pintarse (el mensaje ahora vive dentro de la imagen con texto), pero **los
campos siguen en Sanity con su contenido intacto** — borrarlos habría sido destructivo.

El `titulo` se conserva como `<h2>` visible **solo para lectores de pantalla y
buscadores** (`sr-only`): la página no puede quedarse sin estructura de encabezados solo
porque el texto pase a ser una imagen. Por eso también conviene que el *texto
alternativo de la imagen con texto* tenga escrito el mensaje que se ve en la pieza.

## Verificación geométrica (medida, no a ojo)

Desktop 1440px — los 4 chequeos de tu §13, sección por sección:

| Sección | Imagen con texto | CTA en su columna | CTA debajo de ella | No abarca 2 columnas | Centrado en su columna | Distancia al centro de la sección |
|---|---|---|---|---|---|---|
| 01 | Izquierda | ✅ | ✅ | ✅ | ✅ | 322px |
| 02 | Derecha | ✅ | ✅ | ✅ | ✅ | 322px |
| 03 | Izquierda | ✅ | ✅ | ✅ | ✅ | 322px |
| 04 | Derecha | ✅ | ✅ | ✅ | ✅ | 322px |

Los **322px de distancia al centro de la sección** son la prueba dura de que el CTA ya
no flota en el medio: si estuviera centrado en toda la sección, ese número sería ~0.

**Alternancia** (§6): 01 izquierda, 02 derecha, 03 izquierda, 04 derecha ✅

**Separación imagen → CTA**: 32px, dentro del rango 24–32px que pediste (§8) ✅

**Mobile 390px** (§7) — orden vertical real medido:

| Sección | Imagen con texto | CTA | Imagen normal | Orden |
|---|---|---|---|---|
| 01 | y=1724 | y=2018 | y=2130 | ✅ |
| 02 | y=2585 | y=2879 | y=2991 | ✅ |
| 03 | y=3446 | y=3740 | y=3852 | ✅ |
| 04 | y=4307 | y=4601 | y=4713 | ✅ |

La imagen no se duplica: el DOM va siempre imagen-con-texto → CTA → imagen-normal, y en
desktop el lado se invierte solo con `lg:order-*` (puramente CSS).

## Lo que no cambió (verificado)

| Qué | Resultado |
|---|---|
| Fondos | `rgb(244,123,32)` / `rgb(253,251,247)` / `rgb(75,42,147)` / `rgb(244,123,32)` — sin cambios |
| Diseño del CTA | Mismo botón: tamaño, radio, flecha, sombra |
| Hover del CTA | fondo `rgb(75,42,147)` → `rgb(109,75,201)`, sube 2px, flecha +4px |
| Animación de entrada | Se conserva: cada imagen entra desde su lado, el CTA aparece después de su imagen |
| Reduced motion | 12 elementos animados, todos en `opacity:1` y `transform:none` |
| Overflow | 0 en los 6 anchos (1440 / 1280 / 1024 / 768 / 390 / 360) |
| CTA editable desde Sanity | Sí, `ctaTexto` y `ctaEnlace` sin cambios |

## Código retirado

Al dejar de pintarse el bloque de texto quedaron sin uso y se eliminaron (recuperables
desde git si el texto vuelve): el motor de composición tipográfica `componerTitulo()`,
los campos de tono de eyebrow/título/descripción, y el componente `SubrayadoReveal`.
Preferí borrarlos a dejar código muerto.

## Lo que falta de tu lado

Subir en Sanity la **Imagen NORMAL** de cada una de las 4 secciones (y su texto
alternativo). Hasta entonces esa columna muestra el panel de respaldo — se ve
intencional, no roto.

## Capturas

- [audit/home-sections-v5/full-page.png](home-sections-v5/full-page.png)
- [audit/home-sections-v5/section-01.png](home-sections-v5/section-01.png) — imagen con texto + CTA a la izquierda
- [audit/home-sections-v5/section-02.png](home-sections-v5/section-02.png) — alternada, a la derecha
- [audit/home-sections-v5/section-03.png](home-sections-v5/section-03.png)
- [audit/home-sections-v5/section-04.png](home-sections-v5/section-04.png)
- [audit/home-sections-v5/mobile.png](home-sections-v5/mobile.png)

## Archivos modificados

- `studio/schemaTypes/objects/seccionContenido.ts` — campos `imagenSecundaria` /
  `imagenSecundariaAlt`; etiquetas aclaradas (nombres de campo sin tocar).
- `src/lib/sanity.ts` — tipo, GROQ, normalizador y respaldo con la segunda imagen.
- `src/components/ContentSection.tsx` — layout de dos imágenes con el CTA en la columna
  de la imagen con texto.
- `src/components/Reveal.tsx` — se quitó `SubrayadoReveal` (sin uso).
