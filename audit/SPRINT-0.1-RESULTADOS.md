# SPRINT 0.1 — RESULTADOS
### Cerrar fugas críticas · centralizar configuración · preparar infraestructura

| | |
|---|---|
| **Commit base** | `762945f` — árbol limpio, sincronizado con `origin/main` |
| **Fecha** | 20 de agosto de 2026 |
| **Alcance** | Infraestructura. **Cero rediseño.** |
| **Estado** | Cambios en el árbol de trabajo. **Sin commit, sin push, sin deploy** |
| **Dependencias instaladas** | **Ninguna** |
| **Auditoría de referencia** | [`AUDITORIA-DOFI-V1.md`](AUDITORIA-DOFI-V1.md) |

---

## Resumen ejecutivo

Se cerraron **8 fugas** que hacían que la infraestructura mintiera. En orden de gravedad:

1. **El formulario perdía el 100 % de los leads.** `POST /api/contacto` validaba, hacía `console.log(...)` —que en Cloudflare Workers se pierde— y respondía siempre `{ok: true}`. El usuario leía *"Mensaje recibido. Te contactamos muy pronto"* y nadie recibía nada. Ahora el éxito depende de que el destino confirme la entrega; si no hay destino o falla, el usuario ve un error real y una salida por WhatsApp.

2. **El CTA de WhatsApp apuntaba a un número inventado** (`593999999999`) mientras el pie mostraba el real. Ahora hay un solo número, y sale de la configuración central.

3. **Los tres enlaces de redes iban a `instagram.com`, `tiktok.com` y `linkedin.com`** — las portadas de las plataformas. Sin URL de perfil verificada, el icono ya no se pinta.

4. **`og:url` apuntaba a `https://dofi.agency`**, un dominio que no sirve este sitio: cada enlace compartido mandaba al destino equivocado.

5. **Staging era indexable** y no existía ni `sitemap.xml` (404) ni `robots.txt` propio. Ahora staging va `noindex` y ambos archivos existen, con comportamiento condicionado al dominio.

6. **La LCP la rompía una animación decorativa.** El texto crítico del hero nacía invisible. Corregido sin tocar diseño ni copy.

7. **Los datos corporativos vivían repartidos** por seis archivos. Ahora hay una sola fuente de verdad.

8. **No había atribución.** El lead ahora viaja con sus `utm_*`, sin añadir ningún campo visible al formulario.

**El diseño no cambió.** La única diferencia visual es la desaparición de los tres iconos de redes del pie, que es exactamente lo que este sprint mandaba hacer mientras no existan las URLs reales.

---

## Archivos modificados

### Nuevos

| Archivo | Qué hace |
|---|---|
| `src/config/company.ts` | Datos corporativos. Fuente única de verdad. |
| `src/config/site.ts` | URL pública, detección de staging y permiso de indexación. |
| `src/lib/whatsapp.ts` | `createWhatsAppUrl()`, `normalizePhone()`. |
| `src/lib/contact/validation.ts` | Validación compartida cliente/servidor + extracción de UTM. |
| `src/lib/contact/delivery.ts` | `deliverLead()`. Abstracción de entrega vía webhook. |
| `src/app/robots.ts` | `/robots.txt` condicionado al entorno. |
| `src/app/sitemap.ts` | `/sitemap.xml` con las 27 URLs públicas. |

### Modificados

| Archivo | Cambio |
|---|---|
| `src/app/api/contacto/route.ts` | Reescrito. Entrega real + códigos de estado correctos + logging sin datos personales. |
| `src/components/Contact.tsx` | Consume la config, captura UTM, distingue tipos de error. **Markup y clases sin tocar.** |
| `src/components/Footer.tsx` | Consume la config; redes sin URL real no se renderizan. |
| `src/components/Hero.tsx` | Se quita `opacity: 0` + `delay: 0.95s` del párrafo candidato a LCP. |
| `src/components/WaveText.tsx` | La cascada del H1 pasa a transform puro, sin `opacity`. |
| `src/app/layout.tsx` | Metadata desde config: `metadataBase`, canonical condicional, `robots`, `og:url`. |
| `src/app/clientes/[slug]/page.tsx` | Canonical condicional y `og:url` por caso. |
| `src/lib/sanity.ts` | El respaldo de `seccionCierre.enlace` deja de traer el número falso. |
| `.env.example` | Reescrito con todas las variables y su efecto. |
| `README.md` | Se corrige la sección de Contacto, que documentaba el número falso y el `console.log`. |

