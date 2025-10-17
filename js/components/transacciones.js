// js/components/transacciones.js
// Usa la API global: Api.listarTransaccionesPorCuenta / Api.depositar / Api.retirar
(function () {
  async function cargarYpintar(cuentaId, containerSelector = '#main-content') {
    const el = document.querySelector(containerSelector);
    el.innerHTML = `<p>Cargando transacciones de la cuenta ${cuentaId}...</p>`;
    try {
      const tx = await Api.listarTransaccionesPorCuenta(cuentaId);
      const rows = (tx || [])
        .map(t => `
          <tr>
            <td>${t.id ?? '-'}</td>
            <td>${t.tipo ?? '-'}</td>
            <td>${t.monto ?? '-'}</td>
            <td>${t.cuentaOrigen?.id ?? '-'}</td>
            <td>${t.cuentaDestino?.id ?? '-'}</td>
            <td>${t.fecha ?? '-'}</td>
          </tr>
        `)
        .join('');

      el.innerHTML = `
        <h2>Transacciones — Cuenta ${cuentaId}</h2>
        <div style="margin: 8px 0;">
          <button id="btnVolverCuentas">← Volver a Cuentas</button>
        </div>

        <table class="tabla">
          <thead>
            <tr><th>ID</th><th>Tipo</th><th>Monto</th><th>Origen</th><th>Destino</th><th>Fecha</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <h3 style="margin-top:16px;">Nueva transacción</h3>
        <form id="formTx" class="form">
          <label>Tipo
            <select name="tipo" required>
              <option value="deposito">Depósito</option>
              <option value="retiro">Retiro</option>
            </select>
          </label>
          <label>Monto
            <input name="monto" type="number" step="0.01" min="0.01" required>
          </label>
          <div style="margin-top:12px;">
            <button type="submit" id="btnProcesar">Procesar</button>
          </div>
        </form>
        <div id="msg" style="margin-top:8px;"></div>
      `;

      // Volver a Cuentas
      document.getElementById('btnVolverCuentas')?.addEventListener('click', () => {
        globalThis.UI?.pintarListadoCuentas?.(containerSelector);
      });

      // Envío del formulario (depósito/retiro)
      const form = el.querySelector('#formTx');
      const btn = el.querySelector('#btnProcesar');
      const msg = el.querySelector('#msg');

      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const fd = new FormData(form);
        const tipo = fd.get('tipo');
        const monto = Number(fd.get('monto'));

        if (!monto || monto <= 0) {
          msg.textContent = 'Ingresa un monto válido (> 0).';
          return;
        }

        btn.disabled = true;
        msg.textContent = 'Procesando...';

        try {
          if (tipo === 'deposito') {
            await Api.depositar(cuentaId, monto);
          } else {
            await Api.retirar(cuentaId, monto);
          }
          msg.textContent = 'Transacción realizada ✅';
          // recargar la tabla
          setTimeout(() => cargarYpintar(cuentaId, containerSelector), 300);
        } catch (e) {
          msg.textContent = `Error: ${e.message || 'No se pudo completar la transacción'}`;
        } finally {
          btn.disabled = false;
        }
      });
    } catch (e) {
      el.innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
  }

  // Pantalla inicial de Transacciones: pide un cuentaId
  function renderTransacciones(containerSelector = '#main-content') {
    const el = document.querySelector(containerSelector);
    el.innerHTML = `
      <h2>Transacciones</h2>
      <form id="formPickCuenta" class="form">
        <label>ID de cuenta
          <input name="cuentaId" type="number" min="1" required placeholder="Ej: 4">
        </label>
        <div style="margin-top:12px;">
          <button type="submit">Cargar</button>
          <button type="button" id="btnIrCuentas">Ver listado de cuentas</button>
        </div>
      </form>
      <div id="msgPick" style="margin-top:8px;"></div>
    `;

    document.getElementById('btnIrCuentas')?.addEventListener('click', () => {
      globalThis.UI?.pintarListadoCuentas?.(containerSelector);
    });

    const form = el.querySelector('#formPickCuenta');
    const msg = el.querySelector('#msgPick');

    // ✅ Si viene ?cuenta=ID o ?from=ID en el hash, cargar automático
    try {
      const hash = location.hash; // ej: "#/transacciones?cuenta=7"
      const qp = new URLSearchParams(hash.split('?')[1] || '');
      const cuentaParam = Number(qp.get('cuenta') || qp.get('from'));
      if (cuentaParam && cuentaParam > 0) {
        form.querySelector('input[name="cuentaId"]').value = String(cuentaParam);
        cargarYpintar(cuentaParam, containerSelector);
        return;
      }
    } catch (e) {
      console.warn('No pude leer query param de cuenta:', e);
    }

    // Envío manual (cuando no hay query param)
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const id = Number(fd.get('cuentaId'));
      if (!id || id < 1) {
        msg.textContent = 'Ingresa un ID de cuenta válido.';
        return;
      }
      cargarYpintar(id, containerSelector);
    });
  }

  // Exponer APIs al global
  globalThis.UI = globalThis.UI || {};
  globalThis.UI.pintarTransacciones = cargarYpintar; // por si quieres llamarla directo con un id
  globalThis.renderTransacciones = () => renderTransacciones('#main-content'); // para el router
})();
