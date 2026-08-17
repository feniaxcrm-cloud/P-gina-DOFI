import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Todo el material vive en /public. Sin dependencias de imagen externas.
  // Se deja el formato por defecto de Next (WebP): soporte universal y
  // optimizacion mas barata en Vercel que AVIF.
};

export default nextConfig;
