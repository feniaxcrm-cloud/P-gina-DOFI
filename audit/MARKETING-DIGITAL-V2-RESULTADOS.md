# DOFI — Marketing Digital v2 (Prompt Maestro) — Resultados

`/marketing-digital` pasa a ser **una lista de secciones** (`sections[]`) editable desde Sanity:
cada sección es de un tipo (Equipo, ¿Qué es DOFI?, Cómo navegamos, Método, Clientes, Reseñas,
Cierre), se agrega eligiendo el tipo, se reordena arrastrando y se oculta sin borrarla. Navbar,
Footer, Home y las demás páginas no se tocaron.

## Lo que no llegó

- **La imagen de referencia del Banner 3 nunca llegó.** La composición editorial de
  "¿Cómo navegamos contigo?" es mi interpretación (respondiste "Avanza con tu interpretación").
- **Sin fotos todavía** para Equipo (Daniel con el equipo) ni para el Cierre (Daniel dando la
  mano): los dos banners usan el fondo de marca hasta que se suban en el Studio.
- **0 de 26 cuentas tienen logo**, y la carpeta "Logos empresas" no existe en el equipo. La
  marquesina muestra el nombre real de cada cliente — nunca logos inventados.
- **0 reseñas cargadas.** La sección invita a leerlas en el perfil real de Google.
- **Clientes se rediseñó después** con carrusel de giros y video (ver
  `CLIENTES-GIROS-RESULTADOS.md`). Todavía no hay empresas asignadas a los giros ni video
  cargado.

## Sección por sección

**1 · Equipo (teamBanner).** Título nuevo, "¿Necesitas un equipo de marketing completo?", mucho
más chico: 54px en escritorio (antes llegaba a 72px) en 2 líneas naturales; 30px y 3 líneas en
un teléfono de 390px. Descripción nueva, chip "📍 Cuenca - Ecuador", slogan "Un Mar de Ideas" en
naranja y CTA naranja. Entrada escalonada y rápida: ubicación → título → descripción → slogan →
botón (80ms entre cada uno, 600ms), sin movimiento permanente.

**2 · ¿Qué es DOFI? (aboutBanner).** La composición aprobada, ahora 50/50 (6 + 6 columnas):
título grande a la izquierda con la línea morado → naranja, texto a la derecha, "Navegar en un
Mar de Oportunidades." en morado, ondas abajo. En móvil se agregó aire abajo: las ondas rozaban
la frase final.

**3 · ¿Cómo navegamos contigo? (navigationBanner).** Rehecha como composición editorial, sin
tarjetas ni grilla:
- **Fondo morado profundo.** La página alterna oscuro / claro / oscuro / claro y los colores
  DOFI marcan el ritmo.
- **Título protagonista**, con la última palabra ("contigo?") en degradado naranja.
- **Separador con un velero** y los dos párrafos en dos columnas angostas, como en una revista.
- **Una brújula en SVG** con su órbita punteada naranja, que se dibuja al entrar, y una aguja
  que gira una sola vez y se asienta al noreste.
- **Ondas DOFI** abajo.

En móvil se reorganiza: título → párrafos → brújula.

**4 · Método DOFI (methodBanner).** Un **recorrido**, no una grilla. En escritorio (1280px+) las
paradas van en zigzag sobre una línea curva punteada, morada y sutil. Cada paso lleva su ícono:

| Paso | Ícono |
|---|---|
| 01 | brújula (exploración) |
| 02 | mapa (ruta) |
| 03 | cohete (lanzamiento) |
| 04 | velero (navegación) |
| 05 | gráfico al alza (retorno) |

**"Ventas Inteligentes Garantizadas"** es el destino del recorrido, no un sexto servicio:
- no lleva número;
- su nodo es más grande, en degradado morado → naranja, con resplandor y un ícono de ventas;
- el texto va en el mismo degradado.

Debajo de 1280px el recorrido pasa a vertical (01 ↓ … ↓ destino), centrado, con tramos punteados
que crecen al aparecer cada parada. El CTA queda debajo en todos los anchos.

**Orden de entrada:** título → línea → pasos → destino. La línea se dibuja a velocidad constante
y cada parada aparece justo cuando la línea llega a su centro (medido; ver bugs).

**5 · Clientes y casos de éxito (clientsBanner).** Rediseñada después de esta entrega:
- **Título:** en una línea.
- **Carrusel de giros:** reproduce el video de referencia, con los logos de cada giro.
- **Video:** a la derecha, administrable desde Sanity.
- **Sin cambios:** debajo siguen la marquesina de clientes y el botón.

Detalle y verificación en `CLIENTES-GIROS-RESULTADOS.md`. El panel de "caso destacado" que
se describía acá ya no existe.

