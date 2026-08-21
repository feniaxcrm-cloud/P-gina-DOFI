import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { company } from "@/config/company";
import { site } from "@/config/site";
import "./globals.css";

/**
 * Fuentes auto-alojadas, sin llamadas de red durante el build.
 *
 * Antes se usaba next/font/google, que descarga los archivos de fuente en
 * cada build. En el pipeline de Cloudflare Workers eso colgo el build por
 * ~29 minutos hasta que lo mato el timeout: el sandbox de build no llega
 * con normalidad a fonts.gstatic.com. Con archivos locales el build no
 * depende de ninguna red externa.
 *
 * Sora: un solo archivo variable (pesos 300-800) descargado una vez de
 * Google Fonts y guardado en ./fonts/sora-variable.woff2.
 * Geist: paquete oficial de Vercel (geist/font/sans), ya trae los archivos
 * empaquetados. Su variable de CSS es --font-geist-sans (fija por el
 * paquete), por eso globals.css referencia ese nombre y no --font-geist.
 */
const sora = localFont({
  src: "./fonts/sora-variable.woff2",
  variable: "--font-sora",
  display: "swap",
  weight: "300 800",
});

/**
 * URL publica y permiso de indexacion: ambos salen de src/config/site.ts.
 *
 * Antes aqui estaba escrito a mano `const siteUrl = "https://dofi.agency"`,
 * un dominio que no sirve este sitio. Con eso, og:url mandaba a cada enlace
 * compartido a un destino equivocado.
 *
 * Mientras NEXT_PUBLIC_SITE_URL no traiga un dominio propio, el sitio se
 * comporta como staging: noindex,nofollow y SIN canonical (un canonical a
 * *.workers.dev seria peor que no tenerlo). En cuanto se defina el dominio
 * definitivo, el mismo codigo pasa a emitir canonical e indexable.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${company.name} | ${company.tagline}`,
  description:
    "Agencia creativa que produce campañas, contenido audiovisual y sistemas de CRM que convierten. DOFI crea, FENIAX automatiza.",
  keywords: [
    "agencia creativa",
    "producción audiovisual",
    "CRM Kommo",
    `marketing digital ${company.location.city}`,
    company.shortName,
    company.partner.name,
  ],
  // Solo con dominio definitivo. Ver nota de arriba.
  alternates: site.isIndexable ? { canonical: "/" } : undefined,
  robots: site.isIndexable
    ? undefined
    : {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
  openGraph: {
    title: `${company.name} | ${company.tagline}`,
    description:
      "Creatividad que se ve y sistemas que venden. Producción audiovisual, campañas y CRM en un solo equipo.",
    url: site.url,
    siteName: company.name,
    locale: "es_EC",
    type: "website",
    // PENDIENTE og:image: no existe todavia un asset propio de 1200x630.
    // Los archivos disponibles son el logo (cuadrado) y una portada
    // generica de relleno; ninguno sirve como tarjeta de enlace y no se
    // pone una imagen mediocre solo por rellenar el campo.
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | ${company.tagline}`,
    description:
      "Creatividad que se ve y sistemas que venden. Producción audiovisual, campañas y CRM.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${sora.variable} ${GeistSans.variable}`}>
      <body>
        {/* Las animaciones de entrada se renderizan con opacity 0 en el HTML
            del servidor y solo se revelan al hidratar. Sin JS eso dejaria
            secciones enteras invisibles, asi que aqui se fuerzan visibles. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <div className="grain-layer" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
