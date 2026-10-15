# Ajustes del 2026-10-16 · Resultados

Publicado con el commit `5db28d7`. El Studio se redesplegó y los datos de Sanity se aplicaron con copia previa en `audit/`.

## 1. Home

### 1.1 Hero en el teléfono
En el teléfono la foto iba de fondo detrás del texto, con una máscara lateral pensada para escritorio: quedaba corrida a la derecha y la persona cortada en el borde.

Ahora, en teléfono, la foto va **arriba del texto**:
- a todo el ancho y completa, con la proporción de la pieza (16:9);
- centrada en el punto focal del Studio;
- fundida hacia abajo con el fondo.

En tablet y escritorio no cambia nada.

### 1.2 Banner 4 (Asesorías 1 a 1) en el teléfono
La foto se mostraba completa, y su protagonista (Daniel con «Asesorías uno a uno») está a la derecha de la pieza, así que quedaba corrido.

Ahora, en el teléfono, la foto se **encuadra en Daniel**:
- el encuadre se hace con el punto focal de la foto en Sanity (x = 0,636), y se puede ajustar en el Studio;
- un recorte más angosto deja centrados a Daniel y al título completo.

El escritorio no cambia y no hay desbordes horizontales.

## 2. Marketing Digital

### 2.1 Hero: imagen de la derecha editable (PNG)
- **Campo nuevo** en la portada de Marketing Digital: «Imagen de la derecha (PNG con transparencia)» (`imagenDerecha`), con su texto alternativo opcional.
- **El fondo no se edita** desde el Studio: es el morado de marca de siempre. En esta página se ocultaron la foto de fondo y su versión móvil.
- **Datos migrados:** el PNG que había (2077 × 757, con mucho margen vacío) se recortó justo a su contenido (1040 × 571) con la CDN de Sanity, sin perder la transparencia, y quedó cargado en el campo nuevo.
- **Escritorio:** la imagen va abajo a la derecha, completa, sin recortes; el texto sigue a la izquierda.
- **Teléfono y tablet:** la imagen va arriba del texto, centrada y con su proporción.

### 2.2 Clientes y casos de éxito: video estilo TikTok
El video se muestra dentro de un **iPhone** como una publicación de TikTok:
- barra de estado arriba;
- el video en 9:16 exacto, sin deformarse;
- encima del video, «Siguiendo · Para ti» y la búsqueda;
- columna derecha con foto de perfil y «+», Me gusta, Comentarios, Compartir y el disco del sonido;
- abajo, el usuario, la descripción, «sonido original» y la barra de progreso;
- la barra de navegación de TikTok al pie.

Los colores siguen la identidad de DOFI: marco morado, «+» naranja y el logo de DOFI como perfil.

**Reproducción:**
- arranca solo y en silencio cuando se ve, y se reproduce una vez;
- tocarlo lo pausa o lo reanuda;
- al terminar aparece «Ver de nuevo»;
- fuera de pantalla se pausa;
- si la persona lo pausó, no vuelve a arrancar solo;
- con movimiento reducido no arranca solo.

**Contadores (simulación visual, no métricas reales):**
- arrancan en el valor del Studio y suben según el **tiempo del video**;
- pausado no suben, terminado quedan quietos y al verlo de nuevo vuelven al valor de arranque;
- el único bucle de animación corre solo mientras el video se reproduce y se cancela al pausar, terminar o desmontar.

**Sin video cargado** (hoy, en las dos páginas): se ve el teléfono con el aviso «Pronto verás aquí nuestro video».

## 3. ChatBots / CRM · íconos de herramientas en el hero
Íconos de GoHighLevel, Kommo, Bitrix24, n8n y Railway en el fondo del hero. Son tenues (opacidad baja) y decorativos: no son enlaces, no reciben foco y no los leen los lectores de pantalla.
- **Movimiento:** flotan muy despacio, entre 9 y 14 s por vuelta; con movimiento reducido se quedan quietos.
- **Escritorio:** repartidos por los bordes y el hueco entre columnas, sin tocar el título, el texto ni el botón.
- **Teléfono y tablet:** solo dos (GHL y n8n), arriba a la derecha junto al logo de FENIAX.

**Logos:**
- **n8n y Railway:** marca oficial (simple-icons).
- **Kommo:** archivo oficial del proyecto (`public/marcas/kommo.png`).
- **GoHighLevel:** su marca de tres flechas, la misma del banner del Home.
- **Bitrix24:** como texto con su color, porque no hay archivo oficial. Si mandan sus SVG oficiales, se reemplazan en `src/components/feniax/IconosHerramientas.tsx`.

