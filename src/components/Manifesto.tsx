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
      className="relative overflow-hidden bg-abyss py-16"
    >
      <div className="flex w-max tide-track">
        {strip.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="flex shrink-0 items-center font-display text-[13vw] font-extrabold leading-none tracking-tighter text-transparent lg:text-[7.5vw]"
            style={{
              WebkitTextStroke: "1px rgba(179,165,212,0.30)",
            }}
          >
            {w}
            <span className="mx-8 inline-block h-[0.16em] w-[0.16em] shrink-0 rounded-full bg-accent lg:mx-12" />
          </span>
        ))}
      </div>
    </section>
  );
}
