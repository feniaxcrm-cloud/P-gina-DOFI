# DOFI — Página Marketing Digital — Resultados

`/marketing-digital` deja de ser una página "en construcción" y pasa a ser una narrativa de
7 banners: **Historia → Confianza → Método → Resultados → Conversión**. Todo es editable
desde Sanity (menú **Marketing Digital**, una pestaña por banner).

## Lo que no llegó, y cómo quedó resuelto

- **Las imágenes no se adjuntaron.** Ni las piezas terminadas de los banners 2, 3 y 4, ni las
  fotos de Daniel (banners 1 y 7). Se buscó en disco y en Sanity: lo último subido son las
  piezas de los banners de la home.
- **La carpeta "Logos empresas" no existe** en ningún lado del perfil de usuario.

Por eso **cada sección tiene un estado sin imagen diseñado** — nunca un hueco gris ni un
"próximamente". Cuando se sube la imagen en el Studio, ocupa su lugar sola, sin tocar
código.

## Decisiones

**Piezas terminadas (2, 3 y 4): nunca se recortan.** El brief pide no modificar su
composición, y un `object-cover` recorta — recortar ya es modificarla. Se muestran al 100% del
ancho con su proporción real (ancho y alto se leen del archivo en Sanity). Para teléfono
admiten una **versión móvil** opcional, servida con `<picture>`. Esto evita de raíz el
problema de recorte que tuvimos en los banners de la home.

Mientras falta la pieza, sus textos se muestran en HTML con diseño propio; cuando la pieza
está, dejan de mostrarse (ya están dibujados en ella) y pasan al `alt` y a un título solo
para lectores de pantalla. Así nadie los lee dos veces.

**Fotos (1 y 7): sí se recortan**, porque son fondos con texto HTML encima. Llevan punto
focal, overlay editable (nada / suave / medio / fuerte, orientado hacia el lado del texto) y
parallax ligero. Sin foto, usan un fondo de marca: profundidad morada, dos resplandores y
líneas de oleaje en SVG — cero peticiones de red.

**Clientes: se reutiliza "Cuenta"**, no un modelo `client` nuevo (decisión tuya). Las 26
cuentas activas aparecen en la marquesina sin recargar nada, y siguen siendo la misma fuente
que `/clientes`.

**Logos con sus colores originales**, sin escala de grises ni opacidad ni filtros, como pide
el brief. Hoy ninguna cuenta tiene logo subido, así que se muestra el nombre real de cada
una — nunca monogramas ni logos inventados.

**Categorías = íconos visuales** (aclaración tuya): Construcción, Belleza, Servicios,
Comercio, Emprendedores. Viven en la página, no clasifican a cada cliente.

**Reseñas: solo reales.** Modelo "Reseña" cargado a mano (menú **Reseñas**). No hay reseñas
de ejemplo en el código ni un puntaje promedio: inventar cualquiera de las dos es
publicidad engañosa y Google sanciona perfiles por eso. Sin reseñas, la sección invita a
leerlas en el perfil real de Google (la misma ficha de Maps del pie).

**Un solo botón para todo el sitio.** El CTA de los banners de la home se extrajo a
`BotonCta.tsx` y lo usan las dos páginas. Se verificó que la home quedó idéntica: mismas
posiciones y tamaños en los 4 banners.

## Cuatro bugs que encontró la verificación

1. **La marquesina de clientes era invisible en móvil.** Su ventana medía **5138px en un
   teléfono de 390px**: la tira de logos es ancha a propósito (`w-max`) y un ítem de grid sin
   `min-w-0` se estira hasta el ancho mínimo de su contenido. El `<Reveal>` exige que el 25%
   del área entre en pantalla y solo entraba el 7,6%, así que nunca se mostraba. El chequeo
   de desborde daba 0 porque el `overflow-hidden` de la sección lo tapaba. Corregido, y el
   script de verificación ahora mide el ancho de cada elemento y los reveals que no se
   dispararon — los dos habrían detectado esto.
2. **La línea de oleaje del Método medía 1000px a 768px.** Un SVG absoluto sin ancho declarado
   toma el ancho intrínseco de su `viewBox` e ignora `right`: la línea seguía de largo después
   del paso 5. Ahora lleva `w-[80%]`.
3. **Un texto público usaba voseo** ("Leé lo que dicen…"). El sitio le habla de tú al
   visitante ("¿Necesitas…?", "tu negocio"). Corregido a "Lee".
4. **La sección 3 quedaba desbalanceada**: texto corto arriba contra un título de tres líneas,
   y el texto adicional suelto abajo con otra alineación. Ahora las columnas se centran entre
   sí y el texto adicional es un párrafo más de la misma columna.

## Verificación (medida)

