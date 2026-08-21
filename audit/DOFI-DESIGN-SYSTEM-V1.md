# DOFI DESIGN SYSTEM V1
### Especificación visual, espacial, tipográfica, responsive y de motion

| | |
|---|---|
| **Versión** | V1 — especificación, sin implementar |
| **Fecha** | 20 de agosto de 2026 |
| **Base** | commit `762945f` + cambios sin commitear del Sprint 0.1 (preservados, no revertidos) |
| **Estado del código** | **No se modificó ningún componente, ni `globals.css`, ni Tailwind** |
| **Fuentes** | [`AUDITORIA-DOFI-V1.md`](AUDITORIA-DOFI-V1.md) · [`SPRINT-0.1-RESULTADOS.md`](SPRINT-0.1-RESULTADOS.md) |

---

## 1. Resumen

Este documento define las reglas que usarán Navbar, Hero, Ventas Inteligentes, Servicios, Casos, FENIAX, El Socio, equipo, testimonios, formularios, CTA, footer y páginas internas. Su propósito es que **ninguna decisión de espacio, tamaño o color vuelva a tomarse componente por componente.**

### Las tres mediciones que gobiernan el sistema

Antes de proponer nada se midieron las fuentes reales del proyecto y la paleta real en el navegador. Tres resultados cambiaron decisiones que, sin medir, se habrían tomado mal:

**1. La unidad `ch` sobreestima el ancho real un 39 % en Geist.** `[medido]`
El glifo `0` de Geist 400 mide `0.663em`, pero el ancho medio de prosa castellana real es `0.476em`. Ratio **0.718**. Definir `default: 60ch` creyendo que son 60 caracteres por línea entrega en realidad **~84**, muy por encima del rango legible. **Todas las medidas de este sistema se definen en píxeles calculados sobre el ancho medio real, no en `ch`.**

**2. Ninguna de las superficies actuales se distingue de las demás.** `[medido]`

| Par | Contraste |
|---|---|
| `abyss` #120A26 vs `deep` #1A0F3D | **1,08:1** |
| `abyss` vs `surface` #241553 | **1,19:1** |
| `deep` vs `surface` | **1,11:1** |

Un cambio de superficie empieza a percibirse alrededor de 1,25:1. Y el techo es estrecho: al subir la luminancia lo suficiente para que se note, `mist-dim` y el acento naranja caen por debajo de AA. **El máximo utilizable manteniendo AA en todos los textos es #271A5C (1,27:1 sobre la base).**

> **Consecuencia de diseño:** en esta paleta, la superficie **no puede ser el mecanismo principal de ritmo**. El ritmo lo llevan el espacio, la densidad y el ancho de contenido. La superficie es un apoyo secundario, y para un cambio de zona realmente inequívoco hay que invertir a claro.

**3. Un rojo de error es indistinguible del naranja de CTA.** `[medido]`
Los tres rojos candidatos dan **1,01–1,02:1 contra `#F47B20`**. En esta paleta el color no puede ser el único portador del significado "error". **Los estados se comunican con icono + borde + posición, y el color solo acompaña.** Esto coincide con el criterio de accesibilidad de no depender del color, pero aquí es además una necesidad física.

### Qué cambia respecto al sistema actual

| | Actual | V1 |
|---|---|---|
| Anchos de contenido | 1400px para todo, 20px de margen óptico a 1440 | 1320px máx · margen real 60px a 1440 |
| Medidas de texto | 6 valores (34/36/40/42rem, 48ch, 22ch) | 3 tokens calculados sobre caracteres reales |
| Tamaños de H2 | 3 (72 / 60 / 48) | 1 + una variante *statement* controlada |
| Interlineados | 11 valores distintos | 4 |
| Separación título→párrafo | `mt-6` fijo (24px), no escala | Proporcional: 0,6× del titular |
| Espacio entre secciones | 192+192 = **384px** de vacío idéntico | 4 arquetipos asimétricos, tope de 200px al unir |
| Tamaño del H1 | 144px | 80px (fluido) — ver §14, es una decisión de negocio |
| Superficies | 3 indistinguibles | 3 oscuras + 1 clara de excepción + reglas de cuándo cambiar |
| Estados de formulario | naranja de acento (igual que el CTA) | Sistema de estado con icono + borde |

---

## 2. Principios

Seis. Cada uno resuelve un hallazgo concreto de la auditoría, y cada uno se puede usar para rechazar una propuesta.

### 01 · Primero se entiende, después se admira
El usuario debe saber qué vendemos antes de que nada le impresione. Ningún efecto puede retrasar, tapar o sustituir el mensaje.
> *Resuelve: 4 pantallas sin propuesta de valor · el H1 metafórico · el texto crítico naciendo invisible.*

### 02 · El espacio separa o no está
Todo vacío debe crear jerarquía, agrupar o marcar un cambio de zona. Un vacío que solo alarga la página es un error, no respiración.
> *Resuelve: 384px de vacío entre secciones del mismo color · media sección de Proceso desaprovechada · 64 % del hero sin usar.*

### 03 · Cada sección tiene su propia densidad
No todas las secciones respiran igual. Una declaración es amplia; una tabla de casos es densa. Si todo tiene el mismo ritmo, la página no tiene ninguno.
> *Resuelve: las 10 secciones actuales miden entre 1 150 y 1 750px con el mismo padding.*

### 04 · La prueba manda sobre la herramienta
Enseñamos qué conseguimos antes que con qué software. Una pieza real desplaza siempre a un icono, un logo de terceros o un degradado.
> *Resuelve: Herramientas es la sección más alta en móvil · 26 clientes con la misma imagen vacía · cero vídeo en una productora audiovisual.*

### 05 · Móvil se compone, no se encoge
La composición vertical puede tener otro orden, otra densidad y otros elementos. Reducir una maqueta de escritorio no es diseñar para móvil.
> *Resuelve: 26 puntos de carrusel en tres filas · una tarjeta ocupando el 98 % de la pantalla · sin CTA en la barra.*

### 06 · El movimiento explica o no ocurre
Toda animación debe guiar la lectura, demostrar un mecanismo o elevar la percepción de calidad. Si no hace ninguna de las tres, se elimina. Y ninguna puede pagarse con la métrica de carga.
> *Resuelve: LCP determinada por un `delay` decorativo · marquesina ilegible · canvas de 26 curvas casi invisible.*

---

## 3. Personalidad visual

Reglas aplicables, no adjetivos.

### PREMIUM
Lo premium aquí no es añadir: es **quitar y precisar**.

| Regla | |
|---|---|
| **Sin sombras** | Se conserva la decisión actual. En fondo oscuro las sombras ensucian. Profundidad = borde + superficie + escala. |
| **Un solo acento** | El naranja aparece pocas veces y siempre significa lo mismo: *aquí se actúa*. Si el naranja está en todas partes, deja de señalar. |
| **Tipografía grande solo si el contenido lo sostiene** | Un titular enorme con tres palabras vacías es lo contrario de premium. |
| **Alineación estricta** | Todo cae en la retícula. Un elemento desplazado 6px sin razón se lee como descuido, aunque nadie sepa nombrarlo. |
| **Asimetría deliberada** | Composiciones 7/5 y 8/4 con una columna vacía intencional, en lugar de centrar todo. |
| **Material real** | Es lo que más pesa. Ningún sistema salva 26 imágenes de relleno. |

### TECNOLÓGICO
Sin convertirse en un SaaS genérico.

| Sí | No |
|---|---|
| Interfaces reales (embudo de Kommo, panel de campaña, conversación del bot) | Ilustraciones isométricas de "la nube" |
| Datos y estados concretos | Iconos de engranaje y check en fila |
| Retículas visibles, líneas finas, tabulares numéricos | Gradientes azul-violeta de dashboard |
| Diagramas que muestran un mecanismo | Mockups de móvil flotando en 3D |
| Movimiento que demuestra un flujo | Partículas y "redes neuronales" decorativas |

**Regla:** lo tecnológico se demuestra enseñando el sistema funcionando, no ilustrando la idea de sistema.

### CREATIVO
Conservar el ADN de *"Un mar de ideas"* sin que la web parezca marina ni infantil.

| Regla | |
|---|---|
| **El mar es ritmo, no decorado** | Sobrevive como cadencia del movimiento (la curva `(0.16, 1, 0.3, 1)` ya lo hace: entra rápido y se asienta, como una ola) y como vocabulario del copy. |
| **Cero iconografía literal** | Nada de olas, burbujas, anclas, peces ni gradientes turquesa. |
| **El delfín es firma, no ilustración** | Se usa como marca en navegación, pie y favicon. Deja de ser un elemento decorativo de 430px que no comunica nada. |
| **La creatividad se prueba con obra** | El portafolio demuestra creatividad mejor que cualquier recurso gráfico. |

### COMERCIAL
Que se note que DOFI busca ventas, sin gritar.

| Regla | |
|---|---|
| **Cifra antes que adjetivo** | Un dato real vale más que "resultados extraordinarios". Sin datos, no se afirma nada. |
| **Un CTA por pantalla, siempre visible** | Ningún tramo de scroll de más de 2,5 pantallas sin acción posible. |
| **El CTA nombra lo que pasa después** | "Iniciar proyecto" no dice nada. El botón describe el siguiente paso real. |
| **La prueba va temprano** | Los clientes aparecen en el primer scroll, no a mitad de página. |
| **Nombres de servicio literales** | "Meta Ads", "TikTok Ads", "CRM Kommo" — como los busca la gente. |

### HUMANO
Introducir equipo, fotografía y El Socio sin romper la dirección tecnológica.

| Regla | |
|---|---|
| **Lo humano cambia de superficie** | Es la única excepción autorizada a superficie clara (§6). El cambio de zona hace de aviso: *aquí hablan personas*. |
| **Retrato real, no recorte compuesto** | Fondo real o de estudio. Nada de figuras recortadas sobre texturas. |
| **Cargo y prueba junto al nombre** | Una cara sin credenciales genera menos confianza que ninguna cara. |
| **Editorial, no corporativo** | Cita con firma, texto en columna estrecha, foto que respira. Ni cuadrícula de avatares circulares ni tarjetas de equipo idénticas. |
| **Lo humano nunca es el fondo** | Una foto de personas es contenido; jamás textura tras un titular. |

---

## 4. Arquitectura visual DOFI / FENIAX / El Socio

**ATRAER → CONVERTIR → ESCALAR.** Tres capas, un solo sitio.

### El principio
**La base visual es común y la personalidad DOFI domina.** FENIAX y El Socio no son temas alternativos: son **modulaciones** de la misma base. Cambian la superficie, la densidad, el tratamiento de imagen y el carácter del movimiento. **No cambian la tipografía, ni la retícula, ni el radio, ni la ausencia de sombras, ni los colores oficiales de marca.**

### Tabla de modulación

