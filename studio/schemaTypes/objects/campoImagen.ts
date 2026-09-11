import { defineField } from "sanity";

/**
 * Campo de imagen con su texto alternativo ADENTRO (image.alt), no como un
 * campo hermano suelto. Asi el alt viaja pegado a su archivo: si se
 * reemplaza la imagen, el editor lo ve justo ahi; si se borra, se va con
 * ella. Es la forma idiomatica de Sanity.
 *
 * `recortable` activa hotspot + recorte (son la misma herramienta en el
 * editor). Va apagado en las piezas graficas terminadas: esas se muestran
 * completas, nunca recortadas, asi que ofrecer un punto focal solo
 * confundiria.
 */
export function campoImagen({
  name,
  title,
  description,
  recortable = true,
  fieldset,
}: {
  name: string;
  title: string;
  description?: string;
  recortable?: boolean;
  fieldset?: string;
}) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    fieldset,
    options: { hotspot: recortable },
    fields: [
      defineField({
        name: "alt",
        title: "Texto alternativo",
        type: "string",
        description:
          "Qué muestra la imagen, en una frase. Lo leen los lectores de pantalla y Google. Si la imagen tiene texto dibujado, escribilo acá.",
      }),
    ],
  });
}
