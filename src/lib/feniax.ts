import { sanityQuery } from "@/lib/sanity";
import { obtenerResenasGoogle } from "@/lib/google-places";
import { COPY_FENIAX } from "@/lib/feniax-respaldo";
import { company } from "@/config/company";
import {
  IMG,
  LOGO,
  ICONOS_CATEGORIA,
  bool,
  camposBase,
  logosDeGiros,
  normalizarGiros,
  normalizarResenas,
  normalizarSeccion,
  t,
  type BaseSeccion,
  type ClienteMarquesina,
  type GiroNegocio,
  type GiroRaw,
  type IconoCategoria,
  type RespuestaRaw,
  type SeccionCierre,
  type SeccionEquipo,
  type SeccionMetodo,
  type SeccionNavegacion,
  type SeccionQueEs,
  type SeccionRaw,
  type SeccionResenas,
} from "@/lib/marketing-digital";
import { CHAT_FENIAX, plantillaParaGiro, type ChatDemo, type MensajeChat } from "@/lib/chat-demo";
import type { TemaChat } from "@/remotion/feniax/tema";

/**
 * Datos de la pagina FENIAX / ChatBots-CRM (/chatbots-crm).
 *
 * MISMA ESTRUCTURA QUE MARKETING DIGITAL: documento singleton
 * "chatbotsCrmPage" con `sections[]` ordenable en el Studio (Portada, Qué es,
 * Bloque editorial, Método, Clientes, Reseñas, Cierre) y los mismos campos
 * en cada seccion. Lo que cambia es la marca (componentes de
 * src/components/feniax/, con el brandbook de FENIAX) y la seccion de
 * Clientes, que en vez de un video muestra una DEMO DE WHATSAPP por giro de
 * negocio (tipo "chatClientsBanner", ver src/lib/chat-demo.ts).
 *
 * CLIENTES SIN GIROS PROPIOS: si la seccion de FENIAX no tiene giros
 * cargados, usa los de Marketing Digital (las mismas empresas y logos, sin
 * cargarlos dos veces). En cuanto se agregue un giro en la seccion de
 * FENIAX, manda esa lista.
 *
 * RESPALDO: mientras el documento no tenga NINGUNA seccion activa, la pagina
 * se arma con respaldo() (abajo), con los textos de src/lib/feniax-respaldo.ts
 * (brandbook de FENIAX). Con una sola seccion activa en el Studio, manda el
 * Studio. scripts/sembrar-feniax.mts carga esos mismos textos en el Studio.
 */

// ============================================================
// Tipos
// ============================================================

export type GiroConChat = GiroNegocio & { chat: ChatDemo };

export type SeccionClientesChat = BaseSeccion & {
  tipo: "chatClientsBanner";
  giros: GiroConChat[];
  /** Al terminar una conversacion, pasar sola al siguiente giro. */
  rotacionAutomatica: boolean;
  temaChat: TemaChat;
  clientes: ClienteMarquesina[];
};

export type SeccionFeniax =
  | SeccionEquipo
  | SeccionQueEs
  | SeccionNavegacion
  | SeccionMetodo
  | SeccionClientesChat
  | SeccionResenas
  | SeccionCierre;

export type TipoSeccionFeniax = SeccionFeniax["tipo"];

export type PaginaFeniax = {
  secciones: SeccionFeniax[];
  /** La conversacion del telefono de la portada. */
  chatPortada: ChatDemo;
};

// ============================================================
// Respaldo (textos en src/lib/feniax-respaldo.ts)
// ============================================================

function base(key: string, parcial: Partial<BaseSeccion>): BaseSeccion {
  return {
    key,
    imagen: null,
    imagenMovil: null,
    subtitulo: "",
    titulo: "",
    descripcion: "",
    destacado: "",
    cta: null,
    animar: true,
    ...parcial,
  };
}

