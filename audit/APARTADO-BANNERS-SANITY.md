# DOFI — Apartado propio para los botones de los banners

Pedido: un lugar en Sanity para cambiar **color y ubicación** de los botones de cada
sección, sin depender de mí.

## El problema real

Los campos ya existían (`ctaColor`, `ctaPosicionDesktop`, `ctaPosicionMobile`), pero
estaban enterrados. Y había un bug de fondo:

El menú del Studio tenía una entrada llamada **"Banners"** —agregada justo cuando dijiste
"no encuentro dónde editar las secciones"— que abría el documento *Página de inicio*
esperando caer en su pestaña "Banners". **Nunca funcionó**: el structure builder de Sanity
no tiene API para elegir con qué pestaña se abre un documento, así que la entrada caía
siempre en "Hero". El comentario del código afirmaba que sí funcionaba.

Se verificó contra la API instalada (sanity 3.99.0) antes de asumirlo: `DocumentBuilder`
expone `views()` para agregar vistas, pero nada para preseleccionar un grupo de campos.

## La solución: Banners como documento propio

Los 4 banners dejan de ser un campo de `paginaInicio` y pasan a un documento singleton
propio, `banners`. La entrada del menú ahora abre un formulario que **solo** tiene
banners: sin pestañas, sin doble puerta de entrada, sin adivinar.

```
DOFI CMS
 ├── Hero                ← la foto del Hero
 ├── Página de inicio    ← textos y CTA del Hero, capacidades
 ├── Banners             ← los 4 banners y sus botones   ◄── acá
 ├── Cuentas / Contenidos / Servicios
```

## Lo que se ve de un vistazo

La vista previa de cada banner ahora muestra su configuración sin abrirlo:

```
🟠 naranja · PC izquierda·centro (-1, +12) · Móvil centro·abajo
```

Punto de color, posición de escritorio con su ajuste fino, y posición de móvil. Los cuatro
en una lista, comparables entre sí. Abrís uno solo cuando querés cambiarlo.

## Migración

`scripts/migrar-banners-a-documento.mjs`, en tres pasos deliberadamente separados:

1. Sin flags → **dry run**, muestra qué haría.
2. `--aplicar` → **copia** el arreglo al documento nuevo. No borra el original.
3. `--limpiar` → recién después de verificar, quita el campo viejo. Se niega a correr si
   el documento nuevo está vacío.

Respaldo previo en `audit/backup-banners-antes-de-documento-propio.json`. Cada item
conserva su `_key`, que es lo que mantiene el orden 01/02/03/04.

## Un corte de servicio de unos minutos, y por qué

**Ejecuté el paso 3 antes de desplegar el código.** Durante unos minutos la web en
producción quedó sin banners: el código en vivo todavía leía
`paginaInicio.seccionesContenido`, que acababa de borrar, y cayó al respaldo de 4 bloques
vacíos.

Se detectó comprobando la web en vivo y se restauró de inmediato copiando el arreglo de
vuelta al campo viejo. La página volvió con sus 4 banners y sus 4 CTA antes de seguir.

El orden correcto era: copiar → desplegar el código → verificar → limpiar. El campo viejo
queda por ahora como copia temporal y se quita cuando el deploy de Cloudflare esté arriba
y verificado.

## De paso: el banner 01 cambió de fondo

La pieza del banner 01 pasó de fondo **naranja** a fondo **morado**. Su botón era morado
justamente porque el fondo era naranja — con la pieza nueva, el morado era el que se
fundía. Volvió a **naranja DOFI**, que es el que destaca sobre morado.

Es exactamente para esto que el color es un campo editable: cambiás la pieza, cambiás el
color del botón, sin tocar código.

## Verificación

- La web renderiza los 4 banners desde el documento nuevo, con las mismas posiciones:
  `(18,4%, 59%)`, `(76,1%, 60%)`, `(17,4%, 62%)`, `(72%, 60%)`.
- Los 4 botones en `rgb(244,123,32)` sobre texto `rgb(26,15,61)`.
- Sin overflow horizontal, reduced-motion OK, Hero / Header / Footer intactos.
- `npx tsc --noEmit` limpio en la web y en el Studio.

## Archivos

- `studio/schemaTypes/banners.ts` — **nuevo**, el documento singleton.
- `studio/schemaTypes/index.ts` — registro.
- `studio/deskStructure.ts` — la entrada "Banners" ahora abre el documento nuevo.
- `studio/schemaTypes/paginaInicio.ts` — se quita el campo y su pestaña.
- `studio/schemaTypes/objects/seccionContenido.ts` — vista previa con color y posición.
- `src/lib/sanity.ts` — el GROQ lee de `*[_type == "banners"][0]`.
- `scripts/migrar-banners-a-documento.mjs` — **nuevo**, la migración en tres pasos.
- `scripts/sembrar-cta-banners.mjs` — apunta al documento nuevo; banner 01 a naranja.
