import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Página /marketing-digital. Documento único (singleton, _id fijo
 * "marketingDigitalPage"), con su propia entrada en el menú.
 *
 * Todo el contenido es la lista `sections[]`. Cada elemento es una sección
 * de un tipo (Equipo, ¿Qué es DOFI?, Cómo navegamos, Método, Clientes,
 * Reseñas, Cierre), y EL ORDEN DE LA LISTA ES EL ORDEN DE LA PÁGINA: se
 * cambia arrastrando. Para ocultar una sección sin borrarla, se apaga
 * "Mostrar en la página" dentro de ella.
 *
 * LOS CLIENTES no se cargan acá (salen de las Cuentas activas) y LAS
 * RESEÑAS tampoco (tienen su propio menú).
 */
export const marketingDigitalPage = defineType({
  name: "marketingDigitalPage",
  title: "Marketing Digital",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      initialValue: "Marketing Digital",
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
        defineArrayMember({ type: "clientsBanner" }),
        defineArrayMember({ type: "reviewsBanner" }),
        defineArrayMember({ type: "ctaBanner" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Marketing Digital" }),
  },
});
