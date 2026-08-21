/**
 * Smart Sales System — el visual del Hero.
 *
 * QUE ES
 * ------
 * Los tres tramos del ecosistema, conectados: lo que DOFI atrae, lo que
 * FENIAX convierte y lo que El Socio escala. No es un adorno: es la
 * primera vez en toda la pagina que se ve que hay un sistema detras, y
 * por eso su contenido es texto HTML real, no un dibujo.
 *
 * POR QUE NO SON TRES TARJETAS IGUALES
 * ------------------------------------
 * El modulo 02 (FENIAX) ocupa el ancho completo y los dos extremos van
 * indentados en direcciones opuestas. La composicion se estrecha, se
 * ensancha y vuelve a estrecharse: el peso cae donde el marketing se
 * convierte en proceso comercial, que es el argumento del negocio. DOFI
 * sigue siendo la marca principal —es quien firma la pagina—; aqui solo
 * se representa el recorrido.
 *
 * SERVIDOR, NO CLIENTE
 * --------------------
 * Sin "use client" a proposito. La animacion es perpetua y sin estado, asi
 * que vive en CSS (ver globals.css, bloque SMART SALES SYSTEM) y la
 * resuelve el compositor. Nada de esto hidrata ni entra en el bundle.
 *
 * ACCESIBILIDAD
 * -------------
 * Es una lista ordenada: los tres pasos tienen orden y el lector de
 * pantalla lo anuncia. Los conectores y el punto que los recorre son
 * decoracion y van aria-hidden. En reposo los tres modulos ya muestran
 * todo su texto: la animacion no oculta ni revela informacion.
 */

type Modulo = {
  n: string;
  fase: string;
  marca: string;
  items: string[];
  /** El tramo central: ancho completo y borde algo mas presente. */
  destacado?: boolean;
  /** Sangria en escritorio. El escalonado da jerarquia sin cambiar tamaños. */
  sangria: "izquierda" | "ninguna" | "derecha";
  /** Desfase del ciclo de 6s para que se enciendan en orden. */
  delay: string;
};

const MODULOS: Modulo[] = [
  {
    n: "01",
    fase: "Atraer",
    marca: "DOFI",
    items: ["Meta Ads", "TikTok Ads", "Contenido", "Audiovisual"],
    sangria: "izquierda",
    delay: "0s",
  },
  {
    n: "02",
    fase: "Convertir",
    marca: "FENIAX",
    items: ["CRM", "Automatizaciones", "Seguimiento", "Pipeline"],
    destacado: true,
    sangria: "ninguna",
    delay: "-4s",
  },
  {
    n: "03",
    fase: "Escalar",
    marca: "El Socio",
    items: ["Estrategia", "Consultoría", "Capacitación"],
    sangria: "derecha",
    delay: "-2s",
  },
];

/** Tramo vertical entre dos modulos, con el punto que lo recorre. */
function Conector({ delay }: { delay: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-6 w-px overflow-hidden bg-brand-lift/25 md:h-7"
    >
      <span
        style={{ animationDelay: delay }}
        className="sss-pulso absolute inset-x-0 top-0 block h-2 w-px bg-accent"
      />
    </div>
  );
}

export function SmartSalesSystem() {
  return (
    <div className="w-full">
      <ol className="flex flex-col">
        {MODULOS.map((m, i) => (
          <li key={m.n}>
            <article
              style={{ animationDelay: m.delay }}
              className={[
                "sss-modulo rounded-[20px] border bg-surface-overlay/35 backdrop-blur-[2px]",
                // En movil todos ocupan el ancho completo: no hay sitio para
                // el escalonado y encogerlo solo produciria cajas pequeñas.
                "px-4 py-3.5 md:px-6 md:py-5",
                m.destacado
                  ? "border-accent/45"
                  : "border-brand-lift/25",
                m.sangria === "izquierda" ? "md:mr-12" : "",
                m.sangria === "derecha" ? "md:ml-12" : "",
              ].join(" ")}
            >
              <div className="flex items-baseline gap-2.5 md:gap-3">
                <span
                  style={{ animationDelay: m.delay }}
                  className="sss-etiqueta font-display text-[11px] font-semibold tabular-nums text-fg-subtle"
                >
                  {m.n}
                </span>
                <h3 className="font-display text-base font-extrabold tracking-tight text-fg-primary md:text-xl">
                  {m.fase}
                </h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-brand-lift/20"
                />
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-muted md:text-xs">
                  {m.marca}
                </span>
              </div>

              {/* Movil: los mismos items en una linea corrida separada por
                  puntos. Escritorio: pildoras. Es el MISMO nodo del DOM, no
                  dos versiones: nada se oculta ni se duplica, solo cambia la
                  presentacion. En movil las pildoras se partian en dos filas
                  y engordaban el hero sin aportar nada. */}
              <ul className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 md:mt-3 md:gap-x-2">
                {m.items.map((item, k) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 font-sans text-[11px] leading-relaxed text-fg-subtle md:gap-0 md:rounded-full md:border md:border-brand-lift/20 md:px-2.5 md:py-0.5 md:text-xs"
                  >
                    {k > 0 && (
                      <span aria-hidden="true" className="md:hidden">
                        ·
                      </span>
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            {i < MODULOS.length - 1 && (
              <Conector delay={MODULOS[i + 1].delay} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
