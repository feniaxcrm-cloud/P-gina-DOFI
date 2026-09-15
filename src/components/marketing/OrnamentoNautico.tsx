import type { ReactNode } from "react";
import { Anchor, CompassRose, Sailboat, SteeringWheel, Waves } from "@phosphor-icons/react/dist/ssr";

/**
 * Elementos graficos de fondo para las secciones de fondo claro de Marketing
 * Digital (Qué es DOFI sin pieza, Método, Clientes, Reseñas): el universo
 * visual de DOFI (mar, navegación, delfines, timón, brújula, velero, ancla,
 * olas) en trazo fino, monocromatico y muy sutil, para que esas secciones no
 * se sientan planas sin competir con el contenido.
 *
 * SERVIDOR, NO CLIENTE: el hover es CSS puro (`group-hover`), no hace falta
 * JavaScript. Cada seccion envuelve su contenido en un contenedor con
 * `group/nautico` (nombrado para no chocar con otros `group` que ya usan
 * esas mismas secciones, como la flecha de "Ver todas en Google"); al pasar
 * el cursor por CUALQUIER parte de la seccion -- texto, botones, huecos --
 * los ornamentos reaccionan, porque `pointer-events-none` los vuelve
 * transparentes al puntero: el hover nunca lo capturan ellos, lo calcula el
 * contenedor. Por eso nunca bloquean un click ni interfieren con el carrusel
 * o el video: son inertes de punta a punta.
 *
 * DOS FAMILIAS, DOS TIPOS DE MICROINTERACCION (para no chocar con la
 * inclinacion fija de cada instancia, que en Tailwind v4 es la propiedad CSS
 * `rotate`, independiente de `translate` y `scale`):
 *  - Iconos (timon, velero, brujula, ancla, delfin): inclinacion fija por
 *    instancia via `rotate-*`, y al pasar el cursor se desplazan o escalan
 *    apenas (nunca rotan mas: se sumaria a la inclinacion fija de forma
 *    impredecible).
 *  - Trazos (olas, ruta punteada): sin inclinacion nunca -- tienen que leerse
 *    horizontales -- y solo cambian de posicion u opacidad.
 *
 * Opacidad muy baja (8-16%) y trazo fino (weight="thin"): a esa opacidad, un
 * icono con relleno solido pesa demasiado ("parece un sticker"); un trazo
 * fino en cambio se lee sutil incluso con mas opacidad, que es la sensacion
 * que pedia el brief con ~30%.
 */

const ICONOS = { timon: SteeringWheel, velero: Sailboat, brujula: CompassRose, ancla: Anchor, olas: Waves };

type Deriva = "flotar" | "deslizar" | "asentar";

// motion-safe: con "reducir movimiento" activado, ni siquiera el hover mueve
// nada -- mismo criterio que ya usan BotonCta y MapaMini en este proyecto.
const HOVER: Record<Deriva, string> = {
  // Iconos: se despegan un poco y crecen apenas. Nunca rotan (ver arriba).
  flotar: "motion-safe:group-hover/nautico:-translate-y-2 motion-safe:group-hover/nautico:scale-[1.05]",
  asentar: "motion-safe:group-hover/nautico:translate-y-1.5 motion-safe:group-hover/nautico:scale-[1.04]",
  // Trazos: se deslizan en horizontal, como si la corriente los corriera.
  deslizar: "motion-safe:group-hover/nautico:translate-x-2 motion-safe:group-hover/nautico:opacity-[0.7]",
};

/** Contenedor comun: posicion, inclinacion fija, opacidad y la microinteraccion.
 *  `data-ornamento` no estiliza nada: es un gancho para verificar en Puppeteer
 *  cual motivo es cual, igual que ya usan data-reveal/data-trazo/data-giros. */
function Base({
  motivo,
  className,
  deriva = "flotar",
  children,
}: {
  motivo: string;
  className: string;
  deriva?: Deriva;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      data-ornamento={motivo}
      className={`pointer-events-none absolute select-none transition-[transform,opacity] duration-[850ms] ease-out ${HOVER[deriva]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Un icono nautico de Phosphor, en trazo fino y del color de marca. */
export function OrnamentoIcono({
  motivo,
  className,
  deriva,
  color = "brand",
}: {
  motivo: keyof typeof ICONOS;
  className: string;
  deriva?: Deriva;
  color?: "brand" | "accent";
}) {
  const Icono = ICONOS[motivo];
  return (
    <Base motivo={motivo} className={className} deriva={deriva}>
      <Icono weight="thin" className={`h-full w-full ${color === "accent" ? "text-accent" : "text-brand"}`} />
    </Base>
  );
}

/**
 * Delfin: el simbolo central de DOFI (la pagina lo dice explicitamente en
 * "¿Qué es DOFI?"). No existe como icono en la libreria del proyecto, asi que
 * es un trazo propio -- una silueta saltando, en una sola linea continua,
 * coherente con el resto de las siluetas de la marca (finas, sin relleno
 * solido).
 */
export function OrnamentoDelfin({
  className,
  deriva,
  color = "brand",
}: {
  className: string;
  deriva?: Deriva;
  color?: "brand" | "accent";
}) {
  return (
    <Base motivo="delfin" className={className} deriva={deriva}>
      <svg viewBox="0 0 200 160" className={`h-full w-full ${color === "accent" ? "text-accent" : "text-brand"}`} fill="none">
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

/** Oleaje: dos lineas de mar, la misma gramatica visual que ya usan otras
 *  secciones (PiezaGrafica, los banners de foto) pero como pieza aparte para
 *  poder ubicarla en cualquier borde, no solo abajo del todo. */
export function OrnamentoOlas({ className, color = "brand" }: { className: string; color?: "brand" | "accent" }) {
  return (
    <Base motivo="olas" className={className} deriva="deslizar">
      <svg viewBox="0 0 400 70" className={`h-full w-full ${color === "accent" ? "text-accent" : "text-brand"}`} fill="none" preserveAspectRatio="none">
        <path d="M0 24 C 66 4, 132 44, 200 24 S 334 4, 400 22" stroke="currentColor" strokeWidth="2" />
        <path d="M0 48 C 70 28, 140 68, 210 48 S 340 28, 400 46" stroke="currentColor" strokeWidth="2" />
      </svg>
    </Base>
  );
}

/** Ruta de navegacion: una linea punteada curva con dos puntos de referencia,
 *  la misma idea que la ruta del Método pero en miniatura y sin animarse. */
export function OrnamentoRuta({ className, color = "brand" }: { className: string; color?: "brand" | "accent" }) {
  return (
    <Base motivo="ruta" className={className} deriva="deslizar">
      <svg viewBox="0 0 300 120" className={`h-full w-full ${color === "accent" ? "text-accent" : "text-brand"}`} fill="none">
        <path
          d="M6 100 C 70 100, 60 40, 130 40 S 220 90, 294 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.5 11"
        />
        <circle cx="6" cy="100" r="4" fill="currentColor" />
        <circle cx="294" cy="20" r="4" fill="currentColor" />
      </svg>
    </Base>
  );
}
