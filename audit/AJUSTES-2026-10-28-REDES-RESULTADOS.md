# Ajuste del 2026-10-28 · Botones de redes del header

Publicado con el commit `9c04640`; el build de Cloudflare terminó bien. En vivo, el HTML del Home ya trae los tres enlaces.

Pedido: que los botones de redes de la parte superior lleven a los perfiles de DOFI.

## Qué se hizo
- **Causa:** los tres botones del header (Facebook, Instagram y TikTok) no llevaban a ningún lado. Sus direcciones esperaban una variable de entorno que nunca se configuró.
- **Ahora** apuntan a los perfiles entregados por el propietario y abren en una pestaña nueva:
  - **Facebook:** https://www.facebook.com/profile.php?id=100090026347946
  - **Instagram:** https://www.instagram.com/dofiagenciacreativa
  - **TikTok:** https://www.tiktok.com/@dofiagenciacreativa
- **Dónde:** las direcciones quedan en `src/config/company.ts`, como valor por defecto. Si algún día se define la variable de entorno, esta sigue mandando.

## Efecto en el pie de página
- El pie ya tenía preparados los íconos de Instagram, TikTok y LinkedIn, pero solo los muestra cuando la red tiene dirección.
- Ahora aparecen **Instagram y TikTok**, centrados debajo del texto de derechos reservados.
- **LinkedIn** sigue oculto: no hay perfil confirmado.
- **Facebook** no forma parte de la lista del pie, que se definió así en un ajuste anterior. Se puede agregar si se pide.

## Validación
- `tsc` sin errores y `next build` correcto (44 páginas).
- **En el build local:** los tres enlaces del header en computadora y en el menú del celular, y los dos del pie, apuntan a las direcciones correctas.
