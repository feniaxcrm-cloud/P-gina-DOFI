/**
 * Script de un solo uso: crea, para cada página de servicio (Tráfico/Ads,
 * ChatBots/CRM, Asesorías), el documento singleton con el mismo esqueleto de
 * 5 secciones que tiene Marketing Digital (Equipo -> Introducción -> Bloque
 * editorial -> Método -> Cierre), TODAS inactivas y sin texto -- listas para
 * completarse desde el Studio. No inventa copy: solo arma la lista de
 * secciones en el orden correcto, cada una apagada ("Mostrar en la página" =
 * no) hasta que alguien la complete y la active a mano.
 *
 * SEGURO DE CORRER MÁS DE UNA VEZ: usa createIfNotExists, así que si el
 * documento ya existe (por ejemplo porque alguien ya empezó a cargarlo a
 * mano en el Studio) no lo toca ni lo pisa.
 *
 * Uso: node --env-file=.env.local scripts/crear-esqueleto-paginas-servicio.mjs [--aplicar]
 * Sin --aplicar solo muestra qué haría (dry run).
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
// SANITY_WRITE_TOKEN (.env.local) es el token pensado para esto, pero hoy
// quedo con permisos insuficientes (mismo problema que el deploy del
// Studio) -- se prioriza SANITY_AUTH_TOKEN de studio/.env.local, rol editor,
// ya confirmado con permiso de escritura real al desplegar el Studio.
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o un token con permiso de escritura en .env.local");
  process.exit(1);
}

const aplicar = process.argv.includes("--aplicar");
const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const esqueleto = (prefijo) => [
  { _type: "teamBanner", _key: `${prefijo}-equipo`, activo: false },
  { _type: "aboutBanner", _key: `${prefijo}-intro`, activo: false },
  { _type: "navigationBanner", _key: `${prefijo}-editorial`, activo: false },
  { _type: "methodBanner", _key: `${prefijo}-metodo`, activo: false },
  { _type: "ctaBanner", _key: `${prefijo}-cierre`, activo: false },
];

const PAGINAS = [
  { _id: "traficoAdsPage", _type: "traficoAdsPage", titulo: "Tráfico / Ads", prefijo: "trafico" },
  { _id: "chatbotsCrmPage", _type: "chatbotsCrmPage", titulo: "ChatBots / CRM", prefijo: "crm" },
  { _id: "asesoriasPage", _type: "asesoriasPage", titulo: "Asesorías", prefijo: "asesorias" },
];

console.log(`${PAGINAS.length} páginas a revisar:\n`);
for (const p of PAGINAS) {
  const existente = await client.getDocument(p._id);
  if (existente) {
    console.log(`  ${p._id} (${p.titulo}): YA EXISTE (rev=${existente._rev}) -- no se toca.`);
  } else {
    console.log(`  ${p._id} (${p.titulo}): no existe -- se crea con 5 secciones inactivas.`);
  }
}

if (!aplicar) {
  console.log("\nDry run. Volvé a correrlo con --aplicar para escribir en Sanity.");
  process.exit(0);
}

console.log("");
for (const p of PAGINAS) {
  const doc = { _id: p._id, _type: p._type, titulo: p.titulo, sections: esqueleto(p.prefijo) };
  const res = await client.createIfNotExists(doc);
  console.log(`${p._id}: rev=${res._rev}`);
}
