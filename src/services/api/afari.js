const baseUrl = 'http://afari.pe/intranet/api/AfariService/';

export const urls = {
  login: baseUrl + 'Login',
  getEdificios: baseUrl + 'GetEdificios',
  getDepartamentos: baseUrl + 'GetDepartamentos',
  getUnidadTiempo: baseUrl + 'GetUnidadTiempo',
  getUnidadTiempoActual: baseUrl + 'GetUnidadTiempoActual',
  getEstadoEdificio: baseUrl + 'GetEstadoEdificio',
  getCerrarCuotas: baseUrl + 'GetCerrarCuotas',
  getRecibosMantenimiento: baseUrl + 'GetRecibosMantenimiento',
  getReciboMantenimientoPorId: baseUrl + 'GetReciboPorId',
  getCuadroMorosidad: baseUrl + 'GetCuadroMorosidad',
  getCuotaPorDepartamento: baseUrl + 'GetCuotaPorDepartamento',
  getPropietarios: baseUrl + 'GetPropietariosPorEdificio',
  getNoticias: baseUrl + 'GetNoticias',
  getObligacionesLaborales: baseUrl + 'GetObligacionesLaborales',
  getCertificadoEquipos: baseUrl + 'GetCertificadosEquipos',
  getCronogramaMantenimiento: baseUrl + 'GetCronogramasMantenimientos',
  getCronogramaPdf: baseUrl + 'GetCronograma',
  getEstadoCuenta: baseUrl + 'GetEstadosCuentaBancario',
  getTrabajadores: baseUrl + 'GetTrabajadores',
  getAdmMenu: baseUrl + 'GetAdmMenu',
  getNormasConvivencia: baseUrl + 'GetNormasConvivencia',
  getIngresosGastos: baseUrl + 'GetIngresosGastos',
  getComprobantesPago: baseUrl + 'GetComprobantesPago',
  getDetalleEdificio: baseUrl + 'GetDetalleEdificio',
  getPropiertarioInquilino: baseUrl + 'GetPropInqPorEdificio',
  postEmail: baseUrl + 'EnviarCorreoMasivo',
  web: {
    getDepartamentos: baseUrl + 'GetWebDepartamentos',
    getProvincias: baseUrl + 'GetWebProvincias',
    getDistritos: baseUrl + 'GetWebDistritos',
    getVentaAlquiler: baseUrl + 'GetVentaAlquiler'
  }
};
