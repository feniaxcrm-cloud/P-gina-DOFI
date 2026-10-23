# Ajustes del 2026-10-22 · Resultados

Publicado el 2026-10-23: commits `87abd84` (cambios) y `a3ecbaa` (desbloqueo del despliegue). El Studio se redesplegó. No hubo cambios de datos en Sanity.

## 1. Home · tarjeta «Academia»
- **Descripción nueva**, textual: «Aprende sobre Inteligencia Artificial, descubre nuevas herramientas y desarrolla habilidades para transformar tu negocio y llevar tus ideas al siguiente nivel.» El título no cambió.
- **Altura de la tarjeta:** el texto es casi el triple de largo que el de las otras. Para que no quedara alta ni estirara la banda, en la fila de 5 (computadora) cada tarjeta toma un ancho según su texto, hasta 1,6 veces el de las demás.
  - Se calcula con el texto real, así que sigue funcionando si se reordenan o cambian las tarjetas en el Studio.
  - Resultado: las 5 tarjetas miden lo mismo (203 px de alto en 1440 y 1920 px; Academia en 5 líneas, las otras en 4 o 5).
- **Tablet y laptop chica** (2 y 3 columnas): la última tarjeta ocupa el resto de su fila en lugar de dejar un hueco, y su texto queda en 2 líneas.
- **Celular:** una tarjeta por fila. Academia ocupa 5 líneas, frente a 2 de las otras; con ese texto es inevitable a ese ancho.
- El límite de caracteres de la descripción en el Studio pasó de 140 a 170, para que el texto de Academia se pueda cargar ahí.

## 2. Clientes y casos de éxito · logos con su forma original
Aplica a las cuatro páginas (Marketing Digital, Tráfico/Ads, ChatBots/CRM y Asesorías) porque usan el mismo componente: `ClientesLogos`.
- **Antes:** todos los logos iban dentro de un círculo blanco. Los cuadrados se veían chicos y raros.
- **Ahora, por defecto, «Forma original»:** cada logo se ve como es (cuadrado, redondo o apaisado), sin marco encima, sin recortes ni deformaciones, y con su transparencia.
- **Tamaño parejo y un poco más grande:** cada logo ocupa la misma área según su proporción real, así un cuadrado no se ve gigante al lado de uno apaisado. Tamaño de referencia: 120 px en computadora (antes 112) y 92 px en celular (antes 84).
- **Sanity:** se reutilizó el mismo campo «Presentación de los logos» (`ajusteLogos`), sin campos nuevos.
  - Se agregó la opción «Forma original de cada logo (recomendado)», que es la de por defecto.
  - «Dentro de un círculo» y «Dentro de una ficha redondeada» siguen como opciones.
  - Los tamaños se siguen controlando ahí. Ninguna página tenía valores cargados, así que todas toman lo nuevo.

## 3. Despliegue: Next.js 15 fuera de soporte
- **El problema:** el primer build en Cloudflare falló. OpenNext, la herramienta que publica el sitio, corta el build cuando la versión mayor de Next.js pasó sus 2 años de soporte oficial. Next.js 15 salió el 21-10-2024, así que desde el 21-10-2026 no se podía publicar nada.
- **La solución, por decisión del propietario:**
  - Los scripts de build llevan `--dangerouslyUseUnsupportedNextVersion` y se sigue con Next.js 15.
  - Está documentado en el README.
  - El build de Cloudflare terminó bien.
- **Pendiente:** actualizar a Next.js 16 y quitar esa opción. Next.js 15 ya no recibe parches de seguridad.

## Archivos
- `src/components/CapabilityBand.tsx`: anchos según el texto y última tarjeta a lo ancho.
- `src/lib/sanity.ts`: texto de Academia de respaldo.
- `src/components/marketing/ClientesLogos.tsx`: forma original.
- `src/lib/marketing-digital.ts`: tipo y valores por defecto de `ajusteLogos`.
- `studio/schemaTypes/objects/ajusteLogos.ts`: opción «Forma original» y tamaños recomendados.
- `studio/schemaTypes/objects/capacidad.ts`: límite de 170 caracteres.
- `package.json` y `README.md`: opción de build.

## Validación
- `tsc` del sitio y del Studio sin errores; `next build` correcto (44 páginas).
- Build de Cloudflare correcto (`a3ecbaa`).
- **En vivo:**
  - Banda del hero medida en 1920, 1440, 1280, 1024, 768 y 390 px: misma altura en cada fila.
  - Logos revisados en Marketing (Turismo), Tráfico (Construcción), CRM (Retail, en 1024 px) y Asesorías (Gastronomía, en celular): los redondos se ven redondos, los cuadrados cuadrados y nada se recorta.
- Sin desborde horizontal en 360, 768, 1024 y 1440 px en las cinco páginas.
- No se tocaron otras secciones.
