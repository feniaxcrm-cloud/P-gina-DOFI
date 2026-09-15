# DOFI — "Clientes y casos de éxito" con carrusel de giros — Resultados

Solo cambió esta sección de `/marketing-digital`. Hero, Footer y las otras seis secciones
quedaron igual (la regresión da los mismos números que antes), y la home también.

## Corrección posterior (mismo día): lo que estaba mal y cómo quedó

Lo publicado en `76789ed` no correspondía a lo pedido. Hubo cuatro problemas:

| Problema | Causa | Corrección |
|---|---|---|
| **Faltaba la columna del video** | Sin video cargado, la columna se ocultaba | Las dos columnas existen **siempre** desde tablet: 55% carrusel y 45% video. Sin video, el marco muestra un estado vacío discreto. En teléfono el video va debajo de los logos y nunca desaparece. |
| **El carrusel ocupaba todo el ancho** | Consecuencia del punto anterior | Resuelto con la columna fija del video. |
| **El panel abierto quedaba gigante** | A 1224px medía 688 contra 124 (5,5 a 1) | Con la columna al 55% (651px) mide 257 contra 89: **relación 2,90**, la del video (255/88). |
| **Aparecía "Emprendedores" sin configurarlo** | Los 5 giros (Construcción, Belleza, Servicios, Comercio, Emprendedores) los había sembrado yo en Sanity en un sprint anterior, con la lista de ejemplo del primer brief. El código además los tenía como respaldo. | Quitados de Sanity (respaldo exacto en `audit/backup-giros-sembrados-2026-09-14.json`), del respaldo del código y del script de siembra. |

Sin giros en Sanity, el carrusel muestra una **estructura vacía** (un panel ancho y cuatro
angostos, sin nombres ni logos) y la línea "Pronto verás aquí a nuestros clientes por giro de
negocio." No se inventa ningún giro, empresa ni logo.

**Cambios en el Studio:**
- **Ícono del giro:** ahora es opcional. Un giro necesita nombre; su orden es el de la lista
  (arrastrar); la foto es opcional; y lleva sus empresas con logos.
- **"Formato del video" → "Ajuste del video en su columna":**
  - Rellenar la columna: puede recortar bordes, nunca deforma.
  - Mostrar el video completo: sin recortes, sobre fondo de marca.

**Verificación de la corrección:**
- **Página real, con los datos de hoy (sin giros ni video):**

  | | 1440 | 1024 | 768 | 390 |
  |---|---|---|---|---|
  | Columnas | 651 / 533 (55/45), lado a lado | 488 / 400 | 361 / 295 | apiladas, video debajo |
  | Alto del marco del video | = columna carrusel (487) | = 447 | = 429 | 350×438 (4:5) |
  | Nombres de giro de ejemplo en la sección | ninguno | ninguno | ninguno | ninguno |
  | Marquesina | 26 fichas, 63s, 2.ª en reversa | igual | igual | igual |
  | Botón | 281×64, a 40px | igual | 281×64, a 48px | 244×56, a 48px |
  | Desborde / errores | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

- **Con datos genéricos `[prueba]`** (página local, ya borrada):
  - Paneles a 1440: [89, 257, 89, 89, 89], relación 2,90. A 1024: [195, 67…], también 2,90.
  - La etiqueta del giro entra en una línea.
  - El video ocupa toda su columna (533×664, igual al alto del carrusel) y reproduce.
  - La curva sigue igual a la del video: 30 / 53 / 70 / 83 / 96 / 100%, con el ancho total fijo.
  - En teléfono el orden es carrusel → logos → video → marquesina → botón.
- **Regresión:** las otras 6 secciones y la home dan los mismos valores.

Lo que sigue abajo describe la primera versión. Donde la contradice, manda esta corrección.

```
Clientes y casos de éxito                     (una línea en escritorio, morado DOFI)
┌───────────────────────────────────┬──────────┐
│ Carrusel de giros                 │  Video   │
│ Logos del giro abierto            │          │
└───────────────────────────────────┴──────────┘
Marquesina continua de clientes                (sin cambios)
Botón "Ver casos de éxito"                     (sin cambios)
```

## 1. Qué hace el video de referencia (medido, no a ojo)

Extraje los cuadros de la grabación y medí el ancho y la saturación de cada panel cada 50ms.

