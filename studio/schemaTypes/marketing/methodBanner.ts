import { defineType, defineField, defineArrayMember } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección de recorrido: pasos numerados hasta un resultado final.
 * Reutilizable en cualquier página de sections[] (Marketing Digital la usa
 * como "Método DOFI en 5 pasos"; el título real sale del campo "Título" de
 * cada instancia).
 */
export const methodBanner = defineType({
  name: "methodBanner",
  title: "Método en pasos",
  type: "object",
  fields: camposBase({
    imagenRecortable: false,
    textos: {
      imagen: "Opcional: pieza gráfica del método. Se muestra completa, arriba del recorrido.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      descripcion: "Opcional: una frase debajo del título.",
      destacado:
        "El destino del recorrido: se muestra como la última parada, destacada. Ej: Ventas Inteligentes Garantizadas.",
    },
    extras: [
      defineField({
        name: "pasos",
        title: "Pasos",
        type: "array",
        description: "En orden. Cada paso lleva un ícono según su posición (exploración, ruta, lanzamiento, navegación, resultados).",
        of: [
          defineArrayMember({
            type: "object",
            name: "pasoMetodo",
            title: "Paso",
            fields: [
              defineField({
                name: "titulo",
                title: "Título",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              defineField({ name: "descripcion", title: "Descripción", type: "string" }),
            ],
            preview: { select: { title: "titulo", subtitle: "descripcion" } },
          }),
        ],
      }),
      defineField({
        name: "mostrarPasos",
        title: "Mostrar el recorrido",
        type: "boolean",
        initialValue: true,
        description: "Apágalo si la pieza gráfica del método ya muestra los pasos dibujados: así no se leen dos veces.",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Método en pasos",
      subtitle: `Método en pasos${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
