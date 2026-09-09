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

/** Un CTA por banner, en el orden en que aparecen en la pagina.
 *
 *  Sprint "CTA debajo del titulo": cada boton se corre a la banda que queda
 *  inmediatamente DEBAJO del titular de su pieza, y el color pasa a elegirse
 *  por banner -- ningun relleno unico destaca sobre cuatro fondos opuestos
 *  (naranja, blanco, azul casi negro y morado).
 *
 *  En mobile todos van centrados abajo: la pieza se recorta a su 37% central
 *  y el titular no llega a verse, asi que "debajo del titulo" no significa
 *  nada ahi. Centrado abajo entra siempre y no tapa el foco de la imagen. */
const CTAS = [
  {
    banner: "01 · Redes Sociales que SÍ VENDEN",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/marketing-digital",
    // Morado: el fondo de esta pieza es el mismo naranja del boton, asi que
    // el naranja desaparece. El morado DOFI es el maximo contraste posible
    // contra ese naranja sin salirse de la marca.
    ctaColor: "morado",
    // Debajo del subrayado de "SÍ VENDEN", bajado un poco mas: el ancla
    // "centro" lo dejaba pegado al titular.
    ctaPosicionDesktop: { horizontal: "izquierda", vertical: "centro", desplazamientoY: 9 },
    ctaPosicionMobile: { horizontal: "centro", vertical: "abajo" },
  },
  {
    banner: "02 · PAUTA INTELIGENTE = VENTAS INTELIGENTES",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/trafico-ads",
    ctaColor: "naranja",
    // Centrado bajo el bloque "PAUTA INTELIGENTE = / VENTAS / INTELIGENTES"
    // (su eje visual cae en el 81% del ancho) y separado de el, para que se
    // lea como el boton de ESE texto y no como algo suelto.
    ctaPosicionDesktop: { horizontal: "derecha", vertical: "centro", desplazamientoY: 6 },
    ctaPosicionMobile: { horizontal: "centro", vertical: "abajo" },
  },
  {
    banner: "03 · con RESPUESTAS RÁPIDAS hay CLIENTES FELICES",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/chatbots-crm",
    ctaColor: "naranja",
    // Mas abajo y mas a la derecha, como se pidio -- pero bastante mas de
    // "un poco": entre el 50% y el 85% de altura no hay un solo hueco donde
    // entre el boton, es todo el diagrama de herramientas (WhatsApp, GHL,
    // TikTok, n8n...). El primer espacio libre real esta por debajo de esa
    // constelacion, y ahi va.
    ctaPosicionDesktop: { horizontal: "centro-izquierda", vertical: "abajo" },
    ctaPosicionMobile: { horizontal: "centro", vertical: "abajo" },
  },
  {
    banner: "04 · ASESORÍAS UNO A UNO",
    ctaTexto: "Quiero Mejorar mis Ventas",
    ctaEnlace: "/asesorias",
    ctaColor: "naranja",
    // Arriba a la derecha. La pieza de este banner CAMBIO (ahora trae el
    // titulo "RESCATANDO EMPRENDEDORES" en el lado derecho, donde antes
    // habia morado vacio): subir el boton lo saca de encima de ese titulo y
    // lo lleva a la unica franja realmente libre que queda.
    ctaPosicionDesktop: { horizontal: "centro-derecha", vertical: "arriba", desplazamientoX: 10 },
    ctaPosicionMobile: { horizontal: "centro", vertical: "abajo" },
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
  ctaColor: CTAS[i].ctaColor,
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
  console.log(`      color              : ${b.ctaColor}`);
  const ajuste = (p) =>
    p.desplazamientoX || p.desplazamientoY
      ? `  (ajuste ${p.desplazamientoX ?? 0}% , ${p.desplazamientoY ?? 0}%)`
      : "";
  console.log(`      desktop            : ${d.horizontal} / ${d.vertical}${ajuste(d)}`);
  console.log(`      mobile             : ${m.horizontal} / ${m.vertical}${ajuste(m)}\n`);
});

if (!aplicar) {
  console.log("Dry run. Volve a correrlo con --aplicar para escribir en Sanity.");
  process.exit(0);
}

const res = await client.patch("paginaInicio").set({ seccionesContenido: conCta }).commit();
console.log("Sembrado. rev:", res._rev);
