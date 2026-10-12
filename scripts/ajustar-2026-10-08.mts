/**
 * Ajuste de un solo uso en Sanity (pedido del 2026-10-08):
 *
 *  1. HOME, los 4 banners pasan a ser HÍBRIDOS: cada uno recibe su `escena`
 *     (redes, pauta, crm, asesorias), el texto de la escena (`lineas`) y su
 *     FOTO de primer plano (`fotoPrimerPlano`, que se sube desde
 *     public/home/banner-<escena>-foto.webp). Se conserva la imagen entera de
 *     siempre (`backgroundImage`): si se elige «Imagen entera» en el Studio, el
 *     banner vuelve a ser el de antes. El botón de cada banner no se toca.
 *  2. TRÁFICO/ADS, «¿Dónde traficamos?»: quedan dos tarjetas, Meta Ads
 *     («Facebook + Instagram + WhatsApp») y TikTok Ads. Salen Google Ads y
 *     WhatsApp (que se vuelve parte de Meta).
 *  3. TRÁFICO/ADS, cierre: pasa de «Cierre con imagen» (ctaImageBanner) al
 *     mismo cierre de Marketing Digital (ctaBanner), con el MISMO archivo de
 *     imagen del hombre y el delfín (no se vuelve a subir). Conserva su título,
 *     frase, destacado y botón.
 *  4. CHATBOTS/CRM, cierre: recibe esa misma imagen.
 *
 * Solo toca lo que hace falta y es seguro de repetir. Antes de escribir
 * guarda una copia de cada documento que cambia en
 * audit/backup-<documento>-antes-de-home-hibrido-<fecha>.json. Sin --aplicar
 * solo muestra lo que haría (no sube ni escribe nada). Para --aplicar hace
 * falta SANITY_WRITE_TOKEN en .env.local, o una sesión de la CLI de Sanity
 * (`sanity exec --with-user-token`).
 *
 * Correrlo DESPUÉS de publicar el código nuevo y de redesplegar el Studio: el
 * sitio viejo no conoce estos campos ni el cierre nuevo de Tráfico.
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-2026-10-08.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COPY_TRAFICO } from "../src/lib/trafico-respaldo";
import { GEOMETRIA, type ClaveEscena } from "../src/remotion/home/tema";

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
const fecha = new Date().toISOString().slice(0, 10);
const raiz = process.cwd();

type Obj = Record<string, unknown> & { _key?: string; _type?: string };
type Imagen = { _type?: string; asset?: { _ref: string; _type?: string }; hotspot?: unknown; crop?: unknown };

function respaldar(id: string, doc: unknown) {
  const destino = path.join(raiz, "audit", `backup-${id}-antes-de-home-hibrido-${fecha}.json`);
  fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
  console.log(`  Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

let total = 0;

// ---------------------------------------------------------------------------
// 1. HOME: banners híbridos
// ---------------------------------------------------------------------------

/** Qué escena lleva cada banner, según a dónde lleva su botón. */
const ESCENA_POR_ENLACE: Record<string, ClaveEscena> = {
  "/marketing-digital": "redes",
  "/trafico-ads": "pauta",
  "/chatbots-crm": "crm",
  "/asesorias": "asesorias",
};
const ESCENAS_EN_ORDEN: ClaveEscena[] = ["redes", "pauta", "crm", "asesorias"];

{
  const doc = await client.getDocument("banners");
  const items = ((doc?.seccionesContenido as Obj[] | undefined) ?? []).map((i) => ({ ...i }));
  console.log(`\nbanners (${items.length} banners)`);
  const cambios: Record<string, unknown> = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const ruta = `seccionesContenido[_key=="${item._key}"]`;
    const escena = ESCENA_POR_ENLACE[String(item.ctaEnlace ?? "")] ?? ESCENAS_EN_ORDEN[i];
    if (!escena) continue;
    const g = GEOMETRIA[escena];

    if (item.escena && item.escena !== "imagen") {
      console.log(`  Banner ${i + 1} «${item.backgroundImageAlt ?? ""}»: ya es híbrido (${item.escena}), se respeta.`);
      continue;
    }
    console.log(`  Banner ${i + 1} «${item.backgroundImageAlt ?? ""}»: pasa a híbrido «${escena}» con la foto ${g.fotoRespaldo.url}`);
    cambios[`${ruta}.escena`] = escena;
    cambios[`${ruta}.lineas`] = g.lineasPorDefecto;
    cambios[`${ruta}.ajusteFoto`] = "cubrir";
    if (!item.fotoPrimerPlano) {
      const archivo = path.join(raiz, "public", g.fotoRespaldo.url);
      if (!fs.existsSync(archivo)) throw new Error(`Falta el archivo de la foto: ${archivo}`);
      if (aplicar) {
        const asset = await client.assets.upload("image", fs.createReadStream(archivo), {
          filename: path.basename(archivo),
        });
        cambios[`${ruta}.fotoPrimerPlano`] = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
        console.log(`    Foto subida: ${asset._id}`);
      } else {
        console.log("    (se subiría la foto)");
      }
    }
  }

  const n = Object.keys(cambios).length;
  total += n;
  if (n > 0 && aplicar) {
    respaldar("banners", doc);
    const res = await client.patch("banners").set(cambios).commit();
    console.log("  Listo. rev:", res._rev);
  } else if (n === 0) {
    console.log("  Nada que cambiar.");
  }
}