## 4. Asesorías · Clientes y casos de éxito
Usa el mismo componente que Marketing Digital (`VideoTikTok`), con sus propios datos en el Studio: video, portada, usuario, descripción y contadores.

## Archivos
- **Nuevos:**
  - `src/components/MarcoIphone.tsx`: el marco de iPhone común; lo usan el video TikTok y la demo de WhatsApp de CRM.
  - `src/components/marketing/VideoTikTok.tsx`
  - `src/components/feniax/IconosHerramientas.tsx`
  - `scripts/ajustar-2026-10-16.mts`
- **Modificados:**
  - `src/components/Hero.tsx`
  - `src/components/home/BannerHibrido.tsx`
  - `src/remotion/home/tema.ts`
  - `src/components/marketing/BannerFoto.tsx`
  - `src/components/marketing/ClientesCasos.tsx`
  - `src/components/feniax/FeniaxPortada.tsx`
  - `src/components/feniax/MarcoTelefono.tsx`
  - `src/lib/marketing-digital.ts`
  - `src/lib/asesorias.ts`
  - `src/app/globals.css`
  - `package.json`
- **Borrado:** `src/components/marketing/VideoClientes.tsx` (lo reemplaza `VideoTikTok`).

## Sanity
- **Esquemas:**
  - `teamBanner`: nuevo campo `imagenDerecha`, visible solo en Marketing Digital. Ahí se ocultan la foto de fondo y su versión móvil.
  - `clientsBanner`: nuevos campos `usuarioTikTok`, `descripcionVideo`, `meGusta`, `comentarios` y `compartidos`, dentro de «Video estilo TikTok». Se actualizaron los textos de ayuda: video 9:16, se reproduce una vez.
- **Datos** (`npm run ajustar:2026-10-16`, ya aplicado):

| Documento | Cambio | Copia previa |
| --- | --- | --- |
| `marketingDigitalPage` | portada: `imagenDerecha` (PNG recortado), sin foto de fondo; Clientes: usuario y contadores de arranque | `backup-marketingDigitalPage-antes-de-ajustes-2026-10-16.json` |
| `banners` | banner de Asesorías: punto focal de la foto (x 0,636) | `backup-banners-antes-de-ajustes-2026-10-16.json` |
| `asesoriasPage` | Clientes: usuario y contadores de arranque | `backup-asesoriasPage-antes-de-ajustes-2026-10-16.json` |

## Qué se configura en el Studio
- **Marketing Digital → Equipo DOFI → «Imagen de la derecha (PNG con transparencia)»:** cambiar la imagen. Mejor si viene recortada justo al contenido y tiene al menos 1600 px de ancho.
- **Marketing Digital / Asesorías → Clientes y casos de éxito → «Video estilo TikTok»:** subir el video vertical 9:16 en MP4. Opcionales: la portada, el usuario, la descripción y los contadores de arranque.
- **Banners → Rescatando Emprendedores:** si se cambia la foto de primer plano, poner su punto focal sobre la persona para que quede centrada en el teléfono.

## Pruebas
- `tsc` del sitio y del Studio sin errores; `next build` correcto (44 páginas).
- Sin desborde horizontal en 360, 390, 768, 1024 y 1440 px (Home, Marketing, CRM, Asesorías).
- Video TikTok, probado con un video real en una ruta temporal (ya borrada), en Chrome:
  - se reproduce solo al verse y los contadores suben;
  - pausado, los contadores quedan iguales;
  - al reanudar vuelven a subir;
  - al terminar quedan en el valor final y aparece «Ver de nuevo»;
  - «Ver de nuevo» vuelve al valor de arranque;
  - fuera de pantalla se pausa y al volver sigue;
  - con movimiento reducido no arranca solo;
  - sin errores de consola.
- En la web publicada: hero y banner 4 del Home en teléfono, hero de Marketing en teléfono y escritorio, teléfono TikTok en Marketing y Asesorías, íconos en el hero de CRM.

## Pendiente o manual
- **Videos de Clientes:** subir los de Marketing Digital y Asesorías en el Studio. Hoy ninguna de las dos páginas tiene video y se ve el aviso.
- **Contadores:** son una simulación. Arrancan en 8.240 / 312 / 145; conviene ajustarlos en el Studio a cifras que DOFI considere adecuadas.
- **Logos oficiales:** los de GoHighLevel y Bitrix24 se pueden reemplazar si mandan los SVG.
