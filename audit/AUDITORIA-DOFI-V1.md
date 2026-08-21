# AUDITORÍA DOFI — V1
### Sprint 00 · Diagnóstico visual, UX, estructural y de conversión

| | |
|---|---|
| **URL auditada** | `https://pagina-dofi.feniax-crm.workers.dev/` (staging en Cloudflare Workers) |
| **Commit desplegado** | `762945f` — idéntico al `main` local (verificado por orden de secciones y copy) |
| **Fecha** | 20 de agosto de 2026 |
| **Método** | Chrome headless real (Puppeteer), 5 viewports, medición del DOM en vivo + lectura del código fuente |
| **Puntuación global** | **38,5 / 100** |
| **Alcance** | Solo diagnóstico. No se modificó ni una línea del sitio. |

---

## 0. Cómo leer este documento

Todo número que aparece aquí está **medido**, no estimado a ojo. Cuando algo es una observación visual y no una medición, se marca explícitamente como `[observación]`. Cuando es un dato de instrumento, se marca `[medido]`.

Los archivos de evidencia visual están en `audit/screenshots/`:

```
desktop-1440.png / desktop-1440-full.png
laptop-1280.png  / laptop-1280-full.png
tablet-768.png   / tablet-768-full.png
mobile-390.png   / mobile-390-full.png
mobile-360.png   / mobile-360-full.png
```

(`-full` = página completa; el otro archivo es exactamente lo que se ve antes de hacer scroll.)

---

## 1. Acceso e inspección

**Sin limitaciones.** La URL pública respondió `HTTP 200` en 1,22 s, 236 KB de HTML, servida por Cloudflare (`x-opennext: 1`, `x-nextjs-prerender: 1`). Se pudo inspeccionar en su totalidad.

**Comparación local vs. público:** el repositorio local está en `762945f`, sincronizado con `origin/main`, y el HTML servido corresponde exactamente a ese commit (mismo orden de secciones: `top → clientes → servicios → proceso → herramientas → socio → contacto`, mismos textos). **No hay diferencia entre lo local y lo público.** No fue necesario levantar el servidor de desarrollo.

**Framework detectado:** Next.js 15 (App Router) + Tailwind v4 + Motion + Phosphor Icons + Sanity (headless CMS). Despliegue vía OpenNext sobre Cloudflare Workers.

### 1.1 Hallazgo de infraestructura, importante y no visible a simple vista

**Sanity está conectado en el código pero NO está sirviendo contenido en producción.** `[medido]`

El HTML servido no contiene ni una sola referencia a `cdn.sanity.io`, y todos los textos que deberían venir del CMS coinciden literalmente con los valores de respaldo escritos en `src/lib/sanity.ts` (`"Lo que hacemos"` línea 255, `"Hablemos"` línea 285, `wa.me/593999999999` línea 287).

Causa: `SANITY_PROJECT_ID` y `SANITY_DATASET` no están cargadas en el entorno del Worker. El código cae limpiamente al respaldo, así que la página no se rompe — pero **hoy el CMS es peso muerto: añade una capa de complejidad y no aporta nada editable.**

---

## 2. Mapa de la página real (lo que existe hoy)

```
┌─ NAVBAR fijo, 68 px ────────────────────────── conservar (rediseñar jerarquía)
│
├─ 1. HERO ─────────────── 900 px  (9,5 %) ───── reemplazar
│     "Un mar de ideas" + logo delfín. Sin CTA, sin propuesta de valor.
│
├─ 2. MURO DE CUENTAS ──── 218 px  (2,3 %) ───── reconsiderar
│     26 monogramas de 2 letras en marquesina. Sin logotipos reales.
│
├─ 3. CLIENTES ────────── 1748 px (18,4 %) ───── conservar pero rediseñar
│     Carrusel 3-en-3, 26 cuentas, 9 páginas. Misma imagen borrosa x26.
│
├─ 4. SERVICIOS ───────── 1152 px (12,2 %) ───── conservar y expandir
│     3 filas editoriales. La mejor pieza de diseño del sitio.
│
├─ 5. PROCESO ────────── 1246 px (13,1 %) ───── conservar (comprimir)
│     5 pasos con riel que se llena al hacer scroll.
│
├─ 6. MANIFIESTO ───────── 236 px  (2,5 %) ───── eliminar / reubicar copy
│     Marquesina de texto contorneado a 2,63:1 de contraste.
│
├─ 7. HERRAMIENTAS ───── 1279 px (13,5 %) ───── reubicar y reducir
│     Bento de 6 celdas. Kommo y CapCut sin logo (bug).
│
├─ 8. EL SOCIO ───────── 1322 px (13,9 %) ───── conservar pero rediseñar
│     Daniel Vallejo. Sin cargo, sin credenciales, sin oferta.
│
├─ 9. CONTACTO ────────── 818 px  (8,6 %) ───── conservar (arreglar destino)
│     Formulario + WhatsApp. El formulario no entrega el lead a nadie.
│
└─ 10. FOOTER ─────────── 562 px  (5,9 %) ───── conservar (arreglar enlaces)
      4 columnas, datos reales. Redes apuntan a las plataformas, no a DOFI.
```

**Altura total desktop: 9 480 px = 10,5 pantallas. Mobile 390: 11 431 px = 13,5 pantallas.** `[medido]`

**Dato revelador:** en mobile, la sección que más espacio ocupa de toda la página es **Herramientas (17,7 %)** — los logos de software de terceros reciben más superficie que los clientes, que los servicios y que el contacto. Es una inversión de prioridades literal, medible en píxeles.

---

## 3. Prueba de los primeros 5 segundos

*Lo que se ve antes de hacer scroll. Ver `desktop-1440.png` y `mobile-390.png`.*

En pantalla hay exactamente cuatro cosas: el logo pequeño arriba a la izquierda, cinco enlaces de navegación, un botón naranja "Iniciar proyecto", el titular gigante **"Un mar de ideas"**, la firma **"DOFI AGENCIA CREATIVA"** en versalitas espaciadas, y un delfín blanco de 430 px flotando a la derecha.

| Pregunta | Respuesta | Por qué |
|---|---|---|
| ¿Entiendo qué empresa es? | **Sí** | El nombre está escrito y el logo es visible. |
| ¿Entiendo qué vende? | **No** | "Agencia creativa" es una categoría, no una oferta. Nada dice campañas, video, CRM, pauta ni automatización. |
| ¿Entiendo para quién es? | **No** | Ni un solo indicio de sector, tamaño de empresa ni país. |
| ¿Entiendo qué resultado promete? | **No** | Cero mención de resultado, venta, lead o crecimiento. |
| ¿Entiendo qué la diferencia? | **No** | "Un mar de ideas" es un eslogan intercambiable con cualquier agencia del mundo. |
| ¿Sé qué debo hacer después? | **En desktop, a medias. En mobile, no.** | En desktop hay un botón naranja arriba a la derecha. **En mobile ese botón no existe** (ver §4.3). |
| ¿Existe un CTA principal inequívoco? | **No** | El único CTA vive en la barra, no en el hero. El hero no tiene ni un botón. |
| ¿Transmite una empresa premium? | **Parcialmente** | La tipografía, el color y la animación están bien ejecutados. Pero es un póster, no una página comercial. |
| ¿Parece una agencia genérica? | **Sí** | Quitando el logo, esta pantalla podría pertenecer a cualquier estudio creativo. |
| ¿Parece orientada a resultados? | **No** | Es una declaración poética. No hay ni un número, ni un verbo comercial, ni una promesa. |
| ¿Se entiende "Ventas Inteligentes"? | **No aparece en ninguna parte del sitio.** | Ni el concepto, ni FENIAX como marca, ni la idea de ecosistema. |
| ¿Hay demasiado ruido visual? | **No — hay lo contrario: demasiado vacío.** | El contenido ocupa 320 px de 900 (36 %). Hay ~230 px muertos arriba y ~250 px abajo. `[medido]` |

### Impresión como cliente potencial que nunca oyó hablar de DOFI

> *"Es bonito. Es una agencia. No sé qué me venden, no sé si trabajan con empresas como la mía, y no sé qué gano yo. Voy a hacer scroll un poco… y lo primero que me encuentro son 26 nombres de empresas que no conozco y tres rectángulos morados borrosos. Sigo sin saber qué hacen."*

El problema no es estético. **El hero cumple la función de una portada de portafolio, no la de una página que tiene que vender.** Presenta; no vende.

---

## 4. Auditoría del NAVBAR

### 4.1 Medidas `[medido]`

| Propiedad | Valor |
|---|---|
| Posición | `fixed`, `top: 0`, `z-index: 50` |
| Altura | **68 px** (constante en los 5 viewports) |
| Ancho de contenido | `max-width: 1400px` |
| Padding lateral | 20 px (< 768 px) · **32 px** (≥ 768 px) |
| Gutter visual real a 1440 px | **20 px** por lado |
| Fondo en reposo (scroll = 0) | `rgba(18,10,38,0)` — totalmente transparente |
| Fondo tras 40 px de scroll | `rgba(18,10,38,0.82)` + `backdrop-blur-xl` + borde `rgba(109,75,201,0.28)` |
| Transición | 400 ms, `cubic-bezier(0.16,1,0.3,1)` |
| Logo | 48 × 44 px |
| Enlaces | 5, `gap: 32px`, 14 px, color `#cbd5e1` |
| CTA | 175 × 48 px, fondo `#F47B20`, texto 14 px |
| Menú hamburguesa | **40 × 40 px** |

### 4.2 Diagnóstico

**Lo que funciona:**
- La altura de 68 px es correcta y no roba protagonismo.
- La transición de transparente a sólido tras 40 px está bien resuelta: gana contraste justo cuando lo necesita, con la curva de easing coherente con el resto del sitio.
- El contraste del texto de navegación es **12,5:1** sobre el fondo sólido. `[medido]` Cumple AA con holgura.
- 5 opciones es una cifra sana; no hay sobrecarga cognitiva.

**Lo que falla:**

1. **La jerarquía de los enlaces está ordenada por comodidad, no por valor comercial.** El orden actual es `Servicios · El Socio · Herramientas · Clientes · Proceso`. "Herramientas" (software de terceros) ocupa la tercera posición, por delante de "Clientes" (la prueba social). Es el elemento menos decisivo en el lugar más visible.

2. **El subrayado del hover no funciona.** `[medido]` El `<span>` que dibuja la línea naranja usa la clase `group-hover:w-full`, pero **el enlace no tiene la clase `group`**. El grupo más cercano es un ancestro que nunca recibe hover. Resultado: el subrayado nunca aparece; solo cambia el color del texto. Es un efecto escrito que está muerto. Ver `Nav.tsx:49-52`.

3. **No hay estado activo.** Ningún enlace indica en qué sección está el usuario. En una página de 10,5 pantallas con navegación por anclas, esto es una pérdida real de orientación.

4. **El logo mide 48 × 44 px y pesa 162 KB.** `[medido]` Ver §22 — es el recurso más pesado de toda la página.

5. **Densidad visual:** correcta en desktop. El problema es el reparto: `justify-between` con tres grupos deja los enlaces flotando en un centro óptico impreciso, sin relación con ninguna columna del contenido de abajo.

### 4.3 Mobile — el fallo más grave del navbar

**Por debajo de 640 px de ancho, el botón "Iniciar proyecto" desaparece de la barra.** `[medido]`

La clase es `hidden sm:block`, y el breakpoint `sm` de Tailwind es 640 px. En 390 px y en 360 px la barra contiene únicamente el logo y una hamburguesa de 40 × 40 px.

Consecuencia medible: **en mobile no existe ni un solo CTA visible hasta el píxel 7 301** (donde aparece el botón de la sección El Socio). Son **8,6 pantallas de scroll sin ninguna acción posible.**

Y cuando el usuario abre el menú, **"Iniciar proyecto" está maquetado exactamente igual que "Proceso" o "Clientes"**: mismo tamaño, mismo peso, mismo color, sin fondo, sin acento. El CTA principal del negocio es tipográficamente indistinguible de un enlace de navegación.

**Veredicto del navbar:** no distrae, no ocupa demasiado espacio, no tiene demasiadas opciones y sí parece premium. Pero **está mal jerarquizado y en mobile deja de ayudar a convertir por completo.**

---

## 5. Auditoría del HERO

### 5.1 Inventario y medidas `[medido]`

| Elemento | Desktop 1440 | Mobile 390 |
|---|---|---|
| Altura de sección | `min-h: 100dvh` → 900 px | 844 px |
| H1 (tamaño real renderizado) | **144 px** | 51,2 px |
| H1 line-height | 132,5 px (0,92) | 47,1 px |
| H1 tracking | −0,8 px | −0,8 px |
| Ancho del bloque de texto | 869 px | 350 px |
| Eyebrow | **no existe** | — |
| Subtítulo | **no existe** | — |
| Firma bajo el titular | 14 px, peso 300, tracking **7,7 px** (0,55em) | 12 px, tracking 3,84 px |
| Separación H1 → firma | **40 px** | 40 px |
| CTA primario | **ninguno** | ninguno |
| CTA secundario | **ninguno** | ninguno |
| Marca (delfín) | 430 px de ancho, `aria-hidden` | 188 px |
| Fondo | radial `#2A1760 → #170D33 → #120A26` | idem |
| Capa animada | canvas `OceanCurrent`, 26 curvas, opacidad 0,4 | idem |
| Ocupación vertical del contenido | **320 px de 900 = 36 %** | ~300 px de 844 = 36 % |

### 5.2 Respuestas directas

**¿El hero vende o solamente presenta?**
**Presenta.** Es una portada. No hay una sola palabra orientada a la acción ni al beneficio.

- **¿El H1 habla de resultados o de la empresa?** De ninguno de los dos: habla de una **metáfora**. "Un mar de ideas" no describe ni a la empresa ni a un resultado.
- **¿Hay propuesta de valor?** No.
- **¿Existe promesa diferenciadora?** No.
- **¿Existe razón para seguir haciendo scroll?** Solo curiosidad estética. No hay pregunta abierta, ni promesa, ni indicador de scroll, ni nada que "tire" hacia abajo.
- **¿Demasiados elementos?** No. **Demasiado pocos:** dos textos y una imagen.
- **¿La composición se siente intencional?** Sí en el eje horizontal (texto izquierda / marca derecha, con la respiración bien calibrada). No en el vertical: 230 px muertos arriba y 250 px abajo sin ningún elemento que justifique ese vacío.
- **¿El visual comunica o decora?** **Decora.** El delfín está marcado `aria-hidden` y no aporta información; a 430 px lee más como un trazo blanco abstracto que como el símbolo de la marca. `[observación]`
- **¿La ubicación de los elementos es correcta?** El eje horizontal, sí. El vertical desperdicia un tercio de la pantalla más valiosa del sitio.
- **¿Usa bien el espacio disponible?** No. El 64 % del primer viewport está vacío en una página que necesita explicar tres marcas y un modelo de negocio.

### 5.3 El canvas `OceanCurrent`

Dibuja 26 curvas por fotograma, a 60 fps, mientras el hero está visible. Está bien programado (se detiene al salir de viewport y con la pestaña oculta, respeta `prefers-reduced-motion`, no toca el estado de React). **Pero a opacidad 0,4 sobre el degradado es prácticamente invisible en desktop** `[observación — comparar desktop-1440.png]`. En mobile sí se ve, y ahí lee como arañazos naranjas más que como corrientes marinas.

Es trabajo de ingeniería bien hecho con retorno visual casi nulo.

---

## 6. Auditoría sección por sección

### 6.1 MURO DE CUENTAS · `LogoWall`
*Altura 218 px · sin `id` · full-bleed (única sección que no respeta el contenedor de 1400 px)*

| | |
|---|---|
| **Qué intenta comunicar** | "Estas 26 marcas ya confían en nosotros." |
| **Qué comunica realmente** | "Aquí van a ir unos logos cuando los tengamos." `[observación]` |
| **Qué funciona** | La marquesina en bucle continuo es técnicamente impecable: tira duplicada, traslado 0 → −50 %, sin costura, se pausa al pasar el cursor, y la velocidad se recalcula sola según el número de cuentas. Es la mejor pieza de ingeniería de animación del sitio. |
| **Qué falla** | **No hay ni un logotipo real.** Cada cuenta es un cuadrado con sus dos primeras letras: `EL` para El Horno y `EL` para El Cobayo; `CO` se repetiría tres veces. Los monogramas no identifican nada y leen como *placeholder*. |
| | El rótulo *"Cuentas que confían su marca y su CRM a este equipo"* va en 14 px, `mist-dim`, centrado. Es la afirmación de confianza más fuerte de toda la página y está tipografiada como un pie de foto. |
| | El fondo `bg-deep/40` es casi indistinguible del `abyss` de las secciones vecinas: la franja no se lee como una zona propia. |
| **Importancia** | Alta — es prueba social en el primer scroll. |
| **Densidad** | Baja. 218 px para 26 marcas es correcto. |
| **Conversión / Confianza** | Potencial altísimo, ejecución mínima. |
| **Recomendación** | **CONSERVAR PERO REDISEÑAR** — el mecanismo se queda, el contenido se sustituye por logotipos reales. |

---

### 6.2 CLIENTES · `#clientes`
*Desktop 1748 px (18,4 % de la página) · Mobile 1502 px · padding vertical 192 px arriba y abajo*

