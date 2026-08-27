# DOFI — Corrección Header: solo Facebook, Instagram, TikTok — Resultados

Fecha: 2026-08-27
Alcance: **solo el bloque de redes del Header.** Sin tocar Hero, capability cards, otras secciones, copy ni el resto de la estructura del header.

---

## 1. Qué cambió

`src/config/company.ts` pasa a exportar dos listas de redes **independientes**, no una compartida:

- `socialLinks` — sin cambios, sigue siendo Instagram/TikTok/LinkedIn. La sigue usando **solo** `Footer.tsx`, que no se tocó.
- `headerSocialLinks` — **nueva**, exclusiva del Header: Facebook / Instagram / TikTok, en ese orden. Nunca incluye LinkedIn ni ninguna otra red, a nivel de tipo (`HeaderSocialKey` es literalmente `"facebook" | "instagram" | "tiktok"`, no puede aceptar una cuarta clave).

`Nav.tsx` pasa a importar `headerSocialLinks` en vez de `socialLinks`, y su mapa de iconos (`ICONOS_SOCIAL`) pasa de `{instagram, tiktok, linkedin}` a `{facebook, instagram, tiktok}`.

## 2. Redes eliminadas del header

LinkedIn era la única red adicional que el header mostraba antes de esta corrección (nunca hubo YouTube, Spotify, X/Twitter ni WhatsApp en el bloque de redes del header). Se eliminó por completo — ver §4 para la verificación real, no solo la lectura del código.

## 3. Ubicación y estilo

Sin cambios de posición (zona izquierda, antes del logo) ni de composición general. Estilo ajustado según spec:

| | Antes | Ahora |
|---|---|---|
| Fondo del icono | heredaba el vidrio del header | **blanco explícito** (`bg-white`) |
| Borde | `brand` 20% | `brand` 20% (sin cambio) |
| Radio | `rounded-lg` (8px) | `rounded-[10px]` |
| Sombra | ninguna | muy leve (`0 1px 2px`) |
| Hover | fondo morado sólido | **fondo naranja de acento**, icono en `fg-on-accent` (mismo par ya usado en el CTA de la marca) |
| Tamaño clickable | 44×44px | 44×44px (dentro del rango 40-44 pedido) |
| Icono interno | 18px | 17px |

Una sola lógica de hover, consistente en las 3 redes (spec §5): morado en reposo → naranja sólido al pasar el cursor. Sin movimiento físico, sin scale.

## 4. Verificación real (no solo lectura de código)

Con 0 redes configuradas en producción hoy, no hay forma de ver los iconos renderizados sin datos reales. Para verificar de verdad que el filtro funciona — y no solo confiar en que el código "debería" excluir LinkedIn — se cargaron **temporalmente** las 4 variables de entorno (incluida `NEXT_PUBLIC_LINKEDIN_URL`, a propósito, para comprobar que el header la ignora aunque exista) con valores de prueba (`example.com/verificacion-temporal-*`, nunca perfiles reales), se relanzó el servidor de desarrollo, se capturaron las evidencias de abajo, y **se revirtió el archivo `.env.local` a su estado original antes de terminar el sprint** (verificado: `grep -c "verificacion-temporal" .env.local` → 0).

Resultado con las 4 redes "configuradas" (incluyendo LinkedIn):

| Header (desktop) | Header (panel mobile) |
|---|---|
| Facebook, Instagram, TikTok — **3 enlaces, en ese orden** | Mismos 3, mismo orden |
| LinkedIn — **no aparece**, pese a tener URL configurada | No aparece |

Cada enlace, verificado por atributo real (no solo visual):

```html
<a href="…" target="_blank" rel="noopener noreferrer" aria-label="Facebook de DOFI">
<a href="…" target="_blank" rel="noopener noreferrer" aria-label="Instagram de DOFI">
<a href="…" target="_blank" rel="noopener noreferrer" aria-label="TikTok de DOFI">
```

`aria-label` exactamente en el formato pedido (spec §8). 44×44px medido, no estimado.

**Estado real (0 redes configuradas), verificado después de revertir:** el bloque se renderiza vacío en desktop y en el panel mobile, sin errores — el header sigue centrado y funcional (ver §5).

## 5. Logo sigue centrado

| | Diferencia centro logo vs. viewport |
|---|---:|
| Con las 3 redes visibles (datos de prueba) | **0px** |
| Sin ninguna red (estado real actual) | **0px** |

Agregar o quitar redes no mueve el logo ni un pixel — sigue usando posición absoluta sobre el centro real del header, independiente del contenido de cualquiera de los dos lados.

## 6. Capturas

`audit/header-socials-only/`:

- `desktop-1440.png` — **estado real de producción** (0 redes configuradas hoy): zona de redes vacía, logo centrado, resto del header sin cambios.
- `mobile-390-open.png` — **estado real**: panel móvil sin fila de redes visible (no hay ninguna configurada).
- `desktop-socials-detail.png` — **única captura con datos de prueba temporales** (ver §4), para mostrar el resultado visual real de los 3 iconos: estilo, orden y exclusión de LinkedIn. Ya no representa el estado actual del sitio (las variables se revirtieron), representa cómo se va a ver en cuanto se configuren las URLs reales.

## 7. Archivos modificados

- `src/config/company.ts` — nueva variable `NEXT_PUBLIC_FACEBOOK_URL`, nuevo tipo `HeaderSocialKey`, nueva lista `headerSocialLinks` (Facebook/Instagram/TikTok), `socialLinks` sin cambios de comportamiento (solo se le acotó el tipo para que siga compilando tras agregar Facebook al objeto `social`).
- `src/components/Nav.tsx` — usa `headerSocialLinks` en vez de `socialLinks`; `ICONOS_SOCIAL` cambia de `{instagram, tiktok, linkedin}` a `{facebook, instagram, tiktok}`; estilo del icono ajustado (fondo blanco, hover naranja); comentario desactualizado sobre el grid corregido de paso.
- `src/components/Footer.tsx` — **un solo cambio mecánico de tipo** (no de comportamiento): se acotó el `satisfies` de su propio mapa de iconos a las 3 claves que ya usaba, porque el tipo compartido `SocialKey` creció al agregar Facebook. El pie sigue mostrando exactamente Instagram/TikTok/LinkedIn, sin cambios visibles.

---

## Checklist de aprobación (brief §11)

| Pregunta | Resultado |
|---|---|
| ¿Aparecen solo Facebook, Instagram y TikTok (desktop)? | Sí — verificado con datos de prueba, LinkedIn excluido aunque estaba configurado |
| ¿Aparecen solo Facebook, Instagram y TikTok dentro del menú (mobile)? | Sí |
| ¿Se eliminó cualquier otra red? | Sí — LinkedIn ya no puede aparecer en el header ni a nivel de tipo |
| ¿El logo sigue centrado? | Sí — 0px con y sin redes visibles |

No se tocó Hero, capability cards, ni ninguna otra sección.