// ---------------------------------------------------------------------------
// 2, 3 y 4. Tráfico/Ads y ChatBots/CRM
// ---------------------------------------------------------------------------

// La imagen del cierre de Marketing Digital (el hombre y el delfín): se
// reutiliza el mismo archivo ya subido.
const marketing = await client.getDocument("marketingDigitalPage");
const cierreMarketing = ((marketing?.sections as Obj[] | undefined) ?? []).find((s) => s._type === "ctaBanner");
const imagenSocios = cierreMarketing?.imagen as Imagen | undefined;
if (!imagenSocios?.asset?._ref) {
  console.log("\nAVISO: Marketing Digital no tiene imagen en su cierre; Tráfico y CRM no reciben la imagen.");
}
const copiaImagen = (): Imagen | undefined =>
  imagenSocios?.asset?._ref ? JSON.parse(JSON.stringify({ ...imagenSocios, _type: "image" })) : undefined;

const META = COPY_TRAFICO.plataformas.items.find((p) => p.icono === "meta");
if (!META) throw new Error("src/lib/trafico-respaldo.ts ya no trae la tarjeta de Meta Ads");
const ETIQUETA_META_ANTES = "Facebook + Instagram";

{
  const id = "traficoAdsPage";
  const doc = await client.getDocument(id);
  console.log(`\n${id}`);
  const secciones = (doc?.sections as Obj[] | undefined) ?? [];
  const cambios: Record<string, unknown> = {};

  for (const s of secciones) {
    const ruta = `sections[_key=="${s._key}"]`;

    if (s._type === "platformsBanner") {
      const antes = (s.plataformas as Obj[] | undefined) ?? [];
      const meta = antes.find((p) => p.icono === "meta");
      const tiktok = antes.find((p) => p.icono === "tiktok");
      const ahora = [
        meta
          ? {
              ...meta,
              // Un texto escrito a mano en el Studio se respeta: solo se
              // reemplaza el que dejó el sembrado.
              etiqueta: meta.etiqueta === ETIQUETA_META_ANTES ? META.etiqueta : meta.etiqueta,
              descripcion:
                meta.descripcion === "Reconocimiento, mensajes, clientes potenciales y ventas." ? META.descripcion : meta.descripcion,
            }
          : { _key: clave(), _type: "plataforma", ...META },
        ...(tiktok ? [tiktok] : []),
      ];
      const nombres = (l: Obj[]) => l.map((p) => String(p.nombre ?? "(sin nombre)")).join(", ");
      if (JSON.stringify(antes) !== JSON.stringify(ahora)) {
        cambios[`${ruta}.plataformas`] = ahora;
        console.log(`  platformsBanner «${s.titulo ?? ""}»: ${nombres(antes)} → ${nombres(ahora)} (Meta: «${String(ahora[0].etiqueta)}»)`);
      }
    }

    if (s._type === "ctaImageBanner") {
      const imagen = copiaImagen();
      const nuevo: Obj = {
        _key: s._key,
        _type: "ctaBanner",
        activo: s.activo !== false,
        animar: s.animar !== false,
        titulo: s.titulo,
        descripcion: s.descripcion,
        destacado: s.destacado,
        cta: s.cta,
        alineacion: "centro",
        overlay: "medio",
        ...(imagen ? { imagen } : {}),
      };
      for (const k of Object.keys(nuevo)) if (nuevo[k] === undefined) delete nuevo[k];
      cambios[ruta] = nuevo;
      console.log(`  Cierre «${s.titulo ?? ""}»: ctaImageBanner → ctaBanner (el de Marketing)${imagen ? " con la imagen del hombre y el delfín" : ""}`);
    } else if (s._type === "ctaBanner" && !s.imagen && copiaImagen()) {
      cambios[`${ruta}.imagen`] = copiaImagen();
      console.log(`  Cierre «${s.titulo ?? ""}»: recibe la imagen del hombre y el delfín`);
    }
  }

  const n = Object.keys(cambios).length;
  total += n;
  if (n > 0 && aplicar) {
    respaldar(id, doc);
    const res = await client.patch(id).set(cambios).commit();
    console.log("  Listo. rev:", res._rev);
  } else if (n === 0) {
    console.log("  Nada que cambiar.");
  }
}

{
  const id = "chatbotsCrmPage";
  const doc = await client.getDocument(id);
  console.log(`\n${id}`);
  const secciones = (doc?.sections as Obj[] | undefined) ?? [];
  const cambios: Record<string, unknown> = {};
  for (const s of secciones) {
    if (s._type === "ctaBanner" && !s.imagen && copiaImagen()) {
      cambios[`sections[_key=="${s._key}"].imagen`] = copiaImagen();
      console.log(`  Cierre «${s.titulo ?? ""}»: recibe la imagen del hombre y el delfín`);
    }
  }
  const n = Object.keys(cambios).length;
  total += n;
  if (n > 0 && aplicar) {
    respaldar(id, doc);
    const res = await client.patch(id).set(cambios).commit();
    console.log("  Listo. rev:", res._rev);
  } else if (n === 0) {
    console.log("  Nada que cambiar.");
  }
}

if (!aplicar) console.log(`\nDry run: ${total} cambio(s) en total, no se escribió nada. Vuelve a correrlo con --aplicar.`);
