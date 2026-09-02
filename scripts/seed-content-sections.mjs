/**
 * Carga (una sola vez) las 4 "Secciones de contenido" en Sanity con el
 * MISMO texto que ya usa el respaldo del codigo (SECCIONES_CONTENIDO_FALLBACK
 * en src/lib/sanity.ts) -- cero cambio visual en la web, el unico efecto es
 * que ese contenido pasa a existir de verdad en Sanity y el usuario tiene
 * algo real para editar en el Studio (antes el campo estaba vacio: la web
 * solo mostraba el respaldo del codigo, nunca hubo nada guardado).
 *
 * A proposito SIN imagen (el schema la pide, pero no bloquea un patch por
 * API aunque falte -- ver normalizarSeccionesContenido() en sanity.ts): el
 * usuario todavia no tiene fotos reales, y no corresponde ponerle una
 * imagen sintetica de prueba a contenido que va a quedar permanente. El
 * Studio va a mostrar un aviso de "falta la imagen" en cada seccion, como
 * recordatorio.
 *
 * Uso: node --env-file=.env.local scripts/seed-content-sections.mjs
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

// Mismo texto exacto que SECCIONES_CONTENIDO_FALLBACK en src/lib/sanity.ts.
const seccionesContenido = [1, 2, 3, 4].map((n) => ({
  _type: "seccionContenido",
  titulo: `Sección 0${n}`,
  descripcion: "Contenido de esta sección...",
  ctaTexto: "Conocer más",
  ctaEnlace: "/contactanos",
  // imagen / imagenAlt: sin cargar a proposito, ver comentario arriba.
}));

const doc = await client
  .patch("paginaInicio")
  .set({ seccionesContenido })
  .commit({ autoGenerateArrayKeys: true });

console.log("paginaInicio.seccionesContenido cargado con 4 items editables. rev:", doc._rev);
