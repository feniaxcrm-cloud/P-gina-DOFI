/**
 * Cinta de luz DOFI — elemento principal del Hero V1.
 *
 * QUE ES Y QUE NO ES
 * -------------------
 * No es una decoración: representa el recorrido "ideas -> atencion ->
 * accion comercial" que es el argumento del negocio (ver Sprint, punto 15).
 * Por eso el degradado de cada capa cuenta una historia de color propia
 * (ver "Paleta" mas abajo), no son tonos puestos al azar.
 *
 * TECNICA — por que SVG + CSS y no canvas/WebGL
 * -----------------------------------------------
 * Tres capas independientes (back/mid/front), cada una un SVG con su
 * curva dibujada DOS VECES seguidas dentro de un viewBox del doble de
 * ancho (0 0 2400 900: cada copia ocupa 1200 unidades). El SVG se renderiza
 * al 200% del ancho de su contenedor, y una animacion CSS (`translateX(0)
 * -> translateX(-50%)`) lo desliza exactamente un "tile" hacia la
 * izquierda antes de reiniciar — mismo mecanismo que ya usan
 * `.wall-track`/`.tide-track` en globals.css para las marquesinas, aplicado
 * a una curva en vez de a una fila de logos.
 *
 * El bucle es matematicamente perfecto, no aproximado: cada curva es la
 * SUMA de dos senos con 2 y 3 ciclos completos sobre el ancho del tile
 * (1200 unidades). Como ambas frecuencias completan un numero entero de
 * ciclos, la funcion vale exactamente lo mismo en x=0 y en x=1200 (mismo
 * valor Y y misma pendiente), asi que la costura entre una copia y la
 * siguiente es invisible. Los puntos de muestreo se pasaron por una
 * conversion Catmull-Rom -> Bezier para que la curva sea suave y con
 * curvatura variable (no una onda seno "perfecta" y predecible: cada capa
 * mezcla dos frecuencias con fases distintas).
 *
 * PROFUNDIDAD
 * -----------
 * Las tres capas se mueven a velocidades distintas (17s / 13s / 10s por
 * vuelta): la de atras es la mas lenta, la de adelante la mas rapida — es
 * el mismo principio de un fondo de paralaje, y basta para que el ojo lea
 * "planos" sin necesitar 3D real ni WebGL. Cada capa ademas tiene una copia
 * ancha y desenfocada (el glow) detras de su copia nitida.
 *
 * LEGIBILIDAD
 * -----------
 * Este componente es puramente decorativo (`aria-hidden`) y vive DETRAS
 * del texto del Hero. Hero.tsx pone ademas un velo (scrim) de
 * `surface-base` entre la onda y el bloque de texto para que el contraste
 * nunca dependa de por donde pase la curva en cada viewport — ver el
 * comentario correspondiente en Hero.tsx.
 *
 * REDUCED MOTION
 * ---------------
 * `.dofi-wave-track` se congela por completo en `prefers-reduced-motion:
 * reduce` (regla ya global en globals.css, igual que el resto de
 * animaciones por transform). La curva se queda quieta en un fotograma
 * intermedio: conserva forma, profundidad y los tres colores — no
 * desaparece ninguna capa.
 */

type Capa = {
  id: string;
  d: string;
  duracion: string;
  /** Centro Y de la curva en unidades del viewBox (0-900). Solo para
   *  documentar/depurar; no se usa en el render. */
  yCentro: number;
  glow: { ancho: number; opacidad: number };
  nucleo: { ancho: number; opacidad: number };
  gradiente: { id: string; paradas: { offset: string; color: string }[] };
};

