import { defineField, defineArrayMember } from "sanity";
import { campoImagen } from "../objects/campoImagen";

/**
 * Un giro de negocio con sus empresas. Lo comparten dos secciones:
 *  - "Clientes y casos de éxito" (clientsBanner, Marketing Digital): giro +
 *    empresas, con un video al lado.
 *  - "Clientes + demo de WhatsApp" (chatClientsBanner, FENIAX): el mismo
 *    giro, más su conversación de demostración.
 *
 * Factorizado acá para que los dos cargadores de giros sean exactamente el
 * mismo formulario (mismos nombres de campo, mismos datos): `extras` agrega
 * lo propio de cada sección al final del giro.
 *
 * NOMBRE DEL MIEMBRO: "categoriaIcono" se conserva tal cual (así se llamaba
 * cuando solo eran íconos) para no migrar los giros ya cargados.
 */

export const OPCIONES_ICONO = [
  { title: "Edificio — construcción", value: "construccion" },
  { title: "Destello — belleza", value: "belleza" },
  { title: "Apretón de manos — servicios", value: "servicios" },
  { title: "Tienda — comercio", value: "comercio" },
  { title: "Cohete — emprendedores", value: "emprendedores" },
  { title: "Pulso — salud", value: "salud" },
  { title: "Cubiertos — gastronomía", value: "gastronomia" },
  { title: "Chip — tecnología", value: "tecnologia" },
  { title: "Auto — automotriz", value: "automotriz" },
  { title: "Casa — inmobiliaria", value: "inmobiliaria" },
  { title: "Birrete — educación", value: "educacion" },
  { title: "Avión — turismo", value: "turismo" },
];

type Campo = ReturnType<typeof defineField>;

export function miembroGiro({
  descripcionImagen,
  extras = [],
}: {
  descripcionImagen: string;
  extras?: Campo[];
}) {
  return defineArrayMember({
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
        description: descripcionImagen,
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
      ...extras,
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
  });
}