| | |
|---|---|
| **Qué intenta comunicar** | "Mira el trabajo real que hemos hecho para cada marca." |
| **Qué comunica realmente** | "Tenemos 26 clientes y ninguna imagen de ninguno de ellos." |
| **Qué funciona** | El copy de cada tarjeta es **específico y comercialmente útil**: *"Venta por rutas ordenada en cuatro embudos y material de catálogo para el equipo comercial"*. Eso es exactamente lo que un prospecto necesita leer. Los chips de sector y de servicios están bien pensados. Cada tarjeta enlaza a su propia página (26 páginas SSG). El carrusel tiene `role="region"`, `aria-roledescription`, pausa al hover y al foco, y los clones quedan fuera del árbol de accesibilidad. Técnicamente, muy correcto. |
| **Qué falla — el problema visual nº 1 del sitio** | **Las 26 tarjetas usan exactamente la misma imagen**: `/media/cover-16-9.jpg`. `[medido — 30 instancias del mismo src en el DOM]` |
| | Peor: esa imagen es un **degradado abstracto de 950 × 534 px (horizontal)** recortado dentro de un marco de **423 × 753 px (vertical, 9:16)**. El recorte central de una imagen sin contenido produce un rectángulo morado y naranja borroso. |
| | **El 78 % de la superficie de cada tarjeta es ese vacío borroso.** En desktop se ven tres seguidos, idénticos. |
| | Cada tarjeta mide **425 × 971 px** en desktop y **330 × 824 px** en mobile — es decir, **en mobile una sola tarjeta ocupa el 98 % de la pantalla.** |
| | Con 26 cuentas y avance automático cada 5 s, recorrer el carrusel completo en mobile exige **26 páginas = 130 segundos** o 26 toques. |
| **Importancia** | Máxima. Es la prueba de que el trabajo existe. |
| **Densidad** | Muy baja: mucha superficie, poquísima información por píxel. |
| **Jerarquía** | Invertida — la imagen vacía domina; el texto útil vive comprimido en el 20 % inferior. |
| **Espaciado** | El H2 (60 px) y su párrafo se separan solo **24 px**; luego hay **64 px** hasta las tarjetas y **192 px** de padding inferior. |
| **Conversión** | Negativa hoy: la repetición visual sugiere que no hay material real. |
| **Recomendación** | **CONSERVAR PERO REDISEÑAR** — la información es correcta, el contenedor y el material no. |

---

### 6.3 SERVICIOS · `#servicios`
*Desktop 1152 px · Mobile 1300 px*

| | |
|---|---|
| **Qué intenta comunicar** | "Hacemos tres cosas y se sostienen entre sí." |
| **Qué comunica realmente** | Eso mismo — pero solo tres cosas, y muy en abstracto. |
| **Qué funciona** | **Es la mejor pieza de diseño de la página.** La decisión de descartar tres tarjetas iguales y usar filas editoriales a ancho completo está bien tomada y bien ejecutada. La microanimación tiene tres capas coordinadas (barrido de superficie desde el lado por el que entra el cursor, sangría del contenido, icono y flecha al acento), todas de `transform` y `color`, ninguna de layout. El copy es concreto: *"Cada conversación queda registrada, asignada y medida. Nada se enfría en una bandeja."* |
| **Qué falla** | **1. Falsa affordance.** Cada fila termina en una flecha `↗` — el signo universal de "esto lleva a algún sitio". **Las filas no son enlaces**: son `<li>` sin `href`. El usuario intenta hacer clic y no pasa nada. |
| | **2. Solo hay 3 servicios y son etiquetas de categoría, no ofertas.** "Marketing Digital 360", "CRM", "Inteligencia Artificial". No aparecen Meta Ads, TikTok Ads, Community Management, producción audiovisual, funnels, landing pages, GoHighLevel, capacitaciones ni asesorías. El ecosistema real de DOFI + FENIAX + El Socio no está representado. |
| | **3. Vacío estructural dentro de la fila.** La retícula es `auto \| 1fr \| 22rem \| auto`. El título ocupa la columna `1fr`, así que la fila **"CRM"** (tres caracteres) deja **~800 px de vacío** entre el título y la descripción. `[medido — título 48 px, columna de descripción 352 px, ancho útil 1336 px]` |
| | **4. Desajuste de medida.** El bloque de cabecera está limitado a `34rem` (544 px) mientras las filas ocupan los 1336 px completos. Dos anchos distintos sin transición. |
| **Importancia** | Máxima. |
| **Densidad** | Baja en desktop, correcta en mobile. |
| **Recomendación** | **CONSERVAR** el sistema de filas · **EXPANDIR** el contenido a la arquitectura real de 3 marcas · **CONVERTIR** las filas en enlaces reales. |

---

### 6.4 PROCESO · `#proceso`
*Desktop 1246 px · fondo con degradado `#120A26 → #1A0F3D` (única sección con transición cromática)*

| | |
|---|---|
| **Qué intenta comunicar** | "Así se trabaja con nosotros, paso a paso." |
| **Qué comunica realmente** | Exactamente eso. **Es la sección que mejor cumple su función.** |
| **Qué funciona** | Los 5 verbos (Escuchamos · Creamos · Producimos · Conectamos · Medimos) son claros y honestos. El riel vertical que se llena con el scroll (`useScroll` + `useSpring`, rigidez 90 / amortiguación 24) comunica avance y ordena la lectura: **es la única animación de la página que es funcional, no decorativa.** El punto se centra con el título vía flexbox en lugar de un offset fijo — decisión correcta. El degradado de fondo es el único cambio cromático real de la página y funciona como respiro. |
| **Qué falla** | **1. Medio lienzo vacío.** Los textos van a `max-w-[52ch]` dentro de un contenedor de 1336 px. **La mitad derecha de la sección (≈700 px de ancho × 1246 px de alto) está permanentemente vacía.** No hay nada — ni visual, ni dato, ni pieza — que justifique ese vacío. |
| | **2. El paso "Conectamos" menciona FENIAX** (*"FENIAX monta el CRM y el bot"*) y es la **única aparición de FENIAX en todo el cuerpo de la página**, enterrada en el cuarto de cinco pasos. |
| | **3. Sin numeración visible.** Es un `<ol>` semánticamente, pero visualmente los pasos no llevan número; el punto de 6-8 px no comunica orden. |
| | **4. El H2 es de 48 px** mientras Clientes, Servicios, Herramientas y Contacto usan 60 px. Sin motivo aparente. |
| **Importancia** | Alta — es donde se construye la confianza en el método. |
| **Recomendación** | **CONSERVAR** · comprimir altura · aprovechar la mitad derecha · numerar. |

---

### 6.5 MANIFIESTO
*236 px · sin `id`, solo `aria-label="Eslogan de la agencia"`*

| | |
|---|---|
| **Qué intenta comunicar** | Cuatro frases de posicionamiento en marquesina continua. |
| **Qué comunica realmente** | Ruido tipográfico. |
| **Qué falla** | **1. Contraste 2,63:1.** `[medido]` El texto va en contorno `rgba(255,255,255,0.3)` sobre `#120A26`. **Falla WCAG AA (mínimo 3:1 incluso para texto grande).** |
| | **2. Las frases nunca se leen completas en reposo.** La marquesina siempre corta por ambos bordes: hay que esperar a que pase. |
| | **3. Colisión de trazos.** A `7,5vw` con `tracking-tighter` y contorno de 1 px, los glifos se solapan y generan artefactos visuales. |
| | **4. La ironía central:** *"Piezas que se ven"* y *"Sistemas que venden"* son **el mejor copy de posicionamiento de todo el sitio** — dicen exactamente lo que hace DOFI y lo que hace FENIAX — y están renderizadas en el elemento menos legible de la página. |
| **Importancia** | El contenedor: nula. El contenido: máxima. |
| **Recomendación** | **ELIMINAR el contenedor · RESCATAR el copy** y llevarlo al hero o a la sección de posicionamiento. |

---

### 6.6 HERRAMIENTAS · `#herramientas`
*Desktop 1279 px · **Mobile 2021 px — la sección más alta de la página en mobile (17,7 %)***

| | |
|---|---|
| **Qué intenta comunicar** | "Dominamos este stack." |
| **Qué comunica realmente** | Una lista de software de terceros, con el logo de Meta más visible que el de Kommo. |
| **Qué funciona** | El bento de 6 columnas está bien planteado (Kommo `3×2` destacado, dos celdas `3×1`, tres celdas `2×1`). El tratamiento cromático es elegante: las marcas viven en gris y recuperan su color al pasar el cursor, con `filter: grayscale` para los archivos propios y `currentColor` para los SVG. El copy es específico. |
| **Qué falla** | **1. Bug real: Kommo y CapCut no muestran su logotipo.** `[medido]` El HTML servido no contiene ni una referencia a `marcas/kommo.png` ni a `marcas/capcut.png`, aunque los archivos existen y se sirven correctamente (`HTTP 200`). La función `logoPropio()` en `Tools.tsx:105-113` usa `existsSync(process.cwd() + "/public/marcas/...")`, y esa comprobación **no resuelve en el build de OpenNext sobre Workers**. Resultado: caen al modo *wordmark*. |
| | **2. Consecuencia visual grave:** al caer al wordmark, el `h3` conserva la clase `tool-mark` (color `mist`, `#B3A5D4`) en lugar de `foam`. **"Kommo" — la herramienta insignia de FENIAX — se renderiza más apagado que "Meta Ads".** `[medido: Kommo rgb(179,165,212) vs Meta Ads rgb(244,240,254)]` La celda destacada es la menos destacada. |
| | **3. Vacío interno.** La celda de Kommo mide 656 × 430 px con `justify-between`: el chip de rol arriba, el contenido abajo y **~250 px de nada en medio.** |
| | **4. Prioridad invertida en mobile:** 2 021 px — más que Clientes (1 502), más que Servicios (1 300), más que Contacto (1 265). El usuario de móvil dedica más scroll a los logos de Meta y TikTok que a las marcas que DOFI atiende. |
| **Importancia** | Media-baja. Nadie contrata una agencia por su stack. |
| **Recomendación** | **REUBICAR Y REDUCIR** — comprimir a una franja, moverla después de la prueba real. |

---

### 6.7 EL SOCIO · `#socio`
*Desktop 1322 px · fondo `#1A0F3D` (uno de los dos cambios de superficie del sitio)*

| | |
|---|---|
| **Qué intenta comunicar** | "Detrás de esto hay una persona con criterio." |
| **Qué comunica realmente** | "Hay un señor llamado Daniel." |
| **Qué funciona** | La familia de layout es propia y acertada: el retrato queda anclado con `position: sticky` mientras el relato pasa al lado — CSS puro, sin scroll hijack, no se puede romper. El cambio de superficie a púrpura rompe la monotonía sin invertir el tema. El copy es honesto y está escrito sin cifras inventadas. La cita en `blockquote` (*"Una marca no necesita más publicaciones. Necesita que cada persona que levanta la mano encuentre a alguien del otro lado"*) es buena. |
| **Qué falla** | **1. Cero credenciales.** No hay cargo, ni años de experiencia, ni formación, ni empresas anteriores, ni LinkedIn, ni una sola prueba de autoridad. |
| | **2. Cero oferta.** El brief define El Socio como capacitaciones, asesorías, consultoría, cursos, reserva de citas y pago de asesorías. **Nada de eso existe en la página.** El CTA es el mismo genérico "Iniciar proyecto" que apunta al formulario común. |
| | **3. Problema de fotografía.** `[observación]` El retrato es un recorte de la figura compuesto sobre un fondo de galaxia púrpura, con marca de agua de DOFI visible en la parte inferior y un borde de recorte perceptible en el hombro izquierdo. Lee como gráfico de redes sociales, no como retrato de agencia. Es, junto a las portadas de cliente, lo que más baja la percepción premium. |
| | **4. Inversión de jerarquía:** *"Daniel Vallejo"* se renderiza a **72 px** — **el texto más grande de toda la página**, por encima de cualquier H2 comercial. Un nombre propio pesa más que cualquier mensaje de negocio. |
| | **5. Vacío estructural:** la retícula es `26rem \| 1fr` (columna de texto ≈ 950 px) pero el contenido está limitado a `42rem` (672 px) → **≈280 px permanentemente vacíos a la derecha**, más ~400 px bajo el retrato. |
| **¿DOFI se siente como empresa real, agencia anónima, marca personal o plantilla?** | **Marca personal incompleta.** No hay sección de equipo. La única cara del sitio es Daniel, sin cargo ni credenciales. No se percibe estructura de empresa. |
| **Recomendación** | **CONSERVAR PERO REDISEÑAR** — el layout sticky se queda; el contenido necesita autoridad, oferta propia y una fotografía profesional. |

---

### 6.8 CONTACTO · `#contacto`
*Desktop 818 px — la sección más eficiente de la página*

| | |
|---|---|
| **Qué funciona** | Copy claro y sin fricción (*"Cuéntanos qué vendes y a quién. En la primera llamada sales con una ruta clara, con o sin nosotros"*). 4 campos, uno opcional. Validación en cliente con mensajes útiles, `aria-invalid`, `aria-describedby`, `aria-live="polite"` para el resultado. Expectativa explícita: *"Respondemos en menos de 24 horas hábiles"*. Doble canal: formulario + WhatsApp. **Está bien construido.** |
| **Qué falla — CRÍTICO** | **1. El formulario no entrega el lead a nadie.** `src/app/api/contacto/route.ts:33` valida y hace `console.log(...)`. En Cloudflare Workers ese log se pierde. **Cada formulario enviado desde el sitio en producción se está perdiendo.** El usuario ve *"Mensaje recibido. Te contactamos muy pronto"* y no llega a ninguna bandeja, ningún correo, ningún CRM. |
| | **2. El botón de WhatsApp apunta a un número falso:** `https://wa.me/593999999999`. `[medido en el HTML servido]` El número real (`+593 98 447 2869`) sí está en el pie. Es decir: **el CTA de WhatsApp de la sección de conversión lleva a un número inexistente, mientras el número correcto está enterrado en el footer.** |
| | **3. Inversión de prominencia entre canales.** El botón de WhatsApp (244 × 50 px, fondo translúcido `brand/25`) es visualmente más débil que el `submit` del formulario (620 × 52 px, naranja sólido). En Ecuador, WhatsApp suele ser el canal de mayor conversión; aquí está tratado como opción secundaria. |
| | **4. El `submit` mide 620 × 52 px con texto de 14 px** — un botón del ancho completo de la columna con una etiqueta minúscula dentro. Desproporción. |
| | **5. No hay reserva de cita ni pago de asesoría**, pese a estar en el modelo de El Socio. |
| | **6. Sin nota de privacidad** — relevante si se van a correr campañas de Meta con formularios. |
| **Recomendación** | **CONSERVAR** la estructura · **ARREGLAR** destino del formulario y número de WhatsApp (ambos P0). |

---

### 6.9 FOOTER
*562 px desktop · 1080 px mobile*

| | |
|---|---|
| **Qué funciona** | Cuatro columnas bien equilibradas (`1.4fr 1fr 1fr 1fr`). Datos reales: teléfono, correo, ciudad, horario. El lockup completo del logo con claim. Contraste `fog` sobre `abyss` = 13,5:1. `[medido]` **Es una de las piezas mejor resueltas del sitio.** |
| **Qué falla** | **1. Los tres enlaces de redes apuntan a las plataformas, no a DOFI:** `https://instagram.com`, `https://tiktok.com`, `https://linkedin.com`. `[medido]` Para una agencia que vende gestión de redes, es el fallo de credibilidad más barato de arreglar y el más caro de dejar. |
| | **2. Correo `@gmail.com`.** Una agencia que se posiciona como premium y vende sistemas empresariales se presenta con una cuenta de correo gratuita. `[observación de percepción]` |
| | **3. La frase de posicionamiento más clara de todo el sitio** — *"Creatividad, producción y CRM para marcas que necesitan vender, no solo publicar"* — está aquí, en 14 px, en el último 6 % de la página. Debería estar en el hero. |
| | **4. FENIAX aparece solo como *"Sistemas por FENIAX"*** en la línea de copyright. Una marca completa del ecosistema reducida a un crédito de pie de página. |
| | **5. Sin enlaces legales** (privacidad, términos). |
| **Recomendación** | **CONSERVAR** · arreglar enlaces de redes · subir la frase de posicionamiento. |

---

## 7. Auditoría de ESPACIADO

### 7.1 Tabla de mediciones reales `[medido]`

| Zona | Desktop 1440 | Mobile 390 | Juicio |
|---|---|---|---|
| Padding lateral del contenedor | 32 px | 20 px | Correcto |
| **Gutter visual real a 1440 px** | **20 px por lado** | — | Demasiado justo |
| `max-width` del contenedor | 1400 px (8/8 secciones) | idem | **Consistente** |
| Padding vertical Clientes / Servicios / Herramientas / Socio | 192 / 192 px | 128 / 128 px | Excesivo |
| Padding vertical Proceso / Contacto | 144 / 144 px | 112 / 112 px | Aceptable |
| Padding vertical Muro / Manifiesto | 56 / 64 px | idem | Correcto |
| **H2 (60 px) → párrafo de apoyo** | **24 px** | 24 px | Ver 7.3 |
| H1 (144 px) → firma | 40 px | 40 px | Ver 7.3 |
| Cabecera de sección → contenido | 64–80 px | 64–80 px | Correcto |
| H3 de celda (24 px) → párrafo | 12 px | 12 px | Correcto |
| Separación entre tarjetas del carrusel | 20 px (`px-2.5` ×2) | 20 px | Escaso para tarjetas de 971 px |
| Separación entre celdas del bento | 16 px | 16 px | Correcto |

