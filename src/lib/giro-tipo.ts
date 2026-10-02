import type { IconoCategoria } from "@/lib/marketing-digital";

/**
 * A que TIPO de negocio corresponde un giro del carrusel de Clientes.
 *
 * Los giros los crea el equipo en el Studio con el nombre que quiera
 * ("Gastronomía", "Fitness, salud y belleza", "Constructoras"...). Las demos
 * de Clientes (la conversacion de WhatsApp de FENIAX, el panel de metricas de
 * Meta Ads de Trafico/Ads) necesitan saber que tipo de negocio es para tener
 * algo con sentido que mostrar sin que nadie lo configure giro por giro.
 *
 * Aca esta la unica regla de esa interpretacion, compartida por las dos demos:
 *  1. Por el NOMBRE del giro (la primera coincidencia de POR_NOMBRE).
 *  2. Si el nombre no dice nada conocido, por su ICONO.
 *  3. Ultimo recurso: "servicios".
 */

export type ClaveGiro =
  | "restaurante"
  | "autos"
  | "construccion"
  | "inmobiliaria"
  | "fitness"
  | "belleza"
  | "salud"
  | "retail"
  | "educacion"
  | "turismo"
  | "tecnologia"
  | "servicios";

/** Palabras del NOMBRE del giro -> tipo. El orden importa: "Fitness, salud y
 *  belleza" cae en fitness porque aparece primero en esta lista, y
 *  "Educación y Servicios" en educacion porque va antes que servicios. */
const POR_NOMBRE: Array<[RegExp, ClaveGiro]> = [
  [/gastr|restaur|comida|cafe|caf[eé]|bar\b|pizz|cocina|aliment/i, "restaurante"],
  [/auto|carro|veh[ií]c|moto|concesion|llanta|taller/i, "autos"],
  [/constru|arquitect/i, "construccion"],
  [/inmobil|bienes ra|departament|vivienda/i, "inmobiliaria"],
  [/fitness|gym|gimnas|crossfit|deport|entrena/i, "fitness"],
  [/belleza|spa|est[eé]tic|sal[oó]n|u[ñn]as|barber/i, "belleza"],
  [/salud|cl[ií]nic|m[eé]dic|odonto|dental|farmac|consult/i, "salud"],
  [/retail|tienda|comercio|ropa|moda|calzado|boutique|e-?commerce/i, "retail"],
  [/educa|curso|academ|escuela|colegio|capacita|idioma/i, "educacion"],
  [/turis|viaj|hotel|hosped|tour/i, "turismo"],
  [/tecno|software|digital|sistemas|inform[aá]t/i, "tecnologia"],
  [/servicio|profesional|consult|asesor/i, "servicios"],
];

const POR_ICONO: Record<IconoCategoria, ClaveGiro> = {
  construccion: "construccion",
  belleza: "belleza",
  servicios: "servicios",
  comercio: "retail",
  emprendedores: "servicios",
  salud: "salud",
  gastronomia: "restaurante",
  tecnologia: "tecnologia",
  automotriz: "autos",
  inmobiliaria: "inmobiliaria",
  educacion: "educacion",
  turismo: "turismo",
};

export function claveDeGiro(nombre: string, icono: IconoCategoria | null): ClaveGiro {
  const porNombre = POR_NOMBRE.find(([patron]) => patron.test(nombre))?.[1];
  return porNombre ?? (icono ? POR_ICONO[icono] : null) ?? "servicios";
}