| | **DOFI** · Atraer | **FENIAX** · Convertir | **EL SOCIO** · Escalar |
|---|---|---|---|
| **Superficie** | `base` · `raised` | `deep-tech` (la más oscura) | `paper` (clara) — **excepción** |
| **Densidad** | Media–baja | **Alta** | Baja |
| **Composición** | Asimétrica, editorial, aire | Retícula visible, modular, alineada | Columna estrecha, editorial, mucho margen |
| **Imagen** | Pieza real, campaña, rodaje | Captura de interfaz real, diagrama de flujo | Retrato, fotografía documental |
| **Acento** | Naranja como acción | Naranja **solo** en el estado activo de un flujo | Naranja oscurecido (`ink-accent`), solo como filete o dato |
| **Bordes** | `subtle` | `default` — la retícula se ve | `subtle`, casi ausentes |
| **Movimiento** | Revelado, cadencia de ola | **Secuencial y direccional**: muestra un recorrido | Mínimo. Solo aparición. |
| **Tipografía** | Display grande | Titulares medianos + mucha etiqueta y dato | Editorial: titular medio + prosa larga |
| **Ritmo de sección** | Standard / Spacious | Compact | Spacious |

### Reglas de transición
1. **Nunca dos cambios de capa seguidos.** Entre FENIAX y El Socio va siempre una sección DOFI o un bloque de transición.
2. **El cambio de capa se anuncia**, no se descubre: filete a ancho completo, etiqueta de capa o cambio de superficie con margen amplio.
3. **La capa clara aparece una sola vez** en toda la home. Si aparece dos veces deja de significar nada.
4. **Los colores oficiales de las tres marcas no se tocan** en este sprint.
5. **La navegación no cambia de aspecto** al entrar en otra capa. Es un sitio, no tres.

---

## 5. Color

Se conserva la paleta. La auditoría midió que el contraste es una fortaleza real (11 de 12 combinaciones en AA o AAA). **Lo que se añade son roles semánticos**: ningún componente vuelve a escribir `#120A26`.

### 5.1 Base — sin cambios de valor

| Token | Hex | Rol | Contraste con `text.primary` |
|---|---|---|---|
| `surface.base` | `#120A26` | Fondo por defecto de la página | 17,08:1 |
| `surface.raised` | `#1A0F3D` | Zona elevada, superficie de sección alterna | 15,89:1 |
| `surface.overlay` | `#241553` | Campos, píldoras, superficies sobre elevada | — |
| `surface.deep-tech` | `#0D0620` | **Nuevo.** Capa FENIAX, más oscura que la base | 18,9:1 (calc.) |
| `surface.paper` | `#F4F1EA` | **Nuevo.** Capa El Socio. Excepción clara | 15,8:1 con `ink.primary` |

### 5.2 Marca

| Token | Hex | Uso permitido | Uso prohibido |
|---|---|---|---|
| `brand.base` | `#4B2A93` | Relleno tenue, superficies de marca | Texto sobre oscuro |
| `brand.lift` | `#6D4BC9` | Bordes, filetes, estados hover | Texto de cuerpo |
| `accent` | `#F47B20` | **Acción.** Relleno de CTA primario, eyebrow, indicador activo, filete de acento | **Nunca como texto sobre superficie clara** (2,42:1) · nunca como color de error · nunca como relleno decorativo |
| `accent.lift` | `#FF9440` | Hover del CTA primario | Texto |
| `ink.accent` | `#A64E14` | **Nuevo.** Acento textual **solo** sobre `surface.paper` — 5,00:1 | Sobre superficie oscura |
| `brand.coral` | `#EE9070` | Solo dentro de degradados de marca | Como acento suelto |

### 5.3 Texto sobre oscuro

| Token | Hex | Uso | Contraste sobre base |
|---|---|---|---|
| `text.primary` | `#F4F0FE` | Titulares, texto de énfasis | 17,08:1 |
| `text.secondary` | `#B3A5D4` | Prosa, descripciones | 8,43:1 |
| `text.tertiary` | `#948AB8` | Metadatos, pies, etiquetas secundarias | 6,00:1 |
| `text.neutral` | `#cbd5e1` | Gris neutro donde el lila resta legibilidad (formulario, pie) | 13,5:1 |
| `text.on-accent` | `#1A0F3D` | Texto sobre relleno naranja | 6,53:1 |

### 5.4 Texto sobre claro — capa El Socio

| Token | Hex | Contraste sobre `paper` |
|---|---|---|
| `ink.primary` | `#1A0F3D` | 15,8:1 |
| `ink.secondary` | `#5B5470` | 6,3:1 |
| `ink.accent` | `#A64E14` | 5,00:1 |

### 5.5 Estados — sistema nuevo

> **Restricción medida:** cualquier rojo candidato tiene **1,01–1,02:1 contra `#F47B20`**. Son indistinguibles por luminancia. **El color no puede ser el único portador del significado.**

| Token | Hex | Contraste sobre base | Portadores obligatorios |
|---|---|---|---|
| `state.error` | `#FB7185` | 7,11:1 | **icono + borde del campo + texto**. Nunca solo color. |
| `state.success` | `#4ADE80` | 10,98:1 | **icono + texto**. |
| `state.warning` | `#FBBF24` | 11,47:1 | **icono + texto**. |
| `state.info` | `#7DD3FC` | 11,48:1 | **icono + texto**. |

**Regla dura:** un estado se reconoce con la pantalla en escala de grises. Si no, está mal implementado.

### 5.6 Prohibiciones

- Ningún hex literal en un componente.
- Ningún degradado de más de dos paradas.
- Ningún degradado como relleno de una superficie completa (los actuales, radiales y muy sutiles, se conservan como atmósfera de sección, no como fondo de contenido).
- El naranja no se usa para transmitir emoción, solo acción.
- Ninguna combinación por debajo de 4,5:1 para texto normal, ni 3:1 para texto ≥ 24px o elementos de interfaz.

---

## 6. Superficies

### 6.1 El límite medido

Cinco escalones de púrpura, midiendo el contraste entre escalones consecutivos y el texto encima:

| Superficie | vs base | vs anterior | Texto mínimo (AA ≥ 4,5) |
|---|---|---|---|
| `#120A26` base | 1,00 | — | 6,00 ✅ |
| `#1C1140` | 1,10 | 1,10 | 5,47 ✅ |
| `#271A5C` | **1,27** | 1,15 | **4,74 ✅ ← techo utilizable** |
| `#33257A` | 1,54 | 1,21 | 3,91 ❌ |
| `#403096` | 1,90 | 1,23 | 3,16 ❌ |

**Conclusión:** el rango disponible entre "se percibe el cambio" (≈1,25:1) y "el texto deja de cumplir AA" es de un solo escalón. **La superficie sirve para distinguir un objeto de su fondo (una tarjeta, un campo), no para marcar cambios de zona.**

### 6.2 Las cinco superficies

| # | Token | Valor | Función | Cuándo |
|---|---|---|---|---|
| A | `surface.base` | `#120A26` | Fondo por defecto | La mayoría de secciones |
| B | `surface.raised` | `#1A0F3D` | Zona elevada | Máximo **2 secciones** por página. Con filete superior obligatorio |
| C | `surface.overlay` | `#241553` | Objeto sobre fondo | Tarjetas, campos, píldoras. **Nunca** una sección entera |
| D | `surface.deep-tech` | `#0D0620` | Capa FENIAX | Una vez por página |
| E | `surface.paper` | `#F4F1EA` | Capa El Socio | **Una sola vez en todo el sitio** |

### 6.3 Cuándo cambia la superficie

| Situación | Qué hacer |
|---|---|
| Cambio de capa de marca (DOFI→FENIAX→Socio) | **Cambiar superficie.** Es el caso principal. |
| Dos secciones del mismo tema | Mantener superficie. Separar con espacio. |
| Una sección necesita "sentirse otra cosa" pero es la misma capa | **Filete** (`border.subtle` a ancho completo), no cambio de superficie. |
| Contenido que debe leerse como objeto | `surface.overlay` con borde. |
| Media, marquesina, franja de logos | **Full bleed**, sin contenedor, con filete arriba y abajo. |
| Dos secciones consecutivas comparten superficie | Aplicar la regla de unión (§10.3): el espacio total no supera 200px. |

**Prohibido:** alternar superficie en cada sección. Genera bandas y anula el efecto.

---

## 7. Contenedores

### 7.1 El problema medido
`max-width: 1400px` con `px-8` (32px) deja a 1440px de viewport **20px de margen óptico real**. El contenido queda pegado al cristal.

### 7.2 Sistema

| Token | Valor | Función |
|---|---|---|
| `container.page` | **1320px** | Ancho máximo del contenido. Envoltorio general |
| `container.content` | 1080px | Bloques que no deben ocupar todo el ancho |
| `container.copy` | 560px | Prosa. **65 caracteres reales a 18px** |
| `container.reading` | 480px | Prosa estrecha, columnas laterales. 56 caracteres |
| `container.bleed` | 100 % | Marquesinas, medios, franjas |

### 7.3 Por qué 1320 y no 1400

| Viewport | Margen efectivo con 1400 | Margen efectivo con 1320 |
|---|---|---|
| 1280 | 32px | **56px** |
| 1440 | **20px** ❌ | **60px** ✅ |
| 1536 | 68px | **108px** |
| 1920 | 260px | **300px** |

1400 fallaba exactamente en 1440, que es el escritorio más común. **1320 es el mayor valor que garantiza ≥56px de margen en todos los escritorios sin estrechar el contenido de forma perceptible** (la pérdida es de 80px, un 6 %).

Se evaluaron 1280, 1320, 1360 y 1400. 1360 deja 40px a 1440 — insuficiente. 1280 desperdicia espacio a partir de 1536.

---

## 8. Retícula

### 8.1 Definición

| Breakpoint | Columnas | Gutter | Ancho de columna a viewport de referencia |
|---|---|---|---|
| ≥ 1280 | **12** | 24px | **88px** exactos (contenido 1320) |
| 768–1279 | **8** | 20px | variable |
| < 768 | **4** | 16px | variable |

### 8.2 Matemática a 1440 — se comprueba

```
Viewport                1440
Margen exterior           60   (el cap de 1320 manda sobre el gutter de 56)
Contenido               1320
Columnas                  12
Gutters (11 × 24)        264
Ancho de columna    (1320 − 264) / 12 = 88   ← entero exacto
Paso (col + gutter)      112
```

**Anchos de span** — `span(n) = 112n − 24`:

| Span | px | Span | px |
|---:|---:|---:|---:|
| 2 | 200 | 7 | 760 |
| 3 | 312 | 8 | 872 |
| 4 | 424 | 9 | 984 |
| 5 | 536 | 10 | 1096 |
| 6 | 648 | 12 | **1320** ✓ |

Que `span(12)` cierre exactamente en 1320 confirma que la retícula es consistente.

### 8.3 Repartos autorizados

| Reparto | Anchos | Uso |
|---|---|---|
| **7 / 5** | 760 + 536 | Hero, split texto+visual. **El reparto por defecto** |
| **8 / 4** | 872 + 424 | Texto dominante con apoyo visual |
| **6 / 6** | 648 + 648 | Comparación, formulario |
| **5 / 7** | 536 + 760 | Visual dominante. Invierte el ritmo, usar poco |
| **4 / 4 / 4** | 424 ×3 | Tres elementos equivalentes. Máximo una vez por página |
| **7 + 1 vacía + 4** | 760 · 88 · 424 | **Asimetría deliberada.** Ver prueba espacial §27 |
| **12** | 1320 | Statement, editorial rows, franja |

### 8.4 Reglas

