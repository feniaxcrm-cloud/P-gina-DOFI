import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Configuracion de OpenNext para Cloudflare Workers.
 *
 * Con los valores por defecto basta para desplegar este sitio: SSG, la ruta
 * dinamica /clientes/[slug] y el endpoint /api/contacto. Si mas adelante se
 * necesita cache incremental (ISR) o cola de revalidacion, se configuran aqui.
 */
export default defineCloudflareConfig();
