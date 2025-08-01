-- 1. INSERT DE DATOS INICIALES (ajustados a condiciones)
-- Salarios ajustados a múltiplos del salario mínimo (130 Bs)
UPDATE td_salario_historico_vc_ga 
SET salario_vc_ga = 
    CASE id_usuario_vc_ga
        WHEN 1 THEN 130 * 42  -- 5,460 Bs
        WHEN 2 THEN 130 * 35  -- 4,550 Bs
        WHEN 3 THEN 130 * 23  -- 2,990 Bs
        WHEN 4 THEN 130 * 27  -- 3,510 Bs
        WHEN 5 THEN 130 * 32  -- 4,160 Bs
    END;

-- Actualizar horas extras con cálculo correcto
UPDATE td_horas_extras_vc_ga
SET monto_vc_ga = 
    CASE tipo_vc_ga
        WHEN 'Diurnas' THEN cantidad_horas_vc_ga * (SELECT salario_vc_ga FROM td_salario_historico_vc_ga sh WHERE sh.id_usuario_vc_ga = td_horas_extras_vc_ga.id_usuario_vc_ga) / 240 * 1.5
        WHEN 'Nocturnas' THEN cantidad_horas_vc_ga * (SELECT salario_vc_ga FROM td_salario_historico_vc_ga sh WHERE sh.id_usuario_vc_ga = td_horas_extras_vc_ga.id_usuario_vc_ga) / 240 * 2
    END
WHERE fecha_vc_ga LIKE '2022-%';

-- Insertar Cesta Ticket como bono no salarial
INSERT INTO td_bono_vc_ga (id_usuario_vc_ga, tipo_bono_vc_ga, monto_vc_ga, fecha_pago_vc_ga)
SELECT id_usuario_vc_ga, 'Cesta Ticket', 1000.00, '2022-12-30'
FROM td_usuarios_vc_ga;

-- Actualizar deducciones con topes
UPDATE td_usuario_deduccion_vc_ga ud
JOIN td_deduccion_vc_ga d ON ud.id_deduccion_vc_ga = d.id_deduccion_vc_ga
JOIN td_salario_historico_vc_ga sh ON ud.id_usuario_vc_ga = sh.id_usuario_vc_ga
SET ud.monto_vc_ga = 
    CASE d.nombre_vc_ga
        WHEN 'Seguro Social' THEN LEAST(sh.salario_vc_ga, 130*5) * 0.04
        WHEN 'Ahorro Habitacional' THEN LEAST(sh.salario_vc_ga, 130*10) * 0.01
        WHEN 'Paro Forzoso' THEN LEAST(sh.salario_vc_ga, 130*5) * 0.005
    END
WHERE ud.fecha_aplicacion_vc_ga = '2022-12-01'
AND d.nombre_vc_ga IN ('Seguro Social','Ahorro Habitacional','Paro Forzoso');

-- 2. SELECTS DE CÁLCULOS DE NÓMINA
-- Salario bruto (base + horas extras)
SELECT 
    u.id_usuario_vc_ga,
    u.nombre_completo_vc_ga,
    sh.salario_vc_ga AS salario_base,
    COALESCE(SUM(
        CASE 
            WHEN he.tipo_vc_ga = 'Diurnas' THEN he.cantidad_horas_vc_ga * (sh.salario_vc_ga / 240) * 1.5
            WHEN he.tipo_vc_ga = 'Nocturnas' THEN he.cantidad_horas_vc_ga * (sh.salario_vc_ga / 240) * 2
            ELSE 0
        END
    ), 0) AS total_horas_extras,
    (sh.salario_vc_ga + COALESCE(SUM(
        CASE 
            WHEN he.tipo_vc_ga = 'Diurnas' THEN he.cantidad_horas_vc_ga * (sh.salario_vc_ga / 240) * 1.5
            WHEN he.tipo_vc_ga = 'Nocturnas' THEN he.cantidad_horas_vc_ga * (sh.salario_vc_ga / 240) * 2
            ELSE 0
        END
    ), 0)) AS salario_bruto
FROM td_usuarios_vc_ga u
JOIN td_salario_historico_vc_ga sh ON u.id_usuario_vc_ga = sh.id_usuario_vc_ga
LEFT JOIN td_horas_extras_vc_ga he 
    ON u.id_usuario_vc_ga = he.id_usuario_vc_ga
    AND he.fecha_vc_ga BETWEEN '2022-12-01' AND '2022-12-31'
GROUP BY u.id_usuario_vc_ga, u.nombre_completo_vc_ga, sh.salario_vc_ga;

-- Total deducciones
SELECT 
    u.id_usuario_vc_ga,
    u.nombre_completo_vc_ga,
    SUM(ud.monto_vc_ga) AS total_deducciones
FROM td_usuarios_vc_ga u
JOIN td_usuario_deduccion_vc_ga ud ON u.id_usuario_vc_ga = ud.id_usuario_vc_ga
WHERE ud.fecha_aplicacion_vc_ga = '2022-12-01'
GROUP BY u.id_usuario_vc_ga, u.nombre_completo_vc_ga;

-- Salario neto
SELECT 
    u.id_usuario_vc_ga,
    u.nombre_completo_vc_ga,
    sh.salario_vc_ga AS salario_base,
    COALESCE(he.total_horas_extras, 0) AS total_horas_extras,
    (sh.salario_vc_ga + COALESCE(he.total_horas_extras, 0)) AS salario_bruto,
    COALESCE(ud.total_deducciones, 0) AS total_deducciones,
    (sh.salario_vc_ga + COALESCE(he.total_horas_extras, 0) - COALESCE(ud.total_deducciones, 0)) AS salario_neto
FROM td_usuarios_vc_ga u
JOIN td_salario_historico_vc_ga sh ON u.id_usuario_vc_ga = sh.id_usuario_vc_ga
LEFT JOIN (
    SELECT 
        id_usuario_vc_ga,
        SUM(
            CASE 
                WHEN tipo_vc_ga = 'Diurnas' THEN cantidad_horas_vc_ga * (sh.salario_vc_ga / 240) * 1.5
                WHEN tipo_vc_ga = 'Nocturnas' THEN cantidad_horas_vc_ga * (sh.salario_vc_ga / 240) * 2
                ELSE 0
            END
        ) AS total_horas_extras
    FROM td_horas_extras_vc_ga he
    JOIN td_salario_historico_vc_ga sh ON he.id_usuario_vc_ga = sh.id_usuario_vc_ga
    WHERE he.fecha_vc_ga BETWEEN '2022-12-01' AND '2022-12-31'
    GROUP BY id_usuario_vc_ga
) he ON u.id_usuario_vc_ga = he.id_usuario_vc_ga
LEFT JOIN (
    SELECT 
        id_usuario_vc_ga,
        SUM(monto_vc_ga) AS total_deducciones
    FROM td_usuario_deduccion_vc_ga
    WHERE fecha_aplicacion_vc_ga = '2022-12-01'
    GROUP BY id_usuario_vc_ga
) ud ON u.id_usuario_vc_ga = ud.id_usuario_vc_ga;

-- Bono no salarial (Cesta Ticket)
SELECT 
    u.id_usuario_vc_ga,
    u.nombre_completo_vc_ga,
    b.monto_vc_ga AS cesta_ticket,
    b.fecha_pago_vc_ga
FROM td_bono_vc_ga b
JOIN td_usuarios_vc_ga u ON b.id_usuario_vc_ga = u.id_usuario_vc_ga
WHERE b.tipo_bono_vc_ga = 'Cesta Ticket'
AND b.fecha_pago_vc_ga = '2022-12-30';