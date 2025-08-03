-- FUNCIONES PARA BONOS
DELIMITER //
CREATE FUNCTION fn_insertar_bono_vc_ga(
    p_id_usuario_vc_ga INT,
    p_tipo_bono_vc_ga VARCHAR(255),
    p_monto_vc_ga DECIMAL(10,2),
    p_fecha_pago_vc_ga DATE
) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE bono_id INT;
    
    -- Verificar si el usuario existe
    IF NOT EXISTS (SELECT 1 FROM td_usuarios_vc_ga WHERE id_usuario_vc_ga = p_id_usuario_vc_ga) THEN
        RETURN -1; -- Usuario no existe
    END IF;
    
    -- Insertar el bono
    INSERT INTO td_bono_vc_ga (
        id_usuario_vc_ga,
        tipo_bono_vc_ga,
        monto_vc_ga,
        fecha_pago_vc_ga
    ) VALUES (
        p_id_usuario_vc_ga,
        p_tipo_bono_vc_ga,
        p_monto_vc_ga,
        p_fecha_pago_vc_ga
    );
    
    -- Obtener el ID del bono insertado
    SET bono_id = LAST_INSERT_ID();
    
    RETURN bono_id;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION fn_editar_bono_vc_ga(
    p_id_bono_vc_ga INT,
    p_id_usuario_vc_ga INT,
    p_tipo_bono_vc_ga VARCHAR(255),
    p_monto_vc_ga DECIMAL(10,2),
    p_fecha_pago_vc_ga DATE
) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE rows_affected INT;
    
    -- Verificar si el bono existe
    IF NOT EXISTS (SELECT 1 FROM td_bono_vc_ga WHERE id_bono_vc_ga = p_id_bono_vc_ga) THEN
        RETURN FALSE; -- Bono no existe
    END IF;
    
    -- Verificar si el usuario existe
    IF NOT EXISTS (SELECT 1 FROM td_usuarios_vc_ga WHERE id_usuario_vc_ga = p_id_usuario_vc_ga) THEN
        RETURN FALSE; -- Usuario no existe
    END IF;
    
    -- Actualizar el bono
    UPDATE td_bono_vc_ga
    SET 
        id_usuario_vc_ga = p_id_usuario_vc_ga,
        tipo_bono_vc_ga = p_tipo_bono_vc_ga,
        monto_vc_ga = p_monto_vc_ga,
        fecha_pago_vc_ga = p_fecha_pago_vc_ga
    WHERE id_bono_vc_ga = p_id_bono_vc_ga;
    
    -- Verificar si se actualizó correctamente
    SET rows_affected = ROW_COUNT();
    
    RETURN rows_affected > 0;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION fn_eliminar_bono_vc_ga(
    p_id_bono_vc_ga INT
) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE rows_affected INT;
    
    -- Verificar si el bono existe
    IF NOT EXISTS (SELECT 1 FROM td_bono_vc_ga WHERE id_bono_vc_ga = p_id_bono_vc_ga) THEN
        RETURN FALSE; -- Bono no existe
    END IF;
    
    -- Eliminar el bono
    DELETE FROM td_bono_vc_ga WHERE id_bono_vc_ga = p_id_bono_vc_ga;
    
    -- Verificar si se eliminó correctamente
    SET rows_affected = ROW_COUNT();
    
    RETURN rows_affected > 0;
END //
DELIMITER ;


DELIMITER //

-- =============================
-- TRIGGERS PARA TD_BONO_VC_GA
-- =============================

-- 1) Después de insertar un bono: asociar el nuevo bono a todos sus recibos existentes
CREATE TRIGGER trg_bono_after_insert
AFTER INSERT ON td_bono_vc_ga
FOR EACH ROW
BEGIN
    INSERT IGNORE INTO td_recibo_bono_vc_ga (id_recibo_vc_ga, id_bono_vc_ga)
    SELECT r.id_recibo_vc_ga, NEW.id_bono_vc_ga
    FROM td_recibo_nomina_vc_ga AS r
    WHERE r.id_usuario_vc_ga = NEW.id_usuario_vc_ga;
