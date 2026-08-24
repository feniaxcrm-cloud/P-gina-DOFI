import { getActiveAccounts } from "@/lib/sanity";

/**
 * Franja de prueba social — V1 TEMPORAL, EN MODO TEXTO.
 *
 * ================================================================
 * POR QUE ESTO NO ES UN MURO DE LOGOS
 * ================================================================
 * No existe ni un solo logotipo de cliente en el proyecto: ni en
 * /public/clientes, /public/clients, /public/logos ni /public/marcas
 * (esas son las de herramientas de software, no de cuentas), ni en
 * Sanity (el campo logo del tipo "cuenta" existe pero ningun
 * documento lo tiene subido todavia), ni en el respaldo local
 * src/data/clients.ts (el campo logo? esta declarado, cero cuentas lo
 * usan). Inventario completo: LOGOS REALES ENCONTRADOS: 0/26.
 *
 * La version anterior rellenaba ese hueco con las DOS PRIMERAS LETRAS
 * del nombre dentro de un cuadrado. Eso no identificaba nada —"EL"
 * salia igual para El Horno y para El Cobayo, "CO" se repetia tres
 * veces— y leia como una maqueta sin terminar, que es lo contrario de
 * lo que tiene que hacer una franja de prueba social.
 *
 * Asi que se quitan los monogramas y se muestra lo unico que SI es
 * real y verificable: el nombre de cada empresa. Es honesto y
 * funciona: responde la unica pregunta de este bloque —"¿alguien ya
 * confio en ustedes?"— sin fingir tener material que no tenemos.
 *
 * ================================================================
 * COMO ACTIVAR EL MODO LOGOS (cuando lleguen los archivos)
 * ================================================================
 * Subir el logo de una cuenta en el Studio (dofi-cms.sanity.studio ->
 * Cuentas -> esa cuenta -> Logo) alcanza: getActiveAccounts() (ver
 * src/lib/sanity.ts) ya lo trae en cada cuenta activa, y este
 * componente ya lo pinta si `c.logo` viene definido — no hace falta
 * tocar codigo ni rediseñar nada. Mientras no haya logo, se muestra el
 * nombre.
 *
 * OJO: mientras haya mezcla (unas cuentas con logo y otras sin el) la
 * franja se ve inconsistente. Cuando llegue material real para varias
 * cuentas hay que decidir el umbral a partir del cual se pasa a modo
 * logos y se dejan fuera las cuentas sin archivo. Esa decision es del
 * sprint de Casos, no de este.
 *
 * ================================================================
 * VELOCIDAD
 * ================================================================
 * La duracion NO es un numero fijo: se calcula a partir de cuantas
 * cuentas hay, para que la velocidad real en px/s se mantenga aunque
 * se agreguen o quiten. Misma velocidad optica en movil que en
 * escritorio: acelerar la marquesina en pantallas pequeñas es un tic,
 * no una decision.
 */

/** Ancho medio de un elemento de la tira, medido en el navegador:
 *  nombre (~104px a 15px en Sora 600) + separacion (56px). */
const ANCHO_MEDIO_ELEMENTO = 160;

/** Velocidad objetivo. El rango sobrio para una franja de confianza esta
 *  entre 35 y 55 px/s: por debajo parece parada, por encima lee como
 *  ticker financiero. */
const PIXELES_POR_SEGUNDO = 45;

export async function LogoWall() {
  const clients = await getActiveAccounts();
  if (clients.length === 0) return null;

  // La tira se duplica para que el bucle no muestre costura. El recorrido
  // de la animacion es 0 -> -50%, es decir, exactamente una copia.
  const recorrido = clients.length * ANCHO_MEDIO_ELEMENTO;
  const duracion = `${Math.round(recorrido / PIXELES_POR_SEGUNDO)}s`;
  const tira = [...clients, ...clients];

  return (
    <section
      aria-labelledby="prueba-social"
      className="relative border-t border-brand-lift/15 bg-surface-base py-8 md:py-10"
    >
      {/* El texto respeta container.page y arranca en la misma linea
          vertical que el H1 del Hero (x=60 a 1440). La marquesina, en
          cambio, va a sangre: es el unico elemento del bloque autorizado a
          romper el contenedor. */}
      <div className="px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="mx-auto max-w-page">
          <p id="prueba-social" className="font-sans text-sm text-fg-subtle">
            Empresas que han confiado en nosotros
          </p>
        </div>
      </div>

      <div className="relative mt-6 md:mt-7">
        {/* Desvanecido en los extremos, con surface.base (nunca negro) y
            sin blur. Estrecho a proposito: no debe tapar un nombre entero. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface-base to-transparent md:w-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface-base to-transparent md:w-20"
        />

        {/* wall-viewport recorta la tira; con movimiento reducido pasa a
            desplazamiento manual (ver globals.css). Sin este recorte, el
            ancho de la tira desbordaria el documento. */}
        <div className="wall-viewport">
          <ul
            className="wall-track flex w-max items-center"
            style={{ animationDuration: duracion }}
          >
            {tira.map((c, i) => {
              // Solo la primera copia existe para el lector de pantalla. Sin
              // esto anunciaria las mismas empresas dos veces seguidas.
              const esCopia = i >= clients.length;
              return (
                <li
                  key={`${c.slug}-${i}`}
                  aria-hidden={esCopia || undefined}
                  className="flex shrink-0 items-center px-7 md:px-8"
                >
                  {c.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.logo}
                      alt={esCopia ? "" : c.name}
                      width={140}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      // Monocromo por defecto; recupera color real solo en
                      // hover de escritorio, si el archivo lo permite.
                      className="h-6 w-auto max-w-[120px] object-contain opacity-70 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0 md:h-7 md:max-w-[150px]"
                    />
                  ) : (
                    <span className="whitespace-nowrap font-display text-sm font-semibold tracking-tight text-fg-muted md:text-[15px]">
                      {c.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
