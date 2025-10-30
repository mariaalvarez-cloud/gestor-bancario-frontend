import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import transaccionesService from "../../services/transacciones.service";

export default function TransaccionesList({ reloadSignal }) {
  const { id } = useParams(); // id de la cuenta
  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState("idle"); // idle | loading | success | error
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    try {
      setEstado("loading");
      setMensaje("");
      const data = await transaccionesService.listByCuentaId(id);
      setItems(Array.isArray(data) ? data : []);
      setEstado("success");
    } catch (err) {
      setEstado("error");
      setMensaje(err?.response?.data?.mensaje || err?.message || "Error cargando transacciones");
    }
  }

  useEffect(() => {
    if (id) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reloadSignal]);

  if (estado === "loading") return <p style={{ padding: 16 }}>Cargando transacciones…</p>;
  if (estado === "error") return <p style={{ padding: 16, color: "red" }}>{mensaje}</p>;

  if (!items.length) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Transacciones</h2>
        <p>No hay transacciones para esta cuenta.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Transacciones</h2>
      <ul>
        {items.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <b>{t.tipo}</b> — {t.monto}
            {t.descripcion ? ` — ${t.descripcion}` : ""}
            {t.fecha ? ` — ${new Date(t.fecha).toLocaleString()}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
