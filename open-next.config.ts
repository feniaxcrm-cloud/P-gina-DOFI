import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Configuracion de OpenNext para Cloudflare Workers.
 *
 * Con los valores por defecto basta para desplegar este sitio: SSG, la ruta
 * dinamica /clientes/[slug] y el endpoint /api/contacto. Si mas adelante se
 * necesita cache incremental (ISR) o cola de revalidacion, se configuran aqui.
 */
const config = defineCloudflareConfig();

/**
 * IMPORTANTE: no borrar ni cambiar esta linea.
 *
 * Por dentro, "opennextjs-cloudflare build" compila el sitio Next.js
 * ejecutando `npm run build` como sub-paso (ver @opennextjs/aws
 * buildNextApp.js). Si el script "build" de package.json alguna vez vuelve
 * a apuntar a "opennextjs-cloudflare build" (en vez de "next build"), ese
 * sub-paso se llama a si mismo sin parar hasta que Cloudflare mata el build
 * por timeout (~29 min) sin haber compilado nada. Ya paso una vez.
 *
 * Esta linea fija el comando de compilacion directo a "next build",
 * saltandose el script "build" de package.json por completo. Con esto el
 * ciclo no puede repetirse aunque alguien cambie ese script en el futuro.
 */
config.buildCommand = "npx next build";

export default config;