- **Composición:** 5 paneles verticales altos con esquinas redondeadas. Uno está abierto
  (255px) y los demás angostos (88px): **relación 2,9 a 1**. El ancho total no cambia nunca:
  lo que crece uno lo cede el otro.
- **Selección:** sigue al cursor. No hay rotación ni movimiento continuo propio.
- **Velocidad:** cada cambio dura **~450ms con curva ease-out cúbica**. Cerca del 40% del
  recorrido ocurre en los primeros 100ms y el final se asienta largo y suave. Ese modelo
  coincide con las muestras del video dentro de ±5%.
- **Color:** el panel abierto va a color (saturación ~55%) y los cerrados en escala de grises
  (~10%). El cambio de color va sincronizado con el de ancho.
- **Etiqueta:** barra y nombre abajo a la izquierda, con fade. Mientras el panel todavía es
  angosto, el texto queda recortado por el borde.

## 2. Qué se construyó

**Título.** El mismo texto, en morado DOFI (`#4B2A93`) y con la tipografía de la página.
- Escritorio y tablet: una sola línea (verificado a 1440 y 1024).
- Teléfono: dos líneas balanceadas.

Queda alineado a la izquierda: el botón no podía cambiar de posición y un título centrado sobre
un botón a la izquierda se vería desencajado. Si lo prefieres centrado, es un cambio de una
clase.

**Carrusel de giros**: la lógica del video con los colores DOFI. Hay dos variantes de panel:

| Panel | Con foto del giro | Sin foto (hoy) |
|---|---|---|
| Abierto | foto a color | degradado morado con brillo naranja |
| Cerrado | foto en gris y algo oscurecida | lavanda suave |

- **Contenido de cada panel:** los cerrados muestran su ícono y el nombre en vertical, para
  que se entienda de un vistazo que son giros distintos. El abierto muestra su ícono y la
  etiqueta (barra naranja y nombre).
- **Formas de cambiar de giro:**
  - cursor, como en el video;
  - clic o toque;
  - teclado: flechas circulares, Inicio y Fin;
  - deslizar el dedo en el celular.
- **Rotación automática** (se apaga desde Sanity):
  - avanza cada 4,8s mientras el carrusel está en pantalla y nadie lo toca;
  - muestra una línea de progreso naranja en el panel abierto;
  - se pausa con el cursor o el foco adentro;
  - se detiene al elegir un giro y después de dos vueltas;
  - con movimiento reducido no rota y los cambios son instantáneos.
- **Muchos giros:** si no entran con un ancho legible, se muestra una ventana de paneles que
  se desplaza con la selección.

**Logos del giro abierto**, debajo de los paneles:
- **Encabezado:** barra naranja, nombre del giro y cantidad de empresas. Deja claro de qué
  giro son los logos.
- **Cambio de giro:** los logos anteriores salen con fade y los nuevos entran deslizándose
  desde el lado hacia el que se avanza, escalonados. Todo entra en menos de 0,7s.
- **Altura fija:** se reserva la del giro con más empresas, así que la página nunca salta.
- **Sin deformación:** `object-fit: contain` con la proporción real del archivo.
- **Tamaño equilibrado:** cada logo ocupa la misma *área*, no el mismo alto. Un logo cuadrado
  no se ve chico al lado de uno apaisado.
- **Sin logo:** se muestra el nombre real de la empresa. Nunca un logo inventado.

**Video** (columna derecha):
- **Reproducción:** en silencio, en bucle y en línea (`muted`, `loop`, `playsInline`), y solo
  mientras está en pantalla. Fuera de pantalla se pausa.
- **Controles mínimos:** pausa/reproducción siempre, porque un video que se mueve solo tiene
  que poder detenerse. El botón de sonido solo aparece si lo activas en Sanity.
- **Movimiento reducido:** no arranca solo.
- **Formato:** se elige en Sanity y el video se muestra sin deformarse:

  | Formato | Escritorio | Teléfono |
  |---|---|---|
  | Vertical 9:16 (por defecto) | columna angosta estirada al alto del carrusel | debajo de los logos |
  | Cuadrado 1:1 | cuadrado y centrado en alto | debajo de los logos |
  | Horizontal 16:9 | proporcional y centrado en alto | debajo de los logos |

