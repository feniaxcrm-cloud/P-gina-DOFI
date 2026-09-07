import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal, SubrayadoReveal } from "./Reveal";
import type { SeccionContenido } from "@/lib/sanity";

/**
 * ============================================================
 * PALETA POR SECCIÓN — el color vuelve a ser identidad
 * ============================================================
 * Sprint "Corrección de fondos + contraste + diseño tipográfico": revierte
 * el sprint anterior (que habia dejado las 4 secciones en blanco) y
 * recupera la secuencia naranja / blanco / morado / naranja, pero ahora con
 * TODO el texto recalculado para cada fondo. Solo tokens que ya existian
 * en el design system -- ningun color nuevo (spec §24).
 *
 * CONTRASTE MEDIDO, NO ESTIMADO (formula de luminancia relativa de WCAG).
 * Los numeros de abajo son reales y son los que definieron cada decision:
 *
 *   SOBRE NARANJA (#F47B20)
 *     ink        6.53:1  AA normal   -> texto base y eyebrow
 *     brand      3.75:1  AA solo GRANDE -> destacado del titulo (nunca
 *                                          descripcion ni eyebrow)
 *     blanco     2.73:1  NO PASA     -> descartado (spec §4)
 *   SOBRE BLANCO (#FDFBF7)
 *     brand      9.90:1  AA normal   -> "texto morado DOFI" del spec §3
 *     ink       17.22:1  AA normal   -> destacado del titulo
 *     accent     2.64:1  NO PASA     -> el naranja NO se usa como texto
 *                                       aca; queda como linea/subrayado
 *                                       (decorativo, sin requisito de
 *                                       contraste de texto)
 *   SOBRE MORADO (#4B2A93)
 *     foam       9.13:1  AA normal   -> texto base
 *     accentLift 4.66:1  AA normal   -> destacado + eyebrow (es el naranja
 *                                       que SI pasa sobre morado; `accent`
 *                                       queda en 3.75 y solo serviria para
 *                                       texto grande)
 *     blanco    10.24:1  AA normal   -> texto del CTA morado
 *
 * El CTA cambia de color cuando el fondo ya es naranja (spec §18: "morado
 * DOFI con texto blanco"), para que nunca sea naranja sobre naranja.
 */
type Tono = {
  fondo: string;
  /** Glow decorativo de fondo de la seccion (spec §9), dentro del
   *  overflow-hidden -- nunca puede empujar el ancho de la pagina. */
  auraSeccion: string;
  eyebrowNumero: string;
  eyebrowLinea: string;
  eyebrowPunto: string;
  tituloBase: string;
  tituloDestacado: string;
  subrayado: string;
  descripcion: string;
  cta: string;
  imagenRing: string;
  imagenGlow: string;
  imagenVelo: string;
};

const NARANJA: Tono = {
  fondo: "bg-accent",
  auraSeccion: "bg-brand/20",
  eyebrowNumero: "text-ink",
  eyebrowLinea: "bg-ink/35",
  eyebrowPunto: "bg-brand",
  tituloBase: "text-ink/85",
  tituloDestacado: "text-brand",
  subrayado: "bg-brand/70",
  descripcion: "text-ink/80",
  cta: "bg-brand text-white shadow-[0_10px_28px_-16px_rgba(26,15,61,0.7)] hover:bg-brand-lift",
  imagenRing: "ring-1 ring-brand/25",
  imagenGlow: "bg-brand/30",
  imagenVelo: "from-brand/25",
};

const BLANCO: Tono = {
  fondo: "bg-canvas",
  auraSeccion: "bg-accent/12",
  eyebrowNumero: "text-brand",
  eyebrowLinea: "bg-accent/70",
  eyebrowPunto: "bg-accent",
  tituloBase: "text-brand",
  tituloDestacado: "text-ink",
  subrayado: "bg-accent",
  descripcion: "text-ink-muted",
  cta: "bg-accent text-fg-on-accent shadow-[0_10px_28px_-16px_rgba(244,123,32,0.65)] hover:bg-accent-lift",
  imagenRing: "ring-1 ring-brand/12",
  imagenGlow: "bg-accent/25",
  imagenVelo: "from-brand/12",
};

