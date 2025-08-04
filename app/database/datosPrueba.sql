USE dbcrud_electron_vc_ga;

SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar reportes existentes
DELETE FROM td_reporte_contable_vc_ga;
DELETE FROM td_reporte_banco_vc_ga;

-- Eliminar recibos
DELETE FROM td_recibo_nomina_vc_ga;

-- Eliminaciones manteniendo solo tablas existentes
DELETE FROM td_usuario_deduccion_vc_ga;
DELETE FROM td_deduccion_vc_ga;
-- Eliminada la tabla de horas extras
DELETE FROM td_bono_vc_ga;

-- Eliminar todos los salarios
DELETE FROM td_salario_historico_vc_ga;

-- Eliminar usuarios y dependencias
DELETE FROM td_usuarios_vc_ga;
DELETE FROM td_cargos_vc_ga;
DELETE FROM td_roles_vc_ga;
DELETE FROM td_departamento_vc_ga;
DELETE FROM td_sucursal_vc_ga;

SET FOREIGN_KEY_CHECKS = 1;

-- Insertar datos de prueba con fechas alineadas
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

-- Insertar salarios actuales
INSERT INTO td_salario_historico_vc_ga (id_usuario_vc_ga, salario_vc_ga) VALUES
(1, 5500.00),
(2, 4500.00),
(3, 3000.00),
(4, 3500.00),
(5, 4200.00);

-- Bonos con fecha de pago alineada (2022-12-30)
INSERT INTO td_bono_vc_ga (id_usuario_vc_ga, tipo_bono_vc_ga, monto_vc_ga, fecha_pago_vc_ga) VALUES
(1, 'Bono Anual', 2000.00, '2022-12-30'),
(2, 'Bono por Productividad', 1500.00, '2022-12-30'),
(3, 'Bono Especial', 1000.00, '2022-12-30'),
(4, 'Bono por Asistencia', 800.00, '2022-12-30'),
(5, 'Bono por Proyecto', 1200.00, '2022-12-30');

-- Deducciones vigentes
INSERT INTO td_deduccion_vc_ga (nombre_vc_ga, porcentaje_vc_ga, descripcion_vc_ga, vigente_desde_vc_ga, vigente_hasta_vc_ga) VALUES
('Seguro Social', 4.00, 'Aporte al seguro social', '2020-01-01', NULL),
('Paro Forzoso', 0.50, 'Aporte paro forzoso', '2020-01-01', NULL),
('Ahorro Habitacional', 1.00, 'Aporte ahorro habitacional', '2020-01-01', NULL),
('Préstamo Personal', 5.00, 'Deducción por préstamo', '2022-01-01', '2023-12-31'),
('Cuota Sindical', 1.50, 'Aporte sindical', '2021-01-01', NULL);

-- Deducciones aplicadas en la fecha de pago (2022-12-30)
INSERT INTO td_usuario_deduccion_vc_ga (id_usuario_vc_ga, id_deduccion_vc_ga, monto_vc_ga, fecha_aplicacion_vc_ga) VALUES
(1, 1, 200.00, '2022-12-30'),
(1, 2, 25.00, '2022-12-30'),
(1, 3, 50.00, '2022-12-30'),
(2, 1, 160.00, '2022-12-30'),
(2, 2, 20.00, '2022-12-30'),
(2, 3, 40.00, '2022-12-30'),
(3, 1, 120.00, '2022-12-30'),
(3, 2, 15.00, '2022-12-30'),
(3, 3, 30.00, '2022-12-30'),
(4, 1, 140.00, '2022-12-30'),
(4, 2, 17.50, '2022-12-30'),
(4, 3, 35.00, '2022-12-30'),
(5, 1, 168.00, '2022-12-30'),
(5, 2, 21.00, '2022-12-30'),
(5, 3, 42.00, '2022-12-30');

-- Recibos de nómina
INSERT INTO td_recibo_nomina_vc_ga 
(id_usuario_vc_ga, fecha_pago_vc_ga, fecha_generacion_vc_ga, contenido_vc_ga) 
VALUES
(1, '2022-12-30',  '2022-12-30 08:00:00', 'Recibo de pago para María González - Diciembre 2022'),
(2, '2022-12-30',  '2022-12-30 08:05:00', 'Recibo de pago para Carlos Pérez - Diciembre 2022'),
(3, '2022-12-30',  '2022-12-30 08:10:00', 'Recibo de pago para Ana Rodríguez - Diciembre 2022'),
(4, '2022-12-30',  '2022-12-30 08:15:00', 'Recibo de pago para Luis Martínez - Diciembre 2022'),
(5, '2022-12-30',  '2022-12-30 08:20:00', 'Recibo de pago para Pedro Sánchez - Diciembre 2022');

