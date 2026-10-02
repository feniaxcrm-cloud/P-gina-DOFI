/**
 * Tema UNICO del panel de Meta Ads de Tráfico/Ads (Remotion). Ningun color,
 * medida ni tiempo se escribe suelto en la composicion: todo sale de aca.
 *
 * Los colores salen de los tokens del sitio (var(--color-*): se resuelven
 * porque el <Player> pinta en el DOM de la pagina, no en un iframe), asi el
 * panel cambia solo si cambia la marca. Solo lo que no existe como token (el
 * verde de "mejora", los velos translucidos) vive aca como valor.
 *
 * DATOS PUROS, SIN IMPORTAR REMOTION: lo usa tambien la envoltura de la
 * pagina (que va en la carga inicial). Las curvas y resortes, que si
 * necesitan Remotion, estan en curvas.ts y solo las importa la composicion.
 */

export const FPS = 30;

/** Lienzo del panel. Vertical, pensado para verse entre 340 y 440 px de
 *  ancho: el texto mas chico mide 17 px de diseño, o sea 10 a 13 px reales.
 *  El alto se midio con la composicion completa (ver GEO en PanelMeta.tsx). */
export const PANEL = { ancho: 560, alto: 840 } as const;

/** Duracion de cada fase, en CUADROS (a 30 fps). El recorrido son los 30
 *  dias de la campaña; despues el panel se queda en el dia 30 para que se
 *  lean las cifras finales. */
export const TIEMPOS = { intro: 18, recorrido: 255, final: 75, salida: 12 } as const;
export const TOTAL_CUADROS = TIEMPOS.intro + TIEMPOS.recorrido + TIEMPOS.final + TIEMPOS.salida;
/** Cuadro en que ya se ve todo el dia 30: el que se muestra quieto con
 *  movimiento reducido. */
export const CUADRO_FINAL = TIEMPOS.intro + TIEMPOS.recorrido + 10;

export const color = {
  texto: "var(--color-foam)",
  tenue: "var(--color-mist)",
  apagado: "var(--color-mist-dim)",
  acento: "var(--color-accent)",
  acentoSuave: "var(--color-accent-lift)",
  marca: "var(--color-brand-lift)",
  // Semantico: una metrica que mejora (token --color-positive de globals.css).
  mejora: "var(--color-positive)",
  mejoraVelo: "color-mix(in srgb, var(--color-positive) 14%, transparent)",
  // Superficies translucidas sobre el fondo oscuro del panel.
  velo: "rgba(255, 255, 255, 0.06)",
  veloFuerte: "rgba(255, 255, 255, 0.10)",
  borde: "rgba(255, 255, 255, 0.10)",
  rejilla: "rgba(255, 255, 255, 0.07)",
  fondo:
    "radial-gradient(70% 45% at 100% 0%, rgba(244, 123, 32, 0.20) 0%, transparent 70%), radial-gradient(60% 40% at 0% 100%, rgba(109, 75, 201, 0.32) 0%, transparent 70%), linear-gradient(165deg, #241553 0%, #1A0F3D 46%, #120A26 100%)",
} as const;

export const fuente = {
  display: "var(--font-sora), ui-sans-serif, system-ui, sans-serif",
  texto: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
} as const;

/** El logo de Meta (simple-icons v16, "Meta", viewBox 24x24, dominio
 *  publico). Se copia aca en vez de importar el paquete para no llevar todos
 *  los iconos al navegador. Uso nominativo: indica de que plataforma es el
 *  panel de ejemplo. */
export const LOGO_META =
  "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z";
