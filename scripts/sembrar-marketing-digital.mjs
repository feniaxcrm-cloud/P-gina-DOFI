/**
 * Crea el documento de la pagina /marketing-digital en Sanity con el copy
 * del brief. De un solo uso.
 *
 * NO PISA NADA: usa createIfNotExists. Si el documento ya existe (porque
 * alguien ya edito textos en el Studio), no lo toca. Para reemplazarlo a
 * proposito hay que pasar --forzar.
 *
 * Las imagenes quedan vacias: no se entregaron. Se suben en el Studio
 * (menu "Marketing Digital") y la pagina las toma sola.
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
  equipo: {
    _type: "mdBannerFoto",
    etiqueta: "Cuenca - Ecuador",
    titulo: "¿Necesitas un equipo completo de marketing para hacer crecer tu negocio?",
    descripcion:
      "Un equipo de marketing digital completo a una fracción de lo que te costaría contratarlo.",
    destacado: "Un Mar de Ideas",
    cta: CTA_VENTAS,
    alineacion: "izquierda",
    overlay: "medio",
    animar: true,
  },
  queEs: {
    _type: "mdPiezaGrafica",
    titulo: "¿Qué es DOFI?",
    texto:
      "¿Sabías que los delfines son seres de alta vibración que han venido a ayudar a las personas a despertar?\n\nUtilizamos este pensamiento como analogía, ya que somos un equipo especializado y con todas las herramientas necesarias que requiere tu marca para fluir en nuevos retos.",
    destacado: "Navegar en un Mar de Oportunidades.",
    animar: true,
  },
  navegamos: {
    _type: "mdPiezaGrafica",
    titulo: "¿Cómo navegamos contigo?",
    texto:
      "Dentro del infinito mar de ideas y posibilidades buscamos la mejor forma de adaptarnos a tu marca y guiarla hacia el éxito.",
    textoAdicional:
      "Durante el viaje te guiamos por diferentes fases donde exploramos oportunidades y construimos la mejor propuesta para tu marca.",
    animar: true,
  },
  metodo: {
    titulo: "Método DOFI en 5 pasos",
    pasos: [
      ["Adentrarnos en tu marca", "Investigación de experiencia y características de la marca."],
      ["Bitácora de viaje", "Desarrollo de propuesta de valor."],
      ["Preparados para zarpar", "Creación de campaña publicitaria."],
      ["Navegando con viento a favor", "Ejecución del plan de marketing de contenido."],
      ["Retorno de tu inversión", "Monitoreo y optimización de datos."],
    ].map(([titulo, descripcion]) => ({ _key: clave(), _type: "pasoMetodo", titulo, descripcion })),
    mostrarPasos: true,
    mensajeFinal: "Ventas inteligentes garantizadas.",
    cta: CTA_VENTAS,
    animar: true,
  },
  clientes: {
    titulo: "Clientes y casos de éxito",
    categorias: [
      ["Construcción", "construccion"],
      ["Belleza", "belleza"],
      ["Servicios", "servicios"],
      ["Comercio", "comercio"],
      ["Emprendedores", "emprendedores"],
    ].map(([nombre, icono]) => ({ _key: clave(), _type: "categoriaIcono", nombre, icono })),
    multimedia: { tipo: "video" },
    cta: { _type: "ctaSimple", texto: "Ver casos de éxito", enlace: "/clientes" },
    animar: true,
  },
  resenas: {
    titulo: "Reseñas en Google",
    enlaceGoogle: "https://maps.app.goo.gl/QxAWAwctM2cGfo598",
    animar: true,
  },
  ctaFinal: {
    _type: "mdBannerFoto",
    titulo: "¿Somos socios o le pasas tu oportunidad a alguien más?",
    cta: CTA_VENTAS,
    alineacion: "centro",
    overlay: "medio",
    animar: true,
  },
};

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });
const existente = await client.getDocument(doc._id);

console.log(`Documento "${doc._id}": ${existente ? "YA EXISTE" : "no existe todavia"}`);
console.log("Secciones a sembrar: equipo, queEs, navegamos, metodo (5 pasos), clientes (5 rubros), resenas, ctaFinal");
console.log("Imagenes: ninguna (se suben en el Studio).");

if (existente && !forzar) {
  console.log("\nNo se toca: ya tiene contenido. Usa --forzar si de verdad queres reemplazarlo.");
  process.exit(0);
}
if (!aplicar) {
  console.log("\nDry run. Volve a correrlo con --aplicar para escribir en Sanity.");
  process.exit(0);
}

const res = forzar ? await client.createOrReplace(doc) : await client.createIfNotExists(doc);
console.log("Listo. rev:", res._rev);
