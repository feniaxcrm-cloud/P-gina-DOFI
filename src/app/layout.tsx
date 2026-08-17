import type { Metadata } from "next";
import { Sora, Geist } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
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
    <html lang="es" className={`${sora.variable} ${geist.variable}`}>
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
