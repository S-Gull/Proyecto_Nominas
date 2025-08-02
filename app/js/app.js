console.log("carga el app_vc_ga");
const { ipcRenderer } = require("electron");
const { LoginControlador_vc_ga, AuthServicio_vc_ga, AuthRepositorio_vc_ga, GestorSesion_vc_ga, loginHTML_vc_ga, botonCerrarSesion_vc_ga, AuthFabrica_vc_ga } = require("../js/login");
const { PlantillaController_vc_ga, GestorUsuarios_vc_ga } = require("../js/plantilla");
const { setupThemeToggle_vc_ga } = require("../js/dark-mode");
const { reportesHTML_vc_ga, ReportesController_vc_ga } = require("../js/reportes");
const { modal_vc_ga } = require("../js/modal");
const { empleadoHTML_vc_ga, EmpleadoFabrica_vc_ga } = require("../js/empleado");
const { selectedHTML_vc_ga, inicializarEmpleado, addSalary, editSalary, deleteSalary, addDeduction, editDeduction, deleteDeduction, addExtra, editExtra, deleteExtra, addBonus, editBonus, deleteBonus, addVacation, editVacation, deleteVacation } = require("../js/seleccionado");

if (!GestorSesion_vc_ga.verificarAcceso_vc_ga()) {
  // El método ya maneja la redirección automáticamente
  console.log("Verificando ...")
}

if (loginHTML_vc_ga || botonCerrarSesion_vc_ga) {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#0D0A0B',
          secondary: '#454955',
          light: '#F3EFF5',
          accent1: '#72B01D',
          accent2: '#3F7D20',
          dark: {
            900: '#0D0A0B',
            800: '#1a1a1a',
            700: '#2d2d2d',
          }
        },
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
          verdana: ['Verdana', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in',
          'slide-down': 'slideDown 0.5s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'underline': 'underline 0.3s ease-out forwards'
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideDown: {
            '0%': { transform: 'translateY(-20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          pulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.8' },
          },
          underline: {
            '0%': { width: '0' },
            '100%': { width: '100%' },
          }
        }
      }
    }
  };
  
  // Inicializar el controlador de login si existe el formulario o el botón de cerrar sesión
  const controladorLogin_vc_ga = AuthFabrica_vc_ga.crear_vc_ga();
  setupThemeToggle_vc_ga();
}

if (PlantillaController_vc_ga) {
          tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }
        };
setupThemeToggle_vc_ga();
// Inicialización
  
}

if (reportesHTML_vc_ga) {
  setupThemeToggle_vc_ga();
            tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }}
  // Script para mostrar/ocultar campos según el tipo de documento seleccionado
document.getElementById('tipo_documento').addEventListener('change', function() {
    const tipo = this.value;
            
    // Ocultar todos los campos específicos primero
    document.getElementById('recibo_fields').classList.add('hidden');
    document.getElementById('reporte_banco_fields').classList.add('hidden');
    document.getElementById('reporte_contable_fields').classList.add('hidden');
            
    // Mostrar solo los campos correspondientes al tipo seleccionado
    if (tipo === 'recibo') {
        document.getElementById('recibo_fields').classList.remove('hidden');
    } else if (tipo === 'reporte_banco') {
        document.getElementById('reporte_banco_fields').classList.remove('hidden');
    } else if (tipo === 'reporte_contable') {
        document.getElementById('reporte_contable_fields').classList.remove('hidden');
    }
})

}

  // Solo lanzamos initEmployeeView si la vista de empleado está presente
  if (empleadoHTML_vc_ga) {
      setupThemeToggle_vc_ga();
            tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }
        }

    const controlador_vc_ga = EmpleadoFabrica_vc_ga.crear_vc_ga();
     controlador_vc_ga.iniciar_vc_ga();
  }

  if (reportesHTML_vc_ga) {
      setupThemeToggle_vc_ga();
            tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '#0D0A0B',
                secondary: '#454955',
                light: '#F3EFF5',
                accent1: '#72B01D',
                accent2: '#3F7D20',
                dark: {
                  900: '#0D0A0B',
                  800: '#1a1a1a',
                  700: '#2d2d2d',
                }
              },
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
              },
              animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'underline': 'underline 0.3s ease-out forwards'
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideDown: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.8' },
                },
                underline: {
                  '0%': { width: '0' },
                  '100%': { width: '100%' },
                }
              }
            }
          }
        }
        const controladorReportes_vc_ga = new ReportesController_vc_ga;
        controladorReportes_vc_ga._init_vc_ga();
  }