1. **La retícula es un marco, no una obligación.** Una sección puede usar 12 columnas para un titular y 5 para su párrafo.
2. **Todo empieza en una línea de columna.** Ningún elemento con ancho arbitrario.
3. **Máximo 3 repartos distintos por página.** Más lecturas rompen la coherencia.
4. **Las retículas anidadas heredan el gutter del padre.** Nunca se inventa uno nuevo dentro.
5. **Full bleed rompe el contenedor, no la retícula:** su contenido interno sigue alineado a las columnas.
6. **Una columna vacía es una decisión válida** si crea la asimetría buscada. No lo es si es un contenedor que no se llenó.

---

## 9. Márgenes laterales

| Breakpoint | Viewport | Margen | Contenido resultante |
|---|---|---|---|
| base | 320–639 | **20px** | 280–599 |
| `sm` | 640–767 | **24px** | 592–719 |
| `md` | 768–1023 | **40px** | 688–943 |
| `lg` | 1024–1279 | **48px** | 928–1183 |
| `xl` | 1280–1439 | **56px** | 1168–1327 |
| `2xl` | ≥ 1440 | **72px** *(el cap de 1320 suele mandar antes)* | 1320 |

Valores de referencia: **390 → 350** · **360 → 320** · **768 → 688** · **1280 → 1168** · **1440 → 1320 (margen 60)**.

Móvil mantiene los 20px actuales: están bien calibrados y subirlos estrecharía titulares que ya van justos a 44px.

---

## 10. Espaciado

### 10.1 Escala — base 4, saltos crecientes

| Token | px | Uso principal |
|---|---:|---|
| `space.1` | 4 | Ajuste óptico |
| `space.2` | 8 | Icono ↔ texto |
| `space.3` | 12 | Interior de píldora |
| `space.4` | 16 | Interior de botón, gap de campo |
| `space.5` | 20 | Margen lateral móvil |
| `space.6` | 24 | **Gutter.** Título pequeño ↔ párrafo |
| `space.8` | 32 | Título ↔ párrafo (desktop) |
| `space.10` | 40 | Interior de tarjeta. Titular ↔ lead |
| `space.12` | 48 | Entre elementos de un grupo |
| `space.16` | 64 | Intro de sección ↔ contenido |
| `space.20` | 80 | Entre grupos |
| `space.24` | 96 | Padding inferior de sección |
| `space.28` | 112 | Padding superior de sección |
| `space.32` | 128 | Sección amplia |
| `space.40` | 160 | Máximo. Solo hero y statement |

**Prohibido cualquier valor fuera de la escala.** Los actuales `mt-3`, `mt-5`, `py-14`, `py-28` desaparecen o se redondean.

### 10.2 Niveles de uso

| Nivel | Rango | Ejemplo |
|---|---|---|
| **Micro** | 4–12 | Icono ↔ etiqueta, interior de chip |
| **Component** | 16–24 | Padding de botón, gap de campo |
| **Content** | 24–40 | Título ↔ párrafo ↔ CTA |
| **Group** | 48–80 | Entre bloques de una misma sección |
| **Section** | 96–160 | Entre secciones |

### 10.3 Regla de unión — resuelve los 384px

> **Cuando dos secciones consecutivas comparten superficie, el espacio total entre sus contenidos no puede superar 200px en escritorio ni 128px en móvil.**

Se consigue con la variante `-join` del padding superior de la segunda sección. Y si dos secciones comparten superficie **y** el vacío supera 200px, hay que insertar un filete o cambiar la superficie: el vacío por sí solo no separa (§6.1).

---

## 11. Ritmo de sección

### 11.1 Arquetipos de espaciado — asimétricos a propósito

Más aire arriba que abajo: cada sección "empuja" hacia la siguiente en lugar de flotar.

| Arquetipo | Desktop (pt / pb) | Tablet | Móvil | Uso |
|---|---|---|---|---|
| **Hero** | 128 / 96 | 112 / 80 | 96 / 80 | Solo el hero |
| **Compact** | 80 / 64 | 72 / 56 | 56 / 48 | Franjas, logos, marquesinas, CTA intermedios |
| **Standard** | 112 / 88 | 96 / 72 | 72 / 64 | Por defecto |
| **Spacious** | 160 / 128 | 128 / 96 | 96 / 80 | Statement, El Socio, cierre |
| **Standard `-join`** | 88 / 88 | 72 / 72 | 56 / 64 | Segunda sección cuando comparte superficie |

### 11.2 Comprobación

| Secuencia | Actual | V1 |
|---|---:|---:|
| Standard → Standard (superficies distintas) | 384 | **200** |
| Standard → Standard `-join` (misma superficie) | 384 | **176** |
| Spacious → Compact | 320 | **208** |
| Compact → Standard | 256 | **176** |

**Ningún vacío entre secciones supera 208px.** El actual máximo de 384px desaparece.

### 11.3 Efecto sobre la longitud de la página
Aplicado a las 10 secciones actuales, solo el cambio de espaciado ahorra **≈1 500px en escritorio** (de 9 480 a ≈8 000) sin quitar contenido. Con los ajustes de densidad de §37, el objetivo es **≈7 pantallas en escritorio y ≈9 en móvil**, frente a las 10,5 y 13,5 actuales.

---

## 12. Ritmo vertical

### 12.1 La regla

> **La separación entre un titular y el elemento que le sigue es 0,6 × el `font-size` del titular, redondeada al paso más cercano de la escala, con mínimo 16 y máximo 40.**

Escala sola con el breakpoint. Resuelve exactamente el hallazgo de la auditoría: `mt-6` fijo funcionaba con un H2 móvil de 36px (0,67×) y quedaba corto con el H2 de escritorio de 60px (0,40×).

### 12.2 Tabla resuelta

| Relación | Fórmula | Desktop | Móvil |
|---|---|---:|---:|
| eyebrow → titular | 0,35 × titular | 32 (H1 80) · 20 (H2 56) | 16 |
| **titular → lead** | **0,6 × titular** | **40** (H1 80, con tope) · **32** (H2 56) | **24** (H2 36) |
| lead → CTA | fijo | 32 | 24 |
| titular → párrafo (H3 28) | 0,6 × 28 = 16,8 | **16** | 16 |
| intro de sección → contenido | por densidad | 64 (baja) · 80 (media) · 96 (alta) | 48 / 56 / 64 |
| entre párrafos | fijo | 24 | 20 |
| entre elementos de lista | fijo | 12 | 12 |
| Bloque → filete → bloque | fijo | 48 / 48 | 32 / 32 |

### 12.3 Comparación

| | Actual | V1 |
|---|---:|---:|
| H2 escritorio 60px → párrafo | 24px (**0,40×**) | H2 56px → **32px** (0,57×) |
| H2 móvil 36px → párrafo | 24px (0,67×) | H2 36px → **24px** (0,67×) |

El valor de móvil, que ya funcionaba, se conserva. El de escritorio se corrige. Y sale de una regla, no de un número escrito a mano.

---

## 13. Tipografía

### 13.1 Familias — se conservan

**Sora** (display) y **Geist Sans** (texto) se mantienen. Están bien elegidas, contrastan entre sí, están auto-alojadas y suman solo 101 KB. Cambiarlas sería moda, no criterio.

Métricas medidas `[medido]`:

| Fuente | Peso | 1ch | Ancho medio real | Ratio |
|---|---:|---:|---:|---:|
| Geist | 400 | 0,663em | **0,476em** | 0,718 |
| Sora | 300 | 0,735em | 0,522em | 0,710 |
| Sora | 700 | 0,763em | 0,536em | 0,703 |
| Sora | 800 | 0,769em | **0,540em** | 0,702 |

> **Fórmulas operativas**
> Prosa (Geist 400): `caracteres por línea = ancho_px / (0,476 × font-size)`
> Titulares (Sora 800): `caracteres por línea = ancho_px / (0,540 × font-size)`

### 13.2 Interlineados — de 11 valores a 4

| Token | Valor | Uso |
|---|---:|---|
| `leading.tight` | 1,0 | display, H1 |
| `leading.snug` | 1,12 | H2, H3 |
| `leading.normal` | 1,4 | Títulos pequeños, etiquetas, botones |
| `leading.relaxed` | 1,6 | Toda la prosa |

### 13.3 Escala

Sora para `display` y `heading`. Geist para todo lo demás.

| Token | Desktop | Tablet | Móvil | LH | Peso | Tracking | Máx. caracteres/línea | Uso |
|---|---:|---:|---:|---|---:|---|---:|---|
| `display-xl` | **80** | 60 | 44 | tight | 800 | −0,02em | 18 @760px | H1 del hero |
| `display-lg` | **64** | 48 | 38 | tight | 800 | −0,02em | 22 @760px | Statement a página completa |
| `heading-xl` | **56** | 42 | 36 | snug | 800 | −0,02em | 26 @760px | **H2 único** |
| `heading-lg` | 40 | 34 | 30 | snug | 700 | −0,015em | 39 @840px | H2 dentro de una columna |
| `heading-md` | 28 | 26 | 24 | snug | 700 | −0,01em | 35 @536px | H3 |
| `title-lg` | 22 | 21 | 20 | normal | 600 | −0,005em | — | Título de tarjeta |
| `title-md` | 18 | 18 | 17 | normal | 600 | 0 | — | Etiqueta de campo, título de columna |
| `body-lg` | 18 | 18 | 17 | relaxed | 400 | 0 | **65 @560px** | Lead, prosa principal |
| `body-md` | 16 | 16 | 16 | relaxed | 400 | 0 | 65 @495px | Cuerpo |
| `body-sm` | 14 | 14 | 14 | relaxed | 400 | 0 | 65 @435px | Texto de apoyo |
| `label` | 14 | 14 | 14 | normal | 600 | 0 | — | Etiquetas de interfaz |
| `eyebrow` | 12 | 12 | 12 | normal | 600 | **0,14em** | 40 | Etiqueta de sección |
| `caption` | 13 | 13 | 13 | normal | 400 | 0 | 60 | Pies, metadatos |
| `button` | 15 | 15 | 15 | normal | 600 | 0,01em | — | Botones |

**14 tokens · 4 interlineados · 2 familias · 5 pesos** (300, 400, 600, 700, 800).

### 13.4 Qué se elimina

| Actual | Problema | V1 |
|---|---|---|
| H1 144px | Ver §14 | `display-xl` 80px |
| H2 72 / 60 / 48 | Tres tamaños sin criterio | `heading-xl` 56 (+ `display-lg` como *statement*) |
| H3 48 / 36 / 24 / 18 | Un H3 de 48 conviviendo con un H2 de 48 | `heading-lg` 40 / `heading-md` 28 / `title-lg` 22 |
| 11 interlineados | Sin escala | 4 |
| eyebrow 11px @ 0,30em | Al límite de legibilidad | 12px @ 0,14em |
| firma @ 0,55em | Se lee carácter a carácter | máx. 0,16em (§16) |

---

## 14. H1

### 14.1 Por qué 144px es un problema de negocio, no de gusto

Anchos medidos de titulares castellanos reales en Sora 800 `[medido]`:

| Titular | Caracteres | @144px | @96px | @80px | @72px |
|---|---:|---:|---:|---:|---:|
| "Marketing que vende" | 19 | **1 531px** | 1 020 | 850 | 765 |
| "Convertimos atención en ventas medibles" | 39 | **3 039px** | 2 026 | 1 688 | 1 519 |
| "Creatividad que atrae y sistemas que cierran" | 44 | **3 187px** | 2 125 | 1 771 | 1 594 |

