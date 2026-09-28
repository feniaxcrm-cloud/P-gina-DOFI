import type { StructureResolver } from "sanity/structure";

/**
 * Menu del Studio agrupado en tres secciones claras (Cuentas, Contenidos,
 * Servicios) en vez de la lista plana por defecto de Sanity. Cualquier tipo
 * de documento nuevo que se agregue mas adelante aparece igual, debajo del
 * divisor, para no tener que tocar este archivo cada vez.
 */
/** Todos estos son singleton: un solo documento con id fijo por tipo, se
 *  abren directo en su formulario en vez de una lista con un "Crear nuevo"
 *  que invitaria a crear duplicados que el codigo del sitio no busca (cada
 *  pagina siempre trae el documento de su _type, el primero que encuentra). */
const ID_PAGINA_INICIO = "paginaInicio";
const ID_HERO = "hero";
const ID_BANNERS = "banners";
const ID_MARKETING = "marketingDigitalPage";
const ID_TRAFICO = "traficoAdsPage";
const ID_CRM = "chatbotsCrmPage";
const ID_ASESORIAS = "asesoriasPage";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("DOFI CMS")
    .items([
      // Primero en la lista a propósito (Sprint "Implementación final del
      // Hero + Sanity + Cards", §5): es lo que más se va a tocar -- cambiar
      // la foto del Hero tiene que ser lo primero que se ve al entrar.
      S.listItem()
        .title("Hero")
        .schemaType("hero")
        .child(
          S.document()
            .schemaType("hero")
            .documentId(ID_HERO)
            .title("Hero")
        ),
      S.listItem()
        .title("Página de inicio")
        .schemaType("paginaInicio")
        .child(
          S.document()
            .schemaType("paginaInicio")
            .documentId(ID_PAGINA_INICIO)
            .title("Página de inicio")
        ),
      // Documento propio (antes era una pestaña dentro de "Página de
      // inicio"). Esta entrada existia desde el sprint "no encuentro donde
      // editar las secciones", pero abria paginaInicio y caia en la pestaña
      // "Hero": el structure builder no permite elegir con que pestaña se
      // abre un documento. Ahora abre un formulario que SOLO tiene los 4
      // banners y su boton -- texto, enlace, color y posicion.
      S.listItem()
        .title("Banners")
        .schemaType("banners")
        .child(
          S.document()
            .schemaType("banners")
            .documentId(ID_BANNERS)
            .title("Banners")
        ),
      // Pagina /marketing-digital: documento unico con la lista de secciones.
      S.listItem()
        .title("Marketing Digital")
        .schemaType("marketingDigitalPage")
        .child(
          S.document()
            .schemaType("marketingDigitalPage")
            .documentId(ID_MARKETING)
            .title("Marketing Digital")
        ),
      // Mismo sistema que Marketing Digital (sections[] singleton), sin
      // Clientes ni Reseñas -- ver la nota en cada schemaType.
      S.listItem()
        .title("Tráfico / Ads")
        .schemaType("traficoAdsPage")
        .child(
          S.document()
            .schemaType("traficoAdsPage")
            .documentId(ID_TRAFICO)
            .title("Tráfico / Ads")
        ),
      S.listItem()
        .title("ChatBots / CRM")
        .schemaType("chatbotsCrmPage")
        .child(
          S.document()
            .schemaType("chatbotsCrmPage")
            .documentId(ID_CRM)
            .title("ChatBots / CRM")
        ),
      S.listItem()
        .title("Asesorías")
        .schemaType("asesoriasPage")
        .child(
          S.document()
            .schemaType("asesoriasPage")
            .documentId(ID_ASESORIAS)
            .title("Asesorías")
        ),
      // Reseñas de Google cargadas a mano (las usa Marketing Digital).
      S.listItem()
        .title("Reseñas")
        .schemaType("resena")
        .child(S.documentTypeList("resena").title("Reseñas")),
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
          ![
            "cuenta",
            "contenido",
            "servicio",
            "paginaInicio",
            "hero",
            "banners",
            "marketingDigitalPage",
            "traficoAdsPage",
            "chatbotsCrmPage",
            "asesoriasPage",
            "resena",
          ].includes(item.getId() ?? "")
      ),
    ]);