const MORADO: Tono = {
  fondo: "bg-brand",
  auraSeccion: "bg-accent/18",
  eyebrowNumero: "text-accent-lift",
  eyebrowLinea: "bg-accent-lift/60",
  eyebrowPunto: "bg-accent-lift",
  tituloBase: "text-foam",
  tituloDestacado: "text-accent-lift",
  subrayado: "bg-accent-lift",
  descripcion: "text-foam/90",
  cta: "bg-accent text-fg-on-accent shadow-[0_10px_28px_-16px_rgba(244,123,32,0.65)] hover:bg-accent-lift",
  imagenRing: "ring-1 ring-white/25",
  imagenGlow: "bg-accent/30",
  imagenVelo: "from-brand-lift/30",
};

/** Naranja / blanco / morado / naranja (spec §1 y §23). */
const TONOS = [NARANJA, BLANCO, MORADO, NARANJA];

// ============================================================
// Composicion tipografica del titulo
// ============================================================

type Segmento = { texto: string; destacado: boolean };

/** ¿Token escrito enteramente en MAYUSCULAS? Pide al menos 2 letras para
 *  que "=", "+3M" o una inicial suelta no se lean como enfasis. */
function esMayusculas(token: string): boolean {
  const letras = token.replace(/[^\p{L}]/gu, "");
  return letras.length >= 2 && token === token.toUpperCase();
}

/**
 * Convierte el titulo plano que viene de Sanity en lineas con palabras
 * destacadas, SIN inventar ni cambiar una sola palabra (spec §31) y sin
 * agregar campos nuevos al CMS (spec §30).
 *
 * La clave: el enfasis ya esta en el contenido que el propietario escribio
 * -- usa MAYUSCULAS para las palabras que le importan ("Redes Sociales que
 * SI VENDEN"). Esta funcion solo LEE esa intencion:
 *
 *   1. "A = B"  -> lo de despues del "=" es el resultado y es lo destacado
 *      ("PAUTA INTELIGENTE =" / "VENTAS INTELIGENTES"). El "=" se queda en
 *      la primera linea; nunca se descarta texto del CMS.
 *   2. Mezcla de MAYUSCULAS y minusculas -> los tramos en mayusculas son el
 *      enfasis, los otros son texto de apoyo.
 *   3. Sin mezcla (todo mayusculas o todo minusculas) -> una sola linea. Si
 *      es todo mayusculas, el titulo entero es el enfasis.
 *
 * Ademas, un tramo de apoyo de 1-2 palabras no se queda solo en su renglon
 * (queda pobre): se pega como entrada del tramo destacado que sigue, para
 * que salga "con RESPUESTAS RAPIDAS" y no "con" / "RESPUESTAS RAPIDAS".
 *
 * Convencion editorial resultante, util para quien carga contenido: lo que
 * se escriba en MAYUSCULAS en el titulo se destaca solo.
 */
function componerTitulo(titulo: string): Segmento[][] {
  const limpio = titulo.trim().replace(/\s+/g, " ");
  if (!limpio) return [];

  const igual = limpio.indexOf("=");
  if (igual > 0 && igual < limpio.length - 1) {
    const antes = limpio.slice(0, igual + 1).trim();
    const despues = limpio.slice(igual + 1).trim();
    if (antes && despues) {
      return [
        [{ texto: antes, destacado: false }],
        [{ texto: despues, destacado: true }],
      ];
    }
  }

  const tokens = limpio.split(" ");
  const marcas = tokens.map(esMayusculas);
  const hayMezcla = marcas.some(Boolean) && marcas.some((m) => !m);

  if (!hayMezcla) {
    return [[{ texto: limpio, destacado: marcas[0] === true }]];
  }

  const tramos: Segmento[] = [];
  tokens.forEach((token, i) => {
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.destacado === marcas[i]) ultimo.texto += ` ${token}`;
    else tramos.push({ texto: token, destacado: marcas[i] });
  });

  const lineas: Segmento[][] = [];
  for (let i = 0; i < tramos.length; i++) {
    const tramo = tramos[i];
    const siguiente = tramos[i + 1];
    const esApoyoCorto = !tramo.destacado && tramo.texto.split(" ").length <= 2;
    if (esApoyoCorto && siguiente?.destacado) {
      lineas.push([tramo, siguiente]);
      i++;
    } else {
      lineas.push([tramo]);
    }
  }
  return lineas;
}

