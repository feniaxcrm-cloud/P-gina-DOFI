/**
 * Fondo de marca para los banners fotograficos mientras no haya foto
 * cargada en Sanity: profundidad morada, dos resplandores (morado y naranja
 * DOFI) y cuatro lineas de oleaje. "Un Mar de Ideas", sin necesitar una
 * imagen.
 *
 * Es decorativo (aria-hidden): no comunica nada que no digan ya los textos
 * del banner. Y es puro CSS + SVG inline -- cero peticiones de red.
 */
export function AtmosferaMar({ variante = "equipo" }: { variante?: "equipo" | "cierre" }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_130%_at_15%_0%,#2E1B68_0%,#1A0F3D_45%,#120A26_100%)]"
    >
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-lift/30 blur-[140px]" />
      <div
        className={
          variante === "cierre"
            ? "absolute -bottom-56 left-1/2 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-accent/25 blur-[150px]"
            : "absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[140px]"
        }
      />
      <svg
        className="absolute inset-x-0 bottom-0 h-[55%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 250 C 240 190, 480 310, 720 250 S 1200 190, 1440 240" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
        <path d="M0 292 C 260 232, 520 352, 760 292 S 1220 232, 1440 282" stroke="rgba(244,123,32,0.38)" strokeWidth="1.5" />
        <path d="M0 334 C 280 284, 540 384, 800 334 S 1240 284, 1440 324" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
        <path d="M0 376 C 300 336, 560 416, 840 376 S 1260 336, 1440 368" stroke="rgba(109,75,201,0.50)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
