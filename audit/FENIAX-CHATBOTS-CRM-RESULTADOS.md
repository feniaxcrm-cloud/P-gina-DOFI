# FENIAX / ChatBots-CRM — Resultados

Armé la página `/chatbots-crm` como la página de **FENIAX**, con la misma estructura de
Marketing Digital (las mismas 7 secciones, ordenables y editables en Sanity) pero con la
identidad del **BRANDBOOK FENIAX**. Local, verificado, nada subido todavía.

## Qué se ve

| # | Sección (tipo en el Studio) | Qué tiene |
|---|---|---|
| 1 | Portada (`teamBanner`) | Logo FENIAX negativo, "RENACE TU MANERA DE **VENDER**", CTA que abre WhatsApp con "Hola, quiero integrar un CRM en mi empresa". A la derecha, un **teléfono con WhatsApp en vivo** (Remotion): alguien le escribe a FENIAX, la IA responde, agenda la demo y aparece el aviso "FENIAX CRM · Nuevo lead". |
| 2 | ¿Qué es FENIAX? (`aboutBanner`) | Misión del brandbook + los **6 valores de marca** (Innovación continua, Eficiencia, Resurgimiento, Adaptabilidad, Confianza, Compromiso). |
| 3 | Bloque editorial (`navigationBanner`) | "¿Demasiados mensajes, **pocas ventas?**" + video **"Así trabaja FENIAX"** (HyperFrames): mensajes de WhatsApp/Instagram/Facebook/Web → IA → embudo Nuevo → Seguimiento → Venta. |
| 4 | Método (`methodBanner`) | "Método FENIAX en 5 pasos", la misma ruta animada de DOFI con íconos FENIAX y el fuego del fénix en el destino. |
| 5 | Clientes (`chatClientsBanner`, **nuevo**) | El mismo carrusel de giros + logos de Marketing Digital; donde allá va el video, acá va un **teléfono con la demo de WhatsApp del giro abierto** (Gastronomía → "Tu restaurante" reservando mesa; Construcción → "Tu inmobiliaria"; etc.). Controles de video (play/pausa, barra para adelantar, tiempo). Al terminar una conversación pasa sola al giro siguiente; si el visitante elige un giro, se queda ahí. |
| 6 | Reseñas (`reviewsBanner`) | Las mismas reseñas reales de Google, con fondo FENIAX. |
| 7 | Cierre (`ctaBanner`) | Isotipo con brillo, "¿Listo para que tus **ventas renazcan?**", CTA grande a WhatsApp. |

`/feniax` (antes "Página en construcción") ahora redirige (308) a `/chatbots-crm`.

## Marca (brandbook)

- **Paleta exacta** del brandbook: morado `#792883`, berenjena `#2A1638`, naranja `#ED6D19`,
  rojo `#E5352A`. Se aplica con la clase `.tema-feniax` (globals.css), que redefine los
  tokens del sistema solo dentro de la página: los componentes compartidos con Marketing
  Digital se pintan FENIAX sin duplicarlos; Nav y Footer siguen siendo DOFI.
- **Logos vectoriales** extraídos del PDF del brandbook (no de los JPG): `public/feniax/`
  — color, negativo (letras blancas + "IA" en degradado, el de la portada del brandbook),
  blanco y el isotipo solo.
- Motivos: la cinta de líneas naranja→morado y la nube de puntos del brandbook
  (`OndasFeniax.tsx`, `Puntos`), el isotipo gigante como marca de agua.
- **Tipografía**: Broklin e Izmir no tienen archivo disponible; se usa Sora (la del sitio),
  que es geométrica como Broklin. Si me pasan los `.woff2`, es un cambio de una línea.
- Contrastes calculados (WCAG): texto 15,9:1; secundario 7,2:1; botón naranja con texto
  berenjena 5,35:1.

## Demos de WhatsApp (Remotion)

