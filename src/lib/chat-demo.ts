import type { IconoCategoria } from "@/lib/marketing-digital";
import { claveDeGiro, type ClaveGiro } from "@/lib/giro-tipo";

/**
 * Demos de WhatsApp de la pagina FENIAX / ChatBots-CRM.
 *
 * QUE SON: conversaciones de DEMOSTRACION -- una persona escribiendole por
 * WhatsApp a un negocio y la IA del negocio respondiendo. Se dibujan en vivo
 * con Remotion (src/remotion/feniax/ChatWhatsApp.tsx): no son videos
 * grabados, asi que cambiar un mensaje en el Studio cambia la "pelicula".
 *
 * NO SON CLIENTES REALES: el encabezado del chat dice "Tu restaurante",
 * "Tu concesionario"... a proposito. La demo muestra como atenderia la IA a
 * los clientes de ESE giro, no pretende ser la conversacion de una empresa
 * en particular (por eso no lleva nombres de negocios inventados).
 *
 * DE DONDE SALE CADA CHAT:
 *  1. Si el giro tiene su propia conversacion cargada en el Studio, esa.
 *  2. Si no, la plantilla de su tipo de negocio (PLANTILLAS, abajo), elegida
 *     por el NOMBRE del giro ("Gastronomía" -> restaurante) y, si el nombre
 *     no dice nada conocido, por su icono. Ultimo recurso: "servicios".
 *  Asi un giro nuevo creado en el Studio nunca queda sin demo.
 */

export type RemitenteChat = "cliente" | "negocio";

export type MensajeChat = {
  de: RemitenteChat;
  texto: string;
  /** URL de una foto adjunta (el plato, el auto...). Opcional. */
  imagen: string | null;
};

/** Tarjeta que cierra la demo: lo que quedo registrado en el CRM. */
export type AvisoCrm = { titulo: string; texto: string };

export type ChatDemo = {
  /** Nombre en el encabezado del chat: "Tu restaurante". */
  negocio: string;
  /** Linea bajo el nombre cuando nadie escribe: "en línea". */
  estado: string;
  /** Foto de perfil del negocio. Sin foto, un circulo con el icono del giro. */
  avatar: string | null;
  icono: IconoCategoria | "feniax" | null;
  mensajes: MensajeChat[];
  aviso: AvisoCrm | null;
};

const c = (texto: string, imagen: string | null = null): MensajeChat => ({ de: "cliente", texto, imagen });
const n = (texto: string, imagen: string | null = null): MensajeChat => ({ de: "negocio", texto, imagen });

const FOTO = (nombre: string) => `/feniax/demo/${nombre}.jpg`;

/** Claves de plantilla. Mas finas que los iconos del Studio: "Fitness, salud
 *  y belleza" es un icono, pero un gimnasio y un consultorio no conversan
 *  igual. Salen del resolvedor compartido (giro-tipo.ts); "construccion" no
 *  tiene chat propio y usa el de inmobiliaria. */
export type ClavePlantilla = Exclude<ClaveGiro, "construccion">;

