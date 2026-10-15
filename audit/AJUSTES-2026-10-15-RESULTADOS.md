# Ajustes del 2026-10-15 · Resultados

Publicado el 2026-10-15 (commit `0690f15`; datos de Sanity aplicados el mismo día, con copia previa en `audit/`).

## 1. Home

### 1.1 Hero sin animación sobre la foto
Se quitaron las tarjetas animadas «01 Atraer · 02 Convertir · 03 Escalar» (Remotion) que iban encima de la foto. La foto queda **quieta**, con el mismo tamaño, posición y tratamiento de antes. Los resplandores, el oleaje y la entrada del texto no cambian. Se borraron los archivos que ya no usaba nadie (`src/components/hero/`, `src/remotion/hero/`).

### 1.2 «Mira Nuestro Trabajo» → página nueva `/redes`
- Página tipo Linktree, sobre el fondo de marca: logo, «Mira nuestro trabajo», una frase corta y tres tarjetas-enlace con su ícono:
  1. DOFI · Instagram — https://www.instagram.com/dofiagenciacreativa
  2. Daniel Vallejo · Instagram — https://www.instagram.com/danivallejo.dofi
  3. DOFI · TikTok — https://www.tiktok.com/@dofiagenciacreativa
- Cada tarjeta abre el perfil en una pestaña nueva. Debajo, el botón de siempre «Quiero mejorar mis ventas» al formulario.
- Los enlaces se guardaron **sin los parámetros de seguimiento** del enlace compartido (`utm_source`, `xtok`, `vrfl`, `is_from_webapp`…): llevan al mismo perfil. Viven en `src/config/company.ts` → `perfilesRedes`.
- El botón del hero sale del Studio: se cambió su enlace en Sanity (antes iba al TikTok de DOFI) y el respaldo del código.

### 1.3 Último banner: la mascota oficial
Los sellos del lado derecho de «Rescatando Emprendedores» usan ahora el **ícono oficial de la mascota** (el archivo de referencia, con fondo transparente: `public/home/mascota-dofi.webp`), en las mismas posiciones, tamaños y transparencias. Se corrigió además que el sello grande de la esquina se deformara al tocar el borde.

## 2. Formulario de contacto
- **Nombre del negocio** ya existía; se mantuvo.
- **Ciudad o país**: campo nuevo, obligatorio, junto al nombre del negocio (el nombre y apellido pasa a su propia fila). Se suma al mensaje de WhatsApp: «… pertenezco a la empresa *Café Luna* de *Quito, Ecuador* y le escribo por el servicio de …».

## 3. Botón flotante de WhatsApp
Ya no abre un chat: lleva a `/contactanos#formulario`. Desde otra página navega al formulario y lo deja a la vista; si ya está en `/contactanos`, baja con desplazamiento suave y deja el cursor en el primer campo (salto directo con «reducir movimiento»). Se mantiene el mismo botón verde.

## 4. Tráfico/Ads y ChatBots/CRM · «Clientes y casos de éxito»
Se quitó el texto que acompañaba al panel y al teléfono: la descripción («Elige un giro…», borrada en Sanity y en el respaldo), la etiqueta de arriba («Panel de Meta Ads · …» / «Demo en WhatsApp · …») y, en Tráfico, la nota de abajo. El panel conserva su etiqueta **EJEMPLO** siempre visible, y la nota sigue disponible para lectores de pantalla. El panel y el teléfono ocupan ahora el alto completo de su columna.

## 5. Marketing Digital · video de Clientes
El video va en el mismo marco que el panel de Tráfico/Ads: vertical 2:3, mismas esquinas y sombra, columnas 60/40, alto completo de la columna en escritorio y hasta 380 px de ancho, centrado, en teléfono. El archivo, el ajuste y el sonido del video no cambian (hoy Marketing no tiene video cargado: se ve el estado «Pronto verás aquí nuestro video»). Asesorías usa la misma sección, así que también cambia.

## Sanity (con copia previa)

| Documento | Cambio | Copia |
| --- | --- | --- |
| `paginaInicio` | `hero.ctaSecundarioEnlace` → `/redes` | `backup-paginaInicio-antes-de-ajustes-2026-10-15.json` |
| `traficoAdsPage` | sin descripción en Clientes | `backup-traficoAdsPage-antes-de-ajustes-2026-10-15.json` |
| `chatbotsCrmPage` | sin descripción en Clientes | `backup-chatbotsCrmPage-antes-de-ajustes-2026-10-15.json` |

Script: `npm run ajustar:2026-10-15` (simula por defecto; `--aplicar` escribe). Ya aplicado.

## Verificación (web publicada)
- `tsc` sin errores; `next build` correcto (44 páginas, incluida `/redes`).
- Con Chrome, en 1440 px y 390 px: el botón flotante lleva al formulario desde otra página y desde la misma, y nunca abre WhatsApp; el formulario pide la ciudad y la incluye en el mensaje; `/redes` tiene 3 enlaces correctos, en pestaña nueva; el hero lleva a `/redes`; Tráfico/CRM sin textos; Marketing con el video vertical; el último banner con la mascota oficial. Sin errores de consola.

## Para tener en cuenta
- Los íconos de Facebook, Instagram y TikTok del **header** siguen sin enlace (esperan su variable de entorno). Ahora que hay perfiles reales, se pueden activar con un cambio pequeño.
- La nota «cifras de ejemplo» del panel de Tráfico ya no se ve debajo; el panel sigue diciendo **EJEMPLO**.
- Las advertencias de tamaños de letra del detector de diseño en el formulario, el hero y `/contactanos` son de estilos que ya existían; no se tocaron.
