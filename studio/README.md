# DOFI CMS (Sanity Studio)

Panel de administración de **Cuentas**, **Contenidos** y **Servicios** de la web de DOFI.
Es un proyecto independiente: no comparte dependencias ni build con la web (Next.js en
`../src`), así que instalarlo o desplegarlo nunca puede romper el deploy en Cloudflare
Workers.

## Primera vez

```bash
npm install
npx sanity login      # abre el navegador, inicia sesión con tu cuenta Sanity
npx sanity init        # crea el proyecto si no existe uno, o pide el projectId de uno existente
cp .env.example .env.local
# completá SANITY_STUDIO_PROJECT_ID y SANITY_STUDIO_DATASET en .env.local
```

## Uso diario

```bash
npm run dev      # Studio local en http://localhost:3333
npm run deploy    # publica el Studio en https://<tu-proyecto>.sanity.studio
```

Los editores de contenido entran directamente a la URL que da `npm run deploy` — no
necesitan instalar nada ni tocar este repo.

## Después de desplegar

1. En `manage.sanity.io` → tu proyecto → **API → Webhooks**, crear un webhook hacia
   `https://<dominio-de-la-web>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`,
   disparado en `Create`/`Update`/`Delete` de los tipos `cuenta`, `contenido` y
   `servicio`. Así la web se actualiza sola al publicar, sin redeploy.
2. En `manage.sanity.io` → **API → Tokens**, crear un token con permiso de escritura
   para poder correr el script de migración (`npm run seed:sanity` en la raíz del
   repo de la web) una sola vez.
3. Cargar `SANITY_PROJECT_ID`, `SANITY_DATASET` y `SANITY_REVALIDATE_SECRET` en las
   variables de entorno de Cloudflare Workers de la web (no acá).
