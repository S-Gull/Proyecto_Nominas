const reportesHTML_vc_ga = document.getElementById("reportes");
const { modal_vc_ga } = require("./modal");
const { consulta_vc_ga } = require("../database/conexion");

class GestorReportes_vc_ga {
  constructor() {
    this.reportes_vc_ga = [];
    this.reportesFiltrados_vc_ga = [];
  }

  async cargarReportes_vc_ga() {
    try {
      // Cargar reportes bancarios y contables
      const [bancos, contables] = await Promise.all([
        this._ejecutarConsulta_vc_ga(
          `SELECT id_reporte_banco_vc_ga AS id, fecha_reporte_vc_ga AS fecha, info_banco_vc_ga AS info
           FROM td_reporte_banco_vc_ga
           ORDER BY fecha_reporte_vc_ga DESC`
        ),
        this._ejecutarConsulta_vc_ga(
          `SELECT id_reporte_contable_vc_ga AS id, fecha_reporte_vc_ga AS fecha, info_contable_vc_ga AS info
           FROM td_reporte_contable_vc_ga
           ORDER BY fecha_reporte_vc_ga DESC`
        )
      ]);

      // Normalizar y unificar
      this.reportes_vc_ga = [
        ...bancos.map(r => ({ ...r, tipo: "reporte_banco" })),
        ...contables.map(r => ({ ...r, tipo: "reporte_contable" }))
      ];
      this.reportesFiltrados_vc_ga = [...this.reportes_vc_ga];
      return this.reportes_vc_ga;
    } catch (err) {
      console.error("Error cargando reportes:", err);
      await modal_vc_ga.showError_vc_ga(
        "Error de carga",
        "No se pudieron obtener los reportes"
      );
      throw err;
    }
  }

  filtrar_vc_ga({ tipo, id_pago, fecha }) {
    // Nota: id_pago no aplica aquí pues los reportes no tienen id_pago vinculado,
    // pero dejo la clave para futuro ajuste si lo necesitas.
    this.reportesFiltrados_vc_ga = this.reportes_vc_ga.filter(r => {
      if (tipo && r.tipo !== tipo) return false;
      if (fecha && r.fecha !== fecha) return false;
      return true;
    });
    return this.reportesFiltrados_vc_ga;
  }

  async _ejecutarConsulta_vc_ga(sql_vc_ga, params_vc_ga = []) {
    return new Promise((resolve_vc_ga, reject_vc_ga) => {
      consulta_vc_ga(sql_vc_ga, params_vc_ga, (err, results) => {
        if (err) {
          console.error("Error en consulta SQL:", { sql: sql_vc_ga, params_vc_ga, err });
          reject_vc_ga(new Error("Error al ejecutar consulta en la base de datos"));
        } else {
          resolve_vc_ga(results);
        }
      });
    });
  }
}

class ReportesController_vc_ga {
  constructor() {
    // DOM
    this.container_vc_ga   = document.getElementById("documents");
    this.loading_vc_ga     = document.getElementById("loadingMessage");
    this.filterType_vc_ga  = document.getElementById("filterType");
    this.filterDate_vc_ga  = document.getElementById("filterDate");
    this.applyBtn_vc_ga    = document.getElementById("applyFilters");
    // Modal
    this.modalContainer_vc_ga = document.getElementById("modalContainer");
    this.modalTitle_vc_ga     = document.getElementById("modalTitle");
    this.modalBody_vc_ga      = document.getElementById("modalBody");
    this.modalClose_vc_ga     = document.getElementById("modalClose");
    this.modalAction_vc_ga    = document.getElementById("modalAction");

    this.gestor_vc_ga = new GestorReportes_vc_ga();
    this._init_vc_ga();
  }

  async _init_vc_ga() {
    // Eventos modal
    this.modalClose_vc_ga.addEventListener("click", () => this._closeModal_vc_ga());
    this.modalAction_vc_ga.addEventListener("click", () => this._closeModal_vc_ga());
    // Evento filtro
    this.applyBtn_vc_ga.addEventListener("click", () => this._onFiltrar_vc_ga());

    // Carga inicial
    try {
      await this.gestor_vc_ga.cargarReportes_vc_ga();
      this._render_vc_ga();
    } catch {
      // Error ya mostrado en gestor
    }
  }

  _render_vc_ga() {
    this.loading_vc_ga?.remove();
    this.container_vc_ga.innerHTML = "";

    const list = this.gestor_vc_ga.reportesFiltrados_vc_ga;
    if (list.length === 0) {
      this.container_vc_ga.innerHTML = `
        <div class="text-center py-10 text-gray-500 dark:text-gray-400">
          <i class="fas fa-file-alt text-2xl mb-2"></i>
          <p>No se encontraron documentos</p>
        </div>`;
      return;
    }

    list.forEach(r => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-lg p-4 border border-gray-200 dark:bg-dark-700 dark:border-gray-600";
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">
              ${r.tipo === "reporte_banco" ? "Reporte Bancario" : "Reporte Contable"}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fecha: ${new Date(r.fecha).toLocaleDateString("es-ES")}
            </p>
          </div>
          <button class="view-more-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
                  data-id="${r.tipo}__${r.id}">
            <i class="fas fa-arrow-right text-accent2"></i>
          </button>
        </div>`;
      this.container_vc_ga.appendChild(card);
    });

    // Linkear “Ver más”
    this.container_vc_ga.querySelectorAll(".view-more-btn").forEach(btn => {
      btn.addEventListener("click", () => this._onViewMore_vc_ga(btn));
    });
  }

  _onFiltrar_vc_ga() {
    const filtros = {
      tipo:   this.filterType_vc_ga.value,
      fecha:  this.filterDate_vc_ga.value
    };
    this.gestor_vc_ga.filtrar_vc_ga(filtros);
    this._render_vc_ga();
  }

  // reportesController_vc_ga.js (fragmento)
_onViewMore_vc_ga(btn_vc_ga) {
  const [tipo, id] = btn_vc_ga.dataset.id.split("__");
  const report = this.gestor_vc_ga.reportes_vc_ga
    .find(r => r.tipo === tipo && String(r.id) === id);
  if (!report) return;

  // Ahora usamos el nuevo showReportes_vc_ga
  modal_vc_ga.showReportes_vc_ga(
    tipo === "reporte_banco" ? "Detalle Reporte Bancario" : "Detalle Reporte Contable",
    [report]  // enviamos un array (podrías enviar varios si quisieras)
  );
}


  _openModal_vc_ga(titulo, contenido) {
    this.modalTitle_vc_ga.textContent = titulo;
    this.modalBody_vc_ga.innerHTML   = contenido;
    this.modalContainer_vc_ga.classList.add("active");
  }

  _closeModal_vc_ga() {
    this.modalContainer_vc_ga.classList.remove("active");
  }
}

module.exports = { reportesHTML_vc_ga, ReportesController_vc_ga };
