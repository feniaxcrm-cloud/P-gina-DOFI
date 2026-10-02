import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Página /chatbots-crm: FENIAX, el CRM con IA. Documento único (singleton,
 * _id fijo "chatbotsCrmPage"), con su propia entrada en el menú.
 *
 * MISMA ESTRUCTURA QUE MARKETING DIGITAL: todo el contenido es la lista
 * `sections[]`, en ESE orden -- se cambia arrastrando. Para ocultar una
 * sección sin borrarla, se apaga "Mostrar en la página" dentro de ella. Los
 * campos de cada sección son los mismos; lo que cambia es el diseño (marca
 * FENIAX, según su brandbook).
 *
 * Diferencias con Marketing Digital:
 *  - Clientes es "Clientes + demo de WhatsApp": en vez de video, un teléfono
 *    con la IA atendiendo a un cliente del giro abierto.
 *  - La portada lleva una animación de CRM (ventas, gestión y crecimiento)
 *    hecha con HyperFrames (carpeta video/ del proyecto); no se edita acá.
 *
 * Mientras no haya NINGUNA sección activa, la web muestra un contenido de
 * respaldo armado con el brandbook de FENIAX. Con una sola sección activa,
 * manda lo que esté acá.
 */
export const chatbotsCrmPage = defineType({
  name: "chatbotsCrmPage",
  title: "ChatBots / CRM",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      initialValue: "ChatBots / CRM",
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
        defineArrayMember({ type: "chatClientsBanner" }),
        defineArrayMember({ type: "reviewsBanner" }),
        defineArrayMember({ type: "ctaBanner" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "ChatBots / CRM" }),
  },
});
