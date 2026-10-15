/**
 * Marco de iPhone: bisel, isla de la cámara y botones laterales, en HTML (no
 * dentro de un video), así escala con CSS sin perder nitidez.
 *
 * Lo comparten el teléfono de la demo de WhatsApp (ChatBots/CRM, ver
 * feniax/MarcoTelefono) y el del video estilo TikTok de «Clientes y casos de
 * éxito» (Marketing Digital y Asesorías, ver marketing/VideoTikTok).
 *
 * `pantalla` es la proporción de la pantalla (sin el bisel): el marco mide el
 * ancho de su contenedor y su alto sale de ahí, más los 18 px del bisel.
 */
export function MarcoIphone({
  pantalla,
  fondo,
  children,
  className = "",
}: {
  pantalla: { ancho: number; alto: number };
  /** Color de fondo de la pantalla (lo que se ve mientras carga lo de adentro). */
  fondo: string;
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
        style={{ aspectRatio: `${pantalla.ancho} / ${pantalla.alto}`, background: fondo }}
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
