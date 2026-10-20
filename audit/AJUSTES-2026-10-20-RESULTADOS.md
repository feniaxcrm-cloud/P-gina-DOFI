# Ajustes del 2026-10-20 · Resultados

Publicado con el commit `a0ef077`. El Studio se redesplegó y los datos de Sanity se aplicaron con copia previa en `audit/`.

## Decisiones del propietario
- **Tráfico/Ads:** el Panel de Meta Ads de «Clientes y casos de éxito» se reemplaza por los logos, igual que en las otras tres páginas. Sus métricas por giro quedan guardadas en Sanity.
- **Publicación:** se pidió subir al terminar.

## 1. Asesorías
- **Botón del cierre:** un paso más chico.
  - Escritorio: 370 × 68 px, letra de 19 px (antes 415 × 76, 21 px).
  - Celular: 311 × 56 px (antes 337 × 60).
  - Es un tamaño nuevo, «medio», en `BotonCta`, que solo usa el cierre de Asesorías. Mismo estilo, colores, destino y animación.
- **Formulario** (`/contactanos`, el único del sitio):
  - «Detalle de lo que necesita (opcional)» pasa a ser **«Cuéntame, ¿Qué está pasando con tu negocio?»**, obligatorio.
  - Si queda vacío, aparece «Cuéntanos qué está pasando con tu negocio.» y no se abre WhatsApp.
  - La respuesta va en el mensaje de WhatsApp: «Lo que está pasando con mi negocio: …».
- **Sección nueva «Videos en celulares»**, antes del cierre: tres celulares, el del centro más grande y con un halo de marca.
  - Cada uno tiene su propio video, título y portada en Sanity.
  - Los videos no se piden hasta que la sección está a ~500 px de verse (al cargar la página: 0 pedidos).
  - Se reproducen al tocarlos, con sonido y de a uno; al salir de pantalla se pausan.
  - En el celular, la fila se desliza con el dedo y arranca en el del centro.
  - Hoy no tienen videos y muestran «Pronto verás aquí nuestro video».

## 2. Home
- **Tarjeta «Academia»** («Aprende todo sobre Inteligencia Artificial») en la banda del hero, con el mismo estilo e ícono de birrete.
  - Sin enlace: el sitio no tiene página de Academia. Cuando exista, se le pone la ruta en el Studio y pasa a ser un enlace.
  - Distribución: 5 en una fila en pantallas anchas; 3 + 2 en laptops chicas; 2 por fila en tablet; 1 en el celular.
