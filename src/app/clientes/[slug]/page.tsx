import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  Globe,
} from "@phosphor-icons/react/dist/ssr";
import { getAccountBySlug, getAllActiveSlugs } from "@/lib/sanity";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VideoTile } from "@/components/VideoTile";
import { MagneticCta } from "@/components/MagneticCta";
import { Reveal } from "@/components/Reveal";

/** Genera una ruta estatica por cada cuenta activa en tiempo de build.
 *  Una cuenta creada despues sigue funcionando: dynamicParams (por defecto
 *  en Next) la renderiza on-demand la primera vez que alguien entra. */
export async function generateStaticParams() {
  const slugs = await getAllActiveSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const client = await getAccountBySlug(slug);
  if (!client) return { title: "Cliente no encontrado | DOFI" };

  return {
    title: `${client.name} | Casos ${company.name}`,
    description: client.summary,
    // Canonical solo con dominio definitivo configurado. En staging se omite
    // a proposito: un canonical a *.workers.dev seria peor que ninguno.
    // Ver src/config/site.ts.
    alternates: site.isIndexable
      ? { canonical: `/clientes/${client.slug}` }
      : undefined,
    openGraph: {
      title: `${client.name} | Casos ${company.shortName}`,
      description: client.summary,
      url: `/clientes/${client.slug}`,
      // NOTA: hoy client.cover es la misma portada generica en las 26
      // cuentas (ver AUDITORIA-DOFI-V1, VIS-012). Se conserva para no dejar
      // las tarjetas de enlace sin imagen; se reemplaza cuando exista el
      // material real de cada caso.
      images: [client.cover],
    },
  };
}

export default async function ClientePage({ params }: Params) {
  const { slug } = await params;
  const client = await getAccountBySlug(slug);
  if (!client) notFound();

  const hasResults = Boolean(client.results?.length);
  const social = client.social;
  const hasSocial = Boolean(
    social &&
      (social.instagram || social.facebook || social.tiktok || social.sitioWeb || social.otros?.length)
  );

  return (
    <>
      <Nav />
      <main>
        {/* Cabecera del caso */}
        <header className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_0%,#2A1760_0%,#170D33_55%,#120A26_100%)]"
          />
          <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
            <Link
              href="/#clientes"
              className="inline-flex items-center gap-2 font-sans text-sm text-mist transition-colors duration-300 hover:text-foam"
            >
              <ArrowLeft size={16} weight="bold" />
              Todos los clientes
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="rounded-full border border-brand-lift/35 px-3 py-1 font-sans text-xs text-mist">
                {client.sector}
              </span>
              <span className="font-sans text-sm text-mist-dim">
                {client.city}
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1] tracking-tighter text-foam md:text-8xl">
              {client.name}
            </h1>
            <p className="mt-8 max-w-[60ch] font-sans text-xl leading-relaxed text-mist">
              {client.summary}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {client.services.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-brand-lift/35 px-3.5 py-1.5 font-sans text-xs text-mist"
                >
                  {s}
                </li>
              ))}
            </ul>

            {hasSocial && (
              <ul className="mt-6 flex flex-wrap items-center gap-3">
                {social?.instagram && (
                  <li>
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${client.name} en Instagram`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                    >
                      <InstagramLogo size={18} weight="fill" />
                    </a>
                  </li>
                )}
                {social?.facebook && (
                  <li>
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${client.name} en Facebook`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                    >
                      <FacebookLogo size={18} weight="fill" />
                    </a>
                  </li>
                )}
                {social?.tiktok && (
                  <li>
                    <a
                      href={social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${client.name} en TikTok`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                    >
                      <TiktokLogo size={18} weight="fill" />
                    </a>
                  </li>
                )}
                {social?.sitioWeb && (
                  <li>
                    <a
                      href={social.sitioWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Sitio web de ${client.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lift/35 text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                    >
                      <Globe size={18} weight="fill" />
                    </a>
                  </li>
                )}
                {social?.otros?.map((o) => (
                  <li key={o.url}>
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-brand-lift/35 px-3.5 py-1.5 font-sans text-xs text-mist transition-colors duration-300 hover:border-accent/70 hover:text-accent"
                    >
                      {o.etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/* Portada grande */}
        <section className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] border border-brand-lift/25">
            <Image
              src={client.cover}
              alt={`Trabajo para ${client.name}`}
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          </div>
        </section>

        {/* Reto y enfoque */}
        {(client.challenge || client.approach) && (
          <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-8 md:py-36">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
              {client.challenge && (
                <Reveal>
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    El reto
                  </h2>
                  <p className="mt-6 font-sans text-lg leading-relaxed text-mist">
                    {client.challenge}
                  </p>
                </Reveal>
              )}
              {client.approach && (
                <Reveal delay={0.1}>
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Lo que hicimos
                  </h2>
                  <p className="mt-6 font-sans text-lg leading-relaxed text-mist">
                    {client.approach}
                  </p>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Resultados: solo si hay datos confirmados */}
        {hasResults && (
          <section className="border-y border-brand-lift/20 bg-deep/40 py-24">
            <div className="mx-auto max-w-[1400px] px-5 md:px-8">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Resultados
              </h2>
              <dl className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {client.results!.map((r) => (
                  <div key={r.label}>
                    <dt className="font-display text-6xl font-extrabold tracking-tighter text-foam md:text-7xl">
                      {r.value}
                    </dt>
                    <dd className="mt-3 font-sans text-base text-mist">
                      {r.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Piezas audiovisuales */}
        {client.videos.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-8 md:py-36">
            <h2 className="font-display text-3xl font-extrabold tracking-tighter text-foam md:text-5xl">
              Las piezas
            </h2>
            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {client.videos.map((v) => (
                <VideoTile key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}

        {/* Galeria */}
        {client.gallery && client.gallery.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 pb-28 md:px-8 md:pb-36">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {client.gallery.map((src, i) => (
                <div
                  key={src + i}
                  className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-brand-lift/25"
                >
                  <Image
                    src={src}
                    alt={`${client.name}, imagen ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonio */}
        {client.testimonial && (
          <section className="border-t border-brand-lift/20 py-28 md:py-36">
            <div className="mx-auto max-w-[900px] px-5 text-center md:px-8">
              <blockquote>
                <p className="font-display text-3xl font-bold leading-snug tracking-tight text-foam md:text-4xl">
                  {client.testimonial.quote}
                </p>
                <footer className="mt-8 font-sans text-base text-mist">
                  {client.testimonial.author}
                  <span className="text-mist-dim">
                    {" "}
                    - {client.testimonial.role}
                  </span>
                </footer>
              </blockquote>
            </div>
          </section>
        )}

        {/* Cierre */}
        <section className="border-t border-brand-lift/20 py-28 md:py-36">
          <div className="mx-auto max-w-[1400px] px-5 text-center md:px-8">
            <h2 className="mx-auto max-w-[18ch] font-display text-4xl font-extrabold leading-[1.03] tracking-tighter text-foam md:text-6xl">
              Tu marca puede ser la siguiente
            </h2>
            <div className="mt-10 flex justify-center">
              <MagneticCta href="/#contacto">Iniciar proyecto</MagneticCta>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
