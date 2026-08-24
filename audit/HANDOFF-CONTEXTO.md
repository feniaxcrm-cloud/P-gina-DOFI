# CONTEXTO DEL PROYECTO — DOFI Agencia Creativa

> **Pega este documento completo como primer mensaje en la nueva sesión de Claude.**
> Está escrito para que puedas continuar sin haber visto nada de lo anterior.

---

## 0. Lo primero que debes hacer

En el repositorio hay **seis documentos** en `/audit/` que son la memoria real del proyecto. Léelos antes de tocar código:

| Documento | Qué contiene |
|---|---|
| `audit/AUDITORIA-DOFI-V1.md` | Auditoría completa del sitio. 28 secciones, puntuación 38,5/100, 50 hallazgos priorizados P0/P1/P2 |
| `audit/DOFI-DESIGN-SYSTEM-V1.md` | Sistema de diseño V1: tokens, retícula, tipografía, espaciado, motion. **Aprobado como base** |
| `audit/SPRINT-0.1-RESULTADOS.md` | Cierre de fugas de infraestructura. **Vigente en producción** |
| `audit/HERO-V1-RESULTADOS.md` | Hero rediseñado. **Revertido** — ver §3 |
| `audit/NAVBAR-V1-RESULTADOS.md` | Navbar rediseñado. **Revertido** — ver §3 |
| `audit/LOGO-WALL-V1-RESULTADOS.md` | Franja de prueba social. **Revertida** — ver §3 |

Todas las medidas de esos documentos se tomaron en Chrome sobre la página real (Puppeteer), no se estimaron: tipografía, contraste WCAG, espaciado, LCP, velocidades. Puedes fiarte de ellas.

---

## 1. El negocio

**DOFI Agencia Creativa** es una agencia de Cuenca, Ecuador. Opera junto a dos marcas hermanas:

| Marca | Función | Qué hace |
|---|---|---|
| **DOFI** | ATRAER | Marketing 360, Meta Ads, TikTok Ads, community management, producción audiovisual, estrategia creativa |
| **FENIAX** | CONVERTIR | CRM Kommo, GoHighLevel, automatizaciones, funnels, landing pages, seguimiento comercial, IA aplicada a ventas |
| **EL SOCIO** | ESCALAR | Marca personal de **Daniel Vallejo**: capacitaciones, asesorías, consultoría, cursos, reserva de citas |

El concepto comercial que quieren posicionar es **"Ventas Inteligentes"**, con la arquitectura **ATRAER → CONVERTIR → ESCALAR**.

Identidad visual: mar y delfines, eslogan *"Un mar de ideas"*. Púrpura profundo de marca + naranja como único acento.

**Dato crítico del diagnóstico:** hoy el sitio comunica *"una agencia creativa que también hace CRM"*. No comunica el ecosistema. FENIAX aparece 3 veces de forma marginal y "Ventas Inteligentes" **no aparece ni una vez**.

---

## 2. Dónde está y con qué está hecho

```
Ruta local:  C:\Users\Marcelo\Desktop\FENIAX\Claude\Página Web
Repo:        github.com/feniaxcrm-cloud/P-gina-DOFI   rama main
Commit:      9e165ea    (local y origin sincronizados, árbol limpio)
Deploy:      Cloudflare Workers vía OpenNext
URL:         https://pagina-dofi.feniax-crm.workers.dev/   ← STAGING, no producción
```

**Stack:** Next.js 15 (App Router) · Tailwind v4 · Motion · Phosphor Icons · Sanity (inerte, ver §5) · tema oscuro único.

**Fuentes:** Sora (display) y Geist Sans (texto), **auto-alojadas**. No las cambies a `next/font/google`: eso colgó el build de Cloudflare 29 minutos porque el sandbox no llega a `fonts.gstatic.com`.

---

## 3. Estado actual del código — LEE ESTO CON ATENCIÓN

Se hicieron cinco sprints. **Tres de ellos fueron revertidos por decisión del propietario.**

