CREATE DATABASE crud_electron;

USE crud_electron;

CREATE TABLE productos(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  precio DECIMAL(10,2) NOT NULL
);


-- Nuevas tablas
CREATE TABLE IF NOT EXISTS td_empresa_vc_ga (
  id_empresa_vc_ga int PRIMARY KEY,
  nombre_vc_ga varchar(255),
  rif_vc_ga varchar(255),
  direccion_vc_ga varchar(255)
);

CREATE TABLE IF NOT EXISTS td_roles_vc_ga (
  id_rol_vc_ga int PRIMARY KEY,
  nombre_vc_ga varchar(255),
  descripcion_vc_ga varchar(255)
);

CREATE TABLE IF NOT EXISTS td_status_vc_ga (
  id_status_vc_ga int PRIMARY KEY,
  descripcion_vc_ga varchar(255)
);

CREATE TABLE IF NOT EXISTS td_sucursal_vc_ga (
  id_sucursal_vc_ga int PRIMARY KEY,
  id_empresa_vc_ga int,
  nombre_vc_ga varchar(255),
  direccion_vc_ga varchar(255),
  CONSTRAINT fk_sucursal_empresa FOREIGN KEY (id_empresa_vc_ga) REFERENCES td_empresa_vc_ga (id_empresa_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_departamento_vc_ga (
  id_departamento_vc_ga int PRIMARY KEY,
  id_sucursal_vc_ga int,
  nombre_vc_ga varchar(255),
  CONSTRAINT fk_departamento_sucursal FOREIGN KEY (id_sucursal_vc_ga) REFERENCES td_sucursal_vc_ga (id_sucursal_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_usuarios_vc_ga (
  id_usuario_vc_ga int PRIMARY KEY,
  id_departamento_vc_ga int,
  id_rol_vc_ga int,
  id_status_vc_ga int,
  nombre_completo_vc_ga varchar(255),
  cedula_vc_ga varchar(255),
  rif_vc_ga varchar(255),
  fecha_nacimiento_vc_ga date,
  fecha_ingreso_vc_ga date,
  cargo_vc_ga varchar(255),
  CONSTRAINT fk_usuarios_departamento FOREIGN KEY (id_departamento_vc_ga) REFERENCES td_departamento_vc_ga (id_departamento_vc_ga),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol_vc_ga) REFERENCES td_roles_vc_ga (id_rol_vc_ga),
  CONSTRAINT fk_usuarios_status FOREIGN KEY (id_status_vc_ga) REFERENCES td_status_vc_ga (id_status_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_deduccion_vc_ga (
  id_deduccion_vc_ga int PRIMARY KEY,
  nombre_vc_ga varchar(255),
  porcentaje_vc_ga decimal(5,2),
  descripcion_vc_ga varchar(255),
  vigente_desde_vc_ga date,
  vigente_hasta_vc_ga date
);

CREATE TABLE IF NOT EXISTS td_salario_historico_vc_ga (
  id_salario_vc_ga int PRIMARY KEY,
  id_usuario_vc_ga int,
  sueldo_base_vc_ga decimal(10,2),
  sueldo_variable_vc_ga decimal(10,2),
  fecha_inicio_vc_ga date,
  fecha_fin_vc_ga date,
  CONSTRAINT fk_salario_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_bono_vc_ga (
  id_bono_vc_ga int PRIMARY KEY,
  id_usuario_vc_ga int,
  tipo_bono_vc_ga varchar(255),
  monto_vc_ga decimal(10,2),
  fecha_pago_vc_ga date,
  CONSTRAINT fk_bono_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_horas_extras_vc_ga (
  id_horas_extras_vc_ga int PRIMARY KEY,
  id_usuario_vc_ga int,
  cantidad_horas_vc_ga decimal(5,2),
  tipo_vc_ga varchar(255),
  fecha_vc_ga date,
  monto_vc_ga decimal(10,2),
  CONSTRAINT fk_horas_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_vacaciones_vc_ga (
  id_vacacion_vc_ga int PRIMARY KEY,
  id_usuario_vc_ga int,
  dias_derecho_vc_ga int,
  dias_disfrutados_vc_ga int,
  fecha_inicio_vc_ga date,
  fecha_fin_vc_ga date,
  CONSTRAINT fk_vacaciones_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_prestaciones_sociales_vc_ga (
  id_prestacion_vc_ga int PRIMARY KEY,
  id_usuario_vc_ga int,
  monto_vc_ga decimal(10,2),
  fecha_calculo_vc_ga date,
  tipo_vc_ga varchar(255),
  CONSTRAINT fk_prestaciones_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_usuario_deduccion_vc_ga (
  id_usuario_vc_ga int,
  id_deduccion_vc_ga int,
  monto_vc_ga decimal(10,2),
  fecha_aplicacion_vc_ga date,
  CONSTRAINT fk_usuario_deduccion_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga),
  CONSTRAINT fk_usuario_deduccion_deduccion FOREIGN KEY (id_deduccion_vc_ga) REFERENCES td_deduccion_vc_ga (id_deduccion_vc_ga),
  PRIMARY KEY (id_usuario_vc_ga, id_deduccion_vc_ga, fecha_aplicacion_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_pago_nomina_vc_ga (
  id_pago_vc_ga int PRIMARY KEY,
  id_usuario_vc_ga int,
  fecha_pago_vc_ga date,
  monto_neto_vc_ga decimal(10,2),
  periodo_vc_ga varchar(255),
  CONSTRAINT fk_pago_usuario FOREIGN KEY (id_usuario_vc_ga) REFERENCES td_usuarios_vc_ga (id_usuario_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_recibo_nomina_vc_ga (
  id_recibo_vc_ga int PRIMARY KEY,
  id_pago_vc_ga int,
  fecha_generacion_vc_ga timestamp,
  contenido_vc_ga text,
  CONSTRAINT fk_recibo_pago FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga (id_pago_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_reporte_banco_vc_ga (
  id_reporte_banco_vc_ga int PRIMARY KEY,
  id_pago_vc_ga int,
  info_banco_vc_ga text,
  CONSTRAINT fk_reporte_banco_pago FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga (id_pago_vc_ga)
);

CREATE TABLE IF NOT EXISTS td_reporte_contable_vc_ga (
  id_reporte_contable_vc_ga int PRIMARY KEY,
  id_pago_vc_ga int,
  info_contable_vc_ga text,
  CONSTRAINT fk_reporte_contable_pago FOREIGN KEY (id_pago_vc_ga) REFERENCES td_pago_nomina_vc_ga (id_pago_vc_ga)
);


DESCRIBE productos;