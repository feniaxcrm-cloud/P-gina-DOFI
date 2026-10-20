/**
 * Ajuste de un solo uso en Sanity (pedido del 2026-10-20):
 *
 *  1. HOME, banner de ChatBots/CRM: el botón se corre a la izquierda para no
 *     tapar la foto (escritorio: «Centro-izquierda» con ajuste -2; se
 *     conserva la altura elegida). En el celular el botón va en su propia
 *     fila, no cambia.
 *  2. TRÁFICO/ADS, «¿Dónde traficamos?»: vuelven las tarjetas Google Ads y
 *     Tráfico web, con sus textos de siempre (src/lib/trafico-respaldo.ts),
 *     después de Meta Ads y TikTok Ads. Solo si no están.
 *  3. ASESORÍAS: se agrega la sección «Videos en celulares» (tres celulares,
 *     sin videos todavía) antes del cierre. Solo si no existe.
 *  4. CLIENTES de Marketing Digital y Asesorías: el celular con el video se
 *     mudó a la portada de ChatBots/CRM, así que se borran de esas secciones
 *     el usuario y los contadores que se habían cargado de fábrica. Si alguna
 *     tuviera un video subido, NO se borra (se avisa).
 *  5. CHATBOTS/CRM, portada: se cargan el usuario y los contadores de
 *     arranque del celular (los mismos que usa el código por defecto), para
 *     que se vean y se editen en el Studio. Solo los campos vacíos.
 *
 * Seguro de repetir. Antes de escribir guarda una copia de cada documento que
 * cambia en audit/backup-<documento>-antes-de-ajustes-2026-10-20.json. Sin
 * --aplicar solo muestra lo que haría. Para --aplicar hace falta
 * SANITY_WRITE_TOKEN en .env.local, o una sesión de la CLI de Sanity
 * (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-2026-10-20.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COPY_TRAFICO } from "../src/lib/trafico-respaldo";
import { TIKTOK_POR_DEFECTO } from "../src/lib/marketing-digital";

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
const raiz = process.cwd();

type Obj = Record<string, unknown> & { _key?: string; _type?: string };

const respaldados = new Set<string>();
function respaldar(id: string, doc: unknown) {
  if (respaldados.has(id)) return;
  respaldados.add(id);
  const destino = path.join(raiz, "audit", `backup-${id}-antes-de-ajustes-2026-10-20.json`);
  fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
  console.log(`  Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

let total = 0;

// 1. Botón del banner de ChatBots/CRM en el Home ------------------------------
{
  const doc = await client.getDocument("banners");
  console.log("\nbanners");
  const b = ((doc?.seccionesContenido as Obj[] | undefined) ?? []).find((i) => i.escena === "crm");
  const pos = (b?.ctaPosicionDesktop ?? {}) as Obj;
  if (!b) {
    console.log("  No hay banner de ChatBots/CRM: se omite.");
  } else if (pos.horizontal === "centro-izquierda" && pos.desplazamientoX === -2) {
    console.log("  El botón ya está corrido a la izquierda.");
  } else {
    console.log(
      `  Botón (escritorio): ${String(pos.horizontal ?? "?")} ${String(pos.desplazamientoX ?? 0)} → centro-izquierda -2 (alto: ${String(pos.vertical ?? "?")} ${String(pos.desplazamientoY ?? 0)}, sin cambio)`
    );
    total++;
    if (aplicar) {
      respaldar("banners", doc);
      const ruta = `seccionesContenido[_key=="${b._key}"].ctaPosicionDesktop`;
      const r = await client
        .patch("banners")
        .set({ [`${ruta}.horizontal`]: "centro-izquierda", [`${ruta}.desplazamientoX`]: -2 })
        .commit();
      console.log("  Listo. rev:", r._rev);
    }
  }
}

// 2. Tarjetas de «¿Dónde traficamos?» -----------------------------------------
{
  const id = "traficoAdsPage";
  const doc = await client.getDocument(id);
  console.log(`\n${id}`);
  const seccion = ((doc?.sections as Obj[] | undefined) ?? []).find((s) => s._type === "platformsBanner");
  if (!seccion) {
    console.log("  No hay «¿Dónde traficamos?»: se omite.");
  } else {
    const actuales = (seccion.plataformas as Obj[] | undefined) ?? [];
    const faltan = COPY_TRAFICO.plataformas.items
      .filter((p) => p.icono === "google" || p.icono === "web")
      .filter((p) => !actuales.some((a) => a.icono === p.icono));
    if (faltan.length === 0) {
      console.log("  Google Ads y Tráfico web ya están.");
    } else {
      console.log(`  Se agregan: ${faltan.map((p) => p.nombre).join(", ")} (quedan ${actuales.length + faltan.length} tarjetas)`);
      total++;
      if (aplicar) {
        respaldar(id, doc);
        const nuevas = faltan.map((p) => ({ _key: clave(), _type: "plataforma", ...p }));
        const r = await client
          .patch(id)
          .set({ [`sections[_key=="${seccion._key}"].plataformas`]: [...actuales, ...nuevas] })
          .commit();
        console.log("  Listo. rev:", r._rev);
      }
    }
  }
}

// 3. «Videos en celulares» en Asesorías ----------------------------------------
{
  const id = "asesoriasPage";
  const doc = await client.getDocument(id);
  console.log(`\n${id}`);
  const secciones = (doc?.sections as Obj[] | undefined) ?? [];
  if (secciones.some((s) => s._type === "celularesBanner")) {
    console.log("  Ya tiene «Videos en celulares».");
  } else {
    const cierre = secciones.find((s) => s._type === "ctaBanner");
    console.log(`  Se agrega «Videos en celulares» ${cierre ? "antes del cierre" : "al final"} (tres celulares, sin videos todavía).`);
    total++;
    if (aplicar) {
      respaldar(id, doc);
      const nueva = {
        _key: clave(),
        _type: "celularesBanner",
        activo: true,
        animar: true,
        subtitulo: "En video",
        titulo: "Mira cómo trabajamos",
        celularIzquierdo: { _type: "videoCelular" },
        celularCentral: { _type: "videoCelular" },
        celularDerecho: { _type: "videoCelular" },
      };
      const parche = cierre
        ? client.patch(id).insert("before", `sections[_key=="${cierre._key}"]`, [nueva])
        : client.patch(id).append("sections", [nueva]);
      const r = await parche.commit();
      console.log("  Listo. rev:", r._rev);
    }
  }
}

// 4. El celular sale de Clientes (Marketing Digital y Asesorías) ---------------
const CAMPOS_TIKTOK = ["usuarioTikTok", "descripcionVideo", "meGusta", "comentarios", "compartidos", "ajusteVideo", "sonidoVideo"];
for (const id of ["marketingDigitalPage", "asesoriasPage"]) {
  const doc = await client.getDocument(id);
  console.log(`\n${id} (Clientes)`);
  const clientes = ((doc?.sections as Obj[] | undefined) ?? []).find((s) => s._type === "clientsBanner");
  if (!clientes) {
    console.log("  No tiene sección de Clientes.");
    continue;
  }
  if (clientes.video) console.log("  AVISO: tiene un video subido; no se borra (ya no se muestra en Clientes).");
  const ruta = `sections[_key=="${clientes._key}"]`;
  const borrar = CAMPOS_TIKTOK.filter((c) => clientes[c] !== undefined).map((c) => `${ruta}.${c}`);
  if (borrar.length === 0) {
    console.log("  Nada que borrar.");
    continue;
  }
  console.log(`  Se borran: ${borrar.map((r) => r.split(".").pop()).join(", ")}`);
  total++;
  if (aplicar) {
    respaldar(id, await client.getDocument(id));
    const r = await client.patch(id).unset(borrar).commit();
    console.log("  Listo. rev:", r._rev);
  }
}

// 5. Portada de ChatBots/CRM: usuario y contadores de arranque -----------------
{
  const id = "chatbotsCrmPage";
  const doc = await client.getDocument(id);
  console.log(`\n${id} (portada)`);
  const portada = ((doc?.sections as Obj[] | undefined) ?? []).find((s) => s._type === "teamBanner");
  if (!portada) {
    console.log("  No tiene portada.");
  } else {
    const ruta = `sections[_key=="${portada._key}"]`;
    const valores: Record<string, unknown> = {
      usuarioTikTok: TIKTOK_POR_DEFECTO.usuario,
      meGusta: TIKTOK_POR_DEFECTO.meGusta,
      comentarios: TIKTOK_POR_DEFECTO.comentarios,
      compartidos: TIKTOK_POR_DEFECTO.compartidos,
    };
    const faltan = Object.fromEntries(
      Object.entries(valores)
        .filter(([c]) => portada[c] === undefined || portada[c] === null || portada[c] === "")
        .map(([c, v]) => [`${ruta}.${c}`, v])
    );
    if (Object.keys(faltan).length === 0) {
      console.log("  Ya tiene usuario y contadores.");
    } else {
      console.log(`  Se cargan: ${Object.keys(faltan).map((k) => k.split(".").pop()).join(", ")}`);
      total++;
      if (aplicar) {
        respaldar(id, doc);
        const r = await client.patch(id).set(faltan).commit();
        console.log("  Listo. rev:", r._rev);
      }
    }
  }
}

if (!aplicar) console.log(`\nDry run: ${total} cambio(s) en total, no se escribió nada. Vuelve a correrlo con --aplicar.`);
