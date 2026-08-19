# DOFI Agencia Creativa

Sitio de una sola pagina para DOFI (creatividad y produccion), FENIAX (CRM y
automatizacion) y Daniel Vallejo, El Socio.

Next.js 15 (App Router) + Tailwind v4 + Motion. Tema oscuro unico, acento
naranja unico, sin dependencias de imagen externas.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build completo: Next.js + empaquetado para Cloudflare Workers
npm run build:next # solo build de Next.js, sin el paso de Cloudflare (para probar rapido)
```

## Despliegue en Cloudflare Workers

El despliegue es via OpenNext. La configuracion vive en `wrangler.jsonc` y
`open-next.config.ts`.

**Importante, configuracion requerida en el dashboard de Cloudflare**
(pagina-dofi → Settings → Build):

- **Deploy command:** `npm run cf:deploy`

Cloudflare corre el "Build command" y el "Deploy command" como dos fases que
NO comparten el `.open-next` que genera el build (se probo: build termina
bien, pero el deploy no encuentra lo que genero). Ademas, wrangler tiene su
propia logica que detecta un proyecto OpenNext y se salta cualquier paso de
build personalizado en `wrangler.jsonc`, delegando directo a
`opennextjs-cloudflare deploy` — un comando que NO construye nada, solo
despliega lo que ya existe.

La unica combinacion que funciona es que el **Deploy command mismo** incluya
el build: `npm run cf:deploy` corre `opennextjs-cloudflare build` seguido de
`opennextjs-cloudflare deploy` en un solo proceso, asi que siempre tiene el
`.open-next` fresco disponible. El "Build command" del dashboard puede
quedar en blanco o en `npm run build`; no es lo que soluciona el error.

Ver tambien `npm run cf:preview` para probar el Worker localmente antes de
subir.

## Que vas a querer cambiar primero

### 1. El logo

Ya esta puesto el logo real. Vive en dos piezas dentro de `public/`:

| Archivo | Donde se usa | Por que |
| --- | --- | --- |
| `logo-dofi-compact.png` | Nav | Delfin + DOFi, sin el claim. En la nav el logo mide ~44px y "AGENCIA CREATIVA" seria ilegible |
| `logo-dofi.png` | Pie | Lockup completo, con el claim |

**Para cambiarlo por otro archivo** (o por el vector, cuando lo tengas):

```bash
node scripts/prepare-logo.mjs "C:/ruta/al/logo-nuevo.png"
```

El script calcula la caja real del contenido leyendo el canal alfa, detecta
solo la banda del claim para la version compacta y regenera ambas piezas.
Avisa por consola si la resolucion de origen es baja.

Para ver como queda un logo blanco sobre el fondo oscuro del sitio (no se puede
juzgar sobre fondo claro):

```bash
node scripts/preview-logo.mjs logo-dofi-compact.png
```

**Nota de calidad:** el PNG actual tiene solo 186x190 px de contenido real, asi
que se ve algo suave en pantallas grandes. Cuando consigas el vector
(SVG/AI/EPS) pasalo por el mismo script y gana nitidez.

### 2. Las imagenes

Todo lo visual vive en `public/media/` y hoy son degradados provisionales
generados con `node scripts/generate-placeholders.mjs`.

Reemplaza cada archivo **conservando el nombre y la relacion de aspecto** y no
hay que tocar codigo:

| Archivo | Proporcion | Donde sale |
| --- | --- | --- |
| `hero-oceano.jpg` | 4:5 vertical | Hero |
| `servicio-audiovisual.jpg` | 3:2 horizontal | Bento, celda grande |
| `servicio-crm.jpg` | ~8:7 | Bento, celda de CRM |
| `equipo-dofi.jpg` | 4:5 | Seccion Equipo |
| `equipo-feniax.jpg` | 4:5 | Seccion Equipo |
| `equipo-socio.jpg` | 4:5 | Seccion Equipo, Daniel Vallejo |
| `cover-16-9.jpg` | 16:9 | Portadas de video horizontal |
| `cover-9-16.jpg` | 9:16 | Portadas de video vertical |

### 3. Los clientes, sus páginas y sus videos

**El carrusel de la home (sección Clientes) se pinta con datos de Sanity**,
via `src/lib/sanity.ts` (`getClientesSanity`, un `fetch()` directo a la query
API pública — sin SDK). Lee `titulo`, `descripcion`, `imagen` y `categoria`
de cada documento `cliente` y los mapea a `name` / `summary` / `cover` /
`sector`. Si Sanity no responde (o faltan las variables de entorno), cae de
vuelta a `src/data/clients.ts` para que el carrusel nunca se quede roto ni
vacío.

Variables de entorno necesarias (ya están en Cloudflare; para local, copia
`.env.example` a `.env.local`):

```
SANITY_PROJECT_ID=
SANITY_DATASET=
```

El `_type` que se consulta es `"cliente"` — si tu Sanity Studio usa otro
nombre de documento, ajústalo en `SANITY_TYPE` al inicio de `src/lib/sanity.ts`.

**El resto de la home (menos Hero, muro de logos, Herramientas, el
carrusel de Clientes, el eslogan animado y "Cómo entra una marca") se arma
con una sola consulta a un documento `paginaInicio`**, que trae un arreglo
ordenable `secciones[]`. `page.tsx` la pinta con un `.map()` sobre un
diccionario `_type → componente` (`RENDERERS`, definido ahí mismo): **el
orden visual de esas secciones en la página es el mismo orden que tengan
en el arreglo `secciones` del Studio** — reordenarlas en Sanity reordena la
página sola, sin tocar código.

```groq
*[_type == "paginaInicio"][0]{
  titulo,
  secciones[]{
    _type,
    _type == "seccionHacemos" => { titulo, subtitulo, tarjetas[]{ titulo, descripcion } },
    _type == "seccionSocio" => { nombre, descripcion, "foto": foto.asset->url },
    _type == "seccionPilares" => { titulo, listaHerramientas[]{ nombre, icono } },
    _type == "seccionCierre" => { titulo, textoBoton, enlace }
  }
}
```

| `_type` en `secciones[]` | Campos | Se usa en | Estado |
| --- | --- | --- | --- |
| `seccionHacemos` | `titulo`, `subtitulo`, `tarjetas[]{titulo, descripcion}` | `Services.tsx` | ✅ conectado |
| `seccionSocio` | `nombre`, `descripcion`, `foto` | `Socio.tsx` + `SocioPortrait.tsx` | ✅ conectado |
| `seccionCierre` | `titulo`, `textoBoton`, `enlace` | `Contact.tsx` (etiqueta de arriba + botón de WhatsApp) | ✅ conectado |
| `seccionPilares` | `titulo`, `listaHerramientas[]{nombre, icono}` | — | ⏸️ sin componente todavía (ver más abajo) |

Notas importantes:

- **El formulario real de contacto (nombre, correo, mensaje, envío a
  `/api/contacto`) no viene de Sanity y no se tocó.** `seccionCierre` solo
  trae `titulo`/`textoBoton`/`enlace`, que se usan para la etiqueta pequeña
  arriba del formulario y el botón de WhatsApp — son, literalmente, un
  título y un botón con enlace. El título y subtítulo grandes del
  formulario siguen fijos en `Contact.tsx`.
- **`seccionCierre` ahora es parte del bloque dinámico**, igual que
  Hacemos y Socio. Antes el formulario de contacto era siempre la última
  sección antes del pie de página; ahora su posición depende del orden real
  en `secciones[]`. Si quieres que el formulario se quede al final,
  ordénalo así en el Studio.
- **`seccionPilares` todavía no tiene componente.** Se decidió no adivinar:
  el esquema (`listaHerramientas[]{nombre, icono}`) no trae el texto de
  rol/descripción que cada herramienta necesita en `Tools.tsx` ("Con qué
  trabajamos"), ni su color de marca ni el ancho de celda del bento grid.
  Mientras tanto, si esta sección llega en el arreglo, se ignora sin romper
  nada (con un aviso en consola) y `Tools.tsx` se sigue pintando fijo, con
  su contenido de siempre. Cuando definas esos campos que faltan, se puede
  conectar igual que las otras tres.
- **Hero, muro de logos, Herramientas, el carrusel de Clientes, el eslogan
  animado ("Un mar de ideas...") y "Cómo entra una marca al agua" no están
  en `secciones[]`** — no tienen todavía un tipo de documento en el Studio,
  así que `page.tsx` los sigue pintando fijos, alrededor del bloque
  dinámico (después del muro de logos, antes de Herramientas).

Mismo patrón de respaldo que Clientes: si Sanity no responde, el documento
`paginaInicio` no existe todavía, o falta alguna sección puntual, esa
sección cae de vuelta al texto que ya tenía la página — respetando el
orden real de lo que sí vino bien formado y agregando al final lo que
falte (ver `SECCIONES_FALLBACK` en `src/lib/sanity.ts`). Ninguna sección
desaparece de la página por un problema de conexión o de contenido a
medio cargar.

**La página individual en `/clientes/<slug>` sigue viniendo de
`src/data/clients.ts`**, no de Sanity — esta migración cubrió solo las
tarjetas del carrusel. Cada cuenta ahí lleva nombre, sector, resumen,
servicios y una lista de videos, y alimenta:

- la **galería** de respaldo (si Sanity falla),
- su **página individual** en `/clientes/<slug>` (generada sola por cada
  cuenta que exista en el arreglo).

Si agregas una cuenta nueva solo en Sanity (no en este archivo), su tarjeta
va a aparecer en el carrusel pero el enlace "ver más" va a dar 404 hasta que
también tenga una entrada aquí.

La página individual muestra solo las secciones que tengan contenido. Campos
opcionales por cuenta:

- `challenge` — el reto del negocio antes de entrar (1-2 párrafos)
- `approach` — qué se hizo (1-2 párrafos)
- `results` — datos duros `{ value, label }`. **No inventar**: déjalo vacío o
  comentado hasta tener los números reales del CRM. Sin datos, el bloque no
  aparece.
- `gallery` — imágenes del proyecto (rutas en /public)
- `testimonial` — `{ quote, author, role }`

La cuenta **Dukare** ya está llena como ejemplo y sirve de plantilla. Copia su
estructura al resto.

Un video acepta dos fuentes:

```ts
{ kind: "file",    src: "/videos/dukare-spot.mp4" }   // archivo en public/videos/
{ kind: "youtube", src: "dQw4w9WgXcQ" }               // solo el ID del video
```

Mientras el mp4 no exista, la pieza muestra un estado de error que nombra la
ruta exacta que falta. Es intencional, para que sea obvio que archivo subir.

Deja los mp4 en `public/videos/` y el fotograma de portada en `public/media/`.

### 4. Contacto

- El numero de WhatsApp esta en `src/components/Contact.tsx` (`wa.me/593999999999`).
- El formulario postea a `src/app/api/contacto/route.ts`, que hoy solo valida y
  escribe en el log del servidor. Ahi se conecta Kommo, un correo o un webhook
  de n8n.
- Las redes del pie estan en `src/components/Footer.tsx`.

## Desplegar en Vercel

```bash
npx vercel        # primera vez, vincula el proyecto
npx vercel --prod
```

Agrega `SANITY_PROJECT_ID` y `SANITY_DATASET` en el panel de Vercel (Settings →
Environment Variables) para que el carrusel de Clientes tambien funcione ahi.
Cuando conectes el formulario a un servicio real, agrega esas variables igual
y leelas desde el route handler.

## Accesibilidad y rendimiento

- Todo el texto pasa contraste WCAG AA sobre su fondo.
- Cada animacion respeta `prefers-reduced-motion`.
- El canvas del hero pausa su bucle cuando sale de pantalla o la pestana se
  oculta.
