import { defineField } from "sanity";
import { campoImagen } from "../objects/campoImagen";

/**
 * Campos comunes a las 7 secciones de Marketing Digital, los que pide el
 * brief para todas: mostrar/ocultar, imagen, imagen móvil, subtítulo,
 * título, descripción, texto destacado, botón (texto + enlace) y
 * animaciones.
 *
 * ORDEN: no hay campo numérico. El orden de las secciones es el de la lista
 * en el Studio y se cambia arrastrando; un número aparte terminaría
 * contradiciendo a la lista.
 *
 * Cada tipo ajusta las descripciones (qué significa "texto destacado" en su
 * sección) y agrega sus propios campos: `extras` van después del texto
 * destacado, `diseno` al final.
 */

type Campo = ReturnType<typeof defineField>;
type Textos = Partial<
  Record<"imagen" | "imagenMovil" | "subtitulo" | "titulo" | "descripcion" | "destacado" | "cta", string>
>;

export function camposBase({
  conImagen = true,
  imagenRecortable = true,
  textos = {},
  extras = [],
  diseno = [],
  omitir = [],
}: {
  conImagen?: boolean;
  imagenRecortable?: boolean;
  textos?: Textos;
  extras?: Campo[];
  diseno?: Campo[];
  /** Campos que la seccion no muestra: un campo que no hace nada solo
   *  confunde a quien edita. */
  omitir?: Array<"subtitulo" | "descripcion" | "destacado" | "cta">;
} = {}): Campo[] {
  return [
    defineField({
      name: "activo",
      title: "Mostrar en la página",
      type: "boolean",
      initialValue: true,
      description: "Apágalo para ocultar la sección sin borrarla.",
    }),
    ...(conImagen
      ? [
          campoImagen({
            name: "imagen",
            title: "Imagen",
            recortable: imagenRecortable,
            description: textos.imagen,
          }),
          campoImagen({
            name: "imagenMovil",
            title: "Imagen para móvil (opcional)",
            recortable: imagenRecortable,
            description:
              textos.imagenMovil ??
              "Una versión compuesta para teléfono. Sin ella, en móvil se usa la imagen de arriba.",
          }),
        ]
      : []),
    defineField({ name: "subtitulo", title: "Subtítulo", type: "string", description: textos.subtitulo }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description: textos.titulo,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 4,
      description: textos.descripcion ?? "Deja una línea en blanco para separar párrafos.",
    }),
    defineField({ name: "destacado", title: "Texto destacado", type: "string", description: textos.destacado }),
    ...extras,
    defineField({ name: "cta", title: "Botón (CTA)", type: "ctaSimple", description: textos.cta }),
    defineField({
      name: "animar",
      title: "Animaciones",
      type: "boolean",
      initialValue: true,
      description: "Entradas suaves al hacer scroll. Apágalas para que todo aparezca quieto.",
    }),
    ...diseno,
  ].filter((campo) => !(omitir as string[]).includes(campo.name));
}

export function campoAlineacion(porDefecto: "izquierda" | "centro" | "derecha") {
  return defineField({
    name: "alineacion",
    title: "Posición del contenido",
    type: "string",
    description: "En escritorio. En móvil el texto va siempre abajo.",
    options: {
      list: [
        { title: "Izquierda", value: "izquierda" },
        { title: "Centro", value: "centro" },
        { title: "Derecha", value: "derecha" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: porDefecto,
  });
}

export function campoOverlay() {
  return defineField({
    name: "overlay",
    title: "Oscurecer la foto (overlay)",
    type: "string",
    description: "Oscurece la foto del lado del texto para que se lea bien. Si la foto es clara, súbelo.",
    options: {
      list: [
        { title: "Nada", value: "ninguno" },
        { title: "Suave", value: "suave" },
        { title: "Medio", value: "medio" },
        { title: "Fuerte", value: "fuerte" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "medio",
  });
}
