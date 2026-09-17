import type { CSSProperties, ReactNode } from "react";
import { Anchor, Boat, CompassRose, Crosshair, Sailboat, Star, SteeringWheel } from "@phosphor-icons/react/dist/ssr";

/**
 * Composicion grafica de fondo para las secciones de fondo claro de
 * Marketing Digital (Qué es DOFI sin pieza, Método, Clientes, Reseñas): el
 * universo visual de DOFI -- mar, navegación, delfines, timón, brújula,
 * velero, ancla, líneas de ruta, el propio trazo del logo -- repartido por
 * TODA la sección (no dos líneas abajo y un ícono perdido), monocromático,
 * con profundidad y con movimiento, sin competir con el contenido.
 *
 * SERVIDOR, NO CLIENTE: tanto el hover como la animación ambiental son CSS
 * puro (`group-hover`, `@keyframes` en globals.css), no hace falta
 * JavaScript. Cada sección envuelve su contenido en un contenedor con
 * `group/nautico` (nombrado para no chocar con otros `group` que ya usan
 * esas mismas secciones, como la flecha de "Ver todas en Google"): al pasar
 * el cursor por CUALQUIER parte de la sección -- texto, botones, huecos --
 * los ornamentos reaccionan, porque `pointer-events-none` los vuelve
 * transparentes al puntero: el hover nunca lo capturan ellos, lo calcula el
 * contenedor. Por eso nunca bloquean un click ni interfieren con el carrusel
 * o el video: son inertes de punta a punta.
 *
 * CUATRO CAPAS DE PROFUNDIDAD (`capa`). No todo pesa igual: unos elementos
 * quedan atras (mas transparentes, mas finos) y otros al frente.
 *   - "principal"  -- la pieza grande de cada composicion. 30% de opacidad,
 *     trazo "light" (no "thin": a este tamaño y opacidad un trazo mas grueso
 *     es lo que hace que se LEA, no solo se intuya).
 *   - "secundario" -- una segunda pieza mas chica, mas atras. 20%, "thin",
 *     con un blur casi imperceptible (0.5px) que la hunde un poco mas.
 *   - "linea"      -- rutas y oleaje. 24%, siempre trazo fino.
 *   - "acento"     -- detalles chicos en naranja: nodos, el trazo del logo.
 *     36-40%: el acento tiene que notarse, es lo que da el golpe de color.
 *
 * MOVIMIENTO EN DOS CAPAS QUE NUNCA SE PISAN
 * -----------------------------------------------------------------
 * 1. Ambiental (`ambiente`), perpetuo, CASI imperceptible: una animacion CSS
 *    en globals.css (.anim-flotar/.anim-derivar/.anim-girar/.anim-pulsar)
 *    con duracion y demora por instancia (variables --dur/--retraso, mismo
 *    recurso que ya usa .wall-track), asi varios ornamentos con el mismo
 *    keyframe no laten sincronizados.
 * 2. Hover, al pasar el cursor: se resuelve SOLO segun que propiedad ya usa
 *    la animacion ambiental de ESE elemento, para que nunca compitan por la
 *    misma propiedad (en Tailwind v4 translate/scale/rotate/opacity son
 *    propiedades CSS independientes, asi que dos mecanismos animando
 *    propiedades DISTINTAS del mismo elemento conviven sin problema; la
 *    misma propiedad con dos animaciones si se pisa). Por eso un ornamento
 *    con `ambiente="flotar"` (que ya mueve `translate`) hace hover con
 *    "crecer" (solo `scale`), nunca con "mover" (que tambien es translate).
 *
 * Con movimiento reducido, la regla `[data-ornamento] { animation: none
 * !important }` de globals.css apaga lo ambiental sin tocar el codigo, y el
 * hover ya va gateado con `motion-safe:` (igual que el resto del proyecto).
 */

type Capa = "principal" | "secundario" | "linea" | "acento";
type Ambiente = "flotar" | "derivar" | "girar" | "pulsar";
type Hover = "mover" | "crecer" | "deslizar";
type Color = "brand" | "accent";

const ICONOS = {
  timon: SteeringWheel,
  velero: Sailboat,
  brujula: CompassRose,
  ancla: Anchor,
  barco: Boat,
  coordenadas: Crosshair,
  estrella: Star,
};

/** Clases COMPLETAS y literales (Tailwind escanea el texto del archivo, no
 *  el resultado de concatenar en tiempo de ejecucion): por eso es una tabla,
 *  no un template armado con el color/capa como variable. */