**A 144px, un titular de 19 caracteres mide 1 531px — más ancho que el contenedor entero (1 320px).**

Consecuencia: a ese tamaño solo caben titulares de tres palabras. Por eso el hero dice *"Un mar de ideas"* y no puede decir una propuesta de valor. **El tamaño del H1 actual es la restricción que impide escribir un mensaje comercial.**

### 14.2 Decisión: `display-xl` = 80px fluido

```css
font-size: clamp(2.75rem, 1.6rem + 3.2vw, 5rem);   /* 44px → 80px */
```

| Viewport | Tamaño | Ancho disponible | Máx. caracteres/línea |
|---|---:|---:|---:|
| 1440 | 80px | 760 (7 col) | **18** |
| 1440 | 80px | 872 (8 col) | 20 |
| 1280 | ~74px | 700 | 17 |
| 768 | 60px | 688 | 21 |
| 390 | 44px | 350 | **14** |

### 14.3 Presupuesto de caracteres

| Líneas | Escritorio | Móvil |
|---|---:|---:|
| 2 líneas | ≤ 36 caracteres | ≤ 28 |
| **3 líneas** *(recomendado)* | **≤ 54** | ≤ 42 |
| 4 líneas | no autorizado | ≤ 56 |

**Reglas:** máximo 3 líneas en escritorio · si el titular supera 54 caracteres, usar `display-lg` (64px) o ampliar a 8 columnas · nunca forzar saltos con `<br>` salvo que el diseño lo exija y se compruebe en los 5 viewports · **el H1 es siempre HTML real** (§41).

---

## 15. H2

**Un solo H2: `heading-xl`.** 56 / 42 / 36px.

Variante autorizada, **una vez por página**: `display-lg` (64px) para una sección *Statement* a ancho completo — una frase de posicionamiento, sin párrafo, sin CTA en el mismo bloque.

`heading-lg` (40px) **no es un H2 alternativo**: es el tamaño del H2 cuando vive dentro de una columna estrecha (por ejemplo, la mitad de un split 6/6). Mismo nivel semántico, tamaño adaptado al contenedor.

Desaparecen los 72px (nombre de El Socio: pasa a `heading-xl`, y el peso lo aporta el retrato y la superficie clara, no el tamaño de la fuente) y los 48px de Proceso.

---

## 16. Tracking

| Contexto | Tracking | Nota |
|---|---|---|
| `display-*` | **−0,02em** | Titulares grandes necesitan cerrar |
| `heading-xl/lg` | −0,02 a −0,015em | |
| `heading-md`, `title-lg` | −0,01 a −0,005em | |
| Prosa (`body-*`) | **0** | Nunca se toca el tracking del cuerpo |
| `label`, `caption` | 0 | |
| `button` | +0,01em | |
| **Uppercase pequeño** (`eyebrow`) | **+0,14em** | |
| **Máximo absoluto** | **+0,16em** | |

**Prohibido superar +0,16em.** El `0,55em` actual de la firma del hero se lee carácter a carácter, no como palabra. **El uppercase solo se permite en `eyebrow`, `label` de chip y `button` opcional.** Nunca en prosa ni en titulares.

---

## 17. Medidas de texto

Calculadas sobre el ancho medio **real** de Geist 400 (0,476em), no en `ch`.

| Token | px | @18px | @16px | Uso |
|---|---:|---:|---:|---|
| `measure.narrow` | **480** | 56 car. | 63 car. | Columna lateral, lead corto, pie |
| `measure.default` | **560** | **65 car.** | 73 car. | **Prosa por defecto** |
| `measure.wide` | **660** | 77 car. | 87 car. | Texto largo (El Socio). Solo a 18px |

Rango objetivo: **55–75 caracteres**. `measure.wide` a 16px se sale (87) — **`measure.wide` solo se usa con `body-lg`**.

### Sustitución

| Actual | px | Caracteres reales @18px | V1 |
|---|---:|---:|---|
| `34rem` (Servicios) | 544 | 63 | `measure.default` (560) |
| `36rem` (Herramientas) | 576 | 67 | `measure.default` |
| `40rem` (Clientes) | 640 | 75 | `measure.default` |
| `42rem` (Socio) | 672 | 78 | `measure.wide` (660) |
| `48ch` (Contacto) | ≈620 | 72 | `measure.default` |
| `22ch` (H2 Proceso) | ≈812 | — | Presupuesto de caracteres de §15 |

> **Matiz honesto:** en caracteres reales, cuatro de los seis valores actuales ya caían en un rango legible. El defecto era la **inconsistencia** (seis decisiones locales), no la legibilidad. V1 lo reduce a tres tokens.

---

## 18. Botones

### 18.1 Jerarquía

| Nivel | Superficie | Texto | Borde | Uso |
|---|---|---|---|---|
| **Primary** | `accent` sólido | `text.on-accent` (6,53:1) | ninguno | La acción principal |
| **Secondary** | transparente | `text.primary` | `border.default` | Alternativa real |
| **Tertiary** | ninguna | `text.primary` + filete inferior | — | Exploración, "ver caso" |
| **Icon** | transparente | `text.secondary` | `border.subtle` | Acciones menores |

### 18.2 Medidas

| Tamaño | Alto | Padding H | Fuente | Radio | Gap icono | Área táctil |
|---|---:|---:|---|---|---:|---|
| `lg` | **52px** | 32 | `button` 15/600 | pill | 8 | 52 ✅ |
| `md` *(por defecto)* | **48px** | 24 | `button` 15/600 | pill | 8 | 48 ✅ |
| `sm` | **40px** | 16 | `body-sm` 14/600 | pill | 6 | **padding ampliado a 44** |
| `icon` | **44×44** | — | — | pill | — | 44 ✅ |

**Mínimo absoluto: 44 × 44px de área táctil.** Cuando el trazo visible sea menor, se amplía con padding transparente.

### 18.3 Estados

| Estado | Primary | Secondary |
|---|---|---|
| hover | `accent.lift`, 200ms | borde → `border.emphasis` |
| active | `scale(0.98)`, 100ms | igual |
| focus-visible | contorno 2px `accent`, offset 3px | igual |
| disabled | opacidad 0,5, sin puntero | igual |
| loading | texto cambia + spinner, ancho **fijo** | — |

Se conserva el contorno de foco global actual: es correcto y consistente.

### 18.4 Ancho

| `width: auto` | `width: 100%` |
|---|---|
| Todos los casos por defecto | Móvil < 640px, cuando el botón es la acción principal del bloque |
| Junto a otro botón | Dentro de un formulario en una sola columna, **con tope de 420px** |
| Dentro de una tarjeta | |

> **Corrige:** el `submit` actual mide 620 × 52px con texto de 15px porque hereda el ancho de la columna. **Un botón nunca hereda el ancho de su contenedor sin tope.**

---

## 19. Jerarquía de CTA

1. **Un solo CTA primario por sección.** Dos rellenos naranja en la misma pantalla anulan la jerarquía.
2. **Ningún tramo de más de 2,5 pantallas sin un CTA visible.** Corrige las 7,8 pantallas actuales.
3. **El CTA nombra el resultado, no la intención.** "Iniciar proyecto" describe el deseo del usuario, no lo que pasará al hacer clic.
4. **WhatsApp no es siempre primario.** Es primario en móvil y en contextos de urgencia; secundario junto a un formulario.
5. **Dos CTA juntos deben verse distintos:** uno relleno, otro contorno. Nunca dos rellenos, nunca dos contornos.
6. **El CTA persistente de la navegación no cuenta** como el CTA de la sección.
7. **Un CTA con fricción avisa de la fricción** ("respondemos en 24 h hábiles"). Se conserva el mensaje actual, que está bien resuelto.
8. **Todo CTA es un elemento navegable real.** Ninguna flecha `↗` sobre algo que no lleva a ningún sitio.

> El copy definitivo de los CTA se decide en el sprint de mensaje. Aquí solo se fijan las reglas.

---

## 20. Bordes y radios

### 20.1 Bordes — se conserva la decisión de usar borde en lugar de sombra

| Token | Valor | Uso |
|---|---|---|
| `border.subtle` | `brand.lift` 15 % | Separadores, filetes de sección |
| `border.default` | `brand.lift` 25 % | Tarjetas, celdas, botón secundario |
| `border.emphasis` | `brand.lift` 45 % | Hover, elemento activo |
| `border.interactive` | `accent` 50 % | Hover de un elemento accionable |
| `border.focus` | `accent` 100 %, 2px, offset 3px | Foco de teclado |
| `border.field` | `brand.lift` 40 % | Campos de formulario |
| `border.error` | `state.error` 70 %, 2px | Campo con error — **acompaña al icono, no lo sustituye** |

Grosor: **1px** siempre, salvo foco y error (2px). En superficie clara, los bordes usan `ink.primary` al 12 / 20 / 35 %.

### 20.2 Radios — se conserva la escala actual

| Token | Valor | Uso |
|---|---|---|
| `radius.sm` | 8px | Chips pequeños, avisos |
| `radius.md` | 12px | Campos, botones cuadrados, contenedores pequeños |
| `radius.lg` | 20px | **Tarjetas, celdas, medios** |
| `radius.xl` | 28px | Contenedores grandes, tarjeta destacada |
| `radius.pill` | 9999px | Botones, píldoras, chips |

**Cinco radios. La escala actual (pill / 20 / 12) ya era coherente y está documentada en el código: se formaliza y se amplía mínimamente.**

---

## 21. Sombras

> **Principio: las sombras son la excepción, no el sistema.**

En fondo oscuro una sombra no crea profundidad: crea suciedad. La profundidad se consigue con superficie + borde + escala.

**Únicos casos autorizados:**

| Caso | Sombra |
|---|---|
| Menú móvil / desplegable sobre contenido | `0 16px 48px −24px rgba(0,0,0,0.6)` |
| CTA primario flotante persistente en móvil | `0 8px 24px −14px rgba(244,123,32,0.5)` *(ya existe, se conserva)* |
| Elemento sobre `surface.paper` | `0 2px 16px −8px rgba(26,15,61,0.15)` |

**Prohibido:** sombras en tarjetas, en secciones, en imágenes, en botones estáticos, y cualquier `box-shadow` con opacidad > 0,6 o desenfoque > 60px.

---

## 22. Tarjetas

### 22.1 Cuándo existe una tarjeta

Una tarjeta necesita **al menos dos** de estas cuatro:

1. Agrupa información heterogénea que se lee junta.
2. Es una superficie interactiva (todo el bloque navega).
3. Representa una entidad repetible (un cliente, un caso, una persona).
4. Contiene una acción propia.

**Si solo cumple una, no es una tarjeta: es un bloque de contenido.**

> **Prohibido crear una tarjeta para dar forma a un vacío.** La tarjeta de cliente actual mide 971px porque existe para alojar una imagen que no existe.

### 22.2 Tipos