END;
//

-- 2) Después de borrar un bono: eliminar todas sus asociaciones en recibos
CREATE TRIGGER trg_bono_after_delete
AFTER DELETE ON td_bono_vc_ga
FOR EACH ROW
BEGIN
    DELETE rb
    FROM td_recibo_bono_vc_ga AS rb
    WHERE rb.id_bono_vc_ga = OLD.id_bono_vc_ga;
END;
//

-- 3) Después de actualizar un bono: si cambió de usuario, reubicar asociaciones
CREATE TRIGGER trg_bono_after_update
AFTER UPDATE ON td_bono_vc_ga
FOR EACH ROW
BEGIN
    IF OLD.id_usuario_vc_ga <> NEW.id_usuario_vc_ga THEN
        -- 3a) Eliminar asociaciones viejas
        DELETE rb
        FROM td_recibo_bono_vc_ga AS rb
        WHERE rb.id_bono_vc_ga = OLD.id_bono_vc_ga;

        -- 3b) Insertar asociaciones nuevas
        INSERT IGNORE INTO td_recibo_bono_vc_ga (id_recibo_vc_ga, id_bono_vc_ga)
        SELECT r.id_recibo_vc_ga, NEW.id_bono_vc_ga
        FROM td_recibo_nomina_vc_ga AS r
        WHERE r.id_usuario_vc_ga = NEW.id_usuario_vc_ga;
    END IF;
END;
//

-- ===========================================
-- TRIGGERS PARA TD_USUARIO_DEDUCCION_VC_GA
-- ===========================================

-- 4) Después de insertar una deducción de usuario: asociar a sus recibos
CREATE TRIGGER trg_deduccion_after_insert
AFTER INSERT ON td_usuario_deduccion_vc_ga
FOR EACH ROW
BEGIN
    INSERT IGNORE INTO td_recibo_deduccion_vc_ga (id_recibo_vc_ga, id_usuario_deduccion_vc_ga)
    SELECT r.id_recibo_vc_ga, NEW.id_usuario_deduccion_vc_ga
    FROM td_recibo_nomina_vc_ga AS r
    WHERE r.id_usuario_vc_ga = NEW.id_usuario_vc_ga;
END;
//

-- 5) Después de borrar una deducción de usuario: quitar de todos los recibos
CREATE TRIGGER trg_deduccion_after_delete
AFTER DELETE ON td_usuario_deduccion_vc_ga
FOR EACH ROW
BEGIN
    DELETE rd
    FROM td_recibo_deduccion_vc_ga AS rd
    WHERE rd.id_usuario_deduccion_vc_ga = OLD.id_usuario_deduccion_vc_ga;
END;
//

-- 6) Después de actualizar una deducción de usuario: si cambió de usuario, reubicar
CREATE TRIGGER trg_deduccion_after_update
AFTER UPDATE ON td_usuario_deduccion_vc_ga
FOR EACH ROW
BEGIN
    IF OLD.id_usuario_vc_ga <> NEW.id_usuario_vc_ga THEN
        -- 6a) Eliminar asociaciones viejas
        DELETE rd
        FROM td_recibo_deduccion_vc_ga AS rd
        WHERE rd.id_usuario_deduccion_vc_ga = OLD.id_usuario_deduccion_vc_ga;

        -- 6b) Insertar asociaciones nuevas
        INSERT IGNORE INTO td_recibo_deduccion_vc_ga (id_recibo_vc_ga, id_usuario_deduccion_vc_ga)
        SELECT r.id_recibo_vc_ga, NEW.id_usuario_deduccion_vc_ga
        FROM td_recibo_nomina_vc_ga AS r
        WHERE r.id_usuario_vc_ga = NEW.id_usuario_vc_ga;
    END IF;
