console.log("carga la conexion_vcga");
const mysql_vc_ga = require('mysql');

// Configuración de conexión inicial (sin base de datos especificada)
const config_vc_ga = {
  host: 'localhost',
  user: 'root',
  password: ''
};

// Crear una conexión global
const connection_vc_ga = mysql_vc_ga.createConnection(config_vc_ga);

const tablas_vc_ga = [
  `CREATE TABLE IF NOT EXISTS td_sucursal_vc_ga (
    id_sucursal_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    direccion_vc_ga varchar(255)
  )`,

  `CREATE TABLE IF NOT EXISTS td_departamento_vc_ga (
    id_departamento_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_sucursal_vc_ga int,
    nombre_vc_ga varchar(255),
    FOREIGN KEY (id_sucursal_vc_ga) REFERENCES td_sucursal_vc_ga(id_sucursal_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_roles_vc_ga (
    id_rol_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    descripcion_vc_ga varchar(255)
  )`,

  `CREATE TABLE IF NOT EXISTS td_cargos_vc_ga (
    id_cargo_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    descripcion_vc_ga varchar(255)
  )`,

  `CREATE TABLE IF NOT EXISTS td_usuarios_vc_ga (
    id_usuario_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_departamento_vc_ga int NULL,
    id_rol_vc_ga int NULL,
    id_cargo_vc_ga int NULL,
    nombre_completo_vc_ga varchar(255),
    cedula_vc_ga varchar(255),
    rif_vc_ga varchar(255),
    fecha_nacimiento_vc_ga date,
    fecha_ingreso_vc_ga date,
    status_vc_ga ENUM('Trabajando', 'De Vacaciones'),
    correo_electronico_vc_ga varchar(255),
    telefono_vc_ga varchar(255),
    clave_vc_ga varchar(255),
    clave_temporal_vc_ga BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_departamento_vc_ga) REFERENCES td_departamento_vc_ga(id_departamento_vc_ga) ON DELETE SET NULL,
    FOREIGN KEY (id_rol_vc_ga) REFERENCES td_roles_vc_ga(id_rol_vc_ga) ON DELETE SET NULL,
    FOREIGN KEY (id_cargo_vc_ga) REFERENCES td_cargos_vc_ga(id_cargo_vc_ga) ON DELETE SET NULL
  )`,

  `CREATE TABLE IF NOT EXISTS td_salario_historico_vc_ga (
    id_salario_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    sueldo_base_vc_ga decimal(10,2),
    sueldo_variable_vc_ga decimal(10,2),
    fecha_inicio_vc_ga date,
    fecha_fin_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_bono_vc_ga (
    id_bono_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    tipo_bono_vc_ga varchar(255),
    monto_vc_ga decimal(10,2),
    fecha_pago_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_horas_extras_vc_ga (
    id_horas_extras_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    cantidad_horas_vc_ga decimal(5,2),
    tipo_vc_ga varchar(255),
    fecha_vc_ga date,
    monto_vc_ga decimal(10,2),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_vacaciones_vc_ga (
    id_vacacion_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    dias_derecho_vc_ga int,
    dias_disfrutados_vc_ga int,
    fecha_inicio_vc_ga date,
    fecha_fin_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_prestaciones_sociales_vc_ga (
    id_prestacion_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    monto_vc_ga decimal(10,2),
    fecha_calculo_vc_ga date,
    tipo_vc_ga varchar(255),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_deduccion_vc_ga (
    id_deduccion_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    porcentaje_vc_ga decimal(5,2),
    descripcion_vc_ga varchar(255),
    vigente_desde_vc_ga date,
    vigente_hasta_vc_ga date
  )`,

  `CREATE TABLE IF NOT EXISTS td_usuario_deduccion_vc_ga (
    id_usuario_deduccion_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    id_deduccion_vc_ga int,
    monto_vc_ga decimal(10,2),
    fecha_aplicacion_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE,
    FOREIGN KEY (id_deduccion_vc_ga) REFERENCES td_deduccion_vc_ga(id_deduccion_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_pago_nomina_vc_ga (
    id_pago_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    fecha_pago_vc_ga date,
    monto_neto_vc_ga decimal(10,2),
    periodo_vc_ga varchar(255),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_recibo_nomina_vc_ga (
    id_recibo_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_pago_vc_ga int,
    fecha_generacion_vc_ga timestamp,
    contenido_vc_ga text,
    FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga(id_pago_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_reporte_banco_vc_ga (
    id_reporte_banco_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_pago_vc_ga int,
    info_banco_vc_ga text,
    FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga(id_pago_vc_ga) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS td_reporte_contable_vc_ga (
    id_reporte_contable_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_pago_vc_ga int,
    info_contable_vc_ga text,
    FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga(id_pago_vc_ga) ON DELETE CASCADE
  )`
];

