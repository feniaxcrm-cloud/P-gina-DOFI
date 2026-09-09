# DOFI — Footer nuevo + reposición de los CTA — Resultados

Dos grupos de cambios. **No se tocó** el Hero, el Header, las tarjetas del Hero, las
imágenes de los banners ni la estructura de la página.

## 1. Footer

### Navegación: una sola lista para el pie y el Header

El pie tenía su propio arreglo de enlaces con anclas: `/#servicios`, `/#socio`,
`/#herramientas`, `/#clientes`, `/#proceso`. **Los cinco estaban rotos**: esas secciones
se retiraron de la home en el sprint "Retirar secciones entre Sección 4 y el Footer", así
que los enlaces no llevaban a ningún lado.

Ahora las opciones salen de `src/config/navegacion.ts`, la **misma** definición que pinta
el Header. Verificado en el navegador — las dos listas son idénticas:

| | Header | Pie |
|---|---|---|
| Inicio | `/` | `/` |
| Marketing Digital | `/marketing-digital` | `/marketing-digital` |
| Tráfico / Ads | `/trafico-ads` | `/trafico-ads` |
| ChatBots / CRM | `/chatbots-crm` | `/chatbots-crm` |
| Asesorías | `/asesorias` | `/asesorias` |

Para lograrlo hubo que sacar el arreglo de dentro de `Nav.tsx`. **El Header no cambia**:
pinta la misma lista, con las mismas rutas y el mismo resaltado de página activa —
comprobado midiendo los `href` renderizados de las dos navegaciones. La alternativa era
copiar el arreglo al pie, que garantiza que tarde o temprano las dos listas digan cosas
distintas; es exactamente el problema que ya había resuelto `src/config/company.ts` con
los datos corporativos.

Sin enlaces muertos en el pie: **0** con `href="#"` o anclas huérfanas.

### Contenido

| Zona | Estado |
|---|---|
| Logo | Intacto (`Wordmark` con lockup completo) |
| Bajo el logo | `"Un Mar de Ideas."` — sale de `company.tagline`, no escrito a mano |
| Información | Teléfono y correo sin cambios; ubicación ahora en dos líneas |
| Ubicación | `"Padre Aguirre y Rafael María Arízaga,\nCuenca - Ecuador"`, con el `MapPin` naranja |
| Horario | Sin cambios |
| Mini mapa | Nuevo, debajo de los horarios |

La dirección quedó cargada en `company.location.address` (antes estaba vacía a propósito,
marcada como "pendiente de confirmar por el propietario") y el enlace de Maps en
`company.location.mapsUrl`. Ningún componente los escribe a mano.

El texto de la dirección **también** abre Google Maps al hacer clic, además de la
miniatura. Es un agregado chico; si preferís que sea solo texto, se quita en una línea.

### El mini mapa: por qué no es un iframe de Google

El embed de Google (`output=embed`) funciona sin API key, sí. Pero para este uso concreto
tiene tres problemas:

1. **No se puede hacer clic a través de él.** El iframe se queda con el evento: el
   visitante arrastraría el mapa en vez de abrir la ficha. Para hacerlo clicable habría
   que taparlo con una capa transparente, lo que anula lo único que aportaba.
2. **Pesa.** Carga la aplicación de Maps entera — cientos de KB de JS de terceros — en el
   pie de todas las páginas, para una miniatura de 96px de alto.
3. **Mete cookies de terceros** en cada visita, sin que nadie haya pedido ver un mapa.

Así que la miniatura se dibuja en el proyecto (`src/components/MapaMini.tsx`): un SVG de
~2KB, sin red, sin API key, sin cookies, y con los colores DOFI en vez de los de Google.
El plano representa el cruce real —las dos calles de la dirección, rotuladas— con el
marcador naranja encima. El dato exacto lo da Google al abrir el enlace, que es justo lo
que se espera de una miniatura.

Si en algún momento preferís el mapa de verdad, el reemplazo es ese componente entero sin
tocar el Footer.

**Medido**: la tarjeta mide **280×158** tanto en desktop como en mobile (compacta, no se
estira), con `href="https://maps.app.goo.gl/QxAWAwctM2cGfo598"`, `target="_blank"` y
`rel="noopener noreferrer"`.

### Responsive

| Ancho | Alto del pie | Disposición |
|---|---|---|
| 1440px | 552px | 4 columnas |
| 900px | 820px | 2 columnas |
| 390px | 1179px | 1 columna, apilada |

El orden apilado en mobile es el pedido: logo + "Un Mar de Ideas." → Navegación →
Información → Horario de atención → mini mapa.

La primera columna pasó de `1.4fr` a `1fr`. Ese ancho extra existía cuando llevaba un
párrafo de tres líneas; con una sola frase quedaba como un hueco en medio del pie. Se
repartió a las columnas que sí crecieron.

## 2. Posición de los CTA

### Un ajuste fino nuevo, porque la grilla no alcanzaba

