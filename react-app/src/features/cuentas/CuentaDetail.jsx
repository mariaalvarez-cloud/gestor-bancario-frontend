import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import cuentasService from "../../services/cuentas.service";

export default function CuentaDetail() {
  const { id } = useParams();
  const [cuenta, setCuenta] = useState(null);
  const [estado, setEstado] = useState("idle"); // idle | loading | success | error
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setEstado("loading");
        setMensaje("");
        const data = await cuentasService.getById(id);
        setCuenta(data);
        setEstado("success");
      } catch (err) {
        setEstado("error");
        setMensaje(err?.message || "Error cargando la cuenta");
      }
    }
    if (id) cargar();
  }, [id]);

  if (estado === "loading") return <p style={{ padding: 16 }}>Cargando cuenta…</p>;
  if (estado === "error") return <p style={{ padding: 16, color: "red" }}>{mensaje}</p>;
  if (!cuenta) return null;

  return (
    <div style={{ padding: 16 }}>
      <h2>Detalle de cuenta</h2>
      <p><b>ID:</b> {cuenta.id}</p>
      <p><b>Número:</b> {cuenta.numeroCuenta}</p>
      <p><b>Saldo:</b> {cuenta.saldo}</p>

      <p style={{ marginTop: 12 }}>
        <Link to={`/cuentas/${cuenta.id}/transacciones`}>Ver transacciones</Link>
      </p>

      <p style={{ marginTop: 12 }}>
        <Link to="/">← Volver</Link>
      </p>
    </div>
  );
}