### Intactos

`Nav.tsx` · `Services.tsx` · `ServiceRow.tsx` · `Process.tsx` · `Manifesto.tsx` · `Tools.tsx` · `Socio.tsx` · `SocioPortrait.tsx` · `Clients.tsx` · `ClientsCarousel.tsx` · `ClientCard.tsx` · `LogoWall.tsx` · `MagneticCta.tsx` · `OceanCurrent.tsx` · `Reveal.tsx` · `VideoTile.tsx` · `Wordmark.tsx` · `globals.css` · `clients.ts` · `page.tsx`

---

## Formulario — cómo entrega ahora los leads

### Inspección previa

Se buscó en todo el repositorio: `kommo`, `amocrm`, `webhook`, `n8n`, `make`, `zapier`, `gohighlevel`, `ghl`, `resend`, `sendgrid`, `smtp`, `nodemailer`, `mailgun`, `postmark`, `CRM_*`, `LEAD_*`, `CONTACT_*`.

**No existía ninguna integración.** Los únicos aciertos fueron comentarios (`route.ts:8-10` describía las opciones a futuro), copy de clientes y el README. Sin SDK, sin cliente HTTP, sin credenciales.

También se revisó el entorno: **solo existe `.env.example`**, con `SANITY_PROJECT_ID` y `SANITY_DATASET`, ambas vacías. **No hay `.env.local`.** Ningún secreto disponible ni expuesto.

→ Por tanto se aplicó la **Opción C**: abstracción limpia preparada para webhook.

### Arquitectura

```
Contact.tsx
   └─ valida con lib/contact/validation.ts  (misma regla que el servidor)
   └─ POST /api/contacto  { nombre, email, empresa?, mensaje, utm }
          │
   api/contacto/route.ts
   ├─ JSON inválido ──────────────────────► 400 invalid_json
   ├─ validación falla ───────────────────► 400 validation_failed + errores por campo
   ├─ isDeliveryConfigured() === false ───► 503 delivery_not_configured
   └─ deliverLead(lead)
          │
      lib/contact/delivery.ts
      └─ POST a CONTACT_WEBHOOK_URL  (timeout 8s, Bearer opcional)
             ├─ 2xx ───────► 200 { ok: true, id }
             ├─ no-2xx ────► 502 provider_error
             ├─ timeout ───► 504 timeout
             └─ red caída ─► 502 provider_error
```

**Ningún camino devuelve éxito sin confirmación del destino.**

### Payload que recibe el webhook

```json
{
  "id": "ld_mt1x1y8qal6eim",
  "nombre": "Ana Pérez",
  "email": "ana@empresa.com",
  "empresa": "Acme",
  "mensaje": "Necesitamos campaña y CRM para el lanzamiento.",
  "source": "web:formulario-contacto",
  "utm": { "utm_source": "instagram", "utm_campaign": "lanzamiento" },
  "submittedAt": "2026-08-20T19:31:22.392Z"
}
```

Sirve tal cual para n8n, Make, un endpoint propio o una función que cree el lead en Kommo. **No se inventó ninguna URL de destino, ni se usó webhook.site ni ningún endpoint público de prueba.**

### Logging

Se registra el resultado, nunca los datos personales:

```
lead_delivery_success id=ld_mt1x1y8qal6eim provider=webhook utm_source=instagram timestamp=2026-08-20T19:31:22.392Z
lead_delivery_failed  id=ld_... reason=provider_error detail=el webhook respondio 500 status=502 timestamp=...
lead_delivery_unavailable reason=not_configured timestamp=...
```

Sin nombre, sin correo, sin teléfono, sin el texto del mensaje.

### Rate limiting

