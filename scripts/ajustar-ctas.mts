/**
 * Ajuste de un solo uso de los botones en Sanity (pedido del 2026-10-02):
 *
 *  1. Todos los botones de Marketing Digital, Tráfico/Ads, ChatBots/CRM y
 *     Asesorías dicen «Quiero mejorar mis ventas» (src/lib/cta.ts). Inicio no
 *     se toca.
 *  2. Los botones de los banners finales (cierre) llevan al FORMULARIO
 *     (/contactanos) con el servicio de esa página ya marcado: Marketing 360,
 *     Pauta, CRM o Asesorías 1a1. Los botones que apuntaban a «/contactanos»
 *     a secas reciben el mismo servicio; los demás enlaces (WhatsApp de
 *     FENIAX en la portada y el método) no cambian.
 *  3. Tráfico/Ads: el cierre pasa al tipo nuevo «Cierre con imagen a la
 *     derecha» (ctaImageBanner: misma sección, mismos textos, la imagen va al
 *     lado y no de fondo); el método gana su botón; y el texto de «Nuestro
 *     sistema» se cambia SOLO si sigue siendo el que cargó el sembrado (una
 *     edición hecha a mano en el Studio se respeta).
 *
 * Solo toca lo que hace falta. Antes de escribir guarda una copia de cada
 * documento en audit/backup-<documento>-antes-de-ctas-<fecha>.json. Sin
 * --aplicar solo muestra lo que haría. Para --aplicar hace falta
 * SANITY_WRITE_TOKEN en .env.local, o una sesión de la CLI de Sanity
 * (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-ctas.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { TEXTO_CTA, enlaceFormulario, RUTA_FORMULARIO, type ClaveServicio } from "../src/lib/cta";
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

/** Cada pagina y el servicio que lleva marcado en el formulario. */
const PAGINAS: Array<{ id: string; servicio: ClaveServicio }> = [
  { id: "marketingDigitalPage", servicio: "marketing-360" },
  { id: "traficoAdsPage", servicio: "pauta" },
  { id: "chatbotsCrmPage", servicio: "crm" },
  { id: "asesoriasPage", servicio: "asesorias" },
];

/** El texto de «Nuestro sistema» que cargó el sembrado de Tráfico (2026-10-01). */
const SISTEMA_ANTERIOR =
  "Cada marca es distinta. Diseñamos la campaña según tu objetivo y tu momento, y la mejoramos con datos.";

type Cta = { _type?: string; texto?: string; enlace?: string };
type Seccion = { _key: string; _type: string; titulo?: string; descripcion?: string; cta?: Cta; [k: string]: unknown };

const fecha = new Date().toISOString().slice(0, 10);
let total = 0;

for (const { id, servicio } of PAGINAS) {
  const doc = await client.getDocument(id);
  if (!doc) {
    console.log(`\n${id}: no existe, se omite.`);
    continue;
  }
  const secciones = (doc.sections as Seccion[] | undefined) ?? [];
  const formulario = enlaceFormulario(servicio);
  const cambios: Record<string, unknown> = {};
  console.log(`\n${id} (${secciones.length} secciones, formulario → ${formulario})`);

  for (const s of secciones) {
    // Las secciones vacias del esqueleto (sin titulo, apagadas) no se tocan.
    if (!s.titulo) continue;
    const clave = `sections[_key=="${s._key}"]`;
    const final = s._type === "ctaBanner" || s._type === "ctaImageBanner";

    if (id === "traficoAdsPage" && s._type === "ctaBanner") {
      // El cierre pasa al tipo nuevo; se conserva lo que ya tenia.
      const { alineacion: _a, overlay: _o, ...resto } = s as Seccion & { alineacion?: unknown; overlay?: unknown };
      cambios[clave] = {
        ...resto,
        _type: "ctaImageBanner",
        cta: { _type: "ctaSimple", texto: TEXTO_CTA, enlace: formulario },
      };
      console.log(`  ${s._type} «${s.titulo ?? ""}»: pasa a ctaImageBanner, botón «${TEXTO_CTA}» → ${formulario}`);
      continue;
    }

    if (final) {
      if (s.cta?.texto !== TEXTO_CTA || s.cta?.enlace !== formulario) {
        cambios[`${clave}.cta`] = { _type: "ctaSimple", texto: TEXTO_CTA, enlace: formulario };
        console.log(`  ${s._type} «${s.titulo ?? ""}»: botón «${s.cta?.texto ?? "(sin botón)"}» → «${TEXTO_CTA}» · ${formulario}`);
      }
      continue;
    }

    if (s.cta?.texto) {
      if (s.cta.texto !== TEXTO_CTA) {
        cambios[`${clave}.cta.texto`] = TEXTO_CTA;
        console.log(`  ${s._type} «${s.titulo ?? ""}»: «${s.cta.texto}» → «${TEXTO_CTA}»`);
      }
      if (s.cta.enlace === RUTA_FORMULARIO) {
        cambios[`${clave}.cta.enlace`] = formulario;
        console.log(`  ${s._type} «${s.titulo ?? ""}»: enlace ${RUTA_FORMULARIO} → ${formulario}`);
      }
    }

    if (id === "traficoAdsPage") {
      if (s._type === "methodBanner" && !s.cta?.texto) {
        cambios[`${clave}.cta`] = { _type: "ctaSimple", texto: TEXTO_CTA, enlace: formulario };
        console.log(`  methodBanner «${s.titulo ?? ""}»: se agrega el botón «${TEXTO_CTA}» → ${formulario}`);
      }
      if (s._type === "aboutBanner" && s.descripcion === SISTEMA_ANTERIOR) {
        cambios[`${clave}.descripcion`] = COPY_TRAFICO.sistema.descripcion;
        console.log(`  aboutBanner «${s.titulo ?? ""}»: texto nuevo (estrategia a la medida, ventas y datos)`);
      }
    }
  }

  const n = Object.keys(cambios).length;
  total += n;
  console.log(n === 0 ? "  Nada que cambiar." : `  ${n} cambio(s).`);
  if (n === 0 || !aplicar) continue;

  const destino = path.join(process.cwd(), "audit", `backup-${id}-antes-de-ctas-${fecha}.json`);
  fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
  console.log(`  Copia del documento anterior: ${path.relative(process.cwd(), destino)}`);
  const res = await client.patch(id).set(cambios).commit();
  console.log("  Listo. rev:", res._rev);
}

if (!aplicar) console.log(`\nDry run: ${total} cambio(s) en total, no se escribió nada. Vuelve a correrlo con --aplicar.`);
