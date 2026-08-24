import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { deskStructure } from "./deskStructure";

/**
 * Studio de DOFI CMS. Organiza el menu en Cuentas / Contenidos / Servicios
 * (ver deskStructure.ts) para que alguien que no programa pueda administrar
 * el sitio sin perderse en una lista plana de tipos de documento.
 */
export default defineConfig({
  name: "default",
  title: "DOFI CMS",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [structureTool({ structure: deskStructure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
