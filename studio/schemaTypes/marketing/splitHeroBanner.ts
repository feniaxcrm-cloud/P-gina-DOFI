import { defineType } from "sanity";
import { camposBase } from "./camposBase";
import { campoImagen } from "../objects/campoImagen";

/**
 * Portada con logo e imagen (página Asesorías).
 *
 *   ┌──────────────────────────────┬──────────────────────┐
 *   │ Título                       │                      │
 *   │ [logo]                       │   imagen completa    │
 *   │ frase                        │   (fondo transparente │
 *   │ [botón]                      │    ideal)            │
 *   └──────────────────────────────┴──────────────────────┘
 *
 * Fondo morado de marca, como el banner de «Rescatando Emprendedores» del
 * Home. La imagen y el logo se muestran completos, sin recortes: por eso no
 * tienen punto focal.
 */
export const splitHeroBanner = defineType({
  name: "splitHeroBanner",
  title: "Portada con logo e imagen",
  type: "object",
  fields: camposBase({
    imagenRecortable: false,
    textos: {
      imagen:
        "La imagen de la derecha (ej.: el grupo de emprendedores). Se muestra completa, sin recortes: lo ideal es un PNG o WebP con fondo transparente, así se apoya directo sobre el fondo morado.",
      imagenMovil: "Opcional: otra versión para teléfono. Sin ella, en móvil se usa la de arriba.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      titulo: "Ej.: Asesorías 1 a 1.",
      descripcion: "La frase que va debajo del logo.",
      destacado: "Opcional: una frase corta en naranja debajo de la descripción.",
      cta: "El botón de la portada. Ej.: «Quiero mejorar mis ventas» → /contactanos?servicio=asesorias.",
    },
    extras: [
      campoImagen({
        name: "logo",
        title: "Logo (debajo del título)",
        recortable: false,
        description:
          "Ej.: el logo de «Rescatando Emprendedores». PNG o WebP con fondo transparente; se muestra completo. En el texto alternativo escribe lo que dice el logo.",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Portada con logo e imagen",
      subtitle: `Portada${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
