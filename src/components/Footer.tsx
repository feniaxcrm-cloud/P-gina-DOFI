import { InstagramLogo, LinkedinLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "./Wordmark";

const social = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "TikTok", href: "https://tiktok.com", Icon: TiktokLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-lift/20 bg-abyss py-14">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Wordmark size="md" withTagline />
          <p className="mt-6 max-w-[34ch] font-sans text-sm leading-relaxed text-mist">
            Creatividad, producción y CRM para marcas que necesitan vender, no
            solo publicar.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:items-end">
          <ul className="flex gap-3">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-foam"
                >
                  <Icon size={18} weight="fill" />
                </a>
              </li>
            ))}
          </ul>
          <p className="font-sans text-sm text-mist-dim">
            {new Date().getFullYear()} DOFI Agencia Creativa. Cuenca, Ecuador.
          </p>
        </div>
      </div>
    </footer>
  );
}
