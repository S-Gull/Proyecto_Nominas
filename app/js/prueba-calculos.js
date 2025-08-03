/**
 * ====================================================================
 * ARCHIVO DE PRUEBAS PARA CALCULOS.JS
 * Ejecuta este archivo en la consola para probar todas las funciones
 * ====================================================================
 */

// Primero importa o incluye la clase (ajusta según tu entorno)
const { CalculosNomina_vc_ga } = require('../js/calculos');

// Si estás en el navegador, copia y pega la clase CalculosNomina_vc_ga aquí
// Por ahora, asumimos que ya tienes la clase disponible

console.log("🚀 INICIANDO PRUEBAS DE CÁLCULOS DE NÓMINA");
console.log("=" .repeat(60));

// Crear instancia de la calculadora
const calc = new CalculosNomina_vc_ga();

// Datos de prueba
const DATOS_PRUEBA = {
  sueldoBase: 100000,      // Bs. 100,000
  sueldoVariable: 20000,   // Bs. 20,000
  fechaIngreso: '2020-01-15',
  horasExtras: 10,
  horasNocturnas: 5,
  montoVentas: 500000,
  porcentajeComision: 3,
  bonificacionAlimentacion: 15000,
  bonoTransporte: 8000
};

console.log("📊 DATOS DE PRUEBA:");
console.table(DATOS_PRUEBA);
console.log("\n");

// ====================================================================
// PRUEBAS DE FUNCIONES AUXILIARES
// ====================================================================

console.log("🔧 1. PROBANDO FUNCIONES AUXILIARES");
console.log("-".repeat(50));

console.log("✅ safeNumber(100.50):", calc.safeNumber(100.50));
console.log("✅ safeNumber('abc'):", calc.safeNumber('abc'));
console.log("✅ round(123.456789):", calc.round(123.456789));
console.log("✅ calcularDiasTrabajados('2024-01-01', '2024-01-31'):", calc.calcularDiasTrabajados('2024-01-01', '2024-01-31'));
console.log("✅ obtenerLunesEnMes(2024, 1):", calc.obtenerLunesEnMes(2024, 1));
console.log("✅ calcularAntiguedad('2020-01-15'):", calc.calcularAntiguedad('2020-01-15'), "años");
console.log("\n");

// ====================================================================
// PRUEBAS DE DEVENGOS - SALARIOS BASE
// ====================================================================

console.log("💰 2. PROBANDO DEVENGOS - SALARIOS BASE");
console.log("-".repeat(50));

console.log("✅ calcularSueldoBaseMensual(" + DATOS_PRUEBA.sueldoBase + "):", 
  calc.calcularSueldoBaseMensual(DATOS_PRUEBA.sueldoBase));

console.log("✅ calcularSueldoVariable(" + DATOS_PRUEBA.sueldoVariable + "):", 
  calc.calcularSueldoVariable(DATOS_PRUEBA.sueldoVariable));

console.log("✅ calcularSalarioPorDias(" + DATOS_PRUEBA.sueldoBase + ", 25 días):", 
  calc.calcularSalarioPorDias(DATOS_PRUEBA.sueldoBase, 25));

console.log("✅ calcularSalarioPorHoras(" + DATOS_PRUEBA.sueldoBase + ", 200 horas):", 
  calc.calcularSalarioPorHoras(DATOS_PRUEBA.sueldoBase, 200));
console.log("\n");

// ====================================================================
// PRUEBAS DE DEVENGOS - BONIFICACIONES
// ====================================================================

console.log("🎁 3. PROBANDO DEVENGOS - BONIFICACIONES");
console.log("-".repeat(50));

console.log("✅ calcularBonificacionAlimentacion(" + DATOS_PRUEBA.bonificacionAlimentacion + "):", 
  calc.calcularBonificacionAlimentacion(DATOS_PRUEBA.bonificacionAlimentacion));

console.log("✅ calcularBonoTransporte(" + DATOS_PRUEBA.bonoTransporte + "):", 
  calc.calcularBonoTransporte(DATOS_PRUEBA.bonoTransporte));

console.log("✅ calcularBonificacionNocturna(" + DATOS_PRUEBA.sueldoBase + ", " + DATOS_PRUEBA.horasNocturnas + " horas):", 
  calc.calcularBonificacionNocturna(DATOS_PRUEBA.sueldoBase, DATOS_PRUEBA.horasNocturnas));

console.log("✅ calcularBonificacionAntiguedad(" + DATOS_PRUEBA.sueldoBase + ", '" + DATOS_PRUEBA.fechaIngreso + "'):", 
  calc.calcularBonificacionAntiguedad(DATOS_PRUEBA.sueldoBase, DATOS_PRUEBA.fechaIngreso));
console.log("\n");

// ====================================================================
// PRUEBAS DE DEVENGOS - HORAS EXTRAS
// ====================================================================

console.log("⏰ 4. PROBANDO DEVENGOS - HORAS EXTRAS");
console.log("-".repeat(50));