```
9e165ea  Revertir el rediseño visual        ← ESTADO ACTUAL
ed63e84  Documentación (audit/)              ← vigente
855f466  Logo Wall V1                        ← REVERTIDO
396e44b  Navbar V1                           ← REVERTIDO
3ba6d3b  Hero V1                             ← REVERTIDO
2605338  Sprint 0.1 · infraestructura        ← VIGENTE
762945f  (estado anterior a todo)
```

### Qué está vigente ahora

**La página se ve como antes del rediseño:** hero *"Un mar de ideas"* con el delfín de 430px y el canvas, navegación de 5 enlaces con "Iniciar proyecto", muro de cuentas con monogramas de 2 letras.

**Pero la infraestructura del Sprint 0.1 SÍ sigue activa.** No la rompas:

| Archivo | Qué hace |
|---|---|
| `src/config/company.ts` | Datos corporativos. **Fuente única de verdad.** Ningún componente escribe un teléfono o correo a mano |
| `src/config/site.ts` | URL pública y decisión de indexabilidad |
| `src/lib/whatsapp.ts` | `createWhatsAppUrl()`. Ningún componente escribe `wa.me/...` a mano |
| `src/lib/contact/validation.ts` | Validación compartida cliente/servidor |
| `src/lib/contact/delivery.ts` | `deliverLead()` vía webhook |
| `src/app/api/contacto/route.ts` | 200 / 400 / 502 / 503 / 504. **Nunca devuelve éxito sin confirmación del destino** |
| `src/app/robots.ts` · `sitemap.ts` | Condicionados al dominio |

### Excepción dentro del revert

El arreglo de LCP sobre `Hero.tsx` se conservó a propósito: el párrafo de la firma se anima solo con `transform`, **sin `opacity` inicial ni `delay` de 0,95s**. Sin eso la LCP en móvil volvía a 4,37 s teniendo el contenido listo desde 1,8 s. Es la única línea del hero que no es la original.

### Si quieren recuperar el rediseño

Se usó `git revert`, **no** reescritura de historial. Los tres commits siguen ahí. Para volver a traer el rediseño completo:

```bash
git revert 9e165ea
```

No hay que rehacer nada.

---

## 4. Los hallazgos que no se pueden perder

Están todos en la auditoría, pero estos son los que cambian decisiones:

### Medidos, no estimados

1. **La unidad `ch` sobreestima el ancho real un 39 % en Geist.** El glifo `0` mide `0.663em` pero la prosa castellana real mide `0.476em`. Definir "60ch" entrega **84 caracteres**. Usa píxeles calculados sobre el ancho real.
   > `caracteres por línea = ancho_px / (0,476 × font-size)` para Geist 400
   > `caracteres por línea = ancho_px / (0,540 × font-size)` para Sora 800

2. **Las tres superficies oscuras son indistinguibles entre sí:** `abyss` vs `deep` = **1,08:1**. Un cambio de superficie se percibe a partir de ~1,25:1, y el techo que preserva AA es `#271A5C` (1,27:1). **La superficie no puede ser el mecanismo de ritmo** en esta paleta.

3. **Un rojo de error es indistinguible del naranja de CTA:** 1,01:1. Los estados deben llevar **icono + borde**, el color no basta.

4. **El H1 a 144px es una restricción de negocio.** "Marketing que vende" (19 caracteres) mide **1 531px** a ese tamaño — más ancho que el contenedor. Por eso el hero dice *"Un mar de ideas"* y no puede decir una propuesta de valor.

5. **El contraste es una fortaleza real:** 11 de 12 combinaciones en AA o AAA. No toques la paleta a la ligera.

### Bugs abiertos, no resueltos

