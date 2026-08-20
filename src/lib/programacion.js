export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Ordena las horas tomando las 06:00 como inicio del día radial y las 02:00 (del día siguiente) como cierre.
export function minutosDesdeLas6(hora) {
  const [h, m] = hora.split(':').map(Number);
  return ((h * 60 + m - 6 * 60) + 24 * 60) % (24 * 60);
}
