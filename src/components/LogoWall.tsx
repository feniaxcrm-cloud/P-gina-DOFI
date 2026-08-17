import { clients } from "@/data/clients";

/**
 * Muro de cuentas activas.
 * Mientras no existan los logotipos reales se usa un monograma geometrico.
 * SUSTITUCION: deja cada logo en /public/clientes/<slug>.svg y cambia el
 * <span> del monograma por <Image src={`/clientes/${c.slug}.svg`} ... />
 */
export function LogoWall() {
  return (
    <section className="relative border-y border-brand-lift/15 bg-deep/40 py-14">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <p className="mb-10 text-center font-sans text-sm text-mist-dim">
          Cuentas que confían su marca y su CRM a este equipo
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
          {clients.map((c) => (
            <li key={c.slug} className="flex items-center justify-center">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-brand-lift/30 bg-surface font-display text-sm font-bold tracking-tight text-mist transition-colors duration-300 hover:border-accent/60 hover:text-foam"
                aria-hidden="true"
              >
                {c.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="ml-3 font-display text-sm font-semibold tracking-tight text-mist">
                {c.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
