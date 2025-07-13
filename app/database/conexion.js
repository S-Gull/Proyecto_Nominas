console.log("carga la conexion");
const mysql = require('mysql');

// Configuración de conexión inicial (sin base de datos especificada)
const config_vc_ga = {
  host: 'localhost',
  user: 'root',
  password: '3690'
};

// Crear una conexión global
const connection_vc_ga = mysql.createConnection(config_vc_ga);

const tablas_vc_ga = [
  `CREATE TABLE IF NOT EXISTS productos_vc_ga(
    id_vc_ga INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_vc_ga VARCHAR(100) NOT NULL,
    descripcion_vc_ga VARCHAR(255),
    precio_vc_ga DECIMAL(10,2) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS td_sucursal_vc_ga (
    id_sucursal_vc_ga int PRIMARY KEY,
    nombre_vc_ga varchar(255),
    direccion_vc_ga varchar(255)
  )`,

  `CREATE TABLE IF NOT EXISTS td_departamento_vc_ga (
    id_departamento_vc_ga int PRIMARY KEY,
    id_sucursal_vc_ga int,
    nombre_vc_ga varchar(255),
    FOREIGN KEY (id_sucursal_vc_ga) REFERENCES td_sucursal_vc_ga(id_sucursal_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_roles_vc_ga (
    id_rol_vc_ga int PRIMARY KEY,
    nombre_vc_ga varchar(255),
    descripcion_vc_ga varchar(255)
  )`,

  `CREATE TABLE IF NOT EXISTS td_cargos_vc_ga (
    id_cargo_vc_ga int PRIMARY KEY,
    nombre_vc_ga varchar(255),
    descripcion_vc_ga varchar(255)
  )`,

  `CREATE TABLE IF NOT EXISTS td_usuarios_vc_ga (
    id_usuario_vc_ga int PRIMARY KEY,
    id_departamento_vc_ga int,
    id_rol_vc_ga int,
    id_cargo_vc_ga int,
    nombre_completo_vc_ga varchar(255),
    cedula_vc_ga varchar(255),
    rif_vc_ga varchar(255),
    fecha_nacimiento_vc_ga date,
    fecha_ingreso_vc_ga date,
    status_vc_ga ENUM('Trabajando', 'De Vacaciones'),
    correo_electronico_vc_ga varchar(255),
    telefono_vc_ga varchar(255),
    clave_vc_ga varchar(255),
    FOREIGN KEY (id_departamento_vc_ga) REFERENCES td_departamento_vc_ga(id_departamento_vc_ga),
    FOREIGN KEY (id_rol_vc_ga) REFERENCES td_roles_vc_ga(id_rol_vc_ga),
    FOREIGN KEY (id_cargo_vc_ga) REFERENCES td_cargos_vc_ga(id_cargo_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_salario_historico_vc_ga (
    id_salario_vc_ga int PRIMARY KEY,
    id_usuario_vc_ga int,
    sueldo_base_vc_ga decimal(10,2),
    sueldo_variable_vc_ga decimal(10,2),
    fecha_inicio_vc_ga date,
    fecha_fin_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_bono_vc_ga (
    id_bono_vc_ga int PRIMARY KEY,
    id_usuario_vc_ga int,
    tipo_bono_vc_ga varchar(255),
    monto_vc_ga decimal(10,2),
    fecha_pago_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_horas_extras_vc_ga (
    id_horas_extras_vc_ga int PRIMARY KEY,
    id_usuario_vc_ga int,
    cantidad_horas_vc_ga decimal(5,2),
    tipo_vc_ga varchar(255),
    fecha_vc_ga date,
    monto_vc_ga decimal(10,2),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_vacaciones_vc_ga (
    id_vacacion_vc_ga int PRIMARY KEY,
    id_usuario_vc_ga int,
    dias_derecho_vc_ga int,
    dias_disfrutados_vc_ga int,
    fecha_inicio_vc_ga date,
    fecha_fin_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_prestaciones_sociales_vc_ga (
    id_prestacion_vc_ga int PRIMARY KEY,
    id_usuario_vc_ga int,
    monto_vc_ga decimal(10,2),
    fecha_calculo_vc_ga date,
    tipo_vc_ga varchar(255),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_deduccion_vc_ga (
    id_deduccion_vc_ga int PRIMARY KEY,
    nombre_vc_ga varchar(255),
    porcentaje_vc_ga decimal(5,2),
    descripcion_vc_ga varchar(255),
    vigente_desde_vc_ga date,
    vigente_hasta_vc_ga date
  )`,

  `CREATE TABLE IF NOT EXISTS td_usuario_deduccion_vc_ga (
    id_usuario_vc_ga int,
    id_deduccion_vc_ga int,
    monto_vc_ga decimal(10,2),
    fecha_aplicacion_vc_ga date,
    PRIMARY KEY (id_usuario_vc_ga, id_deduccion_vc_ga, fecha_aplicacion_vc_ga),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga),
    FOREIGN KEY (id_deduccion_vc_ga) REFERENCES td_deduccion_vc_ga(id_deduccion_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_pago_nomina_vc_ga (
    id_pago_vc_ga int PRIMARY KEY,
    id_usuario_vc_ga int,
    fecha_pago_vc_ga date,
    monto_neto_vc_ga decimal(10,2),
    periodo_vc_ga varchar(255),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_recibo_nomina_vc_ga (
    id_recibo_vc_ga int PRIMARY KEY,
    id_pago_vc_ga int,
    fecha_generacion_vc_ga timestamp,
    contenido_vc_ga text,
    FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga(id_pago_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_reporte_banco_vc_ga (
    id_reporte_banco_vc_ga int PRIMARY KEY,
    id_pago_vc_ga int,
    info_banco_vc_ga text,
    FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga(id_pago_vc_ga)
  )`,

  `CREATE TABLE IF NOT EXISTS td_reporte_contable_vc_ga (
    id_reporte_contable_vc_ga int PRIMARY KEY,
    id_pago_vc_ga int,
    info_contable_vc_ga text,
    FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga(id_pago_vc_ga)
  )`
];


