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

    async obtenerHistorialDeducciones_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_aplicacion_vc_ga AS fecha, d.nombre_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_usuario_deduccion_vc_ga ud
             JOIN td_deduccion_vc_ga d USING(id_deduccion_vc_ga)
             WHERE id_usuario_vc_ga = ? ORDER BY fecha_aplicacion_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async obtenerHistorialHorasExtras_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_vc_ga AS fecha, tipo_vc_ga AS tipo, cantidad_horas_vc_ga AS horas, monto_vc_ga AS monto
             FROM td_horas_extras_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_vc_ga DESC`,
            [id_vc_ga]
        );
    }

    async obtenerHistorialBonos_vc_ga(id_vc_ga) {
        return await query_vc_ga(
            `SELECT fecha_pago_vc_ga AS fecha, tipo_bono_vc_ga AS tipo, monto_vc_ga AS monto
             FROM td_bono_vc_ga WHERE id_usuario_vc_ga = ? ORDER BY fecha_pago_vc_ga DESC`,
            [id_vc_ga]
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
}

// 3. Capa de Controlador
class EmpleadoControlador_vc_ga {
    constructor(servicio_vc_ga) {
        this.servicio_vc_ga = servicio_vc_ga;
        this.idEmpleado_vc_ga = null;
    }

    async iniciar_vc_ga() {
        this.idEmpleado_vc_ga = this.obtenerIdEmpleadoSesion_vc_ga();
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

    configurarPestañas_vc_ga() {
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