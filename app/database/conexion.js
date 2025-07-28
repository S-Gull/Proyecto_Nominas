console.log("Cargando módulo de conexión VCGA");
const mysql = require('mysql2');
const fs = require('fs').promises;
const path = require('path');

// Configuración de conexión con charset para español
const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  charset: 'utf8mb4' // Soporte completo para Unicode (incluye emojis y caracteres especiales)
};

// Función para verificar si la BD existe
const verificarExistenciaBD = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.query(`SHOW DATABASES LIKE 'dbcrud_electron_vc_ga'`, (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
};

// Función para verificar si la BD tiene tablas
const verificarTablasBD = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.query(`USE dbcrud_electron_vc_ga`, (err) => {
      if (err) return reject(err);
      
      connection.query(`SHOW TABLES`, (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  });
};

// Función para eliminar y recrear la BD con collation para español
const recrearBD = async (connection) => {
  try {
    await new Promise((resolve, reject) => {
      connection.query(`DROP DATABASE IF EXISTS dbcrud_electron_vc_ga`, (err) => {
        if (err) return reject(err);
        console.log('Base de datos eliminada');
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      // Crear BD con collation para español
      connection.query(
        `CREATE DATABASE dbcrud_electron_vc_ga 
         CHARACTER SET utf8mb4 
         COLLATE utf8mb4_spanish_ci`, 
        (err) => {
          if (err) return reject(err);
          console.log('Base de datos creada');
          resolve();
        }
      );
    });

    await new Promise((resolve, reject) => {
      connection.query(`USE dbcrud_electron_vc_ga`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  } catch (error) {
    console.error('Error al recrear la base de datos:', error);
    throw error;
  }
};

// Función para ejecutar archivo SQL con soporte para español
const ejecutarArchivoSQL = async (connection, filePath) => {
  try {
    const sqlContent = await fs.readFile(filePath, 'utf8');
    const queries = sqlContent.split(';').filter(q => q.trim().length > 0);
    
    // Establecer charset al inicio
    await new Promise((resolve, reject) => {
      connection.query(`SET NAMES utf8mb4`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    for (const query of queries) {
      await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) return reject(err);
          console.log('Consulta ejecutada:', query.substring(0, 50) + '...');
          resolve(results);
        });
      });
    }
  } catch (error) {
    console.error('Error al ejecutar archivo SQL:', error);
    throw error;
  }
};

// Función principal de inicialización
const inicializarBD = async () => {
  const connection = mysql.createConnection(config);
  
  try {
    await new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) return reject(err);
        resolve();
      });
    });

    const bdExiste = await verificarExistenciaBD(connection);
    
    if (bdExiste) {
      console.log('La base de datos ya existe');
      
      const tieneTablas = await verificarTablasBD(connection).catch(() => false);
      
      if (!tieneTablas) {
        console.log('La base de datos no tiene tablas, recreando...');
        await recrearBD(connection);
        await ejecutarArchivoSQL(connection, path.join(__dirname, 'database.sql'));
      } else {
        console.log('La base de datos tiene tablas, no se requiere recreación');
      }
    } else {
      console.log('La base de datos no existe, creando...');
      await recrearBD(connection);
      await ejecutarArchivoSQL(connection, path.join(__dirname, 'database.sql'));
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    throw error;
  } finally {
    connection.end();
  }
};

// Funciones de consulta con soporte para caracteres españoles
const consulta_vc_ga = (sql, params = [], callback) => {
  const db = mysql.createConnection({ 
    ...config, 
    database: 'dbcrud_electron_vc_ga',
    charset: 'utf8mb4'
  });

  db.connect((err) => {
    if (err) return callback(err);
    
    // Establecer charset
    db.query(`SET NAMES utf8mb4`, (err) => {
      if (err) return callback(err);
      
      db.query(sql, params, (err, results) => {
        db.end();
        callback(err, results);
      });
    });
  });
};

const query_vc_ga = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = mysql.createConnection({ 
      ...config, 
      database: 'dbcrud_electron_vc_ga',
      charset: 'utf8mb4'
    });
    
    db.connect(err => {
      if (err) return reject(err);
      
      // Establecer charset
      db.query(`SET NAMES utf8mb4`, (err) => {
        if (err) return reject(err);
        
        db.query(sql, params, (err, results) => {
          db.end();
          if (err) return reject(err);
          resolve(results);
        });
      });
    });
  });
};

// Inicialización automática al cargar el módulo
inicializarBD().catch(err => {
  console.error('Error en inicialización automática:', err);
});

module.exports = { 
  query_vc_ga, 
  consulta_vc_ga,
  ejecutarArchivoSQL: (filePath) => {
    const connection = mysql.createConnection({ 
      ...config, 
      database: 'dbcrud_electron_vc_ga',
      charset: 'utf8mb4'
    });
    return ejecutarArchivoSQL(connection, filePath)
      .finally(() => connection.end());
  },
  inicializarBD
};