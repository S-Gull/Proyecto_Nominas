/**
 * ====================================================================
 * SISTEMA DE CÁLCULOS DE NÓMINA VENEZOLANA
 * Archivo: calculos.js
 * ====================================================================
 */

class CalculosNomina_vc_ga {
  constructor() {
    // Constantes para cálculos
    this.DIAS_MES = 30;
    this.HORAS_DIA = 8;
    this.DIAS_SEMANA_LABORAL = 5;
    this.SEMANAS_ANNO = 52;
    this.MESES_ANNO = 12;
    this.DIAS_MINIMOS_VACACIONES = 15;
  }

  // ====================================================================
  // FUNCIONES AUXILIARES
  // ====================================================================

  /**
   * Convierte valor a número seguro
   */
  safeNumber(value, defaultValue = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Redondea a 2 decimales
   */
  round(value) {
    return Math.round(value * 100) / 100;
  }

  /**
   * Calcula días trabajados en un mes
   */
  calcularDiasTrabajados(fechaInicio, fechaFin = null) {
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    const diffTime = Math.abs(fin - inicio);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Obtiene cantidad de lunes en un mes específico
   */
  obtenerLunesEnMes(año, mes) {
    let lunes = 0;
    const diasEnMes = new Date(año, mes, 0).getDate();
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(año, mes - 1, dia);
      if (fecha.getDay() === 1) lunes++;
    }
    return lunes;
  }

  /**
   * Calcula años de antigüedad
   */
  calcularAntiguedad(fechaIngreso) {
    const ingreso = new Date(fechaIngreso);
    const hoy = new Date();
    return Math.floor((hoy - ingreso) / (365.25 * 24 * 60 * 60 * 1000));
  }

  // ====================================================================
  // 1. DEVENGOS - SALARIOS BASE
  // ====================================================================

  /**
   * Calcula salario base mensual completo
   */
  calcularSueldoBaseMensual(sueldoBase) {
    return this.round(this.safeNumber(sueldoBase));
  }

  /**
   * Calcula salario variable
   */
  calcularSueldoVariable(sueldoVariable) {
    return this.round(this.safeNumber(sueldoVariable));
  }

  /**
   * Calcula salario proporcional por días trabajados
   */
  calcularSalarioPorDias(sueldoBase, diasTrabajados, diasDelMes = 30) {
    const factorDia = this.safeNumber(sueldoBase) / diasDelMes;
    return this.round(factorDia * this.safeNumber(diasTrabajados));
  }

  /**
   * Calcula salario por horas trabajadas
   */
  calcularSalarioPorHoras(sueldoBase, horasTrabajadas) {
    const factorHora = this.safeNumber(sueldoBase) / (this.DIAS_MES * this.HORAS_DIA);
    return this.round(factorHora * this.safeNumber(horasTrabajadas));
  }

  // ====================================================================
  // 1. DEVENGOS - BONIFICACIONES
  // ====================================================================

  /**
   * Bonificación de alimentación (Cesta Ticket) - Monto fijo
   */
  calcularBonificacionAlimentacion(montoFijo) {
    return this.round(this.safeNumber(montoFijo));
  }

  /**
   * Bono de transporte
   */
  calcularBonoTransporte(montoFijo) {
    return this.round(this.safeNumber(montoFijo));
  }

  /**
   * Bonificación nocturna (25% adicional del salario base)
   */
  calcularBonificacionNocturna(sueldoBase, horasNocturnas) {
    const factorHora = this.safeNumber(sueldoBase) / (this.DIAS_MES * this.HORAS_DIA);
    const recargoNocturno = factorHora * 0.25; // 25% adicional
    return this.round((factorHora + recargoNocturno) * this.safeNumber(horasNocturnas));
  }

  /**
   * Bonificación por antigüedad
   */
  calcularBonificacionAntiguedad(sueldoBase, fechaIngreso, porcentajePorAño = 0.02) {
    const años = this.calcularAntiguedad(fechaIngreso);
    const porcentajeTotal = años * porcentajePorAño;
    return this.round(this.safeNumber(sueldoBase) * porcentajeTotal);
  }

  // ====================================================================
  // 1. DEVENGOS - HORAS EXTRAS
  // ====================================================================

  /**
   * Horas extras diurnas (50% adicional)
   */
  calcularHorasExtrasDiurnas(sueldoBase, horasExtras) {
    const factorHora = this.safeNumber(sueldoBase) / (this.DIAS_MES * this.HORAS_DIA);
    return this.round(factorHora * 1.5 * this.safeNumber(horasExtras));
  }

  /**
   * Horas extras nocturnas (75% adicional)
   */
  calcularHorasExtrasNocturnas(sueldoBase, horasExtras) {
    const factorHora = this.safeNumber(sueldoBase) / (this.DIAS_MES * this.HORAS_DIA);
    return this.round(factorHora * 1.75 * this.safeNumber(horasExtras));
  }

  /**
   * Horas extras en días feriados (100% adicional)
   */
  calcularHorasExtrasFeriados(sueldoBase, horasExtras) {
    const factorHora = this.safeNumber(sueldoBase) / (this.DIAS_MES * this.HORAS_DIA);
    return this.round(factorHora * 2.0 * this.safeNumber(horasExtras));
  }

  /**
   * Horas extras nocturnas en feriados (125% adicional)
   */
  calcularHorasExtrasNocturnasFeriados(sueldoBase, horasExtras) {
    const factorHora = this.safeNumber(sueldoBase) / (this.DIAS_MES * this.HORAS_DIA);
    return this.round(factorHora * 2.25 * this.safeNumber(horasExtras));
  }

  // ====================================================================
  // 1. DEVENGOS - OTROS
  // ====================================================================

  /**
   * Comisiones por ventas
   */
  calcularComisiones(montoVentas, porcentajeComision) {
    return this.round(this.safeNumber(montoVentas) * (this.safeNumber(porcentajeComision) / 100));
  }

  /**
   * Incentivos por productividad
   */
  calcularIncentivos(montoFijo) {
    return this.round(this.safeNumber(montoFijo));
  }

  /**
   * Bonos especiales
   */
  calcularBonosEspeciales(montoFijo) {
    return this.round(this.safeNumber(montoFijo));
  }

  /**
   * Reintegros de gastos
   */
  calcularReintegros(montoGastos) {
    return this.round(this.safeNumber(montoGastos));
  }

  // ====================================================================
  // 2. DEDUCCIONES - APORTES LEGALES OBLIGATORIOS
  // ====================================================================

  /**
   * IVSS (Seguro Social) - 4% del salario semanal × lunes del mes
   */
  calcularIVSS(sueldoMensual, lunesDelMes = null) {
    const lunes = lunesDelMes || this.obtenerLunesEnMes(new Date().getFullYear(), new Date().getMonth() + 1);
    const salarioSemanal = (this.safeNumber(sueldoMensual) * this.MESES_ANNO) / this.SEMANAS_ANNO;
    const deduccionSemanal = salarioSemanal * 0.04;
    return this.round(deduccionSemanal * lunes);
  }

  /**
   * RPE (Paro Forzoso) - 0.5% del salario semanal × lunes del mes
   */
  calcularRPE(sueldoMensual, lunesDelMes = null) {
    const lunes = lunesDelMes || this.obtenerLunesEnMes(new Date().getFullYear(), new Date().getMonth() + 1);
    const salarioSemanal = (this.safeNumber(sueldoMensual) * this.MESES_ANNO) / this.SEMANAS_ANNO;
    const deduccionSemanal = salarioSemanal * 0.005;
    return this.round(deduccionSemanal * lunes);
  }

  /**
   * FAOV (Vivienda) - 1% del salario mensual
   */
  calcularFAOV(sueldoMensual) {
    return this.round(this.safeNumber(sueldoMensual) * 0.01);
  }

  /**
   * INCES - 0.5% del salario trimestral (mensualizado)
   */
  calcularINCES(sueldoMensual) {
    const salarioTrimestral = this.safeNumber(sueldoMensual) * 3;
    const deduccionTrimestral = salarioTrimestral * 0.005;
    return this.round(deduccionTrimestral / 3);
  }

  /**
   * ISLR (Impuesto sobre la Renta)
   */
  calcularISLR(sueldoMensual, porcentajePersonalizado = null, aplicar30Porciento = true) {
    if (porcentajePersonalizado !== null) {
      return this.round(this.safeNumber(sueldoMensual) * (this.safeNumber(porcentajePersonalizado) / 100));
    }
    
    // Si no hay porcentaje personalizado y el salario es alto, aplicar 30%
    if (aplicar30Porciento && this.safeNumber(sueldoMensual) > 50000) { // Criterio de salario alto
      return this.round(this.safeNumber(sueldoMensual) * 0.30);
    }
    
    return 0;
  }

  // ====================================================================
  // 3. APORTES PATRONALES
  // ====================================================================

  /**
   * IVSS Patronal - 9% a 11% según nivel de riesgo
   */
  calcularIVSSPatronal(sueldoMensual, nivelRiesgo = 'bajo') {
    const porcentajes = {
      'bajo': 0.09,    // 9%
      'medio': 0.10,   // 10%
      'alto': 0.11     // 11%
    };
    const porcentaje = porcentajes[nivelRiesgo] || 0.09;
    return this.round(this.safeNumber(sueldoMensual) * porcentaje);
  }

  /**
   * RPE Patronal - 2% mensual
   */
  calcularRPEPatronal(sueldoMensual) {
    return this.round(this.safeNumber(sueldoMensual) * 0.02);
  }

  /**
   * FAOV Patronal - 2% mensual
   */
  calcularFAOVPatronal(sueldoMensual) {
    return this.round(this.safeNumber(sueldoMensual) * 0.02);
  }

  /**
   * INCES Patronal - 2% trimestral (mensualizado)
   */
  calcularINCESPatronal(sueldoMensual) {
    const salarioTrimestral = this.safeNumber(sueldoMensual) * 3;
    const aporteTrimestral = salarioTrimestral * 0.02;
    return this.round(aporteTrimestral / 3);
  }

  // ====================================================================
  // 6. CÁLCULOS AUXILIARES Y UTILITARIOS
  // ====================================================================

  /**
   * Factor día (Salario ÷ 30 días)
   */
  calcularFactorDia(sueldoMensual) {
    return this.round(this.safeNumber(sueldoMensual) / this.DIAS_MES);
  }

  /**
   * Factor hora (Salario ÷ (30 días × 8 horas))
   */
  calcularFactorHora(sueldoMensual) {
    return this.round(this.safeNumber(sueldoMensual) / (this.DIAS_MES * this.HORAS_DIA));
  }

  /**
   * Salario integral para prestaciones
   */
  calcularSalarioIntegral(sueldoBase, bonificaciones = 0, comisiones = 0) {
    return this.round(this.safeNumber(sueldoBase) + this.safeNumber(bonificaciones) + this.safeNumber(comisiones));
  }

  // ====================================================================
  // FUNCIONES PRINCIPALES DE CÁLCULO
  // ====================================================================

  /**
   * Calcula todos los devengos de un empleado
   */
  calcularTotalDevengos(parametros) {
    const {
      sueldoBase = 0,
      sueldoVariable = 0,
      diasTrabajados = 30,
      horasExtras = {},
      bonificaciones = {},
      comisiones = 0,
      incentivos = 0,
      reintegros = 0
    } = parametros;

    const devengos = {
      sueldoBase: this.calcularSueldoBaseMensual(sueldoBase),
      sueldoVariable: this.calcularSueldoVariable(sueldoVariable),
      salarioProporcional: diasTrabajados < 30 ? this.calcularSalarioPorDias(sueldoBase, diasTrabajados) : 0,
      
      // Bonificaciones
      alimentacion: this.calcularBonificacionAlimentacion(bonificaciones.alimentacion || 0),
      transporte: this.calcularBonoTransporte(bonificaciones.transporte || 0),
      nocturna: this.calcularBonificacionNocturna(sueldoBase, bonificaciones.horasNocturnas || 0),
      
      // Horas extras
      horasExtrasDiurnas: this.calcularHorasExtrasDiurnas(sueldoBase, horasExtras.diurnas || 0),
      horasExtrasNocturnas: this.calcularHorasExtrasNocturnas(sueldoBase, horasExtras.nocturnas || 0),
      horasExtrasFeriados: this.calcularHorasExtrasFeriados(sueldoBase, horasExtras.feriados || 0),
      
      // Otros
      comisiones: this.calcularComisiones(comisiones, bonificaciones.porcentajeComision || 0),
      incentivos: this.calcularIncentivos(incentivos),
      reintegros: this.calcularReintegros(reintegros)
    };

    // Calcular total
    devengos.total = this.round(Object.values(devengos).reduce((sum, val) => sum + this.safeNumber(val), 0));
    
    return devengos;
  }

  /**
   * Calcula todas las deducciones de un empleado
   */
  calcularTotalDeducciones(parametros) {
    const {
      sueldoMensual = 0,
      lunesDelMes = null,
      porcentajeISLR = null,
      otrosDeducciones = {}
    } = parametros;

    const deducciones = {
      ivss: this.calcularIVSS(sueldoMensual, lunesDelMes),
      rpe: this.calcularRPE(sueldoMensual, lunesDelMes),
      faov: this.calcularFAOV(sueldoMensual),
      inces: this.calcularINCES(sueldoMensual),
      islr: this.calcularISLR(sueldoMensual, porcentajeISLR),
      
      // Otras deducciones
      prestamos: this.safeNumber(otrosDeducciones.prestamos || 0),
      seguros: this.safeNumber(otrosDeducciones.seguros || 0),
      sindicato: this.safeNumber(otrosDeducciones.sindicato || 0)
    };

    // Calcular total
    deducciones.total = this.round(Object.values(deducciones).reduce((sum, val) => sum + this.safeNumber(val), 0));
    
    return deducciones;
  }

  /**
   * Calcula todos los aportes patronales
   */
  calcularTotalAportesPatronales(parametros) {
    const {
      sueldoMensual = 0,
      nivelRiesgo = 'bajo'
    } = parametros;

    const aportes = {
      ivssPatronal: this.calcularIVSSPatronal(sueldoMensual, nivelRiesgo),
      rpePatronal: this.calcularRPEPatronal(sueldoMensual),
      faovPatronal: this.calcularFAOVPatronal(sueldoMensual),
      incesPatronal: this.calcularINCESPatronal(sueldoMensual)
    };

    // Calcular total
    aportes.total = this.round(Object.values(aportes).reduce((sum, val) => sum + this.safeNumber(val), 0));
    
    return aportes;
  }

  /**
   * Calcula la nómina completa de un empleado
   */
  calcularNominaCompleta(parametros) {
    const devengos = this.calcularTotalDevengos(parametros);
    const deducciones = this.calcularTotalDeducciones({
      ...parametros,
      sueldoMensual: devengos.total
    });
    const aportesPatronales = this.calcularTotalAportesPatronales({
      ...parametros,
      sueldoMensual: devengos.total
    });

    return {
      devengos,
      deducciones,
      aportesPatronales,
      salarioNeto: this.round(devengos.total - deducciones.total),
      costoTotalEmpleado: this.round(devengos.total + aportesPatronales.total)
    };
  }
}

// ====================================================================
// EXPORTAR CLASE
// ====================================================================

module.exports = { CalculosNomina_vc_ga };