### 7.2 El problema nº 1: secciones pegadas por color y separadas por vacío

Cuatro secciones consecutivas comparten **exactamente el mismo color de fondo** (`rgb(18,10,38)`): Clientes, Servicios, Manifiesto y Herramientas. Como cada una aporta 192 px de padding, entre el último elemento de una y el primero de la siguiente hay:

```
Clientes  ──192 px── │ ──192 px──  Servicios     =  384 px de vacío sin cambio de color
Servicios ──192 px── │ ──144 px──  Proceso       =  336 px
Herram.   ──192 px── │ ──192 px──  Socio         =  384 px
```

**384 píxeles de negro idéntico entre dos secciones distintas.** El vacío no separa: solo alarga. Sin cambio de superficie, sin línea, sin cambio de ritmo, el ojo no registra que empezó otra cosa — solo registra que la página no se acaba nunca.

Es el motivo principal de que el sitio mida 10,5 pantallas cuando el contenido real cabe en 6.

### 7.3 El problema nº 2: el ritmo vertical no escala con la tipografía

Todas las cabeceras de sección usan `mt-6` (24 px) entre el H2 y su párrafo de apoyo, **con independencia del tamaño del H2**:

| Sección | Tamaño del H2 | Separación al párrafo | Ratio |
|---|---|---|---|
| Clientes (desktop) | 60 px | **24 px** | **0,40×** |
| Clientes (mobile) | 36 px | **24 px** | 0,67× |
| Servicios (desktop) | 60 px | **24 px** | **0,40×** |
| Herramientas (desktop) | 60 px | **24 px** | **0,40×** |
| Contacto (desktop) | 60 px | **24 px** | **0,40×** |

En mobile el ratio (0,67×) funciona. En desktop, con el mismo valor absoluto sobre una tipografía un 67 % más grande, **el párrafo queda visualmente colgado del titular** en lugar de leerse como un bloque con dos niveles. Concretamente:

> Entre el H2 de 60 px de "Marcas que ya están en el agua" y su párrafo hay **24 px**. Para una escala de 60 px, la separación coherente estaría entre **32 y 44 px**. Los 24 px actuales son la separación adecuada para un titular de 36 px, no para uno de 60.

Lo mismo en el hero: **40 px** entre un H1 de 144 px y la firma. Sobre 144 px de altura tipográfica, 40 px hacen que la firma parezca un descuelgue del titular y no un elemento propio.

**Diagnóstico preciso:** la escala tipográfica es fluida (36 → 60 px vía `md:`), pero el espaciado es fijo. Falta un ritmo vertical que escale con el breakpoint.

### 7.4 El problema nº 3: cinco medidas distintas para el mismo tipo de bloque

Todas las cabeceras de sección cumplen la misma función, y cada una tiene un ancho máximo diferente `[medido]`:

| Sección | `max-width` | Píxeles |
|---|---|---|
| Servicios | `34rem` | 544 px |
| Herramientas | `36rem` | 576 px |
| Clientes | `40rem` | 640 px |
| Socio | `42rem` | 672 px |
| Contacto | `48ch` | ≈ 620 px |
| Proceso (H2) | `22ch` | ≈ 812 px |

Seis valores distintos para seis bloques equivalentes. No hay una decisión de sistema detrás; hay seis decisiones locales. **Esto es exactamente lo que impide que la página se lea como un sistema único.**

### 7.5 Vacíos estructurales — superficie muerta medida

| Zona | Vacío | Causa |
|---|---|---|
| Hero, franja inferior | ~250 px × 1 400 px | Contenido centrado en un `min-h-100dvh` sin nada que ancle abajo |
| Hero, franja superior | ~230 px × 1 400 px | Idem |
| Proceso, mitad derecha | ~700 px × 1 246 px | `max-w-[52ch]` dentro de 1 336 px |
| Socio, franja derecha | ~280 px × 1 322 px | `max-w-[42rem]` dentro de una columna de ~950 px |
| Socio, bajo el retrato | ~400 px × 416 px | Columna sticky más corta que la de texto |
| Herramientas, celda Kommo | ~250 px × 656 px | `justify-between` con solo dos hijos |
| Fila "CRM" de Servicios | ~800 px × 190 px | Columna `1fr` para un título de 3 caracteres |

**Ninguno de estos vacíos está justificado por una decisión de composición.** Son residuo de contenedores que no se llenaron.

---

## 8. Auditoría del GRID

### 8.1 Lo que está bien — y es notable

**Las 8 secciones usan `max-width: 1400px` + `mx-auto` + `px-5 md:px-8`.** `[medido en las 8]`
A 1440 px de viewport, todas alinean su borde izquierdo en **x = 52 px**, sin una sola excepción.

**Hay una línea vertical imaginaria y se respeta.** Esto es más de lo que tiene la mayoría de sitios de agencia. El contenedor no es el problema.

### 8.2 Inconsistencias detectadas

| # | Inconsistencia | Detalle |
|---|---|---|
| 1 | **Seis medidas de texto distintas** | 34rem / 36rem / 40rem / 42rem / 48ch / 22ch para bloques equivalentes (§7.4) |
| 2 | **El muro de cuentas rompe el contenedor** | Única sección full-bleed. Defendible para una marquesina, pero no está declarado como decisión: es el único elemento sin contenedor. |
| 3 | **Cuatro retículas internas sin relación entre sí** | Servicios `auto\|1fr\|22rem\|auto` · Herramientas 6 columnas · Socio `26rem\|1fr` · Contacto `1fr\|1fr` · Footer `1.4fr\|1fr\|1fr\|1fr`. Cinco sistemas distintos dentro del mismo contenedor. |
| 4 | **Los gaps horizontales no comparten escala** | Servicios 40 px · Herramientas 16 px · Socio 96 px · Contacto 96 px · Footer 40 px |
| 5 | **La cabecera de sección y su contenido usan anchos distintos** | En Servicios: cabecera 544 px, filas 1 336 px. El ojo lee dos columnas donde debería leer una. |
| 6 | **Tres tamaños de H2** | 72 px (Socio) · 60 px (Clientes, Servicios, Herramientas, Contacto) · 48 px (Proceso). Sin criterio. |
| 7 | **El gutter a 1440 px es de 20 px** | El contenedor de 1 400 px sobre un viewport de 1 440 px deja el contenido a 20 px del borde del navegador. En pantallas de 1440 el sitio se siente "apretado contra el cristal". |

**Respuesta a la pregunta de fondo:** *¿los elementos parecen pertenecer al mismo sistema?*
**El contenedor sí. El interior no.** Hay un grid maestro sólido y cinco micro-sistemas independientes dentro.

---

## 9. Auditoría TIPOGRÁFICA

### 9.1 Familias

| Rol | Familia | Origen |
|---|---|---|
| Display | **Sora** (variable, 300–800) | Auto-alojada, `woff2` local, 68 KB |
| Texto | **Geist Sans** | Paquete oficial, 33 KB |

Dos familias, bien elegidas y bien contrastadas entre sí. **Auto-alojadas** — decisión correcta (evita la dependencia de red que colgó builds anteriores). `display: swap` activo.

### 9.2 Escala real medida `[medido, desktop 1440]`

| Rol | Tamaño | Peso | Line-height | Tracking | Color |
|---|---|---|---|---|---|
| H1 (hero) | **144 px** | 800 | 0,92 | −0,8 px | `foam` |
| H2 Socio | **72 px** | 800 | 1,00 | −3,6 px | `foam` |
| H2 estándar | **60 px** | 800 | 1,02 | −3,0 px | `foam` |
| H2 Proceso | **48 px** | 800 | 1,05 | −2,4 px | `foam` |
| H3 fila de servicio | **48 px** | 800 | 1,00 | −2,4 px | `foam` |
| H3 paso / Kommo | **36 px** | 800 | 1,11 | −1,8 / −0,9 px | `foam` / **`mist`** |
| Cita | **36 px** | 700 | 1,38 | −0,9 px | `foam` |
| H3 tarjeta / celda | **24 px** | 700/800 | 1,33 | −0,6 px | `foam` |
| Body large | **18 px** | 400 | 1,63 | normal | `mist` |
| Body | **16 px** | 400 | 1,63 | normal | `mist` |
| H3 footer | **18 px** | 700 | 1,56 | −0,45 px | `foam` |
| Small | **14 px** | 400 | 1,63 | normal | `fog` / `mist` |
| Botón | **14 px** | 600 | 1,43 | +0,35 px | — |
| Firma hero | **14 px** | 300 | 1,43 | **+7,7 px (0,55em)** | `mist` |
| Eyebrow | **11 px** | 500 | 1,50 | **+3,3 px (0,30em)** | `accent` |
| Chip | **11 px** | 400 | — | +wider | `fog` |

### 9.3 Diagnóstico

**¿Existe una escala real?**
**Existe a medias.** Los tokens de color, familia y peso están bien centralizados en `globals.css` (`@theme`). Pero los **tamaños se declaran ad hoc en cada componente** con utilidades sueltas (`text-4xl md:text-6xl`, `text-5xl md:text-7xl`, `text-3xl md:text-5xl`, `text-[clamp(...)]`). No hay tokens de escala tipográfica.

**Problemas concretos:**

1. **Tres tamaños de H2 sin criterio** (72 / 60 / 48). El más grande es el nombre de una persona.
2. **Cuatro tamaños de H3** (48 / 36 / 24 / 18) que se solapan con los H2 — un H3 de 48 px y un H2 de 48 px conviven en la misma página con jerarquías distintas. La estructura visual y la semántica no coinciden.
3. **`Kommo` en color `mist` en lugar de `foam`** — el único título de celda desatendido (§6.6).
4. **Tracking de 0,55em en la firma del hero** (14 px con 7,7 px de separación). A ese nivel las letras dejan de formar palabra; se lee carácter a carácter. Es el tracking más extremo del sitio y está en el elemento que identifica la marca.
5. **11 px para los eyebrows.** Es el tamaño mínimo legible cómodo; en mobile con `tracking 0,3em` cuesta leerlos.
6. **Longitud de línea:** el `body` a 18 px con 640 px de ancho da ≈ 75 caracteres — correcto. En cambio la descripción de las filas de servicio va a 16 px en 352 px ≈ 46 caracteres: columna demasiado estrecha junto a un título de 48 px.
7. **Once valores distintos de line-height** (0,92 / 1,00 / 1,02 / 1,05 / 1,11 / 1,33 / 1,38 / 1,43 / 1,50 / 1,56 / 1,63). No hay escala de interlineado.
8. **Uppercase:** usado con moderación y bien (solo eyebrows, firma y chips de rol). No hay abuso.

---

## 10. Auditoría de CARDS

| Familia | Cantidad | Medidas desktop | Radio | Borde | Fondo | Sombra |
|---|---|---|---|---|---|---|
| Tarjeta de cliente | 26 (3 visibles) | **425 × 971 px** | 20 px | `brand-lift/25` | `deep/40` | ninguna |
| Celda de herramienta | 6 | 656×430 / 656×207 / 434×207 | 20 px | `brand-lift/25` | `deep/40` | ninguna |
| Retrato del socio | 1 | 415 × 580 px | 20 px | `brand-lift/25` | — | ninguna |
| Campo de formulario | 4 | var. × 50 px | 12 px | `brand-lift/40` | `surface/70` | ninguna |
| Chip / píldora | ~40 | var. × 26 px | pill | `brand-lift/30` | transparente | ninguna |

### Diagnóstico

**Lo que está bien:**
- **La escala de radios es coherente y está documentada:** pill para interactivo, 20 px para tarjetas, 12 px para campos. Se respeta en todo el sitio.
- **Sin sombras.** Decisión correcta y valiente para un tema oscuro: las sombras sobre fondo oscuro producen suciedad. Se usa borde + superficie translúcida en su lugar. Es la decisión más "premium" del sistema.
- Los hovers son de color y transform, nunca de layout.

**Lo que falla:**

1. **La tarjeta de cliente mide 971 px de alto** — más que el viewport de un portátil. Y el 78 % de ese alto es una imagen vacía. **No es una tarjeta, es un póster con un pie.**
2. **Proporción forzada:** imagen `9/16` (vertical) alimentada con un archivo `16/9` (horizontal). El recorte central es puro azar.
3. **La celda de Kommo tiene 250 px de vacío interno** por `justify-between` con dos hijos.
4. **`bg-deep/40` sobre `abyss` es casi imperceptible** — las tarjetas se sostienen únicamente por el borde a 25 % de opacidad. En pantallas poco calibradas los bordes desaparecen y las tarjetas dejan de leerse como objetos. `[observación]`

**¿Parecen premium, SaaS genérico, plantilla o custom?**
El **sistema** (radios, bordes, ausencia de sombra, superficie translúcida) es **custom y de buen gusto**. El **contenido** que llevan dentro es lo que las hace parecer plantilla sin terminar.

**Qué podría dejar de ser card:**
- Las 6 celdas de herramientas → una franja de logos con rol, sin contenedor.
- Las tarjetas de cliente → formato editorial más ancho y bajo, o bento con jerarquía real (un caso destacado grande + varios secundarios).
- Los chips de servicio → se quedan, funcionan.

---

## 11. Auditoría de IMÁGENES, VIDEO E ICONOGRAFÍA

### 11.1 Inventario real `[medido]`

| Recurso | Instancias | Natural | Renderizado | Peso servido |
|---|---|---|---|---|
| `/media/cover-16-9.jpg` | **30** | 950 × 534 | 423 × 753 | 13 KB |
| `/logo-dofi-compact.png` | 1 (nav) | 512 × 465 | 48 × 44 | **162 KB** |
| `/logo-dofi-mark.png` | 1 (hero) | 512 × 285 | 430 × 240 | **93 KB** |
| `/logo-dofi.png` | 1 (footer) | 640 × 654 | 96 × 98 | 254 KB (diferido) |
| `/media/socio-retrato.jpg` | 1 | 559 × 782 | 414 × 580 | 73 KB |
| `icon.png` (favicon) | 1 | 512 × 512 | 32 × 32 | **58 KB** |
| SVG `simple-icons` | 4 | vectorial | 36 px | ~0 KB (inline) |
| Iconos Phosphor | ~20 | vectorial | 16–30 px | en bundle |
| **Vídeo** | **0** | — | — | — |

### 11.2 Diagnóstico

| Criterio | Veredicto |
|---|---|
| ¿Aportan información? | **No.** La única imagen con contenido real es el retrato de Daniel. |
| ¿Generan confianza? | **No.** 26 marcas con la misma imagen sugiere lo contrario. |
| ¿Refuerzan la marca? | Solo el logo. |
| ¿Parecen stock? | Peor: parecen **placeholder** — un degradado sin sujeto. |
| ¿Calidad suficiente? | El retrato es un recorte compuesto con marca de agua visible. `[observación]` |
| ¿Proporción correcta? | **No.** `16/9` metido en marco `9/16`. |
| ¿Tamaño justificado? | **No.** 162 KB para un logo de 48 px. |

### 11.3 Dónde hay icono y debería haber otra cosa

| Lugar | Hoy | Debería ser |
|---|---|---|
| Filas de servicio | Icono Phosphor genérico (megáfono, embudo, destello) | **Pieza real**: un frame de campaña, una captura del embudo en Kommo, una conversación del bot |
| Muro de cuentas | Monograma de 2 letras | **Logotipo real del cliente** |
| Celdas de herramientas | Logo o wordmark | **Captura real de la interfaz** (embudo de Kommo, panel de Meta Ads) |
| Tarjetas de cliente | Degradado borroso | **Frame real de la pieza producida** |
| El Socio | Retrato compuesto | **Fotografía profesional** |
| Hero | Delfín decorativo (`aria-hidden`) | Aquí un visual **sí** podría ser innecesario si el espacio lo ocupa la propuesta de valor |

**Ausencia crítica: cero vídeo en un sitio de una productora audiovisual.** El componente `VideoTile` existe, está construido con sus tres estados (portada, cargando, error) y `/public/videos/` solo contiene un `LEEME.txt`. La agencia que vende producción audiovisual no muestra ni un segundo de vídeo.

---

## 12. Auditoría de LOGOS DE CLIENTES

| Criterio | Estado |
|---|---|
| **¿Existe social proof?** | **Sí, y es el activo más fuerte del sitio: 26 cuentas reales, con nombre, sector y descripción específica de lo que se hizo.** |
| **Ubicación** | Correcta: el muro va inmediatamente después del hero (píxel 900), la galería justo después. Es el segundo bloque de la página. |
| **Tamaño** | Franja de 218 px. Adecuado. |
| **Contraste** | Nombres en `mist` (8,4:1) sobre `deep/40`. Cumple AA. |
| **Cantidad** | 26 — una cifra **excelente** para una agencia regional. |
| **Separación** | 48 px entre cuentas (`px-6` ×2). Correcto. |
| **Consistencia** | Rota: los monogramas se repiten (`EL` para El Horno y El Cobayo). |
| **Tratamiento cromático** | Uniforme y elegante. |
| **Organización** | Marquesina continua, pausa al hover. Bien resuelta. |
| **Legibilidad** | Buena. |