console.log("✅ calcularHorasExtrasDiurnas(" + DATOS_PRUEBA.sueldoBase + ", " + DATOS_PRUEBA.horasExtras + " horas):", 
  calc.calcularHorasExtrasDiurnas(DATOS_PRUEBA.sueldoBase, DATOS_PRUEBA.horasExtras));

console.log("✅ calcularHorasExtrasNocturnas(" + DATOS_PRUEBA.sueldoBase + ", " + DATOS_PRUEBA.horasExtras + " horas):", 
  calc.calcularHorasExtrasNocturnas(DATOS_PRUEBA.sueldoBase, DATOS_PRUEBA.horasExtras));

console.log("✅ calcularHorasExtrasFeriados(" + DATOS_PRUEBA.sueldoBase + ", " + DATOS_PRUEBA.horasExtras + " horas):", 
  calc.calcularHorasExtrasFeriados(DATOS_PRUEBA.sueldoBase, DATOS_PRUEBA.horasExtras));

console.log("✅ calcularHorasExtrasNocturnasFeriados(" + DATOS_PRUEBA.sueldoBase + ", " + DATOS_PRUEBA.horasExtras + " horas):", 
  calc.calcularHorasExtrasNocturnasFeriados(DATOS_PRUEBA.sueldoBase, DATOS_PRUEBA.horasExtras));
console.log("\n");

// ====================================================================
// PRUEBAS DE DEVENGOS - OTROS
// ====================================================================

console.log("💼 5. PROBANDO DEVENGOS - OTROS");
console.log("-".repeat(50));

console.log("✅ calcularComisiones(" + DATOS_PRUEBA.montoVentas + ", " + DATOS_PRUEBA.porcentajeComision + "%):", 
  calc.calcularComisiones(DATOS_PRUEBA.montoVentas, DATOS_PRUEBA.porcentajeComision));

console.log("✅ calcularIncentivos(5000):", calc.calcularIncentivos(5000));
console.log("✅ calcularBonosEspeciales(10000):", calc.calcularBonosEspeciales(10000));
console.log("✅ calcularReintegros(3000):", calc.calcularReintegros(3000));
console.log("\n");

// ====================================================================
// PRUEBAS DE DEDUCCIONES
// ====================================================================

console.log("📉 6. PROBANDO DEDUCCIONES");
console.log("-".repeat(50));

const sueldoParaDeducciones = 120000; // Suma de base + variable

console.log("💡 Usando sueldo total de Bs.", sueldoParaDeducciones, "para calcular deducciones");

console.log("✅ calcularIVSS(" + sueldoParaDeducciones + ", 4 lunes):", 
  calc.calcularIVSS(sueldoParaDeducciones, 4));

console.log("✅ calcularRPE(" + sueldoParaDeducciones + ", 4 lunes):", 
  calc.calcularRPE(sueldoParaDeducciones, 4));

console.log("✅ calcularFAOV(" + sueldoParaDeducciones + "):", 
  calc.calcularFAOV(sueldoParaDeducciones));

console.log("✅ calcularINCES(" + sueldoParaDeducciones + "):", 
  calc.calcularINCES(sueldoParaDeducciones));

console.log("✅ calcularISLR(" + sueldoParaDeducciones + ", 15%):", 
  calc.calcularISLR(sueldoParaDeducciones, 15));

console.log("✅ calcularISLR(" + sueldoParaDeducciones + ", automático 30%):", 
  calc.calcularISLR(sueldoParaDeducciones));
console.log("\n");

// ====================================================================
// PRUEBAS DE APORTES PATRONALES
// ====================================================================

console.log("🏢 7. PROBANDO APORTES PATRONALES");
console.log("-".repeat(50));

console.log("✅ calcularIVSSPatronal(" + sueldoParaDeducciones + ", 'bajo'):", 
  calc.calcularIVSSPatronal(sueldoParaDeducciones, 'bajo'));

console.log("✅ calcularIVSSPatronal(" + sueldoParaDeducciones + ", 'medio'):", 
  calc.calcularIVSSPatronal(sueldoParaDeducciones, 'medio'));

console.log("✅ calcularIVSSPatronal(" + sueldoParaDeducciones + ", 'alto'):", 
  calc.calcularIVSSPatronal(sueldoParaDeducciones, 'alto'));

console.log("✅ calcularRPEPatronal(" + sueldoParaDeducciones + "):", 
  calc.calcularRPEPatronal(sueldoParaDeducciones));

console.log("✅ calcularFAOVPatronal(" + sueldoParaDeducciones + "):", 
  calc.calcularFAOVPatronal(sueldoParaDeducciones));

console.log("✅ calcularINCESPatronal(" + sueldoParaDeducciones + "):", 
  calc.calcularINCESPatronal(sueldoParaDeducciones));
console.log("\n");

// ====================================================================
// PRUEBAS DE CÁLCULOS AUXILIARES
// ====================================================================

console.log("🧮 8. PROBANDO CÁLCULOS AUXILIARES");
console.log("-".repeat(50));

console.log("✅ calcularFactorDia(" + DATOS_PRUEBA.sueldoBase + "):", 
  calc.calcularFactorDia(DATOS_PRUEBA.sueldoBase));

