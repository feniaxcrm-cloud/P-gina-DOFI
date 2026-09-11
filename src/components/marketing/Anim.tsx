import { Reveal } from "@/components/Reveal";

/**
 * Entrada animada que se puede apagar desde Sanity (campo "Animaciones" de
 * cada seccion de Marketing Digital). Con `animar` en false devuelve un div
 * normal: el contenido aparece quieto, sin ninguna transicion.
 *
 * Con `animar` en true delega en <Reveal>, que ya respeta
 * prefers-reduced-motion por la regla [data-reveal] de globals.css -- asi
 * que el visitante que pidio menos movimiento tampoco lo ve, aunque la
 * seccion tenga las animaciones activadas.
 */
export function Anim({
  animar,
  children,
  className,
  delay,
  y,
  duration,
}: {
  animar: boolean;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  if (!animar) return <div className={className}>{children}</div>;
  return (
    <Reveal className={className} delay={delay} y={y} duration={duration}>
      {children}
    </Reveal>
  );
}