const CAPAS: Capa[] = [
  {
    id: "back",
    d: "M 0.0 477.3 C 8.3 478.0, 33.3 482.8, 50.0 481.5 C 66.7 480.2, 83.3 474.4, 100.0 469.4 C 116.7 464.5, 133.3 457.0, 150.0 451.6 C 166.7 446.3, 183.3 441.0, 200.0 437.3 C 216.7 433.5, 233.3 431.4, 250.0 429.2 C 266.7 426.9, 283.3 426.1, 300.0 423.7 C 316.7 421.4, 333.3 418.9, 350.0 415.1 C 366.7 411.4, 383.3 406.0, 400.0 401.3 C 416.7 396.6, 433.3 390.2, 450.0 386.9 C 466.7 383.7, 483.3 380.5, 500.0 381.7 C 516.7 382.9, 533.3 386.9, 550.0 394.2 C 566.7 401.5, 583.3 413.5, 600.0 425.5 C 616.7 437.5, 633.3 453.9, 650.0 466.3 C 666.7 478.6, 683.3 492.5, 700.0 499.7 C 716.7 507.0, 733.3 511.5, 750.0 509.7 C 766.7 507.9, 783.3 499.9, 800.0 489.1 C 816.7 478.2, 833.3 460.3, 850.0 444.4 C 866.7 428.4, 883.3 408.0, 900.0 393.4 C 916.7 378.9, 933.3 364.4, 950.0 357.1 C 966.7 349.8, 983.3 347.1, 1000.0 349.5 C 1016.7 352.0, 1033.3 361.3, 1050.0 371.7 C 1066.7 382.1, 1083.3 398.6, 1100.0 412.0 C 1116.7 425.4, 1133.3 441.4, 1150.0 452.2 C 1166.7 463.1, 1191.7 473.1, 1200.0 477.3",
    duracion: "17s",
    yCentro: 430,
    glow: { ancho: 18, opacidad: 0.22 },
    nucleo: { ancho: 3, opacidad: 0.55 },
    gradiente: {
      id: "dofi-wave-back",
      paradas: [
        { offset: "0%", color: "var(--color-brand)" },
        { offset: "50%", color: "var(--color-brand-lift)" },
        { offset: "100%", color: "var(--color-brand)" },
      ],
    },
  },
  {
    id: "mid",
    d: "M 0.0 504.0 C 8.3 504.3, 33.3 506.2, 50.0 506.0 C 66.7 505.7, 83.3 504.9, 100.0 502.6 C 116.7 500.4, 133.3 497.4, 150.0 492.4 C 166.7 487.5, 183.3 481.0, 200.0 473.1 C 216.7 465.1, 233.3 454.8, 250.0 444.9 C 266.7 435.0, 283.3 422.8, 300.0 413.8 C 316.7 404.7, 333.3 395.1, 350.0 390.5 C 366.7 385.9, 383.3 383.5, 400.0 386.3 C 416.7 389.1, 433.3 396.7, 450.0 407.2 C 466.7 417.7, 483.3 434.0, 500.0 449.2 C 516.7 464.5, 533.3 484.0, 550.0 498.7 C 566.7 513.3, 583.3 528.7, 600.0 537.3 C 616.7 545.8, 633.3 550.8, 650.0 549.8 C 666.7 548.9, 683.3 541.5, 700.0 531.4 C 716.7 521.3, 733.3 504.5, 750.0 489.2 C 766.7 474.0, 783.3 454.5, 800.0 439.8 C 816.7 425.1, 833.3 410.1, 850.0 401.0 C 866.7 391.9, 883.3 386.2, 900.0 385.0 C 916.7 383.8, 933.3 387.9, 950.0 393.7 C 966.7 399.5, 983.3 410.1, 1000.0 419.6 C 1016.7 429.2, 1033.3 441.4, 1050.0 451.1 C 1066.7 460.8, 1083.3 470.6, 1100.0 478.0 C 1116.7 485.4, 1133.3 491.1, 1150.0 495.5 C 1166.7 499.8, 1191.7 502.5, 1200.0 504.0",
    duracion: "13s",
    yCentro: 460,
    glow: { ancho: 22, opacidad: 0.28 },
    nucleo: { ancho: 4, opacidad: 0.75 },
    gradiente: {
      id: "dofi-wave-mid",
      paradas: [
        { offset: "0%", color: "var(--color-brand-lift)" },
        { offset: "45%", color: "var(--color-accent)" },
        { offset: "75%", color: "var(--color-coral)" },
        { offset: "100%", color: "var(--color-brand-lift)" },
      ],
    },
  },
  {
    id: "front",
    d: "M 0.0 473.8 C 8.3 473.2, 33.3 473.7, 50.0 470.4 C 66.7 467.1, 83.3 461.2, 100.0 454.1 C 116.7 447.1, 133.3 436.6, 150.0 428.1 C 166.7 419.5, 183.3 409.0, 200.0 402.8 C 216.7 396.7, 233.3 391.5, 250.0 391.3 C 266.7 391.2, 283.3 395.0, 300.0 401.9 C 316.7 408.8, 333.3 421.1, 350.0 432.9 C 366.7 444.7, 383.3 460.7, 400.0 472.5 C 416.7 484.4, 433.3 497.1, 450.0 503.9 C 466.7 510.8, 483.3 514.6, 500.0 513.5 C 516.7 512.4, 533.3 505.7, 550.0 497.4 C 566.7 489.0, 583.3 475.2, 600.0 463.5 C 616.7 451.7, 633.3 437.1, 650.0 427.0 C 666.7 417.0, 683.3 407.8, 700.0 403.1 C 716.7 398.5, 733.3 397.7, 750.0 399.4 C 766.7 401.0, 783.3 407.3, 800.0 413.2 C 816.7 419.1, 833.3 428.1, 850.0 434.7 C 866.7 441.3, 883.3 448.4, 900.0 452.9 C 916.7 457.4, 933.3 460.1, 950.0 461.6 C 966.7 463.2, 983.3 462.4, 1000.0 462.2 C 1016.7 462.0, 1033.3 460.6, 1050.0 460.6 C 1066.7 460.7, 1083.3 461.2, 1100.0 462.5 C 1116.7 463.8, 1133.3 466.8, 1150.0 468.6 C 1166.7 470.5, 1191.7 472.9, 1200.0 473.8",
    duracion: "10s",
    yCentro: 448,
    glow: { ancho: 14, opacidad: 0.2 },
    nucleo: { ancho: 2.5, opacidad: 0.9 },
    gradiente: {
      id: "dofi-wave-front",
      paradas: [
        { offset: "0%", color: "var(--color-accent-lift)" },
        { offset: "50%", color: "var(--color-foam)" },
        { offset: "100%", color: "var(--color-accent-lift)" },
      ],
    },
  },
];

