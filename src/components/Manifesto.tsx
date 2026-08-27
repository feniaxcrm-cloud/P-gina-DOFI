const words = [
  "Un mar de ideas",
  "Creatividad con dirección",
  "Piezas que se ven",
  "Sistemas que venden",
];

/**
 * Unica marquesina de la pagina.
 * Motivo: refuerza el eslogan como continuidad, igual que una corriente.
 */
export function Manifesto() {
  const strip = [...words, ...words];

  return (
    <section
      aria-label="Eslogan de la agencia"
      className="relative overflow-hidden bg-canvas py-16"
    >
      <div className="flex w-max tide-track">
        {strip.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="flex shrink-0 items-center font-display text-[13vw] font-extrabold leading-none tracking-tighter text-transparent lg:text-[7.5vw]"
            style={{
              // Trazo oscuro (antes blanco, invisible sobre el lienzo claro
              // al que migro esta seccion en el sprint de Header).
              WebkitTextStroke:
                "1px color-mix(in srgb, var(--color-ink) 32%, transparent)",
            }}
          >
            {w}
            <span className="ml-8 mr-14 inline-block h-[0.16em] w-[0.16em] shrink-0 rounded-full bg-accent lg:ml-12 lg:mr-20" />
          </span>
        ))}
      </div>
    </section>
  );
}