const COLOR_CAPA: Record<Color, Record<Capa, string>> = {
  brand: {
    principal: "text-brand/30",
    secundario: "text-brand/20",
    linea: "text-brand/24",
    acento: "text-accent/36",
  },
  accent: {
    principal: "text-accent/32",
    secundario: "text-accent-lift/22",
    linea: "text-accent/26",
    acento: "text-accent/40",
  },
};

const PESO_CAPA: Record<Capa, "thin" | "light"> = {
  principal: "light",
  secundario: "thin",
  linea: "thin",
  acento: "light",
};

/** Profundidad real, no solo opacidad: la capa secundaria queda un poco
 *  desenfocada, como si estuviera mas atras que la principal. Muy leve a
 *  proposito -- a esta opacidad, un blur fuerte la borraria del todo. */
const FILTRO_CAPA: Record<Capa, string> = {
  principal: "",
  secundario: "blur-[0.5px]",
  linea: "",
  acento: "",
};

// motion-safe: con "reducir movimiento" activado, ni el hover mueve nada --
// mismo criterio que ya usan BotonCta y MapaMini en este proyecto. Ninguna
// variante toca "opacity": pulsar (ambiental) es la unica capa que anima
// opacidad, y asi el hover nunca le compite esa propiedad a nadie.
const HOVER: Record<Hover, string> = {
  mover: "motion-safe:group-hover/nautico:-translate-y-2 motion-safe:group-hover/nautico:scale-[1.05]",
  crecer: "motion-safe:group-hover/nautico:scale-[1.08]",
  deslizar: "motion-safe:group-hover/nautico:translate-x-2 motion-safe:group-hover/nautico:scale-[1.04]",
};

/** El hover se resuelve solo segun la animacion ambiental de CADA instancia
 *  (ver comentario de arriba): asi nunca hay que acordarse de elegirlo a
 *  mano y nunca queda una combinacion que se pise a si misma. */
function hoverPorDefecto(ambiente: Ambiente | undefined, manual: Hover | undefined): Hover {
  if (manual) return manual;
  if (ambiente === "flotar" || ambiente === "derivar") return "crecer";
  return "mover";
}

/** Contenedor comun: posicion (via className), color+opacidad de la capa,
 *  animacion ambiental y microinteraccion de hover. `data-ornamento` no
 *  estiliza nada: es el gancho para movimiento reducido (globals.css) y para
 *  verificar en Puppeteer cual motivo es cual. */
function Base({
  motivo,
  className,
  capa,
  color = "brand",
  hover,
  ambiente,
  duracion,
  retraso = 0,
  children,
}: {
  motivo: string;
  className: string;
  capa: Capa;
  color?: Color;
  hover?: Hover;
  ambiente?: Ambiente;
  /** Segundos. Por defecto, uno prudente distinto por tipo de animacion. */
  duracion?: number;
  retraso?: number;
  children: ReactNode;
}) {
  const claseAmbiente = ambiente ? `anim-${ambiente}` : "";
  const estilo: CSSProperties | undefined = ambiente
    ? ({ "--dur": `${duracion ?? { flotar: 7, derivar: 9, girar: 70, pulsar: 4 }[ambiente]}s`, "--retraso": `${retraso}s` } as CSSProperties)
    : undefined;
  return (
    <span
      aria-hidden="true"
      data-ornamento={motivo}
      style={estilo}
      className={`pointer-events-none absolute select-none transition-[transform,opacity] duration-[850ms] ease-out ${claseAmbiente} ${HOVER[hoverPorDefecto(ambiente, hover)]} ${COLOR_CAPA[color][capa]} ${FILTRO_CAPA[capa]} ${className}`}
    >
      {children}
    </span>
  );
}

type PropsIcono = {
  className: string;
  capa: Capa;
  color?: Color;
  hover?: Hover;
  ambiente?: Ambiente;
  duracion?: number;
  retraso?: number;
};

/** Un icono nautico de Phosphor: timon, velero, brujula, ancla, barco o
 *  coordenadas (una mira/crosshair). Trazo fino o "light" segun la capa. */
export function OrnamentoIcono({ motivo, ...props }: PropsIcono & { motivo: keyof typeof ICONOS }) {
  const Icono = ICONOS[motivo];
  return (
    <Base motivo={motivo} {...props}>
      <Icono weight={PESO_CAPA[props.capa]} className="h-full w-full" />
    </Base>
  );
}

/**
 * Delfin: el simbolo central de DOFI (la pagina lo dice explicitamente en
 * "¿Qué es DOFI?"). No existe como icono en la libreria del proyecto, asi
 * que es un trazo propio -- una silueta saltando -- coherente con el resto
 * (lineas finas, sin relleno solido salvo el hocico/aleta/cola, que son lo
 * que la vuelve reconocible como delfin y no como un simple garabato).
 */
