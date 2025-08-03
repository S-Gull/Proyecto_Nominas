const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');


let ventana_vc_ga;

<<<<<<< HEAD
function crearVentana() {
    ventana = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false, // IMPORTANTE: deshabilitar
      contextIsolation: true // HABILITAR seguridad
      
     // Archivo de precarga
    
=======
const crearVentana_vc_ga = () => {
  ventana_vc_ga = new BrowserWindow({
    width: 1600,
    height: 820,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
>>>>>>> main
    }
  });
  ventana_vc_ga.loadFile(path.join(__dirname, '..','/','views','/' ,'index.html'));
};

// Handlers IPC
ipcMain.handle("verificar-credenciales_vc_ga", async (event_vc_ga, credenciales_vc_ga) => {
  return new Promise((resolve_vc_ga, reject_vc_ga) => {
    const sql_vc_ga = "SELECT * FROM td_usuarios_vc_ga WHERE correo_electronico_vc_ga = ? AND clave_vc_ga = ?";
    connection_vc_ga.query(sql_vc_ga, [credenciales_vc_ga.correo_vc_ga, credenciales_vc_ga.clave_vc_ga], (err_vc_ga, results_vc_ga) => {
      if (err_vc_ga) {
        console.error("Error al verificar credenciales:", err_vc_ga);
        return reject_vc_ga(err_vc_ga);
      }
      resolve_vc_ga(results_vc_ga.length > 0 ? results_vc_ga[0] : null);
    });
  });
});


ipcMain.handle('query-auth_vc_ga', async (event, sql, params) => {
  return new Promise((resolve, reject) => {
    connection_vc_ga.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
});
module.exports = { crearVentana_vc_ga };