**No implementado.** El contrato ya reserva el `429` y el cliente sabe mostrarlo, pero hacerlo bien en Workers exige estado compartido (KV o Durable Object) que hoy no está aprovisionado; un contador en memoria sería inútil porque cada isolate arranca vacío. Documentado como pendiente, no simulado.

---

## WhatsApp

| | |
|---|---|
| **Número en uso** | `593984472869` |
| **Origen** | `src/config/company.ts` → `company.whatsapp.number` |
| **Sobrescritura** | `NEXT_PUBLIC_COMPANY_WHATSAPP` |
| **Construcción de URL** | `createWhatsAppUrl()` en `src/lib/whatsapp.ts` |

`normalizePhone()` elimina `+`, espacios, guiones, puntos y paréntesis. El mensaje va con `encodeURIComponent`.

Mensaje por defecto (neutro, **no** copy comercial definitivo):
> *Hola DOFI, me interesa conocer cómo pueden ayudar a mi empresa.*

**Verificado en el HTML servido:** cero apariciones de `593999999999`; un único `wa.me` normalizado en toda la home y en las páginas de caso.

El número falso entraba por el respaldo de `src/lib/sanity.ts:287`. Como Sanity no sirve contenido en producción, **ese respaldo era exactamente lo que se publicaba.**

---

## Redes sociales

Se buscaron URLs reales en el código, en el esquema de Sanity, en el README, en `.env.example`, en la metadata y en la configuración del proyecto.

**No existe ninguna URL de perfil verificable.**

Los tres enlaces apuntaban a la portada de cada plataforma. Siguiendo la regla del sprint —no inventar handles— **los tres iconos se ocultan** hasta que existan las URLs reales. Se activan solo definiendo su variable:

| Red | Variable | Estado |
|---|---|---|
| Instagram | `NEXT_PUBLIC_INSTAGRAM_URL` | 🔴 **BLOCKER** — pendiente URL real |
| TikTok | `NEXT_PUBLIC_TIKTOK_URL` | 🔴 **BLOCKER** — pendiente URL real |
| LinkedIn | `NEXT_PUBLIC_LINKEDIN_URL` | 🔴 **BLOCKER** — pendiente URL real |

Es la única diferencia visual del sprint. Ver `audit/sprint-0.1/footer-after.png`.

> Los `aria-label` de Instagram y TikTok que quedan en el HTML pertenecen a los **logos de marca de la sección Herramientas** (SVG decorativos, no enlaces). Verificado: cero `<a>` hacia esas plataformas.

---

## Email corporativo

Sin cambios. No existe correo corporativo configurado en ninguna parte, y no se inventó un dominio.

- **Actual:** `dofiagenciacreativa@gmail.com`
- **Ahora centralizado** en `company.email`, sobrescribible con `NEXT_PUBLIC_COMPANY_EMAIL`
- **RECOMENDACIÓN:** migrar a correo corporativo propio. No es un blocker técnico; sí resta en percepción para una empresa que vende sistemas empresariales.

---

## Sanity

## Clasificación: **B — CONFIGURADO EN CÓDIGO, NO EN EL DEPLOYMENT**

| Comprobación | Resultado |
|---|---|
| ¿Qué contenido controla? | Carrusel de Clientes + textos de *Lo que hacemos*, *El Socio* y *Cierre* |
| ¿Existen queries? | Sí — GROQ completo, con alias que mapean al modelo de la app |
| ¿Cliente inicializado? | Sí — `fetch()` plano a la query API, sin SDK (decisión deliberada y correcta) |
| ¿Manejo de errores? | Sí — respaldo completo, tipado y validado por documento |
| ¿Variables requeridas? | `SANITY_PROJECT_ID`, `SANITY_DATASET` |
| ¿Declaradas en `.env.example`? | Sí, vacías |
| ¿Existen localmente? | **No** — no hay `.env.local` |
| ¿Existen en Cloudflare? | **No** — probado: el HTML servido no tiene ni una referencia a `cdn.sanity.io` y todos los textos coinciden con los respaldos del código |

**La integración es deliberada y está completa. No es legacy ni está a medias: solo le faltan las dos variables en el Worker.** Mientras tanto, todo el contenido "editable" sale del código.