// Función para crear tablas secuencialmente
const crearTablas_vc_ga = () => {
  return tablas_vc_ga.reduce((promise_vc_ga, query_vc_ga) => {
    return promise_vc_ga.then(() => {
      return new Promise((resolve_vc_ga, reject_vc_ga) => {
        connection_vc_ga.query(query_vc_ga, (err_vc_ga) => {
          if (err_vc_ga) return reject_vc_ga(err_vc_ga);
          console.log('Tabla creada o ya existe.');
          resolve_vc_ga();
        });
      });
    });
  }, Promise.resolve());
};

connection_vc_ga.connect(async (err_vc_ga) => {
  if (err_vc_ga) {
    console.error('Error de conexión inicial:', err_vc_ga);
    return;
  }

  try {
    await new Promise((resolve_vc_ga, reject_vc_ga) => {
      connection_vc_ga.query('CREATE DATABASE IF NOT EXISTS crud_electron', (err_vc_ga) => {
        if (err_vc_ga) return reject_vc_ga(err_vc_ga);
        resolve_vc_ga();
      });
    });

    await new Promise((resolve_vc_ga, reject_vc_ga) => {
      connection_vc_ga.query('USE crud_electron', (err_vc_ga) => {
        if (err_vc_ga) return reject_vc_ga(err_vc_ga);
        resolve_vc_ga();
      });
    });

    await crearTablas_vc_ga();

    console.log('Base de datos y tablas creadas correctamente.');
  } catch (error_vc_ga) {
    console.error('Error al crear tablas:', error_vc_ga);
  }
});

// Función para ejecutar consultas (con reconexión automática)
const query_vc_ga = (sql_vc_ga, params_vc_ga = [], callback_vc_ga) => {
  // Crear una nueva conexión para cada consulta
  const db_vc_ga = mysql.createConnection({
    ...config_vc_ga,
    database: 'crud_electron'
  });

  db_vc_ga.connect((err_vc_ga) => {
    if (err_vc_ga) {
      console.error('Error de conexión:', err_vc_ga);
      return callback_vc_ga(err_vc_ga);
    }

    db_vc_ga.query(sql_vc_ga, params_vc_ga, (err_vc_ga, results_vc_ga) => {
      db_vc_ga.end();
      if (err_vc_ga) {
        console.error('Error en consulta:', err_vc_ga);
        return callback_vc_ga(err_vc_ga);
      }
      callback_vc_ga(null, results_vc_ga);
    });
  });
};

module.exports = { query_vc_ga };