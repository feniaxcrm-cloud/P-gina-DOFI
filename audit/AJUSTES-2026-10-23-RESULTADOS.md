# Ajustes del 2026-10-23 · Resultados

Publicado con el commit `d7a7ada`; el build de Cloudflare terminó bien. El Studio se redesplegó y los datos de Sanity se aplicaron con copia previa en `audit/`.

## 1. Asesorías · celulares del mismo tamaño y más grandes
- **«Videos en celulares»:** los tres celulares miden lo mismo: misma altura, sin desplazamiento y con el mismo botón de reproducir.
- **Más grandes:** en escritorio pasan a unos 336 px de ancho a 1440 px (antes 312 el central y 270 los laterales), sin salirse de la pantalla. Se calcula con el alto útil de la ventana, sin pasar del 26% del ancho.
- **En el celular:** van en fila deslizable, hasta 290 px de ancho cada uno.

## 2. Home · Academia más breve
- **Descripción nueva:** «Aprende Inteligencia Artificial y nuevas herramientas para tu negocio.» Conserva lo principal: IA, herramientas y el negocio.
- **Altura:** la banda vuelve a su altura normal, 163 px a 1440 px (con el texto largo eran 203). Las 5 tarjetas miden lo mismo y en la fila de 5 el ancho vuelve a ser parejo.

## 3. Clientes y casos de éxito · logos redondos de verdad
Aplica a las cuatro páginas (Marketing Digital, Tráfico/Ads, ChatBots/CRM y Asesorías), en la columna derecha y en la fila que se desliza.

- **Antes:** el logo original (cuadrado o rectangular) se mostraba dentro de un círculo blanco o con su forma original.
- **Ahora:** cada logo tiene su **versión circular**, generada a partir del logo por `scripts/logos-circulares.mts` (`npm run logos:circulares`). El archivo original no se modificó.

**Cómo se generó cada versión**
- **Fondo de un solo color** (50 logos): círculo del color del fondo, con la marca, los colores y el nombre centrados y enteros. El fondo del archivo se vuelve transparente, así no queda el borde del cuadrado.
- **Fondo transparente** (9 logos): círculo blanco, o morado de marca si el logo es blanco, con el logo centrado y agrandado.
- **Foto o textura** (17 logos): recorte circular centrado, como foto de perfil. Incluye cuatro logos con decoración en las esquinas (Gimnasio Dorian, Casona del Zam, Universidad Católica y Scan 3D): se revisaron a ojo y su marca y nombre quedan dentro del círculo.

**Cobertura:** las 76 versiones circulares se revisaron en una hoja de contacto (original contra circular) y están asignadas a las 223 empresas que las usan, más 2 Cuentas.

**En Sanity**
- **Campo nuevo «Logo circular»** en las empresas de cada giro y en las Cuentas. Ya está cargado y se puede reemplazar a mano.
- **Si se cambia un logo:** hay que borrar su «Logo circular» y correr el script para regenerarlo; mientras tanto, la web recorta el logo en círculo sola.
- **«Presentación de los logos»** (mismo campo de antes): ahora ofrece «Logos redondos» (por defecto) y «Forma original». Los tamaños se siguen controlando ahí: 120 px en computadora y 92 px en celular.
- **Copias previas:** `backup-marketingDigitalPage-…`, `backup-traficoAdsPage-…`, `backup-chatbotsCrmPage-…`, `backup-cuenta-hospi-spa-…` y `backup-cuenta-dr-christian-jeton-…`, todas con el sufijo `-antes-de-logos-circulares-2026-10-23.json`.

## Archivos
- **Nuevos:**
  - `scripts/logo-circular.mts` (genera la versión circular de un logo)
  - `scripts/logos-circulares.mts` (la genera para todos los logos y la carga en Sanity)
  - `src/components/marketing/LogoRedondo.tsx`
  - `studio/schemaTypes/objects/campoLogoCircular.ts`
- **Modificados:**
  - `ClientesLogos.tsx` y `CarruselGiros.tsx`: logos redondos en la columna y en la fila.
  - `TresCelulares.tsx`: los tres celulares iguales.
  - `marketing-digital.ts`: `logoCircular` y forma por defecto.
  - `sanity.ts`: texto de Academia.
  - `ajusteLogos.ts`, `cuenta.ts`, `giroNegocio.ts`: esquemas del Studio.
  - `package.json`: script `logos:circulares`.

## Validación
- `tsc` del sitio y del Studio sin errores; `next build` correcto (44 páginas); build de Cloudflare correcto.
- **En vivo:**
  - Logos redondos en Marketing (Gastronomía), Tráfico (Turismo), CRM (Construcción, en celular) y Asesorías (Fitness, en tablet).
  - Los tres celulares de Asesorías iguales.
  - Banda del hero a 163 px.
- Sin desborde horizontal en 360, 768, 1024 y 1440 px en las cinco páginas.
