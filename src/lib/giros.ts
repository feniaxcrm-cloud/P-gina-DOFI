import { IMG, LOGO, ICONOS_CATEGORIA, t, type IconoCategoria } from "@/lib/marketing-digital";

/**
 * Lo que comparten las paginas con un carrusel de giros de negocio
 * (Marketing Digital, FENIAX, Tráfico/Ads): el fragmento GROQ que trae un
 * giro con sus empresas y logos, y la lectura de su icono. La normalizacion
 * en si (empresas, logos, Cuentas apagadas) es normalizarGiros, de
 * marketing-digital.ts.
 */

/** Un giro del Studio: nombre, icono, foto y sus empresas (Cuentas enlazadas
 *  o empresas con logo propio). Cada pagina le agrega lo suyo (la
 *  conversacion de WhatsApp, las metricas de Meta). */
export const GIRO_GROQ = `_key, nombre, icono,
  "imagen": imagen{ ${IMG} },
  "empresas": empresas[]{
    _key,
    defined(_ref) => @->{ nombre, activa, ${LOGO} },
    !defined(_ref) => { nombre, ${LOGO} }
  }`;

export function iconoDe(v: string | null | undefined): IconoCategoria | null {
  return (ICONOS_CATEGORIA as readonly string[]).includes(t(v)) ? (t(v) as IconoCategoria) : null;
}
