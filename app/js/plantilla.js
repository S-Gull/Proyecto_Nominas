//! planilla
const { modal_vc_ga } = require("./modal");
const { consulta_vc_ga } = require("../database/conexion");

class GestorUsuarios_vc_ga {
  constructor() {
    this.usuarios_vc_ga = [];
    this.departamentos_vc_ga = [];
    this.roles_vc_ga = [];
    this.cargos_vc_ga = [];
  }

  async cargarTodo_vc_ga() {
    try {
      await Promise.all([
        this.cargarUsuarios_vc_ga(),
        this.cargarOpcionesSelect_vc_ga()
      ]);
    } catch (error_vc_ga) {
      await modal_vc_ga.showError_vc_ga("Error de carga", "No se pudieron cargar los datos iniciales");
      throw error_vc_ga;
    }
  }

  async cargarUsuarios_vc_ga() {
    const sql_vc_ga = `SELECT u.*, 
                d.nombre_vc_ga as nombre_departamento_vc_ga,
                r.nombre_vc_ga as nombre_rol_vc_ga,
                c.nombre_vc_ga as nombre_cargo_vc_ga
                FROM td_usuarios_vc_ga u
                LEFT JOIN td_departamento_vc_ga d ON u.id_departamento_vc_ga = d.id_departamento_vc_ga
                LEFT JOIN td_roles_vc_ga r ON u.id_rol_vc_ga = r.id_rol_vc_ga
                LEFT JOIN td_cargos_vc_ga c ON u.id_cargo_vc_ga = c.id_cargo_vc_ga
                ORDER BY u.id_usuario_vc_ga DESC`;
    
    this.usuarios_vc_ga = await this._ejecutarConsulta_vc_ga(sql_vc_ga);
    return this.usuarios_vc_ga;
  }

async cargarOpcionesSelect_vc_ga() {
  try {
    const queries_vc_ga = {
      departamentos_vc_ga: "SELECT * FROM td_departamento_vc_ga ORDER BY nombre_vc_ga",
      roles_vc_ga: "SELECT * FROM td_roles_vc_ga ORDER BY nombre_vc_ga",
      cargos_vc_ga: "SELECT * FROM td_cargos_vc_ga ORDER BY nombre_vc_ga"
    };

    const [departamentos_vc_ga, roles_vc_ga, cargos_vc_ga] = await Promise.all([
      this._ejecutarConsulta_vc_ga(queries_vc_ga.departamentos_vc_ga),
      this._ejecutarConsulta_vc_ga(queries_vc_ga.roles_vc_ga),
      this._ejecutarConsulta_vc_ga(queries_vc_ga.cargos_vc_ga)
    ]);

    // Verificar que se obtuvieron resultados
    if (!departamentos_vc_ga || !roles_vc_ga || !cargos_vc_ga) {
      throw new Error('Error al cargar opciones de select');
    }

    this.departamentos_vc_ga = departamentos_vc_ga;
    this.roles_vc_ga = roles_vc_ga;
    this.cargos_vc_ga = cargos_vc_ga;

    return { departamentos_vc_ga, roles_vc_ga, cargos_vc_ga };
  } catch (error_vc_ga) {
    console.error('Error cargando opciones:', error_vc_ga);
    await modal_vc_ga.showError_vc_ga(
      'Error de carga', 
      'No se pudieron cargar las opciones de departamentos, roles y cargos'
    );
    throw error_vc_ga;
  }
}

async guardarUsuario_vc_ga(datos_vc_ga) {
  try {
    const esNuevo_vc_ga = !datos_vc_ga.id_usuario_vc_ga;
    
    // Validación básica de campos requeridos
    if (!datos_vc_ga.nombre_completo_vc_ga || !datos_vc_ga.cedula_vc_ga) {
      throw new Error('Nombre completo y cédula son campos obligatorios');
    }

    // Preparar datos para la base de datos
    const datosParaGuardar = {
      nombre_completo_vc_ga: datos_vc_ga.nombre_completo_vc_ga,
      cedula_vc_ga: datos_vc_ga.cedula_vc_ga,
      rif_vc_ga: datos_vc_ga.rif_vc_ga || null,
      fecha_nacimiento_vc_ga: datos_vc_ga.fecha_nacimiento_vc_ga 
        ? new Date(datos_vc_ga.fecha_nacimiento_vc_ga).toISOString().split('T')[0] 
        : null,
      fecha_ingreso_vc_ga: datos_vc_ga.fecha_ingreso_vc_ga 
        ? new Date(datos_vc_ga.fecha_ingreso_vc_ga).toISOString().split('T')[0] 
        : null,
      status_vc_ga: datos_vc_ga.status_vc_ga || 'Trabajando',
      correo_electronico_vc_ga: datos_vc_ga.correo_electronico_vc_ga || null,
      telefono_vc_ga: datos_vc_ga.telefono_vc_ga || null,
      id_departamento_vc_ga: datos_vc_ga.id_departamento_vc_ga || null,
      id_rol_vc_ga: datos_vc_ga.id_rol_vc_ga || null,
      id_cargo_vc_ga: datos_vc_ga.id_cargo_vc_ga || null
    };

    // Solo incluir clave si es nuevo usuario
    if (esNuevo_vc_ga) {
      datosParaGuardar.clave_vc_ga = datos_vc_ga.clave_vc_ga || 'Temp1234';
      datosParaGuardar.clave_temporal_vc_ga = true;
    }

    // Construir y ejecutar query
    const query = esNuevo_vc_ga 
      ? 'INSERT INTO td_usuarios_vc_ga SET ?'
      : 'UPDATE td_usuarios_vc_ga SET ? WHERE id_usuario_vc_ga = ?';
    
    const params = esNuevo_vc_ga 
      ? [datosParaGuardar] 
      : [datosParaGuardar, datos_vc_ga.id_usuario_vc_ga];

    const resultado = await this._ejecutarConsulta_vc_ga(query, params);
    
    // Recargar lista de usuarios
    await this.cargarUsuarios_vc_ga();

    return {
      exito: true,
      mensaje: esNuevo_vc_ga ? 'Usuario creado exitosamente' : 'Usuario actualizado exitosamente',
      id: esNuevo_vc_ga ? resultado.insertId : datos_vc_ga.id_usuario_vc_ga
    };

  } catch (error) {
    console.error('Error al guardar usuario:', {
      error: error.message,
      stack: error.stack,
      datos: datos_vc_ga
    });
    
    return {
      exito: false,
      mensaje: error.message || 'Error desconocido al guardar usuario'
    };
  }
}
async _validarReferencias_vc_ga(datos_vc_ga) {
  try {
    // Verificar departamento
    if (datos_vc_ga.id_departamento_vc_ga) {
      const depto = await this._ejecutarConsulta_vc_ga(
        'SELECT 1 FROM td_departamento_vc_ga WHERE id_departamento_vc_ga = ?', 
        [datos_vc_ga.id_departamento_vc_ga]
      );
      if (depto.length === 0) return false;
    }
    
    // Verificar rol
    if (datos_vc_ga.id_rol_vc_ga) {
      const rol = await this._ejecutarConsulta_vc_ga(
        'SELECT 1 FROM td_roles_vc_ga WHERE id_rol_vc_ga = ?', 
        [datos_vc_ga.id_rol_vc_ga]
      );
      if (rol.length === 0) return false;
    }
    
    // Verificar cargo
    if (datos_vc_ga.id_cargo_vc_ga) {
      const cargo = await this._ejecutarConsulta_vc_ga(
        'SELECT 1 FROM td_cargos_vc_ga WHERE id_cargo_vc_ga = ?', 
        [datos_vc_ga.id_cargo_vc_ga]
      );
      if (cargo.length === 0) return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validando referencias:', error);
    return false;
  }
}
  async eliminarUsuario_vc_ga(id_vc_ga) {
    try {
      const confirmacion_vc_ga = await modal_vc_ga.showConfirm_vc_ga(
        "Confirmar eliminación", 
        "¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer."
      );

      if (!confirmacion_vc_ga) return { exito_vc_ga: false, mensaje_vc_ga: "Cancelado por el usuario" };

      const sql_vc_ga = "DELETE FROM td_usuarios_vc_ga WHERE id_usuario_vc_ga = ?";
      await this._ejecutarConsulta_vc_ga(sql_vc_ga, [id_vc_ga]);
      await this.cargarUsuarios_vc_ga();

      return { exito_vc_ga: true, mensaje_vc_ga: "Usuario eliminado correctamente" };
    } catch (error_vc_ga) {
      await modal_vc_ga.showError_vc_ga("Error al eliminar", error_vc_ga.message);
      throw error_vc_ga;
    }
  }

async _ejecutarConsulta_vc_ga(sql_vc_ga, params_vc_ga = []) {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    consulta_vc_ga(sql_vc_ga, params_vc_ga, (err_vc_ga, results_vc_ga) => {
      if (err_vc_ga) {
        console.error("Error en consulta SQL:", {
          sql: sql_vc_ga,
          params: params_vc_ga,
          error: err_vc_ga
        });
        reject_vc_ga(new Error("Error al ejecutar consulta en la base de datos"));
      } else {
        resolve_vc_ga(results_vc_ga);
      }
    });
  });
}
_prepararDatosUsuario_vc_ga(datos_vc_ga, esNuevo_vc_ga = false) {
  const datosLimpios_vc_ga = {
    nombre_completo_vc_ga: datos_vc_ga.nombre_completo_vc_ga,
    cedula_vc_ga: datos_vc_ga.cedula_vc_ga,
    rif_vc_ga: datos_vc_ga.rif_vc_ga,
    fecha_nacimiento_vc_ga: this._formatearFecha_vc_ga(datos_vc_ga.fecha_nacimiento_vc_ga),
    fecha_ingreso_vc_ga: this._formatearFecha_vc_ga(datos_vc_ga.fecha_ingreso_vc_ga),
    status_vc_ga: this._mapearEstatus_vc_ga(datos_vc_ga.status_vc_ga),
    correo_electronico_vc_ga: datos_vc_ga.correo_electronico_vc_ga,
    telefono_vc_ga: datos_vc_ga.telefono_vc_ga,
    // Convertir a número y manejar valores vacíos
    id_departamento_vc_ga: datos_vc_ga.id_departamento_vc_ga ? Number(datos_vc_ga.id_departamento_vc_ga) : null,
    id_rol_vc_ga: datos_vc_ga.id_rol_vc_ga ? Number(datos_vc_ga.id_rol_vc_ga) : null,
    id_cargo_vc_ga: datos_vc_ga.id_cargo_vc_ga ? Number(datos_vc_ga.id_cargo_vc_ga) : null
  };

  if (esNuevo_vc_ga) {
    datosLimpios_vc_ga.clave_vc_ga = datos_vc_ga.clave_vc_ga || 'temp123';
  }

  return datosLimpios_vc_ga;
}

  _formatearFecha_vc_ga(fecha_vc_ga) {
    if (!fecha_vc_ga) return null;
    return new Date(fecha_vc_ga).toISOString().split('T')[0];
  }

  _mapearEstatus_vc_ga(estatus_vc_ga) {
    const opcionesValidas_vc_ga = ['Trabajando', 'De Vacaciones'];
    return opcionesValidas_vc_ga.includes(estatus_vc_ga) ? estatus_vc_ga : 'Trabajando';
  }
}

