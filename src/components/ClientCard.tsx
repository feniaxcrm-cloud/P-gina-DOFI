import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Client } from "@/data/clients";

/**
 * Tarjeta de cliente. Presentacional: la usa la galeria y el carrusel.
 *
 * `hidden` marca las copias clonadas del carrusel: quedan fuera del arbol de
 * accesibilidad y del orden de tabulacion para no duplicar enlaces.
 */
export function ClientCard({
  client,
  clone = false,
}: {
  client: Client;
  clone?: boolean;
}) {
  return (
    <Link
      href={`/clientes/${client.slug}`}
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-brand-lift/25 bg-deep/40 transition-colors duration-500 hover:border-accent/50"
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        <Image
          src={client.cover}
          alt={clone ? "" : `Trabajo para ${client.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent"
        />
        <span className="absolute left-4 top-4 rounded-full border border-foam/20 bg-abyss/50 px-3 py-1 font-sans text-[11px] text-foam backdrop-blur-md">
          {client.sector}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold tracking-tight text-foam">
            {client.name}
          </h3>
          <ArrowUpRight
            size={22}
            weight="bold"
            aria-hidden="true"
            className="mt-1 shrink-0 text-mist-dim transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          />
        </div>
        <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-mist">
          {client.summary}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {client.services.slice(0, 3).map((s) => (
            <li
              key={s}
              className="rounded-full border border-brand-lift/30 px-2.5 py-1 font-sans text-[11px] text-mist-dim"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