| Tipo | Superficie | Radio | Padding | Imagen | Uso |
|---|---|---|---|---|---|
| **Case Card** | `overlay` + `border.default` | `lg` | 24 | 16:9 o 4:3, **nunca 9:16 con material horizontal** | Cliente, caso |
| **Feature Card** | `overlay` + `border.default` | `lg` | 32 | opcional | Celda de bento, capacidad |
| **Editorial Card** | sin superficie, solo filete superior | 0 | 0 / 32 arriba | opcional | Fila de servicio, artículo |
| **Interactive Card** | `overlay` + `border.default` → `border.interactive` | `lg` | 24 | sí | Navegable completa |
| **Person Card** | `paper` o sin superficie | `lg` | 24 | retrato 4:5 | Equipo, El Socio |

### 22.3 Proporción

| Regla | |
|---|---|
| **Máximo 480px de alto** en escritorio. | Por encima deja de leerse como tarjeta |
| **Máximo 70 % de la altura del viewport** en móvil | La actual ocupa el 98 % |
| **Mínimo 40 % de superficie con información** | La actual tiene 78 % de imagen vacía |
| **La proporción del archivo coincide con la del marco** | 16:9 no se recorta en 9:16 |

### 22.4 Secciones sin tarjeta

**Es explícitamente válido y deseable.** Servicios (filas editoriales), Statement, Proceso, Logo Wall y CTA **no llevan tarjeta**. Máximo **dos** familias de tarjeta visibles por página.

---

## 23. Bento

Autorizado, pero **no es el lenguaje dominante**.

| Regla | |
|---|---|
| **Máximo 5 celdas** por bento | Seis celdas iguales es una cuadrícula, no un bento |
| **Jerarquía obligatoria** | Una celda debe ocupar al menos el doble que la menor. Sin jerarquía no es bento |
| **La celda grande lleva la información principal** | No el vacío. La celda de Kommo actual tiene 250px de nada dentro |
| **Un bento por página** | |
| **Móvil**: se apila en orden de importancia | No se conserva el orden de la retícula |
| **Nunca** para elementos equivalentes | Si todas las celdas pesan lo mismo, es una lista |

---

## 24. Imagen y vídeo

### 24.1 Dirección fotográfica

| Prioridad | Sí | No |
|---|---|---|
| 1 | Piezas reales producidas por DOFI | Stock corporativo |
| 2 | Rodaje, detrás de cámaras, equipo trabajando | Manos sobre un portátil |
| 3 | Clientes reales, locales reales | Reuniones posadas |
| 4 | Capturas de interfaz real (Kommo, Meta Ads, bot) | Mockups genéricos de dashboard |
| 5 | Retratos con fondo real o de estudio | Recortes sobre texturas |
| — | — | **Degradados de relleno** |

### 24.2 Proporciones

| Ratio | Uso |
|---|---|
| **16:9** | Vídeo, caso, portada horizontal |
| **4:3** | Tarjeta de caso, galería |
| **4:5** | Retrato |
| **1:1** | Detalle, logo, avatar |
| **9:16** | **Solo** con material vertical nativo (reels) |
| **21:9** | Franja full bleed |

**Regla dura:** la proporción del marco coincide con la del archivo. Si no hay material en esa proporción, se cambia el marco, no se recorta el archivo.

### 24.3 Tratamiento

Radio `lg` · borde `border.default` · sin sombra · degradado inferior solo si hay texto encima, máximo 2 paradas, ≤ 60 % de la altura · **sin filtros de color de marca sobre fotografía de personas** · pie en `caption` `text.tertiary` a 12px por debajo, nunca superpuesto.

### 24.4 Vídeo

| Tipo | Autoplay | Silencio | Controles | Póster | Móvil |
|---|---|---|---|---|---|
| **Hero motion** | Sí, en bucle | Obligatorio | No | **Obligatorio** | Se sustituye por imagen < 768px |
| **Case study** | No | — | Sí | Obligatorio | Igual |
| **Production reel** | No | — | Sí | Obligatorio | Igual |
| **Interface demo** | Sí, en bucle, al entrar en viewport | Obligatorio | No | Obligatorio | Se conserva, más corto |
| **Testimonial** | **Nunca** | — | Sí | Obligatorio + subtítulos | Igual |

**Reglas:** todo vídeo lleva póster · autoplay solo si es mudo, en bucle, < 12s y decorativo · nunca autoplay con `prefers-reduced-motion` · testimonios siempre con subtítulos · el vídeo nunca lleva texto que solo exista dentro del vídeo (§41).

---

## 25. Iconografía y logotipos

### 25.1 Iconos — se conserva Phosphor

Coherente, con múltiples pesos, ya integrada y sin coste añadido.

| Regla | |
|---|---|
| Peso | **`regular`** por defecto · `fill` solo en iconos de estado y redes · **`duotone` se retira** (introduce un segundo nivel de opacidad ajeno al sistema) |
| Tamaños | 16 (junto a `body-sm`) · 20 (junto a `body-md/label`) · 24 (botones, navegación) · 32 (destacado) |
| Color | Hereda el color del texto. Solo `accent` cuando marca acción o estado activo |
| Alineación | Óptica con la altura de la x, no con la caja |

> **Regla principal: no se usa un icono si una pieza real puede demostrar mejor la idea.** Los iconos de Servicios (megáfono, embudo, destello) son relleno decorativo: deberían ser una pieza, una captura o nada.

**Prohibido:** iconos como relleno de un vacío · más de 6 iconos visibles a la vez · icono + logo + ilustración en el mismo bloque · un icono representando un servicio que se puede enseñar.

### 25.2 Logotipos

| Marca | Tratamiento |
|---|---|
| **DOFI** | Delfín solo (navegación, favicon, pie). Lockup completo solo en el pie. Nunca como elemento decorativo grande |
| **FENIAX** | Wordmark. Presencia propia en su capa, no un crédito en el pie |
| **EL SOCIO** | Tipográfico, no logo. Su identidad es la persona |
| **CLIENTES** | Ver abajo |
| **SOFTWARE** | Monocromo `text.tertiary`, color solo al pasar el cursor. Altura óptica 24px. **Nunca más grande que el logo de un cliente** |

### 25.3 Muro de clientes

| Regla | |
|---|---|
| **Logotipo real** en SVG monocromo, `text.secondary` | El monograma de dos letras **no** es sustituto: se repite (`EL` para El Horno y El Cobayo) y no identifica nada |
| **Altura óptica normalizada** a 28px | No altura de caja: se ajusta uno a uno para que pesen igual |
| **Sin caja individual** | Ni fondo, ni borde, ni tarjeta por logo |
| **Separación 56px** | Uniforme |
| **Un solo tratamiento cromático** | Todos monocromos, o todos a color. Nunca mezclados |
| **Sin logo, no aparece** | Preferible 18 logos reales que 26 con 8 monogramas |
| Color al pasar el cursor | Opcional, solo escritorio |

> Si en algún caso se decide deliberadamente usar monograma, debe ser un sistema propio y consistente (iniciales + color por sector), no las dos primeras letras del nombre.

---

## 26. Formularios

Se preserva lo que ya está bien resuelto: 4 campos, uno opcional, validación con mensajes útiles, `aria-invalid`, `aria-describedby`, `aria-live` y expectativa explícita de respuesta.

| Elemento | Especificación |
|---|---|
| Alto de campo | **52px** (era 50). Área táctil ✅ |
| Padding | 16 horizontal, 14 vertical |
| Radio | `radius.md` (12px) |
| Borde | `border.field` → `accent` al foco |
| Fondo | `surface.overlay` al 70 % |
| **Etiqueta** | `title-md` 18/600, **siempre visible encima**. Nunca solo placeholder |
| Placeholder | `body-md` `text.tertiary`. **Ejemplo, no instrucción** |
| Gap etiqueta ↔ campo | 8px |
| Gap entre campos | 24px |
| Gap entre grupos | 32px |
| Textarea | mín. 5 filas, `resize: vertical` |
| Texto de ayuda | `body-sm` `text.neutral`, debajo |
| **Error** | icono 16px + borde 2px `border.error` + texto `body-sm` `state.error`. **Los tres a la vez** (§5.5) |
| Éxito | icono + texto `state.success`, en `aria-live="polite"` |
| Obligatorio | Se marcan los **opcionales**, no los obligatorios |
| Botón | `lg`, `width: 100%` con **tope de 420px** |
| Teclado móvil | `type="email"` / `inputmode` correctos · `autocomplete` en todos los campos · el campo enfocado no queda tapado por el teclado |

---

## 27. Responsive

### 27.1 Breakpoints

Los actuales de Tailwind son correctos, pero el proyecto solo usa tres de verdad (`md` 47 veces, `lg` 25, `sm` 8). Se formalizan **cinco** y se descarta `2xl` como punto de cambio de maqueta.

| Token | Desde | Qué cambia realmente |
|---|---:|---|
| *(base)* | 320 | 4 columnas · margen 20 · tipografía móvil · todo apilado · CTA a ancho completo |
| `sm` | 640 | margen 24 · aparecen splits de 2 en tarjetas · CTA vuelve a `auto` |
| `md` | 768 | **8 columnas** · margen 40 · tipografía tablet · splits reales · navegación aún colapsada |
| `lg` | 1024 | **12 columnas** · margen 48 · navegación completa · aparecen los estados hover |
| `xl` | 1280 | margen 56 · tipografía de escritorio completa · asimetrías de 7/5 y 8/4 |
| `2xl` | 1536 | **Solo** margen 72. Sin cambios de maqueta |

**Prohibidos los breakpoints arbitrarios por componente.** El actual `min-width: 1024px` del carrusel se alinea con `lg`.

### 27.2 Móvil se compone

| Situación | Qué hacer |
|---|---|
| Split 7/5 o 8/4 | Apilar. **El visual va primero solo si demuestra algo**; si es decorativo, se elimina |
| Asimetría con columna vacía | Desaparece: no hay espacio para gestos de composición |
| Bento | Apila en orden de importancia, **no** en orden de la retícula |
| Carrusel de más de 6 elementos | **Cambia de patrón**: scroll horizontal con `scroll-snap`, sin puntos |
| Carrusel de 2–6 elementos | Puntos permitidos, máximo una fila, ≥ 44px de área táctil |
| Tarjeta > 70 % del viewport | Cambia de proporción o se convierte en fila |
| Marquesina | Se conserva, más rápida y más corta |
| Fondo animado en canvas | **Se elimina** por debajo de 768px |
| CTA principal | `width: 100%`, y CTA persistente en la barra |
| Densidad | Baja un nivel: lo denso pasa a medio, lo medio a bajo |
| Movimiento | Solo aparición. Sin hover, sin parallax, sin magnético |

### 27.3 Viewports objetivo

**360** (mínimo garantizado) · **390** (referencia principal) · **430** (holgura) · **768** (tablet vertical) · **1024** (tablet horizontal / portátil pequeño) · **1280** (portátil) · **1440** (escritorio de referencia) · **1920** (escritorio grande).

---

## 28. Movimiento

### 28.1 Se conserva la curva

`cubic-bezier(0.16, 1, 0.3, 1)` como curva única del sistema. Entra rápido y se asienta: es coherente con la metáfora de la ola y ya está aplicada de forma consistente. **Es una fortaleza del proyecto actual.**

