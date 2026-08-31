# DOFI — Implementación final del Hero + Sanity + Cards — Resultados

Fecha: 2026-08-31
Alcance: Hero, imagen del Hero desde Sanity, overlays geométricos, CTA del Hero, las 4 capability cards, integración/configuración en Sanity. Header, navegación, redes sociales, Footer y demás secciones — sin tocar.

Este sprint parte de un Hero que **ya tenía** la composición integrada (imagen de fondo + overlays + copy + CTA + cards) construida en sprints anteriores de esta misma conversación. Lo que faltaba, y es lo que resuelve este sprint: (1) la imagen no tenía un lugar propio y evidente en Sanity — vivía como un campo más entre título/marca/CTA; (2) las 4 cards no tenían exactamente la misma altura.

---

## 1-2. Estructura anterior → nueva

**Anterior** (antes de esta conversación): `[ texto ] [ caja de imagen ]` — dos columnas, imagen encerrada en una tarjeta con borde/radio propio.

**Actual** (confirmado, sin cambios estructurales en este sprint): una sola composición —

```
SECTION (full-bleed)
 └─ imagen (z-0, position:absolute, md:w-screen)
     ├─ scrim de legibilidad (fijo)
     └─ overlays geométricos animados (solo desde md:)
 └─ copy + CTA (z-20, dentro del container con padding del sitio)
 └─ capability cards (superpuestas al borde inferior)
```

## 3. Eliminación de la caja lateral

Verificado con grep en todo `src/`: cero referencias vivas a la tarjeta bordeada, al placeholder de "media slot" o al degradado que corría dentro de ella — solo quedan comentarios que documentan qué se eliminó.

## 4. Solución full width

Ya resuelta en el sprint anterior (`md:left-1/2 md:w-screen md:-translate-x-1/2`, full-bleed dentro de un contenedor centrado). **Re-verificado en este sprint** con estilos computados reales, no supuesto:

| Viewport | Ancho de la capa visual | ¿Coincide con el viewport? |
|---|---:|---|
| 1440 | 1440px | Sí |
| 1280 | 1280px | Sí |
| 768 | 768px | Sí |

Sin overflow horizontal en ningún ancho probado (1440/1280/768/390/360).

## 5-6. Sanity schema — nuevo documento Hero

**El problema real** (spec §5, "no esconder el campo"): la imagen vivía en `paginaInicio.hero.imagen`, un campo más dentro de un formulario grande junto a título/marca/mensaje/4 campos de CTA — nada indicaba "acá se cambia la foto".

**Solución**: nuevo documento singleton `hero` (`studio/schemaTypes/hero.ts`), con **exactamente** los 2 campos pedidos:

```ts
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Imagen principal", type: "image",
      options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "heroImageAlt", title: "Texto alternativo", type: "string",
      validation: (Rule) => Rule.required() }),
  ],
});
```

Aparece **primero** en el menú del Studio (`studio/deskStructure.ts`), antes que "Página de inicio" — es lo que más se va a tocar, tiene que ser lo primero que se ve al entrar. Documento único a propósito: `_id` fijo (`"hero"`), se abre directo en su formulario, no hay "Crear nuevo" que invite a duplicados.

El título/marca/mensaje/CTA del Hero **siguen** en `paginaInicio.hero` — solo se movió la imagen, tal como pedía el brief (§6, únicamente `heroImage`/`heroImageAlt`), no se reorganizó nada más.

## 7. GROQ / integración frontend

`src/lib/sanity.ts` trae ambos documentos en **una sola consulta** (un objeto raíz con dos proyecciones, un solo round-trip de red):

```groq
{
  "pagina": *[_type == "paginaInicio"][0]{ ..., hero{ titulo, marca, mensaje, cta... } },
  "heroDoc": *[_type == "hero"][0]{
    "imagen": heroImage.asset->url + "?w=2400&auto=format",
    "imagenAlt": coalesce(heroImageAlt, ""),
    "hotspot": heroImage.hotspot{ x, y }
  }
}
```