- `src/remotion/feniax/ChatWhatsApp.tsx`: una composición Remotion que dibuja la pantalla
  de WhatsApp cuadro a cuadro (tecleo, "escribiendo…", palomitas azules, fotos, aviso del
  CRM). La duración sale de los mensajes (`linea.ts`): **cambiar un mensaje en el Studio
  cambia el "video"**, no hay nada que grabar.
- Conversaciones por defecto para 11 tipos de negocio (`src/lib/chat-demo.ts`):
  restaurante, autos, inmobiliaria, gimnasio, salón de belleza, consultorio, tienda,
  academia, turismo, tecnología y servicios. Cada giro toma la suya por **nombre** (p. ej.
  "Automotriz" → autos) o por ícono. El encabezado dice "Tu restaurante", "Tu
  concesionario"…: es una demostración, no la cuenta de un cliente real.
- **8 fotos realistas generadas con IA** (ElevenLabs, Seedream 5 Pro, ~US$0,18 c/u) para
  los chats: plato, SUV, departamento, spinning, zapatillas, Galápagos, aula, manicure.
  `public/feniax/demo/*.jpg`, 35–78 KB cada una.
- Rendimiento: Remotion se descarga **diferido**, recién cuando el teléfono se acerca a la
  pantalla. `/chatbots-crm` pesa 205 kB de carga inicial (Marketing Digital: 202 kB).
- Accesibilidad: la conversación completa va también como texto para lectores de
  pantalla; con movimiento reducido no se reproduce sola (queda la conversación completa).

## Video "Así trabaja FENIAX" (HyperFrames)

- Fuente editable en `video/flujo-feniax/` (ver su README): 1080×1080, 10 s, bucle exacto
  (el primer y el último cuadro son iguales). `hyperframes check` pasa.
- En la web: `public/feniax/flujo-feniax.mp4` (0,5 MB) + póster. Solo se reproduce en
  pantalla, tiene pausa, y con movimiento reducido se queda en el póster.

## CMS (Sanity)

- **ChatBots / CRM** acepta ahora las 7 secciones (sumé "Clientes + demo de WhatsApp" y
  "Reseñas de Google") y un campo nuevo **"Demo de WhatsApp de la portada"**.
- **Clientes + demo de WhatsApp**: el MISMO formulario de giros de Marketing Digital (lo
  factoricé en `giroNegocio.ts` sin cambiar ningún nombre de campo: los datos existentes no
  se migran) + en cada giro una **"Demo de WhatsApp" opcional** (nombre, foto de perfil,
  mensajes cliente/IA con foto adjunta, aviso final del CRM).
- **Más fotos/logos de clientes**: dentro de cada giro → "Empresas y logos" (Cuenta existente
  o empresa con logo propio) y "Foto del giro". Sin giros propios, la sección usa los de
  Marketing Digital.
- 4 íconos de giro nuevos (también disponibles en Marketing Digital): automotriz,
  inmobiliaria, educación, turismo.
- **Respaldo**: el documento hoy tiene 5 secciones vacías y apagadas, así que la web muestra
  el contenido de respaldo (textos en `src/lib/feniax-respaldo.ts`). En cuanto haya una
  sección activa en el Studio, manda el Studio.

### Studio desplegado y contenido cargado (hecho el 2026-10-01)

1. **Studio redeployado** en https://dofi-cms.sanity.studio/ con los tipos nuevos
   (`chatClientsBanner`, `chatDemo`, demo de portada, 4 íconos nuevos). Verificado en el
   esquema publicado.
2. **Contenido sembrado** con `scripts/sembrar-feniax.mts`, usando la sesión de la CLI de
   Sanity (`sanity exec --with-user-token`; no se creó ni se guardó ningún token):
   - Copia del documento anterior (5 secciones vacías y apagadas):
     `audit/backup-chatbots-crm-2026-10-01.json`.
   - 7 secciones activas, demo de portada ("Hola, quiero integrar un CRM en mi empresa",
     8 mensajes) y los 6 giros de Marketing Digital con sus empresas (Cuentas enlazadas) y
     su demo de WhatsApp.
   - 6 fotos de demo subidas a Sanity (las de autos y salón de belleza quedan en
     `public/feniax/demo/` para cuando se cree un giro de ese tipo).
   - Verificado: la web local ya arma la página desde Sanity (las fotos de los chats salen
     de `cdn.sanity.io`, ninguna del respaldo).