| Bug | Detalle |
|---|---|
| **Kommo y CapCut sin logo** | `logoPropio()` en `Tools.tsx:105` usa `existsSync(process.cwd()...)`, que **no resuelve en el build de OpenNext sobre Workers**. Caen a wordmark y además conservan color `mist`, así que "Kommo" se ve **más apagado que "Meta Ads"** |
| **Optimizador de imágenes inoperante** | `/_next/image?url=...&w=48` devuelve el **PNG original de 162 KB**, sin redimensionar ni convertir. El logo de la barra es el recurso más pesado de la página. ~250 KB evitables |
| **26 tarjetas de cliente con la misma imagen** | `/media/cover-16-9.jpg`, un degradado vacío. Además es 16:9 recortado en marco 9:16 |
| **26 puntos de carrusel en móvil** | Se envuelven en 3 filas con un punto huérfano |
| **Sin CTA en la barra bajo 640px** | 7,8 pantallas sin ninguna acción posible |
| **Marquesina del manifiesto a 2,63:1** | Falla WCAG. Y contiene el mejor copy del sitio: *"Piezas que se ven"* y *"Sistemas que venden"* |
| **`WaveText.tsx` y `OceanCurrent.tsx`** | Vuelven a estar en uso tras el revert |

---

## 5. Sanity — está conectado pero **no funciona**

Clasificación: **B — configurado en código, no en el deployment.**

- La integración es completa y deliberada: consulta GROQ, tipos, respaldos, manejo de errores. Sin SDK, `fetch` plano.
- **Faltan `SANITY_PROJECT_ID` y `SANITY_DATASET` en el Worker.** No hay `.env.local` tampoco.
- Probado: el HTML servido **no tiene ni una referencia a `cdn.sanity.io`** y todos los textos coinciden con los respaldos escritos en `src/lib/sanity.ts`.
- El comentario del propio archivo dice *"ya configuradas en Cloudflare"*. **Es incorrecto.**

**Hay que decidir:** activarlo (credenciales + poblar el dataset) o retirarlo. El estado intermedio actual es el problema — de ahí salía el número falso de WhatsApp.

---

## 6. Blockers que dependen del propietario

Ninguno se puede resolver escribiendo código.

| # | Blocker | Qué bloquea |
|---|---|---|
| 1 | **Dominio definitivo** | canonical · indexación · sitemap en Search Console · `og:url`. **El más urgente: bloquea cuatro cosas a la vez** |
| 2 | **Endpoint de entrega de leads** | Hasta que exista, el formulario responde 503 y deriva a WhatsApp |
| 3 | **URLs reales de Instagram, TikTok y LinkedIn** | Los iconos del pie están ocultos a propósito |
| 4 | **Los 26 logotipos de cliente** | 0 de 26 en el proyecto. Con 12 se puede montar el muro completo |
| 5 | **Material audiovisual real** | Cero vídeo en el sitio de una productora audiovisual |
| 6 | **Fotografía profesional de Daniel** | La actual es un recorte compuesto sobre una galaxia, con marca de agua |
| 7 | **Decisión sobre Sanity** | Ver §5 |
| 8 | **Imagen `og:image` 1200×630** | No se puso una de relleno a propósito |
| 9 | **Resultados y testimonios verificables** | 26 casos sin un solo dato duro |

### Variables a cargar en Cloudflare
`pagina-dofi → Settings → Variables and Secrets`

```bash
CONTACT_WEBHOOK_URL          # CRÍTICA — sin ella el formulario da 503
NEXT_PUBLIC_SITE_URL         # CRÍTICA — sin ella el sitio queda noindex
NEXT_PUBLIC_INSTAGRAM_URL
NEXT_PUBLIC_TIKTOK_URL
NEXT_PUBLIC_LINKEDIN_URL
SANITY_PROJECT_ID
SANITY_DATASET
CONTACT_WEBHOOK_TOKEN        # opcional
NEXT_PUBLIC_COMPANY_EMAIL    # opcional
```

⚠️ Las `NEXT_PUBLIC_*` se inyectan **en tiempo de build**: hay que volver a desplegar después de definirlas.

---

## 7. Trampas del entorno — no pierdas tiempo aquí