`normalizarHero(raw, heroDoc)` combina ambas fuentes en un solo `HeroContent` — el componente `Hero.tsx` no cambió una sola línea, nunca supo que ahora son dos documentos.

**NO hardcodeada, NO en `/public`**: la imagen sale exclusivamente de Sanity; sin imagen cargada, cae al fallback de atmósfera (§8/§40), nunca a un archivo local.

## 8. Hotspot y crop

Sin cambios de mecanismo (ya funcionaba desde el sprint anterior): `object-position` se calcula en el cliente a partir de `heroImage.hotspot {x, y}` — mismo patrón en desktop/tablet/mobile, sin `@sanity/image-url`. Verificado con la prueba real de la §13 (hotspot `{x: 0.72, y: 0.35}`): el punto focal de la imagen de prueba quedó visiblemente desplazado hacia la derecha, tal como pedía el hotspot.

## 9. Fallback

Verificado con estilos computados (`heroHasImage: false` después de limpiar el documento de prueba): se pinta la atmósfera de manchas de luz + overlays geométricos, **nunca** un cuadro roto, gris o vacío. Ver `desktop-1440.png` en los screenshots — así se ve el Hero real hoy, sin imagen cargada todavía.

## 10. Cache / revalidación

Arquitectura existente, sin romperla: ISR de 60s (`next: { revalidate: 60 }`) + webhook `/api/revalidate` para invalidación instantánea. **Verificado en vivo, no solo leído**: tras publicar el cambio de imagen en Sanity, se llamó a `/api/revalidate` en el servidor local y el frontend mostró la nueva foto de inmediato, sin esperar los 60s.

**Pendiente real** (documentado en el propio código, `route.ts`): el webhook de Sanity en `manage.sanity.io` está configurado para disparar en Cuenta/Contenido/Servicio — falta agregarle también "hero" y "paginaInicio" para que las publicaciones del Hero sean instantáneas en producción. Sin eso, el cambio igual llega solo, pero puede tardar hasta 60s. No es un bloqueo: es una configuración externa al código (dashboard de Sanity) que el propietario puede hacer en un minuto.

## 11-16. Overlays y animación

Técnica y curvas sin cambios respecto al sprint anterior (scrim fijo + 3 paneles `clip-path`, 11-16s ease-in-out alternate, solo `transform`). **Re-verificado tras el cambio a full-bleed**, con dos métodos independientes:

- `getComputedStyle(...).transform` en 4 instantes reales: la matriz cambia de forma continua (traslación de 0,4px → 8,2px → 16,8px entre 0,8s y 9,8s de vida de la página).
- `prefers-reduced-motion: reduce`: el `transform` del overlay pasa a `none` y no cambia entre dos muestras — reduced motion sigue funcionando después de los cambios de layout.

La fotografía nunca lleva animación propia (confirmado leyendo el componente completo).

## 17-18. Nuevos CTA

Sin cambios respecto al sprint anterior — se reconfirmaron visualmente en las capturas de este sprint:

| | Texto | Destino |
|---|---|---|
| Principal | "Quiero Mejorar mis Ventas" | `/contactanos` (ruta real existente) |
| Secundario | "Mira Nuestro Trabajo" | `/clientes` (ruta real de portafolio existente) |

## 19-20. Cards — contenido e iconos

Contenido e iconos ya estaban actualizados (sprint anterior): Redes Sociales / Pauta en TikTok y Meta / +3M Vendidos en Redes / Rescatando Emprendedores, con `ShareNetwork` / `Megaphone` / `ChartLineUp` / `Lifebuoy` (misma familia Phosphor, mismo peso "bold", mismo tamaño 32px, mismo contenedor).

## 21. Igualdad de alturas — el bug real de este sprint

**Causa**: `Tarjeta` era `flex flex-col` pero sin `h-full` — el grid (`align-items: stretch` por defecto) estiraba el `motion.div` contenedor, pero la tarjeta VISIBLE (borde, fondo, sombra) adentro no heredaba esa altura, así que "Rescatando Emprendedores" (título de 2 líneas) quedaba más alta que las otras 3.

