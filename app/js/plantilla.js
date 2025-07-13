const { ModalDialog_vc_ga } = require("./modal");
const plantillaHTML_vc_ga = document.getElementById("plantilla");
const modal_vc_ga = new ModalDialog_vc_ga();
// Datos de ejemplo para la demo
const sampleUsers_vc_ga = [
    {
        id_vc_ga: 1,
        nombre_vc_ga: 'María Rodríguez',
        cedula_vc_ga: 'V-25.456.789',
        cargo_vc_ga: 'Gerente de Ventas',
        departamento_vc_ga: 'Ventas',
        status_vc_ga: 'Trabajando',
        fecha_ingreso_vc_ga: '2020-05-15'
    },
    {
        id_vc_ga: 2,
        nombre_vc_ga: 'Carlos Pérez',
        cedula_vc_ga: 'V-20.123.456',
        cargo_vc_ga: 'Desarrollador Senior',
        departamento_vc_ga: 'Tecnología',
        status_vc_ga: 'De Vacaciones',
        fecha_ingreso_vc_ga: '2019-11-20'
    },
    {
        id_vc_ga: 3,
        nombre_vc_ga: 'Ana Martínez',
        cedula_vc_ga: 'V-22.987.654',
        cargo_vc_ga: 'Analista de RRHH',
        departamento_vc_ga: 'Recursos Humanos',
        status_vc_ga: 'Trabajando',
        fecha_ingreso_vc_ga: '2021-02-10'
    },
    {
        id_vc_ga: 4,
        nombre_vc_ga: 'Luis Gómez',
        cedula_vc_ga: 'V-19.876.543',
        cargo_vc_ga: 'Asistente Administrativo',
        departamento_vc_ga: 'Administración',
        status_vc_ga: 'Trabajando',
        fecha_ingreso_vc_ga: '2022-08-05'
    }
];
// Función para cargar usuarios en la lista
const loadUsers_vc_ga = (users_vc_ga) => {
    const usersContainer_vc_ga = document.getElementById('users');
    usersContainer_vc_ga.innerHTML = '';
    
    if (users_vc_ga.length === 0) {
        usersContainer_vc_ga.innerHTML = `
            <div class="text-center py-10 text-gray-500 dark:text-gray-400">
                <i class="fas fa-user-slash text-2xl mb-2"></i>
                <p>No se encontraron usuarios</p>
            </div>
        `;
        return;
    }
    
    users_vc_ga.forEach(user_vc_ga => {
        const userElement_vc_ga = document.createElement('div');
        userElement_vc_ga.className = 'bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-gray-700';
        userElement_vc_ga.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-semibold text-gray-800 dark:text-white">${user_vc_ga.nombre_vc_ga}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${user_vc_ga.cargo_vc_ga} · ${user_vc_ga.departamento_vc_ga}</p>
                    <div class="flex items-center mt-2">
                        <span class="status-badge ${user_vc_ga.status_vc_ga === 'Trabajando' ? 'status-working' : 'status-vacation'}">
                            ${user_vc_ga.status_vc_ga}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400 ml-3">
                            <i class="fas fa-id-card mr-1"></i> ${user_vc_ga.cedula_vc_ga}
                        </span>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600" data-id="${user_vc_ga.id_vc_ga}">
                        <i class="fas fa-edit text-accent1"></i>
                    </button>
                    <button class="delete-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600" data-id="${user_vc_ga.id_vc_ga}">
                        <i class="fas fa-trash text-red-500"></i>
                    </button>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                    <i class="fas fa-calendar-day mr-1"></i> Ingreso: ${formatDate_vc_ga(user_vc_ga.fecha_ingreso_vc_ga)}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                    ID: ${user_vc_ga.id_vc_ga}
                </span>
            </div>
        `;
        usersContainer_vc_ga.appendChild(userElement_vc_ga);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-btn').forEach(btn_vc_ga => {
        btn_vc_ga.addEventListener('click', () => editUser_vc_ga(btn_vc_ga.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn_vc_ga => {
        btn_vc_ga.addEventListener('click', () => deleteUser_vc_ga(btn_vc_ga.dataset.id));
    });
};

// Función para formatear fechas
const formatDate_vc_ga = (dateString_vc_ga) => {
    const options_vc_ga = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString_vc_ga).toLocaleDateString('es-ES', options_vc_ga);
};

// Función para simular la edición de un usuario
const editUser_vc_ga = (userId_vc_ga) => {
    const user_vc_ga = sampleUsers_vc_ga.find(u_vc_ga => u_vc_ga.id_vc_ga == userId_vc_ga);
    if (!user_vc_ga) return;
    
    document.getElementById('formTitle').textContent = 'Editar Usuario';
    document.getElementById('submitText').textContent = 'Actualizar';
    document.getElementById('cancelEdit').classList.remove('hidden');
    
    document.getElementById('id_usuario').value = user_vc_ga.id_vc_ga;
    document.getElementById('nombre_completo').value = user_vc_ga.nombre_vc_ga;
    
    const formCard_vc_ga = document.querySelector('.animate__fadeInLeft');
    formCard_vc_ga.classList.remove('animate__fadeInLeft');
    void formCard_vc_ga.offsetWidth;
    formCard_vc_ga.classList.add('animate__pulse');
    
    setTimeout(() => {
        formCard_vc_ga.classList.remove('animate__pulse');
        formCard_vc_ga.classList.add('animate__fadeInLeft');
    }, 500);
};

// Función para eliminar un usuario
const deleteUser_vc_ga = async (userId_vc_ga) => {
    const respuesta_vc_ga = await modal_vc_ga.showConfirm_vc_ga("¿Está seguro de que desea eliminar este usuario?","Esta acción no se puede deshacer");
    if (respuesta_vc_ga) {
        const userIndex_vc_ga = sampleUsers_vc_ga.findIndex(u_vc_ga => u_vc_ga.id_vc_ga == userId_vc_ga);
        if (userIndex_vc_ga !== -1) {
            sampleUsers_vc_ga.splice(userIndex_vc_ga, 1);
            loadUsers_vc_ga(sampleUsers_vc_ga);
            await modal_vc_ga.showSuccess_vc_ga('Usuario eliminado correctamente', 'success');
        }
    }
};

// Función para manejar el envío del formulario
const handleFormSubmit_vc_ga = (e_vc_ga) => {
    e_vc_ga.preventDefault();
    
    const userId_vc_ga = document.getElementById('id_usuario').value;
    const nombre_vc_ga = document.getElementById('nombre_completo').value;
    
    if (userId_vc_ga) {
        const userIndex_vc_ga = sampleUsers_vc_ga.findIndex(u_vc_ga => u_vc_ga.id_vc_ga == userId_vc_ga);
        if (userIndex_vc_ga !== -1) {
            sampleUsers_vc_ga[userIndex_vc_ga].nombre_vc_ga = nombre_vc_ga;
            modal_vc_ga.showSuccess_vc_ga('Usuario actualizado correctamente', 'success');
        }
    } else {
        const newUser_vc_ga = {
            id_vc_ga: sampleUsers_vc_ga.length + 1,
            nombre_vc_ga: nombre_vc_ga,
            cedula_vc_ga: 'V-' + Math.floor(Math.random() * 30) + '.' + Math.floor(Math.random() * 1000) + '.' + Math.floor(Math.random() * 1000),
            cargo_vc_ga: 'Nuevo Cargo',
            departamento_vc_ga: 'Nuevo Departamento',
            status_vc_ga: 'Trabajando',
            fecha_ingreso_vc_ga: new Date().toISOString().split('T')[0]
        };
        sampleUsers_vc_ga.push(newUser_vc_ga);
        modal_vc_ga.showSuccess_vc_ga('Usuario creado correctamente', 'success');
    }
    
    loadUsers_vc_ga(sampleUsers_vc_ga);
    cancelEdit_vc_ga();
};

// Función para cancelar edición
const cancelEdit_vc_ga = () => {
    document.getElementById('userForm').reset();
    document.getElementById('formTitle').textContent = 'Agregar Usuario';
    document.getElementById('submitText').textContent = 'Guardar';
    document.getElementById('cancelEdit').classList.add('hidden');
    document.getElementById('id_usuario').value = '';
};


module.exports = {plantillaHTML_vc_ga, sampleUsers_vc_ga, loadUsers_vc_ga, handleFormSubmit_vc_ga, cancelEdit_vc_ga};