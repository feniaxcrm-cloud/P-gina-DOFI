import { defineType, defineField, defineArrayMember } from "sanity";
import { camposBase } from "./camposBase";
import { campoImagen } from "../objects/campoImagen";

/**
 * Sección "Clientes y casos de éxito".
 *
 *   Giros de negocio  -> cada giro con sus empresas (y el logo de cada una)
 *   Video             -> columna derecha
 *   Marquesina        -> automática: las Cuentas activas (no se carga acá)
 *
 * EMPRESAS DE UN GIRO, sin duplicar datos: lo normal es elegir una Cuenta
 * existente (su nombre y su logo son los de la Cuenta; cambiar el logo en la
 * Cuenta lo cambia en todo el sitio). Para una empresa que no es Cuenta, se
 * agrega con su propio logo.
 *
 * NOMBRE HISTÓRICO: el campo de los giros se llama `categorias` en los datos
 * (así se llamaba cuando solo eran íconos). Se conservó para no migrar el
 * contenido ya cargado; en el Studio se ve como "Giros de negocio".
 */

const OPCIONES_ICONO = [
  { title: "Edificio — construcción", value: "construccion" },
  { title: "Destello — belleza", value: "belleza" },
  { title: "Apretón de manos — servicios", value: "servicios" },
  { title: "Tienda — comercio", value: "comercio" },
  { title: "Cohete — emprendedores", value: "emprendedores" },
  { title: "Pulso — salud", value: "salud" },
  { title: "Cubiertos — gastronomía", value: "gastronomia" },
  { title: "Chip — tecnología", value: "tecnologia" },
];

export const clientsBanner = defineType({
  name: "clientsBanner",
  title: "Clientes y casos de éxito",
  type: "object",
  description:
    "Carrusel de giros de negocio con sus empresas, un video y, debajo, la marquesina de clientes (muestra sola las Cuentas activas).",
  fieldsets: [
    {
      name: "giros",
      title: "Carrusel de giros de negocio",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "video",
      title: "Video (columna derecha)",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: camposBase({
    conImagen: false,
    omitir: ["destacado"],
    textos: {
      titulo: "Se muestra en una sola línea en escritorio.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      descripcion: "Opcional: una frase debajo del título.",
    },
    extras: [
      defineField({
        name: "categorias",
        title: "Giros de negocio",
        type: "array",
        fieldset: "giros",
        description:
          "Cada giro es un panel del carrusel. El orden de esta lista es el orden del carrusel: arrastra para reordenar. Dentro de cada giro agregas sus empresas; sus logos aparecen al abrir el giro. Sin giros, la sección muestra la estructura vacía: nunca se inventan.",
        of: [
          defineArrayMember({
            type: "object",
            name: "categoriaIcono",
            title: "Giro de negocio",
            fields: [
              defineField({
                name: "nombre",
                title: "Nombre del giro",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "icono",
                title: "Ícono (opcional)",
                type: "string",
                description: "Se ve en el panel del giro. Sin ícono, el panel muestra solo el nombre.",
                options: { list: OPCIONES_ICONO },
              }),
              campoImagen({
                name: "imagen",
                title: "Foto del giro (opcional)",
                description:
                  "Llena el panel: a color cuando el giro está abierto y en gris cuando no. Sin foto, el panel usa los colores DOFI.",
              }),
              defineField({
                name: "empresas",
                title: "Empresas y logos de este giro",
                type: "array",
                description:
                  "Sus logos aparecen al abrir el giro, en este orden (arrastra para reordenar). Elige una Cuenta existente o, si la empresa no es Cuenta, agrégala con su logo.",
                of: [
                  defineArrayMember({
                    type: "reference",
                    title: "Cuenta existente",
                    to: [{ type: "cuenta" }],
                    options: { disableNew: true },
                  }),
                  defineArrayMember({
                    type: "object",
                    name: "empresaGiro",
                    title: "Empresa con logo propio",
                    fields: [
                      defineField({
                        name: "nombre",
                        title: "Nombre de la empresa",
                        type: "string",
                        validation: (Rule) => Rule.required(),
                      }),
                      defineField({
                        name: "logo",
                        title: "Logo",
                        type: "image",
                        description:
                          "PNG o SVG, idealmente con fondo transparente. Se muestra completo, sin recortes ni deformación.",
                        validation: (Rule) => Rule.required(),
                      }),
                    ],
                    preview: { select: { title: "nombre", media: "logo" } },
                  }),
                ],
              }),
            ],
            preview: {
              select: { nombre: "nombre", empresas: "empresas", media: "imagen" },
              prepare: ({ nombre, empresas, media }) => {
                const total = Array.isArray(empresas) ? empresas.length : 0;
                return {
                  title: nombre || "Giro sin nombre",
                  subtitle: total === 1 ? "1 empresa" : `${total} empresas`,
                  media,
                };
              },
            },
          }),
        ],
      }),
      defineField({
        name: "rotacionAutomatica",
        title: "Rotación automática",
        type: "boolean",
        fieldset: "giros",
        initialValue: true,
        description:
          "El carrusel avanza solo mientras nadie lo toca. Se detiene cuando el visitante elige un giro y después de dos vueltas.",
      }),
      defineField({
        name: "video",
        title: "Video",
        type: "file",
        fieldset: "video",
        options: { accept: "video/mp4,video/webm" },
        description:
          "MP4 (H.264) liviano, idealmente de menos de 15 MB. Ocupa la columna derecha, al lado del carrusel, y se reproduce en silencio y en bucle mientras está en pantalla. Para cambiarlo, sube otro archivo aquí.",
      }),
      defineField({
        name: "ajusteVideo",
        title: "Ajuste del video en su columna",
        type: "string",
        fieldset: "video",
        description: "En ningún caso se deforma.",
        options: {
          list: [
            { title: "Rellenar la columna (puede recortar los bordes)", value: "rellenar" },
            { title: "Mostrar el video completo (sin recortes)", value: "completo" },
          ],
          layout: "radio",
        },
        initialValue: "rellenar",
      }),
      campoImagen({
        name: "imagen",
        title: "Portada del video (opcional)",
        fieldset: "video",
        description:
          "Se ve mientras el video carga y a quienes prefieren menos movimiento. Idealmente, un cuadro del mismo video.",
      }),
      defineField({
        name: "sonidoVideo",
        title: "Mostrar botón de sonido",
        type: "boolean",
        fieldset: "video",
        initialValue: false,
        description: "Actívalo solo si el audio importa (por ejemplo, un testimonio).",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Clientes y casos de éxito",
      subtitle: `Clientes${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
