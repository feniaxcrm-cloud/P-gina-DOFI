# DOFI — Ajustes del 2026-10-07 (Resultados)

Once pedidos sobre el Home y las páginas de servicio. Todo está hecho en el código y verificado
en el navegador (build de producción). Lo que vive en Sanity queda listo en dos scripts que hay
que correr desde una máquina con acceso a Sanity (ver «Pendiente»).

## 1. Hero del Home más premium (Remotion)

- **Fondo**: el mar de DOFI de noche — el morado de la marca con resplandores violeta y naranja
  que se mueven muy despacio. La foto del Studio, si hay, se funde a la derecha en duotono.
- **Título**: la última palabra lleva el degradado de la marca y un brillo que la recorre cada
  tanto (técnica de ShinyText de React Bits, en CSS). Es texto real: se pinta de entrada (LCP).
- **Animación nueva con Remotion** (`src/remotion/hero/VentasInteligentes.tsx`), 12 s en bucle
  sin costura: **01 Atraer** (una pieza en redes que se llena de «me gusta» y vistas; un corazón
  de «doble toque» aparece sobre ella), **02 Convertir** (el cliente escribe por WhatsApp, la IA
  responde y queda en el CRM) y **03 Escalar** (la curva de ventas sube). Sin cifras inventadas:
  barras y curvas sin valores.
- En escritorio, las cuatro capacidades van en una sola fila de tarjetas de vidrio oscuro.
  **Todo el hero mide una pantalla.**
- Remotion se carga después de pintar la página (el título nunca lo espera). Con movimiento
  reducido se ve un cuadro quieto con las tres etapas completas.

## 2. Clientes y casos de éxito en una sola pantalla

Marketing Digital, Tráfico, ChatBots/CRM y Asesorías comparten ahora el mismo marco
(`MarcoClientes.tsx`): la sección mide el alto de la ventana y **todo entra en ella**.

- En escritorio la descripción va a la derecha del título (se ganan ~45 px para el contenido).
- El cuerpo ocupa el resto: el carrusel de giros y la columna derecha (video, panel de Meta Ads,
  teléfono de WhatsApp o mazo de casos) se estiran o se encogen con la pantalla; el video y los
  paneles se ven **completos**.
- Los logos del giro abierto van **en una fila** que se desliza sola cuando no entran.
- Se quitó la marquesina de clientes de abajo: era lo que dejaba la sección fuera de la pantalla
  (los logos siguen a la vista en la fila del giro).

## 3. Reseñas de Google que se deslizan solas

En todas las páginas (Marketing, Tráfico, CRM) las reseñas son una franja continua. Se detiene
con el cursor encima, con el foco del teclado o con el dedo apoyado; con movimiento reducido
pasa a desplazamiento manual. Como ahora siempre se deslizan, se quitaron del Studio los campos
«Avance automático» y «Velocidad» (no harían nada).

## 4. Sin botones de play

- **Panel de Meta Ads** (Tráfico): sin play/pausa, sin la barra ni «Día 16 de 30» debajo (el día
  y su avance ya se leen dentro del panel). Corre solo al entrar en pantalla.
- **Teléfono de WhatsApp** (CRM), **videos en bucle** (ecosistema de Tráfico, FENIAX) y la
  **ruta del Método** de FENIAX: sin botones.
- **Video de Clientes** (Marketing): sin play; solo queda el botón de sonido, si el editor lo activa.
- Con el cursor encima, los paneles se detienen para leer; al sacarlo, siguen.
- **Arreglo**: los paneles de Remotion esperaban un clic del visitante para arrancar (el Player
  esperaba permiso de audio del navegador). Ahora arrancan solos, silenciados.
- Lo único que conserva su botón de reproducir son los videos de casos en `/clientes/[slug]`:
  piezas con sonido que el visitante elige ver, fuera de las páginas de este pedido.

## 5. Cada sección = una pantalla

Sistema común en `globals.css`: clase `.pantalla`, alto útil `--alto-util` (pantalla menos el
header y márgenes) y títulos que escalan con el alto de la pantalla (`text-titulo`). En
escritorio el scroll «se acomoda» al inicio de cada sección (snap suave). En teléfono las
secciones fluyen a su alto natural.

## 6. Tráfico: ¿Dónde traficamos?

**WhatsApp va primero** («Del anuncio al chat») y **se quitó «Tráfico web»**. En el código y en
el Studio; para Sanity, `npm run ajustar:paginas` (ver abajo).

## 7. Formulario de contacto

Una tarjeta clara sobre el fondo de marca: campos suaves que se encienden en morado al escribir,
servicios como pastillas con su check, nombre y negocio lado a lado en escritorio y un solo
botón a todo el ancho. Entra completo en una pantalla. Los campos no cambiaron.

## 8. Asesorías: Logros en lugar de «Reseñas en Google»

Sección nueva **Logros (tarjetas con foto)** (`LogrosAsesorias.tsx`, tipo `achievementsBanner`):

