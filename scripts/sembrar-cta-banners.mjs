/**
 * Siembra el CTA de los 4 banners de la home (Sprint "CTA sobre los
 * banners"). De un solo uso: despues de esto, texto, enlace y posicion se
 * editan desde el Studio.
 *
 * Los campos nuevos por banner son:
 *   ctaTexto, ctaEnlace, ctaPosicionDesktop{horizontal,vertical},
 *   ctaPosicionMobile{horizontal,vertical}
 *
 * DE DONDE SALEN ESTOS VALORES
 * ---------------------------------------------------------------
 * - Texto y enlace: del contenido que ya existia antes de que los banners
 *   pasaran a ser imagen pura, respaldado en
 *   audit/backup-secciones-contenido-2026-09-08.json. Las URLs eran
 *   absolutas al dominio de staging (pagina-dofi.feniax-crm.workers.dev);
 *   aca quedan como rutas internas ("/marketing-digital"), que es lo mismo
 *   pero navega del lado del cliente y no se rompe si cambia el dominio.
 * - Posiciones: se midio la ocupacion visual de cada pieza (energia de
 *   bordes por region) y se eligio, en cada una, el hueco real mas grande
 *   que no pisa titulares, rostros ni logos. Ver audit/CTA-BANNERS-
 *   RESULTADOS.md para el detalle banner por banner.
 *
 * NO toca backgroundImage ni backgroundImageAlt: reescribe el arreglo
 * completo en una sola operacion atomica (para no perder el _key de cada
 * item, que es lo que mantiene el orden 01/02/03/04) pero copiando esos dos
 * campos tal cual vienen.
 *
 * Uso: node --env-file=.env.local scripts/sembrar-cta-banners.mjs [--aplicar]
 * Sin --aplicar solo muestra que haria (dry run).
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

/** Un CTA por banner, en el orden en que aparecen en la pagina. */
const CTAS = [
  {
    banner: "01 · Redes Sociales que SÍ VENDEN",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/marketing-digital",
    // El titular ocupa arriba a la izquierda y los iconos de redes bajan
    // hasta el pie; el hueco esta a la derecha del racimo de iconos, antes
    // de que empiece la chapa "LO COMPRUEBAN".
    ctaPosicionDesktop: { horizontal: "centro-izquierda", vertical: "abajo" },
    ctaPosicionMobile: { horizontal: "centro-izquierda", vertical: "abajo" },
  },
  {
    banner: "02 · PAUTA INTELIGENTE = VENTAS INTELIGENTES",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/trafico-ads",
    // Queda justo debajo de "VENTAS INTELIGENTES", sobre el blanco limpio
    // que separa el titular del icono de Claude: acompaña al mensaje en vez
    // de competir con el.
    ctaPosicionDesktop: { horizontal: "derecha", vertical: "centro" },
    ctaPosicionMobile: { horizontal: "derecha", vertical: "abajo" },
  },
  {
    banner: "03 · con RESPUESTAS RÁPIDAS hay CLIENTES FELICES",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/chatbots-crm",
    // Pasillo oscuro entre el diagrama de herramientas (izquierda) y la
    // chapa "ES DINERO" (derecha). Abajo a la izquierda no entra: ahi estan
    // los iconos de n8n y del CRM.
    ctaPosicionDesktop: { horizontal: "centro", vertical: "abajo" },
    ctaPosicionMobile: { horizontal: "centro-izquierda", vertical: "abajo" },
  },
  {
    banner: "04 · ASESORÍAS UNO A UNO",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/asesorias",
    // Es el unico banner con medio lienzo libre. El boton se apoya en ese
    // morado vacio, a media altura, lejos de la persona y de las dos chapas.
    ctaPosicionDesktop: { horizontal: "centro-derecha", vertical: "centro" },
    ctaPosicionMobile: { horizontal: "centro-derecha", vertical: "centro" },
  },
];

const aplicar = process.argv.includes("--aplicar");
const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const doc = await client.getDocument("paginaInicio");
const actuales = doc?.seccionesContenido ?? [];

if (actuales.length !== CTAS.length) {
  console.error(
    `Se esperaban ${CTAS.length} banners en paginaInicio.seccionesContenido y hay ${actuales.length}.\n` +
      "Este script asigna cada CTA por posicion en el arreglo, asi que no corre a ciegas si la cantidad no coincide."
  );
  process.exit(1);
}

const conCta = actuales.map((item, i) => ({
  _type: "seccionContenido",
  _key: item._key,
  backgroundImage: item.backgroundImage,
  backgroundImageAlt: item.backgroundImageAlt,
  ctaTexto: CTAS[i].ctaTexto,
  ctaEnlace: CTAS[i].ctaEnlace,
  ctaPosicionDesktop: { _type: "posicionCta", ...CTAS[i].ctaPosicionDesktop },
  ctaPosicionMobile: { _type: "posicionCta", ...CTAS[i].ctaPosicionMobile },
}));

console.log(`${conCta.length} banners:\n`);
conCta.forEach((b, i) => {
  const d = b.ctaPosicionDesktop;
  const m = b.ctaPosicionMobile;
  console.log(`  ${CTAS[i].banner}`);
  console.log(`      imagen se conserva : ${b.backgroundImage?.asset?._ref ?? "(sin imagen)"}`);
  console.log(`      boton              : "${b.ctaTexto}" -> ${b.ctaEnlace}`);
  console.log(`      desktop            : ${d.horizontal} / ${d.vertical}`);
  console.log(`      mobile             : ${m.horizontal} / ${m.vertical}\n`);
});

if (!aplicar) {
  console.log("Dry run. Volve a correrlo con --aplicar para escribir en Sanity.");
  process.exit(0);
}

const res = await client.patch("paginaInicio").set({ seccionesContenido: conCta }).commit();
console.log("Sembrado. rev:", res._rev);
