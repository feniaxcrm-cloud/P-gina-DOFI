"use client";

import { motion, type Variants } from "motion/react";

/**
 * Hace que un trazo (una linea de ruta, una orbita punteada) se DIBUJE al
 * entrar en pantalla: se revela de izquierda a derecha con un clip-path.
 *
 * POR QUE CLIP-PATH Y NO pathLength
 * -----------------------------------------------------------------
 * Las lineas de DOFI son punteadas (strokeDasharray). La animacion clasica
 * de "dibujar" un SVG (pathLength / stroke-dashoffset) usa justamente el
 * dasharray para esconder el trazo, asi que pisaria el punteado. Recortar el
 * contenedor deja el punteado intacto y funciona con cualquier SVG adentro.
 *
 * POR QUE DOS CAPAS
 * -----------------------------------------------------------------
 * Chrome calcula la visibilidad (IntersectionObserver) de un elemento CON su
 * propio clip-path aplicado: recortado al 100%, su area visible es cero y
 * nunca llega al umbral, asi que el trazo no se dibujaba jamas (medido: se
 * quedaba en inset(0% 100% 0% 0%) despues de recorrer la pagina). Por eso la
 * capa de afuera, sin recorte, es la que detecta la entrada, y la de adentro
 * es la que se recorta (le llega el estado por variants).
 *
 * Una sola vez, sin repetir. Con movimiento reducido, globals.css le fuerza
 * clip-path:none a [data-trazo]: la linea aparece ya completa.
 */

const recorte: Variants = {
  oculto: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)" },
};

export function Trazo({
  children,
  className,
  animar = true,
  delay = 0.15,
  duracion = 1.4,
}: {
  children: React.ReactNode;
  className?: string;
  animar?: boolean;
  delay?: number;
  duracion?: number;
}) {
  if (!animar) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial="oculto" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <motion.div
        data-trazo="true"
        className="h-full w-full"
        variants={recorte}
        transition={{ duration: duracion, delay, ease: [0.65, 0, 0.35, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