class PlantillaController_vc_ga {
  constructor() {
    this.gestor_vc_ga = new GestorUsuarios_vc_ga();
    this.inicializar_vc_ga();
  }

  async inicializar_vc_ga() {
    try {
      await this.gestor_vc_ga.cargarTodo_vc_ga();
      this.configurarEventos_vc_ga();
      this.mostrarUsuarios_vc_ga();
      this.actualizarOpcionesSelect_vc_ga();
    } catch (error_vc_ga) {
      console.error("Error inicializando:", error_vc_ga);
    }
  }

  configurarEventos_vc_ga() {
    document.getElementById('userForm')?.addEventListener('submit', (e_vc_ga) => this.manejarEnvioFormulario_vc_ga(e_vc_ga));
    document.getElementById('cancelEdit')?.addEventListener('click', () => this.cancelarEdicion_vc_ga());
  }

async manejarEnvioFormulario_vc_ga(e_vc_ga) {
  e_vc_ga.preventDefault();
  
  try {
    const datosFormulario_vc_ga = this.obtenerDatosFormulario_vc_ga();
    
    // Mostrar loader o estado de carga
    const submitBtn = e_vc_ga.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;

    const resultado_vc_ga = await this.gestor_vc_ga.guardarUsuario_vc_ga(datosFormulario_vc_ga);
    
    // Verificar si el resultado es válido
    if (!resultado_vc_ga) {
      throw new Error('No se recibió respuesta del servidor');
    }

    // Mostrar mensaje de éxito con validación
    const mensajeExito = resultado_vc_ga.mensaje_vc_ga || 
                        (resultado_vc_ga.exito_vc_ga ? 'Operación realizada con éxito' : 'Operación completada');
    
    await modal_vc_ga.showSuccess_vc_ga("Éxito", mensajeExito);
    
    this.limpiarFormulario_vc_ga();
    this.mostrarUsuarios_vc_ga();
  } catch (error_vc_ga) {
    console.error("Error guardando usuario:", error_vc_ga);
    
    // Manejar diferentes tipos de error
    let mensajeError = 'Ocurrió un error al guardar el usuario';
    if (error_vc_ga instanceof Error) {
      mensajeError = error_vc_ga.message;
    } else if (typeof error_vc_ga === 'string') {
      mensajeError = error_vc_ga;
    } else if (error_vc_ga?.message) {
      mensajeError = error_vc_ga.message;
    }

    await modal_vc_ga.showError_vc_ga("Error al guardar", mensajeError);
  } finally {
    // Restaurar el botón a su estado original
    const submitBtn = e_vc_ga.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> <span id="submitText">Guardar</span>';
      submitBtn.disabled = false;
    }
  }
}
  obtenerDatosFormulario_vc_ga() {
    const form_vc_ga = document.getElementById('userForm');
    return {
      id_usuario_vc_ga: form_vc_ga.id_usuario.value || null,
      nombre_completo_vc_ga: form_vc_ga.nombre_completo.value,
      cedula_vc_ga: form_vc_ga.cedula.value,
      rif_vc_ga: form_vc_ga.rif.value,
      fecha_nacimiento_vc_ga: form_vc_ga.fecha_nacimiento.value,
      fecha_ingreso_vc_ga: form_vc_ga.fecha_ingreso.value,
      status_vc_ga: form_vc_ga.status.value,
      correo_electronico_vc_ga: form_vc_ga.correo.value,
      telefono_vc_ga: form_vc_ga.telefono.value,
      clave_vc_ga: form_vc_ga.clave.value,
      id_departamento_vc_ga: form_vc_ga.id_departamento.value,
      id_rol_vc_ga: form_vc_ga.id_rol.value,
      id_cargo_vc_ga: form_vc_ga.id_cargo.value
    };
  }

  async mostrarUsuarios_vc_ga() {
    const contenedor_vc_ga = document.getElementById('users');
    if (!contenedor_vc_ga) return;

    if (this.gestor_vc_ga.usuarios_vc_ga.length === 0) {
      contenedor_vc_ga.innerHTML = `
        <div class="text-center py-10 text-gray-500 dark:text-gray-400">
          <i class="fas fa-user-slash text-2xl mb-2"></i>
          <p>No se encontraron usuarios</p>
        </div>`;
      return;
    }

    contenedor_vc_ga.innerHTML = this.gestor_vc_ga.usuarios_vc_ga.map(usuario_vc_ga => `
      <div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">${usuario_vc_ga.nombre_completo_vc_ga}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ${usuario_vc_ga.nombre_cargo_vc_ga} · ${usuario_vc_ga.nombre_departamento_vc_ga}
            </p>
            <div class="flex items-center mt-2">
              <span class="status-badge ${usuario_vc_ga.status_vc_ga === 'Trabajando' ? 'status-working' : 'status-vacation'}">
                ${usuario_vc_ga.status_vc_ga}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-3">
                <i class="fas fa-id-card mr-1"></i> ${usuario_vc_ga.cedula_vc_ga}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button class="edit-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600" 
                    data-id="${usuario_vc_ga.id_usuario_vc_ga}">
              <i class="fas fa-edit text-accent1"></i>
            </button>
            <button class="delete-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600" 
                    data-id="${usuario_vc_ga.id_usuario_vc_ga}">
              <i class="fas fa-trash text-red-500"></i>
            </button>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            <i class="fas fa-calendar-day mr-1"></i> Ingreso: ${this.formatearFechaLegible_vc_ga(usuario_vc_ga.fecha_ingreso_vc_ga)}
          </span>
          <span class="text-gray-500 dark:text-gray-400">
            ID: ${usuario_vc_ga.id_usuario_vc_ga}
          </span>
        </div>
      </div>
    `).join('');

    this.configurarEventosBotones_vc_ga();
  }

  configurarEventosBotones_vc_ga() {
    document.querySelectorAll('.edit-btn').forEach(btn_vc_ga => {
      btn_vc_ga.addEventListener('click', () => this.editarUsuario_vc_ga(btn_vc_ga.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn_vc_ga => {
      btn_vc_ga.addEventListener('click', () => this.eliminarUsuario_vc_ga(btn_vc_ga.dataset.id));
    });
  }

async editarUsuario_vc_ga(id_vc_ga) {
  const usuario_vc_ga = this.gestor_vc_ga.usuarios_vc_ga.find(u_vc_ga => u_vc_ga.id_usuario_vc_ga == id_vc_ga);
  if (!usuario_vc_ga) return;

  document.getElementById('formTitle').textContent = 'Editar Usuario';
  document.getElementById('submitText').textContent = 'Actualizar';
  document.getElementById('cancelEdit').classList.remove('hidden');

  const form_vc_ga = document.getElementById('userForm');
  form_vc_ga.id_usuario.value = usuario_vc_ga.id_usuario_vc_ga;
  form_vc_ga.nombre_completo.value = usuario_vc_ga.nombre_completo_vc_ga;
  form_vc_ga.cedula.value = usuario_vc_ga.cedula_vc_ga;
  form_vc_ga.rif.value = usuario_vc_ga.rif_vc_ga;
  
  // Formatear fechas correctamente
  if (usuario_vc_ga.fecha_nacimiento_vc_ga) {
    const fechaNac = new Date(usuario_vc_ga.fecha_nacimiento_vc_ga);
    form_vc_ga.fecha_nacimiento.value = fechaNac.toISOString().split('T')[0];
  }
  
  if (usuario_vc_ga.fecha_ingreso_vc_ga) {
    const fechaIng = new Date(usuario_vc_ga.fecha_ingreso_vc_ga);
    form_vc_ga.fecha_ingreso.value = fechaIng.toISOString().split('T')[0];
  }
  
  form_vc_ga.status.value = usuario_vc_ga.status_vc_ga;
  form_vc_ga.correo.value = usuario_vc_ga.correo_electronico_vc_ga;
  form_vc_ga.telefono.value = usuario_vc_ga.telefono_vc_ga;
  
  // Manejar posibles valores NULL
  form_vc_ga.id_departamento.value = usuario_vc_ga.id_departamento_vc_ga || '';
  form_vc_ga.id_rol.value = usuario_vc_ga.id_rol_vc_ga || '';
  form_vc_ga.id_cargo.value = usuario_vc_ga.id_cargo_vc_ga || '';

  // Animación
  const formCard_vc_ga = document.querySelector('.animate__fadeInLeft');
  formCard_vc_ga.classList.remove('animate__fadeInLeft');
  void formCard_vc_ga.offsetWidth;
  formCard_vc_ga.classList.add('animate__pulse');
  
  setTimeout(() => {
    formCard_vc_ga.classList.remove('animate__pulse');
    formCard_vc_ga.classList.add('animate__fadeInLeft');
  }, 500);
}

  async eliminarUsuario_vc_ga(id_vc_ga) {
    try {
      const resultado_vc_ga = await this.gestor_vc_ga.eliminarUsuario_vc_ga(id_vc_ga);
      if (resultado_vc_ga.exito_vc_ga) {
        await modal_vc_ga.showSuccess_vc_ga("Éxito", resultado_vc_ga.mensaje_vc_ga);
        this.mostrarUsuarios_vc_ga();
      }
    } catch (error_vc_ga) {
      console.error("Error eliminando usuario:", error_vc_ga);
    }
  }
// En el método actualizarOpcionesSelect_vc_ga de PlantillaController_vc_ga
actualizarOpcionesSelect_vc_ga() {
  // Asegurarse que los departamentos están cargados
  if (this.gestor_vc_ga.departamentos_vc_ga.length === 0) {
    console.error('No hay departamentos cargados');
    return;
  }

  // Actualizar cada select con validación
  this.actualizarSelect_vc_ga('id_departamento', this.gestor_vc_ga.departamentos_vc_ga);
  this.actualizarSelect_vc_ga('id_rol', this.gestor_vc_ga.roles_vc_ga);
  this.actualizarSelect_vc_ga('id_cargo', this.gestor_vc_ga.cargos_vc_ga);
}

actualizarSelect_vc_ga(idSelect_vc_ga, opciones_vc_ga) {
  const select_vc_ga = document.getElementById(idSelect_vc_ga);
  if (!select_vc_ga) {
    console.error(`Elemento select con ID ${idSelect_vc_ga} no encontrado`);
    return;
  }

  select_vc_ga.innerHTML = `
    <option value="">Seleccione una opción</option>
    ${opciones_vc_ga.map(opcion_vc_ga => `
      <option value="${opcion_vc_ga[`id_${idSelect_vc_ga.split('_')[1]}_vc_ga`]}">
        ${opcion_vc_ga.nombre_vc_ga}
      </option>
    `).join('')}
  `;
}

  formatearFechaLegible_vc_ga(fecha_vc_ga) {
    if (!fecha_vc_ga) return 'N/A';
    const opciones_vc_ga = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha_vc_ga).toLocaleDateString('es-ES', opciones_vc_ga);
  }

limpiarFormulario_vc_ga() {
//   const form = document.getElementById('userForm');
//   if (!form) return;

//   form.reset();
//   document.getElementById('id_usuario').value = '';
//   document.getElementById('formTitle').textContent = 'Agregar Usuario';
//   document.getElementById('submitText').textContent = 'Guardar';
//   document.getElementById('cancelEdit').classList.add('hidden');
  
//   // Restablecer selects
//   const selects = ['id_departamento', 'id_rol', 'id_cargo'];
//   selects.forEach(id => {
//     const select = document.getElementById(id);
//     if (select) select.value = '';
//   });

location.href = './plantilla.html'
}
  cancelarEdicion_vc_ga() {
    this.limpiarFormulario_vc_ga();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('plantilla')) {
    new PlantillaController_vc_ga();
  }
});

module.exports = { PlantillaController_vc_ga, GestorUsuarios_vc_ga };