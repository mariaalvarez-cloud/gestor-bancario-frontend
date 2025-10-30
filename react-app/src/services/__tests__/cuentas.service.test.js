import { describe, it, expect, vi, beforeEach } from "vitest";
import cuentasService from "../cuentas.service.js";

// Simulamos el cliente Axios centralizado
vi.mock("../apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

// Importamos el mock que acabamos de definir
import apiClient from "../apiClient.js";

describe("cuentas.service.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería listar las cuentas correctamente", async () => {
    const mockData = [
      { id: 1, numeroCuenta: "1001", saldo: 200 },
      { id: 2, numeroCuenta: "2001", saldo: 400 }
    ];
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await cuentasService.getAll();
    expect(result).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith("/cuentas");
  });

  it("debería crear una cuenta correctamente", async () => {
    const nuevaCuenta = { numeroCuenta: "3001", saldo: 500, usuarioId: 1 };
    const mockResponse = { ...nuevaCuenta, id: 3 };
    apiClient.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await cuentasService.create(nuevaCuenta);
    expect(result).toEqual(mockResponse);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/cuentas/usuario/1",
      nuevaCuenta
    );
  });
});
