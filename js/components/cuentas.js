// js/components/cuentas.js
// NO usa import/export. Usa la API global: Api.* y expone UI.* en globalThis

(function () {
  // Pinta una tabla con las cuentas
  async function pintarListadoCuentas(containerSelector = '#main-content') {
    const el = document.querySelector(containerSelector);
    el.innerHTML = '<p>Cargando cuentas...</p>';

    try {
      const cuentas = await Api.getCuentas(); // <- llama al proxy /api

      if (!Array.isArray(cuentas) || cuentas.length === 0) {
        el.innerHTML = `
          <h2>Cuentas</h2>
          <p>No hay cuentas registradas.</p>
        `;
        return;
      }

      const rows = cuentas.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${c.numeroCuenta}</td>
          <td>${c.saldo}</td>
          <td>${c.usuario?.nombre || '-'}</td>
          <td>
            <button class="btn-ver-tx" data-id="${c.id}">Ver transacciones</button>
            <button class="btn-detalle" data-id="${c.id}">Detalle</button>
          </td>
        </tr>
      `).join('');

      el.innerHTML = `
        <h2>Cuentas</h2>
        <table class="tabla">
          <thead>
            <tr><th>ID</th><th>Número</th><th>Saldo</th><th>Usuario</th><th>Acciones</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;

      // Navegar a transacciones con el ID de la cuenta
      el.querySelectorAll('.btn-ver-tx').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          location.hash = `#/transacciones?cuenta=${id}`;
        });
      });

      // Abrir detalle (solo lectura)
      el.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          globalThis.UI?.pintarEditarCuenta?.(id, containerSelector);
        });
      });

    } catch (e) {
      el.innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
  }

  // Exponer la función para que la use app.js (o consola)
  globalThis.UI = globalThis.UI || {};
  globalThis.UI.pintarListadoCuentas = pintarListadoCuentas;
})();


// Vista: formulario para crear cuenta (UI + envío real)
(function () {
  function pintarFormCrearCuenta(containerSelector = '#main-content') {
    const el = document.querySelector(containerSelector);
    el.innerHTML = `
      <h2>Crear cuenta</h2>
      <form id="formCrearCuenta" class="form">
        <label>Usuario ID
          <input name="usuarioId" type="number" min="1" required>
        </label>
        <label>Número de Cuenta
          <input name="numeroCuenta" type="text" required>
        </label>
        <div style="margin-top:12px;">
          <button type="submit" id="btnCrear">Crear</button>
          <button type="button" id="btnVolverCuentas">Volver</button>
        </div>
      </form>
      <div id="msg" style="margin-top:8px;"></div>
    `;

    // Botón volver al listado
    document.getElementById('btnVolverCuentas')?.addEventListener('click', () => {
      globalThis.UI?.pintarListadoCuentas?.(containerSelector);
    });

    const form = el.querySelector('#formCrearCuenta');
    const btnCrear = el.querySelector('#btnCrear');
    const msg = el.querySelector('#msg');

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      // 1) Validación mínima
      const fd = new FormData(form);
      const usuarioId = (fd.get('usuarioId') || '').toString().trim();
      const numeroCuenta = (fd.get('numeroCuenta') || '').toString().trim();

      if (!usuarioId || isNaN(Number(usuarioId)) || Number(usuarioId) < 1) {
        msg.textContent = 'Ingresa un Usuario ID válido (número mayor a 0).';
        return;
      }
      if (!numeroCuenta) {
        msg.textContent = 'Ingresa un Número de Cuenta.';
        return;
      }

      // 2) UI de cargando
      msg.textContent = 'Creando cuenta...';
      btnCrear.disabled = true;

      try {
        // 3) Llamada al backend a través del proxy /api
        await Api.crearCuenta(usuarioId, numeroCuenta);

        // 4) Éxito: aviso + volver al listado
        msg.textContent = 'Cuenta creada ✅';
        setTimeout(() => {
          globalThis.UI?.pintarListadoCuentas?.(containerSelector);
        }, 400);
      } catch (e) {
        // 5) Error: mostrar mensaje claro
        msg.textContent = `Error: ${e?.message || 'No se pudo crear la cuenta'}`;
      } finally {
        btnCrear.disabled = false;
      }
    });
  }

  // exponer
  globalThis.UI = globalThis.UI || {};
  globalThis.UI.pintarFormCrearCuenta = pintarFormCrearCuenta;
})();


// --- Vista: Detalle de cuenta (solo lectura; sin PUT) ---
(function () {
  async function pintarEditarCuenta(id, containerSelector = '#main-content') {
    const el = document.querySelector(containerSelector);
    el.innerHTML = `<p>Cargando cuenta #${id}...</p>`;

    try {
      // 1) Obtenemos la cuenta actual
      const c = await Api.getCuenta(id);

      // 2) Pintamos el formulario (solo lectura)
      el.innerHTML = `
        <h2>Detalle de cuenta #${id}</h2>
        <form id="formDetalleCuenta" class="form">
          <label>Número de Cuenta
            <input name="numeroCuenta" type="text" value="${c.numeroCuenta ?? ''}" readonly>
          </label>
          <label>Saldo (ajústalo con depósito/retiro)
            <input name="saldo" type="number" step="0.01" min="0" value="${c.saldo ?? 0}" readonly>
          </label>
          <div style="margin-top:12px;">
            <button type="button" id="btnIrTx">Ir a Transacciones</button>
            <button type="button" id="btnVolver">Volver</button>
          </div>
        </form>
        <div id="msg" style="margin-top:8px; color:#666;">
          * Tu API no expone PUT /cuentas/:id. Para cambiar el saldo, usa Depósito/Retiro.
        </div>
      `;

      // 3) Botón "Volver" al listado
      el.querySelector('#btnVolver')?.addEventListener('click', () => {
        globalThis.UI?.pintarListadoCuentas?.(containerSelector);
      });

      // 4) Botón "Ir a Transacciones" para esta cuenta
      el.querySelector('#btnIrTx')?.addEventListener('click', () => {
        location.hash = `#/transacciones?cuenta=${id}`;
      });

      // Nota: NO hay submit ni PUT aquí (solo lectura).
    } catch (e) {
      el.innerHTML = `<p class="error">Error: ${e.message}</p>`;
    }
  }

  // Exportar al global para que otras partes puedan llamar esta vista
  globalThis.UI = globalThis.UI || {};
  globalThis.UI.pintarEditarCuenta = pintarEditarCuenta;
})();
