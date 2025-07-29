const { query_vc_ga } = require("../database/conexion");
const { GestorSesion_vc_ga } = require("./login");

const empleadoHTML_vc_ga = document.getElementById('employee-view');

// 1. Capa de Repositorio
class EmpleadoRepositorio_vc_ga {
    async obtenerDetallesEmpleado(idEmpleado_vc_ga) {
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
        return await query_vc_ga(sql, [idEmpleado_vc_ga]);
    }

    async obtenerSalarioActual(idEmpleado_vc_ga) {
        const sql = `
            SELECT sueldo_base_vc_ga, sueldo_variable_vc_ga
            FROM td_salario_historico_vc_ga
            WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL;
        `;
        return await query_vc_ga(sql, [idEmpleado_vc_ga]);
    }

    async actualizarSalario(idEmpleado_vc_ga, base_vc_ga, variable_vc_ga) {
        await query_vc_ga(`
            UPDATE td_salario_historico_vc_ga SET fecha_fin_vc_ga = CURDATE()
            WHERE id_usuario_vc_ga = ? AND fecha_fin_vc_ga IS NULL;
        `, [idEmpleado_vc_ga]);

        await query_vc_ga(`
            INSERT INTO td_salario_historico_vc_ga
            (id_usuario_vc_ga, sueldo_base_vc_ga, sueldo_variable_vc_ga, fecha_inicio_vc_ga)
            VALUES (?, ?, ?, CURDATE());
        `, [idEmpleado_vc_ga, base_vc_ga, variable_vc_ga]);
    }

    async obtenerHistorialSalario(id_vc_ga) {
        return await query_vc_ga(
            'SELECT * FROM td_salario_historico_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC',
            [id_vc_ga]
        );
    }

