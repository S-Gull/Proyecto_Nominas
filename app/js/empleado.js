const { query_vc_ga } = require("../database/conexion");
const { GestorSesion_vc_ga } = require("./login");

const empleadoHTML_vc_ga = document.getElementById('employee-view');

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
            'SELECT salario_vc_ga FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ?',
            [id_vc_ga]
        );
    }

    async crearSalario_vc_ga(idUsuario, salario) { 
    return await query_vc_ga(
        'INSERT INTO td_salario_historico_vc_ga (id_usuario_vc_ga, salario_vc_ga) VALUES (?, ?)',
        [idUsuario, salario]
    );
    }

    async actualizarSalario_vc_ga(idSalario, salario) {
    return await query_vc_ga(
        'UPDATE td_salario_historico_vc_ga SET salario_vc_ga = ? WHERE id_salario_vc_ga = ?',
        [salario, idSalario]
    );
    }

    async eliminarSalario_vc_ga(idSalario) {
    return await query_vc_ga(
        'DELETE FROM td_salario_historico_vc_ga WHERE id_salario_vc_ga = ?',
        [idSalario]
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


    async obtenerHistorialHorasExtras_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
             FROM td_horas_extras_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async crearHorasExtras_vc_ga(idUsuario, tipo, horas, monto, fecha) {
    return await query_vc_ga(
        `INSERT INTO td_horas_extras_vc_ga
        (id_usuario_vc_ga, tipo_vc_ga, cantidad_horas_vc_ga, monto_vc_ga, fecha_vc_ga)
        VALUES (?, ?, ?, ?, ?)`,
        [idUsuario, tipo, horas, monto, fecha]
    );
    }

    async actualizarHorasExtras_vc_ga(idReg, tipo, horas, monto, fecha) {
    return await query_vc_ga(
        `UPDATE td_horas_extras_vc_ga
        SET tipo_vc_ga = ?, cantidad_horas_vc_ga = ?, monto_vc_ga = ?, fecha_vc_ga = ?
        WHERE id_horas_extras_vc_ga = ?`,
        [tipo, horas, monto, fecha, idReg]
    );
    }

    async eliminarHorasExtras_vc_ga(idReg) {
    return await query_vc_ga(
        'DELETE FROM td_horas_extras_vc_ga WHERE id_horas_extras_vc_ga = ?',
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

    async crearBono_vc_ga(idUsuario, tipo, monto, fecha) {
    return await query_vc_ga(
        `INSERT INTO td_bono_vc_ga
        (id_usuario_vc_ga, tipo_bono_vc_ga, monto_vc_ga, fecha_pago_vc_ga)
        VALUES (?, ?, ?, ?)`,
        [idUsuario, tipo, monto, fecha]
    );
    }

    async actualizarBono_vc_ga(idReg, tipo, monto, fecha) {
    return await query_vc_ga(
        `UPDATE td_bono_vc_ga
        SET tipo_bono_vc_ga = ?, monto_vc_ga = ?, fecha_pago_vc_ga = ?
        WHERE id_bono_vc_ga = ?`,
        [tipo, monto, fecha, idReg]
    );
    }

    async eliminarBono_vc_ga(idReg) {
    return await query_vc_ga(
        'DELETE FROM td_bono_vc_ga WHERE id_bono_vc_ga = ?',
        [idReg]
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

    async obtenerHistorialDeducciones_vc_ga(id_vc_ga) {
        return await this.repositorio_vc_ga.obtenerHistorialDeducciones_vc_ga(id_vc_ga);
    }

    async obtenerHistorialHorasExtras_vc_ga(id_vc_ga) {
        return await this.repositorio_vc_ga.obtenerHistorialHorasExtras_vc_ga(id_vc_ga);
    }

    async obtenerHistorialBonos_vc_ga(id_vc_ga) {
        return await this.repositorio_vc_ga.obtenerHistorialBonos_vc_ga(id_vc_ga);
    }
    async crearSalario_vc_ga(idUsuario, salario) { return await this.repositorio_vc_ga.crearSalario_vc_ga(idUsuario, salario); }
    async actualizarSalario_vc_ga(idSalario, salario) { return await this.repositorio_vc_ga.actualizarSalario_vc_ga(idSalario, salario); }
    async eliminarSalario_vc_ga(idSalario) { return await this.repositorio_vc_ga.eliminarSalario_vc_ga(idSalario); }
    async crearDeduccionUsuario_vc_ga(...args) { return await this.repositorio_vc_ga.crearDeduccionUsuario_vc_ga(...args); }
    async actualizarDeduccionUsuario_vc_ga(...args) { return await this.repositorio_vc_ga.actualizarDeduccionUsuario_vc_ga(...args); }
    async eliminarDeduccionUsuario_vc_ga(idReg) { return await this.repositorio_vc_ga.eliminarDeduccionUsuario_vc_ga(idReg); }
    async crearHorasExtras_vc_ga(...args) { return await this.repositorio_vc_ga.crearHorasExtras_vc_ga(...args); }
    async actualizarHorasExtras_vc_ga(...args) { return await this.repositorio_vc_ga.actualizarHorasExtras_vc_ga(...args); }
    async eliminarHorasExtras_vc_ga(idReg) { return await this.repositorio_vc_ga.eliminarHorasExtras_vc_ga(idReg); }
    async crearBono_vc_ga(...args) { return await this.repositorio_vc_ga.crearBono_vc_ga(...args); }
    async actualizarBono_vc_ga(...args) { return await this.repositorio_vc_ga.actualizarBono_vc_ga(...args); }
    async eliminarBono_vc_ga(idReg) { return await this.repositorio_vc_ga.eliminarBono_vc_ga(idReg); }

}

// 3. Capa de Controlador
class EmpleadoControlador_vc_ga {
    constructor(servicio_vc_ga) {
        this.servicio_vc_ga = servicio_vc_ga;
        this.idEmpleado_vc_ga = null;
    }

        //CRUD SALARIO
        async crearSalario_vc_ga(salario) { return await this.servicio_vc_ga.crearSalario_vc_ga(this.idEmpleado_vc_ga, salario); }
        async actualizarSalario_vc_ga(idSalario, salario) { return await this.servicio_vc_ga.actualizarSalario_vc_ga(idSalario, salario); }
        async eliminarSalario_vc_ga(idSalario) { return await this.servicio_vc_ga.eliminarSalario_vc_ga(idSalario); }


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


        //CRUD HORAS EXTRAS
        async crearExtras_vc_ga(tipo, horas, monto, fecha) {
        return await this.servicio_vc_ga.crearHorasExtras_vc_ga(this.idEmpleado_vc_ga, tipo, horas, monto, fecha);
        }
        async actualizarExtras_vc_ga(idReg, tipo, horas, monto, fecha) {
        return await this.servicio_vc_ga.actualizarHorasExtras_vc_ga(idReg, tipo, horas, monto, fecha);
        }
        async eliminarExtras_vc_ga(idReg) {
        return await this.servicio_vc_ga.eliminarHorasExtras_vc_ga(idReg);
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

        // Cargar datos personales y UI
        const { personal_vc_ga } = await this.servicio_vc_ga.obtenerDetallesEmpleado_vc_ga(this.idEmpleado_vc_ga);

        document.getElementById('empName').textContent = personal_vc_ga.nombre_completo_vc_ga;
        document.getElementById('empCedula').textContent = personal_vc_ga.cedula_vc_ga;
        document.getElementById('empCargo').textContent = personal_vc_ga.nombre_cargo_vc_ga;
        document.getElementById('empDept').textContent = personal_vc_ga.nombre_departamento_vc_ga;
        document.getElementById('empIngreso').textContent = new Date(personal_vc_ga.fecha_ingreso_vc_ga).toLocaleDateString();

        await this.recargarHistorialSalario_vc_ga();
        await this.recargarHistorialDeducciones_vc_ga();
        await this.recargarHistorialHorasExtras_vc_ga();
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

    async recargarHistorialHorasExtras_vc_ga() {
        const filas_vc_ga = await this.servicio_vc_ga.obtenerHistorialHorasExtras_vc_ga(this.idEmpleado_vc_ga);
        document.getElementById('extrasHistory').innerHTML = filas_vc_ga.map(r_vc_ga => `
            <tr>
                <td>${r_vc_ga.fecha}</td>
                <td>${r_vc_ga.tipo}</td>
                <td>${r_vc_ga.horas}</td>
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

// 4. Fábrica
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