export function DofiWave() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] overflow-hidden md:h-[62%]"
    >
      {CAPAS.map((capa) => (
        <svg
          key={capa.id}
          className="dofi-wave-track absolute inset-0 h-full w-[200%]"
          style={{ animationDuration: capa.duracion }}
          viewBox="0 0 2400 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={capa.gradiente.id} x1="0%" y1="0%" x2="100%" y2="0%">
              {capa.gradiente.paradas.map((p) => (
                <stop key={p.offset} offset={p.offset} style={{ stopColor: p.color }} />
              ))}
            </linearGradient>
            <filter id={`${capa.id}-blur`} x="-20%" y="-100%" width="140%" height="300%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {/* Glow: copia ancha y desenfocada, detras del nucleo nitido. */}
          <g opacity={capa.glow.opacidad} filter={`url(#${capa.id}-blur)`}>
            <path d={capa.d} stroke={`url(#${capa.gradiente.id})`} strokeWidth={capa.glow.ancho} strokeLinecap="round" fill="none" />
            <path d={capa.d} transform="translate(1200,0)" stroke={`url(#${capa.gradiente.id})`} strokeWidth={capa.glow.ancho} strokeLinecap="round" fill="none" />
          </g>

          {/* Nucleo nitido. */}
          <g opacity={capa.nucleo.opacidad}>
            <path d={capa.d} stroke={`url(#${capa.gradiente.id})`} strokeWidth={capa.nucleo.ancho} strokeLinecap="round" fill="none" />
            <path d={capa.d} transform="translate(1200,0)" stroke={`url(#${capa.gradiente.id})`} strokeWidth={capa.nucleo.ancho} strokeLinecap="round" fill="none" />
          </g>
        </svg>
      ))}
    </div>
  );
}
