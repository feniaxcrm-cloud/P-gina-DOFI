import { Easing } from "remotion";

/**
 * Curvas y resortes de las composiciones FENIAX. Separados de tema.ts porque
 * importan Remotion: solo los usa la composicion (paquete diferido).
 */

/** Curvas. Lineal esta prohibido. */
export const curva = {
  salida: Easing.bezier(0.16, 1, 0.3, 1),
  entradaSalida: Easing.bezier(0.83, 0, 0.17, 1),
  entrada: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const resorte = {
  agil: { damping: 14, stiffness: 160, mass: 0.6 },
  suave: { damping: 20, stiffness: 90, mass: 1 },
  rebote: { damping: 11, stiffness: 170, mass: 0.7 },
} as const;
