const { query_vc_ga } = require("../database/conexion");
const { modal_vc_ga } = require("./modal");
const selectedHTML_vc_ga = document.getElementById('selected-view');

// Función segura para números
function safeNumber(value, defaultValue = 0) {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
}

// Función para obtener ID de empleado
function getSessionEmployeeId() {
  const id = sessionStorage.getItem("selectedUserId");
  if (!id) throw new Error("No se encontró 'selectedUserId' en sessionStorage");
  return parseInt(id, 10);
}

// Función principal
async function inicializarEmpleado() {
  try {
    const employeeId = getSessionEmployeeId();
    const { personal, salary } = await displayEmployeeDetails(employeeId);

    // Mostrar datos personales
    document.getElementById('empName').textContent = personal?.nombre_completo_vc_ga || 'No especificado';
    document.getElementById('empCedula').textContent = personal?.cedula_vc_ga || 'No especificado';
    document.getElementById('empCargo').textContent = personal?.nombre_cargo_vc_ga || 'No especificado';
    document.getElementById('empDept').textContent = personal?.nombre_departamento_vc_ga || 'No especificado';
    document.getElementById('empIngreso').textContent = personal?.fecha_ingreso_vc_ga 
      ? new Date(personal.fecha_ingreso_vc_ga).toLocaleDateString() 
      : 'No especificado';

    // Verificar salario
    const salarioBase = safeNumber(salary?.sueldo_base_vc_ga);
    if (salarioBase <= 0) {
      await modal_vc_ga.showWarning_vc_ga(
        'Salario no registrado', 
        'El empleado no tiene salario base registrado. Debe agregar un salario para continuar.'
      );
      
      document.querySelectorAll('.tab-btn:not([data-tab="salary"])').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      });
      
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
      document.getElementById('salary').classList.remove('hidden');
    } else {
      document.getElementById('salaryBase').value = salarioBase;
      document.getElementById('salaryVariable').value = safeNumber(salary?.sueldo_variable_vc_ga);
      
      try {
        const { faltantes, mensaje } = await verificarAportesLegales(employeeId);
        if (faltantes.length > 0) {
          await modal_vc_ga.showWarning_vc_ga('Aportes Faltantes', mensaje);
          await calcularAportesAutomaticos(employeeId);
        }
      } catch (error) {
        console.error("Error al verificar aportes:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudieron verificar los aportes legales');
      }
    }

    // Cargar y mostrar datos
    await cargarTiposDeduccion();
    await reloadSalaryHistory(employeeId);
    await reloadDeductionHistory(employeeId);
    await reloadExtrasHistory(employeeId);
    await reloadBonusHistory(employeeId);
    await reloadVacationHistory(employeeId);

    // Configurar eventos
    configurarEventos(employeeId);

  } catch (error) {
    console.error("Error en inicializarEmpleado:", error);
    await modal_vc_ga.showError_vc_ga('Error', `Ocurrió un error: ${error.message}`);
  }
}

// Funciones CRUD para Salario
async function addSalary(base, variable) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `INSERT INTO td_salario_historico_vc_ga (id_usuario_vc_ga, sueldo_base_vc_ga, sueldo_variable_vc_ga, fecha_inicio_vc_ga)
     VALUES (?, ?, ?, CURDATE())`,
    [id, safeNumber(base), safeNumber(variable)]
  );
  await reloadSalaryHistory(id);
}

async function editSalary(recordId, base, variable) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_salario_historico_vc_ga SET sueldo_base_vc_ga = ?, sueldo_variable_vc_ga = ? 
     WHERE id_salario_historico_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [safeNumber(base), safeNumber(variable), recordId, id]
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
    [id, typeId, safeNumber(amount)]
  );
  await reloadDeductionHistory(id);
}

async function editDeduction(recordId, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_usuario_deduccion_vc_ga SET monto_vc_ga = ? 
     WHERE id_usuario_deduccion_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [safeNumber(amount), recordId, id]
  );
  await reloadDeductionHistory(id);
}

async function deleteDeduction(recordId) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `DELETE FROM td_usuario_deduccion_vc_ga 
     WHERE id_usuario_deduccion_vc_ga = ? AND id_usuario_vc_ga = ?`,
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
    [id, type, safeNumber(hours), safeNumber(amount)]
  );
  await reloadExtrasHistory(id);
}

