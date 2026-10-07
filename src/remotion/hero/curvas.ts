import { Easing } from "remotion";

/**
 * Curvas y resortes de la composicion del hero. Separados de tema.ts porque
 * importan Remotion: solo los usa la composicion (paquete diferido).
 * Lineal esta prohibido para las entradas y salidas.
 */

export const curva = {
  salida: Easing.bezier(0.16, 1, 0.3, 1),
  entradaSalida: Easing.bezier(0.65, 0, 0.35, 1),
  entrada: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const resorte = {
  agil: { damping: 14, stiffness: 160, mass: 0.6 },
  suave: { damping: 20, stiffness: 90, mass: 1 },
} as const;
