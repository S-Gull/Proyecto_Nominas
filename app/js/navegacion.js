// app/js/navigation.js
console.log("Cargando sistema de navegación");

class NavigationManager_vc_ga {
  constructor() {
    this.usuarioActual = this.obtenerUsuarioActual();
    this.initializeNavigation();
  }

  obtenerUsuarioActual() {
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuarioActual_vc_ga'));
      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  initializeNavigation() {
    const headerElement = document.querySelector('header .container');
    if (!headerElement) return;

    // Buscar el título existente
    const titleElement = headerElement.querySelector('h2');
    if (!titleElement) return;

    // Crear el menú de navegación
    const navMenu = this.createNavigationMenu();
    
    // Insertar el menú después del título
    titleElement.insertAdjacentElement('afterend', navMenu);
  }

  createNavigationMenu() {
    const nav = document.createElement('nav');
    nav.className = 'hidden md:flex items-center space-x-1';

    if (!this.usuarioActual) {
      return nav; // Menú vacío si no hay usuario
    }

    const menuItems = this.getMenuItems();
    
    menuItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.url;
      link.className = `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                       ${this.isCurrentPage(item.url) 
                         ? 'bg-accent1 text-white' 
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}`;
      
      link.innerHTML = `<i class="${item.icon} mr-2"></i>${item.title}`;
      nav.appendChild(link);
    });

    return nav;
  }

  getMenuItems() {
    const currentPath = window.location.pathname;
    const isAdmin = this.usuarioActual && this.usuarioActual.rol === 1;

    if (isAdmin) {
      return [
        {
          title: 'Dashboard',
          url: './plantilla.html',
          icon: 'fas fa-tachometer-alt'
        },
        {
          title: 'Empleados',
          url: './plantilla.html',
          icon: 'fas fa-users'
        },
        {
          title: 'Reportes',
          url: './reportes.html',
          icon: 'fas fa-chart-bar'
        },
        {
          title: 'Mi Perfil',
          url: './empleado.html',
          icon: 'fas fa-user'
        }
      ];
    } else {
      // Usuario normal - solo ve su perfil
      return [
        {
          title: 'Mi Perfil',
          url: './empleado.html',
          icon: 'fas fa-user'
        }
      ];
    }
  }

  isCurrentPage(url) {
    const currentPath = window.location.pathname;
    const urlPath = url.replace('./', '');
    return currentPath.includes(urlPath);
  }

  // Método para crear menú móvil
  createMobileMenu() {
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'absolute top-full left-0 right-0 bg-white dark:bg-dark-800 shadow-lg rounded-lg mt-2 hidden';
    mobileMenu.id = 'mobileNavigationMenu';

    const menuItems = this.getMenuItems();
    
    menuItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.url;
      link.className = `block px-4 py-3 text-sm font-medium transition-colors duration-200 
                       ${this.isCurrentPage(item.url) 
                         ? 'bg-accent1 text-white' 
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}`;
      
      link.innerHTML = `<i class="${item.icon} mr-3"></i>${item.title}`;
      mobileMenu.appendChild(link);
    });

    // Toggle del menú móvil
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });

    return { button: mobileMenuButton, menu: mobileMenu };
  }

  // Método para actualizar la navegación completa
  setupCompleteNavigation() {
    const headerElement = document.querySelector('header .container');
    if (!headerElement) return;

    // Buscar el contenedor de botones existente
    const buttonsContainer = headerElement.querySelector('.flex.items-center.space-x-4');
    if (!buttonsContainer) return;

    // Crear contenedor para navegación móvil
    const mobileNavContainer = document.createElement('div');
    mobileNavContainer.className = 'relative md:hidden';
    
    const { button: mobileButton, menu: mobileMenu } = this.createMobileMenu();
    mobileNavContainer.appendChild(mobileButton);
    mobileNavContainer.appendChild(mobileMenu);

    // Insertar menú móvil antes del contenedor de botones
    buttonsContainer.insertAdjacentElement('beforebegin', mobileNavContainer);
  }
}

// Función para inicializar la navegación
const inicializarNavegacion_vc_ga = () => {
  // Solo inicializar si no estamos en la página de login
  const isLoginPage = document.getElementById('login');
  if (isLoginPage) return;

  const navigationManager = new NavigationManager_vc_ga();
  navigationManager.setupCompleteNavigation();
};

// Auto-inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', inicializarNavegacion_vc_ga);

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NavigationManager_vc_ga, inicializarNavegacion_vc_ga };
}