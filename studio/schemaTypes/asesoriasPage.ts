import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Página /asesorias: Asesorías 1 a 1 · Rescatando Emprendedores. Documento
 * único (singleton, _id fijo "asesoriasPage"), con su propia entrada en el
 * menú.
 *
 * MISMA ESTRUCTURA QUE MARKETING DIGITAL: todo el contenido es la lista
 * `sections[]`, en ESE orden -- se cambia arrastrando. Para ocultar una
 * sección sin borrarla, se apaga "Mostrar en la página" dentro de ella.
 *
 * Secciones propias de esta página:
 *  - Portada con logo e imagen (splitHeroBanner): título, el logo de
 *    «Rescatando Emprendedores», una frase y la foto a la derecha.
 *  - Clientes + casos de éxito (casesClientsBanner): el carrusel de giros de
 *    siempre y, al lado, un mazo de casos; cada caso trae su imagen y al
 *    pasar de caso el carrusel abre su giro y la muestra.
 *  - Logros (achievementsBanner): tarjetas con foto que reemplazan a las
 *    reseñas en esta página (pedido del 2026-10-07).
 * El resto son las de Marketing Digital (¿Qué es...?, Cierre...).
 *
 * Mientras no haya NINGUNA sección activa, la web muestra un contenido de
 * respaldo con los mismos textos (src/lib/asesorias-respaldo.ts). Con una sola
 * sección activa, manda lo que esté acá.
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
        defineArrayMember({ type: "splitHeroBanner" }),
        defineArrayMember({ type: "aboutBanner" }),
        defineArrayMember({ type: "navigationBanner" }),
        defineArrayMember({ type: "methodBanner" }),
        defineArrayMember({ type: "casesClientsBanner" }),
        defineArrayMember({ type: "achievementsBanner" }),
        defineArrayMember({ type: "reviewsBanner" }),
        defineArrayMember({ type: "ctaBanner" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Asesorías" }),
  },
});
