import type { ImagenSanity } from "@/lib/marketing-digital";

/**
 * Las dos imagenes que acompañan el cierre de Marketing Digital («¿Somos socios
 * o le pasas tu oportunidad a alguien más?»): el hombre dando la mano a la
 * izquierda y el delfín a la derecha, en un solo PNG transparente de
 * 2077 x 757 sobre el fondo oscuro de la sección.
 *
 * Tráfico/Ads, ChatBots/CRM y Asesorías replican ese mismo cierre (pedido del
 * 2026-10-08) y la imagen se edita en el Studio, en cada página: «Cierre» →
 * «Imagen». Este archivo es el respaldo del código: lo que se ve mientras la
 * página no tenga el cierre cargado en Sanity. Los scripts de Sanity
 * (ajustar-2026-10-08.mts) usan el MISMO archivo de imagen que Marketing, así
 * que no se sube dos veces.
 */
export const IMAGEN_CIERRE_SOCIOS: ImagenSanity = {
  url: "/cierre/socios.webp",
  ancho: 2077,
  alto: 757,
  hotspot: null,
  alt: "",
};
