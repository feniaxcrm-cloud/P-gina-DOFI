# Tráfico / Ads + formulario, botones y WhatsApp — Resultados (2026-10-02)

## Tráfico / Ads

### 1. Hero: cifras que cuentan desde cero y tres plataformas

La composición de la derecha ahora es **un panel por plataforma**, cada uno con su logo y su
nombre bien visibles: **META ADS** (me gusta), **TIKTOK ADS** (visualizaciones) y **GOOGLE ADS**
(ventas).

- Las cifras **arrancan en cero y suben** en unos 3 segundos cada una (con easing y en
  escalonado): 0 → 18,4 mil ▲24 %, 0 → 412 mil ▲38 %. Las líneas de tendencia se dibujan a la par.
- **La historia en 5 segundos**: primero suben los me gusta y las visualizaciones; Google Ads
  arranca «¿? · sin conexión» y, al tercer segundo, **se conecta** (el panel se enciende, el
  borde punteado pasa a sólido) y las ventas cuentan desde cero hasta 1,2 mil ▲52 %. Es lo que
  hace DOFI: conectar el tráfico con las ventas.
- Se reproduce **una vez, al entrar en pantalla**. Con movimiento reducido no corre: se ve el
  cuadro final, todo conectado.
- Es una ilustración y lo dice: debajo lleva «Cifras ilustrativas». Los logos son uso nominativo
  (los mismos de «¿Dónde traficamos?»).
- Se lee en teléfono (las cifras no se parten en dos líneas).

### 2. «Nuestro sistema»: texto comercial y breve

> Ninguna marca se parece a otra, ni siquiera en el mismo nicho. Diseñamos campañas a la medida
> de tus objetivos, con la mirada puesta en vender y posicionar tu marca.
>
> Nuestra ciencia son los datos: los medimos e interpretamos para tomar las decisiones correctas.
>
> **Cada campaña tiene un rumbo.**

Cubre lo pedido: estrategias personalizadas, enfoque en ventas y posicionamiento, y uso e
interpretación de datos. Dos frases cortas, no un bloque.

### 3. «Para nosotros, todo son datos»: botón

Se agregó al pie de la sección el botón **«Quiero mejorar mis ventas»** (lleva al formulario con
«Pauta» marcado).

### 4. Cierre «¿Listos para poner tu inversión en movimiento?»: imagen a la derecha

Nuevo tipo de sección en el Studio, **«Cierre con imagen a la derecha»** (`ctaImageBanner`):
texto y botón grande a la izquierda y la imagen **completa** (sin recortes ni deformación) a la
derecha; en teléfono, debajo del texto. Mismo fondo, misma escala de título y mismo botón que el
cierre de siempre. **Sin imagen**, se ve como el cierre normal (texto centrado).

**⚠ Falta la imagen:** el mensaje decía «imagen 5», pero solo llegaron tres imágenes (hero,
texto y método) y el PDF no trae ninguna. La sección ya está lista: basta subir la imagen en el
Studio (Tráfico / Ads → el cierre → «Imagen») y aparece a la derecha, sin tocar código.

## Cambios en todas las páginas (menos Inicio)

### 1. Formulario en los banners finales

Los botones de los banners finales (Marketing Digital, Tráfico/Ads, ChatBots/CRM y el cierre de
cada ficha de cliente) llevan a **`/contactanos`**, que era una página «en
construcción» y ahora es el formulario. Cuatro campos, ni uno más:

| Campo | Tipo |
|---|---|
| Nombres y Apellidos | texto (obligatorio) |
| Servicio que requiere | selección múltiple: Marketing 360 · Pauta · CRM · Asesorías 1a1 (al menos uno) |
| Detalle de lo que necesita | texto (opcional) |
| Nombre del Negocio | texto (obligatorio) |

- **El servicio llega marcado según la página de origen**: Marketing Digital → Marketing 360,
  Tráfico/Ads → Pauta, ChatBots/CRM → CRM (`/contactanos?servicio=pauta`); para Asesorías, el
  enlace es `?servicio=asesorias`. Se puede cambiar o sumar más.
