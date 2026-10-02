"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRight, CheckCircle, WhatsappLogo } from "@phosphor-icons/react";
import { clasesBoton, estiloBoton } from "@/components/BotonCta";
import { SERVICIOS, TEXTO_CTA, mensajeFormulario, serviciosDeUrl, type ClaveServicio } from "@/lib/cta";
import { createWhatsAppUrl } from "@/lib/whatsapp";

/**
 * El formulario de contacto (/contactanos): al que llevan los botones de los
 * banners finales de todas las paginas.
 *
 * CUATRO CAMPOS, ni uno mas: nombres y apellidos, servicio (varios a la vez),
 * detalle de lo que necesita (opcional: es el unico que se puede dejar vacio)
 * y nombre del negocio.
 *
 * AL ENVIAR, WHATSAPP: no hay servidor de por medio. Se arma el mensaje con lo
 * que la persona escribio (mensajeFormulario, src/lib/cta.ts) y se abre
 * WhatsApp con el chat de DOFI y el mensaje ya escrito; solo falta darle
 * enviar. Si el navegador bloquea la ventana, queda un enlace para abrirla.
 *
 * El servicio llega marcado segun la pagina de la que viene el botón
 * (?servicio=pauta). Se lee al montar, asi la pagina sigue siendo estatica.
 */

type Errores = { nombre?: string; servicios?: string; negocio?: string };

const CAMPO =
  "w-full rounded-[14px] border border-white/20 bg-white/[0.07] px-4 py-3.5 font-sans text-base text-foam placeholder:text-fog transition-colors duration-200 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";
const ETIQUETA = "font-display text-sm font-semibold text-foam";

export function FormularioContacto() {
  const id = useId();
  const [servicios, setServicios] = useState<ClaveServicio[]>([]);
  const [errores, setErrores] = useState<Errores>({});
  const [enlace, setEnlace] = useState<string | null>(null);

  // El servicio de la pagina de origen llega ya marcado.
  useEffect(() => {
    const marcados = serviciosDeUrl(new URLSearchParams(window.location.search).get("servicio") ?? undefined);
    if (marcados.length > 0) setServicios(marcados);
  }, []);

  function alternar(clave: ClaveServicio) {
    setServicios((actual) => (actual.includes(clave) ? actual.filter((c) => c !== clave) : [...actual, clave]));
    setErrores((e) => ({ ...e, servicios: undefined }));
  }

  function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const negocio = String(datos.get("negocio") ?? "").trim();
    const detalle = String(datos.get("detalle") ?? "").trim();

    const siguiente: Errores = {};
    if (nombre.length < 2) siguiente.nombre = "Escribe tu nombre y apellido.";
    if (servicios.length === 0) siguiente.servicios = "Elige al menos un servicio.";
    if (negocio.length < 2) siguiente.negocio = "Escribe el nombre de tu negocio.";
    setErrores(siguiente);
    if (Object.keys(siguiente).length > 0) return;

    const nombresServicios = SERVICIOS.filter((s) => servicios.includes(s.clave)).map((s) => s.nombre);
    const url = createWhatsAppUrl({ message: mensajeFormulario({ nombre, negocio, servicios: nombresServicios, detalle }) });
    setEnlace(url);
    // Dentro del gesto del clic: los navegadores no bloquean la ventana.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (enlace) {
    return (
      <div role="status" className="flex flex-col items-center gap-5 py-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent-lift">
          <CheckCircle size={36} weight="fill" aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foam md:text-3xl">¡Listo! Te llevamos a WhatsApp</h2>
        <p className="max-w-[40ch] font-sans text-base leading-relaxed text-mist">
          Abrimos el chat con tu mensaje ya escrito: solo falta que le des enviar. Si no se abrió, usa el botón.
        </p>
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className={clasesBoton("normal")}
          style={estiloBoton("naranja")}
        >
          <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
          Abrir WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={alEnviar} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-nombre`} className={ETIQUETA}>
          Nombres y Apellidos
        </label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre completo"
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? `${id}-err-nombre` : undefined}
          className={CAMPO}
        />
        {errores.nombre && (
          <p id={`${id}-err-nombre`} className="font-sans text-sm text-accent-lift">
            {errores.nombre}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-3" aria-describedby={errores.servicios ? `${id}-err-servicios` : undefined}>
        <legend className={`${ETIQUETA} mb-1`}>
          Servicio que requiere <span className="font-sans font-normal text-fog">(puedes elegir varios)</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {SERVICIOS.map((s) => (
            <div key={s.clave}>
              <input
                id={`${id}-${s.clave}`}
                type="checkbox"
                name="servicio"
                value={s.clave}
                checked={servicios.includes(s.clave)}
                onChange={() => alternar(s.clave)}
                className="peer sr-only"
              />
              <label
                htmlFor={`${id}-${s.clave}`}
                className="inline-flex min-h-[48px] cursor-pointer select-none items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-5 py-2.5 font-display text-[15px] font-semibold text-foam transition-colors duration-200 hover:border-accent/70 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-abyss peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-abyss"
              >
                {s.nombre}
              </label>
            </div>
          ))}
        </div>
        {errores.servicios && (
          <p id={`${id}-err-servicios`} className="font-sans text-sm text-accent-lift">
            {errores.servicios}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-detalle`} className={ETIQUETA}>
          Detalle de lo que necesita <span className="font-sans font-normal text-fog">(opcional)</span>
        </label>
        <textarea
          id={`${id}-detalle`}
          name="detalle"
          rows={4}
          placeholder="Cuéntanos en pocas palabras qué quieres lograr"
          className={`${CAMPO} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-negocio`} className={ETIQUETA}>
          Nombre del Negocio
        </label>
        <input
          id={`${id}-negocio`}
          name="negocio"
          type="text"
          autoComplete="organization"
          placeholder="Cómo se llama tu negocio"
          aria-invalid={Boolean(errores.negocio)}
          aria-describedby={errores.negocio ? `${id}-err-negocio` : undefined}
          className={CAMPO}
        />
        {errores.negocio && (
          <p id={`${id}-err-negocio`} className="font-sans text-sm text-accent-lift">
            {errores.negocio}
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-col items-start gap-3">
        <button type="submit" className={`${clasesBoton("normal")} w-full sm:w-auto`} style={estiloBoton("naranja")}>
          {TEXTO_CTA}
          <ArrowRight size={20} weight="bold" aria-hidden="true" className="shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-1" />
        </button>
        <p className="font-sans text-sm text-fog">Al enviarlo se abre WhatsApp con tu mensaje listo para mandar.</p>
      </div>
    </form>
  );
}