function respaldo(girosMarketing: GiroConChat[], resenas: SeccionResenas["resenas"]): SeccionFeniax[] {
  const c = COPY_FENIAX;
  return [
    { ...base("feniax-portada", { ...c.portada, cta: { ...c.portada.cta } }), tipo: "teamBanner", alineacion: "izquierda", overlay: "medio" },
    { ...base("feniax-que-es", c.queEs), tipo: "aboutBanner" },
    { ...base("feniax-editorial", c.editorial), tipo: "navigationBanner" },
    {
      ...base("feniax-metodo", { titulo: c.metodo.titulo, descripcion: c.metodo.descripcion, destacado: c.metodo.destacado, cta: { ...c.metodo.cta } }),
      tipo: "methodBanner",
      mostrarPasos: true,
      pasos: c.metodo.pasos.map((p) => ({ ...p })),
    },
    {
      ...base("feniax-clientes", { titulo: c.clientes.titulo, descripcion: c.clientes.descripcion }),
      tipo: "chatClientsBanner",
      giros: girosMarketing,
      rotacionAutomatica: true,
      temaChat: "claro",
      clientes: logosDeGiros(girosMarketing),
    },
    {
      ...base("feniax-resenas", c.resenas),
      tipo: "reviewsBanner",
      enlaceGoogle: company.location.mapsUrl,
      resenas,
      cantidadMostrada: null,
      autoplay: false,
      velocidadAutoplay: 6,
    },
    { ...base("feniax-cierre", { ...c.cierre, cta: { ...c.cierre.cta } }), tipo: "ctaBanner", alineacion: "centro", overlay: "medio" },
  ];
}

// ============================================================
// Consulta
// ============================================================

/** Una conversacion de demo tal como se carga en el Studio (tipo chatDemo). */
const CHAT = `negocio, estado, "avatar": avatar.asset->url, "mensajes": mensajes[]{ de, texto, "imagen": imagen.asset->url }, aviso{ titulo, texto }`;

const GIRO = `_key, nombre, icono,
  "imagen": imagen{ ${IMG} },
  "empresas": empresas[]{
    _key,
    defined(_ref) => @->{ nombre, activa, ${LOGO} },
    !defined(_ref) => { nombre, ${LOGO} }
  }`;

const QUERY_FENIAX = `{
  "pagina": *[_type == "chatbotsCrmPage"][0]{
    "chatPortada": chatPortada{ ${CHAT} },
    sections[]{
      _type, _key, activo, subtitulo, titulo, descripcion, destacado, animar,
      cta{ texto, enlace },
      "imagen": imagen{ ${IMG} },
      "imagenMovil": imagenMovil{ ${IMG} },
      _type in ["teamBanner", "ctaBanner"] => { alineacion, overlay },
      _type == "methodBanner" => { mostrarPasos, pasos[]{ titulo, descripcion } },
      _type == "chatClientsBanner" => {
        "giros": categorias[]{ ${GIRO}, "chat": chat{ ${CHAT} } },
        rotacionAutomatica, temaChat
      },
      _type == "reviewsBanner" => { enlaceGoogle, cantidadMostrada, autoplay, velocidadAutoplay }
    }
  },
  "girosMarketing": *[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias[]{ ${GIRO} },
  "resenas": *[_type == "resena" && activa != false] | order(orden asc, _createdAt desc){
    "id": _id, nombre, empresa, estrellas, comentario, fecha,
    "foto": foto.asset->url + "?w=160&h=160&fit=crop&auto=format",
    "enlace": enlaceOriginal
  }
}`;

type Txt = string | null | undefined;

type ChatRaw = {
  negocio?: Txt;
  estado?: Txt;
  avatar?: Txt;
  mensajes?: { de?: Txt; texto?: Txt; imagen?: Txt }[] | null;
  aviso?: { titulo?: Txt; texto?: Txt } | null;
} | null;

type GiroChatRaw = NonNullable<GiroRaw> & { chat?: ChatRaw };

type SeccionFeniaxRaw = SeccionRaw & { giros?: GiroChatRaw[] | null; temaChat?: Txt };

type RespuestaFeniax = {
  pagina: { chatPortada?: ChatRaw; sections?: SeccionFeniaxRaw[] | null } | null;
  girosMarketing: GiroRaw[] | null;
  resenas: RespuestaRaw["resenas"];
};

// ============================================================
// Normalizado
// ============================================================

