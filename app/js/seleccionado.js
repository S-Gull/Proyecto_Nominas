const { query_vc_ga } = require("../database/conexion");

const selectedHTML_vc_ga = document.getElementById('selected-view');
function getSessionEmployeeId() {
  const id = sessionStorage.getItem("selectedUserId");
  if (!id) throw new Error("No se encontró 'selectedUserId' en sessionStorage");
  return parseInt(id, 10);
}

// Carga todos los datos al inicio, con chequeo de existencia
async function inicializarEmpleado() {
  const employeeId = getSessionEmployeeId();
  const { personal, salary } = await displayEmployeeDetails(employeeId);

  // Mostrar datos personales
  document.getElementById('empName').textContent = personal.nombre_completo_vc_ga;
  document.getElementById('empCedula').textContent = personal.cedula_vc_ga;
  document.getElementById('empCargo').textContent = personal.nombre_cargo_vc_ga;
  document.getElementById('empDept').textContent = personal.nombre_departamento_vc_ga;
  document.getElementById('empIngreso').textContent = new Date(personal.fecha_ingreso_vc_ga).toLocaleDateString();

  // Verifica si existe salario
  if (!salary || salary.sueldo_base_vc_ga == null) {
    alert('No se encontró información de salario. Por favor, agréguelo.');
  } else {
    document.getElementById('salaryBase').value = salary.sueldo_base_vc_ga;
    document.getElementById('salaryVariable').value = salary.sueldo_variable_vc_ga;
  }

  // Recargas y notificaciones si no hay datos
  await reloadSalaryHistory(employeeId);
  await reloadDeductionHistory(employeeId);
  await reloadExtrasHistory(employeeId);
  await reloadBonusHistory(employeeId);
  await reloadVacationHistory(employeeId);
}

// Funciones CRUD para Salario
async function addSalary(base, variable) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `INSERT INTO td_salario_historico_vc_ga (id_usuario_vc_ga, sueldo_base_vc_ga, sueldo_variable_vc_ga, fecha_inicio_vc_ga)
     VALUES (?, ?, ?, CURDATE())`,
    [id, base, variable]
  );
  await reloadSalaryHistory(id);
}
async function editSalary(recordId, base, variable) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_salario_historico_vc_ga SET sueldo_base_vc_ga = ?, sueldo_variable_vc_ga = ? WHERE id_salario_historico_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [base, variable, recordId, id]
  );
  await reloadSalaryHistory(id);
}
async function deleteSalary(recordId) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `DELETE FROM td_salario_historico_vc_ga WHERE id_salario_historico_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [recordId, id]
  );
  await reloadSalaryHistory(id);
}

// Funciones CRUD para Deducciones
async function addDeduction(typeId, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `INSERT INTO td_usuario_deduccion_vc_ga (id_usuario_vc_ga, id_deduccion_vc_ga, monto_vc_ga, fecha_aplicacion_vc_ga)
     VALUES (?, ?, ?, CURDATE())`,
    [id, typeId, amount]
  );
  await reloadDeductionHistory(id);
}
async function editDeduction(recordId, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_usuario_deduccion_vc_ga SET monto_vc_ga = ? WHERE id_usuario_deduccion_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [amount, recordId, id]
  );
  await reloadDeductionHistory(id);
}
async function deleteDeduction(recordId) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `DELETE FROM td_usuario_deduccion_vc_ga WHERE id_usuario_deduccion_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [recordId, id]
  );
  await reloadDeductionHistory(id);
}

// Funciones CRUD para Horas Extras
async function addExtra(type, hours, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `INSERT INTO td_horas_extras_vc_ga (id_usuario_vc_ga, tipo_vc_ga, cantidad_horas_vc_ga, monto_vc_ga, fecha_vc_ga)
     VALUES (?, ?, ?, ?, CURDATE())`,
    [id, type, hours, amount]
  );
  await reloadExtrasHistory(id);
}
async function editExtra(recordId, hours, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_horas_extras_vc_ga SET cantidad_horas_vc_ga = ?, monto_vc_ga = ? WHERE id_horas_extras_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [hours, amount, recordId, id]
  );
  await reloadExtrasHistory(id);
}
async function deleteExtra(recordId) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `DELETE FROM td_horas_extras_vc_ga WHERE id_horas_extras_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [recordId, id]
  );
  await reloadExtrasHistory(id);
}

// Funciones CRUD para Bonos
async function addBonus(type, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `INSERT INTO td_bono_vc_ga (id_usuario_vc_ga, tipo_bono_vc_ga, monto_vc_ga, fecha_pago_vc_ga)
     VALUES (?, ?, ?, CURDATE())`,
    [id, type, amount]
  );
  await reloadBonusHistory(id);
}
async function editBonus(recordId, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_bono_vc_ga SET monto_vc_ga = ? WHERE id_bono_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [amount, recordId, id]
  );
  await reloadBonusHistory(id);
}
async function deleteBonus(recordId) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `DELETE FROM td_bono_vc_ga WHERE id_bono_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [recordId, id]
  );
  await reloadBonusHistory(id);
}

