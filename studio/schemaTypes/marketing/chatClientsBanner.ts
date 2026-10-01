import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";
import { miembroGiro } from "./giroNegocio";

/**
 * Sección "Clientes + demo de WhatsApp" (página FENIAX / ChatBots-CRM).
 *
 * Es la sección de Clientes de Marketing Digital con una diferencia: en vez
 * de un video, la columna derecha es un teléfono con una conversación de
 * WhatsApp que se escribe sola, y cambia con el giro abierto (Gastronomía ->
 * alguien reservando mesa con la IA de un restaurante; Automotriz -> alguien
 * pidiendo una prueba de manejo...).
 *
 * GIROS: mismo formulario que en Marketing Digital (giroNegocio.ts) + una
 * "Demo de WhatsApp" opcional por giro. Sin demo propia, el giro usa la
 * conversación por defecto de su tipo de negocio.
 *
 * SIN GIROS CARGADOS ACÁ, la web muestra los giros de Marketing Digital (las
 * mismas empresas y logos, sin cargarlos dos veces).
 */
export const chatClientsBanner = defineType({
  name: "chatClientsBanner",
  title: "Clientes + demo de WhatsApp",
  type: "object",
  description:
    "Carrusel de giros con sus empresas y, al lado, un teléfono con una demo de WhatsApp de la IA atendiendo a un cliente de ese giro.",
  fieldsets: [
    { name: "giros", title: "Giros de negocio y sus demos", options: { collapsible: true, collapsed: false } },
  ],
  fields: camposBase({
    conImagen: false,
    // Sin "cta": la sección ya no tiene botón (se quitó "Ver casos de éxito").
    omitir: ["destacado", "cta"],
    textos: {
      titulo: "Se muestra en una sola línea en escritorio.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      descripcion: "Opcional: una frase debajo del título. Ej.: «Elige un giro y mira cómo responde la IA».",
    },
    extras: [
      defineField({
        name: "categorias",
        title: "Giros de negocio",
        type: "array",
        fieldset: "giros",
        description:
          "Cada giro es un panel del carrusel y tiene su demo de WhatsApp. Arrastra para reordenar. Para sumar fotos o logos de clientes: entra al giro → «Empresas y logos». Vacío: se usan los giros de Marketing Digital.",
        of: [
          miembroGiro({
            descripcionImagen:
              "Llena el panel: a color cuando el giro está abierto y en gris cuando no. Sin foto, el panel usa los colores FENIAX.",
            extras: [
              defineField({
                name: "chat",
                title: "Demo de WhatsApp de este giro (opcional)",
                type: "chatDemo",
                description:
                  "Vacía: se usa la conversación por defecto según el nombre o ícono del giro (restaurante, autos, inmobiliaria, gimnasio, salón, consultorio, tienda, academia, turismo).",
              }),
            ],
          }),
        ],
      }),
      defineField({
        name: "rotacionAutomatica",
        title: "Pasar solo al siguiente giro",
        type: "boolean",
        fieldset: "giros",
        initialValue: true,
        description:
          "Cuando termina una conversación, se abre el giro siguiente. Si el visitante elige un giro, se queda en ese.",
      }),
      defineField({
        name: "temaChat",
        title: "Apariencia de WhatsApp",
        type: "string",
        fieldset: "giros",
        options: {
          list: [
            { title: "Claro", value: "claro" },
            { title: "Oscuro", value: "oscuro" },
          ],
          layout: "radio",
          direction: "horizontal",
        },
        initialValue: "claro",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo" },
    prepare: ({ titulo, activo }) => ({
      title: titulo || "Clientes + demo de WhatsApp",
      subtitle: `Clientes + WhatsApp${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