| Trampa | Qué pasa |
|---|---|
| **`opennextjs-cloudflare build` falla en Windows** | `fs.cpSync` no copia bien, error `ENOENT open-next.config.edge.mjs`. **Es del entorno Windows, no del código.** La propia librería avisa que no es compatible con Windows. En los servidores Linux de Cloudflare funciona. Para verificar en local usa `npm run build:next` (`next build` puro) |
| **`package.json` → `"build"`** | Debe seguir siendo `opennextjs-cloudflare build`. Cambiarlo a `next build` rompe el deploy |
| **`open-next.config.ts`** | Tiene `config.buildCommand = "npx next build"`. Sin eso hay recursión infinita (ya pasó) |
| **`wrangler.jsonc`** | **No** tiene `build.command` y no debe tenerlo: Wrangler lo ignora en proyectos OpenNext. Hay un comentario en el archivo explicándolo |
| **`next/font/google`** | Colgó el build 29 minutos. Las fuentes son locales |
| **ESLint** | **No está configurado.** `npm run lint` abre un asistente interactivo. No lo instales solo para un sprint: reporta `N/A` |
| **No existe script `typecheck`** | Usa `npx tsc --noEmit` |

---

## 8. Cómo trabaja este proyecto

- **Nunca hagas commit ni push sin que el propietario lo pida explícitamente.** Se pide con "sube los cambios" o similar.
- **Antes de cada push**, `git fetch origin` por si hay commits de otra sesión. Si diverge: `git pull --rebase`. **Nunca `--force`.**
- Se trabaja **directo sobre `main`** — es lo que dispara el deploy de Cloudflare. No crees ramas salvo que lo pidan.
- **Verifica antes de afirmar.** El estándar de este proyecto es medir en el navegador, no estimar. Hay Puppeteer disponible; Chrome está en `C:/Users/Marcelo/.cache/puppeteer/chrome/`.
- Para verificación visual: `npm run build:next` y luego `npx next start -p 3100`. El panel embebido no soporta capturas.
- **El propietario prefiere respuestas cortas y directas.** A veces pide "responde solo sí o no" — respétalo literalmente.
- **Todo en español**, incluidos los comentarios del código.
- **No inventes datos.** El proyecto tiene una regla explícita en `clients.ts`: *"Dato duro del proyecto. NO inventar"*. Aplica a métricas, logos, testimonios, handles de redes y dominios.

---

## 9. Aviso sobre los datos de clientes

`src/data/clients.ts` tiene 26 cuentas. **Los nombres son reales.** Pero **19 de las 26 tienen sector, ciudad y servicios inferidos, no confirmados** (así consta comentado en el propio archivo).

Las 12 con contexto confirmado: Proavic, Dukare, SpartaGym, Mi Escondite, BonDía, El Horno, Cuenca Tour 360, Taitico, Silvestra, El Carbonazo, Dr. Christian Jetón, Hospi Spa.

Antes de amplificar la prueba social hay que validar el resto: publicar el sector equivocado de un cliente real es peor que no publicarlo.

---

## 10. Por dónde continuar

El orden propuesto está en `audit/DOFI-DESIGN-SYSTEM-V1.md` §28. En resumen:

**Fase 0 — parar la fuga** (no depende de diseño)
1. Endpoint real para los leads
2. **Decidir el dominio** — bloquea canonical, sitemap, `og:image` e indexación
3. URLs reales de redes
4. Resolver Sanity

**Fase 1 — decidir el mensaje** (antes de diseñar nada)
5. Propuesta de valor en una frase
6. Qué se cuenta de cada marca en la home
7. Catálogo real de servicios de las tres unidades
8. **Recopilar material** — es el cuello de botella real, depende de terceros y es lo que más tarda

**Fase 2 en adelante** — el rediseño. Si el propietario quiere recuperar el trabajo ya hecho de Hero/Navbar/Logo Wall, `git revert 9e165ea` lo devuelve entero.

---

## 11. Pregúntale al propietario antes de empezar

1. **¿Por qué se revirtió el rediseño?** No quedó registrado. Sin saberlo, rehacerlo repetiría el mismo error.
2. **¿Quieres recuperar el Hero/Navbar/Logo Wall o partir de cero?**
3. **¿Cuál es el dominio definitivo?**
4. **¿Existe ya el endpoint para los leads?**

---

*Handoff generado el 21 de agosto de 2026 sobre el commit `9e165ea`. Repo y local sincronizados, árbol limpio.*
