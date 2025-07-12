class ModalDialog_vc_ga {
    constructor() {
        // Referencias a elementos DOM
        this.modalContainer_vc_ga = document.getElementById('modalContainer');
        this.modalContent_vc_ga = document.getElementById('modalContent');
        this.modalHeader_vc_ga = document.getElementById('modalHeader');
        this.modalIcon_vc_ga = document.getElementById('modalIcon');
        this.modalTitle_vc_ga = document.getElementById('modalTitle');
        this.modalMessage_vc_ga = document.getElementById('modalMessage');
        this.modalClose_vc_ga = document.getElementById('modalClose');
        this.modalAction_vc_ga = document.getElementById('modalAction');

        // Configurar eventos
        this.modalClose_vc_ga.addEventListener('click', () => this.hide_vc_ga());
        this.modalAction_vc_ga.addEventListener('click', () => this.hide_vc_ga());

        // Cerrar al hacer clic fuera del modal
        this.modalContainer_vc_ga.addEventListener('click', (e_vc_ga) => {
            if (e_vc_ga.target === this.modalContainer_vc_ga) {
                this.hide_vc_ga();
            }
        });
    }

    show_vc_ga(title_vc_ga, message_vc_ga, type_vc_ga) {
        // Configurar según el tipo
        switch(type_vc_ga) {
            case 'success':
                this.modalHeader_vc_ga.className = 'modal-header success-bg';
                this.modalIcon_vc_ga.className = 'modal-icon fas fa-check-circle';
                this.modalAction_vc_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700';
                break;
            case 'error':
                this.modalHeader_vc_ga.className = 'modal-header error';
                this.modalIcon_vc_ga.className = 'modal-icon fas fa-times-circle';
                this.modalAction_vc_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700';
                break;
            case 'warning':
                this.modalHeader_vc_ga.className = 'modal-header warning-bg';
                this.modalIcon_vc_ga.className = 'modal-icon fas fa-exclamation-triangle';
                this.modalAction_vc_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700';
                break;
        }
        
        // Establecer contenido
        this.modalTitle_vc_ga.textContent = title_vc_ga;
        this.modalMessage_vc_ga.textContent = message_vc_ga;
        this.modalAction_vc_ga.textContent = type_vc_ga === 'error' ? 'Reintentar' : 'Aceptar';
        
        // Mostrar modal
        this.modalContainer_vc_ga.classList.add('active');
        
        // Bloquear scroll de fondo
        document.body.style.overflow = 'hidden';
    }
    
    showSuccess_vc_ga(title_vc_ga, message_vc_ga) {
        this.show_vc_ga(title_vc_ga, message_vc_ga, 'success');
    }
    
    showError_vc_ga(title_vc_ga, message_vc_ga) {
        this.show_vc_ga(title_vc_ga, message_vc_ga, 'error');
    }
    
    showWarning_vc_ga(title_vc_ga, message_vc_ga) {
        this.show_vc_ga(title_vc_ga, message_vc_ga, 'warning');
    }
    
    hide_vc_ga() {
        this.modalContainer_vc_ga.classList.remove('active');
        
        // Restaurar scroll
        document.body.style.overflow = '';
    }
}

module.exports = { ModalDialog_vc_ga };