"use client";

import { useState } from "react";
import { ChartLineUp } from "@phosphor-icons/react";
import { CarruselGiros } from "@/components/marketing/CarruselGiros";
import { metricasParaGiro } from "@/lib/metricas-demo";
import type { GiroConMetricas } from "@/lib/trafico";
import { DemoMetricas } from "./DemoMetricas";

/**
 * Las dos columnas de Clientes en Tráfico/Ads: el carrusel de giros (el
 * mismo de Marketing Digital, en modo controlado) y, donde allá va el video,
 * el panel de Meta Ads de ejemplo del giro abierto.
 *
 * UN SOLO ESTADO para las dos columnas: abrir "Gastronomía" en el carrusel
 * cambia el panel al de un restaurante (CPR, CTR, CPA, alcance,
 * visualizaciones y frecuencia con las cifras de ese giro) y la campaña
 * vuelve al dia 1.
 *
 * RECORRIDO AUTOMATICO (si "Pasar solo al siguiente giro" esta activo):
 * cuando una campaña llega al dia 30, se abre el giro siguiente. En cuanto el
 * visitante elige un giro, se queda en ese. El carrusel no rota por su
 * cuenta (rotacion={false}): el ritmo lo marca el panel, no un reloj.
 *
 * El carrusel solo cambia con clic, toque, teclado o deslizando
 * (seleccionPorCursor={false}): cada cambio reinicia el panel de al lado, y
 * llevar el mouse hacia el panel no puede ir abriendo giros en el camino.
 *
 * EN ESCRITORIO EL PANEL SE MIDE POR EL ALTO: la sección mide una pantalla
 * (MarcoClientes) y el panel toma el alto completo de su columna; su ancho
 * sale de su proporción (2:3). Así se ve entero en una laptop de 730 px de
 * alto, sin cortarse abajo como antes.
 */
export function ClientesMetricas({
  giros,
  rotacion,
  animar,
}: {
  giros: GiroConMetricas[];
  rotacion: boolean;
  animar: boolean;
}) {
  const [activo, setActivo] = useState(0);
  const [elegido, setElegido] = useState(false);
  const n = giros.length;
  const giro = n > 0 ? giros[Math.min(activo, n - 1)] : null;
  // Sin giros (ni propios ni de Marketing Digital) el panel igual muestra una
  // campaña de ejemplo: la generica.
  const datos = giro?.metricas ?? metricasParaGiro("Servicios", "servicios");
  const clave = giro?.key ?? "generico";
  const onTermina = rotacion && !elegido && n > 1 ? () => setActivo((a) => (a + 1) % n) : undefined;

  const etiqueta = (
    <p className="flex shrink-0 items-center justify-center gap-2 font-sans text-sm font-semibold text-ink-subtle">
      <ChartLineUp size={18} weight="duotone" aria-hidden="true" className="text-accent" />
      <span>
        Panel de Meta Ads
        {giro ? (
          <>
            {" "}
            · <span className="text-ink">{giro.nombre}</span>
          </>
        ) : null}
      </span>
    </p>
  );

  return (
    // 3fr / 2fr: el panel no necesita mas ancho que el que le da su alto, y el
    // carrusel aprovecha el resto. Por debajo de lg el panel va DENTRO del
    // carrusel, entre los giros y sus logos (prop `intermedio`), y la columna
    // derecha se oculta. Las dos instancias no cargan Remotion a la vez: la
    // oculta (display: none) nunca entra en pantalla.
    <div className="grid grid-cols-1 gap-12 lg:h-full lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
      <div className="min-w-0 lg:h-full lg:min-h-0">
        <CarruselGiros
          giros={giros}
          rotacion={false}
          animar={animar}
          activo={activo}
          seleccionPorCursor={false}
          onCambio={(i, porVisitante) => {
            setActivo(i);
            if (porVisitante) setElegido(true);
          }}
          intermedio={
            <div className="mb-2 mt-10 lg:hidden">
              <div className="mb-4">{etiqueta}</div>
              <DemoMetricas
                datos={datos}
                semilla={clave}
                nombreGiro={giro?.nombre ?? "servicios"}
                clave={clave}
                onTermina={onTermina}
                className="mx-auto w-full max-w-[380px]"
              />
            </div>
          }
        />
      </div>

      <div className="hidden min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-3">
        {etiqueta}
        <DemoMetricas
          datos={datos}
          semilla={clave}
          nombreGiro={giro?.nombre ?? "servicios"}
          clave={clave}
          onTermina={onTermina}
          ajustarAlto
          className="min-h-0 flex-1"
        />
      </div>
    </div>
  );
}
