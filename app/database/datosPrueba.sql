-- Para Introducir los datos en linux con xampp haz este comando:/opt/lampp/bin/mysql -u root -p dbcrud_electron_vc_ga < datosPrueba.sql

USE dbcrud_electron_vc_ga;

SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar reportes contables y bancarios por fecha (nueva estructura)
DELETE FROM td_reporte_contable_vc_ga 
WHERE fecha_reporte_vc_ga = '2022-12-30';

DELETE FROM td_reporte_banco_vc_ga 
WHERE fecha_reporte_vc_ga = '2022-12-30';

-- Eliminar recibos y pagos por fecha de pago
DELETE FROM td_recibo_nomina_vc_ga 
WHERE id_pago_vc_ga IN (
    SELECT id_pago_vc_ga 
    FROM td_pago_nomina_vc_ga 
    WHERE fecha_pago_vc_ga = '2022-12-30'
);

DELETE FROM td_pago_nomina_vc_ga 
WHERE fecha_pago_vc_ga = '2022-12-30';

-- Eliminaciones manteniendo solo tablas existentes
DELETE FROM td_usuario_deduccion_vc_ga 
WHERE fecha_aplicacion_vc_ga = '2022-12-01';

DELETE FROM td_deduccion_vc_ga 
WHERE vigente_desde_vc_ga >= '2020-01-01';

DELETE FROM td_horas_extras_vc_ga 
WHERE fecha_vc_ga LIKE '2022-%';

DELETE FROM td_bono_vc_ga 
WHERE fecha_pago_vc_ga LIKE '2022-%';

-- Eliminar todos los salarios (nueva estructura simplificada)
DELETE FROM td_salario_historico_vc_ga;

-- Eliminar usuarios y dependencias
DELETE FROM td_usuarios_vc_ga 
WHERE cedula_vc_ga IN ('12345678', '23456789', '34567890', '45678901', '56789012');

DELETE FROM td_cargos_vc_ga 
WHERE nombre_vc_ga IN ('Director RH', 'Contador', 'Vendedor', 'Operador', 'Desarrollador');

DELETE FROM td_roles_vc_ga 
WHERE nombre_vc_ga IN ('Administrador', 'Usuario');

DELETE FROM td_departamento_vc_ga 
WHERE nombre_vc_ga IN ('Recursos Humanos', 'Contabilidad', 'Ventas', 'Producción', 'Tecnología');

DELETE FROM td_sucursal_vc_ga 
WHERE nombre_vc_ga IN ('Sucursal Central', 'Sucursal Este', 'Sucursal Oeste');

SET FOREIGN_KEY_CHECKS = 1;

-- Insertar datos de prueba adaptados a la nueva estructura
INSERT INTO td_sucursal_vc_ga (nombre_vc_ga, direccion_vc_ga) VALUES
('Sucursal Central', 'Av. Principal 123, Caracas'),
('Sucursal Este', 'Calle Este 456, Valencia'),
('Sucursal Oeste', 'Boulevard Oeste 789, Maracay');

INSERT INTO td_departamento_vc_ga (id_sucursal_vc_ga, nombre_vc_ga) VALUES
(1, 'Recursos Humanos'),
(1, 'Contabilidad'),
(2, 'Ventas'),
(3, 'Producción'),
(1, 'Tecnología');

INSERT INTO td_roles_vc_ga (nombre_vc_ga, descripcion_vc_ga) VALUES
('Administrador', 'Acceso total al sistema'),
('Usuario', 'Acceso limitado a funciones básicas');

INSERT INTO td_cargos_vc_ga (nombre_vc_ga, descripcion_vc_ga) VALUES
('Director RH', 'Director de Recursos Humanos'),
('Contador', 'Contador general'),
('Vendedor', 'Ejecutivo de ventas'),
('Operador', 'Operador de producción'),
('Desarrollador', 'Desarrollador de software');

INSERT INTO td_usuarios_vc_ga (id_departamento_vc_ga, id_rol_vc_ga, id_cargo_vc_ga, nombre_completo_vc_ga, cedula_vc_ga, rif_vc_ga, fecha_nacimiento_vc_ga, fecha_ingreso_vc_ga, status_vc_ga, correo_electronico_vc_ga, telefono_vc_ga, clave_vc_ga, clave_temporal_vc_ga) VALUES
(1, 2, 1, 'María González', '12345678', 'J-12345678-9', '1980-05-15', '2015-03-10', 'Trabajando', 'maria.gonzalez@empresa.com', '04121234567', 'abc123', FALSE),
(2, 2, 2, 'Carlos Pérez', '23456789', 'J-23456789-0', '1985-08-20', '2018-06-15', 'Trabajando', 'carlos.perez@empresa.com', '04162345678', 'def456', FALSE),
(3, 2, 3, 'Ana Rodríguez', '34567890', 'J-34567890-1', '1990-11-25', '2020-01-05', 'De Vacaciones', 'ana.rodriguez@empresa.com', '04241234567', 'ghi789', TRUE),
(4, 2, 4, 'Luis Martínez', '45678901', 'J-45678901-2', '1988-04-30', '2019-09-12', 'Trabajando', 'luis.martinez@empresa.com', '04141234567', 'jkl012', FALSE),
(5, 1, 5, 'Pedro Sánchez', '56789012', 'J-56789012-3', '1992-07-18', '2021-02-20', 'Trabajando', 'pedro.sanchez@empresa.com', '04261234567', 'mno345', FALSE);

