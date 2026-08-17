import Link from "next/link";
import {
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  WhatsappLogo,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "./Wordmark";

/**
 * Pie de pagina en cuatro columnas: marca, navegacion, contacto y horario.
 * Debajo, un divisor, el copyright centrado y las redes.
 *
 * Telefono, correo y horario son los datos reales de la agencia.
 * PENDIENTE por reemplazar: los enlaces de redes (social) apuntan al inicio
 * de cada plataforma, faltan las URLs de los perfiles reales.
 */

const navegacion = [
  { label: "Servicios", href: "/#servicios" },
  { label: "El Socio", href: "/#socio" },
  { label: "Herramientas", href: "/#herramientas" },
  { label: "Clientes", href: "/#clientes" },
  { label: "Proceso", href: "/#proceso" },
];

const contacto = [
  {
    Icon: WhatsappLogo,
    label: "+593 98 447 2869",
    href: "https://wa.me/593984472869",
  },
  {
    Icon: EnvelopeSimple,
    label: "dofiagenciacreativa@gmail.com",
    href: "mailto:dofiagenciacreativa@gmail.com",
  },
  { Icon: MapPin, label: "Cuenca, Ecuador", href: null },
];

const horario = [
  "Lunes a viernes: 08:30 - 17:30",
  "Sábado y domingo: cerrado",
];

const social = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "TikTok", href: "https://tiktok.com", Icon: TiktokLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
];

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-lg font-bold tracking-tight text-foam">
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-brand-lift/20 bg-abyss">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        {/* Cuatro columnas */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          {/* Marca */}
          <div>
            <Wordmark size="md" withTagline />
            <p className="mt-6 max-w-[34ch] font-sans text-sm leading-relaxed text-mist">
              Creatividad, producción y CRM para marcas que necesitan vender, no
              solo publicar.
            </p>
          </div>

          {/* Navegacion */}
          <nav aria-label="Navegación del pie">
            <ColTitle>Navegación</ColTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {navegacion.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-mist transition-colors duration-300 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <ColTitle>Información</ColTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {contacto.map(({ Icon, label, href }) => {
                const inner = (
                  <span className="flex items-center gap-2.5 font-sans text-sm text-mist transition-colors duration-300 group-hover:text-foam">
                    <Icon
                      size={16}
                      weight="fill"
                      className="shrink-0 text-accent"
                    />
                    {label}
                  </span>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="group">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Horario */}
          <div>
            <ColTitle>Horario de atención</ColTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {horario.map((h) => (
                <li key={h} className="font-sans text-sm text-mist">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="mt-14 border-t border-brand-lift/20 pt-8">
          <p className="text-center font-sans text-sm text-mist-dim">
            © {new Date().getFullYear()} DOFI Agencia Creativa. Todos los
            derechos reservados. Sistemas por{" "}
            <span className="text-accent">FENIAX</span>.
          </p>

          {/* Redes */}
          <ul className="mt-8 flex items-center justify-center gap-3">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                >
                  <Icon size={18} weight="fill" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
