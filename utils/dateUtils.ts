export const obtenerMes = (fechaStr: string) => {
  const fecha = new Date(fechaStr);
  const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return meses[fecha.getMonth()];
}

export const obtenerDia = (fechaStr: string) => {
  const fecha = new Date(fechaStr);
  return String(fecha.getDate()).padStart(2, '0');
}

export const obtenerHora = (fechaStr: string) => {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const obtenerFechaCompleta = (fechaStr: string) => {
  const fecha = new Date(fechaStr);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()} ${obtenerHora(fechaStr)}`;
}