**El diagnóstico es incómodo pero simple:** DOFI tiene **la prueba social que la mayoría de agencias de su tamaño quisiera tener** — 26 cuentas activas con casos descritos — y la está presentando con **cuadraditos de dos letras y una imagen genérica repetida 26 veces**.

- ¿Demasiado tarde? **No** — la ubicación es correcta.
- ¿Demasiado pronto? **No.**
- ¿Con demasiado protagonismo? **En superficie sí** (18,4 % de la página en Clientes). **En sustancia no**: mucho espacio, poca prueba.
- ¿Dentro de cards innecesarias? **Sí** — la tarjeta de 971 px existe para alojar una imagen que no existe.

---

## 13. Auditoría de CTA y CONVERSIÓN

### 13.1 Inventario completo `[medido, desktop]`

| # | Texto | Píxel Y | Tamaño | Estilo | Destino | Estado |
|---|---|---|---|---|---|---|
| 1 | Iniciar proyecto (nav) | 10 (fijo) | 175 × 48 | Sólido naranja | `/#contacto` | **Oculto < 640 px** |
| 2 | *(26 tarjetas de cliente)* | 1 619 | 425 × 971 | Tarjeta-enlace | `/clientes/…` | OK |
| 3 | Iniciar proyecto (Socio) | **7 884** | 175 × 48 | Sólido naranja | `#contacto` | OK |
| 4 | Escribir por WhatsApp | 8 531 | 244 × 50 | Fantasma | `wa.me/593999999999` | **Número falso** |
| 5 | Iniciar proyecto (form) | 8 674 | 620 × 52 | Sólido naranja | `POST /api/contacto` | **El lead se pierde** |
| 6 | +593 98 447 2869 | 9 051 | 276 × 20 | Texto | `wa.me/593984472869` | OK — número real |
| 7 | Correo | 9 083 | 276 × 20 | Texto | `mailto:` | OK |
| 8 | Instagram / TikTok / LinkedIn | 9 360 | 40 × 40 | Icono | **Home de cada plataforma** | Rotos |

### 13.2 El hallazgo de conversión más grave

> **Entre el píxel 900 (fin del hero) y el píxel 7 884 (El Socio) NO existe ningún CTA en el cuerpo de la página.**
>
> Son **6 984 píxeles = 7,8 pantallas de desktop** en las que el usuario puede leer sobre 26 clientes, 3 servicios, 5 pasos de proceso y 6 herramientas **sin encontrar una sola manera de dar el siguiente paso** que no sea volver a la barra superior.
>
> **En mobile es peor: el primer CTA del cuerpo aparece en el píxel 7 301 de 11 431, y el de la barra ni siquiera existe.**

### 13.3 ¿Cuál parece el CTA principal?

**"Iniciar proyecto"** — aparece 3 veces (nav, socio, formulario) y es el único con relleno naranja sólido.

Problema: **"Iniciar proyecto" no dice qué pasa al hacer clic.** No es una acción, es una intención. Compárese con lo que la propia página promete en el copy — *"En la primera llamada sales con una ruta clara, con o sin nosotros"*. Esa es la oferta real, y no está en ningún botón.

### 13.4 Dónde se rompe el recorrido

```
ENTRADA ────────► OK. El sitio carga rápido, se ve bien, el logo se identifica.

COMPRENSIÓN ────► SE ROMPE AQUÍ.
                    El hero no dice qué se vende ni a quién.
                    El usuario llega a Clientes sin saber qué está mirando.

CONFIANZA ──────► PARCIAL.
                    26 nombres reales = confianza.
                    26 imágenes idénticas y vacías = desconfianza.
                    Cero testimonios, cero métricas, cero resultados.
                    Redes rotas y correo de Gmail restan.

INTERÉS ────────► El proceso y los servicios están bien escritos,
                    pero llegan después de 4 pantallas sin propuesta de valor.

ACCIÓN ─────────► SE ROMPE DEFINITIVAMENTE.
                    7,8 pantallas sin CTA.
                    En mobile, sin CTA en el navbar.
                    El WhatsApp lleva a un número inexistente.
                    Y si el usuario llena el formulario, el lead se pierde.
```

### 13.5 Checklist solicitado

| Patrón buscado | ¿Presente? |
|---|---|
| CTA demasiado temprano | No |
| **CTA demasiado tarde** | **Sí — 7,8 pantallas** |
| **CTA genérico** | **Sí — "Iniciar proyecto" ×3, sin promesa** |
| Demasiados CTA distintos | No — el problema es el contrario |
| **Ausencia de CTA** | **Sí — hero, clientes, servicios, proceso, herramientas** |
| WhatsApp dominando demasiado | No — está infrarrepresentado, y roto |
| Formulario con fricción | No — 4 campos, uno opcional. Bien. |
| **Botones visualmente débiles** | **Sí — el CTA del menú móvil es un enlace de texto plano** |

---

## 14. Auditoría de SOCIAL PROOF

### Lo que hay

| Elemento | ¿Existe? | Tipo | Valor |
|---|---|---|---|
| Nombres de clientes | Sí — 26 | **Prueba real** | Alto |
| Logos de clientes | No | — | — |
| Descripción de lo hecho por cuenta | Sí — 26 | **Prueba real** | Alto |
| Páginas de caso individuales | Sí — 26 (SSG) | Prueba real | Alto (infrautilizado) |
| Sectores atendidos | Sí — ~15 | Prueba real | Medio |
| Testimonios | No | — | — |
| Métricas / resultados | No | — | — |
| Casos con antes/después | No | — | — |
| Equipo | No | — | — |
| Fotografías del trabajo | No | — | — |
| Años de experiencia | No | — | — |
| Certificaciones (Meta Partner, etc.) | No | — | — |
| Partners tecnológicos | Parcial | **Afirmación comercial** | Bajo — mostrar el logo de Meta no prueba nada |
| Números | No | — | — |

### Prueba real vs. afirmación comercial

**Prueba real (verificable):** los 26 nombres de cuentas y lo que se hizo en cada una. Eso es sólido y es el activo del sitio.

**Afirmación comercial (no verificable):** *"Las herramientas no son el trabajo, pero sí definen qué tan rápido se ejecuta"*, *"Nada se enfría en una bandeja"*, *"Atención que no duerme"*. Bien escritas, pero son promesas, no pruebas.

**Nota importante y deliberada:** el código de `src/data/clients.ts` define un tipo `Result` con el comentario *"Dato duro del proyecto. NO inventar: dejar solo los que Daniel confirme"*, y **está vacío en las 26 cuentas**. La decisión de no inventar métricas es correcta y hay que mantenerla. **Pero significa que hoy el sitio no muestra ni un solo resultado demostrable.**

**No se han inventado métricas en esta auditoría, y no deberían inventarse en el rediseño.** El siguiente paso real es recolectar de Daniel 3–5 resultados verificables (aunque sean cualitativos: "pasó de 3 a 1 canal de atención", "cerró el mes con el embudo completo en CRM") y 2–3 testimonios firmados con nombre y cargo.

**Aviso de dato pendiente:** 19 de las 26 cuentas tienen sector, ciudad y servicios **inferidos, no confirmados** (así consta comentado en el propio código). Antes de amplificar la prueba social hay que validarlos, porque publicar un sector equivocado de un cliente real es peor que no publicarlo.

---

## 15. Auditoría del EQUIPO

**No existe sección de equipo.** La única persona presente en el sitio es Daniel Vallejo.

| Criterio | Estado |
|---|---|
| Fotografías | 1, compuesta sobre fondo de galaxia, con marca de agua visible `[observación]` |
| Posición en la página | Píxel 6 778 de 9 480 — penúltima sección |
| Tamaño | Retrato 415 × 580 px, sticky |
| Cargo | **Ausente** |
| Credibilidad | **Ninguna prueba**: sin años, sin formación, sin trayectoria, sin LinkedIn |
| Personalidad | El copy sí transmite criterio y forma de trabajar |
| Distribución | Una sola persona |
| Confianza | Baja: un nombre sin credenciales genera menos confianza que ninguna cara |

**¿Cómo se percibe DOFI?**
**Como una marca personal a medio construir.** No se percibe estructura de empresa (no hay equipo, no hay roles, no hay oficina), pero tampoco se aprovecha la autoridad de una marca personal (no hay trayectoria ni credenciales). Está en el punto ciego entre las dos.

El copy repetidamente dice *"este equipo"*, *"nosotros"*, *"nuestro"* — pero el sitio nunca muestra a ese equipo. Eso genera una disonancia entre lo que se afirma y lo que se demuestra.

---

## 16. Auditoría de ANIMACIONES

### 16.1 Inventario y clasificación

| # | Animación | Componente | Duración / Curva | Clase |
|---|---|---|---|---|
| 1 | Riel de proceso que se llena con el scroll | `Process` | spring 90/24 | **FUNCIONAL** |
| 2 | Barra de nav transparente → sólida | `Nav` | 400 ms · `(.16,1,.3,1)` | **FUNCIONAL** |
| 3 | Barrido de fila de servicio desde el lado del cursor | `ServiceRow` | 600 ms · `(.16,1,.3,1)` | **PREMIUM** |
| 4 | Herramientas: gris → color de marca al hover | `Tools` | 500 ms | **PREMIUM** |
| 5 | Flechas `↗` que se desplazan al hover | varios | 500 ms | **DIRECCIONAL** |
| 6 | Muro de cuentas en bucle continuo, pausa al hover | `LogoWall` | 89,1 s lineal | **PREMIUM** |
| 7 | CTA magnético que sigue al cursor | `MagneticCta` | spring 180/18 | **PREMIUM** |
| 8 | `Reveal` al entrar en viewport | global | 750 ms, `once: true` | **DIRECCIONAL** |
| 9 | Zoom del retrato 1,12 → 1 | `SocioPortrait` | 900 ms | **PREMIUM** |
| 10 | Carrusel de clientes por páginas | `ClientsCarousel` | 650 ms | **FUNCIONAL** |
| 11 | Onda continua letra a letra del H1 | `WaveText` + CSS | 3,8 s infinito | **DECORATIVA** |
| 12 | Flotación del logo del hero | CSS | 3,8 s infinito | **DECORATIVA** |
| 13 | Cascada de entrada del H1 (0,035 s/letra) | `WaveText` | 900 ms + cascada | **PERJUDICIAL** |
| 14 | Entrada de la firma del hero | `Hero` | **delay 0,95 s** + 1 s | **PERJUDICIAL** |
| 15 | Canvas `OceanCurrent`, 26 curvas a 60 fps | `OceanCurrent` | continua | **DECORATIVA** |
| 16 | Marquesina del manifiesto | CSS | 38 s lineal | **PERJUDICIAL** |
| 17 | Capa de grano fija | CSS | estática | **PREMIUM** |

### 16.2 Análisis

**La calidad técnica del motion es alta.** Toda la página comparte una sola curva de easing (`cubic-bezier(0.16, 1, 0.3, 1)`) y una escala de duraciones coherente (300 / 500 / 650 / 750 / 900 ms). `prefers-reduced-motion` está implementado **de verdad**, en tres capas: media query global que anula duraciones, `useReducedMotion()` en cada componente cliente, y reglas específicas para cada `@keyframes`. **Esto está mejor hecho que en la mayoría de sitios profesionales.**

**Por qué las tres "perjudiciales" lo son — con dato:**

> **La LCP en mobile es de 4 372 ms, y el elemento LCP es el párrafo `"DOFI AGENCIA CREATIVA"`.** `[medido: 4G lento + CPU ×4]`
>
> Ese párrafo tiene `delay: 0.95s` + `duration: 1s`. **La métrica principal de rendimiento de la página está determinada por el retraso de una animación decorativa**, no por la red ni por el peso. Sin ese delay, la LCP caería aproximadamente a 2,4 s — de "deficiente" a "aceptable".

- **#13 y #14** retrasan la aparición del contenido más importante de la página.
- **#15** ejecuta 26 curvas bezier por fotograma para un efecto casi invisible en desktop.
- **#16** mueve texto ilegible (2,63:1) que nunca se lee entero.

