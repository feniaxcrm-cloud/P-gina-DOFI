/**
 * Ajuste de un solo uso en Sanity (pedido del 2026-10-16):
 *
 *  1. MARKETING DIGITAL, portada: la imagen de la derecha pasa a su campo
 *     propio, «Imagen de la derecha (PNG con transparencia)» (imagenDerecha).
 *     Se toma el PNG que hoy está como foto de fondo (2077 x 757, con mucho
 *     margen transparente a la izquierda), se recorta JUSTO al contenido con el
 *     recorte de la CDN de Sanity (rect=, sin perder la transparencia) y se
 *     sube como imagen nueva. La foto de fondo y su versión móvil se quitan de
 *     la portada (el fondo vuelve a ser solo el morado de marca, que es lo que
 *     ya se veía). Si alguien ya cargó una imagen de la derecha, no se toca.
 *  2. HOME, banner 4 (Rescatando Emprendedores): la foto de primer plano recibe
 *     su punto focal en Daniel (x = 0,636), para que en el teléfono quede
 *     centrada. Solo si todavía no tiene uno.
 *  3. CLIENTES de Marketing Digital y de Asesorías: se cargan el usuario y los
 *     contadores de arranque del video estilo TikTok (los mismos que usa el
 *     código por defecto), para que se vean y se editen en el Studio. Solo los
 *     campos vacíos.
 *
 * Seguro de repetir. Antes de escribir guarda una copia de cada documento que
 * cambia en audit/backup-<documento>-antes-de-ajustes-2026-10-16.json. Sin
 * --aplicar solo muestra lo que haría (no sube ni escribe nada). Para
 * --aplicar hace falta SANITY_WRITE_TOKEN en .env.local, o una sesión de la
 * CLI de Sanity (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-2026-10-16.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
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
const raiz = process.cwd();

type Obj = Record<string, unknown> & { _key?: string; _type?: string };
type Imagen = { asset?: { _ref?: string }; hotspot?: unknown } | undefined;

/** El PNG de la portada de Marketing que se conoce, y el recuadro de su
 *  contenido (medido sobre el archivo: x, y, ancho, alto). */
const PNG_PORTADA = "image-204148ae1fda9ad190da8b4b79431dd5f3dff257-2077x757-png";
const CONTENIDO = { x: 1037, y: 149, ancho: 1040, alto: 571 };

function respaldar(id: string, doc: unknown) {
  const destino = path.join(raiz, "audit", `backup-${id}-antes-de-ajustes-2026-10-16.json`);
  fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
  console.log(`  Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

let total = 0;

// 1. Portada de Marketing Digital --------------------------------------------
{
  const id = "marketingDigitalPage";
  const doc = await client.getDocument(id);
  console.log(`\n${id}`);
  const portada = ((doc?.sections as Obj[] | undefined) ?? []).find((s) => s._type === "teamBanner");
  if (!portada) {
    console.log("  No tiene portada (teamBanner), se omite.");
  } else if (portada.imagenDerecha) {
    console.log("  La portada ya tiene «Imagen de la derecha»: no se toca.");
  } else {
    const ref = (portada.imagen as Imagen)?.asset?._ref;
    const ruta = `sections[_key=="${portada._key}"]`;
    if (ref !== PNG_PORTADA) {
      console.log(`  AVISO: la foto de la portada no es el PNG conocido (${ref ?? "sin foto"}). Sube la «Imagen de la derecha» en el Studio.`);
    } else {
      const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${PNG_PORTADA.replace(/^image-/, "").replace(/-png$/, ".png")}?rect=${CONTENIDO.x},${CONTENIDO.y},${CONTENIDO.ancho},${CONTENIDO.alto}&fm=png`;
      console.log(`  Imagen de la derecha: el PNG de la portada recortado a su contenido (${CONTENIDO.ancho} x ${CONTENIDO.alto}).`);
      console.log("  Se quitan la foto de fondo y su versión móvil (el fondo queda en el morado de marca).");
      total += 1;
      if (aplicar) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`No se pudo descargar el recorte (${res.status})`);
        const buffer = Buffer.from(await res.arrayBuffer());
        const asset = await client.assets.upload("image", buffer, {
          filename: "portada-marketing-derecha.png",
          contentType: "image/png",
        });
        console.log(`    Imagen subida: ${asset._id} (${asset.metadata?.dimensions?.width} x ${asset.metadata?.dimensions?.height})`);
        respaldar(id, doc);
        const r = await client
          .patch(id)
          .set({ [`${ruta}.imagenDerecha`]: { _type: "image", asset: { _type: "reference", _ref: asset._id } } })
          .unset([`${ruta}.imagen`, `${ruta}.imagenMovil`])
          .commit();
        console.log("  Listo. rev:", r._rev);
      }
    }
  }
}

