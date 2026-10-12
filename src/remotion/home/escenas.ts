import type { ComponentType } from "react";
import { EscenaAsesorias } from "./EscenaAsesorias";
import { EscenaCrm } from "./EscenaCrm";
import { EscenaPauta } from "./EscenaPauta";
import { EscenaRedes } from "./EscenaRedes";
import { ESCENARIO, GEOMETRIA, type ClaveEscena } from "./tema";

/**
 * Las escenas Remotion de los banners del Home, por clave. Solo lo importa el
 * reproductor (ReproductorEscena), que es el paquete diferido: el banner del
 * servidor usa tema.ts, que no trae Remotion.
 */
export type PropsEscena = { lineas: string[] };

export const ESCENAS: Record<ClaveEscena, { componente: ComponentType<PropsEscena>; ancho: number; alto: number }> = {
  redes: { componente: EscenaRedes, ancho: GEOMETRIA.redes.escena.ancho, alto: ESCENARIO.alto },
  pauta: { componente: EscenaPauta, ancho: GEOMETRIA.pauta.escena.ancho, alto: ESCENARIO.alto },
  crm: { componente: EscenaCrm, ancho: GEOMETRIA.crm.escena.ancho, alto: ESCENARIO.alto },
  asesorias: { componente: EscenaAsesorias, ancho: GEOMETRIA.asesorias.escena.ancho, alto: ESCENARIO.alto },
};