- A la izquierda, la foto de la historia; a la derecha, el mazo de tarjetas.
- **Cada clic en la tarjeta** (o en «Ver otro logro», o al arrastrarla) pasa a la siguiente
  historia y **la foto cambia** con un barrido. También avanza sola (6 s por tarjeta; se pausa
  con el cursor y se detiene cuando el visitante interviene).
- **Todo se edita en el Studio**: cuántas tarjetas (se agregan, borran y reordenan), la foto, la
  frase, el remate, la etiqueta, el nombre sobre la foto y la firma de cada una.
- Las 4 historias cargadas son **de ejemplo** (firman «Ejemplo — reemplázalo», fotos recortadas
  de la foto grupal): se reemplazan por las reales en el Studio.

## 9. Asesorías: título del hero

Más chico y elegante («Asesorías 1 a 1» entre dos líneas finas, con un brillo suave); el **logo de
Rescatando Emprendedores pasa a ser el protagonista** (más grande).

## 10. CRM: TikTok en la portada

«Conectamos tu WhatsApp, Instagram, Facebook **y TikTok** a un CRM con inteligencia artificial…»
(código, metadatos de la página y Sanity con `npm run ajustar:paginas`).

## 11. React Bits

Se revisó la librería y se tomó lo que suma sin duplicar lo que el sitio ya tiene:

- **ShinyText** (técnica, en CSS puro): el título de Asesorías, la palabra de color del hero y un
  **destello en todos los botones** «Quiero mejorar mis ventas» — una franja de luz cruza el
  botón cada tanto y al pasar el cursor, por debajo del texto (nunca le quita contraste).
- **Stack** y **LogoLoop**: el sitio ya tiene su mazo de tarjetas (`MazoCasos`, que ahora usan
  Casos y Logros) y su marquesina (`.wall-track`), así que no se sumaron.
- Sin dependencias nuevas. Licencia de React Bits: MIT + Commons Clause (se puede usar en el
  sitio, no revender el código); el crédito está en `globals.css`.

## Scripts de Sanity

Los dos son simulación por defecto (no escriben nada) y guardan copia del documento en
`audit/` antes de escribir:

| Script | Qué hace |
|---|---|
| `npm run ajustar:paginas` | Tráfico: quita «Tráfico web» y pone WhatsApp primero. CRM: suma TikTok a la portada (solo si el texto sigue siendo el original). Reseñas: borra los campos de avance automático que ya no existen. |
| `npm run sembrar:asesorias` | Carga la página Asesorías completa: portada (sube logo y foto), ¿Qué es…?, Clientes con los 3 casos, **Logros con sus 4 tarjetas y fotos** y Cierre. No toca el documento si ya tiene secciones activas (salvo `-- --forzar`). |

Para escribir: `npm run ajustar:paginas -- --aplicar` y `npm run sembrar:asesorias -- --aplicar`
(necesitan `SANITY_WRITE_TOKEN` en `.env.local`). Se probaron contra copias reales de los
documentos (las de `audit/`) con un cliente de Sanity simulado: los cambios y el documento que
generan son los esperados, y la página arma Logros con datos del CMS (3 tarjetas → «01 / 03»,
cada clic cambia la foto).

## Verificación

- `tsc` del sitio, del Studio y de los scripts: 0 errores. `next build`: 43 páginas, sin errores.
- Playwright sobre el build de producción, en Home, Marketing, Tráfico, CRM, Asesorías y
  Contacto:
  - **1280×720, 1366×657, 1536×730 y 1920×950**: cada sección mide **exactamente** el alto de la
    ventana. Clientes con un video cargado: título, carrusel, fila de logos y video completos.
  - **390×844**: sin desborde horizontal.
  - Sin errores de consola y sin botones de play/pausa en ninguna página.
  - Reseñas en movimiento (Marketing, Tráfico, CRM); los paneles de Remotion corren sin clic
    (Home, Tráfico, CRM), en escritorio y teléfono.
  - Videos en bucle: arrancan solos y se pausan fuera de pantalla (probado con copias WebM: el
    Chromium de pruebas no decodifica H.264).
  - Logros: el clic (mouse y toque) en la tarjeta cambia la foto.
  - Movimiento reducido: reseñas y paneles quietos, sin errores.

## Pendiente

1. **Correr los scripts** desde una máquina con acceso a Sanity (aquí la red no lo permite):
   primero sin `--aplicar` para revisar, después con `-- --aplicar`.
2. **Redesplegar el Studio** (`studio/`): tipo nuevo «Logros», campos de reseñas que se fueron y
   descripciones actualizadas.
3. **Reemplazar los ejemplos** de Logros y Casos por historias y fotos reales en el Studio.
4. **Licencia de Remotion** (pendiente de antes): el hero suma un tercer uso; sigue valiendo la
   nota de `FENIAX-CHATBOTS-CRM-RESULTADOS.md`.
