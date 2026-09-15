# DOFI — Rehecho: fondos decorativos de las secciones claras — Resultados

Reescribí por completo `OrnamentoNautico.tsx` y las 4 composiciones (¿Qué es DOFI?, Método,
Clientes, Reseñas). No toqué estructura ni contenido de ninguna sección — solo el sistema
decorativo. Nada subido todavía; local, verificado.

## Qué cambió respecto a la primera versión

| | v1 (rechazada) | v2 |
|---|---|---|
| Elementos por sección | 2 | 4 a 6 |
| Opacidad | 8-16% (ícono "thin") | 20-40% según capa, "light" en las piezas principales |
| Composición | un ícono en una esquina + 2 líneas abajo | pieza grande sangrando por un borde + pieza secundaria en otra esquina + líneas/ruta cruzando gran parte del ancho + nodos de acento |
| Movimiento | solo hover | hover **+** animación ambiental continua, casi imperceptible, sin que nadie toque nada |
| Motivos | 7 | 9 (se suman barco, coordenadas/mira y el trazo real del isotipo DOFI) |

## 1. Composición por sección (verificado: 4/5/4/5 elementos, ninguna se repite)

| Sección | Pieza principal (30%) | Secundaria (20%) | Líneas (24%) | Acentos (36-40%) |
|---|---|---|---|---|
| ¿Qué es DOFI? | Delfín, arriba a la derecha | Brújula, abajo a la izquierda | Oleaje (3 líneas) + ruta punteada | 2 nodos |
| Método | Timón, arriba a la izquierda | Barco, abajo a la derecha | Ruta + oleaje | 1 nodo |
| Clientes | Velero, arriba a la derecha | Brújula, abajo a la izquierda | Ruta punteada | 1 nodo |
| Reseñas | Ancla, arriba a la derecha | Delfín (otro, otra pose/tamaño) | Oleaje | El trazo del isotipo DOFI real + 1 nodo |

El delfín es mano alzada (no existe como ícono en ninguna librería del proyecto); lo demás
sale de Phosphor Icons. El acento de Reseñas usa `public/logo-dofi-mark.png` — el trazo de
pincel real del isotipo de DOFI, que no se usaba en ningún lado del sitio todavía.

## 2. Profundidad real, no una opacidad pareja

Cuatro capas, cada una con su rango (verificado con los valores de color reales):

- **Principal** — 30%, trazo "light" (más grueso que "thin": a este tamaño y opacidad es lo
  que hace que la pieza se LEA y no solo se intuya).
- **Secundaria** — 20%, "thin".
- **Líneas** (oleaje, ruta) — 24%.
- **Acentos** (nodos, el isotipo) — 36-40%, siempre en naranja DOFI: es lo que da el golpe
  de color.

## 3. Movimiento en dos capas que nunca se pisan

- **Ambiental, perpetuo, casi imperceptible.** Verificado tomando 3 lecturas de los mismos
  elementos sin tocar nada: el timón se desplaza solo (`translate` pasa de `0px -2px` a
  `0px -14px` en 5 segundos), la brújula gira solísimo (`rotate` avanza de 56° a 76° en 5
  segundos — a esa velocidad da una vuelta completa cada ~70-100 segundos, según la
  sección), y los nodos respiran (`opacity` sube y baja entre 0,5 y 1).
- **Hover**, al pasar el cursor por cualquier parte de la sección. Se resuelve solo según
  qué propiedad ya usa la animación ambiental de *ese* elemento en particular, para que
  nunca compitan por la misma propiedad: el timón (ambiental = `translate`) responde al
  hover con `scale` únicamente. Verificado con el timón ya en movimiento ambiental: al
  pasar el cursor, `scale` cambia de `none` a `1.08` y `translate` sigue moviéndose solo
  con su propio valor — los dos funcionan a la vez, sin pisarse.
- **Con "reducir movimiento" activado**, todo lo ambiental se apaga por completo
  (`animation-name: none`, confirmado que no cambia en el tiempo) y el hover tampoco mueve
  nada (ya iba con `motion-safe:`, igual que el resto del sitio).

## 4. Nada bloquea nada

Probé clics reales (coordenadas exactas, no solo mirar) sobre el botón de Clientes, una
pestaña del carrusel de giros y el botón de Método, con toda la nueva composición
encima: los tres, clicables. `pointer-events-none` de punta a punta.

## 5. Responsive

Verificado en 1440 / 768 / 390px: en escritorio y tablet se ven todos los elementos de la
tabla de arriba; en teléfono queda solo la pieza principal (más chica) y, cuando aporta,
la secundaria — las líneas y los nodos se ocultan para no saturar una pantalla angosta.

## 6. Verificación técnica

`tsc`, y el build de producción: 0 errores. Regresión de toda la página (7 secciones, 73
logos en la marquesina, sin errores de consola, sin desborde horizontal) sin cambios.

## Archivos

- `src/components/marketing/OrnamentoNautico.tsx` — reescrito: capas, animación ambiental,
  3 motivos nuevos (`barco`, `coordenadas`, `marca`).
- `src/app/globals.css` — 4 `@keyframes` nuevos y las clases `.anim-*` con duración/demora
  por variable CSS; se apagan con `[data-ornamento] { animation: none !important }` bajo
  movimiento reducido.
- `src/components/marketing/PiezaGrafica.tsx`, `MetodoDofi.tsx`, `ClientesCasos.tsx`,
  `ResenasGoogle.tsx` — las 4 composiciones.

## Pendiente

Nada bloquea nada: es un cambio autocontenido. Decime si querés que lo suba.
