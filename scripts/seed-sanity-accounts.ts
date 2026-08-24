/**
 * Migra las 27 cuentas de src/data/clients.ts a Sanity como documentos
 * "cuenta", mas un documento "servicio" por cada valor unico de services[]
 * ya en uso (Creatividad, Audiovisual, Pauta, CRM, Bot IA).
 *
 * NO migra logo, portada, videos ni gallery: hoy esos campos apuntan a un
 * placeholder compartido (/media/cover-16-9.jpg) o a archivos .mp4 que no
 * existen en disco (confirmado). Subir ese material real desde el Studio es
 * justamente el problema que esta migracion busca resolver — no hay nada
 * real que copiar todavia.
 *
 * Uso:
 *   1. Crea un token de escritura en manage.sanity.io -> tu proyecto ->
 *      API -> Tokens (permiso "Editor" o superior).
 *   2. Copia .env.example a .env.local y completa SANITY_PROJECT_ID,
 *      SANITY_DATASET y SANITY_WRITE_TOKEN (nunca los commitees).
 *   3. npm run seed:sanity
 *
 * Es idempotente: usa un _id deterministico (`cuenta-<slug>`,
 * `servicio-<slug>`), correrlo de nuevo actualiza los documentos en vez de
 * duplicarlos.
 */
import { createClient } from "@sanity/client";
import { clients } from "../src/data/clients";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN. Definilas en .env.local (ver .env.example) antes de correr este script."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const MARCAS_COMBINADAS = /[̀-ͯ]/g;

function slugifyServicio(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(MARCAS_COMBINADAS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

async function main() {
  const nombresServicios = Array.from(new Set(clients.flatMap((c) => c.services)));

  console.log(`Sembrando ${nombresServicios.length} servicios...`);
  const idServicio = new Map<string, string>();
  for (const nombre of nombresServicios) {
    const id = `servicio-${slugifyServicio(nombre)}`;
    idServicio.set(nombre, id);
    await client.createOrReplace({
      _id: id,
      _type: "servicio",
      nombre,
    });
    console.log(`  ✓ ${nombre}`);
  }

  console.log(`\nSembrando ${clients.length} cuentas...`);
  for (const [index, c] of clients.entries()) {
    await client.createOrReplace({
      _id: `cuenta-${c.slug}`,
      _type: "cuenta",
      nombre: c.name,
      slug: { _type: "slug", current: c.slug },
      activa: true,
      orden: index,
      categoria: c.sector || undefined,
      ciudad: c.city || undefined,
      resumen: c.summary,
      servicios: c.services.map((nombre) => ({
        _type: "reference",
        _ref: idServicio.get(nombre)!,
        _key: idServicio.get(nombre)!,
      })),
      reto: c.challenge,
      enfoque: c.approach,
      resultados: c.results?.map((r) => ({
        _type: "resultado",
        _key: `${slugifyServicio(r.label)}-${slugifyServicio(r.value)}`,
        valor: r.value,
        etiqueta: r.label,
      })),
      testimonio: c.testimonial
        ? {
            _type: "testimonio",
            cita: c.testimonial.quote,
            autor: c.testimonial.author,
            cargo: c.testimonial.role,
          }
        : undefined,
    });
    console.log(`  ✓ ${c.name}`);
  }

  console.log("\nListo. Entra al Studio (npm run dev dentro de studio/) para subir logos, portadas y contenidos.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
