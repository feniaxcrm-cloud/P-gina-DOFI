import { createWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Textos de la pagina FENIAX cuando Sanity todavia no tiene secciones
 * activas. Salen del BRANDBOOK FENIAX (mision, "Somos más que un software",
 * las preguntas de las piezas de campaña: "¿Demasiados mensajes, pocas
 * ventas?", "Tus ventas renacen", "Renace tu manera de vender") y de lo que
 * el sitio ya dice de FENIAX (CRM, automatizacion, IA aplicada a ventas).
 *
 * UNA SOLA FUENTE: los usa src/lib/feniax.ts (respaldo de la pagina) y
 * scripts/sembrar-feniax.mts (los carga en el Studio para que se editen
 * ahi). Datos planos, sin dependencias de Next.
 */

/** El CTA principal abre WhatsApp con el mensaje ya escrito. */
export const WHATSAPP_FENIAX = createWhatsAppUrl({ message: "Hola, quiero integrar un CRM en mi empresa" });

/** TODOS los botones de la pagina dicen lo mismo (pedido del 2026-10-01). */
export const TEXTO_CTA_FENIAX = "Quiero mejorar mis ventas";

const CTA_WHATSAPP = { texto: TEXTO_CTA_FENIAX, enlace: WHATSAPP_FENIAX };

export const COPY_FENIAX = {
  portada: {
    subtitulo: "CRM con IA · Ventas inteligentes",
    titulo: "Renace tu manera de vender",
    descripcion:
      "Conectamos tu WhatsApp, Instagram y Facebook a un CRM con inteligencia artificial que responde al instante, ordena cada conversación y le da seguimiento a cada cliente.",
    destacado: "Tus ventas renacen con IA.",
    cta: CTA_WHATSAPP,
  },
  queEs: {
    subtitulo: "Ventas inteligentes",
    titulo: "¿Qué es FENIAX?",
    descripcion:
      "Renovamos la eficiencia comercial digital de empresas de todo sector con herramientas de inteligencia artificial que optimizan su flujo de ventas y aportan crecimiento continuo.\n\nSomos más que un software: te acompañamos con estrategia y atención personalizada para que tu empresa renazca en el mercado actual.",
    destacado: "Somos más que un software.",
  },
  editorial: {
    subtitulo: "¿Te suena familiar?",
    titulo: "¿Demasiados mensajes, pocas ventas?",
    descripcion:
      "Clientes que preguntan y nadie responde a tiempo. Prospectos sin seguimiento. Vendedores sin control. Redes llenas de mensajes que no se convierten en ventas.\n\nFENIAX une todos tus canales en un solo CRM con IA: cada mensaje recibe respuesta en segundos, cada prospecto entra a tu embudo y tú ves en tiempo real lo que vende tu equipo.",
    destacado: "Tus ventas renacen.",
  },
  metodo: {
    titulo: "Método FENIAX en 5 pasos",
    descripcion: "De la primera conversación a la venta cerrada, con un sistema que trabaja por ti las 24 horas.",
    destacado: "Ventas Inteligentes",
    cta: CTA_WHATSAPP,
    pasos: [
      { titulo: "Diagnóstico comercial", descripcion: "Analizamos cómo llegan, se atienden y se cierran tus ventas hoy." },
      { titulo: "Integración de canales", descripcion: "WhatsApp, Instagram, Facebook y tu web en un solo CRM." },
      { titulo: "Entrenamiento de tu IA", descripcion: "Tu asistente aprende tus productos, precios y forma de atender." },
      { titulo: "Automatización y seguimiento", descripcion: "Embudos y recordatorios para que ningún prospecto se enfríe." },
      { titulo: "Control y optimización", descripcion: "Reportes en tiempo real de tu equipo y de tus ventas." },
    ],
  },
  clientes: {
    titulo: "Clientes y casos de éxito",
    descripcion: "Elige un giro de negocio y mira cómo la IA de FENIAX atiende a sus clientes por WhatsApp.",
  },
  resenas: { titulo: "Reseñas en Google" },
  cierre: {
    titulo: "¿Listo para que tus ventas renazcan?",
    descripcion: "Escríbenos y descubre cómo FENIAX convierte tus conversaciones en ventas.",
    cta: CTA_WHATSAPP,
  },
} as const;
