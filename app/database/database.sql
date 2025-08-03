-- Crear base de datos (opcional, si no existe)
CREATE DATABASE IF NOT EXISTS dbcrud_electron_vc_ga;
USE dbcrud_electron_vc_ga;

-- Tabla de sucursales
CREATE TABLE IF NOT EXISTS td_sucursal_vc_ga (
    id_sucursal_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga VARCHAR(255),
    direccion_vc_ga VARCHAR(255)
);

-- Tabla de departamentos
CREATE TABLE IF NOT EXISTS td_departamento_vc_ga (
    id_departamento_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    id_sucursal_vc_ga INT,
    nombre_vc_ga VARCHAR(255),
    FOREIGN KEY (id_sucursal_vc_ga) REFERENCES td_sucursal_vc_ga(id_sucursal_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS td_roles_vc_ga (
    id_rol_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga VARCHAR(255),
    descripcion_vc_ga VARCHAR(255)
);

-- Tabla de cargos
CREATE TABLE IF NOT EXISTS td_cargos_vc_ga (
    id_cargo_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga VARCHAR(255),
    descripcion_vc_ga VARCHAR(255)
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS td_usuarios_vc_ga (
    id_usuario_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    id_departamento_vc_ga INT NULL,
    id_rol_vc_ga INT NULL,
    id_cargo_vc_ga INT NULL,
    nombre_completo_vc_ga VARCHAR(255),
    cedula_vc_ga VARCHAR(255),
    rif_vc_ga VARCHAR(255),
    fecha_nacimiento_vc_ga DATE,
    fecha_ingreso_vc_ga DATE,
    status_vc_ga ENUM('Trabajando', 'De Vacaciones'),
    correo_electronico_vc_ga VARCHAR(255),
    telefono_vc_ga VARCHAR(255),
    clave_vc_ga VARCHAR(255),
    clave_temporal_vc_ga BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_departamento_vc_ga) REFERENCES td_departamento_vc_ga(id_departamento_vc_ga) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_rol_vc_ga) REFERENCES td_roles_vc_ga(id_rol_vc_ga) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_cargo_vc_ga) REFERENCES td_cargos_vc_ga(id_cargo_vc_ga) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de salario histórico
CREATE TABLE IF NOT EXISTS td_salario_historico_vc_ga (
    id_salario_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga INT,
    salario_vc_ga DECIMAL(10,2),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de bonos
CREATE TABLE IF NOT EXISTS td_bono_vc_ga (
    id_bono_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga INT,
    tipo_bono_vc_ga VARCHAR(255),
    monto_vc_ga DECIMAL(10,2),
    fecha_pago_vc_ga DATE,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de deducciones
CREATE TABLE IF NOT EXISTS td_deduccion_vc_ga (
    id_deduccion_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga VARCHAR(255),
    porcentaje_vc_ga DECIMAL(5,2),
    descripcion_vc_ga VARCHAR(255),
    vigente_desde_vc_ga DATE,
    vigente_hasta_vc_ga DATE
);

-- Tabla de relación usuario-deducción
CREATE TABLE IF NOT EXISTS td_usuario_deduccion_vc_ga (
    id_usuario_deduccion_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga INT,
    id_deduccion_vc_ga INT,
    monto_vc_ga DECIMAL(10,2),
    fecha_aplicacion_vc_ga DATE,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_deduccion_vc_ga) REFERENCES td_deduccion_vc_ga(id_deduccion_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de recibos de nómina
CREATE TABLE IF NOT EXISTS td_recibo_nomina_vc_ga (
    id_recibo_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga INT,
    id_pago_vc_ga INT,
    fecha_pago_vc_ga DATE,
    monto_neto_vc_ga DECIMAL(10,2),
    fecha_generacion_vc_ga TIMESTAMP,
    contenido_vc_ga TEXT,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de relación recibo-deducciones (M:N)
CREATE TABLE IF NOT EXISTS td_recibo_deduccion_vc_ga (
    id_recibo_vc_ga int NOT NULL,
    id_usuario_deduccion_vc_ga int NOT NULL,
    PRIMARY KEY (id_recibo_vc_ga, id_usuario_deduccion_vc_ga),
    FOREIGN KEY (id_recibo_vc_ga) REFERENCES td_recibo_nomina_vc_ga(id_recibo_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_deduccion_vc_ga) REFERENCES td_usuario_deduccion_vc_ga(id_usuario_deduccion_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de relación recibo-bonos (M:N)
CREATE TABLE IF NOT EXISTS td_recibo_bono_vc_ga (
    id_recibo_vc_ga int NOT NULL,
    id_bono_vc_ga int NOT NULL,
    PRIMARY KEY (id_recibo_vc_ga, id_bono_vc_ga),
    FOREIGN KEY (id_recibo_vc_ga) REFERENCES td_recibo_nomina_vc_ga(id_recibo_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_bono_vc_ga) REFERENCES td_bono_vc_ga(id_bono_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de reportes bancarios
CREATE TABLE IF NOT EXISTS td_reporte_banco_vc_ga (
    id_reporte_banco_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    fecha_reporte_vc_ga DATE,
    info_banco_vc_ga TEXT
);

-- Tabla de reportes contables
CREATE TABLE IF NOT EXISTS td_reporte_contable_vc_ga (
    id_reporte_contable_vc_ga INT PRIMARY KEY AUTO_INCREMENT,
    fecha_reporte_vc_ga DATE,
    info_contable_vc_ga TEXT
);

-- Relación reportes bancarios y recibos
CREATE TABLE IF NOT EXISTS td_reporte_banco_recibos_vc_ga (
    id_reporte_banco_vc_ga INT,
    id_recibo_vc_ga INT,
    PRIMARY KEY (id_reporte_banco_vc_ga, id_recibo_vc_ga),
    FOREIGN KEY (id_reporte_banco_vc_ga) REFERENCES td_reporte_banco_vc_ga(id_reporte_banco_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_recibo_vc_ga) REFERENCES td_recibo_nomina_vc_ga(id_recibo_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Relación reportes contables y recibos
CREATE TABLE IF NOT EXISTS td_reporte_contable_recibos_vc_ga (
    id_reporte_contable_vc_ga INT,
    id_recibo_vc_ga INT,
    PRIMARY KEY (id_reporte_contable_vc_ga, id_recibo_vc_ga),
    FOREIGN KEY (id_reporte_contable_vc_ga) REFERENCES td_reporte_contable_vc_ga(id_reporte_contable_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_recibo_vc_ga) REFERENCES td_recibo_nomina_vc_ga(id_recibo_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);


