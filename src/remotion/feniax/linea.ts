import type { ChatDemo } from "@/lib/chat-demo";
import { ritmo } from "./tema";

/**
 * Linea de tiempo de una demo de WhatsApp, calculada SOLO a partir de los
 * mensajes. Es una funcion pura: la usan la composicion (para saber que
 * dibujar en cada cuadro) y el reproductor de la pagina (para saber cuanto
 * dura el "video"). Asi una conversacion mas larga en el Studio da un video
 * mas largo, sin tocar codigo.
 *
 * Por mensaje:
 *  - cliente: teclea en la barra de abajo (a ritmo humano) y envia.
 *  - negocio: la IA "escribe..." un instante y la respuesta aparece; despues
 *    queda el tiempo de leerla.
 * Al final: el aviso de lo que quedo registrado en el CRM y una salida corta
 * para que el bucle no corte en seco.
 */

export type TramoTecleo = { indice: number; desde: number; hasta: number };
export type TramoEscribiendo = { desde: number; hasta: number };

export type LineaChat = {
  /** Cuadro en que aparece cada burbuja, en el orden de los mensajes. */
  aparece: number[];
  /** Cuadro en que el negocio "lee" cada mensaje del cliente (palomitas azules). */
  leido: number[];
  tecleo: TramoTecleo[];
  escribiendo: TramoEscribiendo[];
  /** Cuadro en que entra el aviso del CRM (null si la demo no tiene aviso). */
  aviso: number | null;
  /** Cuadro en que empieza la salida. */
  salida: number;
  total: number;
};

const entre = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function calcularLinea(chat: Pick<ChatDemo, "mensajes" | "aviso">, fps: number): LineaChat {
  const s = (segundos: number) => Math.round(segundos * fps);
  const aparece: number[] = [];
  const leido: number[] = [];
  const tecleo: TramoTecleo[] = [];
  const escribiendo: TramoEscribiendo[] = [];

  let t = s(ritmo.arranque);

  chat.mensajes.forEach((m, i) => {
    const largo = m.texto.length;
    if (m.de === "cliente") {
      // Una foto sola se "adjunta": no hay nada que teclear.
      const dura = largo > 0 ? s(entre(largo * ritmo.tecleoPorCaracter, ritmo.tecleoMin, ritmo.tecleoMax)) : s(0.5);
      tecleo.push({ indice: i, desde: t, hasta: t + dura });
      t += dura + 2;
      aparece.push(t);
      leido.push(Number.POSITIVE_INFINITY);
      t += s(ritmo.trasEnviar);
    } else {
      const dura = s(entre(largo * ritmo.escribiendoPorCaracter, ritmo.escribiendoMin, ritmo.escribiendoMax));
      // El negocio lee los mensajes pendientes del cliente al empezar a escribir.
      for (let k = 0; k < i; k++) {
        if (chat.mensajes[k].de === "cliente" && leido[k] === Number.POSITIVE_INFINITY) leido[k] = t;
      }
      escribiendo.push({ desde: t, hasta: t + dura });
      t += dura;
      aparece.push(t);
      leido.push(Number.POSITIVE_INFINITY);
      const lectura =
        entre(largo * ritmo.lecturaPorCaracter, ritmo.lecturaMin, ritmo.lecturaMax) + (m.imagen ? ritmo.lecturaFoto : 0);
      t += s(lectura);
    }
  });

  // Mensajes del cliente que quedaron al final sin respuesta: se leen igual.
  leido.forEach((v, k) => {
    if (v === Number.POSITIVE_INFINITY && chat.mensajes[k]?.de === "cliente") leido[k] = t;
  });

  let aviso: number | null = null;
  if (chat.aviso) {
    t += s(ritmo.antesDelAviso);
    aviso = t;
    t += s(ritmo.aviso);
  } else {
    t += s(1.2);
  }

  const salida = t;
  const total = t + s(ritmo.salida);
  return { aparece, leido, tecleo, escribiendo, aviso, salida, total: Math.max(total, s(3)) };
}