**El `Reveal` global (#8)** merece una nota: `once: true` está bien, pero significa que **el contenido nace con `opacity: 0`** y depende de que el IntersectionObserver dispare. Hay un `<noscript>` que lo cubre si no hay JS, pero no cubre un fallo parcial de hidratación. Es un riesgo asumible, no un defecto.

### 16.3 Qué técnica correspondería a cada zona (solo diagnóstico)

| Zona | Técnica adecuada | Motivo |
|---|---|---|
| Hero | **Vídeo pre-renderizado o secuencia corta** | Aquí sí compensa: es la única pantalla que ve el 100 % de las visitas |
| Transiciones de sección | **CSS puro** | Coste cero |
| Riel de proceso | **Motion (mantener)** | Ya es correcto |
| Hovers y microinteracciones | **CSS puro** | Ya lo son en su mayoría |
| Carrusel | **CSS + estado mínimo** | Ya lo es |
| Explicación de "cómo funciona el sistema" | **Remotion → MP4/WebM** | Un diagrama animado de ATRAER→CONVERTIR→ESCALAR renderizado como vídeo pesa menos y rinde mejor que animarlo en runtime |
| Demo del CRM / bot | **Captura de pantalla real o vídeo** | La prueba de producto no se dibuja: se enseña |
| Fondo del hero | **Estático o CSS** | El canvas no justifica su coste |
| Marquesina de cuentas | **CSS (mantener)** | Ya es óptima |
| Texto de cuerpo | **Estático, sin `Reveal`** | Reduce dependencia de JS y mejora LCP |

**No se ha añadido Remotion ni ninguna dependencia.** Esto es solo el mapa de qué correspondería a cada zona.

---

## 17. Auditoría RESPONSIVE

### 17.1 Comparativa por viewport `[medido]`

| Métrica | 1440×900 | 1280×800 | 768×1024 | 390×844 | 360×800 |
|---|---|---|---|---|---|
| Altura del documento | 9 480 px | 9 320 px | 11 191 px | 11 431 px | 11 485 px |
| Pantallas de scroll | 10,5 | 11,7 | 10,9 | **13,5** | **14,4** |
| Padding lateral | 32 px | 32 px | 32 px | 20 px | 20 px |
| Padding vertical de sección | 192 px | 192 px | 128 px | 128 px | 128 px |
| H1 | 144 px | 128 px | 76,8 px | 51,2 px | 51,2 px |
| H2 | 60 px | 60 px | 36 px | 36 px | 36 px |
| Enlaces de nav visibles | 5 | 5 | **0** | **0** | **0** |
| **CTA en la barra** | Sí | Sí | Sí | **NO** | **NO** |
| Tarjetas por vista | 3 | 3 | 2 | 1 | 1 |
| **Puntos del carrusel** | 9 | 9 | **13** | **26** | **26** |
| Tarjeta de cliente | 425×971 | 371×860 | 332×827 | 330×824 | 300×780 |
| Sección más alta | Clientes | Clientes | Herramientas | **Herramientas** | **Herramientas** |

### 17.2 Diagnóstico — mobile como producto independiente

**Mobile no está diseñado; está reducido.** Evidencia:

1. **26 puntos de carrusel en 390 px de ancho.** `[medido]` Con `gap: 10px` y 8 px por punto, se envuelven en **3 filas**, la última con un punto huérfano. No es una barra de progreso: es un campo de puntos indescifrable. Y compiten por el espacio con las flechas prev/next.

2. **Una tarjeta = 824 px en un viewport de 844 px.** Una tarjeta ocupa el 98 % de la pantalla y el 75 % de ella es un degradado vacío.

3. **26 páginas × 5 s = 130 segundos** para ver toda la prueba social, o 26 toques.

4. **Sin CTA en la barra** (§4.3) y CTA sin estilo en el menú (§4.3).

5. **La sección más alta en mobile es Herramientas (2 021 px, 17,7 %)** — los logos de terceros por delante de todo.

6. **14,4 pantallas de scroll en 360 px.** Es una lectura de varios minutos para llegar al formulario.

7. **Puntos de contacto por debajo del mínimo:** hamburguesa 40×40, redes del pie 40×40, enlaces del pie 18 px de alto, puntos del carrusel 8×8. `[medido]` (Mínimo WCAG 2.5.8 AA: 24×24; recomendación de plataforma: 44×44.)

8. **El bloque del hero mantiene la misma proporción de vacío que en desktop** (36 % de ocupación) — no hay recomposición para pantalla vertical.

### 17.3 Componentes que solo fueron encogidos vs. los que necesitan composición propia

| Componente | Estado | Veredicto |
|---|---|---|
| Hero | Encogido | **Necesita composición mobile propia** |
| Navbar | Encogido + CTA eliminado | **Necesita composición mobile propia** |
| Carrusel de clientes | Encogido (perView 3→1) | **Necesita otro patrón** (scroll horizontal con snap, o lista) |
| Tarjeta de cliente | Encogida | **Necesita otra proporción** |
| Herramientas (bento) | Apilado 6 celdas | Reducir a franja |
| Filas de servicio | **Recompuestas de verdad** (grid → columna) | Bien resuelto |
| Proceso | Adapta `pl` y `gap` | Bien resuelto |
| El Socio | `sticky` desactivado, apilado | Correcto |
| Contacto | 2 col → 1 col | Correcto |
| Footer | 4 col → 2 → 1 | Correcto |

**Lo positivo:** ninguna sección se rompe, hay cero desbordamiento horizontal, la CLS es 0 en mobile `[medido]`, y cuatro secciones sí tienen adaptación pensada. **La base técnica del responsive es sólida.** El problema es de diseño, no de implementación.

---

## 18. ACCESIBILIDAD VISUAL BÁSICA

### 18.1 Contraste `[medido — cálculo WCAG 2.1 sobre los colores reales]`

| Combinación | Ratio | Veredicto |
|---|---|---|
| `foam #F4F0FE` sobre `abyss` | **17,08:1** | AAA |
| `foam` sobre `deep` (Socio) | **15,89:1** | AAA |
| `fog #cbd5e1` sobre tarjeta `deep/40` | **12,57:1** | AAA |
| `mist #B3A5D4` sobre `abyss` | **8,43:1** | AAA |
| `mist` sobre celda de herramienta | **8,22:1** | AAA |
| `mist` sobre `deep` (Socio) | **7,84:1** | AAA |
| `accent #F47B20` sobre `abyss` (eyebrow) | **7,02:1** | AAA |
| `abyss` sobre `accent` (botón) | **6,53:1** | AA |
| `mist-dim #948AB8` sobre `abyss` | **6,00:1** | AA |
| `mist-dim` sobre muro `deep/40` | **5,85:1** | AA |
| Placeholder `fog` sobre `surface/70` | **11,47:1** | AAA |
| **Contorno del manifiesto** `rgba(255,255,255,.3)` | **2,63:1** | **FALLA** |

**El contraste es una fortaleza real de este sitio.** Los tokens están calibrados a conciencia (el comentario en `globals.css` dice literalmente *"Calibrado para pasar WCAG AA (≥4,5:1) sobre abyss, deep y surface"*, y se cumple). **Una sola excepción en toda la página.**

### 18.2 Resto de criterios

| Criterio | Estado |
|---|---|
| **Foco visible** | Regla global `:focus-visible { outline: 2px solid accent; offset: 3px }`. Consistente en todo el sitio. |
| **`prefers-reduced-motion`** | Implementado en 3 capas (§16.2). Mejor que la media. |
| **Estructura semántica** | `header` / `main` / `section` / `footer` / `nav` / `ol` / `ul` / `blockquote` / `figure`. Un solo `h1`. |
| **`lang="es"`** | Correcto |
| **`alt` en imágenes** | 34/34 con atributo; los 4 vacíos son decorativos e intencionados |
| **ARIA del carrusel** | `role="region"`, `aria-roledescription="carrusel"`, `aria-label`, `aria-current`, clones con `aria-hidden` + `tabIndex={-1}` |
| **ARIA del formulario** | `aria-invalid`, `aria-describedby`, `aria-live="polite"` |
| **`aria-expanded` en la hamburguesa** | Correcto |
| **Texto cinético del H1** | `aria-label` en el contenedor, letras `aria-hidden` — evita que se lea "U-n m-a-r" |
| **Puntos de contacto** | 4 grupos por debajo de 44 px (§17.2) |
| **26 puntos de carrusel** | Navegación por teclado impracticable |
| **Foco atrapado en el menú móvil** | No implementado; el `body` no bloquea el scroll |
| **Contenido dependiente del color** | No se detectó |
| **Botón `submit` en estado `sending`** | Cambia el texto pero no anuncia el cambio de estado |
| **Semántica del H1** | El `textContent` del H1 se concatena como **"Un marde ideas"** (dos `<span>` de bloque sin espacio entre ellos). El `aria-label` de cada mitad está bien, pero un rastreador que lea el texto plano ve "marde". |

**Veredicto:** la accesibilidad está **por encima de la media** en lo estructural y en el color, y **por debajo** en lo táctil. La mayoría de sitios de agencia fallan en contraste y aciertan en tamaño de botón; aquí ocurre lo contrario.

---

## 19. PERCEPCIÓN PREMIUM

### 19.1 Puntuación como director de arte

| Dimensión | Nota | Comentario |
|---|---|---|
| **Sofisticación** | **6/10** | Paleta, radios y ausencia de sombra son decisiones maduras. El contenido las contradice. |
| **Originalidad** | **5/10** | Las filas editoriales y el riel de proceso son propios. El resto es vocabulario estándar. |
| **Consistencia** | **5/10** | Tokens excelentes, aplicación irregular: 3 H2, 6 medidas, 5 retículas. |
| **Claridad** | **2/10** | Cuatro pantallas sin saber qué se vende. |
| **Confianza** | **3/10** | 26 clientes reales anulados por 26 imágenes vacías y redes rotas. |
| **Modernidad** | **7/10** | Stack actual, motion actual, estética actual. |
| **Diferenciación** | **3/10** | Sin el logo, sustituible por cualquier agencia. |
| **Dirección de arte** | **4/10** | Hay una atmósfera (púrpura profundo + naranja único) pero no una dirección: el motivo marino se declara y no se ejecuta más allá del copy. |
| **Calidad del motion** | **8/10** | Lo mejor del sitio. Una sola curva, escala coherente, reduced-motion en serio. Le restan las 3 animaciones que perjudican. |
| **Calidad de las imágenes** | **1/10** | Una imagen genérica repetida 26 veces, un retrato compuesto con marca de agua, dos logos que no cargan, cero vídeo. |
| **Ritmo** | **3/10** | Todas las secciones miden aproximadamente lo mismo (1 150–1 750 px) y usan el mismo padding. No hay compás. |
| **Uso del espacio** | **4/10** | Contenedor consistente, pero ~1 800 px² de vacíos no justificados y 384 px entre secciones del mismo color. |
| | **Media: 4,25 / 10** | |

### 19.2 Qué hace exactamente que parezca menos premium

Sin subjetividades. En orden de impacto:

1. **La misma imagen borrosa repetida 26 veces.** `[medido]` Nada dice "sitio sin terminar" con más claridad que un placeholder multiplicado.
2. **Monogramas de dos letras en lugar de logotipos de cliente.** Es el patrón visual de un avatar por defecto.
3. **Kommo y CapCut sin logo, y "Kommo" en color apagado.** `[medido]` Un fallo técnico visible: la herramienta principal es la menos destacada de su propia sección.
4. **El retrato del socio está compuesto sobre un fondo de galaxia y lleva marca de agua.** `[observación]` Es la única fotografía de persona del sitio.
5. **384 px de negro idéntico entre secciones.** El vacío sin cambio de superficie no lee como respiración: lee como falta de contenido.
6. **Todas las secciones miden lo mismo y respiran lo mismo.** Sin variación de altura, densidad ni superficie, la página no tiene compás. Lo premium tiene ritmo; esto tiene métrica constante.
7. **Enlaces de redes que van a instagram.com.** `[medido]` Un detalle de 30 segundos que dice "nadie revisó esto".
8. **Correo `@gmail.com`** en una empresa que vende sistemas empresariales.
9. **Texto a 2,63:1 de contraste en la marquesina.** Se percibe como un error de render, no como una decisión.
10. **Cero vídeo en una productora audiovisual.** La ausencia más elocuente del sitio.

**Lo que sí es premium hoy y hay que proteger:**
la paleta y su calibración de contraste · la ausencia total de sombras · la escala de radios documentada · la curva única de easing · la marquesina de cuentas · las filas editoriales de servicios · el riel de proceso · la capa de grano · el tratamiento de `prefers-reduced-motion` · el footer.

---

## 20. Auditoría de MARCA

### DOFI — *creatividad + estrategia + resultados*

| Atributo | ¿Comunicado? |
|---|---|
| Creatividad | Parcial — se afirma; no se demuestra (sin piezas, sin vídeo, sin campañas) |
| Estrategia | Parcial — el proceso lo insinúa bien; no hay caso que lo pruebe |
| **Resultados** | **Ausente por completo** — cero métricas, cero antes/después |

La identidad visual de DOFI (logo, paleta, "Un mar de ideas") **está bien construida y es reconocible.** El problema no es la marca: es que la marca ocupa el lugar de la oferta.

### FENIAX — *tecnología + CRM + automatización + Ventas Inteligentes*

| Atributo | ¿Comunicado? |
|---|---|
| Tecnología | No |
| CRM | Parcial — existe como fila de servicio y como celda de herramienta, sin atribuirse a FENIAX |
| Automatización | Parcial — mencionada de pasada |
| **"Ventas Inteligentes"** | **La expresión no aparece ni una vez en todo el sitio** `[medido]` |

**FENIAX aparece exactamente 3 veces en toda la página:**
1. En el paso 4 del proceso: *"FENIAX monta el CRM y el bot"*
2. En la descripción de la celda de Kommo: *"…montados por FENIAX"*
3. En la línea de copyright: *"Sistemas por FENIAX"*

**Una de las dos marcas operativas del negocio existe hoy como nota al pie.** No tiene sección, ni identidad visual propia, ni explicación de qué es, ni CTA propio. GoHighLevel, funnels, landing pages y páginas web —servicios reales de FENIAX— no se mencionan en ninguna parte.

### EL SOCIO — *experiencia + autoridad + consultoría + formación*

| Atributo | ¿Comunicado? |
|---|---|
| Experiencia | No — sin años, sin trayectoria, sin empresas anteriores |
| Autoridad | No — sin cargo, sin credenciales, sin formación, sin LinkedIn |
| Consultoría | No — no se ofrece como servicio |
| Formación / cursos | Ausente |
| Reserva de citas | Ausente |
| Pago de asesorías | Ausente |

Hay una **sección con la persona**, pero no hay **marca personal**: no hay oferta, ni prueba, ni camino de conversión propio.

### La arquitectura ATRAER → CONVERTIR → ESCALAR

**No existe en el sitio, ni siquiera de forma implícita.**

La página comunica *"una agencia creativa que también hace CRM"*. No comunica *"un ecosistema de tres marcas con tres funciones encadenadas"*. Un visitante no puede deducir que hay tres unidades de negocio, ni que se conectan entre sí, ni qué hace cada una.

**Este es el hallazgo estratégico central de la auditoría, y explica por qué "Claridad de propuesta" puntúa 3/12.**

---

## 21. SEO / GEO / AEO — diagnóstico inicial

### 21.1 Comprobaciones `[medido sobre el HTML servido]`

| Elemento | Estado | Detalle |
|---|---|---|
| `<title>` home | Parcial | `"DOFI Agencia Creativa \| Un Mar de Ideas"` — 42 car. Sin palabra clave de servicio ni de ciudad. |
| `<meta description>` | OK | Buena, 158 car., menciona campañas, audiovisual, CRM, FENIAX. |
| `keywords` | Neutro | Presente. Google la ignora desde 2009. Inocua. |
| **`<h1>`** | **Falla** | `"Un mar de ideas"` — **cero valor semántico**. Además el `textContent` se concatena como **"Un marde ideas"** (falta un espacio entre los dos `<span>` de bloque). |
| Jerarquía de encabezados | Parcial | 1×H1, 6×H2, ~45×H3. Los 26 nombres de cliente son H3 en la home: mucho peso semántico para tarjetas. |
| HTML semántico | OK | `header/main/section/nav/footer/ol/ul/blockquote` correctos. |
| **`canonical`** | **Falla** | **Ausente en la home y en las 26 subpáginas.** |
| **`sitemap.xml`** | **Falla** | **HTTP 404.** No existe `src/app/sitemap.ts`. |
| `robots.txt` | Parcial | Responde 200, pero es el archivo **por defecto de Cloudflare** (content-signals). No hay `robots.ts` propio y **no declara sitemap**. |
| Indexabilidad | Riesgo | Sin `noindex`, pero **el dominio es `*.workers.dev`**, un dominio compartido de terceros. Indexar aquí y migrar después obliga a gestionar redirecciones y canibalización. |
| **`og:url`** | **Falla** | Apunta a `https://dofi.agency` — **un dominio que no está sirviendo este sitio.** Toda pieza compartida enlaza a un destino equivocado. |
| **`og:image`** | **Falla** | **Ausente en la home.** Al compartir en WhatsApp, Instagram o LinkedIn no se muestra imagen. Para una agencia creativa, es el peor lugar donde faltar. |
| `twitter:card` | Parcial | `summary_large_image` declarado, pero sin imagen en la home. |
| **Schema.org / JSON-LD** | **Falla** | **Cero.** Ni `Organization`, ni `LocalBusiness`, ni `Person`, ni `Service`, ni `BreadcrumbList`. |
| Contenido rastreable | OK | SSR/SSG real. Todo el texto está en el HTML inicial. |
| **Contenido oculto por animación** | Parcial | Muchos bloques nacen con `opacity: 0`. Hay un `<noscript>` que los fuerza visibles — correcto — pero el patrón sigue siendo frágil. |
| `alt` de imágenes | OK | 34/34 |
| Enlaces internos | OK | 26 enlaces a páginas de caso + navegación. Buena estructura interna. |
| URLs | OK | `/clientes/<slug>` limpias y legibles. |
| Subpáginas de cliente | Parcial | Título y descripción propios OK. Sin `canonical`. Sin JSON-LD. |
| Dependencia de JS | OK | Baja para el contenido. |

### 21.2 Preparación para motores de IA (GEO / AEO)

**La pregunta operativa: ¿puede un modelo de lenguaje responder "¿qué hace DOFI?" leyendo este sitio?**

**Hoy, mal.** Motivos concretos:

1. **No hay una frase canónica que defina la entidad.** El H1 es una metáfora. La definición más clara está en el footer, en 14 px.
2. **Sin `Organization` en JSON-LD**, no hay forma estructurada de declarar nombre, logo, dirección, teléfono, redes ni área de servicio.
3. **FENIAX no está declarada como entidad relacionada** (`subOrganization`, `brand`, `parentOrganization`).
4. **Daniel Vallejo no está declarado como `Person`** con `jobTitle` ni `worksFor`.
5. **Los servicios no están declarados como `Service`/`OfferCatalog`.**
6. **Sin ubicación estructurada.** "Cuenca, Ecuador" solo existe como texto en el footer. Para búsquedas locales —el mercado real de DOFI— es una pérdida directa.

**Cobertura de entidades del brief en el contenido actual:**

| Entidad | ¿Presente? | Dónde |
|---|---|---|
| DOFI | Sí | Título, hero, footer |
| **FENIAX** | Marginal | 3 menciones |
| **Daniel Vallejo / El Socio** | Parcial | Nombre sí; sin cargo ni contexto |
| Marketing Digital | Parcial | Como etiqueta "Marketing Digital 360" |
| **Meta Ads** | Parcial | Solo como celda de herramienta |
| **TikTok Ads** | **Ausente** | "TikTok" aparece; "TikTok Ads" no |
| CRM | Sí | Fila de servicio + celda |
| Kommo | Parcial | Mencionado; **sin logo** |
| **GoHighLevel** | **Ausente** | — |
| **Automatización de ventas** | Parcial | Insinuada, nunca nombrada |
| **Producción audiovisual** | Parcial | Solo en la meta description |
| **"Ventas Inteligentes"** | **Ausente** | — |
| **Community Management** | **Ausente** | — |
| **Cuenca / Ecuador** | Parcial | Solo texto de footer, sin marcado |

---

## 22. PERFORMANCE VISUAL

### 22.1 Métricas medidas `[medido — Chrome headless, PerformanceObserver]`

| Métrica | Desktop 1440 sin throttling | Mobile 390 (4G lento + CPU ×4) | Umbral |
|---|---|---|---|
| **TTFB** | 347 ms | 116 ms | < 800 ms |
| **FCP** | 1 504 ms | 1 228 ms | < 1 800 ms |
| **LCP** | **1 504 ms** | **4 372 ms — FALLA** | < 2 500 ms |
| Elemento LCP | `<span>` del H1 | **`<p>` "DOFI AGENCIA CREATIVA"** | — |
| **CLS** | **0,0015** | **0,000** | < 0,1 |
| **TBT (aprox.)** | 224 ms | 384 ms | < 200 ms |
| DOMContentLoaded | 441 ms | 1 656 ms | — |
| Load | 777 ms | 1 812 ms | — |
| Peticiones | 14 | 13 | — |
| **Peso transferido** | **610 KB** | 271 KB | — |

### 22.2 Desglose de peso `[medido, desktop]`

| Recurso | Transferido | Descomprimido |
|---|---|---|
| **`logo-dofi-compact.png` (nav, 48 px)** | **162 KB** | 161 KB |
| **`logo-dofi-mark.png` (hero)** | **93 KB** | 93 KB |
| Fuente Sora variable | 68 KB | 68 KB |
| **`icon.png` (favicon, 32 px)** | **58 KB** | 58 KB |
| Chunk 258 | 56 KB | 162 KB |
| Chunk 4bd1b696 (React) | 55 KB | 169 KB |
| Chunk 255 | 46 KB | 170 KB |
| Fuente Geist | 33 KB | 33 KB |
| `cover-16-9.jpg` | 13 KB | 13 KB |
| CSS | 9 KB | 38 KB |
| Resto de JS | 17 KB | 49 KB |
| | **Imágenes: 267 KB · JS: 174 KB · Fuentes: 101 KB** | |

### 22.3 Los dos hallazgos de rendimiento

**1) La optimización de imágenes de Next NO está funcionando en Cloudflare.** `[medido]`

