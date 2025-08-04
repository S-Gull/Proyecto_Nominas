const { query_vc_ga } = require("../database/conexion");
const { GestorSesion_vc_ga } = require("./login");
const { modal_vc_ga } = require("./modal");

const empleadoHTML_vc_ga = document.getElementById('employee-view');
const salarioInput_vc_ga = document.getElementById('salaryBase');
const editarSalarioBtn_vc_ga = document.getElementById('editSalaryBtn');
const deduccionSelect_vc_ga = document.getElementById('deductionType');
const deduccionInput_vc_ga = document.getElementById('deductionAmount')
const agregarDeduccionBtn_vc_ga = document.getElementById('addDeductionBtn');
const editarDeduccionBtn_vc_ga = document.getElementById('editDeductionBtn');
const borrarDeduccionBtn_vc_ga = document.getElementById('deleteDeductionBtn');
const agregarBonoBtn_vc_ga = document.getElementById('addBonusBtn');
const editarBonoBtn_vc_ga = document.getElementById('editBonusBtn');
const borrarBonoBtn_vc_ga = document.getElementById('deleteBonusBtn');

// 1. Capa de Repositorio
class EmpleadoRepositorio_vc_ga {
    async obtenerDetallesEmpleado_vc_ga(idEmpleado_vc_ga) {
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
        return await query_vc_ga(sql_vc_ga, [idEmpleado_vc_ga]);
    }

    async obtenerHistorialSalario_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT id_salario_vc_ga, salario_vc_ga 
             FROM td_salario_historico_vc_ga 
             WHERE id_usuario_vc_ga = ? 
             ORDER BY id_salario_vc_ga DESC
             LIMIT 1`,
            [id_vc_ga]
        );
    }


    async actualizarSalario_vc_ga(idSalario, salario) {
      return await query_vc_ga(
            `UPDATE td_salario_historico_vc_ga 
             SET salario_vc_ga = ? 
             WHERE id_salario_vc_ga = ?`,
            [salario, idSalario]
        );
    }

    async obtenerHistorialDeducciones_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_aplicacion_vc_ga AS fecha, d.nombre_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_usuario_deduccion_vc_ga ud
             JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
             WHERE id_usuario_vc_ga = ? ORDER BY fecha_aplicacion_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe, vigenteHasta = null) {
    return await query_vc_ga(
        `INSERT INTO td_deduccion_vc_ga 
         (nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga, vigente_desde_vc_ga, vigente_hasta_vc_ga)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, porcentaje, descripcion, vigenteDe, vigenteHasta]
    );
}

    async crearDeduccionUsuario_vc_ga(idUsuario, idDeduccion, monto, fecha) {
    return await query_vc_ga(
        `INSERT INTO td_usuario_deduccion_vc_ga
        (id_usuario_vc_ga, id_deduccion_vc_ga, monto_vc_ga, fecha_aplicacion_vc_ga)
        VALUES (?, ?, ?, ?)`,
        [idUsuario, idDeduccion, monto, fecha]
    );
    }

    async actualizarDeduccionUsuario_vc_ga(idReg, monto, fecha) {
    return await query_vc_ga(
        `UPDATE td_usuario_deduccion_vc_ga
        SET monto_vc_ga = ?, fecha_aplicacion_vc_ga = ?
        WHERE id_usuario_deduccion_vc_ga = ?`,
        [monto, fecha, idReg]
    );
    }

    async eliminarDeduccionUsuario_vc_ga(idReg) {
    return await query_vc_ga(
        'DELETE FROM td_usuario_deduccion_vc_ga WHERE id_usuario_deduccion_vc_ga = ?',
        [idReg]
    );
    }

    async obtenerHistorialBonos_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_bono_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    // Métodos actualizados para usar las funciones de BD para bonos
    async crearBono_vc_ga(idUsuario, tipo, monto, fecha) {
        const resultado = await query_vc_ga(
            'SELECT fn_insertar_bono_vc_ga(?, ?, ?, ?) as bono_id',
            [idUsuario, tipo, monto, fecha]
        );
        
        if (resultado[0].bono_id === -1) {
            throw new Error('Usuario no existe');
        }
        
        return resultado[0].bono_id;
    }

    async actualizarBono_vc_ga(idBono, idUsuario, tipo, monto, fecha) {
        const resultado = await query_vc_ga(
            'SELECT fn_editar_bono_vc_ga(?, ?, ?, ?, ?) as success',
            [idBono, idUsuario, tipo, monto, fecha]
        );
        
        if (!resultado[0].success) {
            throw new Error('No se pudo actualizar el bono. Verifique que el bono y usuario existan.');
        }
        
        return resultado[0].success;
    }

    async eliminarBono_vc_ga(idBono) {
        const resultado = await query_vc_ga(
            'SELECT fn_eliminar_bono_vc_ga(?) as success',
            [idBono]
        );
        
        if (!resultado[0].success) {
            throw new Error('No se pudo eliminar el bono. Verifique que el bono exista.');
        }
        
        return resultado[0].success;
    }

    // Método para obtener bonos con ID para operaciones CRUD
    async obtenerHistorialBonosConId_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT id_bono_vc_ga, fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_bono_vc_ga 
             WHERE id_usuario_vc_ga = ? 
             ORDER BY fecha_pago_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    
    async obtenerHistorialDeducciones_vc_ga(id_vc_ga) {
    return await query_vc_ga(
        `SELECT ud.id_usuario_deduccion_vc_ga, 
                fecha_aplicacion_vc_ga AS fecha, 
                d.nombre_vc_ga AS tipo, 
                monto_vc_ga AS monto,
                d.id_deduccion_vc_ga
         FROM td_usuario_deduccion_vc_ga ud
         JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
         WHERE id_usuario_vc_ga = ? 
         ORDER BY fecha_aplicacion_vc_ga DESC`,
        [id_vc_ga]
    );
}

// 2. Obtener todas las deducciones disponibles para el select
async obtenerDeduccionesDisponibles_vc_ga() {
    return await query_vc_ga(
        `SELECT id_deduccion_vc_ga, 
                nombre_vc_ga, 
                porcentaje_vc_ga, 
                descripcion_vc_ga
         FROM td_deduccion_vc_ga 
         WHERE (vigente_hasta_vc_ga IS NULL OR vigente_hasta_vc_ga >= CURDATE())
           AND vigente_desde_vc_ga <= CURDATE()
         ORDER BY nombre_vc_ga`,
        []
    );
}

// 3. Obtener detalles específicos de una deducción
async obtenerDeduccionPorId_vc_ga(idDeduccion) {
    return await query_vc_ga(
        `SELECT id_deduccion_vc_ga, 
                nombre_vc_ga, 
                porcentaje_vc_ga, 
                descripcion_vc_ga,
                vigente_desde_vc_ga,
                vigente_hasta_vc_ga
         FROM td_deduccion_vc_ga 
         WHERE id_deduccion_vc_ga = ?`,
        [idDeduccion]
    );
}

// 4. Verificar si ya existe una deducción del mismo tipo para un usuario
async verificarDeduccionExistente_vc_ga(idUsuario, idDeduccion) {
    return await query_vc_ga(
        `SELECT COUNT(*) as cantidad
         FROM td_usuario_deduccion_vc_ga 
         WHERE id_usuario_vc_ga = ? AND id_deduccion_vc_ga = ?`,
        [idUsuario, idDeduccion]
    );
}

