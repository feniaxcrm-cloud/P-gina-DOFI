/**
 * Crea el documento de la pagina /marketing-digital en Sanity con el copy
 * del brief, ya en la estructura `sections[]`. Para un dataset vacio: el
 * documento de produccion ya existe y se paso a secciones con
 * scripts/migrar-marketing-a-secciones.mjs.
 *
 * NO PISA NADA: usa createIfNotExists. Para reemplazarlo a proposito hay que
 * pasar --forzar.
 *
 * Uso: node --env-file=.env.local scripts/sembrar-marketing-digital.mjs [--aplicar] [--forzar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const aplicar = process.argv.includes("--aplicar");
const forzar = process.argv.includes("--forzar");
const clave = () => crypto.randomBytes(6).toString("hex");
const CTA_VENTAS = { _type: "ctaSimple", texto: "Quiero Mejorar mis Ventas", enlace: "/contactanos" };

const doc = {
  _id: "marketingDigitalPage",
  _type: "marketingDigitalPage",
  titulo: "Marketing Digital",
  sections: [
    {
      _type: "teamBanner",
      subtitulo: "Cuenca - Ecuador",
      titulo: "¿Necesitas un equipo de marketing completo?",
      descripcion: "Todo lo que necesitas para hacer crecer tu negocio, en un solo equipo.",
      destacado: "Un Mar de Ideas",
      cta: CTA_VENTAS,
      alineacion: "izquierda",
      overlay: "medio",
    },
    {
      _type: "aboutBanner",
      titulo: "¿Qué es DOFI?",
      descripcion:
        "¿Sabías que los delfines son seres de alta vibración que han venido a ayudar a las personas a despertar?\n\nUtilizamos este pensamiento como analogía, ya que somos un equipo especializado y con todas las herramientas necesarias que requiere tu marca para fluir en nuevos retos.",
      destacado: "Navegar en un Mar de Oportunidades.",
    },
    {
      _type: "navigationBanner",
      titulo: "¿Cómo navegamos contigo?",
      descripcion:
        "Dentro del infinito mar de ideas y posibilidades buscamos la mejor forma de adaptarnos a tu marca y guiarla hacia el éxito.\n\nDurante el viaje te guiamos por diferentes fases donde exploramos oportunidades y construimos la mejor propuesta para tu marca.",
    },
    {
      _type: "methodBanner",
      titulo: "Método DOFI en 5 pasos",
      pasos: [
        ["Adentrarnos en tu marca", "Investigación de experiencia y características de la marca."],
        ["Bitácora de viaje", "Desarrollo de propuesta de valor."],
        ["Preparados para zarpar", "Creación de campaña publicitaria."],
        ["Navegando con viento a favor", "Ejecución del plan de marketing de contenido."],
        ["Retorno de tu inversión", "Monitoreo y optimización de datos."],
      ].map(([titulo, descripcion]) => ({ _key: clave(), _type: "pasoMetodo", titulo, descripcion })),
      mostrarPasos: true,
      destacado: "Ventas Inteligentes Garantizadas",
      cta: CTA_VENTAS,
    },
    {
      _type: "clientsBanner",
      titulo: "Clientes y casos de éxito",
      // Sin giros: los crea el editor en el Studio. No se siembra contenido
      // de ejemplo (antes se sembraban 5 giros y aparecian en la web).
      cta: { _type: "ctaSimple", texto: "Ver casos de éxito", enlace: "/clientes" },
    },
    {
      _type: "reviewsBanner",
      titulo: "Reseñas en Google",
      enlaceGoogle: "https://maps.app.goo.gl/QxAWAwctM2cGfo598",
    },
    {
      _type: "ctaBanner",
      titulo: "¿Somos socios o le pasas tu oportunidad a alguien más?",
      cta: CTA_VENTAS,
      alineacion: "centro",
      overlay: "medio",
    },
  ].map((s) => ({ _key: clave(), activo: true, animar: true, ...s })),
};

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });
const existente = await client.getDocument(doc._id);

console.log(`Documento "${doc._id}": ${existente ? "YA EXISTE" : "no existe todavia"}`);
console.log(`Secciones: ${doc.sections.map((s) => s._type).join(", ")}`);

if (existente && !forzar) {
  console.log("\nNo se toca: ya tiene contenido. Usa --forzar si de verdad quieres reemplazarlo.");
  process.exit(0);
}
if (!aplicar) {
  console.log("\nDry run. Vuelve a correrlo con --aplicar para escribir en Sanity.");
  process.exit(0);
}

const res = forzar ? await client.createOrReplace(doc) : await client.createIfNotExists(doc);
console.log("Listo. rev:", res._rev);
