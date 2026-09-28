import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Página /asesorias. Documento único (singleton, _id fijo "asesoriasPage"),
 * con su propia entrada en el menú.
 *
 * Mismo sistema que Marketing Digital: todo el contenido es la lista
 * `sections[]`, en ESE orden -- se cambia arrastrando. Para ocultar una
 * sección sin borrarla, se apaga "Mostrar en la página" dentro de ella.
 *
 * Sin Clientes ni Reseñas a propósito: esos dos tipos dependen de datos que
 * se cargan a mano dentro de la propia sección (giros de negocio), y
 * repetirlos en varias páginas obligaría a recargarlos en cada una. Se
 * quedan exclusivos de Marketing Digital.
 *
 * Mientras `sections[]` esté vacío, la página muestra "Página en
 * construcción" -- nunca contenido inventado.
 */
export const asesoriasPage = defineType({
  name: "asesoriasPage",
  title: "Asesorías",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      initialValue: "Asesorías",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      description:
        "Las secciones de la página, en este mismo orden: arrastra para reordenar. Con «Agregar elemento» eliges el tipo de sección. Para ocultar una sin borrarla, entra y apaga «Mostrar en la página».",
      of: [
        defineArrayMember({ type: "teamBanner" }),
        defineArrayMember({ type: "aboutBanner" }),
        defineArrayMember({ type: "navigationBanner" }),
        defineArrayMember({ type: "methodBanner" }),
        defineArrayMember({ type: "ctaBanner" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Asesorías" }),
  },
});
