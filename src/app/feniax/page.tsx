import { permanentRedirect } from "next/navigation";

/**
 * /feniax era un "Página en construcción". La página de FENIAX ya existe y
 * vive en /chatbots-crm (la ruta del menú "ChatBots / CRM"): esta ruta
 * redirige ahí en vez de tener dos URL con el mismo contenido.
 */
export default function FeniaxPage() {
  permanentRedirect("/chatbots-crm");
}