END;
//

DELIMITER ;



DELIMITER //

CREATE TRIGGER tr_calcular_salario_neto_vc_ga
AFTER INSERT ON td_usuario_deduccion_vc_ga
FOR EACH ROW
BEGIN
    DECLARE salario_base DECIMAL(10,2);
    DECLARE total_bonos DECIMAL(10,2);
    DECLARE total_deducciones DECIMAL(10,2);
    DECLARE salario_neto DECIMAL(10,2);
    DECLARE recibo_id INT;
    DECLARE recibo_existente INT;
    
    -- Obtener el salario base más reciente del empleado
    SELECT IFNULL(salario_vc_ga, 0) INTO salario_base
    FROM td_salario_historico_vc_ga
    WHERE id_usuario_vc_ga = NEW.id_usuario_vc_ga
    ORDER BY id_salario_vc_ga DESC
    LIMIT 1;
    
    -- Calcular la suma total de bonos del empleado
    SELECT IFNULL(SUM(monto_vc_ga), 0) INTO total_bonos
    FROM td_bono_vc_ga
    WHERE id_usuario_vc_ga = NEW.id_usuario_vc_ga;
    
    -- Calcular la suma total de deducciones del empleado
    SELECT IFNULL(SUM(monto_vc_ga), 0) INTO total_deducciones
    FROM td_usuario_deduccion_vc_ga
    WHERE id_usuario_vc_ga = NEW.id_usuario_vc_ga;
    
    -- Calcular el salario neto
    SET salario_neto = salario_base + total_bonos - total_deducciones;
    
    -- Verificar si ya existe un recibo para este empleado en el mes actual
    SELECT COUNT(*), IFNULL(MAX(id_recibo_vc_ga), 0) INTO recibo_existente, recibo_id
    FROM td_recibo_nomina_vc_ga
    WHERE id_usuario_vc_ga = NEW.id_usuario_vc_ga
    AND MONTH(fecha_pago_vc_ga) = MONTH(CURRENT_DATE())
    AND YEAR(fecha_pago_vc_ga) = YEAR(CURRENT_DATE());
    
    -- Si ya existe un recibo, actualizarlo
    IF recibo_existente > 0 THEN
        UPDATE td_recibo_nomina_vc_ga
        SET 
            monto_neto_vc_ga = salario_neto,
            fecha_generacion_vc_ga = NOW()
        WHERE id_recibo_vc_ga = recibo_id;
    ELSE
        -- Si no existe, crear uno nuevo
        INSERT INTO td_recibo_nomina_vc_ga (
            id_usuario_vc_ga,
            fecha_pago_vc_ga,
            monto_neto_vc_ga,
            fecha_generacion_vc_ga,
            contenido_vc_ga
        ) VALUES (
            NEW.id_usuario_vc_ga,
            LAST_DAY(CURRENT_DATE()),
            salario_neto,
            NOW(),
            CONCAT('Recibo de pago generado automáticamente - ', 
                  MONTHNAME(CURRENT_DATE()), ' ', 
                  YEAR(CURRENT_DATE()))
        );
    END IF;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_actualizar_recibo_nomina(IN p_id_usuario INT)
