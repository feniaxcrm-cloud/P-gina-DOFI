import { MapPin, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/config/company";

/**
 * Mini tarjeta de ubicacion del pie: se ve como una vista de mapa, y al
 * hacer clic abre el Google Maps del local en una pestaña nueva.
 *
 * POR QUE NO ES UN IFRAME DE GOOGLE MAPS
 * -----------------------------------------------------------------
 * El embed de Google (`output=embed`) funciona sin API key, si. Pero para
 * este uso concreto tiene tres problemas:
 *
 *  1. No se puede hacer clic "a traves" de el. Un iframe se queda con el
 *     evento: el usuario arrastraria el mapa en vez de abrir la ficha. Para
 *     que fuera clicable habria que taparlo con una capa transparente, lo
 *     que anula lo unico que aportaba el iframe (que sea interactivo).
 *  2. Pesa. Carga la aplicacion de Maps entera -- cientos de KB de JS de
 *     terceros -- en el pie de TODAS las paginas, para mostrar una
 *     miniatura de 96px de alto.
 *  3. Mete cookies de terceros en cada visita, sin que el visitante haya
 *     pedido ver un mapa.
 *
 * Asi que la miniatura se dibuja aca: un SVG de ~2KB, sin red, sin API key,
 * sin cookies, y con los colores de DOFI en vez de los de Google. El plano
 * es una representacion estilizada del cruce real (las dos calles que
 * forman la direccion, rotuladas), no un mapa cartografico: el dato exacto
 * lo da Google al abrir el enlace, que es justo lo que se espera de una
 * miniatura.
 *
 * Si en algun momento se prefiere el mapa de verdad, el reemplazo es este
 * componente entero, sin tocar el Footer.
 */

/** Las dos calles del cruce, para rotular el plano. "Padre Aguirre y Rafael
 *  María Arízaga" -> ["Padre Aguirre", "Rafael María Arízaga"]. Se deriva de
 *  company.location.address en vez de escribirse a mano: si la direccion
 *  cambia por variable de entorno, el plano la sigue. */
function calles(direccion: string): [string, string] {
  const partes = direccion.split(/\s+y\s+/i);
  return [partes[0] ?? direccion, partes[1] ?? ""];
}

export function MapaMini() {
  const { mapsUrl, address, city, country } = company.location;
  const [calleA, calleB] = calles(address);

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver la ubicación de ${company.shortName} en Google Maps: ${company.location.fullLabel}`}
      className="group/mapa mt-5 block w-full max-w-[280px] overflow-hidden rounded-xl border border-brand-lift/25 bg-deep transition-colors duration-300 hover:border-accent/60"
    >
      {/* Plano estilizado. aria-hidden: no aporta informacion que el texto
          de abajo y el aria-label del enlace no den ya. */}
      <div className="relative h-[96px] w-full">
        <svg
          viewBox="0 0 280 96"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Manzanas */}
          <rect width="280" height="96" fill="#160D2E" />
          <g fill="#1F1247">
            <rect x="0" y="0" width="104" height="34" />
            <rect x="128" y="0" width="152" height="34" />
            <rect x="0" y="58" width="104" height="38" />
            <rect x="128" y="58" width="152" height="38" />
          </g>

          {/* Calles secundarias */}
          <g stroke="#2E1B68" strokeWidth="5">
            <line x1="0" y1="16" x2="280" y2="16" />
            <line x1="0" y1="80" x2="280" y2="80" />
            <line x1="52" y1="0" x2="52" y2="96" />
            <line x1="212" y1="0" x2="212" y2="96" />
          </g>

          {/* Las dos calles del cruce: mas anchas y en morado de marca */}
          <g stroke="#4B2A93" strokeWidth="12" strokeLinecap="square">
            <line x1="0" y1="46" x2="280" y2="46" />
            <line x1="116" y1="0" x2="116" y2="96" />
          </g>
          <g stroke="#6D4BC9" strokeWidth="1.5" strokeDasharray="6 7" opacity="0.75">
            <line x1="0" y1="46" x2="280" y2="46" />
            <line x1="116" y1="0" x2="116" y2="96" />
          </g>

          {/* Rotulos de calle */}
          <text
            x="182"
            y="42"
            fill="#B3A5D4"
            fontSize="7.5"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.3"
          >
            {calleA.toUpperCase()}
          </text>
          {calleB && (
            <text
              x="110"
              y="86"
              fill="#B3A5D4"
              fontSize="7.5"
              fontFamily="system-ui, sans-serif"
              letterSpacing="0.3"
              transform="rotate(-90 110 86)"
            >
              {calleB.toUpperCase()}
            </text>
          )}

          {/* Halo del marcador */}
          <circle cx="116" cy="46" r="17" fill="#F47B20" opacity="0.16" />
          <circle cx="116" cy="46" r="9" fill="#F47B20" opacity="0.28" />
        </svg>

        {/* Marcador. Va fuera del SVG para usar el mismo icono Phosphor que
            el resto del pie, y para poder animarlo con una clase. */}
        <MapPin
          size={26}
          weight="fill"
          aria-hidden="true"
          className="absolute left-[41.4%] top-1/2 -translate-x-1/2 -translate-y-[70%] text-accent drop-shadow-[0_2px_6px_rgba(18,10,38,0.85)] transition-transform duration-300 motion-safe:group-hover/mapa:-translate-y-[85%]"
        />
      </div>

      {/* Pie de la tarjeta */}
      <div className="border-t border-brand-lift/20 px-3 py-2.5">
        <p className="font-sans text-[12px] leading-snug text-fog">{address}</p>
        <p className="mt-1 flex items-center gap-1 font-sans text-[12px] font-semibold text-accent">
          {city} - {country}
          <ArrowUpRight
            size={13}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/mapa:translate-x-0.5 group-hover/mapa:-translate-y-0.5"
          />
        </p>
      </div>
    </a>
  );
}
