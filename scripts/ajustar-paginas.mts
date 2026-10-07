/**
 * Ajuste de un solo uso de las páginas de servicio en Sanity (pedido del
 * 2026-10-07):
 *
 *  1. Tráfico/Ads, «¿Dónde traficamos?»: sale la tarjeta «Tráfico web» (ícono
 *     web) y WhatsApp va PRIMERA, con los textos de
 *     src/lib/trafico-respaldo.ts. Si ya había una tarjeta de WhatsApp, se
 *     conserva la suya y solo pasa al principio.
 *  2. ChatBots/CRM, portada: el texto bajo el título suma TikTok («WhatsApp,
 *     Instagram, Facebook y TikTok»). Solo si sigue diciendo «WhatsApp,
 *     Instagram y Facebook»: un texto reescrito a mano en el Studio se
 *     respeta, y se avisa.
 *  3. Reseñas en Google, en las cuatro páginas: se borran `autoplay` y
 *     `velocidadAutoplay`. Las reseñas ahora se deslizan solas siempre y esos
 *     campos ya no están en el Studio (sin esto, el Studio los mostraría como
 *     campos desconocidos).
 *
 * Solo toca lo que hace falta. Antes de escribir guarda una copia de cada
 * documento que cambia en audit/backup-<documento>-antes-de-ajustes-<fecha>.json.
 * Sin --aplicar solo muestra lo que haría. Para --aplicar hace falta
 * SANITY_WRITE_TOKEN en .env.local, o una sesión de la CLI de Sanity
 * (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-paginas.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COPY_TRAFICO } from "../src/lib/trafico-respaldo";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const aplicar = process.argv.includes("--aplicar");

if (!projectId || !dataset || (aplicar && !token)) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o (para --aplicar) SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token: aplicar ? token : undefined, apiVersion: "2024-01-01", useCdn: false });
const clave = () => crypto.randomBytes(6).toString("hex");

type Plataforma = { _key: string; _type?: string; nombre?: string; etiqueta?: string; descripcion?: string; icono?: string };
type Seccion = {
  _key: string;
  _type: string;
  activo?: boolean;
  titulo?: string;
  descripcion?: string;
  plataformas?: Plataforma[];
  [campo: string]: unknown;
};

/** Lo que dice la portada de CRM desde el sembrado, y lo que pasa a decir. */
const REDES_ANTES = "WhatsApp, Instagram y Facebook";
const REDES_AHORA = "WhatsApp, Instagram, Facebook y TikTok";

/** Los campos de las reseñas que ya no existen en el Studio. */
const CAMPOS_RESENAS = ["autoplay", "velocidadAutoplay"];

const WHATSAPP = COPY_TRAFICO.plataformas.items.find((p) => p.icono === "whatsapp");
if (!WHATSAPP) throw new Error("src/lib/trafico-respaldo.ts ya no trae la tarjeta de WhatsApp");

const PAGINAS = ["marketingDigitalPage", "traficoAdsPage", "chatbotsCrmPage", "asesoriasPage"];
const nombres = (lista: Plataforma[]) => lista.map((p) => p.nombre ?? "(sin nombre)").join(", ");
const fecha = new Date().toISOString().slice(0, 10);
let total = 0;

for (const id of PAGINAS) {
  const doc = await client.getDocument(id);
  if (!doc) {
    console.log(`\n${id}: no existe, se omite.`);
    continue;
  }
  const secciones = (doc.sections as Seccion[] | undefined) ?? [];
  const cambios: Record<string, unknown> = {};
  const borrar: string[] = [];
  const conLogros = secciones.some((s) => s._type === "achievementsBanner" && s.activo !== false);
  console.log(`\n${id} (${secciones.length} secciones)`);

  for (const s of secciones) {
    const ruta = `sections[_key=="${s._key}"]`;

    if (id === "traficoAdsPage" && s._type === "platformsBanner") {
      const antes = s.plataformas ?? [];
      const propia = antes.find((p) => p.icono === "whatsapp");
      const resto = antes.filter((p) => p.icono !== "web" && p !== propia);
      const ahora = [propia ?? { _key: clave(), _type: "plataforma", ...WHATSAPP }, ...resto];
      if (ahora.map((p) => p._key).join() !== antes.map((p) => p._key).join()) {
        cambios[`${ruta}.plataformas`] = ahora;
        console.log(`  platformsBanner «${s.titulo ?? ""}»: ${nombres(antes)} → ${nombres(ahora)}`);
      }
    }

    if (id === "chatbotsCrmPage" && s._type === "teamBanner" && s.descripcion) {
      if (s.descripcion.includes(REDES_ANTES)) {
        cambios[`${ruta}.descripcion`] = s.descripcion.replace(REDES_ANTES, REDES_AHORA);
        console.log(`  teamBanner «${s.titulo ?? ""}»: «${REDES_ANTES}» → «${REDES_AHORA}»`);
      } else if (!s.descripcion.includes("TikTok")) {
        console.log(`  teamBanner «${s.titulo ?? ""}»: AVISO, el texto se editó a mano y no nombra TikTok. Agrégalo en el Studio.`);
      }
    }

    if (s._type === "reviewsBanner") {
      const sobran = CAMPOS_RESENAS.filter((campo) => campo in s);
      borrar.push(...sobran.map((campo) => `${ruta}.${campo}`));
      if (sobran.length > 0) {
        console.log(`  reviewsBanner «${s.titulo ?? ""}»: se borra ${sobran.join(" y ")} (ahora se deslizan solas)`);
      }
      if (id === "asesoriasPage" && s.activo !== false && !conLogros) {
        console.log(
          "  AVISO: en Asesorías las reseñas las reemplaza la sección «Logros (tarjetas con foto)». Agrégala en el Studio y apaga «Reseñas»."
        );
      }
    }
  }

  const n = Object.keys(cambios).length + borrar.length;
  total += n;
  console.log(n === 0 ? "  Nada que cambiar." : `  ${n} cambio(s).`);
  if (n === 0 || !aplicar) continue;

  const destino = path.join(process.cwd(), "audit", `backup-${id}-antes-de-ajustes-${fecha}.json`);
  fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
  console.log(`  Copia del documento anterior: ${path.relative(process.cwd(), destino)}`);
  let parche = client.patch(id);
  if (Object.keys(cambios).length > 0) parche = parche.set(cambios);
  if (borrar.length > 0) parche = parche.unset(borrar);
  const res = await parche.commit();
  console.log("  Listo. rev:", res._rev);
}

if (!aplicar) console.log(`\nDry run: ${total} cambio(s) en total, no se escribió nada. Vuelve a correrlo con --aplicar.`);