export const PLANTILLAS: Record<ClavePlantilla, ChatDemo> = {
  restaurante: {
    negocio: "Tu restaurante",
    estado: "en línea",
    avatar: null,
    icono: "gastronomia",
    mensajes: [
      c("Hola 👋 ¿tienen mesa para 4 personas hoy a las 8 pm?"),
      n("¡Hola! Sí, tenemos disponibilidad a las 8:00 pm para 4 personas 🙌 ¿A nombre de quién hago la reserva?"),
      c("A nombre de Andrea. ¿Qué me recomiendas?"),
      n(
        "¡Listo, Andrea! Tu mesa quedó reservada ✅ El plato estrella de la semana es el lomo a la parrilla con papas rústicas y chimichurri.",
        FOTO("gastronomia")
      ),
      c("Se ve increíble 😍 ¿Tienen opciones vegetarianas?"),
      n("¡Claro! Risotto de hongos y bowl de quinua. ¿Te envío un recordatorio una hora antes de tu reserva?"),
      c("Sí, porfa 🙏"),
      n("Hecho. Te escribo a las 7:00 pm. ¡Te esperamos! 🍽️"),
    ],
    aviso: { titulo: "Reserva registrada", texto: "Andrea · 4 personas · Hoy 20:00" },
  },
  autos: {
    negocio: "Tu concesionario",
    estado: "en línea",
    avatar: null,
    icono: "automotriz",
    mensajes: [
      c("Buenas, me interesa la SUV que publicaron en Instagram"),
      n("¡Hola! Gracias por escribirnos 🚗 ¿Es esta, la SUV 2025 color grafito?", FOTO("automotriz")),
      c("Esa misma. ¿Cuál es el precio y tienen crédito?"),
      n("Tenemos crédito directo con entrada desde el 20% y plazos de hasta 60 meses. ¿Te gustaría agendar una prueba de manejo?"),
      c("Sí, ¿el sábado en la mañana?"),
      n("Perfecto: sábado 10:00 am en nuestra sala de exhibición ✅ ¿Me compartes tu nombre completo?"),
      c("Carlos Mendoza"),
      n("¡Gracias, Carlos! Un asesor te confirmará por aquí. ¡Te esperamos el sábado! 🙌"),
    ],
    aviso: { titulo: "Prueba de manejo agendada", texto: "Carlos Mendoza · Sábado 10:00" },
  },
  inmobiliaria: {
    negocio: "Tu inmobiliaria",
    estado: "en línea",
    avatar: null,
    icono: "inmobiliaria",
    mensajes: [
      c("Hola, vi el proyecto de departamentos. ¿Todavía hay disponibles?"),
      n("¡Hola! Sí 🏡 Quedan unidades de 2 y 3 dormitorios con vista a la ciudad.", FOTO("inmobiliaria")),
      c("¿El de 3 dormitorios tiene parqueadero?"),
      n("Sí, incluye parqueadero y bodega. ¿Te gustaría visitar el departamento modelo esta semana?"),
      c("El jueves por la tarde"),
      n("Agendado: jueves 16:00 ✅ Te envío la ubicación y la ficha técnica por aquí 📎"),
    ],
    aviso: { titulo: "Visita agendada", texto: "Departamento 3 dormitorios · Jueves 16:00" },
  },
  fitness: {
    negocio: "Tu gimnasio",
    estado: "en línea",
    avatar: null,
    icono: "belleza",
    mensajes: [
      c("Hola, ¿cuánto cuesta la mensualidad?"),
      n("¡Hola! 💪 La mensualidad incluye máquinas y todas las clases grupales. ¿Qué te gustaría entrenar?"),
      c("¿Tienen clases de spinning en la noche?"),
      n("Sí: lunes, miércoles y viernes a las 19:00 y 20:00. ¿Te reservo una clase de prueba?", FOTO("fitness")),
      c("Sí, el miércoles a las 7"),
      n("¡Listo! Clase de prueba el miércoles 19:00 ✅ Trae ropa cómoda y agua. ¡Nos vemos!"),
    ],
    aviso: { titulo: "Clase de prueba reservada", texto: "Spinning · Miércoles 19:00" },
  },
  belleza: {
    negocio: "Tu salón de belleza",
    estado: "en línea",
    avatar: null,
    icono: "belleza",
    mensajes: [
      c("¡Hola! ¿Tienen turno para manicure mañana?"),
      n("¡Hola! 💅 Mañana tenemos espacio a las 11:00 y a las 15:30. ¿Cuál prefieres?"),
      c("15:30 porfa. ¿Hacen semipermanente?"),
      n("¡Sí! Y esta semana, si agregas pedicure, tienes precio especial en el combo ✨", FOTO("belleza")),
      c("Me animo con el combo"),
      n("¡Genial! Tu cita quedó para mañana 15:30 ✅ Te recordaré 2 horas antes."),
    ],
    aviso: { titulo: "Cita confirmada", texto: "Combo manicure + pedicure · Mañana 15:30" },
  },
  salud: {
    negocio: "Tu consultorio",
    estado: "en línea",
    avatar: null,
    icono: "salud",
    mensajes: [
      c("Buenas tardes, quisiera una cita con el odontólogo"),
      n("¡Buenas tardes! 🦷 Tenemos el lunes a las 9:00 o a las 17:00. ¿Es para limpieza, revisión o una molestia?"),
      c("Limpieza. El lunes a las 5"),
      n("Perfecto, lunes 17:00 ✅ ¿Me confirmas tu nombre completo?"),
      c("María José Ortega"),
      n("Gracias, María José. Te enviaré un recordatorio el domingo. ¡Lindo día!"),
    ],
    aviso: { titulo: "Cita médica agendada", texto: "María José Ortega · Lunes 17:00" },
  },
  retail: {
    negocio: "Tu tienda",
    estado: "en línea",
    avatar: null,
    icono: "comercio",
    mensajes: [
      c("Hola, ¿tienen estos en talla 38?", FOTO("retail")),
      n("¡Hola! Sí, nos quedan en talla 38 👟 ¿Los quieres para retirar en tienda o con envío?"),
      c("Con envío. ¿Llegan a Quito?"),
      n("¡Sí! Enviamos a todo el país en 24 a 48 horas. Te dejo el enlace de pago seguro 💳"),
      c("Listo, ya pagué"),
      n("¡Pago recibido! ✅ Tu pedido sale hoy y te comparto la guía de rastreo apenas esté lista 📦"),
    ],
    aviso: { titulo: "Venta cerrada", texto: "Pedido con envío a Quito · Pagado" },
  },
  educacion: {
    negocio: "Tu academia",
    estado: "en línea",
    avatar: null,
    icono: "educacion",
    mensajes: [
      c("Hola, ¿cuándo empieza el próximo curso de inglés?"),
      n("¡Hola! 📚 El próximo nivel inicia el lunes, con horarios de 7:00, 18:00 y sábados."),
      c("¿Es presencial?"),
      n("Puedes elegir presencial u online, con el mismo docente y material 🎓", FOTO("educacion")),
      c("Me interesa el de las 18:00 online"),
      n("¡Excelente elección! Te envío el formulario de inscripción por aquí ✅ ¿Tienes alguna otra duda?"),
    ],
    aviso: { titulo: "Inscripción en curso", texto: "Inglés online · Horario 18:00" },
  },
  turismo: {
    negocio: "Tu agencia de viajes",
    estado: "en línea",
    avatar: null,
    icono: "turismo",
    mensajes: [
      c("Hola, ¿tienen paquetes para Galápagos en diciembre?"),
      n("¡Hola! 🌊 Sí: 4 días y 3 noches con vuelos, hotel y tours incluidos.", FOTO("turismo")),
      c("Somos 2 adultos. ¿Qué fechas tienen?"),
      n("Hay salidas el 6, 13 y 20 de diciembre. ¿Te separo cupos para alguna fecha?"),
      c("El 13 porfa"),
      n("¡Hecho! Cupos separados para el 13 de diciembre ✅ Te envío el itinerario y las formas de pago 📎"),
    ],
    aviso: { titulo: "Cupos separados", texto: "Galápagos · 2 adultos · 13 de diciembre" },
  },
  tecnologia: {
    negocio: "Tu empresa de tecnología",
    estado: "en línea",
    avatar: null,
    icono: "tecnologia",
    mensajes: [
      c("Hola, necesito soporte para mi sistema de facturación"),
      n("¡Hola! 💻 Claro que sí. ¿Me cuentas qué está pasando y desde cuándo?"),
      c("No me deja emitir facturas desde esta mañana"),
      n("Gracias por el detalle. Abrí tu caso y ya lo tiene un técnico ✅ Te escribimos en menos de una hora."),
    ],
    aviso: { titulo: "Ticket de soporte creado", texto: "Facturación · Prioridad alta" },
  },
  servicios: {
    negocio: "Tu empresa",
    estado: "en línea",
    avatar: null,
    icono: "servicios",
    mensajes: [
      c("Hola, quisiera información de sus servicios"),
      n("¡Hola! Con gusto 😊 ¿Me cuentas qué necesitas y para qué tipo de empresa?"),
      c("Necesito una cotización para mi negocio"),
      n("Perfecto. Te hago 3 preguntas rápidas y te envío la cotización hoy mismo. ¿Cuántas personas trabajan contigo?"),
      c("Somos 12"),
      n("¡Gracias! Un asesor te enviará la propuesta personalizada hoy mismo ✅"),
    ],
    aviso: { titulo: "Nuevo lead calificado", texto: "Cotización · 12 colaboradores" },
  },
};

export function plantillaParaGiro(nombre: string, icono: IconoCategoria | null): ChatDemo {
  const clave = claveDeGiro(nombre, icono);
  const base = PLANTILLAS[clave === "construccion" ? "inmobiliaria" : clave];
  // El icono del giro manda en el avatar (es el que el editor eligio).
  return icono ? { ...base, icono } : base;
}
