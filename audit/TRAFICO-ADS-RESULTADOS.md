# Tráfico / Ads — Resultados

Armé la página `/trafico-ads` con la **misma estructura de Marketing Digital** (secciones
ordenables y editables en Sanity, mismos campos, mismos componentes donde aplica), usando como
referencia el documento «SECCION DE TRAFICO». Sumé tres secciones propias y dos piezas
interactivas: un **panel de Meta Ads con KPIs por giro de negocio** (Remotion) en lugar del
video de Clientes, y un **video del ecosistema** (HyperFrames).

**Texto corto, enfocado en vender** (pedido del 2026-10-01): cada sección lleva un titular, una
frase y, a lo sumo, una línea de cierre. Las ideas y frases clave son las del documento
("tráfico con propósito", "medir, analizar, optimizar", "construimos ecosistemas", "zarpemos
juntos"); no se agregó ninguna cifra ni promesa que el documento no haga.

## Qué se ve

| # | Sección (tipo en el Studio) | Qué tiene |
|---|---|---|
| 1 | Portada (`teamBanner`) | «Muchos likes, muchas vistas… pero ¿y las ventas?» con tres tarjetas animadas: me gusta ▲, visualizaciones ▲ y **ventas «sin conexión» (¿?)**. Una frase y «Tráfico con propósito.» CTA «Quiero impulsar mi marca». |
| 2 | Nuestro sistema (`aboutBanner`) | «Tráfico inteligente. Estrategias que se adaptan.» + una frase + «Cada campaña tiene un rumbo.» |
| 3 | El mapa (`navigationBanner`) | «Construimos el mapa antes de zarpar.» con la brújula de DOFI. |
| 4 | Método (`methodBanner`) | «Para nosotros, todo son datos.» y la ruta de **7 frentes** (Objetivo, Audiencia, Oferta, Canal, Creatividad, Conversión, Datos) que termina en **«Medir. Analizar. Optimizar.»** |
| 5 | ¿Dónde traficamos? (`platformsBanner`, **nuevo**) | 4 tarjetas: Meta Ads, TikTok Ads, Google Ads y Tráfico web, con su ícono, su frase y una línea de qué se hace en cada una. |
| 6 | Ecosistema (`ecosystemBanner`, **nuevo**) | «No hacemos campañas aisladas. Construimos ecosistemas.» y, a la derecha, un **video de 10 s** (HyperFrames): el velero de DOFI recorre Instagram → Google → tu web → WhatsApp. |
| 7 | Clientes + métricas (`metricsClientsBanner`, **nuevo**) | El mismo carrusel de giros y logos de Marketing Digital; donde allá va el video, acá va un **panel de Meta Ads de una campaña de ejemplo** que cambia con el giro abierto. |
| 8 | Reseñas (`reviewsBanner`) | Las reseñas reales de Google. |
| 9 | Cierre (`ctaBanner`) | «¿Listos para poner tu inversión en movimiento?» · «Zarpemos juntos.» |

Sin el botón «Ver casos de éxito» en Clientes (quitado de todas las páginas).

## El panel de Meta Ads (Clientes)

Elegir un giro (Gastronomía, Construcción, Fitness/salud/belleza, Retail, Turismo, Educación…)
abre **la campaña de ejemplo de ese tipo de negocio**, dibujada en vivo con Remotion:

- **KPIs de Meta**: CPR, CTR, CPA, alcance, visualizaciones y frecuencia, con cada cifra
  evolucionando durante **30 días**; las tarjetas muestran la variación frente a la semana 1.
- **Gráficos**: barras de inversión por día, línea del CPR bajando y **tres marcas de
  optimización** (nueva creatividad, audiencia ajustada, presupuesto escalado): el «medir,
  analizar, optimizar» del método hecho visible. Totales al pie (inversión, resultados,
  adquisiciones del giro: reservas, visitas de obra, citas…).
- **Interactivo**: play/pausa y una barra de días que se puede arrastrar (o mover con flechas)
  para ver cualquier día de la campaña. Al terminar los 30 días pasa solo al giro siguiente; si
  el visitante elige un giro, se queda en ese.
- **12 plantillas** de campaña por tipo de negocio (restaurante, constructora, estética,
  gimnasio, consultorio, tienda, academia, turismo, autos, inmobiliaria, tecnología, servicios).
  Cada giro toma la suya por su **nombre o ícono**; un giro nuevo creado en el Studio nunca
  queda sin panel.

### Las cifras son de ejemplo, y la página lo dice

El panel lleva una etiqueta **«Ejemplo»** y, debajo, la nota «Cifras de ejemplo con fines
ilustrativos: no corresponden a un cliente real». Son cifras plausibles para la región
(CPM de 2 a 5 dólares, costo por conversación de 0,70 a 1,90…), coherentes entre sí
(resultados = inversión ÷ CPR, la frecuencia es visualizaciones ÷ alcance, alcance ≤
visualizaciones) y reproducibles: **solo se cargan seis números por giro** y la serie día a día
se calcula de forma determinista de modo que el día 30 coincida exacto con lo cargado
(`scripts/probar-series-trafico.mts` lo comprueba para las 12 plantillas). Si el equipo carga
resultados **reales** de una campaña, cambia la nota («Resultados reales de X, julio 2026»):
por eso la nota es un campo editable.

## CMS (Sanity)

- **Tráfico / Ads** acepta ahora 9 tipos de sección (sumé «Plataformas», «Ecosistema» y
  «Clientes + métricas de Meta Ads»).
- **Más fotos y logos de clientes** (pedido): dentro de cada giro → «Empresas y logos» (una
  Cuenta existente o una empresa con logo propio) y «Foto del giro». Sin giros propios, la
  sección usa los de Marketing Digital (las mismas empresas, sin cargarlas dos veces).
- **Métricas de cada giro** (opcional): campaña, objetivo, resultado, adquisición, inversión,
  CPR, CTR, CPA, alcance, visualizaciones, hasta 4 optimizaciones marcadas en el gráfico y la
  nota. Vacías: se usa la plantilla del giro. Una cifra inválida (cero, alcance mayor que las
  visualizaciones) no rompe el panel: se completa con la plantilla.
- **Plataformas**: se agregan, quitan y reordenan; cada una elige su ícono (Meta, TikTok,
  Google, YouTube, Instagram, Facebook, WhatsApp, LinkedIn o el globo web).
- **Ecosistema**: subir una imagen reemplaza la animación.
- **Respaldo**: mientras el documento no tenga ninguna sección activa, la web muestra el
  contenido de `src/lib/trafico-respaldo.ts`. Con una sola sección activa manda el Studio.
  `scripts/sembrar-trafico.mts` carga esos mismos textos y los giros con sus métricas en el
  Studio (simulación por defecto, copia de seguridad antes de escribir).

## Rendimiento y accesibilidad

- Remotion se descarga **diferido** (solo cuando el panel se acerca a la pantalla); el video
  del ecosistema solo se reproduce a la vista y tiene botón de pausa.
- Con movimiento reducido, el panel muestra el cuadro final (día 30) y el video queda en su
  póster. La campaña también va como texto para lectores de pantalla.
- Legibilidad: el panel se diseñó a 560 px de ancho con tipografía mínima de ~17 px, así que
  se lee en teléfono sin zoom.

## Código nuevo

- `src/lib/`: `giro-tipo.ts` (resolutor de tipo de negocio, compartido con las demos de
  WhatsApp de FENIAX), `giros.ts`, `metricas-demo.ts`, `trafico.ts`, `trafico-respaldo.ts`.
- `src/remotion/trafico/`: la composición del panel (`PanelMeta.tsx`) y su serie de datos.
- `src/components/trafico/`: la página y sus secciones. `marketing/VideoBucle.tsx` y
  `marketing/FotoFondo.tsx` se compartieron entre FENIAX y Tráfico.
- `studio/schemaTypes/`: `platformsBanner`, `ecosystemBanner`, `metricsClientsBanner` y el
  objeto `metricasDemo`.
- `video/ecosistema-trafico/`: fuente del video del ecosistema (ver su README).

## Pendiente de decisión

- **Licencia de Remotion**: es gratis solo para empresas de hasta 3 personas. Si no aplica, la
  alternativa es rehacer el panel con Motion (ya está en el proyecto) sin cambiar nada de lo
  que ve el visitante ni de lo que se edita en el Studio.

## Publicado (2026-10-01)

- Código en `main` (commit 0896e9b); Cloudflare desplegó en ~3 min y se verificó en
  <https://pagina-dofi.feniax-crm.workers.dev/trafico-ads>: las 9 secciones, el panel de Meta
  Ads cambiando con el giro, el video del ecosistema y sin errores de consola ni de red.
- **Studio redesplegado** (<https://dofi-cms.sanity.studio/>) con los tipos nuevos.
- **Contenido cargado en Sanity** con `scripts/sembrar-trafico.mts` (sesión de la CLI de
  Sanity): las 9 secciones y los 6 giros de Marketing Digital con sus empresas y su campaña de
  ejemplo. Copia del documento anterior en `audit/backup-traficoAdsPage-2026-10-02.json`.
- Build de producción: `/trafico-ads` 216 kB de carga inicial (Marketing Digital 210 kB).
  `opennextjs-cloudflare build` sigue sin funcionar en Windows (conocido); se verificó con
  `npm run build:next` y el deploy lo hace Cloudflare.
