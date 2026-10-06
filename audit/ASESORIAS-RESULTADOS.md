# DOFI — Página Asesorías 1 a 1 · Rescatando Emprendedores — Resultados

Pedido del 2026-10-05. Esta entrega es la página de Asesorías completa. Los banners animados
del Home (Remotion) siguen en curso y NO forman parte de este commit.

## Qué tiene la página (`/asesorias`)

Mismo sistema que Marketing Digital, Tráfico y FENIAX: documento `asesoriasPage` en Sanity con
`sections[]` ordenable; la primera sección lleva el `<h1>`.

| Sección | Componente | Notas |
|---|---|---|
| Portada | `AsesoriasPortada` (tipo nuevo `splitHeroBanner`) | Título "Asesorías 1 a 1", el logo de Rescatando Emprendedores, la frase reescrita, botón "Quiero mejorar mis ventas" (→ formulario con Asesorías marcado) y la foto grupal a la derecha, apoyada en el borde inferior. Fondo morado con brillos, como el banner del Home. |
| ¿Qué es Rescatando Emprendedores? | `PiezaGrafica` (el de Marketing Digital) | Texto reescrito: experiencia de Dani con +500 empresas, reunión 1 a 1, qué vendes y cómo, oportunidades, ruta estratégica, "no es una charla motivacional ni psicológica". |
| Clientes y casos de éxito | `AsesoriasClientes` (tipo nuevo `casesClientsBanner`) | Ver abajo. |
| Reseñas | `ResenasGoogle` | El mismo de siempre. |
| Cierre | `BannerFoto` | "¿Le damos a tu negocio otra oportunidad?" + botón al formulario. No estaba en el brief; va porque todas las páginas cierran así. Se apaga desde el Studio. |

## Clientes y casos de éxito: caso ↔ giro (la opción elegida)

- Izquierda: el carrusel de giros de siempre (mismos paneles, logos e interacciones; giros de
  Marketing Digital, sin cargarlos dos veces).
- Derecha: el mazo de tarjetas del video de referencia. Botón "Ver otro caso", contador 01/03,
  la tarjeta del frente se arrastra y sale volando con giro; detrás asoman otras dos. Tres pieles
  que se alternan (papel cuadriculado, morado DOFI, crema).
- Texto → imagen: al pasar de caso, el carrusel abre el giro del caso y su panel muestra la
  imagen del caso con un barrido desde el lado del mazo. Elegir un giro lleva el mazo a su primer caso.
- Paso automático opcional (Studio): se pausa con el cursor encima, se detiene si el visitante
  toca algo y después de dos vueltas, y no corre con movimiento reducido.
- En teléfono el mazo va debajo del panel cuya imagen cambia.

### Editable desde Sanity

Cada caso: título, texto, giro (selector con los giros reales, sin escribir nombres a mano),
imagen y cliente/firma. El orden es el de la lista: se arrastra, igual que todo el Studio. Se
crean, editan y borran desde la sección.

### Casos de prueba

Los 3 textos del brief, con recortes de la foto grupal como imagen, firmados "Ejemplo —
reemplázalo". Están en el respaldo del código (`src/lib/asesorias-respaldo.ts`).

## Verificación

- `tsc` (sitio y Studio) y build de producción: 0 errores.
- Puppeteer sobre el build de producción, escritorio 1440 y móvil 390: 5 secciones, sin
  desborde horizontal, sin errores de consola. Sincronía comprobada: caso 1 → Gastronomía,
  caso 2 → Construcción, caso 3 → Retail, cada uno con su imagen.
- El vuelo de la tarjeta y el barrido corren con la Web Animations API (compositor), así no se
  traban mientras el carrusel carga los logos del giro nuevo. Medido: la animación se crea y
  completa; el cuadro intermedio no se pudo capturar en Chrome sin GPU.

## Pendiente

1. **Contenido en Sanity**: el documento `asesoriasPage` todavía es el esqueleto vacío de antes
   (5 secciones apagadas), así que la web muestra el respaldo del código. Falta el script que
   sube logo, foto y casos y carga las secciones, y redesplegar el Studio con los tipos nuevos
   (`splitHeroBanner`, `casesClientsBanner`, selector de giro). Se hacen juntos para que el
   Studio no muestre secciones de un tipo que ya no existe.
2. **Banners del Home con Remotion**: en curso (las tres composiciones existen, falta conectarlas).