```
GET /_next/image?url=%2Flogo-dofi-compact.png&w=48&q=75
→ Content-Type: image/png     (no WebP)
→ 162 KB                       (archivo original: 161,5 KB)
```

Se pidió una versión de **48 píxeles** y se devolvió el **PNG original sin redimensionar ni convertir**. Lo mismo con `w=96`, `w=640` y `w=1080`: los cuatro devuelven el mismo archivo.

Consecuencia: **el logo de la barra de navegación, que se muestra a 48 × 44 px, es el recurso más pesado de toda la página** — y va con `<link rel="preload" as="image">`, es decir, compite por el ancho de banda en la ruta crítica.

Peso evitable estimado: **~250 KB de los 267 KB de imágenes.** Un PNG de 48 px optimizado debería pesar menos de 3 KB.

**2) La LCP en mobile la determina una animación decorativa, no la red.** `[medido]`

El elemento LCP en mobile es el párrafo `"DOFI AGENCIA CREATIVA"`, que se anima con `delay: 0.95s` + `duration: 1s`. La LCP registrada (4 372 ms) refleja ese retraso, no un problema de descarga: el FCP es de 1 228 ms y el `load` de 1 812 ms. **El contenido está listo a los 1,8 s y la métrica marca 4,4 s porque se le pidió al navegador que esperara.**

### 22.4 Resumen

| Aspecto | Veredicto |
|---|---|
| **CLS** | **Ejemplar (0,0015).** Las dimensiones explícitas en `Wordmark` y el uso de `fill` con `sizes` están bien hechos. |
| **TTFB / edge** | Cloudflare + prerender funcionan bien. |
| **Peso de JS** | 174 KB transferidos es razonable para Next + Motion + Phosphor. |
| **Fuentes** | 101 KB auto-alojadas con `swap`. Correcto. |
| **Imágenes** | Optimizador inoperante. |
| **LCP mobile** | Falla Core Web Vitals por decisión de motion. |
| **TBT** | 224–384 ms. Hidratación de varias islas cliente + canvas. |
| **Elementos sobrecargados** | El canvas dibuja 26 curvas/frame; 26 letras animadas en el H1. |

*Nota: no se ejecutó Lighthouse (no está instalado y no se instalaron dependencias, según lo indicado). Las métricas anteriores provienen de `PerformanceObserver` y del protocolo de red de Chrome sobre la URL real, con emulación de red y CPU. Son medidas de laboratorio, no de campo.*

---

## 23. SISTEMA DE PUNTUACIÓN

| Área | Peso | Nota | Justificación |
|---|---:|---:|---|
| **Claridad de propuesta** | 12 | **3** | El hero no dice qué se vende, a quién ni con qué resultado. "Ventas Inteligentes" no aparece nunca. FENIAX y El Socio no están posicionadas. La frase más clara del sitio está en el footer, en 14 px. Se conceden 3 puntos porque el copy de servicios, proceso y tarjetas sí es específico y bien escrito. |
| **Conversión** | 12 | **3** | 6 984 px (7,8 pantallas) sin ningún CTA. Sin CTA en la barra en mobile. CTA sin estilo en el menú móvil. WhatsApp apunta a un número falso. **El formulario no entrega el lead a nadie.** Se conceden 3 puntos porque el formulario en sí está bien construido y el doble canal está pensado. |
| **Jerarquía visual** | 10 | **5** | Tokens de color y peso bien centralizados; la jerarquía dentro de cada bloque es legible. Restan: tres tamaños de H2 sin criterio, un H3 de 48 px conviviendo con un H2 de 48 px, el nombre de una persona como texto más grande del sitio, y "Kommo" renderizado más apagado que "Meta Ads". |
| **Espaciado y grid** | 10 | **5** | **El contenedor de 1 400 px se respeta en las 8 secciones sin una sola excepción** — eso vale la mitad de la nota. Restan: 384 px de vacío entre secciones del mismo color, `mt-6` fijo para H2 de 36 y de 60 px, seis medidas distintas para bloques equivalentes, cinco retículas internas sin relación, ~1 800 px² de vacíos no justificados. |
| **Diseño / percepción premium** | 10 | **4** | Media de las 12 dimensiones del §19: 4,25. Sistema de diseño maduro (sin sombras, radios documentados, easing único), contenido que lo contradice (imagen repetida 26 veces, monogramas, retrato compuesto, dos logos que no cargan). |
| **Responsive** | 10 | **4** | No se rompe nada, CLS 0, sin scroll horizontal, y cuatro secciones sí tienen adaptación pensada. Pero mobile es un desktop encogido: 26 puntos de carrusel en tres filas, una tarjeta por pantalla con 75 % de vacío, sin CTA en la barra, 14,4 pantallas de scroll, y la sección más alta es la de logos de terceros. |
| **Confianza / social proof** | 8 | **3** | 26 clientes reales con descripción específica es un activo fuerte (3 puntos ganados ahí). Anulado por: cero logos, cero testimonios, cero métricas, cero resultados, cero equipo, redes que van a las plataformas y correo de Gmail. |
| **Marca** | 7 | **3** | La identidad de DOFI está bien construida y es reconocible. FENIAX existe como 3 menciones marginales. El Socio no tiene autoridad ni oferta. La arquitectura ATRAER→CONVERTIR→ESCALAR no se percibe en absoluto. |
| **Accesibilidad** | 5 | **3,5** | Contraste medido AA/AAA en 11 de 12 combinaciones, `focus-visible` global, `prefers-reduced-motion` en tres capas, ARIA de carrusel y formulario correctos, semántica limpia. Restan: 4 grupos de objetivos táctiles bajo 44 px, 26 puntos de carrusel, sin trampa de foco en el menú móvil, marquesina a 2,63:1. |
| **Performance** | 6 | **3** | CLS ejemplar (0,0015), TTFB bueno, fuentes auto-alojadas, solo 14 peticiones. Restan: **LCP mobile 4,37 s (falla CWV)**, optimizador de imágenes inoperante (~250 KB evitables), TBT 224–384 ms. |
| **SEO / GEO readiness** | 10 | **2** | Sin sitemap (404), sin canonical en ninguna página, sin `og:image` en la home, `og:url` apuntando a un dominio que no sirve el sitio, cero JSON-LD, H1 sin valor semántico y con el texto plano concatenado. A favor: SSR real, URLs limpias, `alt` completos, buena meta description y buena red de enlaces internos. |
| **TOTAL** | **100** | **38,5** | |

**Lectura del 38,5:** no es la nota de un sitio mal construido. **Es la nota de un sitio bien construido que no está terminado y que no fue escrito para vender.** La ingeniería, los tokens y el motion están por encima de 6/10; el contenido, la propuesta y la conversión están por debajo de 3/10. La brecha entre ambos es el diagnóstico.

---

## 24. PRIORIZACIÓN

### P0 — CRÍTICO (afecta conversión, comprensión, indexabilidad o funcionamiento)

| # | Problema |
|---|---|
| 1 | **El formulario de contacto no entrega el lead a nadie** (`console.log` en Workers) |
| 2 | **El botón de WhatsApp apunta a un número falso** (`593999999999`) |
| 3 | **Sin CTA visible en la barra en mobile** (< 640 px) |
| 4 | **6 984 px sin ningún CTA en el cuerpo** de la página |
| 5 | **El hero no comunica qué se vende, a quién ni con qué resultado** |
| 6 | **Sin `sitemap.xml`** (HTTP 404) |
| 7 | **Sin `canonical`** en ninguna página |
| 8 | **`og:url` apunta a `dofi.agency`**, dominio que no sirve el sitio |
| 9 | **Sin `og:image`** — al compartir no se muestra imagen |
| 10 | **26 puntos de carrusel en mobile**, en tres filas, con un huérfano |
| 11 | **Enlaces de redes apuntan a las plataformas**, no a los perfiles de DOFI |
| 12 | **LCP mobile 4,37 s** — falla Core Web Vitals |

### P1 — ALTO IMPACTO (percepción premium, confianza, UX, jerarquía, claridad)

| # | Problema |
|---|---|
| 13 | **La misma imagen genérica en las 26 tarjetas de cliente**, además con recorte 16:9→9:16 |
| 14 | **Monogramas de 2 letras en lugar de logotipos** en el muro de cuentas |
| 15 | **Kommo y CapCut sin logotipo** (`existsSync` falla en el build de Workers) |
| 16 | **"Kommo" en color `mist` en vez de `foam`** — la celda destacada es la menos destacada |
| 17 | **Cero testimonios, métricas, resultados y casos con datos** |
| 18 | **FENIAX solo existe como 3 menciones marginales**; "Ventas Inteligentes" no aparece |
| 19 | **El Socio sin cargo, credenciales, oferta ni camino de conversión propio** |
| 20 | **El optimizador de imágenes no redimensiona**: 162 KB para un logo de 48 px |
| 21 | **384 px de vacío entre secciones del mismo color de fondo** |
| 22 | **Las filas de servicio muestran una flecha `↗` pero no son enlaces** |
| 23 | **Solo 3 servicios genéricos**; falta el catálogo real del ecosistema |
| 24 | **Cero vídeo** en el sitio de una productora audiovisual |
| 25 | **El retrato del socio es un recorte compuesto con marca de agua** |
| 26 | **La tarjeta de cliente mide 971 px** (824 en mobile = 98 % de la pantalla) |
| 27 | **Sin JSON-LD** (`Organization`, `LocalBusiness`, `Person`, `Service`) |
| 28 | **Objetivos táctiles por debajo de 44 px** en 4 grupos |
| 29 | **Marquesina del manifiesto a 2,63:1** — falla contraste y no se lee entera |
| 30 | **Herramientas es la sección más alta en mobile** (17,7 %) |
| 31 | **Sanity conectado pero sin variables de entorno**: el CMS no sirve contenido |

### P2 — PULIDO (spacing, microinteracción, alineación fina, consistencia)

| # | Problema |
|---|---|
| 32 | `mt-6` (24 px) fijo entre H2 de 36 px y de 60 px — el ritmo no escala |
| 33 | Seis medidas distintas (34/36/40/42 rem, 48ch, 22ch) para bloques equivalentes |
| 34 | Tres tamaños de H2 (72 / 60 / 48) sin criterio |
| 35 | El subrayado del hover en el navbar nunca se dispara (falta la clase `group`) |
| 36 | Sin estado activo en la navegación |
| 37 | Gutter de solo 20 px por lado a 1440 px |
| 38 | 250 px de vacío dentro de la celda de Kommo (`justify-between` con dos hijos) |
| 39 | ~800 px de vacío en la fila "CRM" (columna `1fr` para 3 caracteres) |
| 40 | Mitad derecha de Proceso permanentemente vacía (~700 px) |
| 41 | ~280 px vacíos a la derecha en El Socio |
| 42 | El `textContent` del H1 se lee "Un mar**de** ideas" (falta espacio entre `span`) |
| 43 | El canvas `OceanCurrent` es casi invisible en desktop y cuesta 26 curvas/frame |
| 44 | Tracking de 0,55em en la firma del hero |
| 45 | El `submit` mide 620 × 52 px con texto de 14 px |
| 46 | Correo `@gmail.com` |
| 47 | Sin enlaces legales (privacidad / términos) |
| 48 | Sin trampa de foco ni bloqueo de scroll en el menú móvil |
| 49 | Favicon de 58 KB para 32 px |
| 50 | 19 de 26 cuentas con sector/ciudad/servicios inferidos, no confirmados |

**Reparto: 12 P0 · 19 P1 · 19 P2.** No todo es crítico: el 76 % de los hallazgos son P1 o P2, y varios P0 se resuelven en minutos (número de WhatsApp, enlaces de redes, sitemap, canonical).

---

## 25. MATRIZ DE HALLAZGOS

> Criterios de aceptación objetivos y verificables. `[M]` = magnitud.

---

**`CRO-001` · Formulario de contacto — El lead nunca llega a nadie**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Contacto · Todos |
| **Problema** | El endpoint `POST /api/contacto` valida y ejecuta `console.log(...)`. En Cloudflare Workers ese log se pierde. El usuario ve *"Mensaje recibido"* y nadie recibe nada. |
| **Evidencia** | `src/app/api/contacto/route.ts:33` — sin integración de correo, CRM ni webhook. |
| **Impacto** | Conversión — **pérdida total de leads del canal formulario** |
| **Prioridad** | **P0** |
| **Recomendación** | Conectar a Kommo (lead + contacto), a un webhook de n8n o a un servicio de correo. Registrar origen y UTM. |
| **Magnitud** | Pequeña (< 1 día) |
| **Dependencias** | Credenciales de Kommo o del webhook |
| **Aceptación** | Un envío de prueba genera un lead visible en el destino en < 60 s, y un envío fallido devuelve error al usuario en lugar de "recibido". |

---

**`CRO-002` · CTA de WhatsApp con número inexistente**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Contacto · Todos |
| **Problema** | El botón enlaza a `https://wa.me/593999999999`. El número real (`+593 98 447 2869`) sí está en el pie. |
| **Evidencia** | `[medido]` en el HTML servido: ambos números coexisten. Origen: valor de respaldo en `src/lib/sanity.ts:287`. |
| **Impacto** | Conversión — el canal más directo lleva a un destino roto |
| **Prioridad** | **P0** |
| **Recomendación** | Unificar el número en una sola fuente de verdad. Añadir mensaje pre-rellenado. |
| **Magnitud** | Pequeña (< 1 h) |
| **Dependencias** | Ninguna |
| **Aceptación** | Cada enlace `wa.me` de la página apunta a `593984472869`; una búsqueda de `593999999999` en el HTML servido devuelve 0 resultados. |

---

**`CRO-003` · Sin CTA en la barra por debajo de 640 px**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Navbar · Mobile 390 y 360 |
| **Problema** | `hidden sm:block` oculta "Iniciar proyecto". La barra queda con logo + hamburguesa. |
| **Evidencia** | `[medido]` Enlaces visibles a 390 px: `["DOFI…inicio","Abrir menu"]`. `Nav.tsx:62` |
| **Impacto** | Conversión — sin acción posible en el dispositivo dominante |
| **Prioridad** | **P0** |
| **Recomendación** | CTA persistente en mobile (botón compacto en la barra o barra inferior fija). |
| **Magnitud** | Pequeña |
| **Dependencias** | Decisión de diseño del navbar |
| **Aceptación** | A 360 px, un CTA con relleno de acento es visible sin scroll y mide ≥ 44 px de alto. |

---

**`CRO-004` · 7,8 pantallas sin ningún CTA en el cuerpo**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Hero → Herramientas · Todos |
| **Problema** | Entre el píxel 900 y el 7 884 no hay ningún CTA fuera de la barra. |
| **Evidencia** | `[medido]` Inventario completo de CTA (§13.1). |
| **Impacto** | Conversión |
| **Prioridad** | **P0** |
| **Recomendación** | CTA contextual al cierre de Servicios, Proceso y de la prueba social, con verbos distintos por contexto. |
| **Magnitud** | Mediana |
| **Dependencias** | Definición de la oferta por sección |
| **Aceptación** | Ningún tramo de scroll superior a 2,5 pantallas queda sin un CTA visible, en los 5 viewports. |

---

**`UX-005` · El hero no comunica la propuesta de valor**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Hero · Todos |
| **Problema** | H1 = "Un mar de ideas". Sin eyebrow, sin subtítulo, sin CTA, sin prueba. Contenido = 36 % del viewport. |
| **Evidencia** | `[medido]` §5.1 · `desktop-1440.png`, `mobile-390.png` |
| **Impacto** | Comprensión + Conversión + SEO |
| **Prioridad** | **P0** |
| **Recomendación** | H1 con oferta y resultado; el eslogan pasa a eyebrow o a firma. Subtítulo que nombre las tres unidades. CTA primario + secundario. Prueba social inmediata. |
| **Magnitud** | **Grande** |
| **Dependencias** | Definición de posicionamiento "Ventas Inteligentes" |
| **Aceptación** | Cinco personas ajenas al proyecto, tras 5 s viendo solo el primer viewport, responden correctamente *"¿qué vende esta empresa?"* y *"¿qué se supone que debo hacer?"*. |

---

**`SEO-006` · Sin sitemap.xml**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | `/sitemap.xml` → **HTTP 404**. No existe `src/app/sitemap.ts`. El `robots.txt` es el de Cloudflare y no declara sitemap. |
| **Evidencia** | `[medido]` |
| **Impacto** | Indexabilidad — 27 URLs sin ruta de descubrimiento declarada |
| **Prioridad** | **P0** |
| **Recomendación** | `sitemap.ts` + `robots.ts` propios (tras decidir el dominio definitivo). |
| **Magnitud** | Pequeña |
| **Dependencias** | **Dominio final** |
| **Aceptación** | `/sitemap.xml` devuelve 200 con las 27 URLs y `/robots.txt` lo declara. |

---

