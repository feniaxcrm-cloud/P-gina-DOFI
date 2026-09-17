# DOFI — Cambios finales: fondos decorativos + Reseñas de Google — Resultados

Dos cambios independientes, ambos locales y verificados, nada subido todavía.

## CAMBIO 1 — Densidad y distribución de los fondos decorativos

### Conteo por sección (verificado en el navegador, no contado a mano)

| Sección | Antes | Ahora | Motivos |
|---|---|---|---|
| ¿Qué es DOFI? (referencia, sin tocar) | 6 | 6 | delfín, brújula, olas, ruta, nodo, nodo |
| Método DOFI | 5 | 8 | ruta, olas, timón, barco, **brújula**, nodo, **nodo**, **nodo** |
| Clientes y casos de éxito | 4 | 8 | ruta, **olas**, velero, brújula, **timón**, nodo, **nodo**, **nodo** |
| Reseñas en Google | 5 | 10 | **ruta**, olas, ancla, **timón**, delfín, **brújula**, marca, nodo, **nodo**, **nodo** |

En negrita lo agregado. "¿Qué es DOFI?" no se tocó: ya era la referencia aprobada.
Clientes y Reseñas — las dos que señalaste como "muy vacías" — son las que más creció.

### Qué se agregó al sistema (`OrnamentoNautico.tsx`)

- **Profundidad real, no solo opacidad**: la capa "secundario" ahora lleva un blur de
  0.5px — casi imperceptible, pero mide distinto en el navegador (verificado:
  `filter: blur(0.5px)` en los elementos secundarios, `none` en principal/línea/acento).
- **Orden de capas**: en las 3 secciones que edité, las líneas (ruta, olas) ahora se
  pintan ANTES que los íconos en el JSX, así donde se cruzan, el ícono queda "encima" y
  la línea "atrás" — el efecto de profundidad que pediste.
- Motivo nuevo disponible (`estrella`, ícono Star de Phosphor) por si lo necesitás para
  algo puntual más adelante; no lo usé en ninguna sección para no forzar un motivo que
  ninguna lista del brief pedía por nombre.
- Distribución: en Método y Clientes, los nuevos elementos quedan siempre pegados al
  borde superior o inferior (nunca al medio), a propósito — ver la nota sobre el Método
  más abajo.

### Método: no toca la línea de los 5 pasos

Agregué la brújula que pedías, más 2 nodos, todos pegados al borde superior o inferior
de la sección. `RutaMetodo` (los 5 pasos con su propia línea) vive en un bloque aparte
más abajo en el DOM — ningún elemento nuevo cae en esa franja intermedia. Verificado
visualmente en la captura de abajo.

### Clientes: ahora con oleaje y timón, nunca sobre logos ni carrusel

Faltaba `OrnamentoOlas` por completo — ya está (banda baja, discreta). Sumé el timón
pedido arriba a la izquierda (sangrando el borde, visible desde `lg`). Todo lo nuevo
queda en el margen exterior de la sección; donde technically se solapa con el
carrusel/video, esos paneles ya tienen su propio fondo opaco encima (mismo criterio que
ya usaba la composición anterior).

### Reseñas: el área de las tarjetas queda libre

Sumé la ruta y el timón que pedías, más 2 nodos. Con timón, delfín, brújula y ancla
distribuidos entre las 4 esquinas y ruta+olas cruzando arriba/abajo, no queda ningún
elemento nuevo en la franja central donde viven las tarjetas de reseñas.

### "¿Cómo navegamos contigo?" — decisión que tomé sin preguntarte, te la explico

Tu mensaje la incluye en la lista de secciones a decorar, pero también repetís varias
veces "fondo blanco", "NO convertir las secciones blancas en fondos morados". Esa
sección (`NavegacionEditorial.tsx`) es la única de las 7 que es de fondo OSCURO a
propósito (`bg-abyss`, morado profundo) — así rompe la secuencia clara/oscura de la
página, y ya tiene su propio sistema gráfico editorial (título grande, velero
separador, una brújula con órbita punteada, olas abajo — un componente `Brujula`
completamente distinto de `OrnamentoNautico`). No la toqué: asumí que la mencionaste
por completitud y que la regla de "solo blancas" es la que vale. Si me equivoco, decime
y la traigo al mismo sistema que las otras 4.

### Verificación (Puppeteer, sobre servidor local)

