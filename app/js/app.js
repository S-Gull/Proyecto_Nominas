console.log("carga el app_vc_ga");
const { ipcRenderer } = require("electron");
const { LoginControlador_vc_ga, AuthServicio_vc_ga, AuthRepositorio_vc_ga, GestorSesion_vc_ga } = require("../js/login");
const { PlantillaController_vc_ga, GestorUsuarios_vc_ga } = require("../js/plantilla");
const { setupThemeToggle_vc_ga } = require("../js/dark-mode");
const { reportesHTML_vc_ga } = require("../js/reportes");
const { modal_vc_ga } = require("../js/modal");
const { initEmpleado, empleadoHTML_vc_ga } = require("../js/empleado");
const { selectedHTML_vc_ga, inicializarEmpleado, addSalary, editSalary, deleteSalary, addDeduction, editDeduction, deleteDeduction, addExtra, editExtra, deleteExtra, addBonus, editBonus, deleteBonus, addVacation, editVacation, deleteVacation } = require("../js/seleccionado");

if (!GestorSesion_vc_ga.verificarAcceso_vc_ga()) {
  // El método ya maneja la redirección automáticamente
}
if (LoginControlador_vc_ga) {
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
    initEmpleado();
  }

  if (selectedHTML_vc_ga) {
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
     // Cargar datos de empleado
  inicializarEmpleado();

  // Manejo de pestañas
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabContents.forEach(c => c.classList.add('hidden'));
      document.getElementById(target).classList.remove('hidden');
      tabButtons.forEach(b => b.classList.remove('border-b-2', 'border-accent1'));
      btn.classList.add('border-b-2', 'border-accent1');
    });
  });
  if (tabButtons.length) tabButtons[0].click();

  // Eventos CRUD Salario
  document.getElementById('addSalaryBtn').addEventListener('click', () => {
    const base = parseFloat(document.getElementById('salaryBase').value);
    const variable = parseFloat(document.getElementById('salaryVariable').value);
    addSalary(base, variable);
  });
  document.getElementById('editSalaryBtn').addEventListener('click', () => {
    const recordId = prompt('ID del salario a editar:');
    const base = parseFloat(document.getElementById('salaryBase').value);
    const variable = parseFloat(document.getElementById('salaryVariable').value);
    editSalary(Number(recordId), base, variable);
  });
  document.getElementById('deleteSalaryBtn').addEventListener('click', () => {
    const recordId = prompt('ID del salario a eliminar:');
    deleteSalary(Number(recordId));
  });

  // Eventos CRUD Deducciones
  document.getElementById('addDeductionBtn').addEventListener('click', () => {
    const type = document.getElementById('deductionType').value;
    const amount = parseFloat(document.getElementById('deductionAmount').value);
    addDeduction(type, amount);
  });
  document.getElementById('editDeductionBtn').addEventListener('click', () => {
    const recordId = prompt('ID de la deducción a editar:');
    const amount = parseFloat(document.getElementById('deductionAmount').value);
    editDeduction(Number(recordId), amount);
  });
  document.getElementById('deleteDeductionBtn').addEventListener('click', () => {
    const recordId = prompt('ID de la deducción a eliminar:');
    deleteDeduction(Number(recordId));
  });

  // Eventos CRUD Horas Extras
  document.getElementById('addExtraBtn').addEventListener('click', () => {
    const type = document.getElementById('extraType').value;
    const hours = parseFloat(document.getElementById('extraHours').value);
    const amount = parseFloat(document.getElementById('extraAmount').value);
    addExtra(type, hours, amount);
  });
  document.getElementById('editExtraBtn').addEventListener('click', () => {
    const recordId = prompt('ID de la hora extra a editar:');
    const hours = parseFloat(document.getElementById('extraHours').value);
    const amount = parseFloat(document.getElementById('extraAmount').value);
    editExtra(Number(recordId), hours, amount);
  });
  document.getElementById('deleteExtraBtn').addEventListener('click', () => {
    const recordId = prompt('ID de la hora extra a eliminar:');
    deleteExtra(Number(recordId));
  });

  // Eventos CRUD Bonos
  document.getElementById('addBonusBtn').addEventListener('click', () => {
    const type = document.getElementById('bonusType').value;
    const amount = parseFloat(document.getElementById('bonusAmount').value);
    addBonus(type, amount);
  });
  document.getElementById('editBonusBtn').addEventListener('click', () => {
    const recordId = prompt('ID del bono a editar:');
    const amount = parseFloat(document.getElementById('bonusAmount').value);
    editBonus(Number(recordId), amount);
  });
  document.getElementById('deleteBonusBtn').addEventListener('click', () => {
    const recordId = prompt('ID del bono a eliminar:');
    deleteBonus(Number(recordId));
  });

  // Eventos CRUD Vacaciones
  document.getElementById('addVacationBtn').addEventListener('click', () => {
    const start = document.getElementById('vacStart').value;
    const end = document.getElementById('vacEnd').value;
    const days = parseInt(document.getElementById('vacDays').value, 10);
    addVacation(start, end, days);
  });
  document.getElementById('editVacationBtn').addEventListener('click', () => {
    const recordId = prompt('ID de la vacación a editar:');
    const start = document.getElementById('vacStart').value;
    const end = document.getElementById('vacEnd').value;
    const days = parseInt(document.getElementById('vacDays').value, 10);
    editVacation(Number(recordId), start, end, days);
  });
  document.getElementById('deleteVacationBtn').addEventListener('click', () => {
    const recordId = prompt('ID de la vacación a eliminar:');
    deleteVacation(Number(recordId));
  });

  // Eventos de nómina
  document.getElementById('calcPayrollBtn').addEventListener('click', async () => {
    const period = document.getElementById('reportPeriod').value;
    const report = await generatePayroll(period);
     document.getElementById('payrollReportContent').textContent = report;
  });
  document.getElementById('generateReceiptBtn').addEventListener('click', () => {
    // TODO: implementar lógica de generación de recibo
  });
  }