// 5. Obtener el total de deducciones de un usuario para un período específico
async obtenerTotalDeduccionesPeriodo_vc_ga(idUsuario, fechaInicio, fechaFin) {
    return await query_vc_ga(
        `SELECT SUM(monto_vc_ga) as total_deducciones,
                COUNT(*) as cantidad_deducciones
         FROM td_usuario_deduccion_vc_ga 
         WHERE id_usuario_vc_ga = ? 
           AND fecha_aplicacion_vc_ga BETWEEN ? AND ?`,
        [idUsuario, fechaInicio, fechaFin]
    );
}

// 6. Obtener deducciones por tipo
async obtenerDeduccionesPorTipo_vc_ga(idUsuario, idDeduccion) {
    return await query_vc_ga(
        `SELECT ud.id_usuario_deduccion_vc_ga,
                ud.monto_vc_ga,
                ud.fecha_aplicacion_vc_ga,
                d.nombre_vc_ga AS tipo_deduccion
         FROM td_usuario_deduccion_vc_ga ud
         JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
         WHERE ud.id_usuario_vc_ga = ? AND ud.id_deduccion_vc_ga = ?
         ORDER BY ud.fecha_aplicacion_vc_ga DESC`,
        [idUsuario, idDeduccion]
    );
}

// 7. Búsqueda de deducciones con filtros
async buscarDeducciones_vc_ga(idUsuario, filtros = {}) {
    let sql = `
        SELECT ud.id_usuario_deduccion_vc_ga,
               ud.monto_vc_ga,
               ud.fecha_aplicacion_vc_ga,
               d.nombre_vc_ga AS tipo,
               d.descripcion_vc_ga
        FROM td_usuario_deduccion_vc_ga ud
        JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
        WHERE ud.id_usuario_vc_ga = ?
    `;
    
    const params = [idUsuario];
    
    if (filtros.fechaInicio) {
        sql += ` AND ud.fecha_aplicacion_vc_ga >= ?`;
        params.push(filtros.fechaInicio);
    }
    
    if (filtros.fechaFin) {
        sql += ` AND ud.fecha_aplicacion_vc_ga <= ?`;
        params.push(filtros.fechaFin);
    }
    
    if (filtros.tipoDeduccion) {
        sql += ` AND ud.id_deduccion_vc_ga = ?`;
        params.push(filtros.tipoDeduccion);
    }
    
    if (filtros.montoMinimo) {
        sql += ` AND ud.monto_vc_ga >= ?`;
        params.push(filtros.montoMinimo);
    }
    
    if (filtros.montoMaximo) {
        sql += ` AND ud.monto_vc_ga <= ?`;
        params.push(filtros.montoMaximo);
    }
    
    sql += ` ORDER BY ud.fecha_aplicacion_vc_ga DESC`;
    
    if (filtros.limite) {
        sql += ` LIMIT ?`;
        params.push(filtros.limite);
    }
    
    return await query_vc_ga(sql, params);
}

// 8. Obtener estadísticas de deducciones
async obtenerEstadisticasDeducciones_vc_ga(idUsuario) {
    return await query_vc_ga(
        `SELECT 
            COUNT(*) as total_registros,
            SUM(monto_vc_ga) as total_monto,
            AVG(monto_vc_ga) as promedio_monto,
            MIN(monto_vc_ga) as monto_minimo,
            MAX(monto_vc_ga) as monto_maximo,
            MIN(fecha_aplicacion_vc_ga) as primera_deduccion,
            MAX(fecha_aplicacion_vc_ga) as ultima_deduccion
         FROM td_usuario_deduccion_vc_ga 
         WHERE id_usuario_vc_ga = ?`,
        [idUsuario]
    );
    
}
async buscarDeduccionPorNombre_vc_ga(nombre) {
    return await query_vc_ga(
        `SELECT id_deduccion_vc_ga, nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga
         FROM td_deduccion_vc_ga 
         WHERE LOWER(nombre_vc_ga) = LOWER(?)
           AND (vigente_hasta_vc_ga IS NULL OR vigente_hasta_vc_ga >= CURDATE())`,
        [nombre]
    );
}
}

// 2. Capa de Servicio
class EmpleadoServicio_vc_ga {
    constructor(repositorio_vc_ga) {
        this.repositorio_vc_ga = repositorio_vc_ga;
    }
    async obtenerDetallesEmpleado_vc_ga(idEmpleado_vc_ga) {
        const [personal_vc_ga] = await this.repositorio_vc_ga.obtenerDetallesEmpleado_vc_ga(idEmpleado_vc_ga);
        return { personal_vc_ga };
    }

    async obtenerHistorialSalario_vc_ga(id_vc_ga) {
        return await this.repositorio_vc_ga.obtenerHistorialSalario_vc_ga(id_vc_ga);
    }


    async actualizarSalario_vc_ga(idUsuario, nuevoSalario) {
        // Validaciones más robustas
        console.log(idUsuario,"Idusuario");
        console.log(nuevoSalario,"nuevoSalario");
        if (typeof nuevoSalario !== 'number' || isNaN(nuevoSalario) || nuevoSalario <= 0) {
            throw new Error("El salario debe ser un número positivo válido");
        }

        // Primero verificamos si el usuario ya tiene un salario registrado
         const id = sessionStorage.getItem("selectedUserId")
        const historialSalario = await this.obtenerHistorialSalario_vc_ga(id);
        console.log(historialSalario);
        
        if (historialSalario.length > 0) {
            // Si existe, actualizamos el registro existente
            const idSalario = historialSalario[0].id_salario_vc_ga;
            return await this.repositorio_vc_ga.actualizarSalario_vc_ga(idSalario, nuevoSalario);
        } else {
            // Si no existe, creamos un nuevo registro
            // Nota: Necesitarías descomentar y completar el método crearSalario_vc_ga en el repositorio
            throw new Error("No se encontró registro de salario para este empleado");
            // return await this.repositorio_vc_ga.crearSalario_vc_ga(idUsuario, nuevoSalario);
        }
    }

    async obtenerHistorialDeducciones_vc_ga(id_vc_ga) {
        return await this.repositorio_vc_ga.obtenerHistorialDeducciones_vc_ga(id_vc_ga);
    }

    async obtenerHistorialBonos_vc_ga(id_vc_ga) {
        return await this.repositorio_vc_ga.obtenerHistorialBonos_vc_ga(id_vc_ga);
    }
    async crearDeduccionUsuario_vc_ga(...args) { return await this.repositorio_vc_ga.crearDeduccionUsuario_vc_ga(...args); }
    async actualizarDeduccionUsuario_vc_ga(...args) { return await this.repositorio_vc_ga.actualizarDeduccionUsuario_vc_ga(...args); }
    async eliminarDeduccionUsuario_vc_ga(idReg) { return await this.repositorio_vc_ga.eliminarDeduccionUsuario_vc_ga(idReg); }
    async crearBono_vc_ga(...args) { return await this.repositorio_vc_ga.crearBono_vc_ga(...args); }
    async actualizarBono_vc_ga(...args) { return await this.repositorio_vc_ga.actualizarBono_vc_ga(...args); }
    async eliminarBono_vc_ga(idReg) { return await this.repositorio_vc_ga.eliminarBono_vc_ga(idReg); }