-- Insertar solo salario actual (nueva estructura simplificada)
INSERT INTO td_salario_historico_vc_ga (id_usuario_vc_ga, salario_vc_ga) VALUES
(1, 5500.00),
(2, 4500.00),
(3, 3000.00),
(4, 3500.00),
(5, 4200.00);

INSERT INTO td_bono_vc_ga (id_usuario_vc_ga, tipo_bono_vc_ga, monto_vc_ga, fecha_pago_vc_ga) VALUES
(1, 'Bono Anual', 2000.00, '2022-12-15'),
(2, 'Bono por Productividad', 1500.00, '2022-06-30'),
(3, 'Bono Especial', 1000.00, '2022-09-15'),
(4, 'Bono por Asistencia', 800.00, '2022-12-20'),
(5, 'Bono por Proyecto', 1200.00, '2022-11-30');

INSERT INTO td_horas_extras_vc_ga (id_usuario_vc_ga, cantidad_horas_vc_ga, tipo_vc_ga, fecha_vc_ga, monto_vc_ga) VALUES
(1, 8.00, 'Nocturnas', '2022-10-15', 400.00),
(2, 5.50, 'Diurnas', '2022-11-20', 275.00),
(3, 10.00, 'Festivas', '2022-12-25', 600.00),
(4, 6.00, 'Nocturnas', '2022-09-10', 300.00),
(5, 12.00, 'Diurnas', '2022-08-15', 720.00);

INSERT INTO td_deduccion_vc_ga (nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga, vigente_desde_vc_ga, vigente_hasta_vc_ga) VALUES
('Seguro Social', 4.00, 'Aporte al seguro social', '2020-01-01', NULL),
('Paro Forzoso', 0.50, 'Aporte paro forzoso', '2020-01-01', NULL),
('Ahorro Habitacional', 1.00, 'Aporte ahorro habitacional', '2020-01-01', NULL),
('Préstamo Personal', 5.00, 'Deducción por préstamo', '2022-01-01', '2023-12-31'),
('Cuota Sindical', 1.50, 'Aporte sindical', '2021-01-01', NULL);

INSERT INTO td_usuario_deduccion_vc_ga (id_usuario_vc_ga, id_deduccion_vc_ga, monto_vc_ga, fecha_aplicacion_vc_ga) VALUES
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
(5, 3, 42.00, '2022-12-01');

-- Insertar pagos sin período
INSERT INTO td_pago_nomina_vc_ga (id_usuario_vc_ga, fecha_pago_vc_ga, monto_neto_vc_ga) VALUES
(1, '2022-12-30', 5200.00),
(2, '2022-12-30', 4100.00),
(3, '2022-12-30', 3100.00),
(4, '2022-12-30', 3600.00),
(5, '2022-12-30', 4300.00);

INSERT INTO td_recibo_nomina_vc_ga (id_pago_vc_ga, fecha_generacion_vc_ga, contenido_vc_ga) VALUES
(1, '2022-12-30 08:00:00', 'Recibo de pago para María González - Diciembre 2022'),
(2, '2022-12-30 08:05:00', 'Recibo de pago para Carlos Pérez - Diciembre 2022'),
(3, '2022-12-30 08:10:00', 'Recibo de pago para Ana Rodríguez - Diciembre 2022'),
(4, '2022-12-30 08:15:00', 'Recibo de pago para Luis Martínez - Diciembre 2022'),
(5, '2022-12-30 08:20:00', 'Recibo de pago para Pedro Sánchez - Diciembre 2022');

-- Insertar reportes consolidados diarios (nueva estructura)
INSERT INTO td_reporte_banco_vc_ga (fecha_reporte_vc_ga, info_banco_vc_ga) VALUES
('2022-12-30', 'Transferencias bancarias del día 2022-12-30: '
                '1) Cuenta 1234567890 - Banesco - $5200.00, '
                '2) Cuenta 2345678901 - Banco de Venezuela - $4100.00, '
                '3) Cuenta 3456789012 - BBVA - $3100.00, '
                '4) Cuenta 4567890123 - BOD - $3600.00, '
                '5) Cuenta 5678901234 - Mercantil - $4300.00');

INSERT INTO td_reporte_contable_vc_ga (fecha_reporte_vc_ga, info_contable_vc_ga) VALUES
('2022-12-30', 'Asientos contables consolidados del día 2022-12-30: '
                'Total nómina: $20,300.00. Detalle: '
                'María González ($5200.00), Carlos Pérez ($4100.00), '
                'Ana Rodríguez ($3100.00), Luis Martínez ($3600.00), '
                'Pedro Sánchez ($4300.00)');