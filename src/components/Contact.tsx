"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import { whatsappUrl } from "@/lib/whatsapp";
import {
  validarContacto,
  extraerUtm,
  type ContactErrors,
  type Utm,
} from "@/lib/contact/validation";

/** idle -> sending -> (sent | error). "error" ya no es un estado unico:
 *  el mensaje cambia segun por que fallo, pero NUNCA se muestra exito si la
 *  entrega no fue confirmada por el servidor. */
type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-[12px] border border-brand-lift/40 bg-surface/70 px-4 py-3 font-sans text-base text-foam placeholder:text-fog focus:border-accent focus:outline-none";

/**
 * titulo/textoBoton/enlace llegan como props (con valores por defecto) en
 * vez de fetch propio: este es un componente "use client" por el manejo
 * del formulario, y ahi no se puede hacer async/await. page.tsx trae
 * paginaInicio.secciones de Sanity (ver src/lib/sanity.ts) y le pasa a
 * esta seccion la parte "seccionCierre".
 *
 * WHATSAPP: el enlace por defecto ya NO se escribe a mano aqui. Sale de
 * createWhatsAppUrl() sobre el numero de src/config/company.ts. Antes este
 * archivo tenia escrito wa.me/593999999999 —un numero inventado— mientras
 * el pie mostraba el numero real.
 *
 * ENTREGA: el estado "sent" solo se activa cuando /api/contacto responde
 * 200. Si el destino no esta configurado o falla, se muestra el error y se
 * ofrece WhatsApp como salida.
 */
type ContactProps = {
  titulo?: string;
  textoBoton?: string;
  enlace?: string;
};

export function Contact({
  titulo = "Hablemos",
  textoBoton = "Escribir por WhatsApp",
  enlace = whatsappUrl,
}: ContactProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [errorMsg, setErrorMsg] = useState("");

  // Atribucion: se lee de la URL al montar, no se pide al usuario.
  // useRef y no useState porque no repinta nada; solo viaja con el envio.
  const utm = useRef<Utm>({});
  useEffect(() => {
    utm.current = extraerUtm(window.location.search);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Se guarda la referencia antes de cualquier await: React limpia
    // e.currentTarget al terminar el handler sincrono.
    const form = e.currentTarget;
    const data = new FormData(form);

    // Misma regla que aplica el servidor (lib/contact/validation.ts), asi
    // el navegador y la API no pueden discrepar.
    const { valid, errors: next, data: limpio } = validarContacto(
      Object.fromEntries(data)
    );

    setErrors(next);
    if (!valid) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...limpio, utm: utm.current }),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      // Cada fallo dice algo distinto. Ninguno dice "recibido".
      const cuerpo = await res.json().catch(() => null);
      const codigo = cuerpo?.error as string | undefined;

      if (res.status === 400 && cuerpo?.errors) {
        setErrors(cuerpo.errors as ContactErrors);
        setStatus("idle");
        return;
      }

      setStatus("error");
      setErrorMsg(
        codigo === "delivery_not_configured"
          ? "El envío por formulario no está disponible en este momento. Escríbenos por WhatsApp y te respondemos igual."
          : res.status === 429
            ? "Demasiados intentos seguidos. Espera un momento o escríbenos por WhatsApp."
            : "No se pudo enviar tu mensaje. Inténtalo por WhatsApp mientras lo revisamos."
      );
    } catch {
      setStatus("error");
      setErrorMsg(
        "No se pudo enviar tu mensaje. Revisa tu conexión o escríbenos por WhatsApp."
      );
    }
  };

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-abyss py-28 md:py-36"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_100%,#3B1F7A_0%,transparent_60%)]"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <p className="mb-6 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            {titulo}
          </p>
          <h2 className="max-w-[16ch] font-display text-4xl font-extrabold leading-[1.03] tracking-tighter text-foam md:text-6xl">
            Tu próxima campaña empieza aquí
          </h2>
          <p className="mt-6 max-w-[48ch] font-sans text-lg leading-relaxed text-mist">
            Cuéntanos qué vendes y a quién. En la primera llamada sales con una
            ruta clara, con o sin nosotros.
          </p>

          <a
            href={enlace}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-brand-lift/45 bg-brand/25 px-6 py-3.5 font-display text-sm font-semibold text-foam backdrop-blur-md transition-colors duration-300 hover:border-accent/70 hover:bg-brand/45"
          >
            <WhatsappLogo size={20} weight="fill" className="text-accent" />
            {textoBoton}
          </a>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="nombre"
                className="font-display text-sm font-semibold text-foam"
              >
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                placeholder="Nombre y apellido"
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby={errors.nombre ? "err-nombre" : undefined}
                className={fieldClass}
              />
              {errors.nombre && (
                <p id="err-nombre" className="font-sans text-sm text-accent">
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="empresa"
                className="font-display text-sm font-semibold text-foam"
              >
                Marca o empresa
              </label>
              <input
                id="empresa"
                name="empresa"
                type="text"
                autoComplete="organization"
                placeholder="Opcional"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="font-display text-sm font-semibold text-foam"
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@empresa.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-email" : "help-email"}
              className={fieldClass}
            />
            {errors.email ? (
              <p id="err-email" className="font-sans text-sm text-accent">
                {errors.email}
              </p>
            ) : (
              <p id="help-email" className="font-sans text-sm text-fog">
                Respondemos en menos de 24 horas hábiles.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="mensaje"
              className="font-display text-sm font-semibold text-foam"
            >
              Qué necesitas
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              placeholder="Lanzamiento, contenido mensual, CRM, o todo junto"
              aria-invalid={Boolean(errors.mensaje)}
              aria-describedby={errors.mensaje ? "err-mensaje" : undefined}
              className={`${fieldClass} resize-y`}
            />
            {errors.mensaje && (
              <p id="err-mensaje" className="font-sans text-sm text-accent">
                {errors.mensaje}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-display text-sm font-semibold tracking-wide text-[#1A0F3D] transition-colors duration-300 hover:bg-accent-lift active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Enviando" : "Iniciar proyecto"}
          </button>

          <div aria-live="polite" className="min-h-[1.5rem]">
            {status === "sent" && (
              <p className="flex items-center gap-2 font-sans text-sm text-foam">
                <CheckCircle size={18} weight="fill" className="text-accent" />
                Mensaje recibido. Te contactamos muy pronto.
              </p>
            )}
            {status === "error" && (
              <p className="flex items-start gap-2 font-sans text-sm text-foam">
                <WarningCircle
                  size={18}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-accent"
                />
                <span>
                  {errorMsg}{" "}
                  <a href={enlace} className="underline hover:text-accent">
                    Abrir WhatsApp
                  </a>
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
