# DOFI — 4 banners full-width — Resultados

Las 4 secciones debajo de las tarjetas del Hero pasaron de ser maquetas de dos columnas
(texto + imágenes + botón) a **un banner de imagen pura a todo el ancho** cada una.
**No se tocó** Header, Hero, tarjetas del Hero, Footer ni otras páginas.

## Antes de tocar nada: respaldo

Este cambio elimina contenido real que ya tenías cargado (títulos, descripciones, textos
y URLs de los CTA). Lo respaldé primero en
[audit/backup-secciones-contenido-2026-09-08.json](backup-secciones-contenido-2026-09-08.json).
Ahí están los 4 títulos y las 4 URLs de CTA por si hacen falta cuando volvamos a agregar
los botones.

## Verificación (medida, no a ojo)

**Desktop 1440px**

| Banner | Ancho | Full-bleed | Alto | Imágenes | Desde Sanity | object-fit | Botones | Texto HTML |
|---|---|---|---|---|---|---|---|---|
| 01 | `[0..1440]` | ✅ | 600px | 1 | ✅ | cover | 0 | *(vacío)* |
| 02 | `[0..1440]` | ✅ | 600px | 1 | ✅ | cover | 0 | *(vacío)* |
| 03 | `[0..1440]` | ✅ | 600px | 1 | ✅ | cover | 0 | *(vacío)* |
| 04 | `[0..1440]` | ✅ | 600px | 1 | ✅ | cover | 0 | *(vacío)* |

**Mobile 390px**: idéntico, `[0..390]`, 380px de alto, 1 imagen, 0 botones.

Los banners empiezan en x=0 y terminan exactamente en el ancho del viewport: **cero
espacio blanco lateral**.

**Sin overflow horizontal** en los 6 anchos: 1440 / 1280 / 1024 / 768 / 390 / 360.

**Hero intacto**: `<h1>` = "Ventas Inteligentes", 4 tarjetas de 213px (el mismo valor de
siempre), 2 CTAs del Hero. Ni un archivo del Hero fue tocado.

**Reduced motion**: los 4 elementos animados quedan en `opacity:1` y `transform:none`.

## Hotspot y crop: probados de verdad

Las imágenes migradas no traían hotspot, así que el `object-position` daba el centro por
defecto — con eso no se puede afirmar que la función sirva. Así que lo probé: puse un
hotspot de `x:0.2, y:0.8` en el banner 01 y el frontend pasó a renderizar
**`object-position: 20% 80%`**. Después lo revertí para dejar tus datos como estaban.

De paso apareció algo útil de saber: el cambio **no se reflejaba** aunque llamara al
webhook de revalidación — la caché de `fetch` de Next seguía sirviendo la respuesta
anterior, y recién se actualizó al reiniciar el servidor. Es la caché de datos de 60s
(el `revalidate: 60` de `sanity.ts`), no un bug: en producción el webhook de Sanity la
invalida, y como piso siempre están esos 60 segundos.

## Sanity

El schema quedó exactamente como pediste — cada banner es solo su imagen:

```
seccionContenido {
  backgroundImage      // image, con hotspot + crop
  backgroundImageAlt   // texto alternativo
}
```

Se eliminaron `titulo`, `descripcion`, `imagen`/`imagenAlt`,
`imagenSecundaria`/`imagenSecundariaAlt`, `ctaTexto` y `ctaEnlace`.

**El nombre del tipo (`seccionContenido`) y del campo del arreglo
(`seccionesContenido`) NO se renombraron**: los 4 items publicados se identifican por
`_type` y `_key`, y renombrarlos los habría dejado huérfanos. Lo que sí cambió son las
etiquetas visibles: en el Studio ahora dice **"Banners"** y **"Imagen de fondo del
banner"**.

**Migración de datos**: `scripts/migrar-banners-sanity.mjs` (con dry-run por defecto)
pasó `imagen` → `backgroundImage` conservando asset, crop y hotspot, y limpió los campos
viejos. Verificado después: los 4 items tienen solo `_key`, `_type`, `backgroundImage`,
`backgroundImageAlt` — **sin campos huérfanos** que el Studio marcaría como desconocidos.

Para el alt preferí tu **título** por sobre el `imagenAlt` que había cargado: los alt
decían "Texto de prueba 3", mientras que los títulos son el mensaje real de la pieza —
que es justo lo que tiene que leer un lector de pantalla. Así tu copy no se pierde:

| Banner | Texto alternativo resultante |
|---|---|
| 01 | Redes Sociales que SI VENDEN |
| 02 | PAUTA INTELIGENTE = VENTAS INTELIGENTES |
| 03 | con RESPUESTAS RÁPIDAS hay CLIENTES FELICES |
| 04 | RESCATANDO EMPRENDEDORES |

**Studio ya desplegado** a `dofi-cms.sanity.studio`.

## Ojo con la proporción de las imágenes actuales

Las 4 comparten la misma imagen y es **cuadrada (1080×1080)**. En un banner de 1440×600
(2.4:1), `object-cover` recorta muchísimo: en desktop se ve una franja horizontal del
medio. **No es un error de la implementación** — es una pieza de otra proporción. En
mobile (390×380, casi cuadrado) se ve bien.

Cuando diseñes los banners definitivos, apuntá a algo cercano a **2.4:1** (por ejemplo
2880×1200) y el recorte deja de ser un problema. Mientras tanto el hotspot te deja
elegir qué franja se conserva.

## Código eliminado (sin dejar nada muerto)

- `src/components/ContentSection.tsx` — borrado; lo reemplaza `ContentBanner.tsx`.
- `--color-canvas-lilac` en `globals.css` — token que solo usaban esas secciones.
- El prop `x` de `<Reveal>` — quedó sin ningún llamador al desaparecer la entrada lateral.
- La paleta por sección (fondos naranja/blanco/morado): ya no hay fondos sólidos, la
  imagen es lo único que se ve, como pide el brief.

## Capturas

- [audit/banners/pagina-completa.png](banners/pagina-completa.png) — Hero + tarjetas + los 4 banners
- [audit/banners/banners-desktop.png](banners/banners-desktop.png)
- [audit/banners/banner-01.png](banners/banner-01.png) … `banner-04.png`
- [audit/banners/banners-mobile.png](banners/banners-mobile.png)

## Archivos modificados

- `src/components/ContentBanner.tsx` — **nuevo**, componente único reutilizable.
- `src/components/ContentSection.tsx` — **borrado**.
- `src/app/page.tsx` — renderiza los 4 `<ContentBanner>`.
- `src/lib/sanity.ts` — tipo, GROQ (`w=2400` para ancho completo), normalizador y respaldo.
- `src/components/Reveal.tsx` — se quitó el prop `x`, ya sin uso.
- `src/app/globals.css` — se quitó el token sin uso.
- `studio/schemaTypes/objects/seccionContenido.ts` — schema del banner.
- `studio/schemaTypes/paginaInicio.ts`, `studio/deskStructure.ts` — etiquetas "Banners".
- `scripts/migrar-banners-sanity.mjs` — **nuevo**, migración de un solo uso.
- `audit/backup-secciones-contenido-2026-09-08.json` — respaldo del contenido anterior.

## Lo que sigue (no lo hice, como pediste)

Los CTA no existen en estas secciones. Vuelven más adelante, cuando definas la
composición final de cada banner.
