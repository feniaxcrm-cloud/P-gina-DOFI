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
 * IMPORTANTE: no borrar esta linea.
 *
 * El script "build" de package.json es "opennextjs-cloudflare build" a
 * proposito: Cloudflare corre ese comando (o "npm run build", que apunta a
 * lo mismo) para producir la carpeta .open-next completa. Sin eso, el paso
 * de deploy falla con "Could not find compiled Open Next config" porque
 * nunca se genero .open-next (esto paso: era el error original).
 *
 * Pero por dentro, "opennextjs-cloudflare build" compila el Next.js
 * ejecutando `npm run build` como sub-paso (ver @opennextjs/aws
 * buildNextApp.js). Si esa linea de abajo no estuviera, ese sub-paso
 * volveria a resolver a "opennextjs-cloudflare build" (porque es lo que dice
 * el script "build"), y el proceso se llamaria a si mismo sin parar hasta
 * que Cloudflare mata el build por timeout (~29 min) sin compilar nada.
 * Tambien paso, una vez.
 *
 * Esta linea rompe ese ciclo: fija el comando de compilacion interno
 * directo a "next build", saltandose el script "build" de package.json.
 * Los dos problemas solo se evitan a la vez con AMBAS piezas en su lugar:
 * el script "build" apuntando a opennextjs-cloudflare build, Y esta linea.
 */
config.buildCommand = "npx next build";

export default config;
