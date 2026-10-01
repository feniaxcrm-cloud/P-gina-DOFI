import { PANTALLA, whatsapp, type TemaChat } from "@/remotion/feniax/tema";

/**
 * El telefono que rodea la demo de WhatsApp: bisel, isla de la camara y
 * botones laterales. Es HTML de la pagina, no parte del video -- asi la
 * composicion de Remotion dibuja solo la pantalla (390 x 844) y el marco
 * escala con CSS sin perder nitidez.
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
    <div
      className={`relative w-full rounded-[46px] bg-[linear-gradient(150deg,#3A2348_0%,#160C1E_45%,#2A1638_100%)] p-[9px] shadow-[0_40px_80px_-30px_rgba(42,22,56,0.75),0_0_0_1px_rgba(255,255,255,0.08)_inset] ${className}`}
    >
      {/* Botones laterales: volumen a la izquierda, encendido a la derecha. */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[18%] h-[7%] w-[3px] rounded-l-full bg-[#2A1638]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[27%] h-[7%] w-[3px] rounded-l-full bg-[#2A1638]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[22%] h-[11%] w-[3px] rounded-r-full bg-[#2A1638]" />
      <div
        className="relative w-full overflow-hidden rounded-[37px]"
        style={{ aspectRatio: `${PANTALLA.ancho} / ${PANTALLA.alto}`, background: whatsapp[tema].fondo }}
      >
        {children}
        {/* Isla de la camara, por encima de la barra de estado. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[1.3%] h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  );
}
