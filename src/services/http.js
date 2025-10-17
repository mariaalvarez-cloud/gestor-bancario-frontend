// src/services/http.js (CommonJS)
const axios = require("axios");

const baseURL = process.env.API_BASE_URL || "http://localhost:8080";
const http = axios.create({ baseURL, timeout: 10000 });

http.interceptors.request.use(
  (config) => {
    // Ej: config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      (data && (data.message || data.error)) ||
      error?.message ||
      "Error comunicándose con el API";
    const err = new Error(message);
    err.status = status;
    err.data = data;
    throw err;
  }
);

module.exports = { http };
