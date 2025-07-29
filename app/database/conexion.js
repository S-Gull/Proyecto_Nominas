console.log("Cargando módulo de conexión VCGA");

const mysql = require('mysql2');
const fs = require('fs').promises;
const path = require('path');

// Configuración de conexión con charset para español
const config = {
  host: 'localhost',
  user: 'root',
  password: '3690',
  charset: 'utf8mb4' // Soporte completo para Unicode (incluye emojis y caracteres especiales)
};

// Función para verificar si la BD existe
const verificarExistenciaBD_vc_ga = async (conexion_vc_ga) => {
  return new Promise((resolver_vc_ga, rechazar_vc_ga) => {
    conexion_vc_ga.query(`SHOW DATABASES LIKE 'dbcrud_electron_vc_ga'`, (error_vc_ga, resultados_vc_ga) => {
      if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
      resolver_vc_ga(resultados_vc_ga.length > 0);
    });
  });
};

// Función para verificar si la BD tiene tablas
const verificarTablasBD_vc_ga = async (conexion_vc_ga) => {
  return new Promise((resolver_vc_ga, rechazar_vc_ga) => {
    conexion_vc_ga.query(`USE dbcrud_electron_vc_ga`, (error_vc_ga) => {
      if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
      
      conexion_vc_ga.query(`SHOW TABLES`, (error_vc_ga, resultados_vc_ga) => {
        if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
        resolver_vc_ga(resultados_vc_ga.length > 0);
      });
    });
  });
};

// Función para eliminar y recrear la BD con collation para español
const recrearBD_vc_ga = async (conexion_vc_ga) => {
  try {
    await new Promise((resolver_vc_ga, rechazar_vc_ga) => {
      conexion_vc_ga.query(`DROP DATABASE IF EXISTS dbcrud_electron_vc_ga`, (error_vc_ga) => {
        if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
        console.log('Base de datos eliminada');
        resolver_vc_ga();
      });
    });

    await new Promise((resolver_vc_ga, rechazar_vc_ga) => {
      conexion_vc_ga.query(
        `CREATE DATABASE dbcrud_electron_vc_ga 
         CHARACTER SET utf8mb4 
         COLLATE utf8mb4_spanish_ci`, 
        (error_vc_ga) => {
          if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
          console.log('Base de datos creada');
          resolver_vc_ga();
        }
      );
    });

    await new Promise((resolver_vc_ga, rechazar_vc_ga) => {
      conexion_vc_ga.query(`USE dbcrud_electron_vc_ga`, (error_vc_ga) => {
        if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
        resolver_vc_ga();
      });
    });
  } catch (error_vc_ga) {
    console.error('Error al recrear la base de datos:', error_vc_ga);
    throw error_vc_ga;
  }
};

// Función para ejecutar archivo SQL con soporte para español
const ejecutarArchivoSQL_vc_ga = async (conexion_vc_ga, rutaArchivo_vc_ga) => {
  try {
    const contenidoSQL_vc_ga = await fs.readFile(rutaArchivo_vc_ga, 'utf8');
    const consultas_vc_ga = contenidoSQL_vc_ga.split(';').filter(q => q.trim().length > 0);
    
    await new Promise((resolver_vc_ga, rechazar_vc_ga) => {
      conexion_vc_ga.query(`SET NAMES utf8mb4`, (error_vc_ga) => {
        if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
        resolver_vc_ga();
      });
    });

    for (const consulta_vc_ga of consultas_vc_ga) {
      await new Promise((resolver_vc_ga, rechazar_vc_ga) => {
        conexion_vc_ga.query(consulta_vc_ga, (error_vc_ga, resultados_vc_ga) => {
          if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
          console.log('Consulta ejecutada:', consulta_vc_ga.substring(0, 50) + '...');
          resolver_vc_ga(resultados_vc_ga);
        });
      });
    }
  } catch (error_vc_ga) {
    console.error('Error al ejecutar archivo SQL:', error_vc_ga);
    throw error_vc_ga;
  }
};