    async crearDeduccionUsuario_vc_ga(idUsuario, idDeduccion, monto, fecha) {
    return await this.repositorio_vc_ga.crearDeduccionUsuario_vc_ga(idUsuario, idDeduccion, monto, fecha);
}

async actualizarDeduccionUsuario_vc_ga(idReg, monto, fecha) {
    return await this.repositorio_vc_ga.actualizarDeduccionUsuario_vc_ga(idReg, monto, fecha);
}

async eliminarDeduccionUsuario_vc_ga(idReg) {
    return await this.repositorio_vc_ga.eliminarDeduccionUsuario_vc_ga(idReg);
}

async obtenerDeduccionesDisponibles_vc_ga() {
    return await this.repositorio_vc_ga.obtenerDeduccionesDisponibles_vc_ga();
}

async verificarDeduccionExistente_vc_ga(idUsuario, idDeduccion) {
    return await this.repositorio_vc_ga.verificarDeduccionExistente_vc_ga(idUsuario, idDeduccion);
}

async obtenerEstadisticasDeducciones_vc_ga(idUsuario) {
    return await this.repositorio_vc_ga.obtenerEstadisticasDeducciones_vc_ga(idUsuario);
}

async crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe) {
    return await this.repositorio_vc_ga.crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe);
}

}

// 3. Capa de Controlador
class EmpleadoControlador_vc_ga {
    constructor(servicio_vc_ga) {
        this.servicio_vc_ga = servicio_vc_ga;
        this.idEmpleado_vc_ga = null;
        this.recibosController_vc_ga = new EmpleadoRecibosControlador_vc_ga(servicio_vc_ga);

        this.configurarBotonesSalario_vc_ga();
        this.configurarBotonesDeducciones_vc_ga();
        this.configurarBotonesBonos_vc_ga();

    }

        //CRUD SALARIO
        async actualizarSalario_vc_ga(idSalario, salario) { return await this.servicio_vc_ga.actualizarSalario_vc_ga(idSalario, salario); }

        //CRUD DEDUCCIONES
        async crearDeduccion_vc_ga(idDeduccion, monto, fecha) {
        return await this.servicio_vc_ga.crearDeduccionUsuario_vc_ga(this.idEmpleado_vc_ga, idDeduccion, monto, fecha);
        }
        async actualizarDeduccion_vc_ga(idReg, monto, fecha) {
        return await this.servicio_vc_ga.actualizarDeduccionUsuario_vc_ga(idReg, monto, fecha);
        }
        async eliminarDeduccion_vc_ga(idReg) {
        return await this.servicio_vc_ga.eliminarDeduccionUsuario_vc_ga(idReg);
        }

        // CRUD BONOS
        async crearBono_vc_ga(tipo, monto, fecha) {
        return await this.servicio_vc_ga.crearBono_vc_ga(this.idEmpleado_vc_ga, tipo, monto, fecha);
        }
        async actualizarBono_vc_ga(idReg, tipo, monto, fecha) {
        return await this.servicio_vc_ga.actualizarBono_vc_ga(idReg, tipo, monto, fecha);
        }
        async eliminarBono_vc_ga(idReg) {
        return await this.servicio_vc_ga.eliminarBono_vc_ga(idReg);
        }
        
        configurarBotonesSalario_vc_ga() {
    editarSalarioBtn_vc_ga?.addEventListener('click', () => this.manejarEditarSalario_vc_ga());
}
        configurarBotonesDeducciones_vc_ga() {

            agregarDeduccionBtn_vc_ga?.addEventListener('click', () => this.manejarAgregarDeduccion_vc_ga());
            editarDeduccionBtn_vc_ga?.addEventListener('click', () => this.manejarEditarDeduccion_vc_ga());
            borrarDeduccionBtn_vc_ga?.addEventListener('click', () => this.manejarBorrarDeduccion_vc_ga());
        }
        configurarBotonesBonos_vc_ga() {
    agregarBonoBtn_vc_ga?.addEventListener('click', () => this.manejarAgregarBono_vc_ga());
    editarBonoBtn_vc_ga?.addEventListener('click', () => this.manejarEditarBono_vc_ga());
    borrarBonoBtn_vc_ga?.addEventListener('click', () => this.manejarBorrarBono_vc_ga());
}
/**
 * Muestra un modal con campo de entrada
 */
async mostrarModalInputOscuro_vc_ga(titulo, mensaje, valorPredeterminado = '') {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'mt-4';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'w-full p-2 border rounded bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500';
        input.value = valorPredeterminado;
        input.placeholder = 'Ingrese el valor';
        
        container.appendChild(input);
        
        modal_vc_ga.show_vc_ga(titulo, mensaje, 'reportes', true)
            .then((confirmed) => {
                if (confirmed) {
                    resolve(input.value);
                } else {
                    resolve(null);
                }
            });
        
        modal_vc_ga.modalMessage_vc_ga.appendChild(container);
        input.focus();
    });
}

/**
 * Muestra un select con opciones en modo oscuro (para editar/borrar)
 */
async mostrarSelectOscuro_vc_ga(titulo, mensaje, opciones) {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'mt-4';
        
        const select = document.createElement('select');
        select.className = 'w-full p-2 border rounded bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500';
        
        opciones.forEach((opcion, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = opcion.texto;
            select.appendChild(option);
        });
        
        container.appendChild(select);
        
        modal_vc_ga.show_vc_ga(titulo, mensaje, 'reportes', true)
            .then((confirmed) => {
                if (confirmed) {
                    resolve({
                        indice: select.value,
                        confirmado: true
                    });
                } else {
                    resolve({ confirmado: false });
                }
            });
        
        modal_vc_ga.modalMessage_vc_ga.appendChild(container);
        select.focus();
    });
}

/**
 * Maneja la acción de editar salario
 */
async manejarEditarSalario_vc_ga() {
    try {
        // 1. Obtener el valor actual del input
        const salarioActual = salarioInput_vc_ga.value;
        
        // 2. Validar que haya un valor en el input
        if (!salarioActual || isNaN(salarioActual)) {
            await modal_vc_ga.showError_vc_ga('Error', 'El salario actual no es válido o está vacío');
            return;
        }

        // 3. Mostrar modal de confirmación simple
        const confirmado = await modal_vc_ga.show_vc_ga(
            'Confirmar Edición',
            `¿Desea actualizar el salario base a ${salarioActual}?`,
            'warning', // Tipo de modal para confirmación
            true // Mostrar botones OK/Cancelar
        );

        if (!confirmado) return;

        // 4. Obtener el historial para encontrar el ID del salario actual
        const historial = await this.servicio_vc_ga.obtenerHistorialSalario_vc_ga(this.idEmpleado_vc_ga);
        
        if (!historial || historial.length === 0) {
            throw new Error("No se encontró registro de salario para este empleado");
        }

        // 5. Actualizar el salario
        await this.actualizarSalario_vc_ga(
            historial[0].id_salario_vc_ga, 
            parseFloat(salarioActual)
        );

        // 6. Recargar el historial
        await this.recargarHistorialSalario_vc_ga();

        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Salario base actualizado correctamente');
        
    } catch (error) {
        await modal_vc_ga.showError_vc_ga('Error', `No se pudo editar el salario: ${error.message}`);
        console.error('Error al editar salario:', error);
    }
}