**`SEO-007` · Sin canonical en ninguna página**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | Ni la home ni las 26 subpáginas declaran `<link rel="canonical">`. Con el sitio accesible por `workers.dev` y previsiblemente por un dominio propio, el riesgo de contenido duplicado es real. |
| **Evidencia** | `[medido]` 0 coincidencias en ambas. |
| **Impacto** | Indexabilidad |
| **Prioridad** | **P0** |
| **Recomendación** | `alternates.canonical` en el layout y en `generateMetadata`. |
| **Magnitud** | Pequeña |
| **Dependencias** | **Dominio final** |
| **Aceptación** | Las 27 páginas devuelven un canonical absoluto al dominio de producción. |

---

**`SEO-008` · `og:url` apunta a un dominio que no sirve el sitio + sin `og:image`**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | `og:url = https://dofi.agency` mientras el sitio vive en `workers.dev`. La home no declara `og:image`, así que al compartir no aparece imagen. |
| **Evidencia** | `[medido]` `og:image` ausente en la home. |
| **Impacto** | SEO + Conversión — una agencia creativa comparte enlaces sin imagen |
| **Prioridad** | **P0** |
| **Recomendación** | Resolver el dominio; añadir `opengraph-image` (1200 × 630) para la home y una por caso. |
| **Magnitud** | Pequeña |
| **Dependencias** | **Dominio final** |
| **Aceptación** | El validador de Facebook y el de LinkedIn muestran imagen, título y descripción correctos con el dominio de producción. |

---

**`UX-009` · 26 puntos de carrusel en mobile**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Clientes · Mobile 390 y 360 |
| **Problema** | Con `perView = 1` hay 26 páginas → 26 puntos de 8 × 8 px que se envuelven en **3 filas**, la última con un punto huérfano, compitiendo con las flechas. |
| **Evidencia** | `[medido]` 26 botones "Ir al grupo N" de 8 × 8 px |
| **Impacto** | UX + Accesibilidad |
| **Prioridad** | **P0** |
| **Recomendación** | Sustituir por scroll horizontal con `scroll-snap` (patrón nativo en mobile) o una barra de progreso. |
| **Magnitud** | Mediana |
| **Dependencias** | Rediseño de la tarjeta (`VIS-013`) |
| **Aceptación** | A 360 px, el control de navegación ocupa una sola fila y sus objetivos táctiles miden ≥ 44 × 44 px. |

---

**`TRU-010` · Enlaces de redes apuntan a las plataformas**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Footer · Todos |
| **Problema** | Instagram, TikTok y LinkedIn enlazan a `instagram.com`, `tiktok.com`, `linkedin.com`. |
| **Evidencia** | `[medido]` · `Footer.tsx:48-52` |
| **Impacto** | Confianza — una agencia de redes sin sus propias redes |
| **Prioridad** | **P0** |
| **Recomendación** | URLs reales de los perfiles. Si un perfil no existe, quitar el icono. |
| **Magnitud** | Pequeña (< 15 min) |
| **Dependencias** | URLs de los perfiles |
| **Aceptación** | Los 3 enlaces resuelven a perfiles de DOFI con contenido publicado. |

---

**`PERF-011` · LCP mobile 4,37 s por retraso de animación**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Hero · Mobile |
| **Problema** | El elemento LCP es el `<p>` "DOFI AGENCIA CREATIVA", animado con `delay: 0.95s` + `duration: 1s`. El contenido está listo a 1,8 s; la métrica marca 4,4 s. |
| **Evidencia** | `[medido]` 4G lento + CPU ×4 · FCP 1 228 ms · load 1 812 ms · `Hero.tsx:72` |
| **Impacto** | Performance — falla Core Web Vitals |
| **Prioridad** | **P0** |
| **Recomendación** | Que el candidato a LCP no dependa de un `delay`. Reducir la cascada del H1. |
| **Magnitud** | Pequeña |
| **Dependencias** | Rediseño del hero (`UX-005`) |
| **Aceptación** | LCP < 2,5 s en 4G lento con CPU ×4, medido tres veces. |

---

**`VIS-012` · La misma imagen genérica en las 26 tarjetas**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Clientes · Todos |
| **Problema** | Las 26 cuentas usan `/media/cover-16-9.jpg`. Además es un archivo `950 × 534` (horizontal) recortado en un marco `9/16` (vertical). El 78 % de cada tarjeta es un degradado sin sujeto. |
| **Evidencia** | `[medido]` 30 instancias del mismo `src`; `26 cover: "/media/cover-16-9.jpg"` en `clients.ts` |
| **Impacto** | Visual + Confianza |
| **Prioridad** | **P1** (P0 si se lanza a producción tal cual) |
| **Recomendación** | Un frame real por cuenta. Mientras no exista material: reducir la superficie de imagen y dar peso al texto, o usar el logotipo del cliente sobre superficie de marca. |
| **Magnitud** | **Grande** (depende de recopilar material) |
| **Dependencias** | Material audiovisual real |
| **Aceptación** | Ninguna imagen se repite en más de una tarjeta; la proporción del archivo coincide con la del marco. |

---

**`VIS-013` · Tarjeta de cliente de 971 px con 78 % de vacío**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Clientes · Todos (crítico en mobile) |
| **Problema** | 425 × 971 px en desktop; 330 × 824 px en mobile = **98 % de la pantalla**. La información útil vive en el 20 % inferior. |
| **Evidencia** | `[medido]` |
| **Impacto** | UX + Visual |
| **Prioridad** | **P1** |
| **Recomendación** | Proporción editorial más baja y ancha; jerarquía real (un caso destacado + secundarios) en lugar de 26 iguales. |
| **Magnitud** | Mediana |
| **Dependencias** | `VIS-012` |
| **Aceptación** | En 390 px, la tarjeta ocupa ≤ 70 % de la altura del viewport y ≥ 40 % de su superficie es información. |

---

**`BUG-014` · Kommo y CapCut sin logotipo, y "Kommo" atenuado**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Herramientas · Todos |
| **Problema** | `logoPropio()` usa `existsSync(process.cwd() + "/public/marcas/…")`, que no resuelve en el build de OpenNext sobre Workers. Ambas caen a wordmark, y al hacerlo conservan la clase `tool-mark` (color `mist`) en vez de `foam`. |
| **Evidencia** | `[medido]` 0 referencias a `marcas/kommo` o `marcas/capcut` en el HTML servido, aunque `/marcas/kommo.png` responde 200. Color medido: Kommo `rgb(179,165,212)` vs Meta Ads `rgb(244,240,254)`. `Tools.tsx:105-113` |
| **Impacto** | Visual + Marca — la herramienta insignia de FENIAX es la menos visible de su sección |
| **Prioridad** | **P1** |
| **Recomendación** | Sustituir la comprobación de sistema de archivos por un registro estático de logos. |
| **Magnitud** | Pequeña |
| **Dependencias** | Ninguna |
| **Aceptación** | El HTML servido contiene `marcas/kommo` y `marcas/capcut`, y los 6 títulos de celda se renderizan en `foam`. |

---

**`VIS-015` · Monogramas de 2 letras en lugar de logotipos**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Muro de cuentas · Todos |
| **Problema** | 26 cuadrados con las dos primeras letras. `EL` se repite (El Horno / El Cobayo), `CO` se repetiría tres veces. |
| **Evidencia** | `LogoWall.tsx:47-51` |
| **Impacto** | Confianza + Visual — lee como maqueta sin terminar |
| **Prioridad** | **P1** |
| **Recomendación** | Logotipos reales en `/public/clientes/<slug>.svg`, monocromos, con altura óptica normalizada. El mecanismo de marquesina ya está listo para recibirlos. |
| **Magnitud** | Mediana (recopilación) |
| **Dependencias** | Logos de los 26 clientes + permiso de uso |
| **Aceptación** | ≥ 20 de 26 cuentas muestran su logotipo real; ninguna muestra un monograma duplicado. |

---

**`TRU-016` · Cero testimonios, métricas y resultados**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | 26 casos sin un solo dato duro. El tipo `Result` existe en el código y está vacío en las 26 cuentas. |
| **Evidencia** | `[medido]` · `clients.ts:29-34` |
| **Impacto** | Confianza + Conversión |
| **Prioridad** | **P1** |
| **Recomendación** | Recopilar 3–5 resultados verificables y 2–3 testimonios con nombre y cargo. **Mantener la regla de no inventar cifras.** |
| **Magnitud** | Mediana (depende del cliente) |
| **Dependencias** | Datos que solo Daniel y los clientes pueden confirmar |
| **Aceptación** | Al menos 3 casos muestran un resultado atribuible y 2 testimonios firmados con nombre, cargo y empresa. |

---

**`BRAND-017` · FENIAX y "Ventas Inteligentes" no existen en el sitio**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | FENIAX aparece 3 veces, todas marginales. "Ventas Inteligentes" **cero veces**. GoHighLevel, funnels, landing pages, community management y TikTok Ads: ausentes. La arquitectura ATRAER→CONVERTIR→ESCALAR no es deducible. |
| **Evidencia** | `[medido]` sobre el HTML servido |
| **Impacto** | Marca + Claridad + GEO |
| **Prioridad** | **P1** |
| **Recomendación** | Definir el bloque de posicionamiento del ecosistema y dar a FENIAX presencia propia. |
| **Magnitud** | **Grande** |
| **Dependencias** | **Decisión estratégica del cliente** |
| **Aceptación** | Un lector que recorra la home puede nombrar las tres unidades y explicar qué hace cada una. |

---

**`BRAND-018` · El Socio sin autoridad ni oferta**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | El Socio · Todos |
| **Problema** | Sin cargo, sin años, sin formación, sin LinkedIn. Sin capacitaciones, asesorías, cursos, reserva de cita ni pago. El CTA es el genérico compartido. Además, "Daniel Vallejo" a 72 px es el texto más grande del sitio. |
| **Evidencia** | `[medido]` |
| **Impacto** | Confianza + Marca + Conversión |
| **Prioridad** | **P1** |
| **Recomendación** | Añadir cargo, trayectoria y prueba. Oferta propia con su propio camino de conversión. Fotografía profesional. |
| **Magnitud** | Mediana |
| **Dependencias** | Contenido y foto de Daniel |
| **Aceptación** | La sección declara cargo, ≥ 2 señales de autoridad verificables y un CTA propio distinto del genérico. |

---

**`PERF-019` · El optimizador de imágenes no redimensiona**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | `/_next/image?...&w=48` devuelve `image/png` de **162 KB** — el original íntegro. Idéntico para `w=96`, `640` y `1080`. El logo de la barra (48 × 44 px) es el recurso más pesado de la página y va con `preload`. |
| **Evidencia** | `[medido]` 4 anchos comparados; original en disco = 161,5 KB |
| **Impacto** | Performance — ~250 KB evitables de 267 KB |
| **Prioridad** | **P1** |
| **Recomendación** | Habilitar el optimizador de OpenNext/Cloudflare Images, o pre-generar los tamaños y servirlos estáticos. Reducir también el favicon (58 KB → < 5 KB). |
| **Magnitud** | Mediana |
| **Dependencias** | Configuración de Cloudflare |
| **Aceptación** | El logo de la barra pesa < 10 KB y se sirve en WebP o AVIF; el total de imágenes de la carga inicial es < 60 KB. |

---

**`SPACE-020` · 384 px de vacío entre secciones del mismo color**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Clientes→Servicios, Herramientas→Socio · Desktop |
| **Problema** | Cuatro secciones consecutivas comparten `rgb(18,10,38)` y cada una aporta 192 px de padding: 384 px de negro idéntico sin ninguna señal de cambio. |
| **Evidencia** | `[medido]` §7.2 |
| **Impacto** | Visual + UX — la página se percibe interminable |
| **Prioridad** | **P1** |
| **Recomendación** | Escala de espaciado de sección (compacto/normal/amplio) y alternancia real de superficie o separadores. |
| **Magnitud** | Mediana |
| **Dependencias** | Sistema de diseño |
| **Aceptación** | Ningún par de secciones consecutivas comparte fondo sin un separador visible, y ningún vacío entre secciones supera los 240 px en desktop. |

---

**`UX-021` · Las filas de servicio muestran flecha pero no son enlaces**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Servicios · Desktop y tablet |
| **Problema** | Cada fila termina en `↗`, el signo universal de destino. Son `<li>` sin `href`. |
| **Evidencia** | `ServiceRow.tsx:94-99` |
| **Impacto** | UX — affordance falsa |
| **Prioridad** | **P1** |
| **Recomendación** | Convertirlas en enlaces a páginas de servicio, o retirar la flecha. |
| **Magnitud** | Pequeña (retirar) / Grande (crear páginas) |
| **Dependencias** | Decisión de arquitectura de información |
| **Aceptación** | Toda flecha `↗` de la página pertenece a un elemento navegable. |

---

**`A11Y-022` · Objetivos táctiles por debajo del mínimo**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Navbar, Clientes, Footer · Mobile y tablet |
| **Problema** | Hamburguesa 40 × 40 · redes del pie 40 × 40 · enlaces del pie 18 px de alto · puntos del carrusel 8 × 8. |
| **Evidencia** | `[medido]` §17.2 |
| **Impacto** | Accesibilidad + UX |
| **Prioridad** | **P1** |
| **Recomendación** | Área táctil mínima de 44 × 44 px, con el área ampliada por padding aunque el trazo visible sea menor. |
| **Magnitud** | Pequeña |
| **Dependencias** | `UX-009` para los puntos |
| **Aceptación** | Todo elemento interactivo tiene un área táctil ≥ 44 × 44 px en los 5 viewports. |

---

**`A11Y-023` · Marquesina del manifiesto a 2,63:1**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Manifiesto · Todos |
| **Problema** | Texto en contorno `rgba(255,255,255,.3)` sobre `#120A26` = **2,63:1**, por debajo del mínimo de 3:1 incluso para texto grande. Nunca se lee entero y los trazos colisionan por el tracking negativo. |
| **Evidencia** | `[medido]` |
| **Impacto** | Accesibilidad + Visual |
| **Prioridad** | **P1** |
| **Recomendación** | Eliminar la marquesina; rescatar *"Piezas que se ven"* y *"Sistemas que venden"* como copy de posicionamiento legible. |
| **Magnitud** | Pequeña |
| **Dependencias** | Ninguna |
| **Aceptación** | Ningún texto de la página baja de 4,5:1 (o de 3:1 si es ≥ 24 px). |

---

**`INFRA-024` · Sanity conectado pero inerte**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Global |
| **Problema** | `SANITY_PROJECT_ID` y `SANITY_DATASET` no están en el entorno del Worker. Todo el contenido "editable" sale de los respaldos del código. |
| **Evidencia** | `[medido]` 0 referencias a `cdn.sanity.io`; textos idénticos a `sanity.ts:255,285,287` |
| **Impacto** | Operación — complejidad sin beneficio, y el número falso de WhatsApp entra por aquí |
| **Prioridad** | **P1** |
| **Recomendación** | Decidir: cargar las variables en el Worker y poblar el CMS, **o** retirar la capa y dejar el contenido en código. |
| **Magnitud** | Pequeña (decidir) / Mediana (poblar) |
| **Dependencias** | Decisión del cliente + credenciales |
| **Aceptación** | O el HTML servido contiene contenido de Sanity, o el código ya no depende de Sanity. Sin estado intermedio. |

---

**`SPACE-025` · El ritmo vertical no escala con la tipografía**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Todas las cabeceras · Desktop |
| **Problema** | `mt-6` (24 px) fijo entre el H2 y su párrafo, tanto si el H2 mide 36 px (ratio 0,67×) como 60 px (ratio 0,40×). En desktop el párrafo queda colgado del titular. |
| **Evidencia** | `[medido]` §7.3 — 4 secciones con el mismo patrón |
| **Impacto** | Visual |
| **Prioridad** | **P2** |
| **Recomendación** | Ritmo vertical proporcional al tamaño tipográfico o escalado por breakpoint (24 px → 32–40 px en `md`). |
| **Magnitud** | Pequeña |
| **Dependencias** | Sistema de diseño |
| **Aceptación** | La separación entre título y párrafo se sitúa entre 0,55× y 0,75× del tamaño del título en todos los breakpoints. |

---

**`SPACE-026` · Seis medidas distintas para bloques equivalentes**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Todas · Desktop |
| **Problema** | 34rem / 36rem / 40rem / 42rem / 48ch / 22ch para seis cabeceras que cumplen la misma función. |
| **Evidencia** | `[medido]` §7.4 |
| **Impacto** | Visual — impide leer la página como un sistema |
| **Prioridad** | **P2** |
| **Recomendación** | Tres medidas tokenizadas: `narrow` (~45ch), `default` (~65ch), `wide` (~75ch). |
| **Magnitud** | Pequeña |
| **Dependencias** | Sistema de diseño |
| **Aceptación** | Todo bloque de texto usa uno de tres tokens de medida; cero valores arbitrarios. |

---

**`UX-027` · El subrayado del hover del navbar nunca aparece**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Navbar · Desktop |
| **Problema** | El `<span>` usa `group-hover:w-full` pero el enlace no tiene la clase `group`. El efecto está escrito y muerto. |
| **Evidencia** | `Nav.tsx:49-52` |
| **Impacto** | UX — feedback de hover incompleto |
| **Prioridad** | **P2** |
| **Recomendación** | Añadir `group` al enlace, o resolver el subrayado sin `group`. |
| **Magnitud** | Pequeña (1 palabra) |
| **Dependencias** | Ninguna |
| **Aceptación** | Al pasar el cursor sobre un enlace de la barra, la línea de acento se despliega de 0 al 100 % del ancho. |

