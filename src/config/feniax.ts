/**
 * Identidad de FENIAX, tomada textual del BRANDBOOK FENIAX (sección 01,
 * "Esencia de la marca"). Son datos de MARCA -- como los datos corporativos
 * de company.ts --, no copy de una página: por eso viven en código y no en
 * el Studio. Si el brandbook cambia, se cambian acá.
 */

export const VALORES_FENIAX = [
  { clave: "innovacion", nombre: "Innovación continua", lema: "Impulsamos el cambio constante." },
  { clave: "eficiencia", nombre: "Eficiencia", lema: "Optimizamos cada proceso." },
  { clave: "resurgimiento", nombre: "Resurgimiento", lema: "Transformamos negocios para su crecimiento." },
  { clave: "adaptabilidad", nombre: "Adaptabilidad", lema: "Nos ajustamos a cada necesidad." },
  { clave: "confianza", nombre: "Confianza", lema: "Somos un aliado seguro y transparente." },
  { clave: "compromiso", nombre: "Compromiso", lema: "Dedicación total a cada cliente." },
] as const;

export type ClaveValor = (typeof VALORES_FENIAX)[number]["clave"];

/** Archivos de marca en /public/feniax (vectorizados del brandbook). */
export const LOGOS_FENIAX = {
  /** Letras moradas + "IA" en degradado: sobre fondo claro. */
  color: "/feniax/feniax-logo-color.svg",
  /** Letras blancas + "IA" en degradado: sobre fondo oscuro (portada del brandbook). */
  negativo: "/feniax/feniax-logo-negativo.svg",
  /** El isotipo solo: la "IA" con el fénix. */
  isotipo: "/feniax/feniax-isotipo.svg",
  /** Proporción del logotipo completo (ancho / alto). */
  proporcion: 283.7 / 65,
} as const;