// Función completamente nueva para manejarAgregarDeduccion_vc_ga que maneja input de texto
async manejarAgregarDeduccion_vc_ga() {
    try {
        // 1️⃣ Obtener datos del formulario
        const nombreDeduccion = deduccionSelect_vc_ga.value.trim();
        const monto = parseFloat(deduccionInput_vc_ga.value);
        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0]; // YYYY-MM-DD

        // Validaciones básicas
        if (!nombreDeduccion) {
            await modal_vc_ga.showWarning_vc_ga(
                'Nombre requerido',
                'Por favor escribe el nombre de la deducción.'
            );
            return;
        }
        if (!monto || isNaN(monto) || monto <= 0) {
            await modal_vc_ga.showWarning_vc_ga(
                'Monto inválido',
                'El monto debe ser un número positivo.'
            );
            return;
        }

        // 2️⃣ Buscar ID de la deducción por nombre
        const deduccionesDisponibles = await this.servicio_vc_ga.obtenerDeduccionesDisponibles_vc_ga();
        let deduccionEncontrada = deduccionesDisponibles.find(
            d => d.nombre_vc_ga.toLowerCase() === nombreDeduccion.toLowerCase()
        );

        // 3️⃣ Si no existe la deducción, preguntar si se quiere crear
        if (!deduccionEncontrada) {
            const confirmCrear = await modal_vc_ga.showConfirm_vc_ga(
                'Deducción no encontrada',
                `No se encontró la deducción "${nombreDeduccion}". ¿Deseas crearla ahora?`
            );

            if (!confirmCrear) {
                return; // Usuario canceló
            }

            // Crear deducción básica sin porcentaje y sin fecha fin
            await this.servicio_vc_ga.repositorio_vc_ga.crearTipoDeduccion_vc_ga(
                nombreDeduccion,
                0, // porcentaje
                'Creada automáticamente desde el formulario',
                fecha,
                null
            );

            // Volver a buscar para obtener su ID
            const nuevasDeducciones = await this.servicio_vc_ga.obtenerDeduccionesDisponibles_vc_ga();
            deduccionEncontrada = nuevasDeducciones.find(
                d => d.nombre_vc_ga.toLowerCase() === nombreDeduccion.toLowerCase()
            );

            if (!deduccionEncontrada) {
                await modal_vc_ga.showError_vc_ga(
                    'Error',
                    'No se pudo crear la deducción.'
                );
                return;
            }
        }

        const idDeduccion = deduccionEncontrada.id_deduccion_vc_ga;

        // 4️⃣ Verificar si ya existe para este empleado
        const existe = await this.servicio_vc_ga.verificarDeduccionExistente_vc_ga(
            this.idEmpleado_vc_ga,
            idDeduccion
        );

        if (existe[0]?.cantidad > 0) {
            await modal_vc_ga.showWarning_vc_ga(
                'Duplicado',
                'Este empleado ya tiene una deducción de este tipo.'
            );
            return;
        }

        // 5️⃣ Insertar la deducción
        await this.servicio_vc_ga.crearDeduccionUsuario_vc_ga(
            this.idEmpleado_vc_ga,
            idDeduccion,
            monto,
            fecha
        );

        // 6️⃣ Recargar tabla/lista de deducciones
        const deducciones = await this.servicio_vc_ga.obtenerHistorialDeducciones_vc_ga(this.idEmpleado_vc_ga);
        this.actualizarTablaDeducciones_vc_ga(deducciones);

        await modal_vc_ga.showSuccess_vc_ga(
            '¡Deducción agregada!',
            'La deducción se registró correctamente.'
        );
    } catch (error) {
        console.error('❌ Error al agregar deducción:', error);
        await modal_vc_ga.showError_vc_ga(
            'Error inesperado',
            'Ocurrió un error al agregar la deducción.'
        );
    }
}


// Nueva función para buscar deducción por nombre
async buscarDeduccionPorNombre_vc_ga(nombre) {
    try {
        const resultado = await this.servicio_vc_ga.repositorio_vc_ga.buscarDeduccionPorNombre_vc_ga(nombre);
        return resultado.length > 0 ? resultado[0] : null;
    } catch (error) {
        console.error('Error buscando deducción por nombre:', error);
        return null;
    }
}

// Nueva función para crear tipo de deducción
async crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe) {
    return await this.servicio_vc_ga.crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe);
}

// Agregar al EmpleadoRepositorio_vc_ga:
async buscarDeduccionPorNombre_vc_ga(nombre) {
    return await query_vc_ga(
        `SELECT id_deduccion_vc_ga, nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga
         FROM td_deduccion_vc_ga 
         WHERE LOWER(nombre_vc_ga) = LOWER(?)
           AND (vigente_hasta_vc_ga IS NULL OR vigente_hasta_vc_ga >= CURDATE())`,
        [nombre]
    );
}

// Agregar al EmpleadoServicio_vc_ga:
async crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe) {
    return await this.repositorio_vc_ga.crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe);
}

// Función opcional para autocompletar deducciones existentes
// Función corregida para manejarAgregarDeduccion_vc_ga


// Función corregida para buscar deducción por nombre
async buscarDeduccionPorNombre_vc_ga(nombre) {
    try {
        console.log('Ejecutando búsqueda por nombre:', nombre);
        const resultado = await this.servicio_vc_ga.repositorio_vc_ga.buscarDeduccionPorNombre_vc_ga(nombre);
        console.log('Resultado de repositorio:', resultado);
        
        // Devolver el resultado tal como viene del repositorio
        return resultado;
    } catch (error) {
        console.error('Error buscando deducción por nombre:', error);
        return [];
    }
}