- **Sin video:** el carrusel ocupa todo el ancho.

**Marquesina y botón:** mismo código y mismas clases, verificados con números (ver 4).

## 3. Sanity

```
Marketing Digital → Secciones → Clientes y casos de éxito
│
├── Carrusel de giros de negocio
│   ├── Giros de negocio   (crear, editar, borrar, arrastrar para reordenar)
│   │   └── Giro: nombre · ícono (opcional) · foto (opcional)
│   │       └── Empresas y logos de este giro  (agregar, quitar, reemplazar, reordenar)
│   │           ├── Cuenta existente          → usa el nombre y el logo de la Cuenta
│   │           └── Empresa con logo propio   → nombre + logo
│   └── Rotación automática
│
└── Video (columna derecha)
    ├── Video (MP4/WebM)
    ├── Ajuste del video en su columna (rellenar / completo)
    ├── Portada del video (opcional)
    └── Mostrar botón de sonido
```

- **Sin duplicar datos.** Lo normal es elegir una Cuenta existente: cambiar su logo en la
  Cuenta lo cambia en todo el sitio (marquesina, `/clientes` y este carrusel). "Empresa con
  logo propio" es para las que no son Cuentas.
- **Cuentas desactivadas:** una Cuenta apagada no aparece en ningún giro.
- **Giros:** los 5 de ejemplo que yo había sembrado se quitaron en la corrección (ver arriba).
  Hoy no hay giros hasta que los crees. El campo conserva su nombre interno `categorias`; en el
  Studio se ve como "Giros de negocio".
- **Quitado:**
  - "Caso destacado" de la sección y "Video del caso" de Cuenta. Pertenecían al panel de caso
    del sprint anterior, que este diseño reemplaza por el video de la sección.
  - "Texto destacado" de esta sección, porque no se mostraba.
- **Empresas sin asignar.** Las categorías de las 26 Cuentas (Gastronomía, Turismo, Fitness…)
  casi nunca coinciden con los giros: solo Servicios (Blue 360) y Comercio (Comercial Luna
  Pazmiño, Comercial JyC). Asignar empresas a giros es una decisión editorial y no la tomé por
  ti. Mientras un giro no tenga empresas, debajo dice "Pronto verás aquí las empresas de este
  giro."

## 4. Verificación

`tsc` (web y Studio) y `sanity schema validate` dan 0 errores y 0 advertencias. La consulta GROQ
se probó contra la API real:
- trae los 5 giros;
- la bifurcación Cuenta / empresa propia resuelve bien, probada con datos construidos dentro de
  la consulta, sin escribir en Sanity.

**Página real** (datos de hoy: 5 giros sin empresas, sin video):

| | 1440 | 1024 | 390 |
|---|---|---|---|
| Título | 1 línea, `rgb(75,42,147)` | 1 línea | 2 líneas |
| Paneles | abierto 688, cerrados 124 | 392 / 124 | 176 / 38 |
| Orden | título → carrusel → marquesina → botón | igual | igual |
| Marquesina | 2 filas, 2.ª en reversa, 63s cada una, fichas 168×80 | igual | igual |
| Botón | "Ver casos de éxito" → /clientes, 281×64, a 40px de la marquesina | igual | 244×56, a 48px |
| Desborde / errores de consola | 0 / 0 | 0 / 0 | 0 / 0 |

La marquesina y el botón dan exactamente lo que produce el código anterior: 13 clientes por
fila × 184px / 38px/s = 63s, y `mt-12 lg:mt-10`.

**Curva de la transición**, medida de forma determinista: se pausa la transición CSS real y
se adelanta a cada instante con la Web Animations API.

| ms | 0 | 25 | 50 | 100 | 150 | 200 | 250 | 300 | 350 | 400 |
|---|---|---|---|---|---|---|---|---|---|---|
| Sitio | 0% | 16% | 30% | 53% | 70% | 83% | 91% | 96% | 99% | 100% |
| Modelo del video | 0% | 16% | 30% | 53% | 70% | 83% | 91% | 96% | 99% | 100% |

La suma de anchos se mantiene constante (804px) en toda la transición, como en el video.

**Interacción y comportamiento**, en una página de prueba local con datos (ver 5):