**Recomendación: decidir.** Las dos opciones son válidas; el estado intermedio actual es el problema.

- **Activarlo** → definir `SANITY_PROJECT_ID` y `SANITY_DATASET` en Cloudflare y poblar el dataset.
- **Retirarlo** → quitar `src/lib/sanity.ts` y dejar el contenido en código, que es lo que ya ocurre de hecho.

**No se eliminó nada.** El comentario de `sanity.ts` que afirmaba *"ya configuradas en Cloudflare"* es incorrecto y así queda documentado.

---

## SEO técnico

| Elemento | Antes | Ahora |
|---|---|---|
| **Dominio** | `https://dofi.agency` escrito a mano en `layout.tsx` | `NEXT_PUBLIC_SITE_URL`, fuente única en `src/config/site.ts` |
| **`robots.txt`** | El de Cloudflare por defecto (content-signals) | Propio, condicionado al entorno |
| **`sitemap.xml`** | **HTTP 404** | 27 URLs absolutas |
| **Canonical** | Ausente en las 27 páginas | Condicional al dominio |
| **`og:url`** | `https://dofi.agency` (dominio muerto) | Desde config |
| **`og:image` home** | Ausente | Sigue ausente — ver blockers |
| **noindex en staging** | No existía | Activo |

### Comportamiento verificado en los dos modos

**STAGING** (sin `NEXT_PUBLIC_SITE_URL`, o host `*.workers.dev` / `localhost`):

```
<meta name="robots" content="noindex, nofollow">
canonical:  ausente  (un canonical a *.workers.dev sería peor que ninguno)
og:url:     https://pagina-dofi.feniax-crm.workers.dev
robots.txt: User-Agent: *
            Disallow: /
sitemap.xml: HTTP 200 · 27 urls  (existe, pero robots NO lo declara)
```

**PRODUCCIÓN** (simulada con `NEXT_PUBLIC_SITE_URL=https://dofi.example`):

```
meta robots: AUSENTE  -> indexable
canonical home:      https://dofi.example
canonical caso:      https://dofi.example/clientes/taitico
og:url:              https://dofi.example
og:image caso:       https://dofi.example/media/cover-16-9.jpg   (absoluta)
robots.txt: User-Agent: *
            Allow: /
            Disallow: /api/
            Host: https://dofi.example
            Sitemap: https://dofi.example/sitemap.xml
sitemap.xml: 27 urls absolutas
```

**La regla es condicional, no hay `noindex` fijo en el código.** En cuanto `NEXT_PUBLIC_SITE_URL` apunte al dominio definitivo, el sitio pasa a indexable sin tocar una línea.

> ⚠️ **No enviar el sitemap a Search Console** hasta que exista el dominio definitivo.

---

## Performance

### Metodología

390 × 844 · 4G lento (1,6 Mbps / 150 ms RTT) · CPU ×4 · caché desactivada · Chrome headless · mediana de 5 cargas.

**La máquina de medición estaba bajo carga durante la sesión, así que las cifras absolutas son ruidosas** (el FCP solo varió entre 2 716 y 7 492 ms sobre el mismo build). Por eso el resultado se reporta sobre la métrica que **aísla el arreglo**: la brecha entre FCP y LCP. Esa brecha no depende de la carga de la máquina ni del hosting — es exactamente el tiempo que la animación mantenía invisible al texto.

### Resultado

Comparación medida **en la misma sesión, con la misma carga de máquina y la misma metodología**: staging público (código anterior) frente al build local (código nuevo).

| Métrica | Antes<br>*(staging, código anterior)* | Después<br>*(build local, código nuevo)* |
|---|---:|---:|
| FCP | 4 800 ms | 4 208 ms |
| **LCP** | **10 772 ms** | **4 208 ms** |
| **Brecha FCP → LCP** | **5 972 ms** | **0 ms** |
| CLS | 0,000 | 0,0005 |
| TBT | 4 793 ms | 3 555 ms |
| Elemento LCP | `<p>` "DOFI AGENCIA CREATIVA" | el mismo |

