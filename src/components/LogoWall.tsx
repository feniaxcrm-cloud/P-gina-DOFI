import { clients } from "@/data/clients";

/**
 * Muro de cuentas activas, en bucle continuo.
 *
 * Mismo mecanismo que la marquesina del manifiesto (Manifesto.tsx): una tira
 * duplicada que se traslada de 0% a -50%, asi el recorrido no muestra
 * costura. Aqui va calibrada a su propio contenido (chips compactos, no
 * tipografia gigante) y se pausa al pasar el cursor para poder leer un
 * nombre a medio recorrido.
 *
 * Mientras no existan los logotipos reales se usa un monograma geometrico.
 * SUSTITUCION: deja cada logo en /public/clientes/<slug>.svg y cambia el
 * <span> del monograma por <Image src={`/clientes/${c.slug}.svg`} ... />
 *
 * VELOCIDAD: la animacion recorre 0% a -50% en un tiempo FIJO en segundos.
 * Como la tira es mas ancha cuantas mas cuentas hay, ese mismo tiempo fijo
 * hace que el recorrido se sienta mas rapido a medida que se agregan
 * cuentas (mas distancia en el mismo tiempo). Por eso la duracion se
 * calcula en funcion de clients.length en vez de ser un numero fijo: asi
 * la velocidad real (px/seg) se mantiene igual sin importar cuantas cuentas
 * haya. Calibrado en 24s para 7 cuentas (la cantidad original).
 */
const SEGUNDOS_POR_CUENTA = 24 / 7;

export function LogoWall() {
  const strip = [...clients, ...clients];
  const duracion = `${(clients.length * SEGUNDOS_POR_CUENTA).toFixed(1)}s`;

  return (
    <section className="relative overflow-hidden border-y border-brand-lift/15 bg-deep/40 py-14">
      <p className="mb-10 text-center font-sans text-sm text-mist-dim">
        Cuentas que confían su marca y su CRM a este equipo
      </p>

      <div
        className="flex w-max wall-track"
        style={{ animationDuration: duracion }}
      >
        {strip.map((c, i) => (
          <div
            key={`${c.slug}-${i}`}
            aria-hidden={i >= clients.length || undefined}
            className="flex shrink-0 items-center px-6"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-brand-lift/30 bg-surface font-display text-sm font-bold tracking-tight text-mist transition-colors duration-300 hover:border-accent/60 hover:text-foam"
              aria-hidden="true"
            >
              {c.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="ml-3 whitespace-nowrap font-display text-sm font-semibold tracking-tight text-mist">
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
