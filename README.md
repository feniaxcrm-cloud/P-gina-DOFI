# DOFI Agencia Creativa

Sitio de una sola pagina para DOFI (creatividad y produccion), FENIAX (CRM y
automatizacion) y Daniel Vallejo, El Socio.

Next.js 15 (App Router) + Tailwind v4 + Motion. Tema oscuro unico, acento
naranja unico, sin dependencias de imagen externas.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # verificacion de tipos + build de produccion
```

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

Todo en `src/data/clients.ts`. Cada cuenta lleva nombre, sector, resumen,
servicios y una lista de videos, y alimenta dos cosas a la vez:

- la **galería** de la home (sección Clientes),
- su **página individual** en `/clientes/<slug>` (generada sola por cada
  cuenta que exista en el arreglo).

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

No hay variables de entorno todavia. Cuando conectes el formulario a un servicio
real, agregalas en el panel de Vercel y leelas desde el route handler.

## Accesibilidad y rendimiento

- Todo el texto pasa contraste WCAG AA sobre su fondo.
- Cada animacion respeta `prefers-reduced-motion`.
- El canvas del hero pausa su bucle cuando sale de pantalla o la pestana se
  oculta.
