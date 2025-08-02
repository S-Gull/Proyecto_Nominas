class ModalDialog_vc_ga {
    constructor() {
        this.modalContainer_vc_ga = document.getElementById('modalContainer');
        this.modalContent_vc_ga = document.getElementById('modalContent');
        this.modalHeader_vc_ga = document.getElementById('modalHeader');
        this.modalIcon_vc_ga = document.getElementById('modalIcon');
        this.modalTitle_vc_ga = document.getElementById('modalTitle');
        this.modalMessage_vc_ga = document.getElementById('modalMessage');
        this.modalClose_vc_ga = document.getElementById('modalClose');
        this.modalAction_vc_ga = document.getElementById('modalAction');
        this.modalCancel_vc_ga = document.getElementById('modalCancel');

        this.resolvePromise = null;
        this.rejectPromise = null;

        this.modalClose_vc_ga.addEventListener('click', () => this.cancel_vc_ga());
        this.modalAction_vc_ga.addEventListener('click', () => this.confirm_vc_ga());
        this.modalCancel_vc_ga.addEventListener('click', () => this.cancel_vc_ga());

        this.modalContainer_vc_ga.addEventListener('click', (e_vc_ga) => {
            if (e_vc_ga.target === this.modalContainer_vc_ga) {
                this.cancel_vc_ga();
            }
        });
    }

    /**
     * Muestra un modal genérico o contextual (como reportes).
     * @param {string} title_vc_ga 
     * @param {string|Array} message_vc_ga 
     * @param {string} type_vc_ga 
     * @param {boolean} isConfirm 
     * @returns {Promise<boolean>}
     */
    show_vc_ga(title_vc_ga, message_vc_ga, type_vc_ga, isConfirm = false) {
        // Tipo de modal
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
            case 'reportes':
                this.modalHeader_vc_ga.className = 'modal-header success-bg';
                this.modalIcon_vc_ga.className = 'modal-icon fas fa-file-alt';
                this.modalAction_vc_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700';
                break;
        }

        this.modalTitle_vc_ga.textContent = title_vc_ga;

        if (type_vc_ga === 'reportes' && Array.isArray(message_vc_ga)) {
            const html_vc_ga = message_vc_ga.length > 0
                ? message_vc_ga.map(r => `
                    <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <h4 class="font-semibold text-gray-800 dark:text-white mb-1">
                        ${r.tipo === 'reporte_banco' ? 'Reporte Bancario' : 'Reporte Contable'} #${r.id}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Fecha: ${new Date(r.fecha).toLocaleDateString('es-ES')}
                      </p>
                      <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
${r.info}
                      </pre>
                    </div>
                  `).join('')
                : `<p class="text-gray-600 dark:text-gray-400">No hay reportes para mostrar.</p>`;
            this.modalMessage_vc_ga.innerHTML = html_vc_ga;
        } else {
            this.modalMessage_vc_ga.textContent = message_vc_ga;
        }

        this.modalAction_vc_ga.textContent = type_vc_ga === 'error' ? 'Reintentar' : 'Aceptar';
        this.modalCancel_vc_ga.style.display = isConfirm ? 'block' : 'none';

        this.modalContainer_vc_ga.classList.add('active');
        document.body.style.overflow = 'hidden';

        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
    }

    showConfirm_vc_ga(title_vc_ga, message_vc_ga) {
        return this.show_vc_ga(title_vc_ga, message_vc_ga, 'warning', true);
    }

    showSuccess_vc_ga(title_vc_ga, message_vc_ga) {
        return this.show_vc_ga(title_vc_ga, message_vc_ga, 'success');
    }

    showError_vc_ga(title_vc_ga, message_vc_ga) {
        return this.show_vc_ga(title_vc_ga, message_vc_ga, 'error');
    }

    showWarning_vc_ga(title_vc_ga, message_vc_ga) {
        return this.show_vc_ga(title_vc_ga, message_vc_ga, 'warning');
    }

    /**
     * Modal especializado para reportes: invoca show_vc_ga con tipo 'reportes'.
     * @param {string} titulo 
     * @param {Array} arrayReportes 
     * @returns {Promise<boolean>}
     */
    showReportes_vc_ga(titulo, arrayReportes) {
        return this.show_vc_ga(titulo, arrayReportes, 'reportes');
    }

    confirm_vc_ga() {
        this.hide_vc_ga();
        if (this.resolvePromise) {
            this.resolvePromise(true);
        }
    }

    cancel_vc_ga() {
        this.hide_vc_ga();
        if (this.resolvePromise) {
            this.resolvePromise(false);
        }
    }

    hide_vc_ga() {
        this.modalContainer_vc_ga.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const modal_vc_ga = new ModalDialog_vc_ga();
module.exports = { modal_vc_ga };