| Token | Curva | Uso |
|---|---|---|
| `ease.standard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Todo por defecto |
| `ease.out` | `cubic-bezier(0.33, 1, 0.68, 1)` | Salidas, cierres |
| `ease.linear` | `linear` | **Solo** marquesinas y barras de progreso |
| `spring.soft` | rigidez 90 / amortiguación 24 | Progreso ligado al scroll *(ya en uso en Proceso)* |
| `spring.snappy` | rigidez 180 / amortiguación 18 | CTA magnético *(ya en uso)* |

### 28.2 Duraciones

| Token | Valor | Categoría | Uso |
|---|---:|---|---|
| `duration.instant` | 100ms | Micro | `active`, pulsación |
| `duration.fast` | 200ms | Micro | Color de hover, foco |
| `duration.base` | 320ms | UI | Transformaciones de hover, cambios de estado |
| `duration.slow` | 480ms | UI | Barrido de superficie, transición de panel |
| `duration.reveal` | 600ms | Reveal | Aparición al entrar en viewport |
| `duration.story` | ligado al scroll | Storytelling | Progreso, secuencias |

Las duraciones actuales (300 / 500 / 650 / 750 / 900ms) se redondean a esta escala. Ninguna animación de interfaz supera **600ms**.

### 28.3 Jerarquía

| Categoría | Definición | Presupuesto |
|---|---|---|
| **Functional** | Comunica estado o progreso | Sin límite |
| **Directional** | Guía hacia dónde seguir | Máx. 2 simultáneas |
| **Premium** | Eleva la calidad percibida sin informar | Máx. 2 simultáneas |
| **Decorative** | No aporta información | Máx. **1** por pantalla, y nunca en el hero |
| **Avoid** | Reduce legibilidad, rendimiento o conversión | **0** |

### 28.4 Reglas duras

1. **Máximo 3 elementos en movimiento simultáneo** en una pantalla (sin contar marquesinas y movimiento ligado al scroll).
2. **Ningún contenido crítico nace con `opacity: 0`.** Ya corregido en Sprint 0.1; ahora es regla.
3. **Ninguna animación con `delay` en el primer viewport.** Ni una.
4. **Nada de movimiento perpetuo en texto.** La ola del H1 se retira en el rediseño del hero: es decorativa y afecta al elemento más importante de la página.
5. **Sin parallax** salvo que demuestre profundidad real de una pieza.
6. **`prefers-reduced-motion` obligatorio** en las tres capas ya implementadas. Se conserva tal cual: está mejor resuelto que la media.
7. **Nada de `100vh` por defecto.** Ver §36.
8. **El movimiento nunca es el único portador de información.**

### 28.5 Qué pasa con el movimiento actual

| Animación | Categoría | V1 |
|---|---|---|
| Riel de Proceso ligado al scroll | Functional | **Conservar** |
| Barra de navegación transparente→sólida | Functional | **Conservar** |
| Barrido de fila de servicio | Premium | **Conservar** |
| Herramientas gris→color | Premium | **Conservar** |
| Flechas al hover | Directional | **Conservar** (si el elemento navega) |
| Marquesina de cuentas | Premium | **Conservar** |
| CTA magnético | Premium | **Conservar**, solo escritorio |
| Zoom del retrato | Premium | **Conservar** |
| `Reveal` global | Directional | **Conservar**, sin `delay` en el primer viewport |
| Ola perpetua del H1 | Decorative | **Retirar** en el sprint Hero |
| Flotación del logo | Decorative | **Retirar** o reducir |
| Canvas `OceanCurrent` | Decorative | **Retirar en móvil**; en escritorio, decidir en el sprint Hero |
| Marquesina del manifiesto | Avoid | **Eliminar** (2,63:1) |

---

## 29. Remotion

Disponible para producción visual posterior. **No se instala en este sprint.**

| ✅ Usar Remotion | ❌ No usar Remotion |
|---|---|
| Secuencia ATRAER → CONVERTIR → ESCALAR | Hover |
| Recorrido lead → CRM → venta | Barra de navegación |
| Vídeos de caso | Botones |
| Reels y piezas sociales | Aparición al hacer scroll |
| Motion graphics complejos pre-renderizados | Tooltips |
| Demo de interfaz con muchos estados | Microinteracciones |
| Intro/outro de marca | Transiciones de página |

**Criterio:** si la animación es **la misma para todos los usuarios y no reacciona a nada**, es vídeo y debe pre-renderizarse. Si **responde a la entrada del usuario**, es interfaz y va en CSS o Motion.

**Salida:** WebM (VP9) + MP4 (H.264) · póster obligatorio · ≤ 12s y ≤ 2 MB si va en el primer viewport · versión móvil aparte.

---

## 30. Storytelling de scroll

| Regla | |
|---|---|
| **Sticky autorizado** | Retrato de El Socio *(ya funciona)* · columna de resumen junto a contenido largo · barra de progreso de caso. **Máximo un elemento sticky a la vez** |
| **Progreso visible** | Solo en recorridos de más de 3 pasos (Proceso lo hace bien) |
| **Cambio de superficie** | Solo al cambiar de capa de marca |
| **Mensaje grande (`Statement`)** | Máximo **una vez** por página. Sin párrafo, sin CTA, sin imagen |
| **`100vh`** | **Solo el hero.** Y ni siquiera obligatorio: si el contenido cabe en 780px, la sección mide 780px |
| **Nunca `100vh`** | En secciones de contenido, listas, formularios o cualquier bloque con texto largo |
| **Corte de sección** | El borde inferior del primer viewport debe dejar ver que hay más abajo: nunca coincidir con el final exacto de una sección |
| **Sin scroll hijacking** | Nunca |

---

## 31. Densidad

| Nivel | Espaciado | Elementos visibles | Tipografía | Uso |
|---|---|---|---|---|
| **Baja** | Spacious · intro→contenido 64 | 1–3 | display / heading-xl | Hero, Statement, El Socio, CTA de cierre |
| **Media** | Standard · intro→contenido 80 | 3–6 | heading-xl / heading-md | Servicios, Proceso, Ventas Inteligentes |
| **Alta** | Compact · intro→contenido 96 | 6–12 | heading-lg / title-lg / body-sm | Casos, datos, logos, comparativas |

**Reglas:** nunca dos secciones de densidad baja seguidas · después de una densidad alta va una baja o media · una página equilibrada alterna los tres niveles · **la densidad baja un nivel en móvil**.

> Esto ataca el hallazgo de ritmo plano: hoy las 10 secciones tienen la misma densidad y aproximadamente la misma altura.

---

## 32. Arquetipos de sección

Ocho. Cualquier sección futura debe ser uno de ellos o justificar por qué no.

| # | Arquetipo | Densidad | Retícula | Espaciado | Móvil |
|---|---|---|---|---|---|
| 1 | **Hero** | Baja | 7 + 1 vacía + 4 | Hero (128/96) | Apila, visual solo si demuestra |
| 2 | **Statement** | Baja | 12, texto a 8 | Spacious | `display-lg` → 38px, sin cambios |
| 3 | **Logo Wall** | Alta | Full bleed | Compact | Marquesina más rápida |
| 4 | **Split** | Media | 7/5 o 6/6 | Standard | Apila, visual después del texto |
| 5 | **Editorial Rows** | Media | 12, filas con filete | Standard | Fila → bloque apilado |
| 6 | **Bento** | Media-alta | 12, máx. 5 celdas | Standard | Apila por importancia |
| 7 | **Case Feature** | Alta | 8/4 o 12 | Standard | Media primero, luego datos |
| 8 | **Sticky Story** | Media | 5 sticky / 7 scroll | Spacious | Sticky se desactiva, todo fluye |
| 9 | **CTA** | Baja | 12, texto a 6 centrado o 7/5 | Compact | Botón a ancho completo |
| 10 | **Footer** | Alta | 12 → 4 columnas | Compact | 2 columnas → 1 |

---

## 33. Accesibilidad

**Mínimos innegociables:**

| # | Regla | Estado actual |
|---|---|---|
| 1 | Contraste **AA**: 4,5:1 texto normal, 3:1 texto ≥ 24px e interfaz | ✅ 11/12 · ❌ marquesina 2,63:1 |
| 2 | **Foco visible** en todo elemento accionable | ✅ regla global, se conserva |
| 3 | **44 × 44px** de área táctil mínima | ❌ 4 grupos por debajo |
| 4 | `prefers-reduced-motion` en las tres capas | ✅ se conserva |
| 5 | Navegación completa por teclado, orden lógico | 🟡 el carrusel de 26 puntos lo hace impracticable |
| 6 | **Nada depende solo del color** | ❌ los errores solo cambian de color |
| 7 | HTML semántico, un solo `h1`, jerarquía sin saltos | ✅ |
| 8 | `alt` en toda imagen; vacío solo si es decorativa | ✅ 34/34 |
| 9 | Vídeo: póster, controles, subtítulos en testimonios | — sin vídeo aún |
| 10 | **Ningún contenido crítico oculto al inicio** | ✅ corregido en Sprint 0.1 |
| 11 | Trampa de foco y bloqueo de scroll en menú móvil | ❌ no implementado |
| 12 | Zoom hasta 200 % sin pérdida de contenido | por verificar |

---

## 34. Presupuesto de rendimiento

### Primer viewport

| Recurso | Presupuesto | Actual |
|---|---:|---|
| Peso total transferido | **≤ 400 KB** | 610 KB ❌ |
| Imágenes | **≤ 150 KB** | 267 KB ❌ |
| Fuentes | ≤ 110 KB | 101 KB ✅ |
| JS transferido | ≤ 180 KB | 174 KB ✅ |
| Vídeo de hero | ≤ 2 MB, ≤ 12s | — |
| Peticiones | ≤ 20 | 14 ✅ |

### Reglas

1. **Ninguna imagen del primer viewport supera 60 KB.** *(El logo de la barra pesa hoy 162 KB para renderizarse a 48px.)*
2. **AVIF con respaldo WebP.** El PNG solo cuando haga falta transparencia sin alternativa.
3. **`priority` solo en el candidato a LCP.** Como máximo una imagen.
4. **`loading="lazy"` en todo lo que esté por debajo del primer viewport.**
5. **Todo vídeo lleva póster** y `preload="none"` salvo el del hero (`preload="metadata"`).
6. **Fuente móvil aparte** para vídeo y para imágenes anchas.
7. **Ninguna animación puede retrasar la LCP.** Sin excepciones.
8. **Presupuesto de motion:** máximo 3 elementos animados simultáneamente; el canvas del hero desaparece en móvil.

### Objetivos de métrica

| Métrica | Objetivo | Actual (staging) |
|---|---:|---:|
| LCP móvil | **< 2,5 s** | 4,37 s → corregido estructuralmente en Sprint 0.1 |
| CLS | < 0,1 | 0,0015 ✅ |
| TBT | < 300 ms | 384 ms 🟡 |
| Altura del documento (escritorio) | ≈ 7 pantallas | 10,5 |
| Altura del documento (móvil) | ≈ 9 pantallas | 13,5 |

---

## 35. Reglas de diseño para SEO / GEO

El sistema no puede tomar decisiones visuales que destruyan contenido semántico.

1. **Todo texto importante es HTML real.** Nunca dentro de canvas, SVG o vídeo.
2. **Un solo `h1` por página**, y contiene el mensaje principal, no una metáfora.
3. **Jerarquía sin saltos.** El tamaño visual sigue al nivel semántico: si algo se ve como un H2 pero es un H3, está mal.
4. **`heading-lg` no autoriza a usar `<h2>`** donde corresponde `<h3>`. El tamaño se adapta al contenedor; el nivel, al contenido.
5. **Las animaciones complementan; nunca sustituyen.** Un diagrama animado debe llevar su explicación en texto.
6. **Cada caso tiene texto indexable propio**: reto, qué se hizo, resultado. No solo imágenes.
7. **Los nombres de servicio son literales y visibles**: "Meta Ads", "TikTok Ads", "CRM Kommo", "producción audiovisual".
8. **La ubicación se expresa en texto** ("Cuenca, Ecuador"), no solo en un icono de mapa.
9. **Los pies de imagen son útiles**, no decorativos: describen la pieza y el cliente.
10. **El `alt` describe la imagen**, no repite el titular.
11. **Nada crítico detrás de una interacción.** Si hay que pasar el cursor o hacer clic para leerlo, no se indexa ni existe en móvil.
12. **El texto del `textContent` debe leerse bien.** *(El H1 actual se concatena como "Un marde ideas".)*

---

## 36. Tokens

Nomenclatura: `categoría.rol.variante`.

### color
```
color.surface.base          #120A26   Fondo por defecto
color.surface.raised        #1A0F3D   Sección elevada (máx. 2 por página)
color.surface.overlay       #241553   Tarjetas, campos
color.surface.deep-tech     #0D0620   Capa FENIAX
color.surface.paper         #F4F1EA   Capa El Socio (una vez en el sitio)

