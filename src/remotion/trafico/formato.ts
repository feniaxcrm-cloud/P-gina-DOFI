/**
 * Formato de numeros del panel, a la manera de Ecuador: coma decimal y punto
 * de miles ("$0,85", "126.500", "2,8%"). A mano y no con Intl: Intl cambia
 * segun el motor (en es-EC un numero de 4 cifras no lleva el punto) y el
 * panel tiene que verse igual en todos los navegadores.
 */

const miles = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const entero = (n: number) => miles(n);
export const moneda = (n: number) => `$${n.toFixed(2).replace(".", ",")}`;
/** Dolares sin centavos: la inversion acumulada ($450). */
export const dolares = (n: number) => `$${miles(n)}`;
export const porcentaje = (n: number) => `${n.toFixed(1).replace(".", ",")}%`;
export const decimal = (n: number) => n.toFixed(1).replace(".", ",");
