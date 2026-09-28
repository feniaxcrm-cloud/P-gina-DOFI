import { sanityQuery } from "@/lib/sanity";
import {
  ALINEACIONES,
  OVERLAYS,
  IMG,
  camposBase,
  unoDe,
  bool,
  t,
  type SeccionRaw,
  type SeccionEquipo,
  type SeccionQueEs,
  type SeccionNavegacion,
  type SeccionMetodo,
  type SeccionCierre,
} from "./marketing-digital";

/**
 * Páginas de servicio (Tráfico/Ads, ChatBots/CRM, Asesorías): mismo sistema
 * que /marketing-digital -- documento singleton con `sections[]` ordenable
 * en Sanity, los mismos componentes de sección, los mismos fondos
 * decorativos -- pero SOLO con los 5 tipos que no dependen de datos
 * compartidos: Equipo, Qué es, Cómo navegamos, Método, Cierre. Clientes y
 * Reseñas se quedan exclusivos de Marketing Digital (evita cargar los
 * mismos giros de negocio a mano en cada página).
 *
 * SIN RESPALDO A PROPÓSITO: a diferencia de Marketing Digital (que partió de
 * un brief con copy real), estas 3 páginas todavía no tienen contenido
 * escrito. Con el documento sin crear o `sections[]` vacío,
 * getPaginaServicio devuelve `secciones: []` y la página muestra
 * PaginaEnConstruccion -- nunca texto inventado.
 */

export type SeccionServicio = SeccionEquipo | SeccionQueEs | SeccionNavegacion | SeccionMetodo | SeccionCierre;

export type TipoPaginaServicio = "traficoAdsPage" | "chatbotsCrmPage" | "asesoriasPage";

const QUERY_SECCIONES = `sections[]{
  _type, _key, activo, subtitulo, titulo, descripcion, destacado, animar,
  cta{ texto, enlace },
  "imagen": imagen{ ${IMG} },
  "imagenMovil": imagenMovil{ ${IMG} },
  _type in ["teamBanner", "ctaBanner"] => { alineacion, overlay },
  _type == "methodBanner" => { mostrarPasos, pasos[]{ titulo, descripcion } }
}`;

function normalizarSeccionServicio(raw: SeccionRaw): SeccionServicio | null {
  if (!raw || raw.activo === false) return null;

  switch (raw._type) {
    case "teamBanner":
    case "ctaBanner":
      return {
        ...camposBase(raw, true),
        tipo: raw._type,
        alineacion: unoDe(raw.alineacion, ALINEACIONES, raw._type === "teamBanner" ? "izquierda" : "centro"),
        overlay: unoDe(raw.overlay, OVERLAYS, "medio"),
      };
    case "aboutBanner":
    case "navigationBanner":
      return { ...camposBase(raw, false), tipo: raw._type };
    case "methodBanner":
      return {
        ...camposBase(raw, false),
        tipo: "methodBanner",
        mostrarPasos: bool(raw.mostrarPasos, true),
        pasos: (raw.pasos ?? [])
          .map((p) => ({ titulo: t(p.titulo), descripcion: t(p.descripcion) }))
          .filter((p) => p.titulo),
      };
    default:
      // clientsBanner, reviewsBanner (no forman parte de estas paginas) u
      // otro tipo que este codigo no conoce: se ignora sin romper nada.
      return null;
  }
}

export async function getPaginaServicio(tipo: TipoPaginaServicio): Promise<{ secciones: SeccionServicio[] }> {
  const respuesta = await sanityQuery<{ sections?: SeccionRaw[] | null }>(
    `*[_type == "${tipo}"][0]{ ${QUERY_SECCIONES} }`
  );
  const crudas = respuesta?.sections ?? [];

  return {
    secciones: crudas.map(normalizarSeccionServicio).filter((s): s is SeccionServicio => s !== null),
  };
}