- Animación ambiental corriendo de verdad en los elementos NUEVOS: brújula de Método
  gira sola (46,2° → 59,0° en 3s), timón de Clientes se desplaza solo, brújula de
  Reseñas respira (opacidad 0,64 → 0,69), ruta de Reseñas se mueve. Nada de esto es
  hover: se leyó sin tocar el mouse.
- Con "reducir movimiento" activado: los 3 elementos nuevos quedan con
  `animation-name: none` y no cambian en el tiempo.
- Hover en un elemento nuevo (brújula de Método): `scale` pasa de `none` a `1.05` al
  pasar el cursor.
- Clics reales (coordenadas, no solo mirar) sobre el botón de Método, el botón de
  Clientes y una pestaña del carrusel de giros: los tres, clicables, con toda la nueva
  composición encima.
- Sin desborde horizontal, sin errores de consola, home sin cambios, marquesina de
  Clientes con sus 73 fichas de siempre.

## CAMBIO 2 — Reseñas de Google, sin botón

### Qué cambió

- **El botón "Ver reseñas en Google" ya no existe** — ni el que acompañaba a las
  tarjetas, ni el de la invitación cuando no había ninguna. Verificado: la sección no
  contiene ese texto en ningún lado, y no queda ningún `<a>` con el estilo de botón
  (`banner-cta-boton`) dentro de `#resenas`. Tampoco quedó el campo en el Studio: quité
  el CTA del tipo "Reseñas de Google" (`omitir: ["cta"]`) para no dejar un campo que ya
  no hace nada.
- La sección ahora muestra las tarjetas directamente. Sin ninguna reseña real todavía
  (hoy: 0 en Sanity, Google sin configurar), el estado vacío es un texto simple, sin
  tarjeta ni botón — nunca finge contenido que no existe.
- El enlace chico "Ver todas en Google →" que ya existía arriba a la derecha **lo
  dejé**, mismo lugar, mismo estilo de siempre — es un enlace de texto liviano a la
  ficha completa, no el botón que pediste sacar. Con Google limitado a 5 reseñas por
  consulta y Sanity pudiendo tener menos que el total real, me pareció útil mantenerlo
  como salida hacia el perfil completo. Si preferís que también desaparezca, lo saco:
  es la única duda real que tengo sobre esta parte del pedido.

### Reseñas reales de Google — cómo quedó armado

Nuevo archivo [`src/lib/google-places.ts`](src/lib/google-places.ts): pide el campo
`reviews` a la API de Google Places (Place Details), en español. Todo lo que pediste
explícitamente, verificado en el código:

- **La API key nunca se hardcodea**: sale de `process.env.GOOGLE_PLACES_API_KEY` /
  `GOOGLE_PLACE_ID`, sin prefijo `NEXT_PUBLIC_` — o sea, server-only, nunca llega al
  navegador. Confirmado con el build de producción: no aparece en ningún chunk del
  cliente (por diseño: el fetch corre en `getPaginaMarketingDigital()`, que solo se
  ejecuta en el servidor).
- **Caché**: 6 horas de revalidación (`next: { revalidate: ... }`, el mismo mecanismo
  que ya usa Sanity) — no pega a la API en cada visita, y respeta el límite de los
  Términos de Servicio de Google Maps Platform sobre cuánto tiempo se puede conservar
  este contenido (no se guarda en Sanity ni en ningún otro lado, solo en la caché de
  Next).
- **Nunca rompe la página**: sin las variables, con cualquier error de red, o si Google
  responde sin reseñas válidas, la función devuelve `null` — nunca lanza.
- **Prioridad, sin mezclar nunca**: en `marketing-digital.ts`, si Google devuelve al
  menos una reseña, se muestran esas. Si no, las reseñas cargadas a mano en Sanity.
  Jamás las dos juntas.
- **Límite real de la API que hay que saber**: Google Place Details devuelve como
  máximo 5 reseñas por respuesta — no hay forma de traer más desde esta API. Si el
  perfil de DOFI tiene más de 5, Google decide cuáles de esas 5 mostrar.

### Lo que NO pude verificar (necesito datos tuyos)

No tengo una API key ni el Place ID de DOFI, así que no pude probar el camino real de
Google end-to-end. Sí verifiqué exhaustivamente que el camino de RESPALDO (Sanity)
funciona perfecto, y que el código de Google maneja correctamente "no configurado" (que
es el estado real ahora mismo) sin romper nada.