/**
 * Una de las 4 "Secciones de contenido" debajo de las tarjetas del Hero.
 * Un solo componente reutilizado 4 veces via `seccionesContenido.map(...)`.
 *
 * QUE CAMBIA EN ESTE SPRINT
 * -----------------------------------------------------------------
 * Fondos de color de vuelta (ver TONOS arriba), texto recalculado para
 * cada fondo, y el titulo pasa de ser "texto grande" a una composicion:
 * eyebrow grafico -> lineas con palabras destacadas (mas grandes, otro
 * color, con subrayado que se dibuja al entrar) -> descripcion -> CTA.
 *
 * QUE NO CAMBIA (spec §22, §30-33)
 * -----------------------------------------------------------------
 * La alternancia de lado (`index % 2`: par -> texto izquierda), el orden
 * del DOM (imagen -> texto, que da el orden correcto en mobile sin
 * duplicar la imagen), la integracion con Sanity (mismos 5 campos), la
 * deteccion de CTA interno/externo, y Hero/Header/Footer, que no se tocan.
 *
 * SIN OVERFLOW (leccion de los sprints anteriores)
 * -----------------------------------------------------------------
 * `overflow-hidden` en la seccion + `min-w-0` en los dos items del grid.
 * Lo primero contiene el translateX inicial de la imagen (que antes del
 * viewport se sale del contenedor y el navegador lo cuenta para
 * scrollWidth); lo segundo evita el "grid blowout" con titulos largos.
 * Todo lo decorativo vive adentro de un contenedor recortado.
 */
