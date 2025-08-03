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