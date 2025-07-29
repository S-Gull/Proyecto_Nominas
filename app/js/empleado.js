const { query_vc_ga } = require("../database/conexion");

const empleadoHTML_vc_ga = document.getElementById('employee-view');

const obtenerIdEmpleadoSesion_vc_ga = () => {
  // Obtener los datos del usuario almacenados bajo la clave 'usuarioActual_vc_ga'
  const usuarioString = sessionStorage.getItem('usuarioActual_vc_ga');
  
  if (!usuarioString) {
    throw new Error("No se encontró 'usuarioActual_vc_ga' en sessionStorage");
  }

  try {
    // Parsear el JSON para obtener el objeto
    const usuario = JSON.parse(usuarioString);
    
    // Verificar si el objeto tiene la propiedad 'id'
    if (usuario.id === undefined) {
      throw new Error("El objeto no tiene la propiedad 'id'");
    }
    
    // Convertir el ID a entero y retornarlo
    return parseInt(usuario.id, 10);
    
  } catch (error) {
    throw new Error("Error al procesar datos de sessionStorage: " + error.message);
  }
};

const configurarPestañas_vc_ga = () => {
  const botonesPestaña_vc_ga = document.querySelectorAll('.tab-btn');
  const contenidosPestaña_vc_ga = document.querySelectorAll('.tab-pane');

  botonesPestaña_vc_ga.forEach(boton_vc_ga => {
    boton_vc_ga.addEventListener('click', () => {
      const destino_vc_ga = boton_vc_ga.dataset.tab;

      contenidosPestaña_vc_ga.forEach(contenido_vc_ga => contenido_vc_ga.classList.add('hidden'));
      document.getElementById(destino_vc_ga).classList.remove('hidden');

      botonesPestaña_vc_ga.forEach(b_vc_ga => b_vc_ga.classList.remove('border-b-2', 'border-accent1'));
      boton_vc_ga.classList.add('border-b-2', 'border-accent1');
    });
  });

  if (botonesPestaña_vc_ga.length) botonesPestaña_vc_ga[0].click();
};

const mostrarDetallesEmpleado_vc_ga = async (idEmpleado_vc_ga) => {
  const sql_vc_ga = `
    SELECT u.*, d.nombre_vc_ga AS nombre_departamento_vc_ga,
           r.nombre_vc_ga AS nombre_rol_vc_ga,
           c.nombre_vc_ga AS nombre_cargo_vc_ga
    FROM td_usuarios_vc_ga u
    LEFT JOIN td_departamento_vc_ga d ON u.id_departamento_vc_ga = d.id_departamento_vc_ga
    LEFT JOIN td_roles_vc_ga r ON u.id_rol_vc_ga = r.id_rol_vc_ga
    LEFT JOIN td_cargos_vc_ga c ON u.id_cargo_vc_ga = c.id_cargo_vc_ga
    WHERE u.id_usuario_vc_ga = ?;
  `;
  const [personal_vc_ga] = await query_vc_ga(sql_vc_ga, [idEmpleado_vc_ga]);

  const sqlSalario_vc_ga = `
    SELECT sueldo_base_vc_ga, sueldo_variable_vc_ga
    FROM td_salario_historico_vc_ga
    WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL;
  `;
  const [salario_vc_ga] = await query_vc_ga(sqlSalario_vc_ga, [idEmpleado_vc_ga]);

  return { personal_vc_ga, salario_vc_ga };
};

const iniciarEmpleado_vc_ga = async () => {
  const idEmpleado_vc_ga = obtenerIdEmpleadoSesion_vc_ga();
  const { personal_vc_ga, salario_vc_ga } = await mostrarDetallesEmpleado_vc_ga(idEmpleado_vc_ga);

  document.getElementById('empName').textContent = personal_vc_ga.nombre_completo_vc_ga;
  document.getElementById('empCedula').textContent = personal_vc_ga.cedula_vc_ga;
  document.getElementById('empCargo').textContent = personal_vc_ga.nombre_cargo_vc_ga;
  document.getElementById('empDept').textContent = personal_vc_ga.nombre_departamento_vc_ga;
  document.getElementById('empIngreso').textContent = new Date(personal_vc_ga.fecha_ingreso_vc_ga).toLocaleDateString();

  await recargarHistorialSalario_vc_ga(idEmpleado_vc_ga);
  await recargarHistorialDeducciones_vc_ga(idEmpleado_vc_ga);
  await recargarHistorialHorasExtras_vc_ga(idEmpleado_vc_ga);
  await recargarHistorialBonos_vc_ga(idEmpleado_vc_ga);
  await recargarHistorialVacaciones_vc_ga(idEmpleado_vc_ga);
  configurarPestañas_vc_ga();
};

