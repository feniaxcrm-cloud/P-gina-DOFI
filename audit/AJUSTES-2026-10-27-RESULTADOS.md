# Ajustes del 2026-10-27 · Pantallas de distintos tamaños

Pedido: en algunas pantallas los componentes se montaban unos sobre otros. Se corrigió y se probó en muchos tamaños y proporciones.

Publicado con el commit `cc45d55`; el build de Cloudflare terminó bien. No hubo cambios en Sanity ni en el Studio.

## Cómo se probó
- **Revisión automática:** un script recorre las 7 páginas (Inicio, Marketing Digital, Tráfico/Ads, ChatBots/CRM, Asesorías, Contáctanos y Redes) en **29 tamaños de pantalla**. Busca elementos encimados, textos cortados, secciones que se pisan, desborde horizontal y adornos sobre textos.
- **Tamaños probados:**
  - Celulares en vertical: 320×568 a 430×932.
  - Celulares acostados: 568×320 a 932×430.
  - Tablets en ambas posiciones: 768×1024, 820×1180, 1024×768, 1024×1366, 1180×820 y 1366×1024.
  - Laptops bajas: 1280×600, 1280×720, 1280×800 y 1366×768.
  - Monitores: de 1440×900 a 2560×1440, incluido el ultra ancho 2560×1080.
- **Capturas:** cada caso se revisó a ojo antes y después del cambio.

## Qué se corrigió

### 1. Clientes y casos de éxito: todos los logos entran (las 4 páginas)
- **Antes:** en computadora, los giros con muchas empresas (Construcción tiene 18) no entraban en la columna derecha. Se veían 8 o 9 logos; el resto quedaba cortado abajo y había que desplazarse dentro del recuadro.
- **Ahora:** los logos se achican lo justo para que **entren todos** en el alto de la pantalla, sin cortarse:
  - 1920×1080: 18 logos de 109 px.
  - 1440×900: 89 px, en 4 por fila.
  - 1366×768: 82 px.
  - 1180×820: 75 px.
  - 1280×600: 64 px.
- **Giros con pocas empresas:** conservan el tamaño elegido en el Studio (120 px en computadora y 92 px en celular), que ahora funciona como tamaño máximo.
- **En celular:** siempre van al menos 3 por fila.
- **Respaldo:** si alguna vez un giro tuviera tantas empresas que ni con 64 px entraran, la columna vuelve a desplazarse por dentro.
- **Fila que se desliza (izquierda):** mientras la página carga, antes de medirse, la fila salía completa y se metía debajo de la columna de logos de la derecha. Ahora queda recortada en su columna desde el primer momento.

### 2. Asesorías · Logros: la tarjeta cabe en el celular y en la tablet vertical
- **Antes:**
  - En el celular, la tarjeta del logro medía 499 px en una pantalla de 375: el texto se salía por la derecha.
  - En la tablet vertical (1024×1366), la foto ocupaba demasiado: la tarjeta quedaba cortada y el botón «Ver otro logro» se partía en tres líneas.
- **Ahora:**
  - La tarjeta toma el ancho disponible.
  - La foto tiene un tope según el ancho de la pantalla.
  - El botón no se parte; la pista «Toca para ver otro logro» baja a otra línea si no entra.
- **Resultado del logro:** «Sobrepasó sus ventas en un 200%» se parte en dos líneas cuando no entra, en vez de cortarse con «…».

### 3. Marketing Digital · Portada con la imagen del equipo
- **Tablet grande en vertical (1024×1366):** la imagen va arriba del texto y a todo el ancho, igual que en las tablets más chicas. Antes quedaba chica abajo a la derecha, con media pantalla vacía arriba.
- **Laptops bajas (600–700 px de alto):** la imagen se angosta con el alto y deja más aire entre el texto y las personas.

### 4. Adornos náuticos (timón, velero, ancla, brújula, barco, delfín)
- **Antes:** tienen un tamaño fijo por tipo de pantalla. En laptops bajas, tablets y celulares acostados el contenido llega a las esquinas y los adornos quedaban detrás de títulos y enlaces. Ejemplos:
  - El ancla atravesaba «Ver todas en Google».
  - El timón quedaba detrás del paso 01 del Método y del título «Para nosotros, todo son datos».
  - La brújula quedaba sobre el nombre del giro en Clientes.
- **Ahora:**
  - Los adornos de esquina tienen un tope según el alto y el ancho de la pantalla y se achican hacia su esquina.
  - La brújula de Clientes ya no aparece en computadora: esa esquina es la fila de logos.
  - En pantallas de hasta 820 px de alto se ocultan:
    - El barco del Método: ahí está «Ventas Inteligentes Garantizadas».
    - En Reseñas, el timón, el delfín y la brújula: pasaban detrás de «GOOGLE» y de los nombres de las reseñas.

## Lo que ya estaba bien
Inicio, Contáctanos y Redes no tuvieron problemas en ningún tamaño. Tampoco hubo desborde horizontal en ninguna página.

## Archivos
- `src/components/marketing/ClientesLogos.tsx`: tamaño de logos calculado para que entren todos.
- `src/components/asesorias/MazoCasos.tsx`: ancho de la tarjeta, botón y línea del resultado.
- `src/components/asesorias/LogrosAsesorias.tsx`: tope de la foto.
- `src/components/marketing/BannerFoto.tsx`: imagen de la portada en vertical y en pantallas bajas.
- `src/app/globals.css`: tope de tamaño de los adornos de esquina.
- `src/components/marketing/CarruselGiros.tsx`: la fila de logos no se sale de su columna antes de medirse.
- `src/components/marketing/MarcoClientes.tsx`, `MetodoDofi.tsx` y `ResenasGoogle.tsx`: adornos que se ocultan donde tapaban texto.
- `src/components/feniax/IconosHerramientas.tsx`: marca `data-herramienta` en los íconos de herramientas (solo para la revisión automática; no cambia nada visible).

## Validación
- `tsc` sin errores y `next build` correcto (44 páginas).
- **Revisión automática completa** (203 combinaciones de página y tamaño, en el build de producción local), sin errores:
  - **Antes de los arreglos:** logos cortados o encimados en Clientes en todas las computadoras, tarjeta de Logros cortada en celulares y en la tablet vertical, y adornos sobre textos en muchos tamaños.
  - **Después:** sin elementos encimados, sin textos cortados, sin secciones que se pisen y sin desborde horizontal.
- **Único aviso que queda:** la imagen del equipo en la portada de Marketing. Su archivo es un PNG con fondo transparente y la caja que lo contiene llega hasta el título, pero las personas están abajo a la derecha. En las capturas no toca el texto: es un falso positivo.
- **En vivo** (pagina-dofi.feniax-crm.workers.dev):
  - Las 7 páginas responden bien.
  - En Marketing, a 1440×900, entran los 18 logos de Construcción (89 px) sin desplazarse.
  - En Asesorías, en un celular de 375 px, la tarjeta del logro cabe entera.
- **Revisión a ojo:** capturas antes y después en 1440×900, 1180×820, 1024×1366, 1024×768, 1280×600, 820×1180, 375×667 y 320×568.
