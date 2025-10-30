const { Router } = require('express');
const axios = require('axios');

const router = Router();
const API = process.env.API_BASE_URL;

// Normaliza errores de Axios
function wrap(promise) {
  return promise.then(r => r.data).catch(error => {
    const info = {
      status: error.response?.status || 500,
      message: error.response?.data?.mensaje || error.response?.data?.message || error.message,
      data: error.response?.data,
    };
    const e = new Error(info.message);
    e.status = info.status;
    e.data = info.data;
    throw e;
  });
}

/* ===== CUENTAS ===== */
// GET /api/cuentas -> GET /cuentas
router.get('/cuentas', async (req, res, next) => {
  try {
    const data = await wrap(axios.get(`${API}/cuentas`));
    res.json(data);
  } catch (e) { next(e); }
});

// GET /api/cuentas/:id -> GET /cuentas/:id
router.get('/cuentas/:id', async (req, res, next) => {
  try {
    const data = await wrap(axios.get(`${API}/cuentas/${req.params.id}`));
    res.json(data);
  } catch (e) { next(e); }
});

// POST /api/cuentas/usuario/:usuarioId  body: { numeroCuenta }
router.post('/cuentas/usuario/:usuarioId', async (req, res, next) => {
  try {
    const data = await wrap(axios.post(`${API}/cuentas/usuario/${req.params.usuarioId}`, req.body));
    res.status(201).json(data);
  } catch (e) { next(e); }
});

// DELETE /api/cuentas/:id
router.delete('/cuentas/:id', async (req, res, next) => {
  try {
    await wrap(axios.delete(`${API}/cuentas/${req.params.id}`));
    res.status(204).end();
  } catch (e) { next(e); }
});

/* ===== TRANSACCIONES ===== */
// GET /api/transacciones/cuenta/:cuentaId (filtrar en Node)
router.get('/transacciones/cuenta/:cuentaId', async (req, res, next) => {
  try {
    const all = await wrap(axios.get(`${API}/transacciones`));
    const id = Number(req.params.cuentaId);
    const list = (all || []).filter(t => {
      const o = t.cuentaOrigen?.id;
      const d = t.cuentaDestino?.id;
      return o === id || d === id;
    });
    res.json(list);
  } catch (e) { next(e); }
});

// POST /api/transacciones/deposito/:cuentaId?monto=...
router.post('/transacciones/deposito/:cuentaId', async (req, res, next) => {
  try {
    const { cuentaId } = req.params;
    const { monto } = req.query; // o req.body.monto si prefieres
    const data = await wrap(axios.post(`${API}/transacciones/deposito/${cuentaId}?monto=${monto}`));
    res.status(201).json(data);
  } catch (e) { next(e); }
});

// POST /api/transacciones/retiro/:cuentaId?monto=...
router.post('/transacciones/retiro/:cuentaId', async (req, res, next) => {
  try {
    const { cuentaId } = req.params;
    const { monto } = req.query;
    const data = await wrap(axios.post(`${API}/transacciones/retiro/${cuentaId}?monto=${monto}`));
    res.status(201).json(data);
  } catch (e) { next(e); }
});

// POST /api/transacciones/transferencia?cuentaOrigenId=&cuentaDestinoId=&monto=
router.post('/transacciones/transferencia', async (req, res, next) => {
  try {
    const { cuentaOrigenId, cuentaDestinoId, monto } = req.query;
    const url = `${API}/transacciones/transferencia?cuentaOrigenId=${cuentaOrigenId}&cuentaDestinoId=${cuentaDestinoId}&monto=${monto}`;
    const data = await wrap(axios.post(url));
    res.status(201).json(data);
  } catch (e) { next(e); }
});

module.exports = router;
