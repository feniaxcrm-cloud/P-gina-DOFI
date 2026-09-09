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
import { MapaMini } from "./MapaMini";
import { company, socialLinks, type SocialKey } from "@/config/company";
import { NAV_LINKS } from "@/config/navegacion";
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
 *
 * NAVEGACION: sale de src/config/navegacion.ts, la MISMA lista que pinta el
 * Header. Antes este archivo tenia su propio arreglo con anclas
 * (/#servicios, /#socio, /#herramientas, /#clientes, /#proceso) que habian
 * quedado rotas: esas secciones se retiraron de la home en el sprint
 * "Retirar secciones entre Sección 4 y el Footer", asi que los cinco
 * enlaces del pie no llevaban a ningun lado.
 */

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
  // Direccion completa en dos lineas. El enlace abre la ficha de Google
  // Maps, igual que la mini tarjeta de la ultima columna.
  {
    Icon: MapPin,
    label: `${company.location.address},\n${company.location.city} - ${company.location.country}`,
    href: company.location.mapsUrl,
    externo: true,
  },
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
        {/* La primera columna era 1.4fr cuando llevaba un parrafo de tres
            lineas. Ahora dice solo "Un Mar de Ideas.", asi que ese ancho
            extra quedaba como un hueco en el medio del pie: se reparte hacia
            las columnas que si crecieron (Información con la direccion en
            dos lineas, y Horario con la tarjeta de mapa). */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr_1.25fr] lg:gap-10">
          {/* Marca */}
          <div>
            <Wordmark size="md" withTagline />
            <p className="mt-6 font-sans text-sm leading-relaxed text-fog">
              {company.tagline}.
            </p>
          </div>

          {/* Navegacion: misma lista que el Header (config/navegacion.ts) */}
          <nav aria-label="Navegación del pie">
            <ColTitle>Navegación</ColTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
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
              {contacto.map(({ Icon, label, href, externo }) => {
                const inner = (
                  // items-start (no items-center) y whitespace-pre-line: la
                  // direccion ocupa dos lineas, y con el icono centrado
                  // quedaria flotando a media altura del bloque.
                  <span className="flex items-start gap-2.5 whitespace-pre-line font-sans text-sm leading-snug text-fog transition-colors duration-300 group-hover:text-foam">
                    <Icon
                      size={16}
                      weight="fill"
                      className="mt-[3px] shrink-0 text-accent"
                    />
                    {label}
                  </span>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className="group"
                        {...(externo
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
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

          {/* Horario + ubicacion */}
          <div>
            <ColTitle>Horario de atención</ColTitle>
            <ul className="mt-6 flex flex-col gap-3">
              {horario.map((h) => (
                <li key={h} className="font-sans text-sm text-fog">
                  {h}
                </li>
              ))}
            </ul>
            <MapaMini />
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
