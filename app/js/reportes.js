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
      const [bancos, contables, recibos] = await Promise.all([
        this._ejecutarConsulta_vc_ga(
          `SELECT id_reporte_banco_vc_ga AS id, fecha_reporte_vc_ga AS fecha, info_banco_vc_ga AS info
           FROM td_reporte_banco_vc_ga
           ORDER BY fecha_reporte_vc_ga DESC`
        ),
        this._ejecutarConsulta_vc_ga(
          `SELECT id_reporte_contable_vc_ga AS id, fecha_reporte_vc_ga AS fecha, info_contable_vc_ga AS info
           FROM td_reporte_contable_vc_ga
           ORDER BY fecha_reporte_vc_ga DESC`
        ),
        this._ejecutarConsulta_vc_ga(
          `SELECT id_recibo_vc_ga AS id,
                  id_pago_vc_ga AS idPago,
                  fecha_pago_vc_ga AS fechaPago,
                  monto_neto_vc_ga AS montoNeto,
                  fecha_generacion_vc_ga AS fecha,
                  contenido_vc_ga AS info
           FROM td_recibo_nomina_vc_ga
           ORDER BY fecha_generacion_vc_ga DESC`
        )
      ]);

      this.reportes_vc_ga = [
        ...bancos.map(r => ({ ...r, tipo: "reporte_banco" })),
        ...contables.map(r => ({ ...r, tipo: "reporte_contable" })),
        ...recibos.map(r => ({ ...r, tipo: "recibo_nomina" }))
      ];
      this.reportesFiltrados_vc_ga = [...this.reportes_vc_ga];
      return this.reportes_vc_ga;
    } catch (err) {
      console.error("Error cargando reportes:", err);
      await modal_vc_ga.showError_vc_ga("Error de carga", "No se pudieron obtener los reportes");
      throw err;
    }
  }

  filtrar_vc_ga({ tipo, fecha, reciboId }) {
    this.reportesFiltrados_vc_ga = this.reportes_vc_ga.filter(r => {
      if (reciboId && reciboId !== "") {
        if (r.tipo !== 'recibo_nomina' || String(r.id) !== reciboId) return false;
      }

      if (tipo && tipo !== "") {
        switch (tipo) {
          case 'recibo':
            if (r.tipo !== 'recibo_nomina') return false;
            break;
          case 'reporte_banco':
          case 'reporte_contable':
            if (r.tipo !== tipo) return false;
            break;
          default:
            break;
        }
      }

      if (fecha && fecha !== "") {
        const fechaISO = new Date(r.fecha).toISOString().slice(0, 10);
        if (fechaISO !== fecha) return false;
      }
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
    this.container_vc_ga = document.getElementById("documents");
    this.loading_vc_ga = document.getElementById("loadingMessage");
    this.filterType_vc_ga = document.getElementById("filterType");
    this.filterRecibo_vc_ga = document.getElementById("filterRecibo");
    this.filterDate_vc_ga = document.getElementById("filterDate");
    this.applyBtn_vc_ga = document.getElementById("applyFilters");

    this.gestor_vc_ga = new GestorReportes_vc_ga();
    this._init_vc_ga();
  }

  async _init_vc_ga() {
    this.applyBtn_vc_ga.addEventListener("click", () => this._onFiltrar_vc_ga());
    this.container_vc_ga.addEventListener("click", e => {
      const btn = e.target.closest(".view-more-btn");
      if (btn) this._onViewMore_vc_ga(btn);
    });

    try {
      await this.gestor_vc_ga.cargarReportes_vc_ga();
      this._render_vc_ga();
    } catch {
      // Error manejado en gestor
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
      card.className = "bg-white rounded-lg p-4 border border-gray-200 dark:bg-dark-700 dark:border-gray-600 mb-4";

      let titulo = "Reporte";
      switch (r.tipo) {
        case "reporte_banco": titulo = "Reporte Bancario"; break;
        case "reporte_contable": titulo = "Reporte Contable"; break;
        case "recibo_nomina": titulo = "Recibo de Nómina"; break;
      }

      let detallesAdicionales = "";
      if (r.tipo === 'recibo_nomina') {
        detallesAdicionales = `<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">ID Pago: ${r.idPago}</p>
                              <p class="text-sm text-gray-600 dark:text-gray-400">Monto Neto: ${r.montoNeto}</p>`;
      }

      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white">${titulo}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Fecha: ${new Date(r.fecha).toLocaleDateString("es-ES")}</p>
            ${detallesAdicionales}
            <p class="mt-2 text-gray-700 dark:text-gray-300">${r.info}</p>
          </div>
          <button class="view-more-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
                  data-id="${r.tipo}__${r.id}">
            <i class="fas fa-arrow-right text-accent2"></i>
          </button>
        </div>`;

      this.container_vc_ga.appendChild(card);
    });
  }

  _onFiltrar_vc_ga() {
    const filtros = {
      tipo: this.filterType_vc_ga.value,
      reciboId: this.filterRecibo_vc_ga.value,
      fecha: this.filterDate_vc_ga.value
    };
    this.gestor_vc_ga.filtrar_vc_ga(filtros);
    this._render_vc_ga();
  }

  _onViewMore_vc_ga(btn_vc_ga) {
    const [tipo, id] = btn_vc_ga.dataset.id.split("__");
    const report = this.gestor_vc_ga.reportes_vc_ga
      .find(r => r.tipo === tipo && String(r.id) === id);
    if (!report) return;

    let titulo = "Detalle Reportes";
    switch (tipo) {
      case "reporte_banco": titulo = "Detalle Reporte Bancario"; break;
      case "reporte_contable": titulo = "Detalle Reporte Contable"; break;
      case "recibo_nomina": titulo = "Detalle Recibo de Nómina"; break;
    }

    // SOLUCIÓN CORREGIDA (COPIAR Y FORMATEAR)
    const reportForModal = {...report};
    if (tipo === 'recibo_nomina') {
      reportForModal.info = `ID Pago: ${report.idPago}\nMonto Neto: ${report.montoNeto}\n\n${report.info}`;
    }

    modal_vc_ga.showReportes_vc_ga(titulo, [reportForModal]);
  }
}

module.exports = { reportesHTML_vc_ga, ReportesController_vc_ga };
