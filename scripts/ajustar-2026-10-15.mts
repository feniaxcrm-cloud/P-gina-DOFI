/**
 * Ajuste de un solo uso en Sanity (pedido del 2026-10-15):
 *
 *  1. HOME, hero: el botón «Mira Nuestro Trabajo» pasa a llevar a /redes (la
 *     página nueva con las redes de DOFI). Hoy lleva al TikTok de DOFI.
 *  2. TRÁFICO/ADS y CHATBOTS/CRM, «Clientes y casos de éxito»: se borra la
 *     descripción que acompañaba al panel y al teléfono («Elige un giro…»).
 *     Solo si sigue siendo la del sembrado: un texto escrito a mano en el
 *     Studio se respeta, y se avisa.
 *
 * Solo toca lo que hace falta y es seguro de repetir. Antes de escribir
 * guarda una copia de cada documento que cambia en
 * audit/backup-<documento>-antes-de-ajustes-2026-10-15.json. Sin --aplicar
 * solo muestra lo que haría. Para --aplicar hace falta SANITY_WRITE_TOKEN en
 * .env.local, o una sesión de la CLI de Sanity (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-2026-10-15.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const aplicar = process.argv.includes("--aplicar");

if (!projectId || !dataset || (aplicar && !token)) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o (para --aplicar) SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token: aplicar ? token : undefined, apiVersion: "2024-01-01", useCdn: false });
const raiz = process.cwd();

type Seccion = { _key: string; _type: string; titulo?: string; descripcion?: string };

const ENLACE_REDES = "/redes";

/** Las descripciones que dejó el sembrado y que ahora se quitan. */
const DESCRIPCIONES: Record<string, { tipo: string; texto: string }> = {
  traficoAdsPage: { tipo: "metricsClientsBanner", texto: "Elige un giro y mira cómo medimos una campaña de Meta Ads." },
  chatbotsCrmPage: {
    tipo: "chatClientsBanner",
    texto: "Elige un giro de negocio y mira cómo la IA de FENIAX atiende a sus clientes por WhatsApp.",
  },
};

function respaldar(id: string, doc: unknown) {
  const destino = path.join(raiz, "audit", `backup-${id}-antes-de-ajustes-2026-10-15.json`);
  fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
  console.log(`  Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

let total = 0;

// 1. Hero del Home -----------------------------------------------------------
{
  const id = await client.fetch<string | null>(`*[_type == "paginaInicio"][0]._id`);
  console.log(`\npaginaInicio (${id ?? "no existe"})`);
  if (id) {
    const doc = await client.getDocument(id);
    const hero = (doc?.hero ?? {}) as { ctaSecundarioTexto?: string; ctaSecundarioEnlace?: string };
    if (hero.ctaSecundarioEnlace === ENLACE_REDES) {
      console.log("  El botón secundario ya lleva a /redes.");
    } else {
      console.log(`  «${hero.ctaSecundarioTexto ?? "(sin texto)"}»: ${hero.ctaSecundarioEnlace ?? "(sin enlace)"} → ${ENLACE_REDES}`);
      total++;
      if (aplicar) {
        respaldar("paginaInicio", doc);
        const res = await client.patch(id).set({ "hero.ctaSecundarioEnlace": ENLACE_REDES }).commit();
        console.log("  Listo. rev:", res._rev);
      }
    }
  }
}

// 2. Descripción de Clientes en Tráfico/Ads y ChatBots/CRM -------------------
for (const [id, { tipo, texto }] of Object.entries(DESCRIPCIONES)) {
  const doc = await client.getDocument(id);
  console.log(`\n${id}`);
  if (!doc) {
    console.log("  No existe, se omite.");
    continue;
  }
  const borrar: string[] = [];
  for (const s of (doc.sections as Seccion[] | undefined) ?? []) {
    if (s._type !== tipo || !s.descripcion) continue;
    if (s.descripcion.trim() === texto) {
      borrar.push(`sections[_key=="${s._key}"].descripcion`);
      console.log(`  ${tipo} «${s.titulo ?? ""}»: se borra la descripción «${s.descripcion}»`);
    } else {
      console.log(`  ${tipo} «${s.titulo ?? ""}»: AVISO, la descripción se editó a mano («${s.descripcion}»); bórrala en el Studio si no va.`);
    }
  }
  total += borrar.length;
  if (borrar.length === 0) {
    console.log("  Nada que cambiar.");
  } else if (aplicar) {
    respaldar(id, doc);
    const res = await client.patch(id).unset(borrar).commit();
    console.log("  Listo. rev:", res._rev);
  }
}

if (!aplicar) console.log(`\nDry run: ${total} cambio(s) en total, no se escribió nada. Vuelve a correrlo con --aplicar.`);
