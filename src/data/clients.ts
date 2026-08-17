/**
 * Cuentas de DOFI / FENIAX y su material audiovisual.
 *
 * COMO AGREGAR UN VIDEO
 * ---------------------
 * Cada video acepta una de estas dos fuentes:
 *
 *   kind: "youtube"  ->  src = ID del video (lo que va despues de "v=")
 *   kind: "file"     ->  src = ruta dentro de /public, ej "/videos/dukare-spot.mp4"
 *
 * "poster" es la imagen de portada, un archivo dentro de /public.
 * Por ahora todas apuntan a los provisionales de /public/media. Reemplazalos
 * por los fotogramas reales de cada pieza.
 */

export type VideoSource = {
  id: string;
  title: string;
  /** Formato de la pieza, se muestra como metadato bajo el titulo */
  format: string;
  kind: "youtube" | "file";
  src: string;
  poster: string;
  /** Relacion de aspecto real de la pieza */
  ratio: "16/9" | "9/16" | "1/1";
};

/** Dato duro del proyecto. NO inventar: dejar solo los que Daniel confirme. */
export type Result = {
  /** El numero, tal cual. Ej "3x", "-40%", "88" */
  value: string;
  /** Que mide ese numero. Ej "leads por semana" */
  label: string;
};

export type Testimonial = {
  quote: string;
  /** Nombre y cargo de quien lo dice. Nunca solo el nombre. */
  author: string;
  role: string;
};

export type Client = {
  slug: string;
  name: string;
  sector: string;
  city: string;
  /** Frase corta de que se hizo para la cuenta. Max ~18 palabras. */
  summary: string;
  /** Servicios activos en la cuenta */
  services: ("Creatividad" | "Audiovisual" | "Pauta" | "CRM" | "Bot IA")[];
  /** Logo del cliente en /public/clientes. Si no existe se usa el monograma. */
  logo?: string;
  cover: string;
  videos: VideoSource[];

  // --- Campos de la pagina individual /clientes/[slug] ---
  // Todos opcionales: la pagina muestra solo las secciones con contenido.

  /** Reto del negocio antes de entrar. 1-2 parrafos. */
  challenge?: string;
  /** Que se hizo. 1-2 parrafos. */
  approach?: string;
  /** Datos duros. Solo los confirmados; sin datos, no se muestra el bloque. */
  results?: Result[];
  /** Imagenes del proyecto en /public/clientes o /public/media. */
  gallery?: string[];
  testimonial?: Testimonial;
};

