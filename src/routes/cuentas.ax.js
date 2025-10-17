// src/routes/cuentas.ax.js (CommonJS)
const { Router } = require("express");
const { http } = require("../services/http");

const router = Router();

// GET /api-ax/cuentas
router.get("/cuentas", async (req, res, next) => {
  try {
    const r = await http.get("/cuentas");
    res.status(r.status).json(r.data);
  } catch (err) {
    next(err);
  }
});

// POST /api-ax/cuentas/usuario/:usuarioId  body: { numeroCuenta }
router.post("/cuentas/usuario/:usuarioId", async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const { numeroCuenta } = req.body;
    if (!numeroCuenta) return res.status(400).json({ message: "numeroCuenta requerido" });
    const r = await http.post(`/cuentas/usuario/${usuarioId}`, { numeroCuenta });
    res.status(r.status).json(r.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