| Ancho | Desborde | Elementos más anchos que la pantalla | Reveals sin mostrarse | Errores de consola / hidratación |
|---|---|---|---|---|
| 1440 | 0 | ninguno | ninguno | ninguno |
| 1024 | 0 | ninguno | ninguno | ninguno |
| 768 | 0 | ninguno | ninguno | ninguno |
| 390 | 0 | solo los resplandores decorativos, grandes a propósito y recortados | ninguno | ninguno |

- Un solo `<h1>` (la pregunta del banner 1) y un `<h2>` por sección.
- 0 imágenes sin `alt`.
- CTAs: "Quiero Mejorar mis Ventas" → `/contactanos` (banners 1, 4 y 7); "Ver casos de éxito"
  → `/clientes`; "Ver reseñas en Google" → ficha de Maps con `target="_blank"`.
- Marquesina: dos filas en sentidos opuestos (`tide-slide` y `tide-slide-reverse`), 63s cada
  una, 13 clientes por fila; ventana contenida en 1224 / 928 / 688 / 350px.
- Hover del CTA: `scale none → 1.04`, flecha `+4px`, `#F47B20 → #FF9440`.
- Movimiento reducido: los 19 elementos animados visibles, marquesina quieta y con
  desplazamiento manual, copias duplicadas ocultas, parallax desactivado.

## Animaciones

Entrada suave (fade + desplazamiento vertical chico) en todas las secciones, parallax ligero
solo en las fotos, hover con glow y flecha en los botones. Cada sección puede apagar las
suyas desde el Studio.

**La marquesina es la única animación continua**, y es a propósito: el brief pide evitar el
movimiento infinito pero también pide un "carrusel infinito de logos". Se resolvió
dejándola como única excepción, pausable con el cursor y en desplazamiento manual con
movimiento reducido. El carrusel de reseñas **no** avanza solo, y el video de la zona
multimedia no arranca solo.

## Sanity

- **Marketing Digital** — documento único con 7 pestañas (1 · Equipo … 7 · Cierre).
- **Reseñas** — lista de reseñas reales.
- Esquema validado con `sanity schema validate`: **0 errores, 0 advertencias**.
- Documento sembrado con el copy del brief (`scripts/sembrar-marketing-digital.mjs`, con
  `createIfNotExists`: nunca pisa lo que se haya editado).

## Lo que queda de tu lado

| Dónde | Qué subir |
|---|---|
| Marketing Digital → 1 · Equipo | Foto de Daniel con el equipo y los delfines |
| → 2 · ¿Qué es DOFI? | Pieza terminada (+ versión móvil si la hay) |
| → 3 · Cómo navegamos | Pieza terminada (+ versión móvil si la hay) |
| → 4 · Método | Las 2 piezas del método. Si ya muestran los 5 pasos, apagá "Mostrar los pasos como texto" |
| → 5 · Clientes | Video, imagen o testimonio de un caso (opcional) |
| → 7 · Cierre | Foto de Daniel dando la mano |
| Cuentas → cada cuenta | Su logo original |
| Reseñas | Las reseñas reales de Google |

## Nota sobre la home

En la regresión, el botón del banner 1 de la home aparece **blanco**. No lo cambió este
trabajo: en Sanity ese banner tiene color `blanco`, elegido desde el Studio después del último
commit. El componente pinta exactamente el dato.

## Capturas

- [audit/marketing-digital/pagina-desktop.png](marketing-digital/pagina-desktop.png) · [pagina-mobile.png](marketing-digital/pagina-mobile.png)
- `seccion-1-equipo.png` … `seccion-7-socios.png` (escritorio)

## Archivos

- `src/app/marketing-digital/page.tsx` — la página.
- `src/lib/marketing-digital.ts` — tipos, consulta única, normalizado y respaldo.
- `src/components/BotonCta.tsx` — **nuevo**, el CTA compartido (sale de ContentBanner).
- `src/components/ContentBanner.tsx` — usa el botón compartido; render idéntico.
- `src/components/marketing/` — **nuevo**: `BannerFoto`, `PiezaGrafica`, `PiezaCompleta`,
  `MetodoDofi`, `ClientesCasos`, `ResenasGoogle`, `ResenasCarrusel`, `Parallax`, `Anim`,
  `AtmosferaMar`.
- `src/lib/sanity.ts` — exporta `sanityQuery` para reutilizarlo.
- `src/app/globals.css` — marquesina invertida, máscara de bordes, foto dirigida,
  movimiento reducido del parallax.
- `studio/schemaTypes/marketingDigitalPage.ts`, `resena.ts` — **nuevos**.
- `studio/schemaTypes/objects/` — **nuevos**: `campoImagen`, `ctaSimple`, `mdBannerFoto`,
  `mdPiezaGrafica`.
- `studio/schemaTypes/index.ts`, `studio/deskStructure.ts` — registro y menú.
- `scripts/sembrar-marketing-digital.mjs` — **nuevo**, siembra de un solo uso.

`npx tsc --noEmit` limpio en la web y en el Studio.