**6 · Reseñas de Google (reviewsBanner).**
- **Con reseñas:** carrusel de tarjetas.
- **Sin reseñas:** una invitación con el botón "Ver reseñas en Google", la ficha real de Maps.

**7 · Cierre (ctaBanner).** "¿Somos socios o le pasas tu oportunidad a alguien más?" con el
**botón en tamaño grande**: 76px de alto en escritorio (el normal mide 64px) y 60px en móvil. La
foto de Daniel se sube en el Studio.

## Sanity: la página es una lista de secciones

- **Menú Marketing Digital → "Secciones".** "Agregar elemento" pide el tipo; el orden de la
  lista es el orden de la página. No hay campo numérico de orden: dos fuentes de orden terminan
  contradiciéndose.
- **Campos comunes a las 7:** mostrar en la página (activo/inactivo), imagen, imagen móvil,
  subtítulo, título, descripción, texto destacado, botón (texto + URL) y animaciones. Cada tipo
  explica qué significa su "texto destacado" (en Método es el destino del recorrido).
- **Campos propios por tipo:**
  - Equipo y Cierre: posición del contenido y overlay.
  - Método: los pasos y "Mostrar el recorrido".
  - Clientes: giros de negocio con sus empresas, rotación automática y video (ver
    `CLIENTES-GIROS-RESULTADOS.md`).
  - Reseñas: enlace al perfil de Google.
- **Reseñas no tiene campos de imagen**, a propósito: la sección no usa ninguna.
- **Modelo `client` → se usa Cuenta** (tu decisión). Cuenta ya tenía lo necesario: nombre,
  logo, categoría, activa y orden. Sus logos alimentan la marquesina y los giros. El campo
  "Video del caso" que se había agregado se quitó al rediseñar Clientes: el video ahora vive en
  la sección.
- **Respaldo en código:** si Sanity no responde o la lista está vacía, la página se arma con el
  copy del brief.

## Bugs que encontró la verificación

1. **Error de hidratación en la brújula.** `Math.cos`/`Math.sin` no dan el mismo último
   decimal en Node y en Chrome (`71.30453355601168` contra `71.3045335560117`), y React lo
   marcaba en cada carga. Las coordenadas ahora se redondean a 2 decimales.
2. **Los trazos nunca se dibujaban.** Quedaban en `inset(0% 100% 0% 0%)` después de recorrer
   toda la página. Chrome mide la visibilidad de un elemento con su propio `clip-path` aplicado:
   recortado al 100%, su área visible es cero y nunca llega al umbral. Ahora el contenedor (sin
   recorte) detecta la entrada y el hijo es el que se recorta.
3. **El orden del Método no era el del brief.** La línea tenía aceleración (1.55s) y las
   paradas iban por su lado (0.35–1.0s): 01–03 se encendían antes de que la línea arrancara.
   Ahora hay un solo disparador y el escalonado sale de la misma duración. Medido cada 100ms:
   la parada 4 (centro en 58%) empieza a verse con la línea en 57%, la 5 (75%) con la línea en
   77% y el destino (92%) con la línea en 91%.
4. **El H1 ocupaba 4 líneas en móvil** (34px). Bajó a 30px: 3 líneas.
5. **El recorrido vertical quedaba pegado a la izquierda en tablet**, bajo un título y un botón
   centrados. Ahora es un bloque centrado de 560px como máximo.
6. **Clientes con caso quedaba desbalanceado**: dos filas de marquesina (~250px) junto a un
   panel de ~660px. Pasó a dos columnas, con todo el relato a la izquierda. (Ese panel se
   reemplazó después por el carrusel de giros y el video.)
7. **Keys duplicadas.** Dos resultados o dos rubros iguales cargados en el Studio llenaban la
   consola de errores. Las listas usan el índice.
8. **Las ondas rozaban el texto** de "¿Qué es DOFI?" en móvil. Se agregó padding inferior.

## Verificación final (servidor temporal, datos reales de Sanity)

| | 1440 | 1280 | 1024 | 768 | 390 |
|---|---|---|---|---|---|
| H1 | 54px · 2 líneas | 50px · 2 | 44px · 2 | 38px · 2 | 30px · 3 |
| Desborde horizontal | 0 | 0 | 0 | 0 | 0 |
| Elementos más anchos que la pantalla | 0 | 0 | 0 | 0 | 0 |
| Método | ruta horizontal | ruta horizontal | vertical, 5 tramos | vertical, 5 tramos | vertical, 5 tramos |
| Trazos dibujados | 2 de 2 | 2 de 2 | 1 de 1 | 1 de 1 | 1 de 1 |
| Aguja | 38° | 38° | 38° | 38° | 38° |
| Botón del Cierre | 417×76 | 417×76 | 417×76 | 417×76 | 338×60 |
| Reveals sin disparar | 0 | 0 | 0 | 0 | 0 |
| Errores de consola / hidratación | 0 | 0 | 0 | 0 | 0 |