async function editExtra(recordId, hours, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_horas_extras_vc_ga SET cantidad_horas_vc_ga = ?, monto_vc_ga = ? 
     WHERE id_horas_extras_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [safeNumber(hours), safeNumber(amount), recordId, id]
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
    [id, type, safeNumber(amount)]
  );
  await reloadBonusHistory(id);
}

async function editBonus(recordId, amount) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_bono_vc_ga SET monto_vc_ga = ? WHERE id_bono_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [safeNumber(amount), recordId, id]
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
     VALUES (?, ?, ?, ?)`,
    [id, start, end, safeNumber(days)]
  );
  await reloadVacationHistory(id);
}

async function editVacation(recordId, start, end, days) {
  const id = getSessionEmployeeId();
  await query_vc_ga(
    `UPDATE td_vacaciones_vc_ga SET fecha_inicio_vc_ga = ?, fecha_fin_vc_ga = ?, dias_disfrutados_vc_ga = ? 
     WHERE id_vacaciones_vc_ga = ? AND id_usuario_vc_ga = ?`,
    [start, end, safeNumber(days), recordId, id]
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

// Funciones para recargar históricos
async function reloadSalaryHistory(id) {
  try {
    const [rows] = await query_vc_ga(
      'SELECT * FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC',
      [id]
    );

    const tbody = document.getElementById('salaryHistory');
    if (tbody) {
      tbody.innerHTML = (Array.isArray(rows) ? rows.map(r => {
        const base = safeNumber(r.sueldo_base_vc_ga);
        const variable = safeNumber(r.sueldo_variable_vc_ga);
        const inicio = r.fecha_inicio_vc_ga ? new Date(r.fecha_inicio_vc_ga).toLocaleDateString() : '';
        const fin = r.fecha_fin_vc_ga ? new Date(r.fecha_fin_vc_ga).toLocaleDateString() : 'Actual';
        
        return `
          <tr>
            <td>${inicio}</td>
            <td>${fin}</td>
            <td>${base.toFixed(2)}</td>
            <td>${variable.toFixed(2)}</td>
          </tr>
        `;
      }).join('') : '');
    }
  } catch (error) {
    console.error("Error en reloadSalaryHistory:", error);
    throw error;
  }
}

async function reloadDeductionHistory(id) {
  try {
    const [rows] = await query_vc_ga(
      `SELECT ud.id_usuario_deduccion_vc_ga, ud.fecha_aplicacion_vc_ga AS fecha, 
              d.nombre_vc_ga AS tipo, ud.monto_vc_ga AS monto
       FROM td_usuario_deduccion_vc_ga ud
       JOIN td_deduccion_vc_ga d ON ud.id_deduccion_vc_ga = d.id_deduccion_vc_ga
       WHERE ud.id_usuario_vc_ga = ? ORDER BY ud.fecha_aplicacion_vc_ga DESC`, 
      [id]
    );

    const tbody = document.getElementById('deductionHistory');
    if (tbody) {
      tbody.innerHTML = (Array.isArray(rows) ? rows.map(r => {
        const monto = safeNumber(r.monto);
        return `
          <tr>
            <td>${r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}</td>
            <td>${r.tipo || ''}</td>
            <td>${monto.toFixed(2)}</td>
          </tr>
        `;
      }).join('') : '');
    }
  } catch (error) {
    console.error("Error en reloadDeductionHistory:", error);
    throw error;
  }
}

async function reloadExtrasHistory(id) {
  try {
    const [rows] = await query_vc_ga(
      `SELECT id_horas_extras_vc_ga, fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, 
              cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
       FROM td_horas_extras_vc_ga 
       WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`,
      [id]
    );

    const tbody = document.getElementById('extrasHistory');
    if (tbody) {
      tbody.innerHTML = (Array.isArray(rows) ? rows.map(r => {
        const horas = safeNumber(r.horas);
        const monto = safeNumber(r.monto);
        return `
          <tr>
            <td>${r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}</td>
            <td>${r.tipo || ''}</td>
            <td>${horas}</td>
            <td>${monto.toFixed(2)}</td>
          </tr>
        `;
      }).join('') : '');
    }
  } catch (error) {
    console.error("Error en reloadExtrasHistory:", error);
    throw error;
  }
}

async function reloadBonusHistory(id) {
  try {
    const [rows] = await query_vc_ga(
      `SELECT id_bono_vc_ga, fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
       FROM td_bono_vc_ga 
       WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`,
      [id]
    );

    const tbody = document.getElementById('bonusHistory');
    if (tbody) {
      tbody.innerHTML = (Array.isArray(rows) ? rows.map(r => {
        const monto = safeNumber(r.monto);
        return `
          <tr>
            <td>${r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}</td>
            <td>${r.tipo || ''}</td>
            <td>${monto.toFixed(2)}</td>
          </tr>
        `;
      }).join('') : '');
    }
  } catch (error) {
    console.error("Error en reloadBonusHistory:", error);
    throw error;
  }
}

async function reloadVacationHistory(id) {
  try {
    const [rows] = await query_vc_ga(
      `SELECT id_vacaciones_vc_ga, fecha_inicio_vc_ga AS inicio, 
              fecha_fin_vc_ga AS fin, dias_disfrutados_vc_ga AS dias
       FROM td_vacaciones_vc_ga 
       WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC`,
      [id]
    );

    const tbody = document.getElementById('vacationHistory');
    if (tbody) {
      tbody.innerHTML = (Array.isArray(rows) ? rows.map(r => {
        const dias = safeNumber(r.dias);
        return `
          <tr>
            <td>${r.inicio ? new Date(r.inicio).toLocaleDateString() : ''}</td>
            <td>${r.fin ? new Date(r.fin).toLocaleDateString() : ''}</td>
            <td>${dias}</td>
          </tr>
        `;
      }).join('') : '');
    }

    // Actualizar resumen de vacaciones
    const totalDias = (Array.isArray(rows) ? rows.reduce((sum, r) => sum + safeNumber(r.dias), 0) : 0);
    document.getElementById('vacDaysUsed').textContent = totalDias;
    document.getElementById('vacDaysRight').textContent = 30; // Días disponibles

  } catch (error) {
    console.error("Error en reloadVacationHistory:", error);
    throw error;
  }
}

// Funciones auxiliares
async function displayEmployeeDetails(employeeId) {
  try {
    const [personal] = await query_vc_ga(
      `SELECT u.*, d.nombre_vc_ga AS nombre_departamento_vc_ga,
              r.nombre_vc_ga AS nombre_rol_vc_ga,
              c.nombre_vc_ga AS nombre_cargo_vc_ga
       FROM td_usuarios_vc_ga u
       LEFT JOIN td_departamento_vc_ga d ON u.id_departamento_vc_ga = d.id_departamento_vc_ga
       LEFT JOIN td_roles_vc_ga r ON u.id_rol_vc_ga = r.id_rol_vc_ga
       LEFT JOIN td_cargos_vc_ga c ON u.id_cargo_vc_ga = c.id_cargo_vc_ga
       WHERE u.id_usuario_vc_ga = ?`,
      [employeeId]
    );

    const [salary] = await query_vc_ga(
      `SELECT sueldo_base_vc_ga, sueldo_variable_vc_ga
       FROM td_salario_historico_vc_ga
       WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL`,
      [employeeId]
    );

    return { 
      personal: personal || {}, 
      salary: salary || null 
    };
  } catch (error) {
    console.error("Error en displayEmployeeDetails:", error);
    return { personal: {}, salary: null };
  }
}

async function verificarAportesLegales(employeeId) {
  const aportesRequeridos = ['IVSS', 'FAOV', 'INCES', 'RPE'];
  
  try {
    const [aportesExistentes] = await query_vc_ga(
      `SELECT d.nombre_vc_ga 
       FROM td_usuario_deduccion_vc_ga ud
       JOIN td_deduccion_vc_ga d ON ud.id_deduccion_vc_ga = d.id_deduccion_vc_ga
       WHERE ud.id_usuario_vc_ga = ? AND d.nombre_vc_ga IN (?)`,
      [employeeId, aportesRequeridos]
    );

    const nombresExistentes = (Array.isArray(aportesExistentes)) ? 
      aportesExistentes.map(ae => ae?.nombre_vc_ga).filter(Boolean) : [];

    if (nombresExistentes.length === 0) {
      return {
        faltantes: [...aportesRequeridos],
        mensaje: `Faltan todos los aportes obligatorios: ${aportesRequeridos.join(', ')}`
      };
    }

    const faltantes = aportesRequeridos.filter(a => !nombresExistentes.includes(a));

    return {
      faltantes,
      mensaje: faltantes.length > 0 
        ? `Faltan aportes obligatorios: ${faltantes.join(', ')}` 
        : 'Todos los aportes obligatorios están registrados'
    };
  } catch (error) {
    console.error("Error en verificarAportesLegales:", error);
    return {
      faltantes: [...aportesRequeridos],
      mensaje: "Error al verificar aportes legales"
    };
  }
}

async function calcularAportesAutomaticos(employeeId) {
  try {
    const [salarioData] = await query_vc_ga(
      'SELECT sueldo_base_vc_ga FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL',
      [employeeId]
    );
    
    const salarioBase = safeNumber(salarioData?.sueldo_base_vc_ga);
    if (salarioBase <= 0) {
      throw new Error("Salario base no válido para calcular aportes");
    }

    const [tiposDeduccionData] = await query_vc_ga(
      'SELECT id_deduccion_vc_ga, nombre_vc_ga FROM td_deduccion_vc_ga WHERE nombre_vc_ga IN ("IVSS", "FAOV", "INCES", "RPE")'
    );

    const tiposDeduccion = Array.isArray(tiposDeduccionData) ? tiposDeduccionData : [];
    if (tiposDeduccion.length === 0) {
      throw new Error("No se encontraron tipos de deducción configurados");
    }

    for (const tipo of tiposDeduccion) {
      if (!tipo?.id_deduccion_vc_ga || !tipo?.nombre_vc_ga) continue;

      let monto = 0;
      switch(tipo.nombre_vc_ga) {
        case 'IVSS': monto = salarioBase * 0.04; break;
        case 'FAOV': monto = salarioBase * 0.01; break;
        case 'INCES': monto = salarioBase * 0.005; break;
        case 'RPE': monto = salarioBase * 0.005; break;
        default: continue;
      }

      await query_vc_ga(
        `INSERT INTO td_usuario_deduccion_vc_ga 
         (id_usuario_vc_ga, id_deduccion_vc_ga, monto_vc_ga, fecha_aplicacion_vc_ga)
         SELECT ?, ?, ?, CURDATE()
         FROM dual
         WHERE NOT EXISTS (
           SELECT 1 FROM td_usuario_deduccion_vc_ga 
           WHERE id_usuario_vc_ga = ? AND id_deduccion_vc_ga = ?
         )`,
        [employeeId, tipo.id_deduccion_vc_ga, monto, employeeId, tipo.id_deduccion_vc_ga]
      );
    }
    return true;
  } catch (error) {
    console.error("Error en calcularAportesAutomaticos:", error);
    throw error;
  }
}

async function cargarTiposDeduccion() {
  try {
    const [tipos] = await query_vc_ga(
      'SELECT id_deduccion_vc_ga, nombre_vc_ga FROM td_deduccion_vc_ga WHERE nombre_vc_ga NOT IN ("IVSS", "FAOV", "INCES", "RPE")'
    );
    
    const select = document.getElementById('deductionType');
    if (select) {
      select.innerHTML = (Array.isArray(tipos)) ? tipos.map(t => 
        `<option value="${t.id_deduccion_vc_ga}">${t.nombre_vc_ga}</option>`
      ).join('') : '';
      
      // Agregar ISLR como opción especial
      const [islr] = await query_vc_ga(
        'SELECT id_deduccion_vc_ga FROM td_deduccion_vc_ga WHERE nombre_vc_ga = "ISLR" LIMIT 1'
      );
      if (islr?.id_deduccion_vc_ga) {
        select.innerHTML += `<option value="${islr.id_deduccion_vc_ga}">ISLR (Impuesto sobre la renta)</option>`;
      }
    }
  } catch (error) {
    console.error("Error en cargarTiposDeduccion:", error);
  }
}

// Configuración de eventos
function configurarEventos(employeeId) {
  // Configuración de eventos para salario
  const addSalaryBtn = document.getElementById('addSalaryBtn');
  if (addSalaryBtn) {
    addSalaryBtn.addEventListener('click', async () => {
      try {
        const base = safeNumber(document.getElementById('salaryBase').value);
        const variable = safeNumber(document.getElementById('salaryVariable').value);
        
        if (base <= 0) {
          await modal_vc_ga.showError_vc_ga('Error', 'El salario base debe ser mayor a 0');
          return;
        }
        
        await addSalary(base, variable);
        await calcularAportesAutomaticos(employeeId);
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
        
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Salario registrado correctamente');
      } catch (error) {
        console.error("Error al agregar salario:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudo agregar el salario');
      }
    });
  }

  const editSalaryBtn = document.getElementById('editSalaryBtn');
  if (editSalaryBtn) {
    editSalaryBtn.addEventListener('click', async () => {
      try {
        const base = safeNumber(document.getElementById('salaryBase').value);
        const variable = safeNumber(document.getElementById('salaryVariable').value);
        
        if (base <= 0) {
          await modal_vc_ga.showError_vc_ga('Error', 'El salario base debe ser mayor a 0');
          return;
        }
        
        const [currentSalary] = await query_vc_ga(
          'SELECT id_salario_historico_vc_ga FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL',
          [employeeId]
        );
        
        if (currentSalary?.id_salario_historico_vc_ga) {
          await editSalary(currentSalary.id_salario_historico_vc_ga, base, variable);
          await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Salario actualizado correctamente');
        } else {
          await modal_vc_ga.showError_vc_ga('Error', 'No hay salario actual para editar');
        }
      } catch (error) {
        console.error("Error al editar salario:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudo editar el salario');
      }
    });
  }

  // Configuración de eventos para deducciones
  const addDeductionBtn = document.getElementById('addDeductionBtn');
  if (addDeductionBtn) {
    addDeductionBtn.addEventListener('click', async () => {
      try {
        const typeId = document.getElementById('deductionType').value;
        const amount = safeNumber(document.getElementById('deductionAmount').value);
        
        if (!typeId || amount <= 0) {
          await modal_vc_ga.showError_vc_ga('Error', 'Complete todos los campos correctamente');
          return;
        }
        
        await addDeduction(typeId, amount);
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Deducción agregada correctamente');
      } catch (error) {
        console.error("Error al agregar deducción:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudo agregar la deducción');
      }
    });
  }

  // Configuración de eventos para horas extras
  const addExtraBtn = document.getElementById('addExtraBtn');
  if (addExtraBtn) {
    addExtraBtn.addEventListener('click', async () => {
      try {
        const type = document.getElementById('extraType').value;
        const hours = safeNumber(document.getElementById('extraHours').value);
        const amount = safeNumber(document.getElementById('extraAmount').value);
        
        if (!type || hours <= 0 || amount <= 0) {
          await modal_vc_ga.showError_vc_ga('Error', 'Complete todos los campos correctamente');
          return;
        }
        
        await addExtra(type, hours, amount);
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Horas extras registradas correctamente');
      } catch (error) {
        console.error("Error al agregar horas extras:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudieron registrar las horas extras');
      }
    });
  }

  // Configuración de eventos para bonos
  const addBonusBtn = document.getElementById('addBonusBtn');
  if (addBonusBtn) {
    addBonusBtn.addEventListener('click', async () => {
      try {
        const type = document.getElementById('bonusType').value;
        const amount = safeNumber(document.getElementById('bonusAmount').value);
        
        if (!type || amount <= 0) {
          await modal_vc_ga.showError_vc_ga('Error', 'Complete todos los campos correctamente');
          return;
        }
        
        await addBonus(type, amount);
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Bono registrado correctamente');
      } catch (error) {
        console.error("Error al agregar bono:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudo registrar el bono');
      }
    });
  }

  // Configuración de eventos para vacaciones
  const addVacationBtn = document.getElementById('addVacationBtn');
  if (addVacationBtn) {
    addVacationBtn.addEventListener('click', async () => {
      try {
        const start = document.getElementById('vacStart').value;
        const end = document.getElementById('vacEnd').value;
        const days = safeNumber(document.getElementById('vacDays').value);
        
        if (!start || !end || days <= 0) {
          await modal_vc_ga.showError_vc_ga('Error', 'Complete todos los campos correctamente');
          return;
        }
        
        await addVacation(start, end, days);
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Vacaciones registradas correctamente');
      } catch (error) {
        console.error("Error al agregar vacaciones:", error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudieron registrar las vacaciones');
      }
    });
  }
}

// Exportar todas las funciones
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
  verificarAportesLegales,
  calcularAportesAutomaticos,
  reloadSalaryHistory,
  reloadDeductionHistory,
  reloadExtrasHistory,
  reloadBonusHistory,
  reloadVacationHistory,
  selectedHTML_vc_ga
};