**Solución, sin hacks de `nth-child`** (spec §35, prohibido explícitamente):
1. `h-full` en la tarjeta — ahora sí llena el alto que el grid ya le da a su contenedor.
2. `min-h-[2lh]` + `leading-snug` en el título — reserva el alto de 2 líneas SIEMPRE, así las descripciones arrancan a la misma altura sin importar cuántas líneas ocupe cada título. `lh` es una unidad CSS real (line-height del propio elemento), no un pixelaje calculado a mano.

**Verificado, no solo visual** — altura real de cada una de las 4 tarjetas, medida con `getBoundingClientRect()`:

| Viewport | Redes Sociales | Pauta TikTok/Meta | +3M Vendidos | Rescatando Emprendedores |
|---|---:|---:|---:|---:|
| 1440 | 213px | 213px | 213px | 213px |
| 1280 | 213px | 213px | 213px | 213px |
| 768 | 213px | 213px | 213px | 213px |
| 390 | 207,5px | 207,5px | 207,5px | 207,5px |
| 360 | 207,5px | 207,5px | 207,5px | 207,5px |

Exactamente la misma altura en las 4, en los 5 anchos probados. Ver `cards-equal-height.png`.

## 22. Responsive

- **Desktop** (1440/1280): 4 columnas, misma altura — confirmado.
- **Tablet** (768): grid de 4 columnas (`lg:grid-cols-4` no llega a 768, cae a `sm:grid-cols-2` — 2×2), misma altura por fila — confirmado.
- **Mobile** (390/360): una columna, imagen conserva presencia (no se convierte en mini-tarjeta), CTA apilados a ancho completo, sin overflow horizontal.

## 23. Accesibilidad

- `heroImageAlt` es obligatorio en el schema (`Rule.required()`) — se usa como `alt` real de la `<Image>`.
- Foco visible, contraste del copy sobre el scrim, targets táctiles de 44px — sin cambios (ya verificados en el sprint anterior, no se tocó esa parte).
- Cards: semántica sin cambios (`<Link>` real solo si hay `enlace`, si no `<div>` simple).

## Performance

- Imagen: instancia única de `<Image>` (sin duplicar la descarga), `priority`, `sizes="100vw"`, `object-fit: cover`, ancho pedido a Sanity ajustado a 2400px para el tamaño real que ocupa ahora.
- Animaciones: solo `transform` (`translate3d` + `rotate` + `scale`), nunca propiedades de layout.
- Build de producción limpio: `npm run build:next` y `npx tsc --noEmit` (raíz y Studio) sin errores.

## Screenshots

`audit/hero-final/`: `desktop-1440.png`, `desktop-1280.png`, `tablet-768.png`, `mobile-390.png`, `mobile-360.png`, más `sanity-test-step1.png` / `sanity-test-step2.png` (evidencia de la prueba real de Sanity, ver más abajo).

`audit/`: `hero-overlay-frame-01/02/03.png` (movimiento real del overlay en 3 instantes), `cards-equal-height.png`.

**`sanity-hero-editor.png` — no se pudo generar**: el Studio (`dofi-cms.sanity.studio`) requiere una sesión de login (Google/GitHub/email) que esta sesión no puede completar de forma no interactiva, y el navegador de esta sesión no tiene ninguna sesión guardada. En su lugar, la prueba de que el flujo funciona de punta a punta se hizo **contra la propia API de Sanity** (ver siguiente sección) — evidencia funcional, no solo una captura de la interfaz.

## Prueba real de Sanity (spec §47)

Se hizo con `@sanity/client` + el token de escritura ya configurado en `.env.local` (mismo mecanismo que `scripts/seed-sanity-accounts.ts`), usando **imágenes 100% sintéticas** generadas con `sharp` (gradientes de color, cero riesgo de derechos de autor — nunca se usó una foto real de un cliente ni de un banco de imágenes):

