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
import { company, socialLinks, type SocialKey } from "@/config/company";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Pie de pagina en cuatro columnas: marca, navegacion, contacto y horario.
 * Debajo, un divisor, el copyright centrado y las redes.
 *
 * TODOS los datos corporativos salen de src/config/company.ts. Antes estaban
 * escritos a mano aqui, y el numero de WhatsApp de este archivo era el bueno
 * mientras Contact.tsx usaba otro inventado.
 *
 * REDES: solo se pintan las que tienen URL de perfil real configurada. Antes
 * los tres iconos enlazaban a instagram.com, tiktok.com y linkedin.com —las
 * portadas de las plataformas—, lo que resta credibilidad a una agencia que
 * vende gestion de redes. Sin URL verificada, el icono no aparece. Se
 * activan definiendo NEXT_PUBLIC_INSTAGRAM_URL / _TIKTOK_URL / _LINKEDIN_URL.
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
    label: company.phone.display,
    href: whatsappUrl,
  },
  {
    Icon: EnvelopeSimple,
    label: company.email,
    href: `mailto:${company.email}`,
  },
  { Icon: MapPin, label: company.location.label, href: null },
];

const horario = company.hours;

const ICONOS_SOCIAL = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  linkedin: LinkedinLogo,
} satisfies Record<Extract<SocialKey, "instagram" | "tiktok" | "linkedin">, typeof InstagramLogo>;

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
            <p className="mt-6 max-w-[34ch] font-sans text-sm leading-relaxed text-fog">
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
                    className="font-sans text-sm text-fog transition-colors duration-300 hover:text-accent"
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
                  <span className="flex items-center gap-2.5 font-sans text-sm text-fog transition-colors duration-300 group-hover:text-foam">
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
                <li key={h} className="font-sans text-sm text-fog">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="mt-14 border-t border-brand-lift/20 pt-8">
          <p className="text-center font-sans text-sm text-fog">
            © {new Date().getFullYear()} {company.name}. Todos los derechos
            reservados. Sistemas por{" "}
            <span className="text-accent">{company.partner.name}</span>.
          </p>

          {/* Redes. La lista puede venir vacia: ver nota de arriba. */}
          {socialLinks.length > 0 && (
            <ul className="mt-8 flex items-center justify-center gap-3">
              {socialLinks.map(({ key, label, href }) => {
                const Icon = ICONOS_SOCIAL[key];
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                    >
                      <Icon size={18} weight="fill" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