Los pasos del selector saltan de a mucho (33% → 50% del ancho). "Un poco más abajo" no se
puede expresar con eso. Se agregaron dos campos opcionales por posición —
**Ajuste fino horizontal / vertical (%)**, entre -30 y +30, 0 por defecto — que se **suman**
al ancla elegida. El desplegable sigue marcando la zona; el número solo la corre un poco.
No es un sistema paralelo: es el mismo, con un decimal más.

### Ojo: dos piezas cambiaron

Los banners **03 y 04 tienen imágenes nuevas** (se subieron a Sanity después de las
capturas que aprobaste). Las instrucciones estaban escritas mirando las anteriores:

- **Banner 04** antes tenía medio lienzo de morado vacío a la derecha. La pieza nueva
  trae ahí el título **"RESCATANDO EMPRENDEDORES"**. Aplicar "un poco más arriba" sobre la
  posición vieja dejaba el botón **encima de ese título** — se verificó en pantalla.
  Subirlo del todo, a la franja libre de arriba a la derecha, cumple la instrucción y
  además deja el título entero visible.
- **Banner 03** conserva el lado izquierdo (título + constelación de herramientas) y
  cambió el derecho.

### Posiciones finales

| Banner | Pedido | Resultado (centro del botón) | Nota |
|---|---|---|---|
| 01 | Un poco más abajo, mismo eje horizontal | `(18,4%, 59%)` | Bajó 9 puntos; el eje horizontal no se movió. |
| 02 | Alineado al bloque de texto y más abajo | `(81,6%, 56%)` | El bloque "PAUTA INTELIGENTE = / VENTAS / INTELIGENTES" tiene su eje visual en el 81% del ancho: el botón está centrado con él. Bajó 6 puntos, lo justo para dejar aire con el titular y no pisar el icono de Claude (empieza en el 62%). |
| 03 | Un poco más abajo y a la derecha | `(33%, 88,7%)` | Se movió en las dos direcciones pedidas, pero **más que "un poco"**: entre el 50% y el 85% de altura no hay un solo hueco donde entre el botón — es todo el diagrama (WhatsApp, GHL, TikTok, n8n...). El primer espacio libre real está por debajo de esa constelación. |
| 04 | Un poco más arriba | `(77%, 11,3%)` | Ver la nota de arriba: con la pieza nueva, la única franja libre es la de arriba a la derecha. |

Medido con el mismo método de siempre: energía de bordes por región sobre las piezas
**actuales**, buscando el rectángulo del tamaño real del botón con menos ocupación.

### Lo que no cambió

Textos, enlaces, colores, tamaño (358×64 desktop / 313×56 mobile), animación de entrada,
hover, glow y flecha: todo idéntico. Solo se movió la posición.

**Verificado en 7 anchos** (1440 / 1280 / 1024 / 768 / 560 / 430 / 390):

- Los 4 botones caen **enteros dentro de su banner** en todos (`dentroDelBanner=true`).
- **Sin overflow horizontal** en 8 anchos (los 7 más 320px).
- Colores intactos: banner 01 `rgb(75,42,147)` con texto blanco; 02-04 `rgb(244,123,32)`
  con texto `rgb(26,15,61)`.
- Hover intacto: `scale none → 1.04`, flecha `none → 4px`, 300ms.
- `animation-name: none` en botón, flecha y envoltorio — sin movimiento infinito.
- Reduced motion: 8 elementos animados en `opacity:1` / `transform:none`, 4 CTA visibles
  y sin escala.
- En mobile los cuatro van centrados abajo `(50%, 86,6%)`, dentro del banner y sin tapar
  el foco de la pieza.

**Hero / Header / Footer**: `<h1>` = "Ventas Inteligentes", 4 tarjetas de 213px (el valor
de siempre), 2 CTAs del Hero.

## Capturas

- [audit/footer-cta/footer-desktop.png](footer-cta/footer-desktop.png) · `footer-tablet.png` · `footer-mobile.png`
- [audit/cta-banners/banner-01-desktop.png](cta-banners/banner-01-desktop.png) … `banner-04-desktop.png`
- [audit/cta-banners/banners-mobile.png](cta-banners/banners-mobile.png)

## Archivos modificados

- `src/config/navegacion.ts` — **nuevo**, los enlaces del Header y del pie.
- `src/components/Nav.tsx` — importa esa lista en vez de definirla. Render idéntico.
- `src/config/company.ts` — dirección de calle y URL de Maps; `fullLabel`.
- `src/components/Footer.tsx` — descripción, navegación, dirección en dos líneas, mapa,
  reparto de columnas.
- `src/components/MapaMini.tsx` — **nuevo**, la miniatura de ubicación.
- `studio/schemaTypes/objects/posicionCta.ts` — los dos campos de ajuste fino.
- `src/lib/sanity.ts` — tipo, GROQ y normalizado del ajuste (acotado a ±30).
- `src/components/ContentBanner.tsx` — el ajuste se suma al ancla.
- `scripts/sembrar-cta-banners.mjs` — las 4 posiciones nuevas.

`npx tsc --noEmit` limpio en la web y en el Studio.