// 2. Banner 4 del Home ---------------------------------------------------------
{
  const doc = await client.getDocument("banners");
  console.log("\nbanners");
  const items = (doc?.seccionesContenido as Obj[] | undefined) ?? [];
  const b4 = items.find((i) => i.escena === "asesorias");
  const foto = b4?.fotoPrimerPlano as Imagen;
  if (!b4 || !foto?.asset?._ref) {
    console.log("  El banner de Asesorías no tiene foto de primer plano: se omite.");
  } else if (foto.hotspot) {
    console.log("  La foto del banner de Asesorías ya tiene punto focal: no se toca.");
  } else {
    console.log("  Banner de Asesorías: punto focal de la foto en Daniel (x 0,636).");
    total += 1;
    if (aplicar) {
      respaldar("banners", doc);
      const r = await client
        .patch("banners")
        .set({
          [`seccionesContenido[_key=="${b4._key}"].fotoPrimerPlano.hotspot`]: {
            _type: "sanity.imageHotspot",
            x: 0.636,
            y: 0.5,
            width: 1,
            height: 1,
          },
        })
        .commit();
      console.log("  Listo. rev:", r._rev);
    }
  }
}

// 3. Video estilo TikTok de Clientes ------------------------------------------
for (const id of ["marketingDigitalPage", "asesoriasPage"]) {
  const doc = await client.getDocument(id);
  console.log(`\n${id} (Clientes)`);
  const clientes = ((doc?.sections as Obj[] | undefined) ?? []).find((s) => s._type === "clientsBanner");
  if (!clientes) {
    console.log("  No tiene sección de Clientes, se omite.");
    continue;
  }
  const ruta = `sections[_key=="${clientes._key}"]`;
  const valores: Record<string, unknown> = {
    usuarioTikTok: TIKTOK_POR_DEFECTO.usuario,
    meGusta: TIKTOK_POR_DEFECTO.meGusta,
    comentarios: TIKTOK_POR_DEFECTO.comentarios,
    compartidos: TIKTOK_POR_DEFECTO.compartidos,
  };
  const faltan = Object.fromEntries(
    Object.entries(valores)
      .filter(([campo]) => clientes[campo] === undefined || clientes[campo] === null || clientes[campo] === "")
      .map(([campo, v]) => [`${ruta}.${campo}`, v])
  );
  const n = Object.keys(faltan).length;
  if (n === 0) {
    console.log("  Ya tiene usuario y contadores: no se toca.");
    continue;
  }
  console.log(`  Se cargan ${n} campo(s): ${Object.keys(faltan).map((k) => k.split(".").pop()).join(", ")}`);
  total += 1;
  if (aplicar) {
    // La copia de Marketing ya se guardó arriba si cambió la portada: no se
    // pisa con una versión posterior.
    const destino = path.join(raiz, "audit", `backup-${id}-antes-de-ajustes-2026-10-16.json`);
    if (!fs.existsSync(destino)) respaldar(id, doc);
    const r = await client.patch(id).set(faltan).commit();
    console.log("  Listo. rev:", r._rev);
  }
}

if (!aplicar) console.log(`\nDry run: ${total} cambio(s) en total, no se escribió nada. Vuelve a correrlo con --aplicar.`);
