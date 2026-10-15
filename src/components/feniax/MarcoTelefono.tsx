import { MarcoIphone } from "@/components/MarcoIphone";
import { PANTALLA, whatsapp, type TemaChat } from "@/remotion/feniax/tema";

/**
 * El telefono que rodea la demo de WhatsApp: el marco de iPhone comun
 * (MarcoIphone) con la pantalla de la demo (390 x 712) y el fondo del chat.
 * Es HTML de la pagina, no parte del video -- asi la composicion de Remotion
 * dibuja solo la pantalla y el marco escala con CSS sin perder nitidez.
 *
 * Lo comparten el reproductor real y su reemplazo mientras carga (mismo
 * tamaño exacto: cuando Remotion llega, nada en la pagina se mueve).
 */
export function MarcoTelefono({
  tema,
  children,
  className = "",
}: {
  tema: TemaChat;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <MarcoIphone pantalla={PANTALLA} fondo={whatsapp[tema].fondo} className={className}>
      {children}
    </MarcoIphone>
  );
}