    async obtenerHistorialDeducciones(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_aplicacion_vc_ga AS fecha, d.nombre_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_usuario_deduccion_vc_ga ud
             JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
             WHERE id_usuario_vc_ga = ? ORDER BY fecha_aplicacion_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async obtenerHistorialHorasExtras(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
             FROM td_horas_extras_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async obtenerHistorialBonos(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_bono_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async obtenerHistorialVacaciones(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_inicio_vc_ga AS inicio, fecha_fin_vc_ga AS fin, dias_disfrutados_vc_ga AS dias
             FROM td_vacaciones_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_inicio_vc_ga DESC`,
            [id_vc_ga]
        );
    }
}

// 2. Capa de Servicio
class EmpleadoServicio_vc_ga {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async obtenerDetallesEmpleado(idEmpleado_vc_ga) {
        const [personal_vc_ga] = await this.repositorio.obtenerDetallesEmpleado(idEmpleado_vc_ga);
        const [salario_vc_ga] = await this.repositorio.obtenerSalarioActual(idEmpleado_vc_ga);
        return { personal_vc_ga, salario_vc_ga };
    }

    async actualizarSalario(idEmpleado_vc_ga, base_vc_ga, variable_vc_ga) {
        await this.repositorio.actualizarSalario(idEmpleado_vc_ga, base_vc_ga, variable_vc_ga);
    }

    async obtenerHistorialSalario(id_vc_ga) {
        return await this.repositorio.obtenerHistorialSalario(id_vc_ga);
    }

    async obtenerHistorialDeducciones(id_vc_ga) {
        return await this.repositorio.obtenerHistorialDeducciones(id_vc_ga);
    }

    async obtenerHistorialHorasExtras(id_vc_ga) {
        return await this.repositorio.obtenerHistorialHorasExtras(id_vc_ga);
    }

    async obtenerHistorialBonos(id_vc_ga) {
        return await this.repositorio.obtenerHistorialBonos(id_vc_ga);
    }

    async obtenerHistorialVacaciones(id_vc_ga) {
        return await this.repositorio.obtenerHistorialVacaciones(id_vc_ga);
    }
}

// 3. Capa de Controlador
class EmpleadoControlador_vc_ga {
    constructor(servicio) {
        this.servicio = servicio;
        this.idEmpleado_vc_ga = null;
    }

    async iniciar() {
        this.idEmpleado_vc_ga = this.obtenerIdEmpleadoSesion_vc_ga();
        const { personal_vc_ga, salario_vc_ga } = await this.servicio.obtenerDetallesEmpleado(this.idEmpleado_vc_ga);

        document.getElementById('empName').textContent = personal_vc_ga.nombre_completo_vc_ga;
        document.getElementById('empCedula').textContent = personal_vc_ga.cedula_vc_ga;
        document.getElementById('empCargo').textContent = personal_vc_ga.nombre_cargo_vc_ga;
        document.getElementById('empDept').textContent = personal_vc_ga.nombre_departamento_vc_ga;
        document.getElementById('empIngreso').textContent = new Date(personal_vc_ga.fecha_ingreso_vc_ga).toLocaleDateString();

        await this.recargarHistorialSalario_vc_ga();
        await this.recargarHistorialDeducciones_vc_ga();
        await this.recargarHistorialHorasExtras_vc_ga();
        await this.recargarHistorialBonos_vc_ga();
        await this.recargarHistorialVacaciones_vc_ga();
        this.configurarPestañas_vc_ga();
        // this.configurarEventos_vc_ga();
    }

    obtenerIdEmpleadoSesion_vc_ga() {
        const usuario = GestorSesion_vc_ga.obtenerUsuarioActual_vc_ga();
        if (!usuario) throw new Error("Usuario no encontrado en sesión");
        return usuario.id;
    }

    configurarPestañas_vc_ga() {
        const botonesPestaña = document.querySelectorAll('.tab-btn');
        const contenidosPestaña = document.querySelectorAll('.tab-pane');

        botonesPestaña.forEach(boton => {
            boton.addEventListener('click', () => {
                const destino = boton.dataset.tab;
                contenidosPestaña.forEach(contenido => contenido.classList.add('hidden'));
                document.getElementById(destino).classList.remove('hidden');
                botonesPestaña.forEach(b => b.classList.remove('border-b-2', 'border-accent1'));
                boton.classList.add('border-b-2', 'border-accent1');
            });
        });

        if (botonesPestaña.length) botonesPestaña[0].click();
    }

    // configurarEventos_vc_ga() {
    //     document.getElementById('btnActualizarSalario').addEventListener('click', async (e) => {
    //         e.preventDefault();
    //         await this.actualizarSalario_vc_ga();
    //     });
    // }

    async actualizarSalario_vc_ga() {
        const base = parseFloat(document.getElementById("salaryBase").value);
        const variable = parseFloat(document.getElementById("salaryVariable").value);
        await this.servicio.actualizarSalario(this.idEmpleado_vc_ga, base, variable);
        await this.recargarHistorialSalario_vc_ga();
    }

    async recargarHistorialSalario_vc_ga() {
        const filas = await this.servicio.obtenerHistorialSalario(this.idEmpleado_vc_ga);
        document.getElementById('salaryHistory').innerHTML = filas.map(r => `
            <tr>
                <td>${r.fecha_inicio_vc_ga}</td>
                <td>${r.fecha_fin_vc_ga || ''}</td>
                <td>${r.sueldo_base_vc_ga}</td>
                <td>${r.sueldo_variable_vc_ga}</td>
            </tr>`
        ).join('');
    }

    async recargarHistorialDeducciones_vc_ga() {
        const filas = await this.servicio.obtenerHistorialDeducciones(this.idEmpleado_vc_ga);
        document.getElementById('deductionHistory').innerHTML = filas.map(r => `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.tipo}</td>
                <td>${r.monto}</td>
            </tr>`
        ).join('');
    }

    async recargarHistorialHorasExtras_vc_ga() {
        const filas = await this.servicio.obtenerHistorialHorasExtras(this.idEmpleado_vc_ga);
        document.getElementById('extrasHistory').innerHTML = filas.map(r => `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.tipo}</td>
                <td>${r.horas}</td>
                <td>${r.monto}</td>
            </tr>`
        ).join('');
    }

    async recargarHistorialBonos_vc_ga() {
        const filas = await this.servicio.obtenerHistorialBonos(this.idEmpleado_vc_ga);
        document.getElementById('bonusHistory').innerHTML = filas.map(r => `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.tipo}</td>
                <td>${r.monto}</td>
            </tr>`
        ).join('');
    }

    async recargarHistorialVacaciones_vc_ga() {
        const filas = await this.servicio.obtenerHistorialVacaciones(this.idEmpleado_vc_ga);
        document.getElementById('vacationHistory').innerHTML = filas.map(r => `
            <tr>
                <td>${r.inicio}</td>
                <td>${r.fin}</td>
                <td>${r.dias}</td>
            </tr>`
        ).join('');

        const resumen = filas.reduce((ac, actual) => {
            ac.used += actual.dias;
            return ac;
        }, { used: 0 });
        document.getElementById('vacDaysUsed').textContent = resumen.used;
        document.getElementById('vacDaysRight').textContent = 30;
    }
}

// 4. Fábrica
class EmpleadoFabrica_vc_ga {
    static crear() {
        const repositorio = new EmpleadoRepositorio_vc_ga();
        const servicio = new EmpleadoServicio_vc_ga(repositorio);
        return new EmpleadoControlador_vc_ga(servicio);
    }
}




// Exportaciones (manteniendo compatibilidad)
module.exports = {
    empleadoHTML_vc_ga,
    EmpleadoFabrica_vc_ga
};