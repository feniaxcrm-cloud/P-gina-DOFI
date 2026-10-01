/**
 * Las ondas de lineas del brandbook de FENIAX (portada, "Construcción
 * reticular", "Aplicaciones"): un haz de curvas finas que se tuerce como una
 * cinta, en naranja -> rojo -> morado.
 *
 * LIVIANO A PROPOSITO: hay UNA sola curva (una senoide de 3 periodos) en
 * <defs>, y el haz son N <use> de esa misma curva con otra amplitud y otra
 * fase. Unos cientos de bytes en vez de miles de puntos. El trazo no escala
 * con el SVG (vector-effect), asi que las lineas quedan de 1px aunque el
 * dibujo se estire a todo el ancho.
 *
 * MOVIMIENTO: la tira mide el doble del ancho visible y se desplaza la mitad
 * en bucle (.feniax-ondas en globals.css). La curva y el degradado repiten
 * cada 1200 unidades, asi que el salto del bucle no se ve. Con movimiento
 * reducido, quieta.
 *
 * `vector-effect` va en la curva de <defs> y no en cada <use>: no se hereda,
 * y es la curva la que tiene que mantener su trazo de 1px.
 */

const PERIODO = 1200;
const ALTO = 300;

/** Senoide de amplitud 1 de x = -PERIODO a 2*PERIODO, como curvas cubicas
 *  (Catmull-Rom con 16 puntos por periodo: indistinguible de la senoide). */
function curvaSeno() {
  const paso = PERIODO / 16;
  const pts: [number, number][] = [];
  for (let x = -PERIODO - paso; x <= 2 * PERIODO + paso + 0.5; x += paso) {
    pts.push([x, -Math.sin((2 * Math.PI * x) / PERIODO)]);
  }
  let d = `M${pts[1][0].toFixed(1)} ${pts[1][1].toFixed(4)}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(4)} ${c2[0].toFixed(1)} ${c2[1].toFixed(4)} ${p2[0].toFixed(1)} ${p2[1].toFixed(4)}`;
  }
  return d;
}

const CURVA = curvaSeno();

export function OndasFeniax({
  className = "",
  lineas = 22,
  amplitud = 70,
  opacidad = 0.7,
  duracion = 40,
  idGradiente,
}: {
  className?: string;
  lineas?: number;
  /** En unidades del dibujo (alto total 300). */
  amplitud?: number;
  opacidad?: number;
  /** Segundos que tarda una vuelta del bucle. */
  duracion?: number;
  /** Unico por pagina: dos instancias no pueden compartir el id del degradado. */
  idGradiente: string;
}) {
  const idCurva = `${idGradiente}-curva`;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute overflow-hidden ${className}`}>
      <div className="feniax-ondas h-full w-[200%]" style={{ "--ondas-duracion": `${duracion}s` } as React.CSSProperties}>
        <svg className="h-full w-full" viewBox={`0 0 ${PERIODO * 2} ${ALTO}`} preserveAspectRatio="none" fill="none">
          <defs>
            <linearGradient id={idGradiente} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={PERIODO} y2="0" spreadMethod="repeat">
              <stop offset="0" stopColor="#ED6D19" />
              <stop offset="0.3" stopColor="#E5352A" />
              <stop offset="0.62" stopColor="#792883" />
              <stop offset="1" stopColor="#ED6D19" />
            </linearGradient>
            <path id={idCurva} d={CURVA} vectorEffect="non-scaling-stroke" />
          </defs>
          <g stroke={`url(#${idGradiente})`} strokeWidth="1" opacity={opacidad}>
            {Array.from({ length: lineas }, (_, k) => {
              const t = lineas > 1 ? k / (lineas - 1) : 0;
              // La cinta: la amplitud pasa de +A a -A (se "da vuelta") y la
              // fase avanza de a poco; las lineas del medio quedan casi juntas.
              const coseno = Math.cos(Math.PI * t);
              // Nunca 0 exacto: una escala nula deja la linea sin trazo.
              const a = amplitud * (Math.abs(coseno) < 0.02 ? 0.02 : coseno);
              const fase = t * (PERIODO / 5);
              const y = ALTO / 2 + (t - 0.5) * 26;
              return (
                <use
                  key={k}
                  href={`#${idCurva}`}
                  transform={`translate(${fase.toFixed(1)} ${y.toFixed(1)}) scale(1 ${a.toFixed(2)})`}
                  strokeOpacity={0.35 + 0.65 * Math.sin(Math.PI * t)}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