const actualizarSalario_vc_ga = async () => {
  const idEmpleado_vc_ga = obtenerIdEmpleadoSesion_vc_ga();
  const base_vc_ga = parseFloat(document.getElementById("salaryBase").value);
  const variable_vc_ga = parseFloat(document.getElementById("salaryVariable").value);

  await query_vc_ga(`
    UPDATE td_salario_historico_vc_ga SET fecha_fin_vc_ga = CURDATE()
    WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL;
  `, [idEmpleado_vc_ga]);

  await query_vc_ga(`
    INSERT INTO td_salario_historico_vc_ga
    (id_usuario_vc_ga, sueldo_base_vc_ga, sueldo_variable_vc_ga, fecha_inicio_vc_ga)
    VALUES (?, ?, ?, CURDATE());
  `, [idEmpleado_vc_ga, base_vc_ga, variable_vc_ga]);

  await recargarHistorialSalario_vc_ga(idEmpleado_vc_ga);
};

const recargarHistorialSalario_vc_ga = async (id_vc_ga) => {
  const filas_vc_ga = await query_vc_ga(
    'SELECT * FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC',
    [id_vc_ga]
  );
  document.getElementById('salaryHistory').innerHTML = filas_vc_ga.map(r_vc_ga =>
    `<tr>
      <td>${r_vc_ga.fecha_inicio_vc_ga}</td>
      <td>${r_vc_ga.fecha_fin_vc_ga || ''}</td>
      <td>${r_vc_ga.sueldo_base_vc_ga}</td>
      <td>${r_vc_ga.sueldo_variable_vc_ga}</td>
    </tr>`
  ).join('');
};

const recargarHistorialDeducciones_vc_ga = async (id_vc_ga) => {
  const filas_vc_ga = await query_vc_ga(
    `
    SELECT fecha_aplicacion_vc_ga AS fecha, d.nombre_vc_ga AS tipo, monto_vc_ga AS monto
    FROM td_usuario_deduccion_vc_ga ud
    JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
    WHERE id_usuario_vc_ga = ? ORDER BY fecha_aplicacion_vc_ga DESC`
    , [id_vc_ga]
  );
  document.getElementById('deductionHistory').innerHTML = filas_vc_ga.map(r_vc_ga =>
    `<tr><td>${r_vc_ga.fecha}</td><td>${r_vc_ga.tipo}</td><td>${r_vc_ga.monto}</td></tr>`
  ).join('');
};

const recargarHistorialHorasExtras_vc_ga = async (id_vc_ga) => {
  const filas_vc_ga = await query_vc_ga(
    `
    SELECT fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
    FROM td_horas_extras_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`
    , [id_vc_ga]
  );
  document.getElementById('extrasHistory').innerHTML = filas_vc_ga.map(r_vc_ga =>
    `<tr><td>${r_vc_ga.fecha}</td><td>${r_vc_ga.tipo}</td><td>${r_vc_ga.horas}</td><td>${r_vc_ga.monto}</td></tr>`
  ).join('');
};

const recargarHistorialBonos_vc_ga = async (id_vc_ga) => {
  const filas_vc_ga = await query_vc_ga(
    `
    SELECT fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
    FROM td_bono_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`
    , [id_vc_ga]
  );
  document.getElementById('bonusHistory').innerHTML = filas_vc_ga.map(r_vc_ga =>
    `<tr><td>${r_vc_ga.fecha}</td><td>${r_vc_ga.tipo}</td><td>${r_vc_ga.monto}</td></tr>`
  ).join('');
};

const recargarHistorialVacaciones_vc_ga = async (id_vc_ga) => {
  const filas_vc_ga = await query_vc_ga(
    `
    SELECT fecha_inicio_vc_ga AS inicio, fecha_fin_vc_ga AS fin, dias_disfrutados_vc_ga AS dias
    FROM td_vacaciones_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC`
    , [id_vc_ga]
  );
  document.getElementById('vacationHistory').innerHTML = filas_vc_ga.map(r_vc_ga =>
    `<tr><td>${r_vc_ga.inicio}</td><td>${r_vc_ga.fin}</td><td>${r_vc_ga.dias}</td></tr>`
  ).join('');

  const resumen_vc_ga = filas_vc_ga.reduce((ac_vc_ga, actual_vc_ga) => {
    ac_vc_ga.used += actual_vc_ga.dias;
    return ac_vc_ga;
  }, { used: 0 });
  document.getElementById('vacDaysUsed').textContent = resumen_vc_ga.used;
  document.getElementById('vacDaysRight').textContent = 30;
};

module.exports= {
  iniciarEmpleado_vc_ga,
  recargarHistorialSalario_vc_ga,
  recargarHistorialDeducciones_vc_ga,
  recargarHistorialHorasExtras_vc_ga,
  recargarHistorialBonos_vc_ga,
  recargarHistorialVacaciones_vc_ga,
  empleadoHTML_vc_ga
};