color.brand.base            #4B2A93   Relleno de marca
color.brand.lift            #6D4BC9   Bordes y filetes
color.accent                #F47B20   ACCIÓN. Nunca texto sobre claro
color.accent.lift           #FF9440   Hover del CTA
color.ink.accent            #A64E14   Acento textual sobre paper (5,00:1)

color.text.primary          #F4F0FE   Titulares               17,08:1
color.text.secondary        #B3A5D4   Prosa                    8,43:1
color.text.tertiary         #948AB8   Metadatos                6,00:1
color.text.neutral          #cbd5e1   Formulario y pie        13,50:1
color.text.on-accent        #1A0F3D   Sobre relleno naranja    6,53:1

color.ink.primary           #1A0F3D   Sobre paper             15,80:1
color.ink.secondary         #5B5470   Sobre paper              6,30:1

color.state.error           #FB7185   + icono + borde          7,11:1
color.state.success         #4ADE80   + icono                 10,98:1
color.state.warning         #FBBF24   + icono                 11,47:1
color.state.info            #7DD3FC   + icono                 11,48:1
```

### space
```
space.1   4      space.8   32     space.24  96
space.2   8      space.10  40     space.28  112
space.3   12     space.12  48     space.32  128
space.4   16     space.16  64     space.40  160
space.5   20     space.20  80
space.6   24
```

### container
```
container.page       1320px   Envoltorio general
container.content    1080px   Bloques que no ocupan todo el ancho
container.copy        560px   Prosa (65 caracteres @18px)
container.reading     480px   Prosa estrecha (56 caracteres)
container.bleed        100%   Marquesinas y medios
```

### grid
```
grid.columns.desktop   12       ≥ 1280
grid.columns.tablet     8       768–1279
grid.columns.mobile     4       < 768
grid.gutter.desktop    24px     Columna resultante: 88px a 1440
grid.gutter.tablet     20px
grid.gutter.mobile     16px
grid.margin.*          20/24/40/48/56/72   por breakpoint
```

### type
```
type.display-xl   80/60/44   tight    800   -0.02em
type.display-lg   64/48/38   tight    800   -0.02em
type.heading-xl   56/42/36   snug     800   -0.02em      ← H2 único
type.heading-lg   40/34/30   snug     700   -0.015em
type.heading-md   28/26/24   snug     700   -0.01em
type.title-lg     22/21/20   normal   600   -0.005em
type.title-md     18/18/17   normal   600    0
type.body-lg      18/18/17   relaxed  400    0
type.body-md      16/16/16   relaxed  400    0
type.body-sm      14/14/14   relaxed  400    0
type.label        14         normal   600    0
type.eyebrow      12         normal   600   +0.14em
type.caption      13         normal   400    0
type.button       15         normal   600   +0.01em

leading.tight 1.0 · snug 1.12 · normal 1.4 · relaxed 1.6
```

### radius · border · motion · z · breakpoint
```
radius.sm 8 · md 12 · lg 20 · xl 28 · pill 9999

border.subtle       brand.lift 15%
border.default      brand.lift 25%
border.emphasis     brand.lift 45%
border.interactive  accent 50%
border.field        brand.lift 40%
border.focus        accent 2px offset 3px
border.error        state.error 70% 2px

motion.ease.standard   cubic-bezier(0.16, 1, 0.3, 1)
motion.ease.out        cubic-bezier(0.33, 1, 0.68, 1)
motion.duration.instant 100 · fast 200 · base 320 · slow 480 · reveal 600

z.base 0 · z.raised 10 · z.sticky 30 · z.overlay 40 · z.nav 50 · z.grain 60 · z.modal 70

breakpoint.sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536
```

### section
```
section.hero       128/96    112/80   96/80
section.compact     80/64     72/56   56/48
section.standard   112/88     96/72   72/64
section.spacious   160/128   128/96   96/80
section.join        88/88     72/72   56/64
```

---

## 37. Estrategia Tailwind

Tailwind v4 con `@theme` ya está en uso y funciona. **No se cambia de framework ni se añade abstracción.**

### Enfoque

**1. `@theme` para todo lo que Tailwind sabe generar como utilidad**
Colores, espaciado, radios, fuentes, breakpoints, contenedores. Genera `bg-surface-base`, `text-text-secondary`, `p-8`, `rounded-lg` automáticamente. Es donde ya viven los tokens actuales.

**2. Custom properties para lo que no mapea a una utilidad**
Duraciones, curvas, valores de borde compuestos, escalones de superficie.

**3. Un puñado de utilidades de componente vía `@utility`**, solo para patrones que se repiten literalmente:
`container-page` · `container-copy` · `section-standard` (y variantes) · `rhythm-heading`.

**4. Ninguna capa de abstracción propia.** Nada de un sistema de "design tokens" en JS que compile a CSS. Otro frontend debe poder leer una clase y entenderla.

### Migración

**No se migra nada en este sprint.** El orden propuesto: definir los tokens en `@theme` sin borrar los actuales (conviven) → el primer componente del rediseño (Hero) nace ya con tokens nuevos → cada componente migra cuando le toque su sprint → los tokens antiguos se retiran cuando no queden referencias.

**Nunca una migración masiva de todos los componentes a la vez.**

---

## 38. Matriz de decisiones

| Sistema actual | Acción | Sistema V1 | Motivo |
|---|---|---|---|
| `max-width: 1400px` en todo | **NORMALIZAR** | `container.page` 1320 + content/copy/reading | 20px de margen óptico a 1440 |
| Márgenes 20/32 | **NORMALIZAR** | 20/24/40/48/56/72 | Margen real ≥56px en escritorio |
| 6 medidas de texto | **ELIMINAR** | 3 tokens calculados en caracteres reales | Seis decisiones locales |
| 3 tamaños de H2 (72/60/48) | **ELIMINAR** | `heading-xl` 56 + `display-lg` como statement | Jerarquía sin criterio |
| 4 tamaños de H3 | **NORMALIZAR** | `heading-lg` / `heading-md` / `title-lg` | H3 de 48 conviviendo con H2 de 48 |
| H1 144px | **NORMALIZAR** | `display-xl` 80 fluido | 144px impide escribir un mensaje comercial |
| 11 interlineados | **ELIMINAR** | 4 tokens | Sin escala |
| tracking 0,55em | **ELIMINAR** | máx. +0,16em | Se lee carácter a carácter |
| `mt-6` fijo entre título y párrafo | **ELIMINAR** | Regla 0,6× del titular | No escalaba con el breakpoint |
| `py-48` / `py-32` simétricos | **ELIMINAR** | 4 arquetipos asimétricos + regla de unión | 384px de vacío idéntico |
| Sombras ausentes | **CONSERVAR** | Sombra = excepción documentada | Decisión correcta en tema oscuro |
| Escala de radios (pill/20/12) | **CONSERVAR** | +`sm` 8 +`xl` 28 | Ya era coherente |
| Curva única de easing | **CONSERVAR** | `ease.standard` | Fortaleza real del proyecto |
| `prefers-reduced-motion` en 3 capas | **CONSERVAR** | Obligatorio | Por encima de la media |
| Paleta y contraste | **CONSERVAR** | + roles semánticos | 11/12 combinaciones en AA/AAA |
| Sora + Geist | **CONSERVAR** | Sin cambios | Bien elegidas, auto-alojadas, 101 KB |
| Phosphor | **CONSERVAR** | Sin `duotone` | Coherente y ya integrada |
| 3 superficies indistinguibles | **AÑADIR TOKEN** | 5 superficies + reglas de cambio | Medido: 1,03–1,19:1 entre ellas |
| Sin estados semánticos | **AÑADIR TOKEN** | `state.*` con portador no cromático | Un error se ve igual que un CTA |
| Sin escala de espaciado | **AÑADIR TOKEN** | `space.1` … `space.40` | Valores ad hoc por componente |
| Sin retícula declarada | **AÑADIR TOKEN** | 12/8/4 con gutters | 5 retículas internas sin relación |
| Sin sistema de botones | **AÑADIR TOKEN** | 4 niveles × 4 tamaños | Botón de 620×52 heredando ancho |
| Sin sistema de densidad | **AÑADIR TOKEN** | 3 niveles | 10 secciones con el mismo ritmo |
| Monogramas de 2 letras | **ELIMINAR** | Logotipos reales monocromos | Se repiten y no identifican |
| Marquesina del manifiesto | **ELIMINAR** | — | 2,63:1, falla AA |
| Iconos `duotone` en Servicios | **ELIMINAR** | Pieza real o nada | Relleno decorativo |

---

## 39. Prueba espacial · escritorio 1440

### A — Hero

```
Viewport                      1440
Margen exterior                 60      (cap de 1320 sobre gutter de 56)
Contenido                     1320
Retícula          12 col · gutter 24 · columna 88 · paso 112

HORIZONTAL
  Columna de texto     cols 1–7    x =   60   w = 760
  Columna vacía        col  8      x =  844   w =  88   ← asimetría deliberada
  Columna visual       cols 9–12   x =  956   w = 424
                                   fin = 1380 = 60 + 1320  ✓

VERTICAL                                        y        alto
  Barra de navegación                            0         72
  section.hero  padding-top                     72        128
  eyebrow            12/1.4                    200         17
  gap  0.35 × 80 = 28 → space.8                217         32
  H1  display-xl 80/1.0 · 3 líneas             249        240
      máx. 18 caracteres por línea @760px
  gap  0.6 × 80 = 48 → tope 40                 489         40
  lead  body-lg 18/1.6 · 2 líneas              529         58
      w = 536 (5 col) → 62 caracteres por línea
  gap  lead → CTA                              587         32
  CTA  primary lg 52 + 16 + secondary          619         52
  section.hero  padding-bottom                 671         96
                                        fin = 767

  Visual: cols 9–12 · w 424 · ratio 4:5 → h 530
          centrado vertical en el bloque 200–671
          y = 200 + (471 − 530)/2 … excede → se ajusta a ratio 4:3 → h 318
          y = 276

  Altura total del hero: 767px  (viewport 900 → 85 %)
  Ocupación del contenido: 599 de 767 = 78 %      [actual: 36 %]
