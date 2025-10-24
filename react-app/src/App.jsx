import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CuentaCreate from "./features/cuentas/CuentaCreate";
import CuentasList from "./features/cuentas/CuentasList";
import CuentaDetail from "./features/cuentas/CuentaDetail";

import TransaccionesList from "./features/transacciones/TransaccionesList";
import TransaccionCreate from "./features/transacciones/TransaccionCreate";

// Wrapper para la ruta de transacciones: maneja el reload de la lista
function TransaccionesRoute() {
  const [reloadTx, setReloadTx] = useState(0);
  return (
    <div>
      <TransaccionCreate onCreated={() => setReloadTx((n) => n + 1)} />
      <TransaccionesList reloadSignal={reloadTx} />
    </div>
  );
}

export default function App() {
  // Señal para refrescar la lista de cuentas al crear una nueva
  const [reloadSignal, setReloadSignal] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home: crear + listar cuentas */}
        <Route
          path="/"
          element={
            <div>
              <CuentaCreate onCreated={() => setReloadSignal((n) => n + 1)} />
              <CuentasList reloadSignal={reloadSignal} />
            </div>
          }
        />

        {/* Detalle de una cuenta */}
        <Route path="/cuentas/:id" element={<CuentaDetail />} />

        {/* Transacciones de una cuenta (form + lista con refresco) */}
        <Route path="/cuentas/:id/transacciones" element={<TransaccionesRoute />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
