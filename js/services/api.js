// js/services/api.js (versión sin módulos, expone globalThis.Api)
(function () {
  const API_BASE = '/api';

  // ---------- Cuentas ----------
  async function getCuentas() {
    const res = await fetch(`${API_BASE}/cuentas`);
    if (!res.ok) throw new Error('Error al listar cuentas');
    return res.json();
  }

  async function getCuenta(id) {
    const res = await fetch(`${API_BASE}/cuentas/${id}`);
    if (!res.ok) throw new Error('Error al obtener cuenta');
    return res.json();
  }

  async function crearCuenta(usuarioId, numeroCuenta) {
    const res = await fetch(`${API_BASE}/cuentas/usuario/${usuarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numeroCuenta })
    });
    if (!res.ok) {
      let err = 'Error al crear cuenta';
      try { const j = await res.json(); err = j.message || err; } catch {}
      throw new Error(err);
    }
    return res.json();
  }

  async function actualizarCuenta(id, payload) {
    const res = await fetch(`${API_BASE}/cuentas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      let err = 'Error al actualizar cuenta';
      try { const j = await res.json(); err = j.message || err; } catch {}
      throw new Error(err);
    }
    return res.json();
  }

  async function eliminarCuenta(id) {
    const res = await fetch(`${API_BASE}/cuentas/${id}`, { method: 'DELETE' });
    // algunos backends responden 204 sin body
    if (!res.ok && res.status !== 204) throw new Error('Error al eliminar cuenta');
    return true;
  }

  // ---------- Transacciones ----------
  async function listarTransaccionesPorCuenta(cuentaId) {
    const res = await fetch(`${API_BASE}/transacciones/cuenta/${cuentaId}`);
    if (!res.ok) throw new Error('Error al listar transacciones');
    return res.json();
  }

  async function depositar(cuentaId, monto) {
    const res = await fetch(`${API_BASE}/transacciones/deposito/${cuentaId}?monto=${monto}`, {
      method: 'POST'
    });
    if (!res.ok) {
      let err = 'Error al depositar';
      try { const j = await res.json(); err = j.message || err; } catch {}
      throw new Error(err);
    }
    return res.json();
  }

  async function retirar(cuentaId, monto) {
    const res = await fetch(`${API_BASE}/transacciones/retiro/${cuentaId}?monto=${monto}`, {
      method: 'POST'
    });
    if (!res.ok) {
      let err = 'Error al retirar';
      try { const j = await res.json(); err = j.message || err; } catch {}
      throw new Error(err);
    }
    return res.json();
  }

  async function transferir(cuentaOrigenId, cuentaDestinoId, monto) {
    const url = `${API_BASE}/transacciones/transferencia?cuentaOrigenId=${cuentaOrigenId}&cuentaDestinoId=${cuentaDestinoId}&monto=${monto}`;
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      let err = 'Error al transferir';
      try { const j = await res.json(); err = j.message || err; } catch {}
      throw new Error(err);
    }
    return res.json();
  }

  // ---------- Exportar al global ----------
  const g = (typeof globalThis !== 'undefined')
    ? globalThis
    : (typeof window !== 'undefined' ? window : this);

  g.Api = {
    // Cuentas
    getCuentas,
    getCuenta,
    crearCuenta,
    actualizarCuenta,
    eliminarCuenta,
    // Transacciones
    listarTransaccionesPorCuenta,
    depositar,
    retirar,
    transferir,
  };
})();
