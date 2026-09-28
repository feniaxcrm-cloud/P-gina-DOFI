# DOFI — Tráfico/Ads, ChatBots/CRM y Asesorías con el sistema de Marketing Digital — Resultados

Repliqué la arquitectura de `/marketing-digital` (documento singleton + `sections[]`
ordenable en Sanity + mismos componentes + mismos fondos decorativos) en las otras 3
páginas de servicio. Local, verificado, nada subido todavía.

## Decisiones ya confirmadas con vos

1. **Estructura primero, vacía.** Estas 3 páginas no tenían ningún brief de contenido
   (a diferencia de Marketing Digital). Armé todo el sistema editable, pero sin
   inventar una sola palabra de copy: hasta que caregues secciones en el Studio, cada
   página sigue mostrando "Página en construcción" — igual que hoy.
2. **Sin Clientes ni Reseñas en estas 3 páginas.** Esos dos tipos guardan sus datos
   (giros de negocio) dentro de la propia sección; repetirlos en 4 páginas obligaría a
   cargar las mismas empresas 4 veces. Se quedan exclusivos de Marketing Digital.

## Qué tiene cada página nueva

Mismos 5 tipos de sección disponibles en las 3 (Tráfico/Ads, ChatBots/CRM, Asesorías),
en el Studio, arrastrables para reordenar, cada una con su interruptor "Mostrar en la
página":

| Tipo (nombre en el Studio) | Componente | Qué es |
|---|---|---|
| Equipo DOFI | `BannerFoto` | Foto de fondo + texto. Pensado para abrir la página. |
| Introducción | `PiezaGrafica` | Título + texto, con los fondos decorativos náuticos. |
| Bloque editorial (fondo oscuro) | `NavegacionEditorial` | La composición morada con brújula. |
| Método en pasos | `MetodoDofi` | El recorrido de pasos numerados hasta un resultado. |
| Cierre (CTA final) | `BannerFoto` | Foto de fondo + pregunta + botón grande. |

Le cambié el nombre en el Studio a 3 de estos tipos (`aboutBanner`, `navigationBanner`,
`methodBanner`): antes decían literalmente "¿Qué es DOFI?" / "¿Cómo navegamos
contigo?" / "Método DOFI", que tenía sentido cuando solo existían en Marketing Digital
pero iba a confundir apareciendo igual en Tráfico/Ads. Ahora dicen "Introducción" /
"Bloque editorial (fondo oscuro)" / "Método en pasos" — nombres de TIPO, no de
contenido. El título real de cada sección sigue saliendo, como siempre, del campo
"Título" que cargues vos; esto solo cambió la etiqueta del menú. **No afecta nada de lo
que ya está publicado en Marketing Digital** — mismo tipo de dato, mismo componente,
cero cambio visual ahí.

## Cómo cargar contenido cuando lo tengas

En el Studio: **Tráfico / Ads**, **ChatBots / CRM** o **Asesorías** (nuevas entradas en
el menú, junto a "Marketing Digital") → "Agregar elemento" → elegís el tipo de sección
→ completás título/texto/imagen/botón. En cuanto guardes la primera sección activa, la
página deja de mostrar "Página en construcción" y pasa a mostrar el diseño real — sin
que yo tenga que tocar código. Si me pasás el brief de texto para alguna (como el que
me diste para Marketing Digital), te la dejo cargada yo.

## Arquitectura (para quien lea el código más adelante)

- `src/lib/pagina-servicio.ts` (nuevo): `getPaginaServicio(tipo)` — misma lógica de
  normalización que `marketing-digital.ts` (reutiliza sus helpers ya exportados:
  `camposBase`, `unoDe`, `bool`, `t`, `ALINEACIONES`, `OVERLAYS`, `IMG`), sin
  `SECCIONES_RESPALDO`: sin contenido real, devuelve `secciones: []`.
- `src/components/marketing/PaginaServicio.tsx` (nuevo): el mismo despachador
  seccion→componente que ya tenía `marketing-digital/page.tsx`, factorizado porque
  ahora lo usan 4 páginas. Si `secciones` viene vacío, muestra
  `PaginaEnConstruccion` en vez de la lista.
- `src/app/{asesorias,chatbots-crm,trafico-ads}/page.tsx`: quedaron en 8 líneas cada
  una — solo el `metadata` (sin cambios) y un llamado a `<PaginaServicio tipo="..."
  titulo="..." />`.
- `studio/schemaTypes/{asesoriasPage,chatbotsCrmPage,traficoAdsPage}.ts` (nuevos):
  documentos singleton, mismo patrón que `marketingDigitalPage.ts`, con `sections[]`
  limitado a los 5 tipos de la tabla de arriba.
- `studio/deskStructure.ts`: 3 entradas nuevas en el menú, mismo patrón singleton
  (documentId fijo) que ya usan Hero/Página de inicio/Banners/Marketing Digital.

## Verificación

- `npx tsc --noEmit`: 0 errores (proyecto Next.js y `studio/`, por separado).
- `npm run build:next`: build de producción completo, 0 errores, 43 páginas.
- Las 3 consultas GROQ nuevas (`traficoAdsPage`, `chatbotsCrmPage`, `asesoriasPage`)
  las probé de verdad contra la API de Sanity (solo lectura): HTTP 200 en las tres —
  sintaxis válida, documento todavía no existe (esperado).
- Puppeteer sobre servidor local: las 3 páginas cargan (HTTP 200), muestran "Página en
  construcción" (correcto, hoy no hay contenido cargado), sin errores de consola, sin
  desborde horizontal, con Nav y Footer. Marketing Digital sin regresión: sus 7
  secciones intactas, sin errores.

## Archivos

**Nuevos**: `src/lib/pagina-servicio.ts`, `src/components/marketing/PaginaServicio.tsx`,
`studio/schemaTypes/{asesoriasPage,chatbotsCrmPage,traficoAdsPage}.ts`.

**Modificados**: los 3 `page.tsx` de servicio, `src/lib/marketing-digital.ts` (agregué
`export` a helpers internos que ya existían — cero cambio de comportamiento),
`studio/deskStructure.ts`, `studio/schemaTypes/index.ts`, y el `title`/preview de
`aboutBanner.ts`/`navigationBanner.ts`/`methodBanner.ts` (solo etiquetas del Studio).

**No tocados**: todo el resto de Marketing Digital (componentes, ornamentos, reseñas),
Nav, Footer, home.

## Pendiente de tu parte

Nada bloquea nada: es un cambio de infraestructura autocontenido, sin contenido
inventado. Decime si lo subo — esta vez el Studio también necesita redeploy (agregué 3
tipos de documento nuevos).