```

**Sin `100vh`.** La sección mide lo que necesita, y los 133px restantes dejan asomar la siguiente: el corte invita a seguir.

### B — Servicios · Editorial Rows

```
HORIZONTAL
  Intro de sección     cols 1–6    x =  60   w = 648   (H2 a 26 car./línea)
  Lead de la intro                 x =  60   w = 560   (measure.copy, 65 car.)

  Cada fila (12 col, con filete superior)
    Índice + icono     col   1     x =  60   w =  88
    Nombre             cols  2–6   x = 172   w = 536   heading-lg 40
    Descripción        cols  7–10  x = 732   w = 424   body-md 16 → 55 car./línea
    Flecha             col  12     x = 1292  w =  28   (solo si navega)

  Se elimina el vacío de ~800px de la fila "CRM": el nombre ya no ocupa
  una columna 1fr elástica, sino 5 columnas fijas.

VERTICAL                                        y        alto
  section.standard  padding-top                  0        112
  eyebrow                                      112         17
  gap 0.35 × 56 = 20 → space.5                 129         20
  H2  heading-xl 56/1.12 · 1 línea             149         63
  gap 0.6 × 56 = 34 → space.8                  212         32
  lead  body-lg · 2 líneas                     244         58
  intro → contenido  (densidad media)          302         80
  ── filete ──                                 382          1
  Fila 1   (pt 40 · contenido 96 · pb 40)      383        176
  ── filete ──                                 559          1
  Fila 2                                       560        176
  ── filete ──                                 736          1
  Fila 3                                       737        176
  ── filete ──                                 913          1
  section.standard  padding-bottom             914         88
                                        fin = 1002        [actual: 1152]
```

### C — Caso de éxito · Case Feature

```
HORIZONTAL  (8 / 4)
  Media                cols 1–8    x =  60   w = 872   ratio 16:9 → h 491
  Panel de datos       cols 9–12   x = 956   w = 424

VERTICAL                                        y        alto
  section.standard  padding-top                  0        112
  eyebrow  (sector + ciudad)                   112         17
  gap                                          129         20
  H2  nombre del cliente  heading-xl 56        149         63
  gap                                          212         32
  lead  body-lg · 2 líneas · w 560             244         58
  intro → contenido  (densidad alta)           302         96
  Media 16:9                                   398        491
  gap                                          889         48
  Fila de resultados (3 × col 4 = 424 c/u)     937        120
      valor  display-lg 64 · etiqueta body-sm
  gap                                         1057         48
  CTA tertiary "ver el caso completo"         1105         44
  section.standard  padding-bottom            1149         88
                                        fin = 1237

  Panel de datos (cols 9–12) en sticky junto a la media:
      servicios · duración · piezas entregadas
      ancho 424 · una línea por dato · body-sm
```

---

## 40. Prueba espacial · móvil 390

### A — Hero

```
Viewport            390
Margen               20
Contenido           350
Retícula   4 col · gutter 16 · columna 78,5

ORDEN (cambia respecto a escritorio)
  1. eyebrow          2. H1          3. lead
  4. CTA primario     5. CTA secundario
  6. prueba social compacta
  ✗ El visual decorativo DESAPARECE   (principio 04: si no demuestra, no ocupa)

VERTICAL                                        y        alto
  Barra de navegación                            0         64
  section.hero  padding-top móvil               64         96
  eyebrow  12/1.4                              160         17
  gap 0.35 × 44 = 15 → space.4                 177         16
  H1  display-xl 44/1.0 · 3 líneas             193        132
      w = 350 → máx. 14 caracteres por línea
  gap 0.6 × 44 = 26 → space.6                  325         24
  lead  body-lg 17/1.6 · 3 líneas              349         82
      w = 350 → 43 caracteres por línea
  gap                                          431         32
  CTA primario   w = 350 (100 %)               463         52
  gap                                          515         16
  CTA secundario w = 350                       531         52
  gap                                          583         32
  prueba social compacta (texto + 4 logos)     615         40
  section.hero  padding-bottom móvil           655         80
                                        fin = 735

  Altura total: 735 de 844 = 87 %
  Ocupación del contenido: 575 de 735 = 78 %     [actual: 36 %]
  Quedan 109px visibles de la sección siguiente → invita a seguir
```

**Qué cambia respecto a escritorio:** el visual decorativo desaparece · los CTA pasan a ancho completo · el orden se reordena para que la acción llegue antes · se añade prueba social compacta que en escritorio vive en su propia sección · el canvas del hero no se renderiza.

### B — Servicios · móvil

```
VERTICAL                                        y        alto
  section.standard  padding-top móvil            0         72
  eyebrow                                       72         17
  gap                                           89         16
  H2  heading-xl 36/1.12 · 2 líneas            105         81
      w = 350 → 18 caracteres por línea
  gap 0.6 × 36 = 22 → space.6                  186         24
  lead  body-lg 17 · 3 líneas                  210         82
  intro → contenido móvil                      292         56
  ── filete ──                                 348          1
  Bloque 1   (pt 24 · contenido · pb 24)       349        188
      icono 24 · gap 12
      nombre  heading-md 24/1.12 · 1–2 líneas
      gap 16
      descripción body-md 16 · 3 líneas (43 car./línea)
  ── filete ──                                 537          1
  Bloque 2                                     538        188
  ── filete ──                                 726          1
  Bloque 3                                     727        188
  ── filete ──                                 915          1
  section.standard  padding-bottom móvil       916         64
                                        fin = 980
```

**La fila editorial se convierte en bloque apilado:** icono arriba, nombre, descripción. La flecha desaparece (no hay hover, y si el bloque navega, todo el bloque es el objetivo táctil).

### C — Caso · móvil

```
ORDEN
  1. eyebrow (sector)   2. nombre   3. lead
  4. MEDIA              5. resultados   6. CTA
  El panel sticky de datos se disuelve en una lista bajo los resultados

VERTICAL                                        y        alto
  section.standard  pt móvil                     0         72
  eyebrow                                       72         17
  gap                                           89         16
  H2  heading-xl 36 · 1–2 líneas               105         81
  gap                                          186         24
  lead  body-lg 17 · 3 líneas                  210         82
  intro → contenido (densidad alta móvil)      292         64
  Media 16:9  w 350 → h 197                    356        197
  gap                                          553         32
  Resultados: 3 filas apiladas (no 3 columnas) 585        192
      valor heading-lg 30 · etiqueta body-sm 14 · 64 c/u
  gap                                          777         32
  Datos: lista de 3 líneas body-sm             809         66
  gap                                          875         32
  CTA  w = 350                                 907         52
  section.standard  pb móvil                   959         64
                                        fin = 1023
```

**Los resultados no se comprimen en 3 columnas de 106px:** se apilan. Tres cifras en fila a 390px serían ilegibles.

---

## 41. Auditoría de coherencia

**¿Se usa el mismo token para cosas equivalentes?** Sí. Las seis cabeceras de sección usan ahora `container.copy`. Los tres H2 pasan a `heading-xl`. Los cuatro paddings de sección pasan a cuatro arquetipos declarados.

**¿Hay valores casi iguales que puedan unificarse?** Se unificaron: 544/576/640/672/620 → 560 y 660. Los interlineados 1,55 y 1,6 → `relaxed`. Las duraciones 300/320 → `base`; 650/700/750 → `reveal`.

**¿Algún componente obligaría a romper el sistema?**
Tres, identificados y resueltos:

| Componente | Tensión | Resolución |
|---|---|---|
| Marquesina de cuentas | Es full bleed, rompe el contenedor | `container.bleed` es un token autorizado |
| Retrato sticky de El Socio | Necesita alto mayor que su columna | Arquetipo *Sticky Story*, con su propia regla |
| Carrusel de clientes | Con 26 elementos no cabe en ningún patrón de escritorio | Cambia de patrón en móvil (§27.2); en escritorio se resuelve con jerarquía, no con paginación |

**¿El sistema deja libertad creativa?** Sí, y a propósito:
- 7 repartos de retícula autorizados, más asimetría con columna vacía.
- 3 niveles de densidad combinables con 10 arquetipos.
- 5 superficies, incluida una inversión completa a claro.
- El movimiento tiene 5 categorías y solo una está prohibida.

Lo que el sistema fija es **el espacio, la escala y la jerarquía**. Lo que deja libre es **la composición, la superficie, el material y el ritmo**. Un sistema que fijara también la composición produciría diez secciones idénticas, que es justo el problema del sitio actual.

---

## 42. Recomendaciones

1. **Implementar los tokens sin migrar nada.** Definirlos en `@theme` conviviendo con los actuales. El primer componente del rediseño nace con los nuevos.
2. **El Hero es el primer componente**, y es el que valida el sistema: usa el H1, la asimetría, la regla de ritmo, el presupuesto de caracteres y el de rendimiento a la vez.
3. **Arrancar la recopilación de material ya.** Logos de cliente, frames por caso, retrato profesional y vídeo son el cuello de botella real. Ningún sistema salva 26 imágenes de relleno.
4. **Decidir el H1 antes de diseñar el hero.** El presupuesto de 54 caracteres es una restricción de redacción, no de diseño.
5. **Los estados de formulario se implementan con icono desde el primer día.** El color no puede llevarlos solo, y añadirlo después siempre se olvida.
6. **Medir después del Hero**, no al final: el presupuesto de rendimiento del primer viewport se valida con un componente real.

---

## 43. Preguntas y blockers

### Bloquean el sprint Hero

| # | Pregunta | Por qué bloquea |
|---|---|---|
| 1 | **¿Cuál es el H1?** Máximo 54 caracteres. | El hero no se puede componer sin el titular real: 3 líneas de 18 caracteres es una restricción de redacción |
| 2 | **¿Cuáles son los dos CTA del hero?** Primario y secundario. | Definen la altura y el reparto del bloque |
| 3 | **¿Qué va en la columna visual del hero?** ¿Pieza real, vídeo, captura de CRM, o nada? | Si no hay material, la maqueta cambia a una sola columna |

### Bloquean el sistema completo

| # | Pregunta |
|---|---|
| 4 | **¿Se aprueba bajar el H1 de 144px a 80px?** Es la decisión de mayor impacto visual del documento. Justificación en §14 |
| 5 | **¿Se aprueba la superficie clara para El Socio?** Es el único cambio de zona realmente perceptible que permite la paleta |
| 6 | **¿Existen los logos de los 26 clientes en vector?** De la respuesta depende que el muro sea prueba social o siga siendo placeholder |
| 7 | **¿Hay material audiovisual real disponible?** Determina si Case Feature es viable en el próximo sprint |
| 8 | **¿Existe fotografía profesional de Daniel y del equipo?** Determina si la capa humana puede construirse |
| 9 | **¿Se confirma el orden ATRAER → CONVERTIR → ESCALAR como estructura de la home?** El sistema lo asume |

### Arrastrados de sprints anteriores

Dominio definitivo · endpoint de leads · URLs de redes · decisión sobre Sanity · imagen `og:image`.

---

*DOFI Design System V1 — especificación. No se modificó `globals.css`, ni la configuración de Tailwind, ni ningún componente. Los cambios del Sprint 0.1 permanecen intactos en el árbol de trabajo.*