- **Asesorías** sigue «en construcción» (sin secciones activas): cuando tenga su cierre, su
  botón se carga con ese enlace (`scripts/ajustar-ctas.mts` ya lo prevé).
- **Al enviar, se abre WhatsApp** (el número de DOFI de `company.ts`) con el mensaje armado:
  `Hola como estan mi nombre es <nombre> pertenezco a la empresa <negocio> y le escribo por el
  servicio de <servicios>` (varios: «Pauta y CRM», «Marketing 360, Pauta y CRM»). Verificado con
  un navegador real: el envío vacío marca los errores y no abre nada; el correcto abre
  `wa.me/593984472869` con el texto exacto. Si el navegador bloquea la ventana, queda un botón
  «Abrir WhatsApp».
- **Una decisión mía:** si la persona escribe el «Detalle», va en una línea aparte al final del
  mensaje (`Detalle: …`); el texto pedido no lo incluía y, sin eso, el campo se perdería. Se
  quita en una línea (`mensajeFormulario` en `src/lib/cta.ts`).
- Sencillo y limpio: fondo de marca, una tarjeta con los cuatro campos, el botón en naranja y
  sin otra distracción. Accesible (etiquetas, errores anunciados, foco visible, teclado).
- Los botones de la portada y el método de **ChatBots/CRM** siguen abriendo WhatsApp con «Hola,
  quiero integrar un CRM en mi empresa» (se pidió así antes); solo su cierre va al formulario.

### 2. Un solo texto en todos los botones: «Quiero mejorar mis ventas»

Aplicado en el respaldo del código y **en Sanity** (`scripts/ajustar-ctas.mts`): Marketing
Digital (antes «Quiero Mejorar mis Ventas»), Tráfico/Ads (antes «Quiero impulsar mi marca»),
ChatBots/CRM, el botón de envío del formulario y el cierre de las fichas de cliente (antes
«Iniciar proyecto»). El texto vive en un solo lugar (`TEXTO_CTA`, `src/lib/cta.ts`). Inicio no se
tocó.

### 3. Botón flotante de WhatsApp

En **todas las páginas**: un círculo verde de 52 px abajo a la derecha, con el icono de WhatsApp.
Abre el chat de DOFI con el mensaje exacto **«Hola DOFI me gustaría contratar sus servicios.»**.
Discreto: sin texto ni animación permanente (solo crece un poco al pasar el cursor), respeta la
zona segura de los teléfonos, tiene etiqueta para lectores de pantalla y foco visible. El verde
es un tono más hondo que el de la app para que el icono blanco llegue a 3:1 de contraste.

*Nota:* el encabezado de esa sección decía «excepto Inicio», pero el punto del botón dice «en
todas las páginas»; lo puse **también en Inicio**. Si no lo quieren ahí, es una línea (se saca de
`src/app/layout.tsx` y se pone en cada página que lo lleve).

## CMS (Sanity)

- Nuevo tipo **«Cierre con imagen a la derecha»** en la página Tráfico / Ads.
- `scripts/ajustar-ctas.mts` (un solo uso, simulación por defecto, copia de seguridad de cada
  documento antes de escribir) deja los datos al día: textos de botones, enlaces al formulario,
  el cierre de Tráfico en el tipo nuevo, el botón del método y el texto de «Nuestro sistema»
  (este solo si seguía siendo el que cargó el sembrado: una edición a mano se respeta).

## Código

- `src/lib/cta.ts` (texto, servicios, enlaces y mensajes), `src/components/contacto/`,
  `src/app/contactanos/page.tsx`, `src/components/BotonWhatsApp.tsx`, `BotonCta.tsx`
  (`clasesBoton` y `estiloBoton` para usar el mismo botón como `<button>`).
- `src/components/trafico/`: `HeroProblema.tsx` (cifras que cuentan), `TraficoCierre.tsx`.
- `studio/schemaTypes/marketing/ctaImageBanner.ts`.
