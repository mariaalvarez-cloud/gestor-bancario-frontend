import apiClient from "./apiClient";

const cuentasService = {
  async getAll() {
    const response = await apiClient.get("/cuentas");
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/cuentas/${id}`);
    return response.data;
  },

  async create(cuenta) {
    const response = await apiClient.post(`/cuentas/usuario/${cuenta.usuarioId}`, cuenta);
    return response.data;
  }
};

export default cuentasService;

