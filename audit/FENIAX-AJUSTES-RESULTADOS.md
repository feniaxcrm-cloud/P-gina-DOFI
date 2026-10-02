# FENIAX / ChatBots-CRM — Ajustes del 2026-10-01 (Resultados)

Cuatro cambios pedidos sobre `/chatbots-crm`, ya hechos, verificados en escritorio, tablet y
teléfono, y cargados en Sanity.

## 1. Portada: del teléfono a un motion de CRM

El teléfono con WhatsApp de la portada se reemplazó por **una animación de FENIAX CRM** que
junta lo que la marca vende: **gestión, ventas, automatización y crecimiento**.

- Una ventana «FENIAX CRM» con **«IA activa»** pulsando en el encabezado.
- **Clientes** (WhatsApp, Instagram, Facebook, web) que avanzan por *Nuevo → En curso →
  Cerrado*; cada venta cerrada dispara el aviso **«Venta cerrada»** y una lluvia de chispas.
- Barras de **Mensajes** y **Ventas** que crecen con cada cliente.
- Una **gráfica de crecimiento** que se dibuja hasta arriba al ritmo de las ventas.
- Sin cifras inventadas: los indicadores son barras, la gráfica no lleva ejes con valores y los
  clientes son barras (no se inventan personas).

Hecho con HyperFrames (10 s, 1080×1080, en bucle exacto): fuente en `video/crm-hero-feniax/`
(ver su README), archivos en `public/feniax/crm-crecimiento.mp4` (0,6 MB) y `.jpg`.

- **El cuadro 0 es la composición completa**: el póster es ese cuadro, así que no hay salto al
  arrancar y quien pidió menos movimiento ve el panel terminado.
- En la web va **«flotante»** (sin tarjeta): los cuatro bordes se difuminan y se funde con el
  fondo del hero. Se reproduce solo a la vista, con botón de pausa; se descarga de entrada
  (es lo primero que se ve).
- `hyperframes check` pasa (contraste AA en los 56 textos).
- Como el teléfono ya no está en la portada, se quitó el campo «Demo de WhatsApp de la
  portada» del Studio y sus datos de Sanity; la demo de WhatsApp queda solo en Clientes.

## 2. Clientes: el teléfono en formato 9:16

La pantalla pasó de 390 × 844 (la proporción de un iPhone, muy alargada en computadora) a
**390 × 712**: con el bisel, el teléfono completo queda en **9:16**. El ancho no cambió; baja el
alto (de ~690 a ~570 px en escritorio). Las conversaciones, el aviso del CRM y la barra de
controles se ven completos. En teléfono se sigue viendo bien.

## 3. Método FENIAX: animado y explicativo

El mismo recorrido de 5 pasos, ahora **vivo** (`RutaMetodo` con la opción `vivo`; DOFI y
Tráfico no cambian):

- Un **punto luminoso viaja de paso en paso** y cada paso se **enciende cuando llega**: sube,
  se abre un aro, el título toma el color de marca y la línea queda «recorrida».
- Cada ícono hace **lo que dice su paso**: la lupa busca, el enchufe conecta, el robot piensa,
  las flechas giran y la gráfica crece. Al final se enciende **el fuego del fénix** en «Ventas
  Inteligentes». Luego vuelve a empezar.
- No suma elementos ni texto: es el mismo método, leído en orden.
- Corre solo mientras se ve, tiene botón de **pausa**, y con **movimiento reducido** no corre
  (queda la ruta estática de siempre). En escritorio la línea punteada se llena sobre la misma
  curva; en teléfono se llena el tramo vertical entre pasos. Se mide el DOM real, así que
  funciona igual en todos los tamaños.
- Sin librerías de animación (un `requestAnimationFrame`): el paquete de `RutaMetodo` lo
  comparten Marketing Digital y Tráfico, y no deben pagar KB por algo que solo usa FENIAX.

## 4. Botones

Todos los botones de la página dicen **«Quiero mejorar mis ventas»**: portada, método y cierre.
Los enlaces no cambian (siguen abriendo WhatsApp con «Hola, quiero integrar un CRM en mi
empresa»). Cambiado en el respaldo del código y en Sanity (`scripts/ajustar-feniax.mts`, con
copia de seguridad previa).

## Código

- `src/components/marketing/VideoBucle.tsx`: nueva variante `flotante` y `prioridad`.
- `src/components/marketing/RutaMetodo.tsx` + `useRecorridoVivo.ts`: el recorrido vivo.
- `src/components/feniax/FeniaxPortada.tsx`, `PaginaFeniax.tsx`, `ReproductorChat.tsx`,
  `DemoWhatsApp.tsx`: sin el modo «fondo» del teléfono (ya no se usa).
- `src/remotion/feniax/tema.ts`: `PANTALLA` 390 × 712.
- `src/lib/feniax.ts`, `chat-demo.ts`, `feniax-respaldo.ts`, `studio/schemaTypes/chatbotsCrmPage.ts`.
- `scripts/ajustar-feniax.mts` (un solo uso, simulación por defecto) y `sembrar-feniax.mts`
  actualizado (ya no carga la demo de la portada).