// Funciones CRUD para Vacaciones
async function addVacation(start, end, days) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `INSERT INTO td_vacaciones_vc_ga (id_usuario_vc_ga, fecha_inicio_vc_ga, fecha_fin_vc_ga, dias_disfrutados_vc_ga)
     VALUES (?, ?, ?, ?)\``,
    [id, start, end, days]
  );
  await reloadVacationHistory(id);
}
async function editVacation(recordId, start, end, days) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_vacaciones_vc_ga SET fecha_inicio_vc_ga = ?, fecha_fin_vc_ga = ?, dias_disfrutados_vc_ga = ? WHERE id_vacaciones_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [start, end, days, recordId, id]
  );
  await reloadVacationHistory(id);
}
async function deleteVacation(recordId) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `DELETE FROM td_vacaciones_vc_ga WHERE id_vacaciones_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [recordId, id]
  );
  await reloadVacationHistory(id);
}

// Display y recargas de histórico
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

async function reloadSalaryHistory(id) {
  const rows = await query_vc_ga(
    'SELECT * FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC',
    [id]
  );
  if (rows.length === 0) alert('No hay historial de salario.');
  document.getElementById('salaryHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha_inicio_vc_ga}</td><td>${r.fecha_fin_vc_ga || ''}</td><td>${r.sueldo_base_vc_ga}</td><td>${r.sueldo_variable_vc_ga}</td></tr>`
  ).join('');
}

async function reloadDeductionHistory(id) {
  const rows = await query_vc_ga(
    `SELECT fecha_aplicacion_vc_ga AS fecha, d.nombre_vc_ga AS tipo, monto_vc_ga AS monto
     FROM td_usuario_deduccion_vc_ga ud
     JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
     WHERE id_usuario_vc_ga = ? ORDER BY fecha_aplicacion_vc_ga DESC`, [id]
  );
  if (rows.length === 0) alert('No hay deducciones registradas.');
  document.getElementById('deductionHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha}</td><td>${r.tipo}</td><td>${r.monto}</td></tr>`
  ).join('');
}

async function reloadExtrasHistory(id) {
  const rows = await query_vc_ga(
    `SELECT fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
     FROM td_horas_extras_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`, [id]
  );
  if (rows.length === 0) alert('No hay horas extras registradas.');
  document.getElementById('extrasHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha}</td><td>${r.tipo}</td><td>${r.horas}</td><td>${r.monto}</td></tr>`
  ).join('');
}

async function reloadBonusHistory(id) {
  const rows = await query_vc_ga(
    `SELECT fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
     FROM td_bono_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`, [id]
  );
  if (rows.length === 0) alert('No hay bonos registrados.');
  document.getElementById('bonusHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.fecha}</td><td>${r.tipo}</td><td>${r.monto}</td></tr>`
  ).join('');
}

async function reloadVacationHistory(id) {
  const rows = await query_vc_ga(
    `SELECT fecha_inicio_vc_ga AS inicio, fecha_fin_vc_ga AS fin, dias_disfrutados_vc_ga AS dias
     FROM td_vacaciones_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC`, [id]
  );
  if (rows.length === 0) alert('No hay vacaciones registradas.');
  document.getElementById('vacationHistory').innerHTML = rows.map(r =>
    `<tr><td>${r.inicio}</td><td>${r.fin}</td><td>${r.dias}</td></tr>`
  ).join('');
  const summary = rows.reduce((acc, cur) => { acc.used += cur.dias; return acc; }, { used: 0 });
  document.getElementById('vacDaysUsed').textContent = summary.used;
  document.getElementById('vacDaysRight').textContent = 30; // Ajustable
}

module.exports = {
  inicializarEmpleado,
  addSalary,
  editSalary,
  deleteSalary,
  addDeduction,
  editDeduction,
  deleteDeduction,
  addExtra,
  editExtra,
  deleteExtra,
  addBonus,
  editBonus,
  deleteBonus,
  addVacation,
  editVacation,
  deleteVacation,
  reloadSalaryHistory,
  reloadDeductionHistory,
  reloadExtrasHistory,
  reloadBonusHistory,
  reloadVacationHistory,
  selectedHTML_vc_ga
};
