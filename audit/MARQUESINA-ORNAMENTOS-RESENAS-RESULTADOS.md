# DOFI — Logos reales en la marquesina, fondos con motivos náuticos, reseñas — Resultados

Tres cambios en `/marketing-digital`. No toqué el Hero, el Footer, ni ninguna otra sección
fuera de lo pedido. Todavía no subí nada: build y verificación en local, esperando tu
aprobación.

## 1. La marquesina ahora usa los logos reales de los giros

Antes, la fila continua de abajo mostraba el **nombre en texto** de cada empresa, porque
sacaba sus datos de todas las Cuentas activas (26), y ninguna tenía logo subido ahí.

Como pediste, dejé de leer esa fuente y la marquesina ahora **reutiliza exactamente los
logos que ya cargaste en "Carrusel de giros de negocio"** — no hay un sistema nuevo. Junto
todas las empresas de todos los giros, sin repetir un logo si la misma empresa aparece en
más de un giro, y **solo entran las que tienen logo real**. Nunca vuelve a mostrar un
nombre como reemplazo — si una empresa no tiene logo, simplemente no aparece en la
marquesina (sigue en su carrusel de giro, esperando el logo).

Con lo que ya cargaste, hoy son **73 logos reales**, uno por empresa, sin ningún texto.

**Verificado:** 73 fichas, las 73 con `<img>`, 0 con texto. Sin errores de consola, sin
desborde horizontal, en 1440/768/390px.

## 2. Fondos con motivos náuticos en las secciones claras

Las 4 secciones de fondo claro (¿Qué es DOFI?, Método, Clientes, Reseñas) tenían fondo
liso. Agregué elementos gráficos del universo DOFI — mar, navegación, delfín — en trazo
fino, un solo color de marca y muy baja opacidad, cada sección con una combinación
distinta:

| Sección | Elementos |
|---|---|
| ¿Qué es DOFI? | Delfín saltando (el símbolo central de DOFI — el propio texto de la sección lo menciona) + una ruta punteada |
| Método | Timón + una ruta punteada chica, cerca del botón |
| Clientes | Velero + una brújula chica, cerca del botón |
| Reseñas | Ancla + un hilo de oleaje muy fino abajo del todo |

**Reglas del pedido, verificadas una por una:**
- **Nunca bloquean nada.** Son `pointer-events-none`: no reciben clics ni hover. Probé
  clics reales sobre el botón y sobre el carrusel de giros en 1440/768/390px — los dos
  siempre "clicables", nunca tapados.
- **Muy sutiles.** Trazo fino (nunca relleno sólido) y opacidad baja (8-16% en los
  íconos, algo más en las líneas finas, que a esa opacidad ya se leen igual de discretas).
  El delfín es la única forma con relleno; por eso es la más chica y la de menor opacidad.
- **No se repiten.** Los 7 motivos (delfín, timón, velero, brújula, ancla, olas, ruta) se
  reparten sin que una sección use la misma combinación que otra.
- **Microinteracción al pasar el cursor.** Se desplazan y escalan apenas (nunca rotan más
  de lo que ya están inclinados, para no verse raros); las líneas se deslizan en
  horizontal. Medido: `translate` pasa de `none` a `0px -8px` y `scale` de `none` a `1.05`
  al pasar el cursor por cualquier parte de la sección — no hace falta apuntar
  exactamente al dibujo. Con "reducir movimiento" activado, no se mueven ni con el
  cursor encima (mismo criterio que ya usan el botón y otras animaciones del sitio).
- **Responsive.** En escritorio y tablet se ven 2 por sección; en teléfono, la más
  pequeña se oculta y queda solo 1 (menos densidad, como pedías).
- **El delfín no existía como ícono en ninguna librería del proyecto** (el timón, velero,
  brújula, ancla y olas sí, de Phosphor Icons): lo dibujé a mano, en la misma línea fina
  que el resto. Lo ajusté dos veces hasta que se leyera bien como delfín saltando (las
  capturas de abajo son la versión final).

## 3. Reseñas: la sección de tarjetas que pedías ya existía

Antes de tocar nada revisé el código y encontré que el carrusel de tarjetas (estrellas,
nombre, empresa, foto o iniciales, texto, enlace a Google, flechas) **ya estaba
construido** de un sprint anterior. Lo que viste (solo texto y un botón) es el
**estado sin reseñas cargadas**, que se diseñó a propósito para cuando el conteo es 0 —
hoy tenés 0 reseñas en Sanity.

Le agregué lo único que faltaba del pedido: un campo de **fecha opcional** ("hace 2
semanas", "agosto 2026"), tanto en Sanity como en la tarjeta (se ve junto a la empresa).
El resto — crear, editar, borrar, activar/desactivar, reordenar, cambiar estrellas,
nombre, foto — ya se podía hacer desde el Studio, menú "Reseñas".

**Para verlo con tarjetas reales** armé una página de prueba local con reseñas marcadas
`[prueba]` (nunca se sube contenido de prueba) — la captura de abajo es esa página. En
cuanto cargues reseñas reales en el Studio, la sección se ve así en `/marketing-digital`.

## Verificación completa

- `tsc` (web y Studio), `sanity schema validate` y el build de producción: 0 errores.
- Página completa (7 secciones), home y las demás secciones sin cambios: mismos números
  de siempre (botones 358×64, brújula del Método, 6 paradas del recorrido, sin errores
  de consola, sin desborde).
- Un bug que encontré de paso y corregí: el nombre de un giro en una sola palabra larga
  ("CONSTRUCCIÓN") se cortaba a "CONSTRUCCIÓ" en la etiqueta del panel abierto —  no
  tenía dónde partir la línea. Ahora, si un nombre así no entra en una línea, pasa a la
  segunda en vez de perder la letra.

## Archivos

- `src/lib/marketing-digital.ts` — la marquesina sale de los giros; reseña con `fecha`;
  se sacó la consulta separada de Cuentas activas (ya no se usa para nada acá).
- `src/components/marketing/ClientesCasos.tsx` — marquesina solo con logo; ornamentos.
- `src/components/marketing/OrnamentoNautico.tsx` — nuevo: los 7 motivos.
- `src/components/marketing/PiezaGrafica.tsx`, `MetodoDofi.tsx`, `ResenasGoogle.tsx` —
  ornamentos por sección.
- `src/components/marketing/CarruselGiros.tsx` — arreglo de la etiqueta cortada.
- `src/components/marketing/ResenasCarrusel.tsx` — muestra la fecha si existe.
- `studio/schemaTypes/resena.ts` — campo "Fecha (opcional)".

## Pendiente de tu parte

- Nada bloquea nada: las 73 empresas y sus logos ya están. Cuando quieras, cargá
  reseñas reales en el Studio (menú Reseñas) y el video de Clientes.
- Avisame si querés que suba estos cambios y despliegue el Studio (el campo nuevo de
  reseñas es aditivo, no rompe nada existente).
