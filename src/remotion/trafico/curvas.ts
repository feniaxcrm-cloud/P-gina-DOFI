import { Easing } from "remotion";

/**
 * Curvas y resortes del panel de Meta Ads. Separados de tema.ts porque
 * importan Remotion: solo los usa la composicion (paquete diferido).
 * Lineal esta prohibido para las entradas y salidas. El eje de los dias SI es
 * lineal (ver diaEn en PanelMeta.tsx): es tiempo, no movimiento.
 */

export const curva = {
  entrada: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const resorte = {
  suave: { damping: 20, stiffness: 90, mass: 1 },
  agil: { damping: 14, stiffness: 160, mass: 0.6 },
} as const;
