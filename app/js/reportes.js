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
          `SELECT 
              rb.id_reporte_banco_vc_ga AS id, 
              rb.fecha_reporte_vc_ga AS fecha, 
              rb.info_banco_vc_ga AS info,
              GROUP_CONCAT(rbr.id_recibo_vc_ga) AS recibosAsociados
           FROM td_reporte_banco_vc_ga rb
           LEFT JOIN td_reporte_banco_recibos_vc_ga rbr 
             ON rb.id_reporte_banco_vc_ga = rbr.id_reporte_banco_vc_ga
           GROUP BY rb.id_reporte_banco_vc_ga
           ORDER BY rb.fecha_reporte_vc_ga DESC`
        ),
        this._ejecutarConsulta_vc_ga(
          `SELECT 
              rc.id_reporte_contable_vc_ga AS id, 
              rc.fecha_reporte_vc_ga AS fecha, 
              rc.info_contable_vc_ga AS info,
              GROUP_CONCAT(rcr.id_recibo_vc_ga) AS recibosAsociados
           FROM td_reporte_contable_vc_ga rc
           LEFT JOIN td_reporte_contable_recibos_vc_ga rcr 
             ON rc.id_reporte_contable_vc_ga = rcr.id_reporte_contable_vc_ga
           GROUP BY rc.id_reporte_contable_vc_ga
           ORDER BY rc.fecha_reporte_vc_ga DESC`
        ),
       this._ejecutarConsulta_vc_ga(
    `SELECT 
        rn.id_recibo_vc_ga AS id,
        rn.id_usuario_vc_ga AS idUsuario,
        rn.id_pago_vc_ga AS idPago,
        rn.fecha_pago_vc_ga AS fechaPago,
        rn.monto_neto_vc_ga AS montoNeto,
        rn.fecha_generacion_vc_ga AS fecha,
        rn.contenido_vc_ga AS info,
        GROUP_CONCAT(DISTINCT rbr.id_reporte_banco_vc_ga) AS reportesBancoAsociados,
        GROUP_CONCAT(DISTINCT rcr.id_reporte_contable_vc_ga) AS reportesContableAsociados,
        -- Nuevos campos para deducciones
        GROUP_CONCAT(DISTINCT CONCAT_WS('::', ud.id_usuario_deduccion_vc_ga, ud.monto_vc_ga, d.nombre_vc_ga, d.porcentaje_vc_ga) SEPARATOR '||') AS deducciones,
        -- Nuevos campos para bonos
        GROUP_CONCAT(DISTINCT CONCAT_WS('::', b.id_bono_vc_ga, b.monto_vc_ga, b.tipo_bono_vc_ga) SEPARATOR '||') AS bonos
     FROM td_recibo_nomina_vc_ga rn
     LEFT JOIN td_reporte_banco_recibos_vc_ga rbr 
        ON rn.id_recibo_vc_ga = rbr.id_recibo_vc_ga
     LEFT JOIN td_reporte_contable_recibos_vc_ga rcr 
        ON rn.id_recibo_vc_ga = rcr.id_recibo_vc_ga
     -- Nuevos JOINs para deducciones
     LEFT JOIN td_recibo_deduccion_vc_ga rd 
        ON rn.id_recibo_vc_ga = rd.id_recibo_vc_ga
     LEFT JOIN td_usuario_deduccion_vc_ga ud 
        ON rd.id_usuario_deduccion_vc_ga = ud.id_usuario_deduccion_vc_ga
     LEFT JOIN td_deduccion_vc_ga d 
        ON ud.id_deduccion_vc_ga = d.id_deduccion_vc_ga
     -- Nuevos JOINs para bonos
     LEFT JOIN td_recibo_bono_vc_ga rb 
        ON rn.id_recibo_vc_ga = rb.id_recibo_vc_ga
     LEFT JOIN td_bono_vc_ga b 
        ON rb.id_bono_vc_ga = b.id_bono_vc_ga
     GROUP BY rn.id_recibo_vc_ga
     ORDER BY rn.fecha_generacion_vc_ga DESC`
  )
]);

      this.reportes_vc_ga = [
        ...bancos.map(r => ({ 
          ...r, 
          tipo: "reporte_banco",
          recibosAsociados: r.recibosAsociados ? r.recibosAsociados.split(',').map(Number) : [] 
        })),
        ...contables.map(r => ({ 
          ...r, 
          tipo: "reporte_contable",
          recibosAsociados: r.recibosAsociados ? r.recibosAsociados.split(',').map(Number) : [] 
        })),
        ...recibos.map(r => ({
          ...r,
          tipo: "recibo_nomina",
          idUsuario: r.idUsuario ? String(r.idUsuario) : null,
          idPago: r.idPago ? String(r.idPago) : null,
          reportesBancoAsociados: r.reportesBancoAsociados 
            ? r.reportesBancoAsociados.split(',').map(Number) : [],
          reportesContableAsociados: r.reportesContableAsociados 
            ? r.reportesContableAsociados.split(',').map(Number) : [],
          // Parsear deducciones
          deducciones: r.deducciones 
            ? r.deducciones.split('||').map(item => {
                const [id, monto, nombre, porcentaje] = item.split('::');
                return {
                  id: Number(id),
                  monto: Number(monto),
                  nombre,
                  porcentaje: Number(porcentaje)
                };
              }) 
            : [],
          // Parsear bonos
          bonos: r.bonos 
            ? r.bonos.split('||').map(item => {
                const [id, monto, tipo] = item.split('::');
                return {
                  id: Number(id),
                  monto: Number(monto),
                  tipo
                };
              }) 
            : []
        }))
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
      // Filtro por ID de recibo (busca en relaciones)
      if (reciboId && reciboId !== "") {
        const idBuscado = Number(reciboId);
        if (isNaN(idBuscado)) return false;
        
        if (r.tipo === 'recibo_nomina') {
          if (r.id !== idBuscado) return false;
        } 
        else if (r.tipo === 'reporte_banco') {
          if (!r.recibosAsociados.includes(idBuscado)) return false;
        }
        else if (r.tipo === 'reporte_contable') {
          if (!r.recibosAsociados.includes(idBuscado)) return false;
        }
        else {
          return false;
        }
      }

      // Filtro por tipo de documento
      if (tipo && tipo !== "") {
        switch (tipo) {
          case 'recibo':
            if (r.tipo !== 'recibo_nomina') return false;
            break;
          case 'reporte_banco':
            if (r.tipo !== 'reporte_banco') return false;
            break;
          case 'reporte_contable':
            if (r.tipo !== 'reporte_contable') return false;
            break;
          default:
            break;
        }
      }

      // Filtro por fecha
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

  //CRUD Recibo de nomina
  /**
   * 1) Inserta un nuevo recibo de nómina en td_recibo_nomina_vc_ga
   * 2) Asocia automáticamente todas las deducciones del usuario en td_recibo_deduccion_vc_ga
   * 3) Asocia automáticamente todos los bonos del usuario en td_recibo_bono_vc_ga
   */
  async crearReciboNomina_vc_ga() {
    // Leer valores de los inputs básicos
    const idUsuario = document.getElementById("inputReciboUsuario").value;
    const idPago = document.getElementById("inputReciboPago").value;
    const fechaPago = document.getElementById("inputReciboFechaPago").value;
    const montoNeto = document.getElementById("inputReciboMonto").value;
    const contenido = document.getElementById("inputReciboContenido").value;

    // Inserción principal en td_recibo_nomina_vc_ga
    const sqlRecibo = `
      INSERT INTO td_recibo_nomina_vc_ga
        (id_usuario_vc_ga, id_pago_vc_ga, fecha_pago_vc_ga, monto_neto_vc_ga, contenido_vc_ga, fecha_generacion_vc_ga)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const paramsRecibo = [idUsuario, idPago, fechaPago, montoNeto, contenido];

    try {
      const result = await this._ejecutarConsulta_vc_ga(sqlRecibo, paramsRecibo);
      const idRecibo = result.insertId;

      // Inserta automáticamente deducciones del usuario
      const sqlAutoDedu = `
        INSERT INTO td_recibo_deduccion_vc_ga (id_recibo_vc_ga, id_usuario_deduccion_vc_ga)
        SELECT ?, ud.id_usuario_deduccion_vc_ga
        FROM td_usuario_deduccion_vc_ga ud
        WHERE ud.id_usuario_vc_ga = ?
      `;
      await this._ejecutarConsulta_vc_ga(sqlAutoDedu, [idRecibo, idUsuario]);

      // Inserta automáticamente bonos del usuario
      const sqlAutoBono = `
        INSERT INTO td_recibo_bono_vc_ga (id_recibo_vc_ga, id_bono_vc_ga)
        SELECT ?, b.id_bono_vc_ga
        FROM td_bono_vc_ga b
        WHERE b.id_usuario_vc_ga = ?
      `;
      await this._ejecutarConsulta_vc_ga(sqlAutoBono, [idRecibo, idUsuario]);

      return idRecibo;
    } catch (err) {
      console.error("Error creando recibo y asociando deducciones/bonos:", err);
      throw err;
    }
  }

  /**
   * Elimina un recibo de nómina y sus asociaciones.
   * @param {number} idRecibo
   */
  async eliminarReciboNomina_vc_ga(idRecibo) {
    // Eliminar deducciones y bonos asociados
    await this._ejecutarConsulta_vc_ga(
      `DELETE FROM td_recibo_deduccion_vc_ga WHERE id_recibo_vc_ga = ?`,
      [idRecibo]
    );
    await this._ejecutarConsulta_vc_ga(
      `DELETE FROM td_recibo_bono_vc_ga WHERE id_recibo_vc_ga = ?`,
      [idRecibo]
    );

    // Eliminar el recibo principal
    await this._ejecutarConsulta_vc_ga(
      `DELETE FROM td_recibo_nomina_vc_ga WHERE id_recibo_vc_ga = ?`,
      [idRecibo]
    );
  }



  //CRUD Reporte Banco

   /**
   * 2) Inserta un nuevo reporte bancario y sus relaciones en td_reporte_banco_recibos_vc_ga
   *    Obtiene:
   *      - #inputBancoFecha
   *      - #inputBancoInfo
   *      - #inputBancoRecibos  (ids separados por comas)
   */
  async crearReporteBanco_vc_ga() {
    const fecha     = document.getElementById("inputBancoFecha").value;
    const info      = document.getElementById("inputBancoInfo").value;
    const recibosIn = document.getElementById("inputBancoRecibos").value;
    const recibos   = recibosIn.split(",").map(id => id.trim()).filter(x => x).map(Number);

    // 1) Insertar en td_reporte_banco_vc_ga
    const sqlReporte = `
      INSERT INTO td_reporte_banco_vc_ga
        (fecha_reporte_vc_ga, info_banco_vc_ga)
      VALUES (?, ?)
    `;
    const paramsReporte = [fecha, info];

    try {
      const { insertId: idReporte } = await this._ejecutarConsulta_vc_ga(sqlReporte, paramsReporte);

      // 2) Insertar relaciones en td_reporte_banco_recibos_vc_ga
      const sqlRel = `
        INSERT INTO td_reporte_banco_recibos_vc_ga
          (id_reporte_banco_vc_ga, id_recibo_vc_ga)
        VALUES (?, ?)
      `;
      for (const idRecibo of recibos) {
        await this._ejecutarConsulta_vc_ga(sqlRel, [idReporte, idRecibo]);
      }

      return idReporte;
    } catch (err) {
      console.error("Error creando reporte bancario:", err);
      throw err;
    }
  }

  //CRUD Reporte Contable

  /**
   * 3) Inserta un nuevo reporte contable y sus relaciones en td_reporte_contable_recibos_vc_ga
   *    Obtiene:
   *      - #inputContableFecha
   *      - #inputContableInfo
   *      - #inputContableRecibos  (ids separados por comas)
   */
  async crearReporteContable_vc_ga() {
    const fecha     = document.getElementById("inputContableFecha").value;
    const info      = document.getElementById("inputContableInfo").value;
    const recibosIn = document.getElementById("inputContableRecibos").value;
    const recibos   = recibosIn.split(",").map(id => id.trim()).filter(x => x).map(Number);

    // 1) Insertar en td_reporte_contable_vc_ga
    const sqlReporte = `
      INSERT INTO td_reporte_contable_vc_ga
        (fecha_reporte_vc_ga, info_contable_vc_ga)
      VALUES (?, ?)
    `;
    const paramsReporte = [fecha, info];

    try {
      const { insertId: idReporte } = await this._ejecutarConsulta_vc_ga(sqlReporte, paramsReporte);

      // 2) Insertar relaciones en td_reporte_contable_recibos_vc_ga
      const sqlRel = `
        INSERT INTO td_reporte_contable_recibos_vc_ga
          (id_reporte_contable_vc_ga, id_recibo_vc_ga)
        VALUES (?, ?)
      `;
      for (const idRecibo of recibos) {
        await this._ejecutarConsulta_vc_ga(sqlRel, [idReporte, idRecibo]);
      }

      return idReporte;
    } catch (err) {
      console.error("Error creando reporte contable:", err);
      throw err;
    }
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
        detallesAdicionales = `
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ID Usuario: ${r.idUsuario || 'N/A'}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            ID Pago: ${r.idPago || 'N/A'}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Monto Neto: ${r.montoNeto || '0.00'}
          </p>`;

        if (r.deducciones.length > 0) {
          detallesAdicionales += `
            <div class="mt-2">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Deducciones:</p>
              ${r.deducciones.map(d => `
                <span class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                  ${d.nombre}: ${d.monto} (${d.porcentaje}%)
                </span>`).join('')}
            </div>`;
        }
        if (r.bonos.length > 0) {
          detallesAdicionales += `
            <div class="mt-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Bonos:</p>
              ${r.bonos.map(b => `
                <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                  ${b.tipo}: ${b.monto}
                </span>`).join('')}
            </div>`;
        }
        if (r.reportesBancoAsociados.length > 0 || r.reportesContableAsociados.length > 0) {
          detallesAdicionales += `
            <div class="mt-2">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Relacionado con:</p>
              ${r.reportesBancoAsociados.length > 0 ? 
                `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                  Bancario: ${r.reportesBancoAsociados.join(', ')}
                </span>` : ''}
              ${r.reportesContableAsociados.length > 0 ? 
                `<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Contable: ${r.reportesContableAsociados.join(', ')}
                </span>` : ''}
            </div>`;
        }
      } else if (r.tipo === 'reporte_banco' || r.tipo === 'reporte_contable') {
        if (r.recibosAsociados.length > 0) {
          detallesAdicionales = `
            <div class="mt-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Recibos asociados:</p>
              <span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                ${r.recibosAsociados.join(', ')}
              </span>
            </div>`;
        }
      }

      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 dark:text-white">${titulo}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fecha: ${new Date(r.fecha).toLocaleDateString("es-ES")}
            </p>
            ${detallesAdicionales}
            <p class="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
              ${r.info}
            </p>
          </div>
          <div class="flex flex-col space-y-2 ml-4">
            <button class="view-more-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
                    data-id="${r.tipo}__${r.id}" aria-label="Ver detalles">
              <i class="fas fa-arrow-right text-accent2"></i>
            </button>
            ${r.tipo === 'recibo_nomina' ? `
            <button class="delete-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
                    data-id="${r.id}" aria-label="Eliminar recibo">
              <i class="fas fa-trash text-red-500"></i>
            </button>
            ` : ''}
          </div>
        </div>`;

      this.container_vc_ga.appendChild(card);
    });

    // Delegación de eventos extra
    this.container_vc_ga.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = Number(e.currentTarget.dataset.id);
        const confirm_vc_ga = await modal_vc_ga.showConfirm_vc_ga("Alerta", "¿Estás seguro de eliminar este recibo?")
        if (confirm_vc_ga) {
          await this.gestor_vc_ga.eliminarReciboNomina_vc_ga(id);
          await this.gestor_vc_ga.cargarReportes_vc_ga();
          this._render_vc_ga();
        }
      });
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

    let titulo;
    let documentos = [];

    switch (tipo) {
      case "reporte_banco":
        titulo = `Detalle Reporte Bancario #${report.id}`;
        documentos = this._obtenerRecibosAsociados_vc_ga(report.recibosAsociados);
        documentos.unshift(report);
        break;

      case "reporte_contable":
        titulo = `Detalle Reporte Contable #${report.id}`;
        documentos = this._obtenerRecibosAsociados_vc_ga(report.recibosAsociados);
        documentos.unshift(report);
        break;

      case "recibo_nomina":
        // Usamos el mismo helper para formatear el detalle completo del recibo
        titulo = `Detalle Recibo de Nómina #${report.id}`;
        documentos = this._obtenerRecibosAsociados_vc_ga([report.id]);
        break;
    }

    modal_vc_ga.showReportes_vc_ga(titulo, documentos);
  }

  // Método auxiliar para obtener y formatear recibos (ahora sirve también para el caso único)
  _obtenerRecibosAsociados_vc_ga(idsRecibos) {
    return idsRecibos.map(idRecibo => {
      const recibo = this.gestor_vc_ga.reportes_vc_ga.find(
        r => r.tipo === 'recibo_nomina' && r.id === idRecibo
      );
      if (!recibo) return null;

      // Construcción del info detallado
      let info = `ID Recibo: ${recibo.id}\n`;
      info += `ID Usuario: ${recibo.idUsuario || 'N/A'}\n`;
      info += `ID Pago: ${recibo.idPago || 'N/A'}\n`;
      info += `Fecha Pago: ${recibo.fechaPago || 'N/A'}\n`;
      info += `Monto Neto: ${recibo.montoNeto || '0.00'}\n\n`;
      info += recibo.info || '';

      if (recibo.deducciones.length) {
        info += `\n\nDeducciones:`;
        recibo.deducciones.forEach(d => {
          info += `\n- ${d.nombre}: ${d.monto} (${d.porcentaje}%)`;
        });
      }
      if (recibo.bonos.length) {
        info += `\n\nBonos:`;
        recibo.bonos.forEach(b => {
          info += `\n- ${b.tipo}: ${b.monto}`;
        });
      }
      if (recibo.reportesBancoAsociados.length || recibo.reportesContableAsociados.length) {
        info += `\n\nRelaciones:`;
        if (recibo.reportesBancoAsociados.length) {
          info += `\nReportes Bancarios: ${recibo.reportesBancoAsociados.join(', ')}`;
        }
        if (recibo.reportesContableAsociados.length) {
          info += `\nReportes Contables: ${recibo.reportesContableAsociados.join(', ')}`;
        }
      }

      return { ...recibo, info };
    }).filter(Boolean);
  }
}

module.exports = { reportesHTML_vc_ga, ReportesController_vc_ga, GestorReportes_vc_ga};