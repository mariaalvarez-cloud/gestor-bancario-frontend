import { useState } from "react";
import cuentasService from "../../services/cuentas.service";

export default function CuentaCreate({ onCreated }) {
  const [usuarioId, setUsuarioId] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [saldo, setSaldo] = useState("");
  const [estado, setEstado] = useState("idle"); // idle | loading | success | error
  const [mensaje, setMensaje] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    // Validaciones básicas
    if (!usuarioId.trim() || !numeroCuenta.trim() || saldo === "") {
      setEstado("error");
      setMensaje("Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(Number(saldo))) {
      setEstado("error");
      setMensaje("Saldo debe ser un número.");
      return;
    }

    try {
      setEstado("loading");
      setMensaje("");

      const payload = {
        numeroCuenta: numeroCuenta.trim(),
        saldo: Number(saldo),
        usuarioId: Number(usuarioId),
      };

      const nueva = await cuentasService.create(payload);

      setEstado("success");
      setMensaje(`Cuenta creada: #${nueva.id} (${nueva.numeroCuenta})`);

      // limpiar inputs
      setUsuarioId("");
      setNumeroCuenta("");
      setSaldo("");

      // avisar al padre para refrescar la lista
      if (typeof onCreated === "function") onCreated();
    } catch (err) {
      setEstado("error");
      setMensaje(
        err?.response?.data?.mensaje ||
          err?.message ||
          "Error al crear la cuenta."
      );
    }
  }

  return (
    <div style={{ padding: 16, borderBottom: "1px solid #ddd", marginBottom: 16 }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <label>
          Usuario ID:
          <input
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            inputMode="numeric"
          />
        </label>

        <label>
          Número de cuenta:
          <input
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
          />
        </label>

        <label>
          Saldo inicial:
          <input
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            inputMode="decimal"
          />
        </label>

        <button type="submit" disabled={estado === "loading"}>
          {estado === "loading" ? "Creando…" : "Crear"}
        </button>
      </form>

      {estado === "error" && <p style={{ color: "red" }}>{mensaje}</p>}
      {estado === "success" && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}

