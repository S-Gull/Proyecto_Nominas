USE dbcrud_electron_vc_ga;

-- Tabla de sucursales
CREATE TABLE IF NOT EXISTS td_sucursal_vc_ga (
    id_sucursal_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    direccion_vc_ga varchar(255)
);

-- Tabla de departamentos
CREATE TABLE IF NOT EXISTS td_departamento_vc_ga (
    id_departamento_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_sucursal_vc_ga int,
    nombre_vc_ga varchar(255),
    FOREIGN KEY (id_sucursal_vc_ga) REFERENCES td_sucursal_vc_ga(id_sucursal_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS td_roles_vc_ga (
    id_rol_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    descripcion_vc_ga varchar(255)
);

-- Tabla de cargos
CREATE TABLE IF NOT EXISTS td_cargos_vc_ga (
    id_cargo_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    descripcion_vc_ga varchar(255)
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS td_usuarios_vc_ga (
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
    FOREIGN KEY (id_departamento_vc_ga) REFERENCES td_departamento_vc_ga(id_departamento_vc_ga) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_rol_vc_ga) REFERENCES td_roles_vc_ga(id_rol_vc_ga) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_cargo_vc_ga) REFERENCES td_cargos_vc_ga(id_cargo_vc_ga) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de salario histórico
CREATE TABLE IF NOT EXISTS td_salario_historico_vc_ga (
    id_salario_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    salario_vc_ga decimal(10,2),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de bonos
CREATE TABLE IF NOT EXISTS td_bono_vc_ga (
    id_bono_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    tipo_bono_vc_ga varchar(255),
    monto_vc_ga decimal(10,2),
    fecha_pago_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de horas extras
CREATE TABLE IF NOT EXISTS td_horas_extras_vc_ga (
    id_horas_extras_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    cantidad_horas_vc_ga decimal(5,2),
    tipo_vc_ga varchar(255),
    fecha_vc_ga date,
    monto_vc_ga decimal(10,2),
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de deducciones
CREATE TABLE IF NOT EXISTS td_deduccion_vc_ga (
    id_deduccion_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    nombre_vc_ga varchar(255),
    porcentaje_vc_ga decimal(5,2),
    descripcion_vc_ga varchar(255),
    vigente_desde_vc_ga date,
    vigente_hasta_vc_ga date
);

-- Tabla de relación usuario-deducción
CREATE TABLE IF NOT EXISTS td_usuario_deduccion_vc_ga (
    id_usuario_deduccion_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    id_deduccion_vc_ga int,
    monto_vc_ga decimal(10,2),
    fecha_aplicacion_vc_ga date,
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_deduccion_vc_ga) REFERENCES td_deduccion_vc_ga(id_deduccion_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de recibos de nómina (modificada para no depender de pagos)
CREATE TABLE IF NOT EXISTS td_recibo_nomina_vc_ga (
    id_recibo_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    id_usuario_vc_ga int,
    id_pago_vc_ga int,
    fecha_pago_vc_ga date,  -- Fecha cuando se realizó el pago
    monto_neto_vc_ga decimal(10,2),  -- Monto total pagado
    fecha_generacion_vc_ga timestamp,  -- Cuando se generó el recibo
    contenido_vc_ga text,  -- Detalle del recibo
    FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga(id_usuario_vc_ga) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de reportes bancarios
CREATE TABLE IF NOT EXISTS td_reporte_banco_vc_ga (
    id_reporte_banco_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    fecha_reporte_vc_ga date,
    info_banco_vc_ga text
);

-- Tabla de reportes contables
CREATE TABLE IF NOT EXISTS td_reporte_contable_vc_ga (
    id_reporte_contable_vc_ga int PRIMARY KEY AUTO_INCREMENT,
    fecha_reporte_vc_ga date,
    info_contable_vc_ga text
);

-- Tabla de relación entre reportes bancarios y recibos de nómina
CREATE TABLE IF NOT EXISTS td_reporte_banco_recibos_vc_ga (
    id_reporte_banco_vc_ga int,
    id_recibo_vc_ga int,
    PRIMARY KEY (id_reporte_banco_vc_ga, id_recibo_vc_ga),
    FOREIGN KEY (id_reporte_banco_vc_ga) REFERENCES td_reporte_banco_vc_ga(id_reporte_banco_vc_ga) ON DELETE CASCADE,
    FOREIGN KEY (id_recibo_vc_ga) REFERENCES td_recibo_nomina_vc_ga(id_recibo_vc_ga) ON DELETE CASCADE
);

-- Tabla de relación entre reportes contables y recibos de nómina
CREATE TABLE IF NOT EXISTS td_reporte_contable_recibos_vc_ga (
    id_reporte_contable_vc_ga int,
    id_recibo_vc_ga int,
    PRIMARY KEY (id_reporte_contable_vc_ga, id_recibo_vc_ga),
    FOREIGN KEY (id_reporte_contable_vc_ga) REFERENCES td_reporte_contable_vc_ga(id_reporte_contable_vc_ga) ON DELETE CASCADE,
    FOREIGN KEY (id_recibo_vc_ga) REFERENCES td_recibo_nomina_vc_ga(id_recibo_vc_ga) ON DELETE CASCADE
);