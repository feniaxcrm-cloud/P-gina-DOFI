# Ajustes del 2026-10-08 · Resultados

Pedido: banners híbridos del Home con Remotion, ajustes de Tráfico/Ads y Asesorías, y el cierre de socios en las páginas de servicio.
Publicado el 2026-10-12 (commit `23ce734`; datos de Sanity aplicados y Studio redesplegado el mismo día).

## 1. Home · banners híbridos (Remotion + foto editable)

Los 4 banners volvieron a su versión anterior al cambio de «una pantalla»: alturas fijas, imagen a todo el ancho y botón posicionado con las coordenadas de Sanity. Sobre esa base, cada uno pasa a ser **híbrido**: la mitad es una escena dibujada con código y movimiento (Remotion) y la otra mitad una foto de primer plano que se sube en el Studio.

| Banner | Escena (Remotion) | Foto editable |
| --- | --- | --- |
| 1 · Redes Sociales que SÍ VENDEN | izquierda | derecha |
| 2 · PAUTA INTELIGENTE = VENTAS INTELIGENTES | derecha | izquierda |
| 3 · con RESPUESTAS RÁPIDAS hay CLIENTES FELICES | izquierda | derecha |
| 4 · RESCATANDO EMPRENDEDORES | derecha | izquierda |

- **Colores:** son los medidos sobre las piezas originales; no se cambió la paleta.
- **Responsive:** en escritorio y tablet (desde 768 px) el banner mantiene la proporción de la pieza original (sin recortar títulos ni fotos); en teléfono se apila: escena, foto y el botón en su propia fila.
- **Movimiento:** la escena corre en bucle solo mientras está en pantalla; con «reducir movimiento» queda un cuadro quieto. Remotion se carga solo cuando el banner está por entrar en pantalla.
- **Editable en el Studio** (Banners → cada banner → «Escena y foto (banner híbrido)»): tipo de banner, foto de primer plano (con punto focal), cómo se acomoda la foto y el texto de la escena línea por línea. «Imagen entera (como antes)» devuelve el banner de siempre; la imagen original se conservó.
- **Fotos de fábrica:** las piezas originales eran imágenes aplanadas, así que las fotos de primer plano de fábrica son recortes de ellas (`public/home/banner-*-foto.webp`, ya subidas a Sanity). Se pueden reemplazar por fotos con fondo recortado cuando las tengan.

Código: `src/remotion/home/` (escenas), `src/components/home/` (banner híbrido y reproductor), `src/components/ContentBanner.tsx`, `studio/schemaTypes/objects/seccionContenido.ts`.

## 2. Tráfico/Ads

- **Hero:** la animación (números que suben y línea del gráfico) se mantiene más tiempo antes de reiniciar: cuenta de 6 s por plataforma, reposo de 4,5 s con todo a la vista y un fundido corto, en bucle.
- **«¿Dónde traficamos?»:** quedan dos tarjetas, **Meta Ads** («Facebook + Instagram + WhatsApp») y **TikTok Ads**. Salieron Google Ads y la tarjeta aparte de WhatsApp.
- **Cierre:** ahora es el mismo de Marketing Digital (el hombre y el delfín), con su título, frase y botón «Quiero mejorar mis ventas».

## 3. Asesorías

- **Clientes y casos de éxito:** igual que en Marketing Digital (mismo título, portada, giros y logos, y mismo video: hoy Marketing no tiene video cargado, así que ambos muestran «Pronto verás aquí nuestro video»).
- **Hero:** la imagen de la derecha sube hasta que su borde inferior queda a la altura del borde inferior del botón de la izquierda.
- **Cierre:** el de Marketing Digital con las dos imágenes.
- Se sembró la página en Sanity (Portada, ¿Qué es?, Clientes, Logros y Cierre), con los textos de `src/lib/asesorias-respaldo.ts`. **Los 4 logros son de ejemplo** (firman «Ejemplo — reemplázalo»).

## 4. Cierre de socios en todas las páginas menos el Home

Tráfico/Ads, ChatBots/CRM y Asesorías replican el cierre «¿Somos socios o le pasas tu oportunidad a alguien más?»: la imagen (hombre dando la mano + delfín) es el mismo archivo que usa Marketing Digital y se cambia en cada página desde el Studio: «Cierre» → «Imagen».

## Cambios en Sanity (con copia previa en `audit/`)

| Documento | Cambio | Copia de seguridad |
| --- | --- | --- |
| `banners` | los 4 banners → híbridos, con su foto subida | `backup-banners-antes-de-home-hibrido-2026-10-12.json` |
| `traficoAdsPage` | plataformas → Meta + TikTok; cierre → `ctaBanner` con imagen | `backup-traficoAdsPage-antes-de-home-hibrido-2026-10-12.json` |
| `chatbotsCrmPage` | el cierre recibe la imagen | `backup-chatbotsCrmPage-antes-de-home-hibrido-2026-10-12.json` |
| `asesoriasPage` | sembrada con las 5 secciones | `backup-asesoriasPage-2026-10-12.json` |

Scripts de un solo uso: `npm run ajustar:home-hibrido` y `npm run sembrar:asesorias` (simulan por defecto; `--aplicar` escribe). Ambos ya se aplicaron.

## Verificación

- `tsc` del sitio y del Studio sin errores; `next build` correcto (43 páginas).
- En la web publicada: Home (4 banners, escritorio y móvil), Tráfico (tarjetas y cierre), ChatBots/CRM (cierre) y Asesorías (clientes) revisados con Chrome, sin errores de consola.
- Studio redesplegado: https://dofi-cms.sanity.studio

## Decisiones y pendientes

- **Licencia de Remotion:** sigue pendiente de decidir (Remotion exige licencia para empresas con más de 3 personas).
- **Hero de Tráfico/Ads:** el panel «GOOGLE ADS» de la animación del hero se mantuvo (solo se pidió quitar Google Ads de «¿Dónde traficamos?»). Si debe salir también del hero, es un ajuste pequeño.
- **Imagen 8** (Clientes y casos de éxito de Asesorías) no llegó adjunta; se dejó idéntica a la de Marketing Digital, como se pidió.
- **Botón en móvil:** en los banners híbridos el botón va en su propia fila debajo de la foto; las coordenadas del Studio rigen en escritorio y tablet.
- **Excepciones del detector de diseño:** se registraron 45 colores en `.impeccable/config.json` (medidos de las piezas originales y colores de marca de redes sociales dibujadas en las escenas), uno por uno y con su razón.
