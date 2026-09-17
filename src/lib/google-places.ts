import type { Resena } from "./marketing-digital";

/**
 * Reseñas reales de Google, via la API de Places (Place Details, campo
 * `reviews`). Fuente PRIORITARIA de la sección Reseñas: si esto devuelve
 * algo, se muestra tal cual y no se mezcla con las reseñas de Sanity (quien
 * llama decide la prioridad; este archivo solo trae los datos).
 *
 * CREDENCIALES: `GOOGLE_PLACES_API_KEY` y `GOOGLE_PLACE_ID`, SOLO en
 * variables de entorno del servidor (sin prefijo NEXT_PUBLIC_, nunca en el
 * codigo). El fetch corre en el servidor -- la key nunca llega al bundle ni
 * al navegador. Ver .env.example.
 *
 * LIMITE DE GOOGLE: Place Details devuelve como maximo 5 reseñas por
 * respuesta. No hay forma de traer mas desde esta API; si el negocio tiene
 * mas de 5 en su perfil, estas son las que Google decide mostrar.
 *
 * CACHE: los Terminos de Servicio de Google Maps Platform limitan cuanto
 * tiempo se puede conservar el contenido de Place Details. 6 horas de
 * revalidacion (Next Data Cache, mismo mecanismo que ya usa sanityQuery) es
 * un margen conservador: nunca se guarda de forma permanente en Sanity ni en
 * ningun otro lado.
 *
 * RESPALDO: sin configurar, con cualquier error de red, o si Google no
 * devuelve reseñas validas, esta funcion responde `null` -- nunca lanza --
 * para que quien llama caiga a las reseñas de Sanity sin romper la pagina.
 */

const REVALIDAR_SEGUNDOS = 60 * 60 * 6;

type ReviewGoogleRaw = {
  author_name?: string;
  author_url?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  time?: number;
  relative_time_description?: string;
};

type RespuestaPlaceDetails = {
  status?: string;
  result?: { reviews?: ReviewGoogleRaw[] };
};

function normalizar(r: ReviewGoogleRaw, i: number): Resena | null {
  const nombre = r.author_name?.trim();
  const comentario = r.text?.trim();
  if (!nombre || !comentario || typeof r.rating !== "number") return null;
  return {
    id: `google-${r.time ?? i}`,
    nombre,
    foto: r.profile_photo_url ?? null,
    empresa: "",
    estrellas: Math.min(5, Math.max(1, Math.round(r.rating))),
    comentario,
    // Google no expone un enlace directo a la reseña individual; el perfil
    // del autor es lo mas cercano a "verla en Google" que trae esta API.
    enlace: r.author_url ?? null,
    fecha: r.relative_time_description ?? null,
  };
}

export async function obtenerResenasGoogle(): Promise<Resena[] | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&language=es&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { next: { revalidate: REVALIDAR_SEGUNDOS } });
    if (!res.ok) {
      console.error(`[google-places] HTTP ${res.status} al consultar Place Details, se usa el respaldo de Sanity.`);
      return null;
    }

    const datos = (await res.json()) as RespuestaPlaceDetails;
    if (datos.status !== "OK") {
      console.error(`[google-places] Place Details respondio status "${datos.status}", se usa el respaldo de Sanity.`);
      return null;
    }

    const resenas = (datos.result?.reviews ?? [])
      .map(normalizar)
      .filter((r): r is Resena => r !== null);

    return resenas.length > 0 ? resenas : null;
  } catch (err) {
    console.error("[google-places] fetch fallo, se usa el respaldo de Sanity:", err);
    return null;
  }
}
