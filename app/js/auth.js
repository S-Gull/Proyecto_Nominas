const { ipcRenderer } = require('electron');

const verificarAutenticacion_vc_ga = () => {
  const usuario_vc_ga = sessionStorage.getItem('usuario_vc_ga');
  
  if (!usuario_vc_ga && !window.location.pathname.endsWith('index.html')) {
    window.location.href = 'index.html';
  }
};

const cerrarSesion_vc_ga = () => {
  sessionStorage.removeItem('usuario_vc_ga');
  window.location.href = 'index.html';
};

module.exports = { verificarAutenticacion_vc_ga, cerrarSesion_vc_ga };