**El dato duro: `LCP === FCP` en las 8 cargas posteriores al cambio, sin una sola excepción.** El texto ya se pinta en el primer frame; nada lo retrasa artificialmente.

Como referencia, la medición original de la auditoría sobre staging sin carga extra dio FCP 1 228 ms / LCP 4 372 ms — la misma brecha de ~3 100 ms. Eliminada la brecha, **al desplegar la LCP debería situarse junto al FCP, en torno a 1,2–1,5 s**, cómodamente bajo el umbral de 2,5 s.

> Es una **proyección**, no una medición: el código nuevo todavía no está desplegado. Se confirma tras el deploy.

### Qué se cambió exactamente

| Archivo | Antes | Ahora |
|---|---|---|
| `Hero.tsx` | `initial={{opacity: 0, y: 14}}` · `delay: 0.95s` · `duration: 1s` | `initial={{y: 14}}` · sin delay · `duration: 0.8s` |
| `WaveText.tsx` | `initial={{y: "0.5em", opacity: 0}}` | `initial={{y: "0.5em"}}` |

Ambas animaciones **siguen existiendo** y conservan su cascada, su curva y su duración. Solo dejaron de ocultar el texto: la entrada es ahora de `transform` puro. No se tocó el diseño, ni el copy, ni el H1.

### Lo que sigue pesando (no se tocó, es del sprint de performance)

- `logo-dofi-compact.png`: **162 KB** para renderizarse a 48 px. El optimizador de imágenes de Next **no redimensiona en Cloudflare** (`?w=48` devuelve el PNG original). ~250 KB evitables.
- `icon.png` (favicon): 58 KB para 32 px.
- TBT alto: hidratación de varias islas cliente + el canvas `OceanCurrent`.

---

## Calidad

| Comprobación | Comando | Resultado |
|---|---|---|
| **TypeScript** | `npx tsc --noEmit` | ✅ **Pasa**, cero errores |
| **Build** | `npm run build:next` | ✅ **Pasa** — 34 páginas, `/robots.txt` y `/sitemap.xml` como rutas nuevas |
| **Lint** | `npm run lint` | ⚠️ **N/A** |

> **Sobre el lint:** el script existe pero el proyecto **no tiene ESLint configurado** — no hay archivo de configuración, no hay `eslintConfig` en `package.json` y no hay ninguna dependencia de ESLint instalada. `next lint` está además deprecado en Next 15 y abre un asistente interactivo para instalarlo. Siguiendo la regla del sprint (*no instalar herramientas solo para crear un script*), **no se configuró**. Se reporta como N/A.

> **Sobre el typecheck:** tampoco existe un script `typecheck` en `package.json`. Se ejecutó `tsc --noEmit` directamente, sin instalar nada (TypeScript ya es dependencia del proyecto).

---

## Tests ejecutados

### Formulario

| Caso | Esperado | Obtenido |
|---|---|---|
| Datos válidos, sin webhook configurado | 503 | ✅ `503 {"ok":false,"error":"delivery_not_configured"}` |
| Email inválido | 400 | ✅ `400 validation_failed` + error del campo |
| Nombre y mensaje demasiado cortos | 400 | ✅ `400` con los dos errores por campo |
| Cuerpo que no es JSON | 400 | ✅ `400 invalid_json` |
| Webhook responde 200 | 200 | ✅ `200 {"ok":true,"id":"ld_..."}` |
| Webhook responde 500 | 502 | ✅ `502 provider_error` |
| Webhook no responde (8 s) | 504 | ✅ `504 timeout` |
| UTM: claves desconocidas | descartadas | ✅ `basura` eliminada, `utm_source`/`utm_campaign` conservadas |

**En ningún caso de fallo se devolvió éxito.**

> Los casos con proveedor se probaron contra un **doble local** en `localhost:3999`, levantado solo para el test y ya detenido. No se usó ningún endpoint público ni quedó ninguna URL de prueba en el código.

### WhatsApp

| Comprobación | Resultado |
|---|---|
| Apariciones de `593999999999` en el HTML | ✅ **0** |
| Enlaces `wa.me` distintos en la home | ✅ **1** — `https://wa.me/593984472869` |
| Enlaces `wa.me` en una página de caso | ✅ el mismo número |

