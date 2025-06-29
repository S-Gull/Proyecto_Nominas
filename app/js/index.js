console.log('carga el index');
const { crearVentana } = require("./main");
const { app } = require("electron");

require('../database/conexion');

require('electron-reload')(__dirname);

app.allowRendererProcessReuse = true;
app.whenReady().then(crearVentana);