---

**`SEO-028` · El H1 se lee "Un marde ideas" en texto plano**

| Campo | Contenido |
|---|---|
| **Sección / Viewport** | Hero · Todos |
| **Problema** | El H1 contiene dos `<span>` de bloque sin espacio entre ellos. El `aria-label` de cada mitad está bien, pero el `textContent` que ve un rastreador es `"Un marde ideas"`. |
| **Evidencia** | `[medido]` sobre el HTML servido |
| **Impacto** | SEO/AEO |
| **Prioridad** | **P2** |
| **Recomendación** | Se resuelve solo al reescribir el H1 (`UX-005`). Si el eslogan sobrevive, separar con un espacio real. |
| **Magnitud** | Pequeña |
| **Dependencias** | `UX-005` |
| **Aceptación** | El `textContent` del H1 contiene palabras separadas correctamente. |

---

## 26. MAPA VISUAL DE LA HOME ACTUAL

```
                    DESKTOP 1440 · 9 480 px · 10,5 pantallas
════════════════════════════════════════════════════════════════════════

   NAVBAR  fijo 68 px                                    [OK] conservar
   ├─ 5 enlaces + CTA naranja
   └─ CTA desaparece < 640 px · sin estado activo        [~] rediseñar jerarquía
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  HERO                        900 px  ·  9,5 %        [X] REEMPLAZAR │
│  "Un mar de ideas" + delfín + firma                                │
│  Sin propuesta · sin CTA · 64 % de vacío                           │
└───────────────────────────────────────────────────────────────────┘
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  MURO DE CUENTAS             218 px  ·  2,3 %      [~] RECONSIDERAR │
│  26 monogramas de 2 letras en marquesina                           │
│  Mecanismo excelente · contenido placeholder                       │
└───────────────────────────────────────────────────────────────────┘
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  CLIENTES                   1748 px  · 18,4 %        [~] REDISEÑAR  │
│  Carrusel 3-en-3 · 26 cuentas · 9 páginas                          │
│  [X] Misma imagen borrosa x26 · tarjetas de 971 px                 │
│  [OK] El copy por cuenta es el mejor activo del sitio              │
└───────────────────────────────────────────────────────────────────┘
                              ↓         ← 384 px de vacío, mismo color
┌───────────────────────────────────────────────────────────────────┐
│  SERVICIOS                  1152 px  · 12,2 %        [OK] CONSERVAR │
│  3 filas editoriales · la mejor pieza de diseño                    │
│  [~] Solo 3 servicios genéricos · flechas que no enlazan           │
└───────────────────────────────────────────────────────────────────┘
                              ↓         ← 336 px de vacío
┌───────────────────────────────────────────────────────────────────┐
│  PROCESO                    1246 px  · 13,1 %        [OK] CONSERVAR │
│  5 pasos + riel que se llena con el scroll                         │
│  [OK] La única animación verdaderamente funcional                  │
│  [~] Mitad derecha vacía (~700 px)                                 │
└───────────────────────────────────────────────────────────────────┘
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  MANIFIESTO                  236 px  ·  2,5 %          [X] ELIMINAR │
│  Marquesina de texto contorneado a 2,63:1                          │
│  (!) Contiene el mejor copy de posicionamiento del sitio           │
└───────────────────────────────────────────────────────────────────┘
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  HERRAMIENTAS               1279 px  · 13,5 %         [~] REUBICAR  │
│  Bento de 6 celdas  ·  MOBILE: 2021 px = 17,7 %  [X]               │
│  [X] Kommo y CapCut sin logo · "Kommo" atenuado                    │
└───────────────────────────────────────────────────────────────────┘
                              ↓         ← 384 px de vacío
┌───────────────────────────────────────────────────────────────────┐
│  EL SOCIO                   1322 px  · 13,9 %        [~] REDISEÑAR  │
│  Retrato sticky + relato · layout propio [OK]                      │
│  [X] Sin cargo · sin credenciales · sin oferta                     │
│  [X] "Daniel Vallejo" a 72 px = texto más grande del sitio         │
└───────────────────────────────────────────────────────────────────┘
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  CONTACTO                    818 px  ·  8,6 %        [OK] CONSERVAR │
│  Formulario 4 campos + WhatsApp · bien construido [OK]             │
│  [X] El formulario no entrega el lead a nadie                      │
│  [X] WhatsApp → número falso                                       │
└───────────────────────────────────────────────────────────────────┘
                              ↓
┌───────────────────────────────────────────────────────────────────┐
│  FOOTER                      562 px  ·  5,9 %        [OK] CONSERVAR │
│  4 columnas · datos reales · bien resuelto [OK]                    │
│  [X] Redes → home de cada plataforma                               │
│  (!) Aquí vive la mejor frase de posicionamiento, en 14 px         │
└───────────────────────────────────────────────────────────────────┘
```

**Recuento:** conservar **5** · reconsiderar **4** · eliminar/reemplazar **2**

---

## 27. LOS 15 CAMBIOS DE MAYOR IMPACTO

Ordenados por mejora esperada, no por esfuerzo.

| # | Cambio | Por qué está aquí | Prioridad | Magnitud |
|---:|---|---|---|---|
| **1** | **Reescribir el hero para que venda: qué, para quién, qué resultado, y un CTA.** | Es la única pantalla que ve el 100 % de las visitas y hoy no comunica nada comercial. Arregla el mayor déficit (claridad, 3/12) y arrastra conversión y SEO. | P0 | Grande |
| **2** | **Conectar el formulario a un destino real y corregir el número de WhatsApp.** | Hoy el sitio pierde el 100 % de los leads del formulario y el canal directo lleva a un número inexistente. **Todo lo demás es irrelevante si el lead no llega.** | P0 | Pequeña |
| **3** | **Definir y publicar el posicionamiento del ecosistema (ATRAER→CONVERTIR→ESCALAR), con FENIAX y "Ventas Inteligentes" presentes.** | Es la razón de ser del rediseño. Sin esto, el sitio seguirá siendo el de una agencia creativa más. | P0/P1 | Grande |
| **4** | **Sustituir las 26 imágenes idénticas por material real (o rediseñar la tarjeta para no depender de imagen).** | Es el mayor destructor de percepción premium y de confianza. Convierte el mejor activo del sitio (26 clientes) en su peor señal. | P1 | Grande |
| **5** | **CTA persistente en mobile + sembrar CTA cada ≤ 2,5 pantallas.** | 7,8 pantallas sin acción, y en mobile cero acción en la barra. Corrige la fuga en el punto exacto donde el usuario ya está convencido. | P0 | Mediana |
| **6** | **Añadir prueba dura: 3–5 resultados verificables + 2–3 testimonios firmados.** | La confianza es lo que separa "me gusta" de "escribo". Sin inventar cifras. | P1 | Mediana |
| **7** | **Poner logotipos reales de cliente en el muro y arreglar Kommo/CapCut.** | Dos problemas de credibilidad que se resuelven con material y una corrección de código; el mecanismo ya está construido y esperando. | P1 | Mediana |
| **8** | **Establecer el sistema de diseño formal: escala tipográfica, ritmo vertical proporcional, tres medidas de texto, escala de espaciado de sección.** | Ataca de raíz los hallazgos 20, 25, 26, 33, 34 y buena parte del §19. Es el multiplicador de todo lo demás. | P1/P2 | Mediana |
| **9** | **Rediseñar Clientes en mobile: fuera los 26 puntos, tarjeta más baja, patrón de scroll nativo.** | Mobile es donde llega el tráfico de Meta y TikTok, y hoy la prueba social es impracticable ahí. | P0 | Mediana |
| **10** | **Base de SEO técnico: sitemap, canonical, `og:image`, dominio definitivo.** | Cuatro correcciones pequeñas que suben "SEO readiness" de 2/10 a ~6/10. Bloqueadas por una sola decisión: el dominio. | P0 | Pequeña |
| **11** | **Dar autoridad y oferta propia a El Socio.** | Es la tercera unidad de negocio y hoy es una biografía sin credenciales ni forma de contratarla. | P1 | Mediana |
| **12** | **Añadir JSON-LD (`Organization`, `LocalBusiness`, `Person`, `Service`).** | Es lo que permite que Google y los motores de IA entiendan qué es DOFI, dónde está y qué vende. Coste bajo, efecto compuesto. | P1 | Pequeña |
| **13** | **Arreglar el rendimiento de imágenes y quitar el `delay` del elemento LCP.** | ~250 KB evitables y una LCP mobile que pasa de 4,4 s a ~2,4 s. Falla de Core Web Vitals resuelta. | P0/P1 | Mediana |
| **14** | **Comprimir la página: eliminar el manifiesto, reducir Herramientas, aprovechar los vacíos estructurales.** | De 10,5 a ~7 pantallas en desktop y de 13,5 a ~9 en mobile. Menos scroll, más densidad, mejor ritmo. | P1 | Mediana |
| **15** | **Introducir vídeo real.** | Una productora audiovisual sin una sola pieza de vídeo es la contradicción más visible del sitio. El componente ya existe. | P1 | Grande |

---

## 28. ORDEN DE REDISEÑO PROPUESTO

Este orden **no** sigue la plantilla del brief. Está construido a partir de lo encontrado, y responde a tres criterios: **primero lo que hoy pierde dinero, después lo que decide todo lo demás, al final lo que solo se puede hacer cuando existe el contenido.**

### FASE 0 — Parar la fuga *(antes de tocar el diseño)*
Cambios pequeños, de altísimo retorno, que no dependen de ninguna decisión estratégica.

| Paso | Qué | Por qué antes que nada |
|---|---|---|
| **1** | **Destino real del formulario** (Kommo / n8n / correo) | Cada día que pasa se pierden leads reales |
| **2** | **Número de WhatsApp correcto** | Idem |
| **3** | **URLs reales de redes sociales** | 15 minutos, credibilidad inmediata |
| **4** | **Decidir el dominio de producción** | **Bloquea los pasos 5, 6 y 7** — es la decisión más urgente del proyecto |
| **5** | Canonical + sitemap + robots | Depende del paso 4 |
| **6** | `og:image` + `og:url` correctos | Depende del paso 4 |
| **7** | Resolver Sanity: poblarlo o retirarlo | Elimina ambigüedad operativa y es el origen del número falso |

### FASE 1 — Decidir el mensaje *(sin diseñar todavía)*
Nada de lo visual se puede resolver bien antes de esto.

| Paso | Qué |
|---|---|
| **8** | **Definir la propuesta de valor de DOFI en una frase** |
| **9** | **Definir el modelo ATRAER→CONVERTIR→ESCALAR** y qué se cuenta de cada marca en la home |
| **10** | **Definir el catálogo real de servicios** de las tres unidades |
| **11** | **Definir la oferta y el camino de conversión de El Socio** |
| **12** | **Recopilar prueba**: resultados verificables, testimonios, credenciales de Daniel |
| **13** | **Recopilar material**: logos de clientes, frames por cuenta, vídeo, fotografía profesional |

> **El paso 13 es el cuello de botella real del proyecto.** Los hallazgos de percepción premium más graves (VIS-012, VIS-015, BRAND-018) son problemas de material, no de diseño. Conviene arrancarlo en paralelo con la Fase 0, porque depende de terceros y es lo que más tarda.

### FASE 2 — Sistema de diseño *(el multiplicador)*

| Paso | Qué |
|---|---|
| **14** | **Escala tipográfica tokenizada** — resuelve los tres H2, los cuatro H3 y los once line-heights |
| **15** | **Ritmo vertical proporcional** — resuelve el `mt-6` fijo |
| **16** | **Tres medidas de texto** — resuelve las seis medidas actuales |
| **17** | **Escala de espaciado de sección + alternancia de superficie** — resuelve los 384 px de vacío |
| **18** | **Sistema de objetivos táctiles ≥ 44 px** |
| **19** | **Sistema de CTA**: primario / secundario / contextual, con reglas de aparición |

> Se conservan tal cual: la paleta y su calibración de contraste, la escala de radios, la ausencia de sombras, la curva de easing única y el contenedor de 1 400 px. **Están bien y son la base sobre la que construir.**

### FASE 3 — Componentes, en orden de impacto

| Paso | Componente | Motivo del orden |
|---|---|---|
| **20** | **Hero** | Máximo impacto, y ya se apoya en el mensaje (Fase 1) y en el sistema (Fase 2) |
| **21** | **Navbar** | Después del hero, porque su CTA y su jerarquía dependen de la nueva arquitectura |
| **22** | **Bloque de posicionamiento del ecosistema** *(nuevo)* | Es la pieza que hoy no existe y que sostiene todo el argumento |
| **23** | **Prueba social — muro + clientes** | Con logos y material reales ya disponibles |
| **24** | **Servicios** | Expandir al catálogo real; convertir en enlaces |
| **25** | **Casos / resultados** *(nuevo o reforzado)* | Con la prueba dura de la Fase 1 |
| **26** | **FENIAX** *(nuevo)* | Requiere que 22 y 24 estén definidos |
| **27** | **El Socio** | Con credenciales, oferta y foto nueva |
| **28** | **Proceso** | Ya funciona: solo comprimir y aprovechar la mitad vacía |
| **29** | **Herramientas** | Comprimir a franja y reubicar tras la prueba real |
| **30** | **Contacto** | Estructura buena; adaptar a los nuevos caminos de conversión |
| **31** | **Footer** | Ya funciona; ajustar a la nueva arquitectura |

> **Equipo y testimonios no aparecen como pasos independientes**: hoy no existe material para ninguna de las dos. Se integran en 23 y 27 cuando el contenido esté disponible.
> **El manifiesto no aparece**: se elimina y su copy se absorbe en 20 o 22.

### FASE 4 — Cierre

| Paso | Qué |
|---|---|
| **32** | **Motion** — auditar cada animación contra la clasificación del §16; quitar las tres perjudiciales, conservar las funcionales y premium |
| **33** | **Responsive final** — mobile como producto propio, no como reducción |
| **34** | **Accesibilidad** — objetivos táctiles, foco en el menú móvil, revisión de contraste tras cualquier cambio de paleta |
| **35** | **SEO / GEO** — JSON-LD completo, encabezados, enlazado interno, entidades del §21.2 |
| **36** | **Performance** — optimizador de imágenes, LCP, TBT, presupuesto de recursos |
| **37** | **Tracking** — eventos de conversión, UTM hasta el CRM, atribución por canal |

### Diferencias respecto al orden sugerido en el brief, y por qué

| Cambio | Motivo |
|---|---|
| **Se antepone una Fase 0 de correcciones** | El formulario que pierde leads y el WhatsApp roto no pueden esperar a un rediseño completo |
| **Se antepone una Fase 1 de mensaje** | Diseñar el hero antes de decidir qué dice el hero garantiza rehacerlo dos veces |
| **La recopilación de material arranca el día 1** | Depende de terceros y es el cuello de botella de los peores hallazgos visuales |
| **El Design System va en 2ª posición, no en 1ª** | Un sistema de diseño definido antes de conocer el mensaje termina ajustándose al mensaje igualmente |
| **Social proof sube por delante de Servicios** | Es el activo más fuerte y hoy el peor presentado: mayor retorno por unidad de esfuerzo |
| **FENIAX aparece como paso propio** | En el brief estaba, pero en el sitio actual no existe: hay que construirlo, no ajustarlo |
| **Equipo y Testimonios no son pasos autónomos** | No hay material; forzarlos como hitos crearía secciones vacías |
| **El Tracking cierra** | Medir antes de que existan los caminos de conversión definitivos no sirve de nada |

---

## Cierre

**Este sitio no está mal construido. Está bien construido y a medio terminar, y no fue escrito para vender.**

Lo que ya funciona y hay que proteger en el rediseño:

- El contenedor de 1 400 px, respetado en las 8 secciones sin excepción
- La paleta y su calibración de contraste — 11 de 12 combinaciones en AA o AAA
- La ausencia total de sombras y la escala de radios documentada
- Una sola curva de easing en toda la página y una escala de duraciones coherente
- `prefers-reduced-motion` implementado en tres capas
- CLS de 0,0015 y fuentes auto-alojadas
- La marquesina de cuentas, las filas editoriales de servicios y el riel de proceso
- El copy específico de las 26 cuentas y de los 5 pasos del proceso
- El footer

Lo que hay que cambiar es de otro orden: **el sitio presenta una marca cuando debería vender un sistema.** El hero es una portada. La prueba social existe pero está representada con placeholders. Dos de las tres marcas del ecosistema no aparecen. Y el formulario que debería recoger el resultado de todo ese esfuerzo no entrega el lead a nadie.

El 38,5 no mide la calidad del trabajo hecho. Mide la distancia entre lo que el sitio ya puede hacer y lo que todavía no le han pedido que haga.

---

*Auditoría realizada sobre `https://pagina-dofi.feniax-crm.workers.dev/` (commit `762945f`) el 20 de agosto de 2026. Mediciones con Chrome headless sobre la URL en producción, en 5 viewports. No se modificó ningún archivo del sitio.*