1. Subida de imagen de prueba 1 (morado→naranja) + creación del documento `hero` con hotspot `{x: 0.72, y: 0.35}`.
2. Verificado contra la API pública de Sanity: el documento existe con esos datos.
3. Verificado en el frontend: la imagen aparece detrás de todo (overlays, copy, CTA y cards siguen correctamente encima) — `sanity-test-step1.png`.
4. Subida de imagen de prueba 2 (naranja→marino) reemplazando la 1.
5. Revalidación forzada (`POST /api/revalidate`).
6. Verificado en el frontend: la imagen cambió a la 2, visiblemente distinta — `sanity-test-step2.png`.
7. Limpieza: se vació el campo `heroImage` (el documento `hero` queda existiendo, vacío, listo para la foto real) y se borraron los 2 assets de prueba de la biblioteca de Sanity.
8. Verificado que el frontend vuelve limpio al fallback de atmósfera — sin imagen colgada, sin error.

## Cómo cambiar la imagen del Hero (para el propietario)

1. Entrar a `dofi-cms.sanity.studio`.
2. **Hero** es la primera opción del menú.
3. Subir/reemplazar la foto en "Imagen principal", ajustar el punto focal (hotspot) arrastrando el círculo sobre el sujeto, completar "Texto alternativo".
4. Publicar.
5. La web muestra la foto nueva en un máximo de 60 segundos (instantáneo si se agrega "hero" al webhook, ver §10) — sin tocar código, sin cambiar ninguna URL a mano, sin subir nada a `/public`.

## Archivos modificados

- `studio/schemaTypes/hero.ts` — **nuevo**, documento singleton con `heroImage` + `heroImageAlt`.
- `studio/schemaTypes/index.ts` — registra `hero`.
- `studio/deskStructure.ts` — "Hero" primero en el menú, singleton con `_id` fijo.
- `studio/schemaTypes/paginaInicio.ts` — se quita el campo `imagen` (movido a `hero.ts`); se corrigen los placeholders de ejemplo de los CTA (todavía citaban "Empecemos"/"Conoce lo que hacemos").
- `src/lib/sanity.ts` — query reescrita como objeto con dos proyecciones (`pagina` + `heroDoc`); `normalizarHero` combina ambas fuentes; `HeroRaw` pierde los campos de imagen, nuevo `HeroDocRaw`.
- `src/components/CapabilityBand.tsx` — `h-full` en la tarjeta + `min-h-[2lh]`/`leading-snug` en el título (igualdad de alturas).
- `src/app/api/revalidate/route.ts` — comentario documentando el pendiente del webhook.
- `scripts/test-hero-sanity.mjs` — **nuevo**, script de prueba de un solo uso (no forma parte del runtime de la web).

---

## Criterios de aceptación (spec §49)

| Pregunta | Resultado |
|---|---|
| ¿La imagen ocupa todo el área visual del Hero? | Sí |
| ¿Existe una opción/documento llamado Hero? | Sí — primero en el menú del Studio |
| ¿Puedo cambiar la fotografía desde Sanity? | Sí — probado de punta a punta, dos veces |
| ¿El Hero ya no tiene espacios laterales blancos? | Sí — ancho de la capa visual = ancho del viewport, medido |
| ¿La caja lateral desapareció completamente? | Sí |
| ¿La fotografía está detrás de overlays, copy, CTA y cards? | Sí |
| ¿Los paneles geométricos morados están sobre la fotografía? | Sí |
| ¿Los overlays se animan suavemente? | Sí — verificado con datos reales, no solo el código |
| ¿CTA principal dice "Quiero Mejorar mis Ventas"? | Sí |
| ¿CTA secundario dice "Mira Nuestro Trabajo"? | Sí |
| ¿Card 1-4 dicen los títulos exactos? | Sí |
| ¿Las cuatro tarjetas tienen exactamente la misma altura? | Sí — 213px / 213px / 213px / 213px (desktop), medido |
| ¿Iconos, títulos y descripciones están alineados? | Sí |

No se avanzó a ninguna otra sección.
