import { useState } from "react";
import { useParams } from "react-router-dom";
import transaccionesService from "../../services/transacciones.service";

export default function TransaccionCreate({ onCreated }) {
  const { id } = useParams(); // cuentaId
  const [tipo, setTipo] = useState("DEPOSITO"); // DEPOSITO | RETIRO
  const [monto, setMonto] = useState("");
  const [descripcion] = useState(""); // tu backend no lo usa; lo ignoramos
  const [estado, setEstado] = useState("idle");
  const [mensaje, setMensaje] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!monto || isNaN(Number(monto))) {
      setEstado("error");
      setMensaje("Monto debe ser numérico.");
      return;
    }
    try {
      setEstado("loading");
      setMensaje("");

      const cuentaId = Number(id);
      const value = Number(monto);

      if (tipo === "DEPOSITO") {
        await transaccionesService.deposito(cuentaId, value);
      } else {
        await transaccionesService.retiro(cuentaId, value);
      }

      setEstado("success");
      setMensaje("Transacción creada.");
      setMonto("");

      if (typeof onCreated === "function") onCreated(); // refrescar lista
    } catch (err) {
      setEstado("error");
      const status = err?.response?.status;
      const dataMsg =
        err?.response?.data?.mensaje || err?.response?.data?.error;
      setMensaje(
        dataMsg ||
          (status
            ? `Error HTTP ${status}`
            : err?.message || "Error creando transacción.")
      );
      console.error("TRANSACCION ERROR:", err);
    }
  }

  return (
    <div style={{ padding: 16, borderBottom: "1px solid #ddd", marginBottom: 16 }}>
      <h3>Nueva transacción</h3>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <label>
          Tipo:
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="DEPOSITO">Depósito</option>
            <option value="RETIRO">Retiro</option>
          </select>
        </label>

        <label>
          Monto:
          <input
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            inputMode="decimal"
          />
        </label>

        <button type="submit" disabled={estado === "loading"}>
          {estado === "loading" ? "Guardando…" : "Crear transacción"}
        </button>
      </form>

      {estado === "error" && <p style={{ color: "red" }}>{mensaje}</p>}
      {estado === "success" && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}
