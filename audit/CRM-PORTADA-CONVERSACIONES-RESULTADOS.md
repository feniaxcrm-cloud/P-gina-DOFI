# Portada de ChatBots / CRM: vuelven los ejemplos de conversaciones · Resultados

Corrección del 2026-10-20 sobre el commit `a0ef077`. No se tocó Sanity ni el Studio: es solo código.

## Qué pasó
En `a0ef077` la portada de `/chatbots-crm` pasó a mostrar el celular con el video estilo TikTok («Pronto verás aquí nuestro video»). No era lo pedido: en la portada debe ir el celular con los **ejemplos de conversaciones** de WhatsApp.

## Qué se cambió
- **Portada de CRM** (`FeniaxPortada.tsx`): sale el celular TikTok y entra `HeroConversaciones`, un celular de WhatsApp (tema oscuro, el de la portada) con la IA atendiendo a un cliente.
- **Qué conversaciones muestra:** las de los giros de «Clientes» (inmobiliaria, academia, etc.), una tras otra. Cuando una termina, arranca la del giro siguiente; si «Pasar solo al siguiente giro» está apagado en el Studio, se repite la primera. Sin giros cargados, muestra la conversación genérica de servicios.
- **De dónde salen los textos:** de Sanity (campo `chat` de cada giro de «Clientes») o de las plantillas por giro de `src/lib/chat-demo.ts`. No se escribió ningún texto nuevo.
- **Cableado** (`PaginaFeniax.tsx`): la página busca la sección «Clientes» y le pasa a la portada solo la clave y el chat de cada giro (el resto de los datos del giro no viaja al navegador).
- **Tamaño:** escritorio, hasta 340 px de ancho y sin pasarse del alto útil de la pantalla; celular, hasta 280 px (320 px en tablet chica). Con el resplandor naranja detrás, como tenía la portada original.

## Qué no se tocó
- **Clientes y casos de éxito** sigue con los logos circulares (pedido del 2026-10-20).
- `VideoTikTok.tsx` y los campos del video TikTok del Studio de CRM siguen en el código. Hoy no se muestran en ninguna parte: si se sube un video ahí, no aparece. Se pueden ocultar del Studio si se prefiere.
- Los iconos flotantes de herramientas (GoHighLevel, Kommo, Bitrix24, n8n, Railway) siguen en el fondo.

## Comprobado
- `tsc --noEmit` y `next build`: sin errores.
- En local, escritorio (1440×860) y celular (375×812): el celular se ve entero, la conversación corre completa (mensajes y foto) y pasa de «Tu inmobiliaria» a «Tu academia». Sin errores en consola.

## Pendiente
- La licencia de Remotion (gratis hasta 3 personas en la empresa) sigue sin decidirse; este celular lo usa, igual que antes lo usaba Clientes.