BEGIN
    DECLARE salario_base DECIMAL(10,2);
    DECLARE total_bonos DECIMAL(10,2);
    DECLARE total_deducciones DECIMAL(10,2);
    DECLARE salario_neto DECIMAL(10,2);
    DECLARE recibo_id INT;
    DECLARE recibo_existente INT;
    
    -- Obtener el salario base más reciente del empleado
    SELECT IFNULL(salario_vc_ga, 0) INTO salario_base
    FROM td_salario_historico_vc_ga
    WHERE id_usuario_vc_ga = p_id_usuario
    ORDER BY id_salario_vc_ga DESC
    LIMIT 1;
    
    -- Calcular la suma total de bonos del empleado
    SELECT IFNULL(SUM(monto_vc_ga), 0) INTO total_bonos
    FROM td_bono_vc_ga
    WHERE id_usuario_vc_ga = p_id_usuario;
    
    -- Calcular la suma total de deducciones del empleado
    SELECT IFNULL(SUM(monto_vc_ga), 0) INTO total_deducciones
    FROM td_usuario_deduccion_vc_ga
    WHERE id_usuario_vc_ga = p_id_usuario;
    
    -- Calcular el salario neto
    SET salario_neto = salario_base + total_bonos - total_deducciones;
    
    -- Verificar si ya existe un recibo para este empleado en el mes actual
    SELECT COUNT(*), IFNULL(MAX(id_recibo_vc_ga), 0) INTO recibo_existente, recibo_id
    FROM td_recibo_nomina_vc_ga
    WHERE id_usuario_vc_ga = p_id_usuario
    AND MONTH(fecha_pago_vc_ga) = MONTH(CURRENT_DATE())
    AND YEAR(fecha_pago_vc_ga) = YEAR(CURRENT_DATE());
    
    -- Si ya existe un recibo, actualizarlo
    IF recibo_existente > 0 THEN
        UPDATE td_recibo_nomina_vc_ga
        SET 
            monto_neto_vc_ga = salario_neto,
            fecha_generacion_vc_ga = NOW()
        WHERE id_recibo_vc_ga = recibo_id;
    ELSE
        -- Si no existe, crear uno nuevo
        INSERT INTO td_recibo_nomina_vc_ga (
            id_usuario_vc_ga,
            fecha_pago_vc_ga,
            monto_neto_vc_ga,
            fecha_generacion_vc_ga,
            contenido_vc_ga
        ) VALUES (
            p_id_usuario,
            LAST_DAY(CURRENT_DATE()),
            salario_neto,
            NOW(),
            CONCAT('Recibo de pago generado automáticamente - ', 
                  MONTHNAME(CURRENT_DATE()), ' ', 
                  YEAR(CURRENT_DATE()))
        );
    END IF;
END//

DELIMITER ;

DELIMITER //

-- Trigger para actualización de salarios
CREATE TRIGGER tr_actualizar_recibo_salario_vc_ga
AFTER INSERT ON td_salario_historico_vc_ga
FOR EACH ROW
BEGIN
    CALL sp_actualizar_recibo_nomina(NEW.id_usuario_vc_ga);
END//

-- Trigger para actualización de bonos
CREATE TRIGGER tr_actualizar_recibo_bonos_vc_ga
AFTER INSERT ON td_bono_vc_ga
FOR EACH ROW
BEGIN
    CALL sp_actualizar_recibo_nomina(NEW.id_usuario_vc_ga);
END//

-- Trigger para actualización de deducciones
CREATE TRIGGER tr_actualizar_recibo_deducciones_vc_ga
AFTER INSERT ON td_usuario_deduccion_vc_ga
FOR EACH ROW
BEGIN
    CALL sp_actualizar_recibo_nomina(NEW.id_usuario_vc_ga);
END//

DELIMITER ;

DELIMITER //

-- Trigger para actualización de salarios (UPDATE)
CREATE TRIGGER tr_actualizar_recibo_salario_update_vc_ga
AFTER UPDATE ON td_salario_historico_vc_ga
FOR EACH ROW
BEGIN
    CALL sp_actualizar_recibo_nomina(NEW.id_usuario_vc_ga);
END//

-- Trigger para eliminación de bonos (DELETE)
CREATE TRIGGER tr_actualizar_recibo_bonos_delete_vc_ga
AFTER DELETE ON td_bono_vc_ga
FOR EACH ROW
BEGIN
    CALL sp_actualizar_recibo_nomina(OLD.id_usuario_vc_ga);
END//

DELIMITER ;