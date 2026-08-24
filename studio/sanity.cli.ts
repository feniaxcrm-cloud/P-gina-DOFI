import { defineCliConfig } from "sanity/cli";

/**
 * Configuracion que usa el CLI (sanity dev / build / deploy). El projectId y
 * el dataset salen de variables de entorno para no dejarlos escritos a mano
 * en el repo: definilas en studio/.env.local (ver studio/.env.example).
 *
 * projectId no es un secreto, pero mantenerlo fuera del codigo evita tener
 * que editar este archivo si algun dia el proyecto de Sanity cambia.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Fijo para que "sanity deploy" no vuelva a preguntar el hostname.
  // Studio en produccion: https://dofi-cms.sanity.studio
  studioHost: "dofi-cms",
});