Para volver a sembrar en el futuro (por ejemplo en otro dataset):
`npm run sembrar:feniax` (simula) y `npm run sembrar:feniax -- --aplicar`, con
`SANITY_WRITE_TOKEN` en `.env.local`; o con la sesión de la CLI vía `sanity exec
--with-user-token`. Si el documento ya tiene secciones activas, pide `--forzar`.

### Atención: staging hasta publicar el código

El sitio de staging (Cloudflare) todavía corre el código anterior y lee el mismo Sanity:
hoy `/chatbots-crm` ahí muestra los textos de FENIAX con el diseño anterior de DOFI y sin
Clientes ni Reseñas. Se corrige solo al publicar este código.

## Cambios en componentes compartidos (sin cambio visible en Marketing Digital)

- `CarruselGiros`: modo controlado opcional (`activo`/`onCambio`), opción de no seguir al
  cursor (`seleccionPorCursor`), contenido intermedio en móvil (`intermedio`) y colores de
  panel por variable con los de DOFI como valor por defecto. Verificado: Marketing Digital
  se ve y rota igual que antes.
- `RutaMetodo`: juego de íconos por marca (`iconos="feniax"`); el trazo usa el token de
  color (mismo resultado en DOFI).
- `BotonCta`: dos paletas de código para FENIAX (no se ofrecen en el Studio).
- `ClientesCasos`: exporta `FilaMarquesina` para reutilizarla.

## Verificación

- `tsc` sin errores (web y Studio). `npm run build:next`: 43 páginas, 0 errores.
- Navegador (1440×900 y 375×812): las 7 secciones, la demo de portada, la demo por giro
  con avance automático al siguiente giro, el video de HyperFrames, sin desborde
  horizontal, sin recursos fallidos.

## Pendiente / a decidir

- **Licencia de Remotion**: es gratis para personas y empresas de hasta 3 personas; con 4 o
  más se necesita licencia de empresa (remotion.dev/license). Mientras no se confirme, el
  reproductor deja un aviso en la consola del navegador (no se ve en la página). Si no se
  quiere licenciar, la demo se puede rehacer con Motion (ya está en el proyecto).
- No hay un giro "Automotriz" cargado; si se agrega en el Studio, toma sola la demo de autos.

## Sin botón "Ver casos de éxito" en Clientes (todas las páginas)

Pedido del 2026-10-01: la sección de Clientes ya no termina con el botón "Ver casos de
éxito", ni en Marketing Digital ni en FENIAX.

- Componentes: `ClientesCasos` (Marketing Digital) y `FeniaxClientes` (FENIAX) ya no lo
  pintan; además la capa de datos descarta el `cta` de esas dos secciones.
- Studio: `clientsBanner` y `chatClientsBanner` ya no ofrecen el campo "Botón (CTA)".
  Studio redeployado.
- Sanity: se quitó el dato de las dos páginas, con copia previa en
  `audit/backup-marketingDigitalPage-antes-de-quitar-cta-clientes-2026-10-01.json` y
  `audit/backup-chatbotsCrmPage-antes-de-quitar-cta-clientes-2026-10-01.json`.
- Respaldos y scripts de siembra (`marketing-digital.ts`, `feniax-respaldo.ts`,
  `sembrar-marketing-digital.mjs`, `sembrar-feniax.mts`) tampoco lo vuelven a crear.
- Verificado en local: ninguna de las dos secciones tiene enlaces; la de FENIAX cierra con
  la marquesina de logos. `npm run build:next` OK (43 páginas).