// Función principal de inicialización
const inicializarBD_vc_ga = async () => {
  const conexion_vc_ga = mysql.createConnection(config);
  
  try {
    await new Promise((resolver_vc_ga, rechazar_vc_ga) => {
      conexion_vc_ga.connect(error_vc_ga => {
        if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
        resolver_vc_ga();
      });
    });

    const bdExiste_vc_ga = await verificarExistenciaBD_vc_ga(conexion_vc_ga);
    
    if (bdExiste_vc_ga) {
      console.log('La base de datos ya existe');
      
      const tieneTablas_vc_ga = await verificarTablasBD_vc_ga(conexion_vc_ga).catch(() => false);
      
      if (!tieneTablas_vc_ga) {
        console.log('La base de datos no tiene tablas, recreando...');
        await recrearBD_vc_ga(conexion_vc_ga);
        await ejecutarArchivoSQL_vc_ga(conexion_vc_ga, path.join(__dirname, 'database.sql'));
      } else {
        console.log('La base de datos tiene tablas, no se requiere recreación');
      }
    } else {
      console.log('La base de datos no existe, creando...');
      await recrearBD_vc_ga(conexion_vc_ga);
      await ejecutarArchivoSQL_vc_ga(conexion_vc_ga, path.join(__dirname, 'database.sql'));
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error_vc_ga) {
    console.error('Error durante la inicialización:', error_vc_ga);
    throw error_vc_ga;
  } finally {
    conexion_vc_ga.end();
  }
};

// Funciones de consulta con soporte para caracteres españoles
const consulta_vc_ga = (sql_vc_ga, parametros_vc_ga = [], callback_vc_ga) => {
  const db_vc_ga = mysql.createConnection({ 
    ...config, 
    database: 'dbcrud_electron_vc_ga',
    charset: 'utf8mb4'
  });

  db_vc_ga.connect((error_vc_ga) => {
    if (error_vc_ga) return callback_vc_ga(error_vc_ga);
    
    db_vc_ga.query(`SET NAMES utf8mb4`, (error_vc_ga) => {
      if (error_vc_ga) return callback_vc_ga(error_vc_ga);
      
      db_vc_ga.query(sql_vc_ga, parametros_vc_ga, (error_vc_ga, resultados_vc_ga) => {
        db_vc_ga.end();
        callback_vc_ga(error_vc_ga, resultados_vc_ga);
      });
    });
  });
};

const query_vc_ga = (sql_vc_ga, parametros_vc_ga = []) => {
  return new Promise((resolver_vc_ga, rechazar_vc_ga) => {
    const db_vc_ga = mysql.createConnection({ 
      ...config, 
      database: 'dbcrud_electron_vc_ga',
      charset: 'utf8mb4'
    });
    
    db_vc_ga.connect(error_vc_ga => {
      if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
      
      db_vc_ga.query(`SET NAMES utf8mb4`, (error_vc_ga) => {
        if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
        
        db_vc_ga.query(sql_vc_ga, parametros_vc_ga, (error_vc_ga, resultados_vc_ga) => {
          db_vc_ga.end();
          if (error_vc_ga) return rechazar_vc_ga(error_vc_ga);
          resolver_vc_ga(resultados_vc_ga);
        });
      });
    });
  });
};

// Inicialización automática al cargar el módulo
inicializarBD_vc_ga().catch(error_vc_ga => {
  console.error('Error en inicialización automática:', error_vc_ga);
});

module.exports = { 
  query_vc_ga, 
  consulta_vc_ga,
  ejecutarArchivoSQL: (ruta_vc_ga) => {
    const conexion_vc_ga = mysql.createConnection({ 
      ...config, 
      database: 'dbcrud_electron_vc_ga',
      charset: 'utf8mb4'
    });
    return ejecutarArchivoSQL_vc_ga(conexion_vc_ga, ruta_vc_ga)
      .finally(() => conexion_vc_ga.end());
  },
  inicializarBD: inicializarBD_vc_ga
};
