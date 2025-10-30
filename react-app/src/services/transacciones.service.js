import apiClient from "./apiClient";

const transaccionesService = {
  async listAll() {
    const { data } = await apiClient.get(`/transacciones`);
    return data;
  },

  // ✅ adaptado a tu backend (usa cuentaOrigen y cuentaDestino)
  async listByCuentaId(cuentaId) {
    const all = await this.listAll();
    if (!Array.isArray(all)) return [];

    return all.filter((t) => {
      const origen = t?.cuentaOrigen?.id === Number(cuentaId);
      const destino = t?.cuentaDestino?.id === Number(cuentaId);
      return origen || destino;
    });
  },

  async getById(id) {
    const { data } = await apiClient.get(`/transacciones/${id}`);
    return data;
  },

  async deposito(cuentaId, monto) {
    const { data } = await apiClient.post(
      `/transacciones/deposito/${cuentaId}`,
      null,
      { params: { monto } }
    );
    return data;
  },

  async retiro(cuentaId, monto) {
    const { data } = await apiClient.post(
      `/transacciones/retiro/${cuentaId}`,
      null,
      { params: { monto } }
    );
    return data;
  },
};

export default transaccionesService;
