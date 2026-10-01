import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Una conversación de demostración de WhatsApp (página FENIAX / ChatBots-CRM).
 *
 * En la web se dibuja como un video dentro de un teléfono: el cliente
 * escribe, la IA del negocio responde y al final aparece el aviso de lo que
 * quedó registrado en el CRM. NO es un video que haya que grabar: cambiar un
 * mensaje acá cambia la demo.
 *
 * Todo es opcional: con menos de dos mensajes, la web usa la conversación
 * por defecto del tipo de negocio (restaurante, autos, inmobiliaria...).
 */
export const chatDemo = defineType({
  name: "chatDemo",
  title: "Demo de WhatsApp",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "negocio",
      title: "Nombre en el chat",
      type: "string",
      description:
        "Lo que se lee arriba del chat. Recomendado: «Tu restaurante», «Tu concesionario»... (es una demostración, no la cuenta de un cliente real).",
    }),
    defineField({
      name: "estado",
      title: "Estado bajo el nombre",
      type: "string",
      initialValue: "en línea",
      description: "Mientras la IA escribe, la web muestra «escribiendo…» sola.",
    }),
    defineField({
      name: "avatar",
      title: "Foto de perfil (opcional)",
      type: "image",
      options: { hotspot: true },
      description: "Cuadrada. Sin foto, se usa un círculo con el ícono del giro.",
    }),
    defineField({
      name: "mensajes",
      title: "Mensajes",
      type: "array",
      description:
        "En orden. Alterna cliente y negocio (IA). Mensajes cortos se leen mejor: el teléfono es angosto. Arrastra para reordenar.",
      of: [
        defineArrayMember({
          type: "object",
          name: "mensajeChat",
          title: "Mensaje",
          fields: [
            defineField({
              name: "de",
              title: "Quién escribe",
              type: "string",
              options: {
                list: [
                  { title: "Cliente (burbuja verde, derecha)", value: "cliente" },
                  { title: "Negocio / IA (burbuja blanca, izquierda)", value: "negocio" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "cliente",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "texto", title: "Texto", type: "text", rows: 2 }),
            defineField({
              name: "imagen",
              title: "Foto adjunta (opcional)",
              type: "image",
              options: { hotspot: true },
              description: "Por ejemplo el plato, el auto o el departamento que la IA envía.",
            }),
          ],
          preview: {
            select: { de: "de", texto: "texto", media: "imagen" },
            prepare: ({ de, texto, media }) => ({
              title: texto || "(solo foto)",
              subtitle: de === "negocio" ? "Negocio / IA" : "Cliente",
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "aviso",
      title: "Aviso final del CRM (opcional)",
      type: "object",
      description: "La tarjeta FENIAX CRM que cierra la demo. Ej.: «Reserva registrada» · «Andrea · 4 personas · Hoy 20:00».",
      fields: [
        defineField({ name: "titulo", title: "Título", type: "string" }),
        defineField({ name: "texto", title: "Detalle", type: "string" }),
      ],
    }),
  ],
});
