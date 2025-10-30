import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cuentasService from "../../services/cuentas.service";

export default function CuentasList({ reloadSignal }) {
  const [cuentas, setCuentas] = useState([]);
  const [estado, setEstado] = useState("idle");
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    try {
      setEstado("loading");
      setMensaje("");
      const data = await cuentasService.getAll();
      setCuentas(data || []);
      setEstado("success");
    } catch (err) {
      setEstado("error");
      setMensaje(err?.message || "Error al cargar cuentas");
    }
  }

  useEffect(() => {
    cargar();
  }, [reloadSignal]);

  if (estado === "loading") return <p style={{ padding: 16 }}>Cargando cuentas…</p>;
  if (estado === "error") return <p style={{ padding: 16, color: "red" }}>{mensaje}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Cuentas</h2>
      <p>Total: {cuentas.length}</p>
      <ul>
        {cuentas.map((c) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <Link to={`/cuentas/${c.id}`}>
              {c.id} — {c.numeroCuenta} — Saldo: {c.saldo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