| Prueba | Resultado |
|---|---|
| Teclado | derecha → 1 · izquierda ×2 → 4 (circular) · Fin → 4 · Inicio → 0 |
| Deslizar (táctil, 390px) | izquierda → siguiente giro · derecha → vuelve |
| Altura al cambiar de giro | 200px con 8, 3, 1, 2 y 0 empresas; la sección, siempre 1359px |
| Estrés: 30 cambios en ~1,5s | queda 1 sola capa de logos, sin acumulación |
| Logos | proporción natural 1,78 / 0,56 → caja 1,76 / 0,57 · `contain` |
| Video | reproduce en pantalla · Pausar/Reproducir · se pausa fuera de pantalla y retoma al volver · sonido |
| Formatos | vertical 340×644 · cuadrado 496×496 · horizontal 561×315 · sin video: carrusel a 1224px |
| Rotación | 0 → 1 (5,3s) → 2 (10,3s) · tras un clic no vuelve a rotar |
| Movimiento reducido | no rota · transiciones 0s · video pausado |

Regresión del resto de la página: los mismos valores que la verificación anterior en las
otras 6 secciones. Home: sus 4 botones siguen en 358×64, sin errores.

**Errores encontrados y corregidos durante la verificación:**
1. **En teléfono el panel abierto medía 130px** y la etiqueta quedaba cortada ("Construc"). La
   fórmula no respetaba el mínimo del panel abierto. Ahora mide 176px, con separación y
   etiqueta más compactas en teléfono.
2. **El formato cuadrado se estiraba** a 496×644 y recortaba 23% del video. Ahora queda
   cuadrado y centrado en alto.
3. **Riesgo de hidratación con movimiento reducido.** `useReducedMotion` da un valor distinto
   en el servidor y en el primer render del cliente. Solo se usa para la rotación (en efectos);
   las transiciones las apaga CSS.
4. **Aviso vacío pesado.** "Pronto verás aquí…" ocupaba 1224px en una caja punteada. Ahora es
   compacto.
5. **Nombre y cantidad repetidos.** Aparecían en el panel y en el encabezado de los logos. El
   panel quedó solo con el nombre, como en la referencia.

## 5. Cómo se probó con datos

La página real no tiene empresas ni video todavía. Para probar el comportamiento armé una
**página local de prueba**, que ya se borró y no se sube:
- **Giros:** los 5 reales.
- **Empresas:** en Servicios y Comercio, las Cuentas cuya categoría coincide exacto. Construcción
  (8) y Belleza (3) con fichas `[prueba]` e imágenes de relleno.
- **Foto de "Belleza":** el panel "Canyon" recortado de tu grabación.
- **Video:** tu propia grabación, copiada a `public/` solo durante la prueba.

Esas capturas quedaron fuera de `audit/`.

## 6. Pendiente

**Contenido, desde el Studio:**
- Asignar las empresas de cada giro.
- Subir logos a las Cuentas (hoy 0 de 26 tienen).
- Subir el video (y, si quieres, su portada) y elegir su formato.
- Opcional: una foto por giro.

**A confirmar:**
- La **captura de referencia** que mencionaste no llegó; solo el video. El diseño sigue el video
  y los diagramas del prompt.
- **Título a la izquierda o centrado** (ver 2).

**Despliegue:** sigue pendiente, junto con el resto de la v2 de Marketing Digital (ver
`MARKETING-DIGITAL-V2-RESULTADOS.md`).

## Archivos

**Web**
- `src/components/marketing/CarruselGiros.tsx` — nuevo.
- `src/components/marketing/VideoClientes.tsx` — nuevo.
- `src/components/marketing/ClientesCasos.tsx` — nueva estructura; marquesina y botón sin
  cambios.
- `src/lib/marketing-digital.ts` — giros con empresas, video y consulta.
- `src/app/globals.css` — movimiento reducido del carrusel.

**Studio**
- `studio/schemaTypes/marketing/clientsBanner.ts` — giros con empresas, video.
- `studio/schemaTypes/marketing/camposBase.ts` — opción `omitir`.
- `studio/schemaTypes/cuenta.ts` — vuelve a su versión original: sin "Video del caso".

**Scripts**
- `scripts/migrar-marketing-a-secciones.mjs` — sin el caso destacado.

**Evidencia**
- `audit/clientes-giros/` — capturas de la página real.