Para activarlo:
1. **`GOOGLE_PLACES_API_KEY`**: creála en
   [console.cloud.google.com](https://console.cloud.google.com) → Credenciales, con la
   "Places API" habilitada en ese proyecto de Google Cloud.
2. **`GOOGLE_PLACE_ID`**: buscá el local de DOFI en el
   [buscador de Place ID de Google](https://developers.google.com/maps/documentation/places/web-service/place-id).
3. Las agregás a tu `.env.local` (ya documentadas en `.env.example`) para probar en tu
   máquina, y en Cloudflare (`pagina-dofi` → Settings → Variables and Secrets) para que
   funcione en producción — mismo lugar donde ya están `SANITY_PROJECT_ID`, etc.

### Sanity: nuevos campos en "Reseñas de Google"

Todos opcionales, todos aditivos — no se perdió ningún dato ni campo existente:

- **Cantidad de reseñas a mostrar** (número, 1-50): tope de tarjetas. Vacío = todas.
- **Avance automático** (sí/no, apagado por defecto).
- **Velocidad del avance automático** (segundos, 3-30, solo visible si el anterior está
  activo).

### Autoplay del carrusel — opcional, verificado con datos de prueba

Como no hay reseñas reales cargadas todavía, armé una página de prueba local temporal
(con reseñas ficticias, nunca llegó a Sanity ni se commiteó — ya está borrada) para
verificar el comportamiento real:

- Con autoplay a 2 segundos: el carrusel avanza solo, y al llegar al final vuelve al
  principio (confirmé el salto de `scrollLeft` cerca del final a 0 en el siguiente
  tick).
- Al pasar el cursor por encima: se detiene (`scrollLeft` idéntico en dos lecturas con
  ~2,9s de diferencia).
- Al sacar el cursor: retoma solo, sin recargar nada.
- Con movimiento reducido, no arranca (mismo mecanismo que ya usa el resto del sitio,
  `useReducedMotion` de `motion/react`, igual que el carrusel de Clientes).

## Verificación técnica

- `npx tsc --noEmit`: 0 errores (proyecto Next.js y `studio/`, por separado).
- `npm run build:next`: build de producción completo, 0 errores, 43 páginas generadas.
- Suite de Puppeteer completa (inventario de ornamentos, animación ambiental, reducido,
  hover, clics, ausencia del botón, regresión de las 7 secciones + home): todo en
  verde, sin errores de consola en ningún caso.

## Archivos

**Nuevo**
- `src/lib/google-places.ts`

**Modificados**
- `src/components/marketing/OrnamentoNautico.tsx` — blur en capa secundaria, motivo
  `estrella` disponible.
- `src/components/marketing/MetodoDofi.tsx`, `ClientesCasos.tsx` — densidad y
  distribución.
- `src/components/marketing/ResenasGoogle.tsx` — reescrito: sin botón, nueva
  composición decorativa, conectado a autoplay/cantidad.
- `src/components/marketing/ResenasCarrusel.tsx` — autoplay opcional.
- `src/lib/marketing-digital.ts` — integra Google Places con prioridad sobre Sanity,
  nuevos campos de `reviewsBanner`.
- `studio/schemaTypes/marketing/camposBase.ts` — `omitir` ahora acepta `"cta"`.
- `studio/schemaTypes/marketing/reviewsBanner.ts` — nuevos campos, sin CTA.
- `.env.example` — documenta `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID`.

**No tocados** (según lo pedido): Hero, tarjetas del Hero, contenido/lógica de Método,
carrusel de Clientes, `NavegacionEditorial.tsx`, colores, tipografía.

## Pendiente de tu parte

1. Decime si el enlace "Ver todas en Google" debe quedarse o desaparecer también.
2. Confirmá si "¿Cómo navegamos contigo?" se queda como sección oscura o querés que la
   traiga al sistema de las blancas.
3. Cuando tengas la API key y el Place ID reales, pasámelos (o cargalos vos directo en
   Cloudflare) para activar las reseñas reales — sin eso, el sitio sigue funcionando
   perfecto con el respaldo de Sanity.

Nada de esto se subió todavía. Decime si lo subo (y si hay que redesplegar el Studio —
esta vez sí cambió el schema).
