import type { StructureResolver } from "sanity/structure";

/**
 * Menu del Studio agrupado en tres secciones claras (Cuentas, Contenidos,
 * Servicios) en vez de la lista plana por defecto de Sanity. Cualquier tipo
 * de documento nuevo que se agregue mas adelante aparece igual, debajo del
 * divisor, para no tener que tocar este archivo cada vez.
 */
/** paginaInicio es singleton: un solo documento con id fijo, se abre
 *  directo en su formulario en vez de una lista con un "Crear nuevo" que
 *  invitaria a crear duplicados que src/lib/sanity.ts no busca (la query
 *  siempre trae el primero con ese _type). */
const ID_PAGINA_INICIO = "paginaInicio";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("DOFI CMS")
    .items([
      S.listItem()
        .title("Página de inicio")
        .schemaType("paginaInicio")
        .child(
          S.document()
            .schemaType("paginaInicio")
            .documentId(ID_PAGINA_INICIO)
            .title("Página de inicio")
        ),
      S.divider(),
      S.listItem()
        .title("Cuentas")
        .schemaType("cuenta")
        .child(S.documentTypeList("cuenta").title("Cuentas")),
      S.listItem()
        .title("Contenidos")
        .schemaType("contenido")
        .child(S.documentTypeList("contenido").title("Contenidos")),
      S.listItem()
        .title("Servicios")
        .schemaType("servicio")
        .child(S.documentTypeList("servicio").title("Servicios")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          !["cuenta", "contenido", "servicio", "paginaInicio"].includes(item.getId() ?? "")
      ),
    ]);
