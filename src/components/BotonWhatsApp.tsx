import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { MENSAJE_FLOTANTE } from "@/lib/cta";
import { createWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Boton flotante de WhatsApp (todas las paginas, desde el layout raiz).
 *
 * Abre el chat de DOFI con el mensaje ya escrito (MENSAJE_FLOTANTE). El numero
 * sale de src/config/company.ts, como el de todos los enlaces del sitio.
 *
 * DISCRETO: un circulo de 52 px en la esquina inferior derecha, sin texto ni
 * animacion permanente (nada que compita con el contenido); solo crece un
 * poco al pasar el cursor. Respeta la zona segura de los telefonos con barra
 * inferior. Es un enlace normal: teclado, lectores de pantalla (aria-label) y
 * foco visible.
 */
const ENLACE = createWhatsAppUrl({ message: MENSAJE_FLOTANTE });

export function BotonWhatsApp() {
  return (
    <a
      href={ENLACE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir a DOFI por WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] ring-1 ring-white/40 transition-transform duration-300 ease-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-whatsapp motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
    </a>
  );
}
