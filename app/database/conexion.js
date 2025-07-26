console.log("carga la conexion_vcga");
const mysql_vc_ga = require('mysql');
const fs = require('fs').promises;
const path = require('path');

// Configuración de conexión inicial
const config_vc_ga = {
  host: 'localhost',
  user: 'root',
  password: ''
};

// Conexión global para inicialización
const connection_vc_ga = mysql_vc_ga.createConnection(config_vc_ga);

// Función para ejecutar archivo SQL
const ejecutarArchivoSQL_vc_ga = async (filePath) => {
  try {
    const sqlContent = await fs.readFile(filePath, 'utf8');
    const queries = sqlContent.split(';').filter(q => q.trim().length > 0);
    
    for (const query of queries) {
      await new Promise((resolve, reject) => {
        connection_vc_ga.query(query, (err, results) => {
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

// Inicialización de la base de datos
const inicializarBD_vc_ga = async () => {
  try {
    // Crear BD si no existe
    await new Promise((resolve, reject) => {
      connection_vc_ga.query('CREATE DATABASE IF NOT EXISTS dbcrud_electron_vc_ga', (err) => {
        if (err) return reject(err);
        console.log('Base de datos verificada/creada');
        resolve();
      });
    });

    // Usar la BD
    await new Promise((resolve, reject) => {
      connection_vc_ga.query('USE dbcrud_electron_vc_ga', (err) => {
        if (err) return reject(err);
        console.log('Usando base de datos dbcrud_electron_vc_ga');
        resolve();
      });
    });

    // Ejecutar script de estructura desde archivo
    await ejecutarArchivoSQL_vc_ga(path.join(__dirname, 'database.sql'));

    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    throw error;
  }
};

// Inicializar la BD al cargar el módulo (opcional)
inicializarBD_vc_ga().catch(err => {
  console.error('Error en inicialización automática:', err);
});

// TUS FUNCIONES ORIGINALES (sin modificaciones)
const consulta_vc_ga = (sql_vc_ga, params_vc_ga = [], callback_vc_ga) => {
  const db_vc_ga = mysql_vc_ga.createConnection({
    ...config_vc_ga,
    database: 'dbcrud_electron_vc_ga'
  });

  db_vc_ga.connect((err_vc_ga) => {
    if (err_vc_ga) {
      console.error('Error de conexión:', err_vc_ga);
      return callback_vc_ga(err_vc_ga);
    }

    db_vc_ga.query(sql_vc_ga, params_vc_ga, (err_vc_ga, results_vc_ga) => {
      db_vc_ga.end();
      if (err_vc_ga) {
        console.error('Error en consulta:', err_vc_ga);
        callback_vc_ga(null, err_vc_ga);
      }
      callback_vc_ga(null, results_vc_ga);
    });
  });
};

const query_vc_ga = (sql_vc_ga, params_vc_ga = []) => {
  return new Promise((resolve, reject) => {
    const db_vc_ga = mysql_vc_ga.createConnection({
      ...config_vc_ga,
      database: 'dbcrud_electron_vc_ga'
    });
    db_vc_ga.connect(err_vc_ga => {
      if (err_vc_ga) return reject(err_vc_ga);
      db_vc_ga.query(sql_vc_ga, params_vc_ga, (err_vc_ga, results_vc_ga) => {
        db_vc_ga.end();
        if (err_vc_ga) return reject(err_vc_ga);
        resolve(results_vc_ga);
      });
    });
  });
};

module.exports = { 
  query_vc_ga, 
  consulta_vc_ga,
  ejecutarArchivoSQL_vc_ga,
  inicializarBD_vc_ga
};