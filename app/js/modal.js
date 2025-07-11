class ModalDialog {
    constructor() {
         // Referencias a elementos DOM
        this.modalContainer = document.getElementById('modalContainer');
        this.modalContent = document.getElementById('modalContent');
        this.modalHeader = document.getElementById('modalHeader');
        this.modalIcon = document.getElementById('modalIcon');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalClose = document.getElementById('modalClose');
        this.modalAction = document.getElementById('modalAction');

         // Configurar eventos
        this.modalClose.addEventListener('click', () => this.hide());
        this.modalAction.addEventListener('click', () => this.hide());

         // Cerrar al hacer clic fuera del modal
        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) {
                this.hide();
            }
        });
    }

    show(title, message, type) {
         // Configurar según el tipo
        switch(type) {
            case 'success':
                this.modalHeader.className = 'modal-header success-bg';
                this.modalIcon.className = 'modal-icon fas fa-check-circle';
                this.modalAction.className = 'px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700';
                break;
            case 'error':
                this.modalHeader.className = 'modal-header error-bg';
                this.modalIcon.className = 'modal-icon fas fa-times-circle';
                this.modalAction.className = 'px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700';
                break;
            case 'warning':
                this.modalHeader.className = 'modal-header warning-bg';
                this.modalIcon.className = 'modal-icon fas fa-exclamation-triangle';
                this.modalAction.className = 'px-4 py-2 rounded-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700';
                break;
                }
                
                // Establecer contenido
                this.modalTitle.textContent = title;
                this.modalMessage.textContent = message;
                this.modalAction.textContent = type === 'error' ? 'Reintentar' : 'Aceptar';
                
                // Mostrar modal
                this.modalContainer.classList.add('active');
                
                // Bloquear scroll de fondo
                document.body.style.overflow = 'hidden';
            }
            
            showSuccess(title, message) {
                this.show(title, message, 'success');
            }
            
            showError(title, message) {
                this.show(title, message, 'error');
            }
            
            showWarning(title, message) {
                this.show(title, message, 'warning');
            }
            
            hide() {
                this.modalContainer.classList.remove('active');
                
                // Restaurar scroll
                document.body.style.overflow = '';
            }
        }

module.exports = { ModalDialog };