// Asegurar que el método crearTipoDeduccion_vc_ga existe en el repositorio
// Agregar al EmpleadoRepositorio_vc_ga si no está:
async crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe, vigenteHasta = null) {
    console.log('Creando tipo de deducción en BD:', { nombre, porcentaje, descripcion, vigenteDe, vigenteHasta });
    
    const resultado = await query_vc_ga(
        `INSERT INTO td_deduccion_vc_ga 
         (nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga, vigente_desde_vc_ga, vigente_hasta_vc_ga)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, porcentaje, descripcion, vigenteDe, vigenteHasta]
    );
    
    console.log('Resultado de inserción de tipo de deducción:', resultado);
    return resultado;
}

// Y agregar al EmpleadoServicio_vc_ga si no está:
async crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe) {
    return await this.repositorio_vc_ga.crearTipoDeduccion_vc_ga(nombre, porcentaje, descripcion, vigenteDe);
}

// Función de debug mejorada
async debugBuscarDeduccion_vc_ga(nombre) {
    console.log('=== DEBUG BÚSQUEDA DEDUCCIÓN ===');
    console.log('Nombre a buscar:', nombre);
    
    try {
        // Buscar directamente en el repositorio
        const resultado = await this.servicio_vc_ga.repositorio_vc_ga.buscarDeduccionPorNombre_vc_ga(nombre);
        console.log('Resultado directo del repositorio:', resultado);
        console.log('Es array?', Array.isArray(resultado));
        console.log('Length:', resultado?.length);
        
        // También mostrar todas las deducciones disponibles
        const todas = await this.servicio_vc_ga.obtenerDeduccionesDisponibles_vc_ga();
        console.log('Todas las deducciones disponibles:', todas);
        
        return resultado;
    } catch (error) {
        console.error('Error en debug:', error);
        return null;
    }
}

// Función para mostrar sugerencias mientras escribe (opcional)
// 


async manejarEditarDeduccion_vc_ga() {
    try {
        const historial = await this.servicio_vc_ga.obtenerHistorialDeducciones_vc_ga(this.idEmpleado_vc_ga);
        
        if (!historial || historial.length === 0) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'No hay deducciones registradas para editar');
            return;
        }
        
        const opciones = historial.map(deduccion => ({
            texto: `${deduccion.tipo} - $${deduccion.monto} (${new Date(deduccion.fecha).toLocaleDateString()})`
        }));
        
        const seleccion = await this.mostrarSelectOscuro_vc_ga(
            'Editar Deducción', 
            'Seleccione la deducción a editar:',
            opciones
        );
        
        if (!seleccion.confirmado) return;
        
        const deduccionSeleccionada = historial[seleccion.indice];
        
        // Solicitar nuevo monto
        const nuevoMonto = await this.mostrarModalInputOscuro_vc_ga(
            'Editar Monto', 
            'Ingrese el nuevo monto para la deducción:',
            deduccionSeleccionada.monto
        );
        
        if (!nuevoMonto || parseFloat(nuevoMonto) <= 0) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'Debe ingresar un monto válido mayor a 0');
            return;
        }
        
        const confirmacion = await modal_vc_ga.showConfirm_vc_ga(
            'Confirmar Edición', 
            `¿Está seguro que desea cambiar el monto de $${deduccionSeleccionada.monto} a $${nuevoMonto}?`
        );
        
        if (!confirmacion) return;
        
        const fechaActual = new Date().toISOString().split('T')[0];
        
        await this.actualizarDeduccion_vc_ga(
            deduccionSeleccionada.id_usuario_deduccion_vc_ga, 
            parseFloat(nuevoMonto), 
            fechaActual
        );
        
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Deducción actualizada correctamente');
        await this.recargarHistorialDeducciones_vc_ga();
        
    } catch (error) {
        await modal_vc_ga.showError_vc_ga('Error', `No se pudo editar la deducción: ${error.message}`);
        console.error(error);
    }
}

async manejarBorrarDeduccion_vc_ga() {
    try {
        const historial = await this.servicio_vc_ga.obtenerHistorialDeducciones_vc_ga(this.idEmpleado_vc_ga);
        
        if (!historial || historial.length === 0) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'No hay deducciones registradas para borrar');
            return;
        }
        
        const opciones = historial.map(deduccion => ({
            texto: `${deduccion.tipo} - $${deduccion.monto} (${new Date(deduccion.fecha).toLocaleDateString()})`
        }));
        
        const seleccion = await this.mostrarSelectOscuro_vc_ga(
            'Borrar Deducción', 
            'Seleccione la deducción a borrar:',
            opciones
        );
        
        if (!seleccion.confirmado) return;
        
        const deduccionSeleccionada = historial[seleccion.indice];
        const confirmacion = await modal_vc_ga.showConfirm_vc_ga(
            'Confirmar Borrado', 
            `¿Está seguro que desea borrar la deducción de ${deduccionSeleccionada.tipo} por $${deduccionSeleccionada.monto}?`
        );
        
        if (!confirmacion) return;
        
        await this.eliminarDeduccion_vc_ga(deduccionSeleccionada.id_usuario_deduccion_vc_ga);
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Deducción borrada correctamente');
        await this.recargarHistorialDeducciones_vc_ga();
        
    } catch (error) {
        await modal_vc_ga.showError_vc_ga('Error', `No se pudo borrar la deducción: ${error.message}`);
        console.error(error);
    }
}

// Función auxiliar para cargar deducciones disponibles en el select
async cargarDeduccionesDisponibles_vc_ga() {
    try {
        const deducciones = await this.servicio_vc_ga.obtenerDeduccionesDisponibles_vc_ga();
        
        // Limpiar select
        deduccionSelect_vc_ga.innerHTML = '<option value="">Seleccione una deducción...</option>';
        
        // Agregar opciones
        deducciones.forEach(deduccion => {
            const option = document.createElement('option');
            option.value = deduccion.id_deduccion_vc_ga;
            option.textContent = `${deduccion.nombre_vc_ga}${deduccion.porcentaje_vc_ga ? ` (${deduccion.porcentaje_vc_ga}%)` : ''}`;
            option.title = deduccion.descripcion_vc_ga || '';
            deduccionSelect_vc_ga.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error cargando deducciones:', error);
        await modal_vc_ga.showError_vc_ga('Error', 'No se pudieron cargar las deducciones disponibles');
    }
}

// Función para recargar el historial (debes implementar esta según tu interfaz)
async recargarHistorialDeducciones_vc_ga() {
    try {
        const historial = await this.servicio_vc_ga.obtenerHistorialDeducciones_vc_ga(this.idEmpleado_vc_ga);
        // Aquí actualizas tu tabla o lista de deducciones en la interfaz
        // Por ejemplo:
        // this.actualizarTablaDeducciones_vc_ga(historial);
        console.log('Historial de deducciones recargado:', historial);
    } catch (error) {
        console.error('Error recargando historial:', error);
    }
}


async manejarAgregarBono_vc_ga() {
    try {
        // Obtener valores del formulario
        // Obtener valores del formulario
        const tipoBonoInput_vc_ga = document.getElementById('bonusType')
        const montoBonoInput_vc_ga = document.getElementById('bonusAmount')
        const tipo = tipoBonoInput_vc_ga?.value?.trim();
        const monto = parseFloat(montoBonoInput_vc_ga?.value);
        const fechaActual = new Date().toISOString().split('T')[0];

        // Validaciones
        if (!tipo) {
            await modal_vc_ga.showWarning_vc_ga(
                'Tipo requerido',
                'Por favor ingrese el tipo de bono.'
            );
            return;
        }

        if (!monto || isNaN(monto) || monto <= 0) {
            await modal_vc_ga.showWarning_vc_ga(
                'Monto inválido',
                'El monto debe ser un número positivo válido.'
            );
            return;
        }

        // Confirmar acción
        const confirmado = await modal_vc_ga.showConfirm_vc_ga(
            'Confirmar Agregar Bono',
            `¿Desea agregar un bono de tipo "${tipo}" por $${monto}?`
        );

        if (!confirmado) return;

        // Crear el bono
        await this.crearBono_vc_ga(tipo, monto, fechaActual);

        // Limpiar formulario
        if (tipoBonoInput_vc_ga) tipoBonoInput_vc_ga.value = '';
        if (montoBonoInput_vc_ga) montoBonoInput_vc_ga.value = '';

        // Recargar historial
        await this.recargarHistorialBonos_vc_ga();

        await modal_vc_ga.showSuccess_vc_ga(
            'Éxito',
            'Bono agregado correctamente.'
        );

    } catch (error) {
        await modal_vc_ga.showError_vc_ga(
            'Error',
            `No se pudo agregar el bono: ${error.message}`
        );
        console.error('Error al agregar bono:', error);
    }
}

// Función para manejar editar bono
async manejarEditarBono_vc_ga() {
    try {
        // Obtener historial con IDs
        const historial = await this.servicio_vc_ga.repositorio_vc_ga.obtenerHistorialBonosConId_vc_ga(this.idEmpleado_vc_ga);
        
        if (!historial || historial.length === 0) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'No hay bonos registrados para editar');
            return;
        }
        
        // Crear opciones para el select
        const opciones = historial.map(bono => ({
            texto: `${bono.tipo} - $${bono.monto} (${new Date(bono.fecha).toLocaleDateString()})`
        }));
        
        // Mostrar select para elegir bono
        const seleccion = await this.mostrarSelectOscuro_vc_ga(
            'Editar Bono', 
            'Seleccione el bono a editar:',
            opciones
        );
        
        if (!seleccion.confirmado) return;
        
        const bonoSeleccionado = historial[seleccion.indice];
        
        // Solicitar nuevo tipo
        const nuevoTipo = await this.mostrarModalInputTexto_vc_ga(
            'Editar Tipo de Bono', 
            'Ingrese el nuevo tipo de bono:',
            bonoSeleccionado.tipo
        );
        
        if (!nuevoTipo?.trim()) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'Debe ingresar un tipo válido');
            return;
        }
        
        // Solicitar nuevo monto
        const nuevoMonto = await this.mostrarModalInputOscuro_vc_ga(
            'Editar Monto', 
            'Ingrese el nuevo monto para el bono:',
            bonoSeleccionado.monto
        );
        
        if (!nuevoMonto || parseFloat(nuevoMonto) <= 0) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'Debe ingresar un monto válido mayor a 0');
            return;
        }
        
        // Confirmar cambios
        const confirmacion = await modal_vc_ga.showConfirm_vc_ga(
            'Confirmar Edición', 
            `¿Está seguro que desea actualizar el bono?\n\nDe: ${bonoSeleccionado.tipo} - $${bonoSeleccionado.monto}\nA: ${nuevoTipo.trim()} - $${nuevoMonto}`
        );
        
        if (!confirmacion) return;
        
        // Actualizar bono usando la función de BD
        await this.servicio_vc_ga.repositorio_vc_ga.actualizarBono_vc_ga(
            bonoSeleccionado.id_bono_vc_ga,
            this.idEmpleado_vc_ga,
            nuevoTipo.trim(),
            parseFloat(nuevoMonto),
            bonoSeleccionado.fecha
        );
        
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Bono actualizado correctamente');
        await this.recargarHistorialBonos_vc_ga();
        
    } catch (error) {
        await modal_vc_ga.showError_vc_ga('Error', `No se pudo editar el bono: ${error.message}`);
        console.error('Error al editar bono:', error);
    }
}

// Función para manejar borrar bono
async manejarBorrarBono_vc_ga() {
    try {
        // Obtener historial con IDs
        const historial = await this.servicio_vc_ga.repositorio_vc_ga.obtenerHistorialBonosConId_vc_ga(this.idEmpleado_vc_ga);
        
        if (!historial || historial.length === 0) {
            await modal_vc_ga.showWarning_vc_ga('Advertencia', 'No hay bonos registrados para borrar');
            return;
        }
        
        // Crear opciones para el select
        const opciones = historial.map(bono => ({
            texto: `${bono.tipo} - $${bono.monto} (${new Date(bono.fecha).toLocaleDateString()})`
        }));
        
        // Mostrar select para elegir bono
        const seleccion = await this.mostrarSelectOscuro_vc_ga(
            'Borrar Bono', 
            'Seleccione el bono a borrar:',
            opciones
        );
        
        if (!seleccion.confirmado) return;
        
        const bonoSeleccionado = historial[seleccion.indice];
        
        // Confirmar borrado
        const confirmacion = await modal_vc_ga.showConfirm_vc_ga(
            'Confirmar Borrado', 
            `¿Está seguro que desea borrar el bono de ${bonoSeleccionado.tipo} por $${bonoSeleccionado.monto}?\n\nEsta acción no se puede deshacer.`
        );
        
        if (!confirmacion) return;
        
        // Eliminar bono usando la función de BD
        await this.servicio_vc_ga.repositorio_vc_ga.eliminarBono_vc_ga(bonoSeleccionado.id_bono_vc_ga);
        
        await modal_vc_ga.showSuccess_vc_ga('Éxito', 'Bono borrado correctamente');
        await this.recargarHistorialBonos_vc_ga();
        
    } catch (error) {
        await modal_vc_ga.showError_vc_ga('Error', `No se pudo borrar el bono: ${error.message}`);
        console.error('Error al borrar bono:', error);
    }
}


// Función auxiliar para modal de input de texto
async mostrarModalInputTexto_vc_ga(titulo, mensaje, valorPredeterminado = '') {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'mt-4';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'w-full p-2 border rounded bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500';
        input.value = valorPredeterminado;
        input.placeholder = 'Ingrese el tipo de bono';
        
        container.appendChild(input);
        
        modal_vc_ga.show_vc_ga(titulo, mensaje, 'reportes', true)
            .then((confirmed) => {
                if (confirmed) {
                    resolve(input.value);
                } else {
                    resolve(null);
                }
            });
        
        modal_vc_ga.modalMessage_vc_ga.appendChild(container);
        input.focus();
    });
}

// Actualizar el método recargarHistorialBonos_vc_ga para mostrar formato de moneda
async recargarHistorialBonos_vc_ga() {
    const filas_vc_ga = await this.servicio_vc_ga.obtenerHistorialBonos_vc_ga(this.idEmpleado_vc_ga);
    document.getElementById('bonusHistory').innerHTML = filas_vc_ga.map(r_vc_ga => `
        <tr class="border-b border-gray-200 dark:border-gray-700">
            <td class="p-2">${new Date(r_vc_ga.fecha).toLocaleDateString()}</td>
            <td class="p-2">${r_vc_ga.tipo}</td>
            <td class="p-2">${parseFloat(r_vc_ga.monto).toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>`
    ).join('');
}


// Función auxiliar para mostrar select (si no la tienes ya implementada)

    async iniciar_vc_ga() {
        // Obtenemos usuario y rol
        const usuario_vc_ga = GestorSesion_vc_ga.obtenerUsuarioActual_vc_ga();
        if (!usuario_vc_ga) throw new Error("Usuario no encontrado en sesión");

        // Seleccionamos método según rol
        switch (usuario_vc_ga.rol) {
            case 2:
                this.idEmpleado_vc_ga = this.obtenerIdEmpleadoSesion_vc_ga();
                break;
            case 1:
                this.idEmpleado_vc_ga = this.obtenerIdEmpleadoSeleccionado_vc_ga();
                break;
            default:
                throw new Error(`Rol no soportado: ${usuario_vc_ga.id_rol_vc_ga}`);
        }

        // Configurar visibilidad de la sección de gestión o mostrar mensaje de bienvenida
        this.configurarVisibilidadGestion_vc_ga();
        // Cargar datos personales y UI
        const { personal_vc_ga } = await this.servicio_vc_ga.obtenerDetallesEmpleado_vc_ga(this.idEmpleado_vc_ga);

        await this.recibosController_vc_ga.iniciar_vc_ga();

        document.getElementById('empName').textContent = personal_vc_ga.nombre_completo_vc_ga;
        document.getElementById('empCedula').textContent = personal_vc_ga.cedula_vc_ga;
        document.getElementById('empCargo').textContent = personal_vc_ga.nombre_cargo_vc_ga;
        document.getElementById('empDept').textContent = personal_vc_ga.nombre_departamento_vc_ga;
        document.getElementById('empIngreso').textContent = new Date(personal_vc_ga.fecha_ingreso_vc_ga).toLocaleDateString();

        await this.recargarHistorialSalario_vc_ga();
        await this.recargarHistorialDeducciones_vc_ga();
        await this.recargarHistorialBonos_vc_ga();
        this.configurarPestañas_vc_ga();

    }

    obtenerIdEmpleadoSesion_vc_ga() {
        const usuario_vc_ga = GestorSesion_vc_ga.obtenerUsuarioActual_vc_ga();
        if (!usuario_vc_ga) throw new Error("Usuario no encontrado en sesión");
        return usuario_vc_ga.id;
    }

    // Nuevo método para obtener ID de empleado seleccionado en sessionStorage
    obtenerIdEmpleadoSeleccionado_vc_ga() {
        const id = sessionStorage.getItem("selectedUserId");
        if (!id) throw new Error("No se encontró 'selectedUserId' en sessionStorage");
        return parseInt(id, 10);
    }

      // Nuevo método para manejar visibilidad o mensaje según rol
    configurarVisibilidadGestion_vc_ga() {
        const usuario_vc_ga = GestorSesion_vc_ga.obtenerUsuarioActual_vc_ga();
        const seccionGestion_vc_ga = document.querySelector('section[name="Gestion admin"]');
        const nominaUsuario_vc_ga = document.getElementById("payroll-report");
        const MenuNavegacion_vc_ga = document.getElementById("menu-nav")
        if (!usuario_vc_ga || !seccionGestion_vc_ga) return;

        if (usuario_vc_ga.rol === 1) {
            console.log("Bienvenido Administrador");
            nominaUsuario_vc_ga.classList.add("hidden")
        } else if (usuario_vc_ga.rol === 2) {
            seccionGestion_vc_ga.classList.add("hidden");
            MenuNavegacion_vc_ga.classList.add("hidden");
        }
    }

    configurarPestañas_vc_ga() {
        const botonesPestaña_vc_ga = document.querySelectorAll('.tab-btn');
        const contenidosPestaña_vc_ga = document.querySelectorAll('.tab-content'); // ahora coincide con HTML

        botonesPestaña_vc_ga.forEach(boton_vc_ga => {
            boton_vc_ga.addEventListener('click', () => {
                const destino_vc_ga = boton_vc_ga.dataset.tab;
                // ocultar todos los contenidos
                contenidosPestaña_vc_ga.forEach(contenido_vc_ga => contenido_vc_ga.classList.add('hidden'));
                // mostrar solo el seleccionado
                document.getElementById(destino_vc_ga).classList.remove('hidden');
                // restablecer estilo de pestañas
                botonesPestaña_vc_ga.forEach(b_vc_ga => b_vc_ga.classList.remove('border-b-2', 'border-accent1'));
                boton_vc_ga.classList.add('border-b-2', 'border-accent1');
            });
        });

        // activar la primera pestaña al iniciar
        if (botonesPestaña_vc_ga.length) botonesPestaña_vc_ga[0].click();
    }

    async recargarHistorialSalario_vc_ga() {
        const filas_vc_ga = await this.servicio_vc_ga.obtenerHistorialSalario_vc_ga(this.idEmpleado_vc_ga);
        document.getElementById('salaryHistory').innerHTML = filas_vc_ga.map(r_vc_ga => `
            <tr>
                <td>${r_vc_ga.salario_vc_ga}</td>
            </tr>`
        ).join('');
    }

    async recargarHistorialDeducciones_vc_ga() {
        const filas_vc_ga = await this.servicio_vc_ga.obtenerHistorialDeducciones_vc_ga(this.idEmpleado_vc_ga);
        document.getElementById('deductionHistory').innerHTML = filas_vc_ga.map(r_vc_ga => `
            <tr>
                <td>${r_vc_ga.fecha}</td>
                <td>${r_vc_ga.tipo}</td>
                <td>${r_vc_ga.monto}</td>
            </tr>`
        ).join('');
    }

async actualizarTablaDeducciones_vc_ga() {
    const filas_vc_ga = await this.servicio_vc_ga.obtenerHistorialDeducciones_vc_ga(this.idEmpleado_vc_ga);
    document.getElementById('deductionHistory').innerHTML = filas_vc_ga.map(r_vc_ga => `
        <tr>
            <td>${r_vc_ga.fecha}</td>
            <td>${r_vc_ga.tipo}</td>
            <td>${r_vc_ga.monto}</td>
        </tr>`
    ).join('');
}
    async recargarHistorialBonos_vc_ga() {
        const filas_vc_ga = await this.servicio_vc_ga.obtenerHistorialBonos_vc_ga(this.idEmpleado_vc_ga);
        document.getElementById('bonusHistory').innerHTML = filas_vc_ga.map(r_vc_ga => `
            <tr>
                <td>${r_vc_ga.fecha}</td>
                <td>${r_vc_ga.tipo}</td>
                <td>${r_vc_ga.monto}</td>
            </tr>`
        ).join('');
    }
}

// 4. Clase para gestionar los recibos del empleado
class EmpleadoRecibosControlador_vc_ga {
    constructor(servicio_vc_ga) {
        this.servicio_vc_ga = servicio_vc_ga;
        this.idEmpleado_vc_ga = null;
        this._initElements_vc_ga();
    }

    _initElements_vc_ga() {
        this.filterDate_vc_ga = document.getElementById("reportPeriod");
        this.applyBtn_vc_ga = document.getElementById("calcPayrollBtn");
        this.previewContainer_vc_ga = document.getElementById("payrollPreview");
        this.reportContent_vc_ga = document.getElementById("payrollReportContent");
        this.generateBtn_vc_ga = document.getElementById("generateReceiptBtn");

        this.applyBtn_vc_ga?.addEventListener("click", () => this.filtrarPorFecha_vc_ga());
        this.generateBtn_vc_ga?.addEventListener("click", () => this.generarRecibo_vc_ga());
    }

    obtenerIdEmpleadoSesion_vc_ga() {
        const usuario_vc_ga = GestorSesion_vc_ga.obtenerUsuarioActual_vc_ga();
        if (!usuario_vc_ga) throw new Error("Usuario no encontrado en sesión");
        return usuario_vc_ga.id;
    }

    async iniciar_vc_ga() {
        try {
            this.idEmpleado_vc_ga = this.obtenerIdEmpleadoSesion_vc_ga();
            await this.cargarRecibos_vc_ga();
        } catch (err) {
            console.error("Error al iniciar recibos del empleado:", err);
            modal_vc_ga.showError_vc_ga("Error", "No se pudieron cargar los recibos");
        }
    }

    async cargarRecibos_vc_ga(fecha = null) {
        try {
            let sql = `
                SELECT 
                    rn.id_recibo_vc_ga AS id,
                    rn.id_usuario_vc_ga AS idUsuario,
                    rn.id_pago_vc_ga AS idPago,
                    rn.fecha_pago_vc_ga AS fechaPago,
                    rn.monto_neto_vc_ga AS montoNeto,
                    rn.fecha_generacion_vc_ga AS fecha,
                    rn.contenido_vc_ga AS info,
                    GROUP_CONCAT(DISTINCT CONCAT_WS('::', ud.id_usuario_deduccion_vc_ga, ud.monto_vc_ga, d.nombre_vc_ga, d.porcentaje_vc_ga) SEPARATOR '||') AS deducciones,
                    GROUP_CONCAT(DISTINCT CONCAT_WS('::', b.id_bono_vc_ga, b.monto_vc_ga, b.tipo_bono_vc_ga) SEPARATOR '||') AS bonos
                FROM td_recibo_nomina_vc_ga rn
                LEFT JOIN td_recibo_deduccion_vc_ga rd ON rn.id_recibo_vc_ga = rd.id_recibo_vc_ga
                LEFT JOIN td_usuario_deduccion_vc_ga ud ON rd.id_usuario_deduccion_vc_ga = ud.id_usuario_deduccion_vc_ga
                LEFT JOIN td_deduccion_vc_ga d ON ud.id_deduccion_vc_ga = d.id_deduccion_vc_ga
                LEFT JOIN td_recibo_bono_vc_ga rb ON rn.id_recibo_vc_ga = rb.id_recibo_vc_ga
                LEFT JOIN td_bono_vc_ga b ON rb.id_bono_vc_ga = b.id_bono_vc_ga
                WHERE rn.id_usuario_vc_ga = ?
            `;
            
            const params = [this.idEmpleado_vc_ga];
            
            if (fecha) {
                sql += " AND DATE(rn.fecha_generacion_vc_ga) = ?";
                params.push(fecha);
            }
            
            sql += " GROUP BY rn.id_recibo_vc_ga ORDER BY rn.fecha_generacion_vc_ga DESC";
            
            const recibos = await query_vc_ga(sql, params);
            console.log(recibos)
            
            this.recibos_vc_ga = recibos.map(r => ({
                ...r,
                tipo: "recibo_nomina",
                deducciones: r.deducciones 
                    ? r.deducciones.split('||').map(item => {
                        const [id, monto, nombre, porcentaje] = item.split('::');
                        return { id: Number(id), monto: Number(monto), nombre, porcentaje: Number(porcentaje) };
                    }) 
                    : [],
                bonos: r.bonos 
                    ? r.bonos.split('||').map(item => {
                        const [id, monto, tipo] = item.split('::');
                        return { id: Number(id), monto: Number(monto), tipo };
                    }) 
                    : []
            }));
            
            this.renderRecibos_vc_ga();
        } catch (err) {
            console.error("Error cargando recibos:", err);
            throw err;
        }
    }

    renderRecibos_vc_ga() {
        if (this.recibos_vc_ga.length === 0) {
            this.reportContent_vc_ga.textContent = "No se encontraron recibos";
            this.generateBtn_vc_ga.disabled = true;
            return;
        }

        // Construir lista de recibos
        const listaRecibos = document.createElement('div');
        listaRecibos.className = 'space-y-4';
        
        this.recibos_vc_ga.forEach(recibo => {
            const reciboElement = document.createElement('div');
            reciboElement.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow';
            reciboElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                <h3 class="font-bold text-lg">Recibo #${recibo.id}</h3>
                <p>Fecha: ${new Date(recibo.fechaPago).toLocaleDateString()}</p>
                <p>Monto Neto: $${recibo.montoNeto}</p>
                </div>
                <div class="space-x-2">
                <button class="view-more-btn bg-accent1 text-light px-3 py-1 rounded-md" 
                        data-id="${recibo.id}">
                    Ver Detalles
                </button>
                <button class="download-pdf-btn bg-blue-600 text-white px-3 py-1 rounded-md"
                        data-id="${recibo.id}">
                    Descargar PDF
                </button>
                </div>
            </div>
            `;

            listaRecibos.appendChild(reciboElement);
        });

        // Reemplazar contenido
        this.reportContent_vc_ga.innerHTML = '';
        this.reportContent_vc_ga.appendChild(listaRecibos);
        
        // Agregar eventos a los botones
        listaRecibos.querySelectorAll('.view-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idRecibo = e.currentTarget.dataset.id;
                this.verDetalles_vc_ga(idRecibo);
            });
        });

        listaRecibos.querySelectorAll('.download-pdf-btn').forEach(btn => {
         btn.addEventListener('click', e => {
            const idRecibo = e.currentTarget.dataset.id;
            this.descargarReciboComoPDF_vc_ga(idRecibo);
  });
});
    }

    async descargarReciboComoPDF_vc_ga(idRecibo) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Buscar en el array ya cargado
        const recibo = this.recibos_vc_ga.find(r => r.id == idRecibo);
        if (!recibo) return;
        // Titular
        doc.setFontSize(14);
        doc.text(`Recibo de Nómina #${recibo.id}`, 10, 10);
        // Construir texto
        let texto = '';
        texto += `ID Usuario: ${recibo.idUsuario}\n`;
        texto += `Fecha Pago: ${recibo.fechaPago}\n`;
        texto += `Monto Neto: $${recibo.montoNeto}\n\n`;
        texto += `Contenido:\n${recibo.info}\n\n`;
        if (recibo.deducciones.length) {
            texto += "Deducciones:\n" + recibo.deducciones
            .map(d => `- ${d.nombre}: $${d.monto.toFixed(2)} (${d.porcentaje}%)`)
            .join("\n") + "\n\n";
        }
        if (recibo.bonos.length) {
            texto += "Bonos:\n" + recibo.bonos
            .map(b => `- ${b.tipo}: $${b.monto.toFixed(2)}`)
            .join("\n") + "\n";
        }
        // Ajustar líneas largas
        const lineas = doc.splitTextToSize(texto, 180);
        doc.setFontSize(11);
        doc.text(lineas, 10, 20);
        // Guardar
        doc.save(`recibo_${recibo.id}.pdf`);
        }


    filtrarPorFecha_vc_ga() {
        const fecha = this.filterDate_vc_ga.value;
        this.cargarRecibos_vc_ga(fecha);
    }

    verDetalles_vc_ga(idRecibo) {
        const recibo = this.recibos_vc_ga.find(r => r.id == idRecibo);
        if (!recibo) return;

        // Construir detalles del recibo
        let detalles = `ID Recibo: ${recibo.id}\n`;
        detalles += `ID Usuario: ${recibo.idUsuario}\n`;
        detalles += `Fecha Pago: ${recibo.fechaPago}\n`;
        detalles += `Monto Neto: $${recibo.montoNeto}\n\n`;
        detalles += `Contenido:\n${recibo.info}\n\n`;

        if (recibo.deducciones.length > 0) {
            detalles += "Deducciones:\n";
            recibo.deducciones.forEach(d => {
                detalles += `- ${d.nombre}: $${d.monto.toFixed(2)} (${d.porcentaje}%)\n`;
            });
        }

        if (recibo.bonos.length > 0) {
            detalles += "\nBonos:\n";
            recibo.bonos.forEach(b => {
                detalles += `- ${b.tipo}: $${b.monto.toFixed(2)}\n`;
            });
        }

        // Mostrar en modal
        modal_vc_ga.showReportes_vc_ga(
            `Detalles del Recibo #${recibo.id}`, 
            `${detalles}`
        );
    }
}

// 5. Fábrica
class EmpleadoFabrica_vc_ga {
    static crear_vc_ga() {
        const repositorio_vc_ga = new EmpleadoRepositorio_vc_ga();
        const servicio_vc_ga = new EmpleadoServicio_vc_ga(repositorio_vc_ga);
        return new EmpleadoControlador_vc_ga(servicio_vc_ga);
    }
}

// Exportaciones
module.exports = {
    empleadoHTML_vc_ga,
    EmpleadoFabrica_vc_ga
};