export function OrnamentoDelfin(props: PropsIcono) {
  return (
    <Base motivo="delfin" {...props}>
      <svg viewBox="0 0 200 160" className="h-full w-full" fill="none">
        {/* Cuerpo: un solo trazo grueso en curva, el gesto de un salto. */}
        <path d="M32 150 Q10 92 52 56 Q90 24 142 30" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
        {/* Hocico: remata la curva en punta, hacia donde "entra al agua". */}
        <path d="M32 150 L40 186 L15 158 Z" fill="currentColor" />
        {/* Aleta dorsal, en la cresta del salto. */}
        <path d="M76 46 L84 6 L108 36 Z" fill="currentColor" />
        {/* Cola: dos lobulos que se juntan en punta, como una aleta caudal. */}
        <path d="M142 30 L184 4 L152 40 Z" fill="currentColor" />
        <path d="M142 30 L188 30 L150 46 Z" fill="currentColor" />
      </svg>
    </Base>
  );
}

/** Oleaje: varias lineas de mar superpuestas, con distinto grosor y color
 *  (morado y violeta), pensadas para atravesar buena parte del ancho -- no
 *  un flequito de 40px. */
export function OrnamentoOlas({ className, color = "brand", ambiente, duracion, retraso }: Omit<PropsIcono, "capa">) {
  return (
    <Base motivo="olas" className={className} capa="linea" color={color} ambiente={ambiente} duracion={duracion} retraso={retraso}>
      <svg viewBox="0 0 600 90" className="h-full w-full" fill="none" preserveAspectRatio="none">
        <path d="M0 22 C 100 -4, 200 48, 300 22 S 500 -4, 600 20" stroke="currentColor" strokeWidth="2.5" />
        <path d="M0 46 C 110 20, 220 72, 330 46 S 520 20, 600 44" stroke="currentColor" strokeWidth="2" opacity="0.75" />
        <path d="M0 70 C 90 44, 210 96, 300 70 S 500 44, 600 68" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      </svg>
    </Base>
  );
}

/** Ruta de navegacion: una linea punteada larga, con nodos (uno de ellos en
 *  naranja, como si fuera la posicion actual) -- la misma idea que la ruta
 *  del Método, pensada para cruzar gran parte de la seccion y "conectar"
 *  visualmente otros elementos. */
export function OrnamentoRuta({ className, color = "brand", ambiente, duracion, retraso }: Omit<PropsIcono, "capa">) {
  return (
    <Base motivo="ruta" className={className} capa="linea" color={color} ambiente={ambiente} duracion={duracion} retraso={retraso}>
      <svg viewBox="0 0 700 160" className="h-full w-full" fill="none">
        <path
          d="M8 130 C 90 130, 100 40, 190 40 S 340 130, 430 90 S 560 20, 692 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.5 12"
        />
        <circle cx="8" cy="130" r="4" fill="currentColor" />
        <circle cx="340" cy="112" r="4" fill="currentColor" />
        <circle cx="692" cy="30" r="5" className="text-accent" fill="currentColor" />
      </svg>
    </Base>
  );
}

/** Un nodo chico -- un punto de referencia en una ruta, o simplemente un
 *  acento naranja suelto. Con `ambiente="pulsar"` respira muy despacio. */
export function OrnamentoNodo({ className, color = "accent", ambiente = "pulsar", duracion, retraso }: Omit<PropsIcono, "capa">) {
  return (
    <Base motivo="nodo" className={className} capa="acento" color={color} ambiente={ambiente} duracion={duracion} retraso={retraso}>
      <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="20" cy="20" r="6" fill="currentColor" />
      </svg>
    </Base>
  );
}

/** El trazo de pincel del isotipo de DOFI (public/logo-dofi-mark.png), como
 *  acento: es literalmente parte de la marca, no una reinterpretacion. Se
 *  usa en naranja (su color real) y solo como acento chico -- no como pieza
 *  principal, para no competir con el logo real de la barra de navegacion. */
export function OrnamentoMarca({
  className,
  ambiente,
  duracion,
  retraso,
}: {
  className: string;
  ambiente?: Ambiente;
  duracion?: number;
  retraso?: number;
}) {
  return (
    <Base motivo="marca" className={className} capa="acento" color="accent" ambiente={ambiente} duracion={duracion} retraso={retraso}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-dofi-mark.png" alt="" className="h-full w-full object-contain opacity-90" />
    </Base>
  );
}