- **Un solo `<h1>`**, siempre la primera sección aunque se reordenen en el Studio; el resto usa
  `<h2>`.
- **Movimiento reducido:** los 33 elementos animados se ven completos, los trazos aparecen
  dibujados, la aguja queda quieta y la marquesina se detiene.
- **Home sin cambios:** los 4 botones de los banners miden 358×64 a 18px, igual que antes, y no
  hay errores. El tamaño "normal" de `BotonCta` usa exactamente las mismas clases.
- **Chequeos estáticos:** `tsc` (web y Studio) y `sanity schema validate` dan 0 errores y 0
  advertencias.
- **Consulta GROQ:** probada directo contra la API, no solo a través de la página. Devuelve
  7 secciones y los campos de cada tipo no se cruzan con los de otro. Si fallara, la página
  caería en silencio al respaldo con el mismo copy.

**No verificado en este sprint:**
- **Fotos de fondo** de Equipo y Cierre: no hay imágenes cargadas. El componente es el de v1,
  que se verificó con fotos.
- **Video del caso destacado:** no hay ningún video cargado.

## Clientes con datos

El panel de caso destacado de esta entrega ya no existe: la sección se rediseñó con el
carrusel de giros y el video. Cómo se probó con datos (una página local de prueba que se borró)
está en `CLIENTES-GIROS-RESULTADOS.md`.

## Estado de Sanity y pasos de despliegue

- **Copia escrita** en `marketingDigitalPage.sections` (rev `CPJDhWkzF3BZuMunx8Vw0y`). **Los
  campos viejos siguen intactos** y la web en vivo los sigue leyendo, así que hoy no cambió
  nada en producción.
- **Respaldo** de los campos viejos en `audit/backup-marketing-antes-de-secciones.json`.
- **Aviso:** hasta desplegar el Studio nuevo, si alguien abre Marketing Digital en el Studio
  actual verá "campo desconocido: sections". **No hay que tocar "Quitar".** Aun así sería
  recuperable: `--aplicar` lo vuelve a crear desde los campos viejos.

Con tu aprobación, en este orden (la limpieza va después de verificar en vivo, por la lección
de la migración de banners):
1. Push → Cloudflare despliega.
2. Verificar en vivo con una sonda: el H1 "¿Necesitas un equipo de marketing completo?" solo
   existe en `sections`.
3. `node --env-file=.env.local scripts/migrar-marketing-a-secciones.mjs --limpiar` (quita los
   campos viejos; se niega si `sections` está vacío).
4. Desplegar el Studio.

## Pendiente de contenido (desde el Studio, sin tocar código)

- Foto de **Equipo** y foto del **Cierre** (Daniel dando la mano), con su punto focal.
- **Logos** en cada Cuenta.
- En Clientes: asignar las **empresas de cada giro** y subir el **video** de la sección.
- **Reseñas reales** de Google en el menú Reseñas.

## Archivos

**Web**
- `src/lib/marketing-digital.ts` — modelo `sections[]`, consulta y respaldo.
- `src/app/marketing-digital/page.tsx` — renderiza por tipo, h1/h2 y anclas.
- `src/components/marketing/BannerFoto.tsx` — Equipo y Cierre.
- `src/components/marketing/PiezaGrafica.tsx` — ¿Qué es DOFI? y modo pieza.
- `src/components/marketing/NavegacionEditorial.tsx` — nuevo.
- `src/components/marketing/Brujula.tsx` — nuevo.
- `src/components/marketing/Trazo.tsx` — nuevo.
- `src/components/marketing/RutaMetodo.tsx` — nuevo.
- `src/components/marketing/MetodoDofi.tsx`
- `src/components/marketing/ClientesCasos.tsx` — ver `CLIENTES-GIROS-RESULTADOS.md`.
- `src/components/marketing/CarruselGiros.tsx` y `VideoClientes.tsx` — nuevos (Clientes).
- `src/components/marketing/ResenasGoogle.tsx`
- `src/components/BotonCta.tsx` — tamaño "grande".
- `src/app/globals.css` — movimiento reducido para trazos y aguja.

**Studio**
- `studio/schemaTypes/marketing/` — `camposBase` + los 7 tipos, nuevo.
- `studio/schemaTypes/marketingDigitalPage.ts`
- `studio/schemaTypes/index.ts`
- `studio/deskStructure.ts`
- Eliminados: `studio/schemaTypes/objects/mdBannerFoto.ts` y `mdPiezaGrafica.ts`.

**Scripts**
- `scripts/migrar-marketing-a-secciones.mjs` — nuevo.
- `scripts/sembrar-marketing-digital.mjs` — reescrito a secciones.

**Evidencia**
- `audit/marketing-digital-v2/` — capturas.
- `audit/backup-marketing-antes-de-secciones.json`