console.log("✅ calcularFactorHora(" + DATOS_PRUEBA.sueldoBase + "):", 
  calc.calcularFactorHora(DATOS_PRUEBA.sueldoBase));

console.log("✅ calcularSalarioIntegral(" + DATOS_PRUEBA.sueldoBase + ", 20000 bonif, 15000 comis):", 
  calc.calcularSalarioIntegral(DATOS_PRUEBA.sueldoBase, 20000, 15000));
console.log("\n");

// ====================================================================
// PRUEBAS DE FUNCIONES PRINCIPALES
// ====================================================================

console.log("🎯 9. PROBANDO FUNCIONES PRINCIPALES");
console.log("-".repeat(50));

// Prueba de calcularTotalDevengos
console.log("💰 CALCULANDO TOTAL DEVENGOS:");
const devengos = calc.calcularTotalDevengos({
  sueldoBase: DATOS_PRUEBA.sueldoBase,
  sueldoVariable: DATOS_PRUEBA.sueldoVariable,
  diasTrabajados: 30,
  horasExtras: {
    diurnas: 10,
    nocturnas: 5,
    feriados: 3
  },
  bonificaciones: {
    alimentacion: 15000,
    transporte: 8000,
    horasNocturnas: 20,
    porcentajeComision: 3
  },
  comisiones: 500000
});

console.table(devengos);
console.log("\n");

// Prueba de calcularTotalDeducciones  
console.log("📉 CALCULANDO TOTAL DEDUCCIONES:");
const deducciones = calc.calcularTotalDeducciones({
  sueldoMensual: devengos.total,
  lunesDelMes: 4,
  porcentajeISLR: 15,
  otrosDeducciones: {
    prestamos: 5000,
    seguros: 2000,
    sindicato: 1000
  }
});

console.table(deducciones);
console.log("\n");

// Prueba de calcularTotalAportesPatronales
console.log("🏢 CALCULANDO APORTES PATRONALES:");
const aportesPatronales = calc.calcularTotalAportesPatronales({
  sueldoMensual: devengos.total,
  nivelRiesgo: 'medio'
});

console.table(aportesPatronales);
console.log("\n");

// ====================================================================
// PRUEBA FINAL - NÓMINA COMPLETA
// ====================================================================

console.log("🏆 10. PRUEBA FINAL - NÓMINA COMPLETA");
console.log("=".repeat(60));

const nominaCompleta = calc.calcularNominaCompleta({
  sueldoBase: DATOS_PRUEBA.sueldoBase,
  sueldoVariable: DATOS_PRUEBA.sueldoVariable,
  diasTrabajados: 30,
  horasExtras: {
    diurnas: 10,
    nocturnas: 5,
    feriados: 3
  },
  bonificaciones: {
    alimentacion: 15000,
    transporte: 8000,
    horasNocturnas: 20,
    porcentajeComision: 3
  },
  comisiones: 500000,
  porcentajeISLR: 15,
  nivelRiesgo: 'medio',
  otrosDeducciones: {
    prestamos: 5000,
    seguros: 2000,
    sindicato: 1000
  }
});

console.log("📊 RESUMEN FINAL:");
console.log("Total Devengos: Bs.", nominaCompleta.devengos.total.toLocaleString());
console.log("Total Deducciones: Bs.", nominaCompleta.deducciones.total.toLocaleString());
console.log("Salario Neto: Bs.", nominaCompleta.salarioNeto.toLocaleString());
console.log("Aportes Patronales: Bs.", nominaCompleta.aportesPatronales.total.toLocaleString());
console.log("Costo Total Empleado: Bs.", nominaCompleta.costoTotalEmpleado.toLocaleString());

console.log("\n📋 DETALLES COMPLETOS:");
console.log("DEVENGOS:", nominaCompleta.devengos);
console.log("DEDUCCIONES:", nominaCompleta.deducciones);
console.log("APORTES PATRONALES:", nominaCompleta.aportesPatronales);

console.log("\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS!");
console.log("=" .repeat(60));

// ====================================================================
// FUNCIÓN PARA PROBAR UNA FUNCIÓN ESPECÍFICA
// ====================================================================

function probarFuncionEspecifica(nombreFuncion, ...parametros) {
  console.log(`🔍 PROBANDO: ${nombreFuncion}(${parametros.join(', ')})`);
  try {
    const resultado = calc[nombreFuncion](...parametros);
    console.log(`✅ Resultado: ${resultado}`);
    return resultado;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

// Ejemplos de uso de la función de prueba individual:
console.log("\n🔧 EJEMPLOS DE PRUEBAS INDIVIDUALES:");
probarFuncionEspecifica('calcularIVSS', 100000, 5);
probarFuncionEspecifica('calcularHorasExtrasDiurnas', 80000, 15);
probarFuncionEspecifica('calcularComisiones', 300000, 2.5);

console.log("\n💡 PARA PROBAR UNA FUNCIÓN ESPECÍFICA, USA:");
console.log("probarFuncionEspecifica('nombreFuncion', parametro1, parametro2, ...)");