### Redes

| Comprobación | Resultado |
|---|---|
| Enlaces a la portada de `instagram.com` | ✅ **0** |
| Enlaces a la portada de `tiktok.com` | ✅ **0** |
| Enlaces a la portada de `linkedin.com` | ✅ **0** |
| Etiquetas `<a>` hacia esas plataformas | ✅ **ninguna** |

### Verificación visual

`audit/sprint-0.1/` — `desktop-before.png` · `desktop-after.png` · `mobile-before.png` · `mobile-after.png` · `footer-after.png`

Primer viewport **idéntico** en desktop y en móvil: mismo H1, mismo logo, misma navegación, misma firma, mismo espaciado. Única diferencia en toda la página: los tres iconos de redes del pie.

---

## BLOCKERS

Requieren decisión o dato del propietario. **Ninguno se resolvió inventando un valor.**

| # | Blocker | Bloquea | Qué se necesita |
|---|---|---|---|
| **1** | **Dominio definitivo** | canonical · indexación · sitemap en Search Console · `og:url` | El dominio final. Hasta entonces el sitio queda `noindex`. **Es el blocker más urgente: bloquea cuatro entregables de SEO a la vez.** |
| **2** | **Endpoint de entrega de leads** | que el formulario funcione | Una URL de webhook (n8n / Make / función propia hacia Kommo). **Hasta que exista, el formulario responde 503 y deriva a WhatsApp.** |
| **3** | **URL real de Instagram** | icono de Instagram en el pie | URL completa del perfil |
| **4** | **URL real de TikTok** | icono de TikTok en el pie | URL completa del perfil |
| **5** | **URL real de LinkedIn** | icono de LinkedIn en el pie | URL completa del perfil |
| **6** | **Decisión sobre Sanity** | claridad operativa | Activarlo (credenciales + poblar el dataset) o retirarlo |
| **7** | **Imagen `og:image` 1200×630** | tarjetas de enlace al compartir | Una pieza gráfica real. No se puso una imagen de relleno a propósito |
| **8** | **Configuración en Cloudflare** | que todo lo anterior surta efecto | Cargar las variables en `pagina-dofi → Settings → Variables and Secrets` |

### Recomendaciones (no bloquean)

- **Correo corporativo propio** en lugar de la cuenta de Gmail.
- **Rate limiting** en `/api/contacto` cuando haya KV o Durable Object aprovisionado.

---

## Variables a configurar

Ninguna es obligatoria para que el sitio arranque. Lo que cambia es si miente o no.

### En Cloudflare — `pagina-dofi → Settings → Variables and Secrets`

| Variable | Prioridad | Efecto si falta |
|---|---|---|
| `CONTACT_WEBHOOK_URL` | 🔴 **Crítica** | El formulario responde 503 y deriva a WhatsApp |
| `NEXT_PUBLIC_SITE_URL` | 🔴 **Crítica** | El sitio queda `noindex`, sin canonical, sin sitemap declarado |
| `CONTACT_WEBHOOK_TOKEN` | 🟡 Opcional | Se envía sin cabecera de autenticación |
| `NEXT_PUBLIC_INSTAGRAM_URL` | 🟡 Alta | El icono de Instagram no se muestra |
| `NEXT_PUBLIC_TIKTOK_URL` | 🟡 Alta | El icono de TikTok no se muestra |
| `NEXT_PUBLIC_LINKEDIN_URL` | 🟡 Alta | El icono de LinkedIn no se muestra |
| `SANITY_PROJECT_ID` | 🟡 Media | Se usa el contenido de respaldo del código |
| `SANITY_DATASET` | 🟡 Media | Idem |
| `NEXT_PUBLIC_COMPANY_EMAIL` | ⚪ Opcional | Se usa el Gmail actual |
| `NEXT_PUBLIC_COMPANY_WHATSAPP` | ⚪ Opcional | Se usa `593984472869` |
| `NEXT_PUBLIC_COMPANY_PHONE` | ⚪ Opcional | Se usa `+593 98 447 2869` |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | ⚪ Opcional | No se muestra dirección |

