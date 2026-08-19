import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Se deja el formato por defecto de Next (WebP): soporte universal y
  // optimizacion mas barata en Vercel que AVIF.
  images: {
    // Las portadas de clientes ahora pueden venir de Sanity (ver
    // src/lib/sanity.ts). El resto del material sigue viviendo en /public.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