export const clients: Client[] = [
  {
    slug: "dukare",
    name: "Dukare",
    sector: "Movilidad",
    city: "Ecuador",
    summary:
      "Lanzamiento de modelos y red de concesionarios con embudo único y bot de WhatsApp.",
    services: ["Creatividad", "Audiovisual", "Pauta", "CRM", "Bot IA"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "dukare-spot",
        title: "Spot de lanzamiento",
        format: "Spot 30s",
        kind: "file",
        src: "/videos/dukare-spot.mp4",
        poster: "/media/cover-16-9.jpg",
        ratio: "16/9",
      },
      {
        id: "dukare-reel",
        title: "Reel de concesionarios",
        format: "Vertical 9:16",
        kind: "file",
        src: "/videos/dukare-reel.mp4",
        poster: "/media/cover-9-16.jpg",
        ratio: "9/16",
      },
    ],
    // Ejemplo de pagina individual completa. Sirve de plantilla para el resto.
    // El texto es editable; los datos duros de "results" estan comentados a
    // proposito porque deben salir del CRM, no inventarse.
    challenge:
      "Dukare crecía con varios concesionarios trabajando cada uno por su lado. Los mensajes llegaban a números distintos, sin un lugar común donde ver el estado de cada prospecto ni quién debía responder.",
    approach:
      "Montamos un embudo único en Kommo para toda la red y un bot de WhatsApp que recibe, califica y reparte cada lead al concesionario que corresponde. En paralelo produjimos el spot de lanzamiento y los reels para sostener la pauta.",
    // results: [
    //   { value: "3x", label: "leads por semana" },
    //   { value: "-40%", label: "tiempo de respuesta" },
    // ],
    gallery: ["/media/cover-16-9.jpg", "/media/cover-9-16.jpg"],
    // testimonial: {
    //   quote: "Frase real del cliente.",
    //   author: "Nombre Apellido",
    //   role: "Cargo, Dukare",
    // },
  },
  {
    slug: "proavic",
    name: "Proavic",
    sector: "Alimentos",
    city: "Ecuador",
    summary:
      "Contenido de producto para mayorista y retail, con pedidos entrando por WhatsApp al CRM.",
    services: ["Audiovisual", "Pauta", "CRM", "Bot IA"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "proavic-producto",
        title: "Línea de producto",
        format: "Institucional 60s",
        kind: "file",
        src: "/videos/proavic-producto.mp4",
        poster: "/media/cover-16-9.jpg",
        ratio: "16/9",
      },
    ],
  },
  {
    slug: "spartagym",
    name: "SpartaGym",
    sector: "Fitness",
    city: "Cuenca",
    summary:
      "Campaña por sede, prueba gratis automatizada y seguimiento de renovaciones en cuatro embudos.",
    services: ["Creatividad", "Audiovisual", "Pauta", "CRM", "Bot IA"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "sparta-campana",
        title: "Campaña de inscripciones",
        format: "Vertical 9:16",
        kind: "file",
        src: "/videos/spartagym-campana.mp4",
        poster: "/media/cover-9-16.jpg",
        ratio: "9/16",
      },
    ],
  },
  {
    slug: "cuenca-tour-360",
    name: "Cuenca Tour 360",
    sector: "Turismo",
    city: "Cuenca",
    summary:
      "Catálogo de 88 tours convertido en piezas de venta y cinco embudos conectados al bot.",
    services: ["Creatividad", "Audiovisual", "CRM", "Bot IA"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "ct360-destinos",
        title: "Serie de destinos",
        format: "Serie social",
        kind: "file",
        src: "/videos/cuencatour-destinos.mp4",
        poster: "/media/cover-16-9.jpg",
        ratio: "16/9",
      },
    ],
  },
  {
    slug: "mi-escondite",
    name: "Mi Escondite",
    sector: "Gastronomía",
    city: "Cuenca",
    summary:
      "Identidad audiovisual de cocina típica y reservas gestionadas con plantillas de WhatsApp.",
    services: ["Creatividad", "Audiovisual", "CRM", "Bot IA"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "escondite-mesa",
        title: "De la brasa a la mesa",
        format: "Gastronómico 45s",
        kind: "file",
        src: "/videos/miescondite-mesa.mp4",
        poster: "/media/cover-16-9.jpg",
        ratio: "16/9",
      },
    ],
  },
  {
    slug: "bondia",
    name: "BonDía",
    sector: "Panadería",
    city: "Cuenca",
    summary:
      "Contenido de vitrina para tres locales y venta directa por WhatsApp con seguimiento.",
    services: ["Audiovisual", "Pauta", "CRM"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "bondia-desayunos",
        title: "Desayunos BonDía",
        format: "Vertical 9:16",
        kind: "file",
        src: "/videos/bondia-desayunos.mp4",
        poster: "/media/cover-9-16.jpg",
        ratio: "9/16",
      },
    ],
  },
  {
    slug: "el-horno",
    name: "El Horno",
    sector: "Distribución",
    city: "Azuay",
    summary:
      "Venta por rutas ordenada en cuatro embudos y material de catálogo para el equipo comercial.",
    services: ["Audiovisual", "CRM"],
    cover: "/media/cover-16-9.jpg",
    videos: [
      {
        id: "horno-rutas",
        title: "Rutas y cobertura",
        format: "Institucional 40s",
        kind: "file",
        src: "/videos/elhorno-rutas.mp4",
        poster: "/media/cover-16-9.jpg",
        ratio: "16/9",
      },
    ],
  },
];

export const allServices = [
  "Creatividad",
  "Audiovisual",
  "Pauta",
  "CRM",
  "Bot IA",
] as const;