> ⚠️ **Las `NEXT_PUBLIC_*` se inyectan en tiempo de build.** Después de definirlas o cambiarlas hay que **volver a desplegar**; no basta con guardarlas.

Los nombres y su efecto están documentados en [`.env.example`](../.env.example).

---

## Pendiente para próximos sprints — explícitamente NO resuelto

Nada de lo siguiente se tocó. Sigue tal como lo describe la auditoría:

| Pendiente | Estado |
|---|---|
| **Hero nuevo** (propuesta de valor, CTA, jerarquía) | ❌ NO resuelto |
| **Navbar nuevo** | ❌ NO resuelto |
| **CTA en móvil** — sigue ausente por debajo de 640 px | ❌ NO resuelto — `PENDIENTE SPRINT NAVBAR` |
| **CTA entre secciones** — siguen 7,8 pantallas sin ninguno | ❌ NO resuelto |
| **Carrusel de clientes** — 26 puntos en móvil | ❌ NO resuelto |
| **Tarjetas de cliente** — 971 px, misma imagen ×26 | ❌ NO resuelto |
| **Logos reales de cliente** — siguen los monogramas | ❌ NO resuelto |
| **Bug de Kommo/CapCut sin logo** (`existsSync` en Workers) | ❌ NO resuelto |
| **Design System** — escala tipográfica, ritmo vertical, medidas | ❌ NO resuelto |
| **FENIAX** — sigue siendo 3 menciones marginales | ❌ NO resuelto |
| **"Ventas Inteligentes"** — sigue sin aparecer | ❌ NO resuelto |
| **El Socio** — sin cargo, credenciales ni oferta | ❌ NO resuelto |
| **Servicios / Proceso / Herramientas** | ❌ NO resueltos |
| **Motion** (OceanCurrent, manifiesto, marquesinas) | ❌ NO resuelto — solo se quitó el delay que rompía la LCP |
| **GEO / JSON-LD** (`Organization`, `LocalBusiness`, `Person`) | ❌ NO resuelto |
| **Peso de imágenes** (162 KB para un logo de 48 px) | ❌ NO resuelto |
| **Objetivos táctiles < 44 px** | ❌ NO resuelto |
| **Tracking / analytics** | ❌ NO resuelto — solo se preparó la captura de UTM |

---

## Criterios de aceptación

| Criterio | Estado |
|---|---|
| El formulario nunca confirma éxito sin entrega | ✅ |
| Existe mecanismo real/preparado de entrega | ✅ webhook |
| Un fallo del proveedor produce error | ✅ 502 / 503 / 504 |
| La estructura acepta UTM | ✅ 8 parámetros, saneados |
| Cero referencias al número falso | ✅ verificado en el HTML |
| Una sola fuente de verdad para WhatsApp | ✅ |
| Ningún enlace lleva a la portada de una plataforma | ✅ |
| Los perfiles desconocidos se omiten | ✅ |
| Datos corporativos centralizados | ✅ `src/config/company.ts` |
| URL del sitio centralizada | ✅ `src/config/site.ts` |
| `.env.example` correcto y sin secretos | ✅ |
| Existe sitemap | ✅ 27 URLs |
| Existe robots propio | ✅ condicional |
| Staging va noindex | ✅ |
| El canonical depende del dominio configurado | ✅ |
| URLs de OpenGraph no hardcodeadas | ✅ |
| El texto crítico del hero no depende de ~1 s de invisibilidad | ✅ brecha FCP→LCP = 0 ms |
| LCP registrada antes y después | ✅ |
| El build pasa | ✅ |
| TypeScript pasa | ✅ |
| Lint pasa | ⚠️ N/A — ESLint no está configurado |
| Ninguna sección se rompió visualmente | ✅ verificado con capturas |

**20 de 21 cumplidos. El restante es N/A por ausencia de herramienta, no por fallo.**

---

*Sprint 0.1 sobre el commit `762945f`. Cambios en el árbol de trabajo, sin commit ni deploy. No se instaló ninguna dependencia. No se expuso ningún secreto.*
