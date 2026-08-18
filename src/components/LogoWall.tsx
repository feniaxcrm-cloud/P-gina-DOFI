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
 */
export function LogoWall() {
  const strip = [...clients, ...clients];

  return (
    <section className="relative overflow-hidden border-y border-brand-lift/15 bg-deep/40 py-14">
      <p className="mb-10 text-center font-sans text-sm text-mist-dim">
        Cuentas que confían su marca y su CRM a este equipo
      </p>

      <div className="flex w-max wall-track">
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
