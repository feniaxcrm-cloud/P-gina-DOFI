import { VideoBucle } from "@/components/marketing/VideoBucle";

/**
 * "Así trabaja FENIAX": el video del bloque editorial. Es un motion graphic
 * renderizado con HyperFrames (fuente en video/flujo-feniax/, ver su
 * README): los mensajes de WhatsApp, Instagram, Facebook y la web entran,
 * la IA los responde y cada uno avanza por el embudo del CRM hasta la venta.
 *
 * La reproduccion (solo en pantalla, en bucle, con pausa y sin arrancar con
 * movimiento reducido) vive en VideoBucle, que comparte con Tráfico/Ads.
 */
export function VideoFlujo({ className = "" }: { className?: string }) {
  return (
    <VideoBucle
      src="/feniax/flujo-feniax.mp4"
      poster="/feniax/flujo-feniax.jpg"
      descripcion="Animación: los mensajes de WhatsApp, Instagram, Facebook y la web llegan a FENIAX, la IA los responde y cada cliente avanza por el embudo del CRM hasta la venta."
      className={className}
    />
  );
}