-- Asociar deducciones a recibos
INSERT INTO td_recibo_deduccion_vc_ga (id_recibo_vc_ga, id_usuario_deduccion_vc_ga)
SELECT r.id_recibo_vc_ga, ud.id_usuario_deduccion_vc_ga
FROM td_recibo_nomina_vc_ga r
JOIN td_usuario_deduccion_vc_ga ud ON r.id_usuario_vc_ga = ud.id_usuario_vc_ga
    AND r.fecha_pago_vc_ga = ud.fecha_aplicacion_vc_ga
WHERE r.fecha_pago_vc_ga = '2022-12-30';

-- Asociar bonos a recibos
INSERT INTO td_recibo_bono_vc_ga (id_recibo_vc_ga, id_bono_vc_ga)
SELECT r.id_recibo_vc_ga, b.id_bono_vc_ga
FROM td_recibo_nomina_vc_ga r
JOIN td_bono_vc_ga b ON r.id_usuario_vc_ga = b.id_usuario_vc_ga
    AND r.fecha_pago_vc_ga = b.fecha_pago_vc_ga
WHERE r.fecha_pago_vc_ga = '2022-12-30';

-- Generar reportes bancarios (actualizado)
INSERT INTO td_reporte_banco_vc_ga (fecha_reporte_vc_ga, info_banco_vc_ga)
SELECT 
    '2022-12-30',
    JSON_OBJECT(
        'total_pagado', SUM(r.monto_neto_vc_ga),
        'cantidad_pagos', COUNT(*),
        'detalle_pagos', JSON_ARRAYAGG(
            JSON_OBJECT(
                'id_recibo', r.id_recibo_vc_ga,
                'empleado', u.nombre_completo_vc_ga,
                'cedula', u.cedula_vc_ga,
                'monto_neto', r.monto_neto_vc_ga
            )
        )
    )
FROM td_recibo_nomina_vc_ga r
JOIN td_usuarios_vc_ga u ON r.id_usuario_vc_ga = u.id_usuario_vc_ga
WHERE r.fecha_pago_vc_ga = '2022-12-30'
GROUP BY r.fecha_pago_vc_ga;

-- Generar reportes contables (actualizado sin horas extras)
INSERT INTO td_reporte_contable_vc_ga (fecha_reporte_vc_ga, info_contable_vc_ga)
SELECT 
    '2022-12-30',
    JSON_OBJECT(
        'total_nomina', SUM(r.monto_neto_vc_ga),
        'resumen_contable', JSON_OBJECT(
            'total_deducciones', COALESCE(SUM(ud.monto_vc_ga), 0),
            'total_bonos', COALESCE(SUM(b.monto_vc_ga), 0)
        )
    )
FROM td_recibo_nomina_vc_ga r
LEFT JOIN (
    SELECT id_usuario_vc_ga, SUM(monto_vc_ga) AS monto_vc_ga
    FROM td_usuario_deduccion_vc_ga
    WHERE fecha_aplicacion_vc_ga = '2022-12-30'
    GROUP BY id_usuario_vc_ga
) ud ON r.id_usuario_vc_ga = ud.id_usuario_vc_ga
LEFT JOIN (
    SELECT id_usuario_vc_ga, SUM(monto_vc_ga) AS monto_vc_ga
    FROM td_bono_vc_ga
    WHERE fecha_pago_vc_ga = '2022-12-30'
    GROUP BY id_usuario_vc_ga
) b ON r.id_usuario_vc_ga = b.id_usuario_vc_ga
WHERE r.fecha_pago_vc_ga = '2022-12-30'
GROUP BY r.fecha_pago_vc_ga;

-- Relacionar recibos con reporte bancario
INSERT INTO td_reporte_banco_recibos_vc_ga (id_reporte_banco_vc_ga, id_recibo_vc_ga)
SELECT 
    (SELECT MAX(id_reporte_banco_vc_ga) FROM td_reporte_banco_vc_ga),
    id_recibo_vc_ga
FROM td_recibo_nomina_vc_ga
WHERE fecha_pago_vc_ga = '2022-12-30';

-- Relacionar recibos con reporte contable
INSERT INTO td_reporte_contable_recibos_vc_ga (id_reporte_contable_vc_ga, id_recibo_vc_ga)
SELECT 
    (SELECT MAX(id_reporte_contable_vc_ga) FROM td_reporte_contable_vc_ga),
    id_recibo_vc_ga
FROM td_recibo_nomina_vc_ga
WHERE fecha_pago_vc_ga = '2022-12-30';