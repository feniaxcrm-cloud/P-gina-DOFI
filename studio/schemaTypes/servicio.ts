import { defineType, defineField } from "sanity";

/**
 * Taxonomia de servicios editable desde el Studio: las cuentas referencian
 * estos documentos en vez de tener la lista de servicios escrita en el
 * codigo de la web. Agregar un servicio nuevo (Branding, Desarrollo Web,
 * etc.) no requiere tocar ningun archivo del proyecto.
 */
export const servicio = defineType({
  name: "servicio",
  title: "Servicio",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      validation: (Rule) =>
        Rule.required().custom(async (nombre, context) => {
          if (!nombre) return true;
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2024-01-01" });
          const id = document?._id.replace(/^drafts\./, "") ?? "";
          const query = `!defined(*[
            _type == "servicio" &&
            nombre == $nombre &&
            !(_id in [$draft, $published])
          ][0]._id)`;
          const params = { draft: `drafts.${id}`, published: id, nombre };
          const esUnico = await client.fetch(query, params);
          return esUnico || "Ya existe un servicio con este nombre";
        }),
    }),
  ],
  preview: {
    select: { title: "nombre" },
  },
});