- **«Mira nuestro trabajo» (`/redes`):**
  - «Daniel» → «Daniel Vallejo - El Socio», con la misma URL.
  - Nuevo: TikTok de Daniel Vallejo - El Socio (https://www.tiktok.com/@danielvallejo_69), en pestaña nueva.
  - Los de DOFI siguen iguales.

## 3. Banner de ChatBots / CRM en el Home
En escritorio, el botón tapaba la foto (la taza y «Automatizaciones»). Se corrió a la izquierda: «Centro-izquierda» con ajuste −2, la misma altura. Es un dato de Sanity: se sigue moviendo desde el Studio. En el celular el botón va en su propia fila.

## 4. ChatBots / CRM
- **Portada:** el celular con el video estilo TikTok (el mismo componente, con sus contadores simulados) va a la derecha, en lugar de la animación del panel de FENIAX CRM.
  - Escritorio: hasta 330 px de ancho. Celular: hasta 280 px.
  - El video, la portada, el usuario, la descripción y los contadores se cargan en la portada de CRM, en el Studio. Ya se cargaron el usuario y los contadores de arranque.
  - **Falta subir el video.**

## 5. «Clientes y casos de éxito» en las cuatro páginas
- **Izquierda:** el carrusel de giros con su fila de logos, sin cambios.
- **Derecha:** los **logos del giro abierto en círculos**. Cambian al elegir otro giro, con un fundido corto.
  - Los logos se ven enteros dentro del círculo, sin deformarse ni recortarse, y conservan su transparencia.
  - Usan las mismas URLs de la fila: el navegador los baja una sola vez.
  - Si no entran, la columna se desplaza por dentro con un desvanecido abajo.
- **Qué deja de verse:** el celular TikTok de Marketing y Asesorías (pasó al hero de CRM), el panel de Meta de Tráfico y el teléfono con la demo de WhatsApp de CRM. Las métricas y las conversaciones por giro quedan en Sanity.
- **Nuevo en Sanity, en cada sección de Clientes → «Presentación de los logos»:**
  - Forma: círculo o ficha redondeada.
  - Tamaño en computadora: 72–180 px, por defecto 112.
  - Tamaño en celular: 56–140 px, por defecto 84.
  - Es solo presentación: el archivo del logo no se toca.

## 6. Tráfico / Ads
Vuelven **Google Ads** y **Tráfico web** con sus textos de siempre (los del sembrado del 2026-10-02). Ahora son 4 tarjetas en una fila en escritorio, 2 en tablet y 1 en el celular. Tráfico web lleva un ícono de analítica (gráfica ascendente).

## Sanity
- **Tipos nuevos:**
  - `ajusteLogos`: forma y tamaños.
  - `videoCelular`: video, título y portada.
  - `celularesBanner`: «Videos en celulares», con celular izquierdo, central y derecho.
- **Tipos ampliados:**
  - `clientsBanner`, `metricsClientsBanner`, `chatClientsBanner`: + «Presentación de los logos». De `clientsBanner` salen los campos del video, que ya no se muestra ahí.
  - `teamBanner`: + los campos del celular con video, visibles solo en ChatBots/CRM (`camposVideoTikTok`).
  - `capacidad`: + ícono «Birrete — academia».
  - `asesoriasPage`: + la sección nueva.
- **Datos** (`npm run ajustar:2026-10-20`, ya aplicado):

| Documento | Cambio | Copia previa |
| --- | --- | --- |
| `banners` | botón del banner de CRM: centro-izquierda −2 | `backup-banners-antes-de-ajustes-2026-10-20.json` |
| `traficoAdsPage` | + Google Ads y Tráfico web | `backup-traficoAdsPage-antes-de-ajustes-2026-10-20.json` |
| `asesoriasPage` | + «Videos en celulares»; Clientes sin los campos del video | `backup-asesoriasPage-antes-de-ajustes-2026-10-20.json` |
| `marketingDigitalPage` | Clientes sin los campos del video (usuario y contadores de fábrica) | `backup-marketingDigitalPage-antes-de-ajustes-2026-10-20.json` |
| `chatbotsCrmPage` | portada: usuario y contadores de arranque del celular | `backup-chatbotsCrmPage-antes-de-ajustes-2026-10-20.json` |

## Archivos
- **Nuevos:**
  - `src/components/marketing/ClientesLogos.tsx`
  - `src/components/asesorias/TresCelulares.tsx`
  - `studio/schemaTypes/objects/ajusteLogos.ts`
  - `studio/schemaTypes/objects/videoCelular.ts`
  - `studio/schemaTypes/marketing/celularesBanner.ts`
  - `studio/schemaTypes/marketing/camposVideoTikTok.ts`
  - `scripts/ajustar-2026-10-20.mts`
- **Borrados** (eran solo los envoltorios del panel y de la demo): `ClientesMetricas.tsx` y `ClientesWhatsApp.tsx`. Las piezas de la demo de WhatsApp y del panel de Meta quedan en el proyecto, sin usarse.
- **Modificados:**
  - Componentes: `BotonCta`, `BannerFoto`, `CapabilityBand`, `ClientesCasos`, `TraficoClientes`, `FeniaxClientes`, `FeniaxPortada`, `VideoTikTok`, `FormularioContacto`, `IconoPlataforma`, `PaginaAsesorias`.
  - Datos y configuración: `cta.ts`, `company.ts`, `sanity.ts`, `marketing-digital.ts`, `trafico.ts`, `trafico-respaldo.ts`, `feniax.ts`, `asesorias.ts`.
  - Esquemas del Studio.
  - `.impeccable/config.json`: tamaño de letra de 19 px del botón «medio».

## Validación
- `tsc` del sitio y del Studio sin errores; `next build` correcto (44 páginas).
- **Sin desborde horizontal** en 360, 768, 1024 y 1440 px, en local y en vivo: Home, Marketing, Tráfico, CRM, Asesorías, /redes y /contactanos.
- **Formulario:** sin la respuesta muestra el error y no abre WhatsApp; con la respuesta, el mensaje la incluye.
- **/redes:** 4 enlaces correctos, en pestaña nueva.
- **Celulares de Asesorías:** probados con videos de prueba en una ruta temporal, ya borrada. 0 pedidos al cargar, 2 pedidos livianos al acercarse, uno a la vez, se pausan al salir de pantalla, sin errores.
- **En vivo, con capturas:** banner de CRM con el botón a la izquierda de la foto, 4 tarjetas en Tráfico, logos en círculos en Clientes, celular en el hero de CRM, tres celulares en Asesorías y tarjeta Academia.

## Pendiente o manual (en el Studio)
- **Videos:** subir el de la portada de ChatBots/CRM y los tres de «Videos en celulares» de Asesorías, opcionalmente con portada y título. Mientras tanto se ve «Pronto verás aquí nuestro video».
- **Academia:** cuando exista su página, ponerle la ruta a la tarjeta (Página de inicio → Capacidades). Hoy la banda usa las 5 tarjetas de fábrica porque esa lista está vacía en el Studio.
- **Contadores:** los del celular de CRM son simulados (8.240 / 312 / 145); conviene ajustarlos.
