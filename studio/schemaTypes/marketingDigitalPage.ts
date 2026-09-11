import { defineType, defineField, defineArrayMember } from "sanity";
import { campoImagen } from "./objects/campoImagen";

/**
 * Página /marketing-digital. Documento único (singleton, _id fijo
 * "marketingDigitalPage"): se abre desde su propia entrada del menú.
 *
 * Una pestaña por banner, en el orden en que aparecen en la página:
 * Historia -> Confianza -> Método -> Resultados -> Conversión.
 *
 * LOS CLIENTES no se cargan acá: el carrusel toma las Cuentas activas (menú
 * "Cuentas"), las mismas de /clientes -- así una marca nueva aparece en los
 * dos lugares sin cargarla dos veces. LAS RESEÑAS tampoco: tienen su propio
 * menú, "Reseñas".
 */
export const marketingDigitalPage = defineType({
  name: "marketingDigitalPage",
  title: "Marketing Digital",
  type: "document",
  groups: [
    { name: "equipo", title: "1 · Equipo", default: true },
    { name: "queEs", title: "2 · ¿Qué es DOFI?" },
    { name: "navegamos", title: "3 · Cómo navegamos" },
    { name: "metodo", title: "4 · Método" },
    { name: "clientes", title: "5 · Clientes" },
    { name: "resenas", title: "6 · Reseñas" },
    { name: "ctaFinal", title: "7 · Cierre" },
  ],
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
      name: "equipo",
      title: "Banner 1 — Equipo DOFI",
      type: "mdBannerFoto",
      group: "equipo",
      description: "Abre la página. Foto de Daniel al frente con el equipo detrás.",
    }),
    defineField({
      name: "queEs",
      title: "Banner 2 — ¿Qué es DOFI?",
      type: "mdPiezaGrafica",
      group: "queEs",
    }),
    defineField({
      name: "navegamos",
      title: "Banner 3 — ¿Cómo navegamos contigo?",
      type: "mdPiezaGrafica",
      group: "navegamos",
    }),
    defineField({
      name: "metodo",
      title: "Banner 4 — Método DOFI",
      type: "object",
      group: "metodo",
      fields: [
        defineField({
          name: "imagenes",
          title: "Piezas del método",
          type: "array",
          description:
            "Hasta 2 piezas gráficas terminadas. Se muestran completas, una debajo de la otra, sin recortes.",
          of: [
            defineArrayMember({
              type: "image",
              fields: [
                defineField({
                  name: "alt",
                  title: "Texto alternativo",
                  type: "string",
                  description: "Copiá lo que dice la pieza.",
                }),
              ],
            }),
          ],
          validation: (Rule) => Rule.max(2),
        }),
        defineField({
          name: "titulo",
          title: "Título",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "introduccion",
          title: "Introducción (opcional)",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "pasos",
          title: "Pasos",
          type: "array",
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
          title: "Mostrar los pasos como texto",
          type: "boolean",
          description:
            "Apagalo si las piezas del método ya muestran los pasos dibujados: así no se leen dos veces.",
          initialValue: true,
        }),
        defineField({
          name: "mensajeFinal",
          title: "Mensaje final",
          type: "string",
          description: 'Ej: "Ventas inteligentes garantizadas."',
        }),
        defineField({ name: "cta", title: "Botón", type: "ctaSimple" }),
        defineField({
          name: "animar",
          title: "Animaciones",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "clientes",
      title: "Banner 5 — Clientes y casos de éxito",
      type: "object",
      group: "clientes",
      description:
        "El carrusel de logos toma automáticamente las Cuentas activas (menú Cuentas). Para que aparezca un logo, subilo en la cuenta.",
      fields: [
        defineField({
          name: "titulo",
          title: "Título",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "descripcion", title: "Descripción (opcional)", type: "text", rows: 2 }),
        defineField({
          name: "categorias",
          title: "Rubros (íconos)",
          type: "array",
          description: "Íconos de los rubros que atiende DOFI. Son visuales: no clasifican a cada cliente.",
          of: [
            defineArrayMember({
              type: "object",
              name: "categoriaIcono",
              title: "Rubro",
              fields: [
                defineField({
                  name: "nombre",
                  title: "Nombre",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "icono",
                  title: "Ícono",
                  type: "string",
                  description: "Una clave fija: el sitio dibuja siempre el mismo estilo de ícono.",
                  options: {
                    list: [
                      { title: "Edificio — construcción", value: "construccion" },
                      { title: "Destello — belleza", value: "belleza" },
                      { title: "Apretón de manos — servicios", value: "servicios" },
                      { title: "Tienda — comercio", value: "comercio" },
                      { title: "Cohete — emprendedores", value: "emprendedores" },
                      { title: "Pulso — salud", value: "salud" },
                      { title: "Cubiertos — gastronomía", value: "gastronomia" },
                      { title: "Chip — tecnología", value: "tecnologia" },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: { select: { title: "nombre", subtitle: "icono" } },
            }),
          ],
        }),
        defineField({
          name: "multimedia",
          title: "Zona multimedia (derecha)",
          type: "object",
          description: "Si la dejás vacía, el carrusel de logos ocupa todo el ancho.",
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: "tipo",
              title: "Mostrar",
              type: "string",
              options: {
                list: [
                  { title: "Video", value: "video" },
                  { title: "Imagen", value: "imagen" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "video",
            }),
            defineField({
              name: "video",
              title: "Video",
              type: "file",
              options: { accept: "video/*" },
              description: "MP4 recomendado. No arranca solo: se reproduce cuando el visitante lo decide.",
            }),
            campoImagen({
              name: "poster",
              title: "Portada del video",
              description: "Lo que se ve antes de darle play.",
            }),
            campoImagen({ name: "imagen", title: "Imagen" }),
            defineField({ name: "testimonio", title: "Testimonio", type: "testimonio" }),
            defineField({ name: "texto", title: "Texto", type: "text", rows: 3 }),
            defineField({
              name: "cuentaRelacionada",
              title: "Cliente del caso",
              type: "reference",
              to: [{ type: "cuenta" }],
              description: "Opcional: muestra el nombre (y el logo, si lo tiene) del cliente de este caso.",
            }),
          ],
        }),
        defineField({ name: "cta", title: "Botón", type: "ctaSimple" }),
        defineField({ name: "animar", title: "Animaciones", type: "boolean", initialValue: true }),
      ],
    }),
    defineField({
      name: "resenas",
      title: "Banner 6 — Reseñas de Google",
      type: "object",
      group: "resenas",
      description:
        'Las reseñas se cargan en el menú "Reseñas". Mientras no haya ninguna, la sección invita a leerlas en Google.',
      fields: [
        defineField({
          name: "titulo",
          title: "Título",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "descripcion", title: "Descripción (opcional)", type: "text", rows: 2 }),
        defineField({
          name: "enlaceGoogle",
          title: "Enlace al perfil de Google",
          type: "url",
          description: "Donde están todas las reseñas. Por defecto, la ficha de Google Maps del local.",
        }),
        defineField({ name: "animar", title: "Animaciones", type: "boolean", initialValue: true }),
      ],
    }),
    defineField({
      name: "ctaFinal",
      title: "Banner 7 — Cierre",
      type: "mdBannerFoto",
      group: "ctaFinal",
      description: "Cierra la página. Foto de Daniel dando la mano.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Marketing Digital" }),
  },
});