export function ContentSection({
  titulo,
  descripcion,
  imagen,
  imagenAlt,
  hotspot,
  ctaTexto,
  ctaEnlace,
  index,
}: SeccionContenido & { index: number }) {
  const textoIzquierda = index % 2 === 0;
  const tono = TONOS[index % TONOS.length];
  const esExterno = /^https?:\/\//i.test(ctaEnlace);
  // Imagen a la derecha -> entra desde la derecha; a la izquierda -> desde
  // la izquierda (spec §14). Sale de la misma alternancia, no de una tabla.
  const imagenX = textoIzquierda ? 28 : -28;

  const lineas = componerTitulo(titulo);
  // El subrayado va en UN solo lugar: el ultimo tramo destacado del titulo
  // (el cierre de la frase). Marcarlos todos recargaria la composicion.
  let ultimoDestacado = -1;
  lineas.forEach((linea, i) => {
    if (linea.some((s) => s.destacado)) ultimoDestacado = i;
  });

  // Stagger encadenado: cada linea del titulo entra despues de la anterior,
  // y descripcion/CTA arrancan cuando el titulo termino (spec §15-16).
  const dTitulo = 0.1;
  const pasoLinea = 0.08;
  const dDescripcion = dTitulo + lineas.length * pasoLinea + 0.04;
  const dCta = dDescripcion + 0.1;

  // w-full en mobile (spec §28: "puede aumentar de ancho ... buena area
  // tactil"), auto desde sm:. px chico + whitespace-nowrap para que un CTA
  // largo no se parta en dos lineas y rompa el alto fijo a 360px.
  const ctaClassName = `group relative inline-flex h-16 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 font-display text-base font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:w-auto sm:px-10 ${tono.cta}`;
  const cta = esExterno ? (
    <a href={ctaEnlace} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
      {ctaTexto}
      <ArrowRight size={20} weight="bold" aria-hidden="true" className={CTA_ICONO} />
    </a>
  ) : (
    <Link href={ctaEnlace} className={ctaClassName}>
      {ctaTexto}
      <ArrowRight size={20} weight="bold" aria-hidden="true" className={CTA_ICONO} />
    </Link>
  );

  return (
    <section className={`relative overflow-hidden py-24 md:py-36 ${tono.fondo}`}>
      {/* Aura de fondo (spec §9): forma grafica muy difusa, del lado
          contrario al texto, para que la seccion no sea un rectangulo
          plano de color. Dentro del overflow-hidden. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 h-[28rem] w-[28rem] rounded-full blur-[120px] ${tono.auraSeccion} ${textoIzquierda ? "-right-32" : "-left-32"}`}
      />

      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------- Imagen: primera en el DOM (orden mobile fijo) ---------- */}
          <div className={`min-w-0 ${textoIzquierda ? "lg:order-2" : "lg:order-1"}`}>
            <Reveal x={imagenX} y={20} delay={0.05}>
              <ContentImage
                imagen={imagen}
                imagenAlt={imagenAlt}
                hotspot={hotspot}
                titulo={titulo}
                tono={tono}
              />
            </Reveal>
          </div>

          {/* ---------- Texto ---------- */}
          <div className={`min-w-0 ${textoIzquierda ? "lg:order-1" : "lg:order-2"}`}>
            <div className="max-w-[38rem]">
              {/* Eyebrow grafico (spec §8): numero + linea + punto, todo
                  en el color que contrasta con ESTE fondo. */}
              <Reveal y={20} delay={0}>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-display text-sm font-bold tracking-[0.3em] ${tono.eyebrowNumero}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className={`h-px w-16 ${tono.eyebrowLinea}`} />
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${tono.eyebrowPunto}`}
                  />
                </div>
              </Reveal>

              {/* Titulo como composicion: una linea por tramo, con las
                  palabras destacadas mas grandes y en otro color. Cada
                  linea entra por separado (spec §16, nunca letra por
                  letra).

                  TIPOGRAFIA FLUIDA + break-words, no escalones fijos: una
                  palabra larga en un tramo destacado es `inline-block` y
                  no puede envolver, asi que crecia mas que su columna y
                  quedaba RECORTADA por el overflow-hidden de la seccion
                  (medido: "EMPRENDEDORES" ocupaba 374px en un contenedor
                  de 350px a 390px de viewport, y de 320px a 360px). El
                  clamp acompaña el ancho real del viewport y break-words
                  es la garantia final para cualquier palabra futura mas
                  larga todavia: parte la palabra antes que recortarla. */}
              <h2 className="mt-6 font-display leading-[0.98] tracking-tight">
                {lineas.map((linea, i) => (
                  <Reveal key={i} y={20} delay={dTitulo + i * pasoLinea}>
                    <span className="block">
                      {linea.map((segmento, j) => (
                        // El espacio explicito importa: JSX descarta el
                        // whitespace entre elementos, y sin esto saldria
                        // "conRESPUESTAS RAPIDAS" pegado.
                        <span key={j}>
                          {j > 0 && " "}
                          {segmento.destacado ? (
                            <span
                              className={`relative inline-block [overflow-wrap:anywhere] text-[clamp(1.9rem,1rem+2.8vw,3.75rem)] font-extrabold ${tono.tituloDestacado}`}
                            >
                              {segmento.texto}
                              {i === ultimoDestacado && (
                                <SubrayadoReveal
                                  className={tono.subrayado}
                                  delay={dTitulo + i * pasoLinea + 0.25}
                                />
                              )}
                            </span>
                          ) : (
                            <span
                              className={`[overflow-wrap:anywhere] text-[clamp(1.35rem,0.8rem+1.9vw,2.25rem)] font-bold ${tono.tituloBase}`}
                            >
                              {segmento.texto}
                            </span>
                          )}
                        </span>
                      ))}
                    </span>
                  </Reveal>
                ))}
              </h2>

              <Reveal y={20} delay={dDescripcion}>
                <p
                  className={`mt-7 max-w-[46ch] font-sans text-lg leading-relaxed ${tono.descripcion}`}
                >
                  {descripcion}
                </p>
              </Reveal>

              <Reveal y={20} delay={dCta}>
                <div className="mt-10 flex justify-center">{cta}</div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// `transition` (no `transition-all`): el subconjunto por defecto de Tailwind
// cubre color/background-color/transform/box-shadow -- justo lo que cambia
// en hover -- y deja afuera width/height/margin/padding/top/left a
// proposito (nunca animar esas propiedades).
const CTA_ICONO = "transition-transform duration-300 group-hover:translate-x-1";

function ContentImage({
  imagen,
  imagenAlt,
  hotspot,
  titulo,
  tono,
}: Pick<SeccionContenido, "imagen" | "imagenAlt" | "hotspot"> & {
  titulo: string;
  tono: Tono;
}) {
  // Mismo mecanismo que el Hero: object-position calculado desde el hotspot
  // {x,y} de Sanity (0-1), sin instalar @sanity/image-url.
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <div className="group relative">
      {/* Ring + glow adaptados al fondo (spec §12-13): sobre naranja la
          imagen se recorta con morado, sobre morado con blanco/naranja.
          Todo dentro del contenedor recortado. */}
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[20px] ${tono.imagenRing}`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${tono.imagenGlow}`}
        />
        {imagen ? (
          <>
            <Image
              src={imagen}
              alt={imagenAlt || titulo}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              loading="lazy"
              className="object-cover motion-safe:transition-transform motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.02]"
              style={{ objectPosition }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${tono.imagenVelo}`}
            />
          </>
        ) : (
          // Sin imagen todavia en Sanity: atmosfera de respaldo, nunca una
          // caja gris. Velo claro para que se distinga de cualquiera de los
          // 3 fondos posibles (naranja, blanco o morado).
          <div aria-hidden="true" className="absolute inset-0 border border-white/25 bg-white/10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-[80px]" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-[90px]" />
          </div>
        )}
      </div>
    </div>
  );
}
