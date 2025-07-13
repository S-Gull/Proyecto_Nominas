const reportesHTML_vc_ga = document.getElementById("reportes");
// Script para mostrar/ocultar campos según el tipo de documento seleccionado
document.getElementById('tipo_documento').addEventListener('change', function() {
    const tipo = this.value;
            
    // Ocultar todos los campos específicos primero
    document.getElementById('recibo_fields').classList.add('hidden');
    document.getElementById('reporte_banco_fields').classList.add('hidden');
    document.getElementById('reporte_contable_fields').classList.add('hidden');
            
    // Mostrar solo los campos correspondientes al tipo seleccionado
    if (tipo === 'recibo') {
        document.getElementById('recibo_fields').classList.remove('hidden');
    } else if (tipo === 'reporte_banco') {
        document.getElementById('reporte_banco_fields').classList.remove('hidden');
    } else if (tipo === 'reporte_contable') {
        document.getElementById('reporte_contable_fields').classList.remove('hidden');
    }
})
module.exports = {reportesHTML_vc_ga};