// Función para insertar datos de prueba
const insertarDatosPrueba_vc_ga = () => {
  const datosPrueba_vc_ga = [
    // Limpiar tablas existentes
    "SET FOREIGN_KEY_CHECKS = 0",
    "TRUNCATE TABLE td_reporte_contable_vc_ga",
    "TRUNCATE TABLE td_reporte_banco_vc_ga",
    "TRUNCATE TABLE td_recibo_nomina_vc_ga",
    "TRUNCATE TABLE td_pago_nomina_vc_ga",
    "TRUNCATE TABLE td_usuario_deduccion_vc_ga",
    "TRUNCATE TABLE td_deduccion_vc_ga",
    "TRUNCATE TABLE td_prestaciones_sociales_vc_ga",
    "TRUNCATE TABLE td_vacaciones_vc_ga",
    "TRUNCATE TABLE td_horas_extras_vc_ga",
    "TRUNCATE TABLE td_bono_vc_ga",
    "TRUNCATE TABLE td_salario_historico_vc_ga",
    "TRUNCATE TABLE td_usuarios_vc_ga",
    "TRUNCATE TABLE td_cargos_vc_ga",
    "TRUNCATE TABLE td_roles_vc_ga",
    "TRUNCATE TABLE td_departamento_vc_ga",
    "TRUNCATE TABLE td_sucursal_vc_ga",
    "SET FOREIGN_KEY_CHECKS = 1",

    // Insertar sucursales
    `INSERT INTO td_sucursal_vc_ga (nombre_vc_ga, direccion_vc_ga) VALUES
    ('Sucursal Central', 'Av. Principal 123, Caracas'),
    ('Sucursal Este', 'Calle Este 456, Valencia'),
    ('Sucursal Oeste', 'Boulevard Oeste 789, Maracay')`,

    // Insertar departamentos
    `INSERT INTO td_departamento_vc_ga (id_sucursal_vc_ga, nombre_vc_ga) VALUES
    (1, 'Recursos Humanos'),
    (1, 'Contabilidad'),
    (2, 'Ventas'),
    (3, 'Producción'),
    (1, 'Tecnología')`,

    // Insertar roles
    `INSERT INTO td_roles_vc_ga (nombre_vc_ga, descripcion_vc_ga) VALUES
    ('Administrador', 'Acceso total al sistema'),
    ('Usuario', 'Acceso limitado a funciones básicas')`,

    // Insertar cargos
    `INSERT INTO td_cargos_vc_ga (nombre_vc_ga, descripcion_vc_ga) VALUES
    ('Director RH', 'Director de Recursos Humanos'),
    ('Contador', 'Contador general'),
    ('Vendedor', 'Ejecutivo de ventas'),
    ('Operador', 'Operador de producción'),
    ('Desarrollador', 'Desarrollador de software')`,

    // Insertar usuarios
    `INSERT INTO td_usuarios_vc_ga (id_departamento_vc_ga, id_rol_vc_ga, id_cargo_vc_ga, nombre_completo_vc_ga, cedula_vc_ga, rif_vc_ga, fecha_nacimiento_vc_ga, fecha_ingreso_vc_ga, status_vc_ga, correo_electronico_vc_ga, telefono_vc_ga, clave_vc_ga, clave_temporal_vc_ga) VALUES
    (1, 2, 1, 'María González', '12345678', 'J-12345678-9', '1980-05-15', '2015-03-10', 'Trabajando', 'maria.gonzalez@empresa.com', '04121234567', 'abc123', FALSE),
    (2, 2, 2, 'Carlos Pérez', '23456789', 'J-23456789-0', '1985-08-20', '2018-06-15', 'Trabajando', 'carlos.perez@empresa.com', '04162345678', 'def456', FALSE),
    (3, 2, 3, 'Ana Rodríguez', '34567890', 'J-34567890-1', '1990-11-25', '2020-01-05', 'De Vacaciones', 'ana.rodriguez@empresa.com', '04241234567', 'ghi789', TRUE),
    (4, 2, 4, 'Luis Martínez', '45678901', 'J-45678901-2', '1988-04-30', '2019-09-12', 'Trabajando', 'luis.martinez@empresa.com', '04141234567', 'jkl012', FALSE),
    (5, 1, 5, 'Pedro Sánchez', '56789012', 'J-56789012-3', '1992-07-18', '2021-02-20', 'Trabajando', 'pedro.sanchez@empresa.com', '04261234567', 'mno345', FALSE)`,

    // Insertar salarios históricos
    `INSERT INTO td_salario_historico_vc_ga (id_usuario_vc_ga, sueldo_base_vc_ga, sueldo_variable_vc_ga, fecha_inicio_vc_ga, fecha_fin_vc_ga) VALUES
    (1, 5000.00, 1000.00, '2015-03-10', '2018-03-09'),
    (1, 5500.00, 1200.00, '2018-03-10', NULL),
    (2, 4000.00, 800.00, '2018-06-15', '2020-06-14'),
    (2, 4500.00, 900.00, '2020-06-15', NULL),
    (3, 3000.00, 600.00, '2020-01-05', NULL),
    (4, 3500.00, 500.00, '2019-09-12', NULL),
    (5, 4200.00, 1000.00, '2021-02-20', NULL)`,

    // Insertar bonos
    `INSERT INTO td_bono_vc_ga (id_usuario_vc_ga, tipo_bono_vc_ga, monto_vc_ga, fecha_pago_vc_ga) VALUES
    (1, 'Bono Anual', 2000.00, '2022-12-15'),
    (2, 'Bono por Productividad', 1500.00, '2022-06-30'),
    (3, 'Bono Especial', 1000.00, '2022-09-15'),
    (4, 'Bono por Asistencia', 800.00, '2022-12-20'),
    (5, 'Bono por Proyecto', 1200.00, '2022-11-30')`,

    // Insertar horas extras
    `INSERT INTO td_horas_extras_vc_ga (id_usuario_vc_ga, cantidad_horas_vc_ga, tipo_vc_ga, fecha_vc_ga, monto_vc_ga) VALUES
    (1, 8.00, 'Nocturnas', '2022-10-15', 400.00),
    (2, 5.50, 'Diurnas', '2022-11-20', 275.00),
    (3, 10.00, 'Festivas', '2022-12-25', 600.00),
    (4, 6.00, 'Nocturnas', '2022-09-10', 300.00),
    (5, 12.00, 'Diurnas', '2022-08-15', 720.00)`,

    // Insertar vacaciones
    `INSERT INTO td_vacaciones_vc_ga (id_usuario_vc_ga, dias_derecho_vc_ga, dias_disfrutados_vc_ga, fecha_inicio_vc_ga, fecha_fin_vc_ga) VALUES
    (1, 30, 15, '2022-07-01', '2022-07-15'),
    (2, 30, 10, '2022-08-01', '2022-08-10'),
    (3, 30, 20, '2022-12-01', '2022-12-20'),
    (4, 30, 5, '2022-05-01', '2022-05-05'),
    (5, 30, 0, NULL, NULL)`,

    // Insertar prestaciones sociales
    `INSERT INTO td_prestaciones_sociales_vc_ga (id_usuario_vc_ga, monto_vc_ga, fecha_calculo_vc_ga, tipo_vc_ga) VALUES
    (1, 15000.00, '2022-12-31', 'Utilidades'),
    (2, 12000.00, '2022-12-31', 'Utilidades'),
    (3, 9000.00, '2022-12-31', 'Utilidades'),
    (4, 10500.00, '2022-12-31', 'Utilidades'),
    (5, 12600.00, '2022-12-31', 'Utilidades')`,

    // Insertar deducciones
    `INSERT INTO td_deduccion_vc_ga (nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga, vigente_desde_vc_ga, vigente_hasta_vc_ga) VALUES
    ('Seguro Social', 4.00, 'Aporte al seguro social', '2020-01-01', NULL),
    ('Paro Forzoso', 0.50, 'Aporte paro forzoso', '2020-01-01', NULL),
    ('Ahorro Habitacional', 1.00, 'Aporte ahorro habitacional', '2020-01-01', NULL),
    ('Préstamo Personal', 5.00, 'Deducción por préstamo', '2022-01-01', '2023-12-31'),
    ('Cuota Sindical', 1.50, 'Aporte sindical', '2021-01-01', NULL)`,

    // Insertar usuario_deduccion
    `INSERT INTO td_usuario_deduccion_vc_ga (id_usuario_vc_ga, id_deduccion_vc_ga, monto_vc_ga, fecha_aplicacion_vc_ga) VALUES
    (1, 1, 200.00, '2022-12-01'),
    (1, 2, 25.00, '2022-12-01'),
    (1, 3, 50.00, '2022-12-01'),
    (2, 1, 160.00, '2022-12-01'),
    (2, 2, 20.00, '2022-12-01'),
    (2, 3, 40.00, '2022-12-01'),
    (3, 1, 120.00, '2022-12-01'),
    (3, 2, 15.00, '2022-12-01'),
    (3, 3, 30.00, '2022-12-01'),
    (4, 1, 140.00, '2022-12-01'),
    (4, 2, 17.50, '2022-12-01'),
    (4, 3, 35.00, '2022-12-01'),
    (5, 1, 168.00, '2022-12-01'),
    (5, 2, 21.00, '2022-12-01'),
    (5, 3, 42.00, '2022-12-01')`,

    // Insertar pagos de nómina
    `INSERT INTO td_pago_nomina_vc_ga (id_usuario_vc_ga, fecha_pago_vc_ga, monto_neto_vc_ga, periodo_vc_ga) VALUES
    (1, '2022-12-30', 5200.00, 'Diciembre 2022'),
    (2, '2022-12-30', 4100.00, 'Diciembre 2022'),
    (3, '2022-12-30', 3100.00, 'Diciembre 2022'),
    (4, '2022-12-30', 3600.00, 'Diciembre 2022'),
    (5, '2022-12-30', 4300.00, 'Diciembre 2022')`,

    // Insertar recibos de nómina
    `INSERT INTO td_recibo_nomina_vc_ga (id_pago_vc_ga, fecha_generacion_vc_ga, contenido_vc_ga) VALUES
    (1, '2022-12-30 08:00:00', 'Recibo de pago para María González - Diciembre 2022'),
    (2, '2022-12-30 08:05:00', 'Recibo de pago para Carlos Pérez - Diciembre 2022'),
    (3, '2022-12-30 08:10:00', 'Recibo de pago para Ana Rodríguez - Diciembre 2022'),
    (4, '2022-12-30 08:15:00', 'Recibo de pago para Luis Martínez - Diciembre 2022'),
    (5, '2022-12-30 08:20:00', 'Recibo de pago para Pedro Sánchez - Diciembre 2022')`,

    // Insertar reportes bancarios
    `INSERT INTO td_reporte_banco_vc_ga (id_pago_vc_ga, info_banco_vc_ga) VALUES
    (1, 'Transferencia bancaria a cuenta 1234567890 - Banesco'),
    (2, 'Transferencia bancaria a cuenta 2345678901 - Banco de Venezuela'),
    (3, 'Transferencia bancaria a cuenta 3456789012 - BBVA'),
    (4, 'Transferencia bancaria a cuenta 4567890123 - BOD'),
    (5, 'Transferencia bancaria a cuenta 5678901234 - Mercantil')`,

    // Insertar reportes contables
    `INSERT INTO td_reporte_contable_vc_ga (id_pago_vc_ga, info_contable_vc_ga) VALUES
    (1, 'Asiento contable #12345 - Pago nómina Diciembre 2022 - María González'),
    (2, 'Asiento contable #12346 - Pago nómina Diciembre 2022 - Carlos Pérez'),
    (3, 'Asiento contable #12347 - Pago nómina Diciembre 2022 - Ana Rodríguez'),
    (4, 'Asiento contable #12348 - Pago nómina Diciembre 2022 - Luis Martínez'),
    (5, 'Asiento contable #12349 - Pago nómina Diciembre 2022 - Pedro Sánchez')`
  ];

  return datosPrueba_vc_ga.reduce((promise_vc_ga, query_vc_ga) => {
    return promise_vc_ga.then(() => {
      return new Promise((resolve_vc_ga, reject_vc_ga) => {
        connection_vc_ga.query(query_vc_ga, (err_vc_ga, results_vc_ga) => {
          if (err_vc_ga) {
            console.error('Error ejecutando consulta:', query_vc_ga.substring(0, 50) + '...', err_vc_ga);
            return reject_vc_ga(err_vc_ga);
          }
          console.log('Consulta ejecutada correctamente:', query_vc_ga.substring(0, 50) + '...');
          resolve_vc_ga(results_vc_ga);
        });
      });
    });
  }, Promise.resolve());
};