/** Una conversacion cargada en el Studio cuenta solo si tiene al menos dos
 *  mensajes con texto o foto (una pregunta y su respuesta). Si no, el giro
 *  usa la plantilla de su tipo de negocio. */
function normalizarChat(raw: ChatRaw | undefined, respaldoChat: ChatDemo): ChatDemo {
  const mensajes: MensajeChat[] = (raw?.mensajes ?? [])
    .map((m) => ({
      de: m?.de === "negocio" ? ("negocio" as const) : ("cliente" as const),
      texto: t(m?.texto),
      imagen: t(m?.imagen) ? `${t(m?.imagen)}?w=640&auto=format` : null,
    }))
    .filter((m) => m.texto || m.imagen);

  if (mensajes.length < 2) return respaldoChat;

  const avisoTitulo = t(raw?.aviso?.titulo);
  return {
    negocio: t(raw?.negocio) || respaldoChat.negocio,
    estado: t(raw?.estado) || "en línea",
    avatar: t(raw?.avatar) ? `${t(raw?.avatar)}?w=120&h=120&fit=crop&auto=format` : respaldoChat.avatar,
    icono: respaldoChat.icono,
    mensajes,
    aviso: avisoTitulo ? { titulo: avisoTitulo, texto: t(raw?.aviso?.texto) } : null,
  };
}

function iconoDe(v: Txt): IconoCategoria | null {
  return (ICONOS_CATEGORIA as readonly string[]).includes(t(v)) ? (t(v) as IconoCategoria) : null;
}

/** Giros con su conversacion. Reutiliza normalizarGiros (empresas, logos,
 *  Cuentas apagadas) y le suma el chat de cada giro, en el mismo orden. */
function girosConChat(raw: GiroChatRaw[] | GiroRaw[] | null | undefined): GiroConChat[] {
  const crudos = (raw ?? []).filter((g): g is NonNullable<GiroRaw> => Boolean(g && t(g.nombre)));
  return normalizarGiros(crudos).map((g, i) => {
    const plantilla = plantillaParaGiro(g.nombre, iconoDe(crudos[i]?.icono));
    return { ...g, chat: normalizarChat((crudos[i] as GiroChatRaw).chat, plantilla) };
  });
}

function normalizarSeccionFeniax(
  raw: SeccionFeniaxRaw,
  resenas: SeccionResenas["resenas"],
  girosMarketing: GiroConChat[]
): SeccionFeniax | null {
  if (!raw || raw.activo === false) return null;

  if (raw._type === "chatClientsBanner") {
    const propios = girosConChat(raw.giros);
    const giros = propios.length > 0 ? propios : girosMarketing;
    return {
      ...camposBase(raw, false),
      // Sin boton: "Ver casos de éxito" se quito de Clientes (2026-10-01).
      cta: null,
      tipo: "chatClientsBanner",
      giros,
      rotacionAutomatica: bool(raw.rotacionAutomatica, true),
      temaChat: t(raw.temaChat) === "oscuro" ? "oscuro" : "claro",
      clientes: logosDeGiros(giros),
    };
  }

  // Los demas tipos son los de Marketing Digital, con la misma normalizacion.
  // clientsBanner (el de video) no forma parte de esta pagina.
  const s = normalizarSeccion(raw, resenas);
  return s && s.tipo !== "clientsBanner" ? s : null;
}

export async function getPaginaFeniax(): Promise<PaginaFeniax> {
  const [respuesta, resenasGoogle] = await Promise.all([
    sanityQuery<RespuestaFeniax>(QUERY_FENIAX),
    obtenerResenasGoogle(),
  ]);
  const resenas =
    resenasGoogle && resenasGoogle.length > 0 ? resenasGoogle : normalizarResenas(respuesta?.resenas);
  const girosMarketing = girosConChat(respuesta?.girosMarketing);

  const secciones = (respuesta?.pagina?.sections ?? [])
    .map((s) => normalizarSeccionFeniax(s, resenas, girosMarketing))
    .filter((s): s is SeccionFeniax => s !== null);

  return {
    secciones: secciones.length > 0 ? secciones : respaldo(girosMarketing, resenas),
    chatPortada: normalizarChat(respuesta?.pagina?.chatPortada, CHAT_FENIAX),
  };
}
