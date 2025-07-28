const { query_vc_ga } = require("../database/conexion");

const empleadoHTML_vc_ga = document.getElementById('employee-view');

function getSessionEmployeeId() {
  const id = sessionStorage.getItem("selectedUserId");
  if (!id) throw new Error("No se encontró 'selectedUserId' en sessionStorage");
  return parseInt(id, 10);
}

// Carga todos los datos al inicio
async function initEmpleado() {
    console.log('algo')
  const employeeId = getSessionEmployeeId();
  console.log(employeeId)

  const { personal, salary } = await displayEmployeeDetails(employeeId);

  // Mostrar en HTML
  document.getElementById('empName').textContent = personal.nombre_completo_vc_ga;
  document.getElementById('empCedula').textContent = personal.cedula_vc_ga;
  document.getElementById('empCargo').textContent = personal.nombre_cargo_vc_ga;
  document.getElementById('empDept').textContent = personal.nombre_departamento_vc_ga;
  document.getElementById('empIngreso').textContent = new Date(personal.fecha_ingreso_vc_ga).toLocaleDateString();

  document.getElementById('salaryBase').value = salary.sueldo_base_vc_ga;
  document.getElementById('salaryVariable').value = salary.sueldo_variable_vc_ga;

  await reloadSalaryHistory(employeeId);
  await reloadDeductionHistory(employeeId);
  await reloadExtrasHistory(employeeId);
  await reloadBonusHistory(employeeId);
  await reloadVacationHistory(employeeId);
}

// Todas las funciones CRUD se basan en el ID del sessionStorage
async function displayEmployeeDetails(employeeId) {
  const sql = `
    SELECT u.*, d.nombre_vc_ga AS nombre_departamento_vc_ga,
           r.nombre_vc_ga AS nombre_rol_vc_ga,
           c.nombre_vc_ga AS nombre_cargo_vc_ga
    FROM td_usuarios_vc_ga u
    LEFT JOIN td_departamento_vc_ga d ON u.id_departamento_vc_ga = d.id_departamento_vc_ga
    LEFT JOIN td_roles_vc_ga r ON u.id_rol_vc_ga = r.id_rol_vc_ga
    LEFT JOIN td_cargos_vc_ga c ON u.id_cargo_vc_ga = c.id_cargo_vc_ga
    WHERE u.id_usuario_vc_ga = ?;
  `;
  const [personal] = await query_vc_ga(sql, [employeeId]);

  const salarySql = `
    SELECT sueldo_base_vc_ga, sueldo_variable_vc_ga
    FROM td_salario_historico_vc_ga
    WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL;
  `;
  const [salary] = await query_vc_ga(salarySql, [employeeId]);

  return { personal, salary };
}

// Ejemplo de actualizar salario
async function actualizarSalario() {
  const employeeId = getSessionEmployeeId();
  const base = parseFloat(document.getElementById("salaryBase").value);
  const variable = parseFloat(document.getElementById("salaryVariable").value);

  await query_vc_ga(`
    UPDATE td_salario_historico_vc_ga SET fecha_fin_vc_ga = CURDATE()
    WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL;
  `, [employeeId]);

  await query_vc_ga(`
    INSERT INTO td_salario_historico_vc_ga
    (id_usuario_vc_ga, sueldo_base_vc_ga, sueldo_variable_vc_ga, fecha_inicio_vc_ga)
    VALUES (?, ?, ?, CURDATE());
  `, [employeeId, base, variable]);

  await reloadSalaryHistory(employeeId);
}

// Funciones de recarga de historial similares a employeeView.js
async function reloadSalaryHistory(id) {
  const rows = await query_vc_ga(
    'SELECT * FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC',
    [id]
  );
  document.getElementById('salaryHistory').innerHTML = rows.map(r =>
    `<tr>
      <td>${r.fecha_inicio_vc_ga}</td>
      <td>${r.fecha_fin_vc_ga || ''}</td>
      <td>${r.sueldo_base_vc_ga}</td>
      <td>${r.sueldo_variable_vc_ga}</td>
    </tr>`
  ).join('');
}

async function reloadDeductionHistory(id) {
  const rows = await query_vc_ga(`
    SELECT fecha_aplicacion_vc_ga AS fecha, d.nombre_vc_ga AS tipo, monto_vc_ga AS monto
    FROM td_usuario_deduccion_vc_ga ud
    JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
    WHERE id_usuario_vc_ga = ? ORDER BY fecha_aplicacion_vc_ga DESC`, [id]);

  document.getElementById('deductionHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha}</td><td>${r.tipo}</td><td>${r.monto}</td></tr>`
  ).join('');
}

async function reloadExtrasHistory(id) {
  const rows = await query_vc_ga(`
    SELECT fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
    FROM td_horas_extras_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`, [id]);

  document.getElementById('extrasHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha}</td><td>${r.tipo}</td><td>${r.horas}</td><td>${r.monto}</td></tr>`
  ).join('');
}

async function reloadBonusHistory(id) {
  const rows = await query_vc_ga(`
    SELECT fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
    FROM td_bono_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`, [id]);

  document.getElementById('bonusHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha}</td><td>${r.tipo}</td><td>${r.monto}</td></tr>`
  ).join('');
}

async function reloadVacationHistory(id) {
  const rows = await query_vc_ga(`
    SELECT fecha_inicio_vc_ga AS inicio, fecha_fin_vc_ga AS fin, dias_disfrutados_vc_ga AS dias
    FROM td_vacaciones_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC`, [id]);

  document.getElementById('vacationHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.inicio}</td><td>${r.fin}</td><td>${r.dias}</td></tr>`
  ).join('');

  const summary = rows.reduce((acc, cur) => {
    acc.used += cur.dias;
    return acc;
  }, { used: 0 });
  document.getElementById('vacDaysUsed').textContent = summary.used;
  document.getElementById('vacDaysRight').textContent = 30; // Ajustable
}

module.exports = {
  initEmpleado,
  actualizarSalario,
  reloadSalaryHistory,
  reloadDeductionHistory,
  reloadExtrasHistory,
  reloadBonusHistory,
  reloadVacationHistory,
  empleadoHTML_vc_ga
};