// Función para crear tablas secuencialmente
const crearTablas_vc_ga = () => {
  return tablas_vc_ga.reduce((promise_vc_ga, query_vc_ga) => {
    return promise_vc_ga.then(() => {
      return new Promise((resolve_vc_ga, reject_vc_ga) => {
        connection_vc_ga.query(query_vc_ga, (err_vc_ga, results_vc_ga) => {
          if (err_vc_ga) {
            console.error('Error creando tabla:', query_vc_ga.substring(0, 50) + '...', err_vc_ga);
            return reject_vc_ga(err_vc_ga);
          }
          console.log('Tabla creada o ya existe:', query_vc_ga.substring(0, 50) + '...');
          resolve_vc_ga(results_vc_ga);
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
    // Crear la base de datos si no existe
    await new Promise((resolve_vc_ga, reject_vc_ga) => {
      connection_vc_ga.query('CREATE DATABASE IF NOT EXISTS dbcrud_electron_vc_ga', (err_vc_ga, results_vc_ga) => {
        if (err_vc_ga) return reject_vc_ga(err_vc_ga);
        console.log('Base de datos verificada/creada');
        resolve_vc_ga(results_vc_ga);
      });
    });

    // Usar la base de datos
    await new Promise((resolve_vc_ga, reject_vc_ga) => {
      connection_vc_ga.query('USE dbcrud_electron_vc_ga', (err_vc_ga, results_vc_ga) => {
        if (err_vc_ga) return reject_vc_ga(err_vc_ga);
        console.log('Usando base de datos dbcrud_electron_vc_ga');
        resolve_vc_ga(results_vc_ga);
      });
    });

    // Crear tablas
    await crearTablas_vc_ga();
    
    // Insertar datos de prueba
    await insertarDatosPrueba_vc_ga();

    console.log('Base de datos, tablas y datos de prueba inicializados correctamente.');
  } catch (error_vc_ga) {
    console.error('Error durante la inicialización de la base de datos:', error_vc_ga);
  } finally {
    // No cerramos la conexión global para que esté disponible para otras operaciones
  }
});

// Función para ejecutar consultas (con reconexión automática)
const consulta_vc_ga = (sql_vc_ga, params_vc_ga = [], callback_vc_ga) => {
  // Crear una nueva conexión para cada consulta
  const db_vc_ga = mysql_vc_ga.createConnection({
    ...config_vc_ga,
    database: 'dbcrud_electron_vc_ga'
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
        callback_vc_ga(null,err_vc_ga);
      }
      callback_vc_ga(null, results_vc_ga);
    });
  });
};
const query_vc_ga = (sql_vc_ga, params_vc_ga = []) => {
  return new Promise((resolve, reject) => {
    const db_vc_ga = mysql_vc_ga.createConnection({
      ...config_vc_ga,
      database: 'dbcrud_electron_vc_ga'
    });
    db_vc_ga.connect(err_vc_ga => {
      if (err_vc_ga) return reject(err_vc_ga);
      db_vc_ga.query(sql_vc_ga, params_vc_ga, (err_vc_ga, results_vc_ga) => {
        db_vc_ga.end();
        if (err_vc_ga) return reject(err_vc_ga);
        resolve(results_vc_ga);
      });
    });
  });
};


module.exports = { query_vc_ga, consulta_vc_ga };