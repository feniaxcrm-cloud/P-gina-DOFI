# DOFI — Corrección del Header V2 — Resultados

Fecha: 2026-08-27
Alcance: **solo Header/Navbar.** Full-page seccionado, Hero, capability cards, Servicios, Clientes, Footer y páginas internas — sin tocar.

---

## 1. Cambios realizados

1. Botón "Empecemos" eliminado por completo del header (desktop y mobile) — sin hueco, sin reemplazo, sin reubicación.
2. Redistribuido el espacio de la barra ahora que no hay CTA — la navegación gana aire real (ver §4).
3. Iconos de redes sociales rediseñados: fondo blanco explícito, borde morado sutil, sombra muy leve, hover a naranja de acento (antes: morado sólido).
4. Logo re-verificado centrado con la misma técnica (posición absoluta sobre el centro exacto del header) — sigue midiendo 0px.
5. Navegación sin cambios de contenido, con más espacio horizontal ahora que compite con menos elementos.
6. Difuminado/glow sutil agregado: dos manchas muy translúcidas (morado detrás del logo, naranja muy tenue hacia la navegación), recortadas por el propio header.
7. **El punto de quiebre de la barra de 3 zonas vuelve a `lg` (1024px)**, no `xl` (1280px) como en la v1: sin el CTA compitiendo por espacio, la navegación completa ahora entra limpia también a 1024px — medido, no supuesto (ver §4).

## 2. Eliminación del CTA

Confirmado por código (no solo visual): `header a[href="/contactanos"]` ya no existe en ningún estado del header, en ningún viewport probado.

- **Desktop:** la barra pasa de `redes | logo | nav + CTA` a `redes | logo | nav`. El espacio que ocupaba el botón se redistribuye como aire real entre nav y el borde derecho, y como padding recuperado en cada link (ver §4).
- **Mobile:** la barra cerrada pasa de `[logo] [Empecemos] [☰]` a `[logo] ... [☰]` — exactamente el layout pedido en spec §17.

## 3. Redes visibles

Mismo origen de datos que antes (`socialLinks` de `src/config/company.ts`, filtrado a URLs reales configuradas por variable de entorno). **Sigue en cero** — no se configuró ninguna red desde el sprint anterior, así que la zona izquierda se renderiza vacía a propósito, sin inventar ningún ícono ni URL. El estilo nuevo (fondo blanco, borde morado, hover naranja, 44×44px) ya está listo para cuando se configuren.

## 4. Método de centrado real del logo

Sin cambios respecto al sprint anterior — sigue siendo la técnica más robusta: el logo va en `position: absolute; left: 50%; transform: translateX(-50%)` sobre el header, fuera del flujo de redes/nav, así que ninguna de las dos zonas puede empujarlo sin importar su ancho.

| Viewport | Diferencia centro logo vs. viewport | Espacio libre hasta el primer link del nav |
|---|---:|---:|
| 1440 | **0px** | 154px |
| 1280 | **0px** | 134px |
| 1024 | **0px** | 14px |
| 1440 (scrolled) | **0px** | 154px |

**Por qué 1024 vuelve a la barra de 3 zonas:** en la v1, la navegación + el CTA necesitaban ~640px reales, y la mitad disponible a 1024 (~464px) no alcanzaba. Sin el CTA, la navegación sola mide bastante menos — medido con Puppeteer, con el logo centrado hay **14px libres** hasta el primer link a 1024px (sin overlap, sin invadir el logo). Se ajustó el padding de cada link (de `px-2` a `px-1`) específicamente para asegurar ese margen — a 1280 y 1440 sobra tanto espacio (134-154px) que ese ajuste no se nota.

## 5. Tratamiento del difuminado

Dos manchas radiales muy translúcidas, `aria-hidden`, recortadas por `overflow-hidden` en el propio header (nunca se sienten como un fondo):

- Morado (`--color-brand` al 12%), centrada detrás del logo, blur pesado.
- Naranja (`--color-accent` al 8%), desplazada hacia la zona de navegación, blur pesado, todavía más tenue que la morada.

Ninguna de las dos afecta el contraste del texto ni compite visualmente con el logo o el menú — se verificó visualmente en los 3 anchos de escritorio (ver capturas). Es el mismo lenguaje de "atmósfera" que ya usa el slot de imagen del Hero (gradiente + manchas de luz con blur), solo que a la escala mucho más chica del header (64-69px de alto).

## 6. Navegación final

Sin cambios de contenido ni de rutas respecto al sprint anterior: Inicio / Marketing Digital / Tráfico / Ads / ChatBots / CRM / Asesorías. Estado activo: texto morado + subrayado de 2px animado (`layoutId`, mismo mecanismo aprobado). Hover: `ink-muted` → `brand-lift`, cambio de color puro, sin la barra.

## 7. Comportamiento mobile

- Barra cerrada: `[DOFI]` ... `[☰]` — sin CTA, sin redes (spec §17, "no mostrar las redes en la barra cerrada si ensucian" — no se muestran).
- Panel abierto: los 5 links exactos + fila de redes al final (hoy vacía, ver §3) — verificado que el contenedor de redes existe en el DOM del panel (`socialRowExists: true`), listo para poblarse solo.
- Accesibilidad re-verificada después de los cambios estructurales: `Escape` cierra y devuelve el foco al botón hamburguesa, `aria-expanded`/`aria-controls` correctos, `main` deja de ser `inert` al cerrar, scroll lock intacto.
- `prefers-reduced-motion`: subrayado activo y panel móvil quedan visibles (opacidad 1) sin animación, verificado por estilos computados.
- Sin overflow horizontal en 390 ni 360.

## 8. Capturas

`audit/header-correction-v2/`: `desktop-1440.png`, `desktop-1280.png`, `desktop-1024.png`, `desktop-scrolled.png`, `desktop-header-detail.png`, `mobile-390-closed.png`, `mobile-390-open.png`, `mobile-360-open.png`.

## 9. Archivos modificados

- `src/components/Nav.tsx` — CTA eliminado (desktop + mobile), icono de redes rediseñado, difuminado agregado, punto de quiebre de vuelta a `lg` (1024px), espaciado de nav reajustado.
- `src/components/Hero.tsx` — el punto de quiebre del padding superior vuelve a `lg` (coincide con la altura del header, que ya no cambia en `xl`).

---

## Checklist de aprobación (brief §30)

| Pregunta | Resultado |
|---|---|
| ¿El botón "Empecemos" fue eliminado completamente del header? | Sí |
| ¿El logo DOFI está realmente centrado? | Sí — 0px en 1024/1280/1440 |
| ¿Los íconos sociales ya aparecen en la izquierda? | El espacio y el estilo están listos; hoy 0 redes configuradas (sin inventar URLs) |
| ¿La navegación a la derecha está clara y ordenada? | Sí |
| ¿Existe un difuminado sutil inspirado en la referencia? | Sí — morado + naranja muy controlado, verificado que no afecta legibilidad |
| ¿Se siente DOFI y no una copia literal? | Sí |

No se avanzó a Hero ni a ninguna otra sección.
