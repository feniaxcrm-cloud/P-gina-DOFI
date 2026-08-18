import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
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

const siteUrl = "https://dofi.agency";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DOFI Agencia Creativa | Un Mar de Ideas",
  description:
    "Agencia creativa que produce campañas, contenido audiovisual y sistemas de CRM que convierten. DOFI crea, FENIAX automatiza.",
  keywords: [
    "agencia creativa",
    "producción audiovisual",
    "CRM Kommo",
    "marketing digital Cuenca",
    "DOFI",
    "FENIAX",
  ],
  openGraph: {
    title: "DOFI Agencia Creativa | Un Mar de Ideas",
    description:
      "Creatividad que se ve y sistemas que venden. Producción audiovisual, campañas y CRM en un solo equipo.",
    url: siteUrl,
    siteName: "DOFI Agencia Creativa",
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DOFI Agencia Creativa | Un Mar de Ideas",
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
