# Gestor Bancario — Frontend (Node.js + Express)

Frontend educativo que consume el **REST API Java/Spring** del Gestor Bancario.
Incluye:
- Servidor **Express** que sirve el frontend y reenvía las llamadas al backend.
- Rutas con **Axios + interceptores** (para cumplir la rúbrica).
- Vistas HTML/JS para **Cuentas** y **Transacciones** (listar/crear/depositar/retirar).

---

## Requisitos

- **Node.js 20+**
- **Backend Java/Spring** corriendo en `http://localhost:8080`
  - Endpoints usados:
    - `GET /cuentas`, `GET /cuentas/{id}`, `POST /cuentas/usuario/{usuarioId}`, `DELETE /cuentas/{id}`
    - `GET /transacciones/cuenta/{cuentaId}`, `POST /transacciones/deposito/{cuentaId}?monto=...`, `POST /transacciones/retiro/{cuentaId}?monto=...`

> Si el backend tiene Swagger: `http://localhost:8080/swagger-ui.html`

---

## Configuración (.env)

En la **raíz** del proyecto:

- `.env.example` (plantilla):
API_BASE_URL=http://localhost:8080
PORT=3000

bash
Copiar código

- `.env` (tu entorno local):
API_BASE_URL=http://localhost:8080
PORT=3000

yaml
Copiar código

> `API_BASE_URL` es la URL del backend Spring. `PORT` es el puerto del frontend.

---

## Instalación y ejecución (Frontend)

```bash
# 1) Instalar dependencias
npm install

# 2) Ejecutar en desarrollo (con nodemon)
npm run dev
# Front: http://localhost:3000
Si prefieres sin nodemon:

bash
Copiar código
node app.js
Cómo levantar el Backend (resumen)
Abrir el proyecto Java/Spring en IntelliJ.

Ejecutar la aplicación (botón ▶️).

Verificar que responde en http://localhost:8080.

Ejemplo rápido: abrir http://localhost:8080/cuentas.

Flujos (alcance mínimo)
Cuentas
Listar: http://localhost:3000/#/cuentas

Crear: botón “Crear cuenta” → completa usuarioId y numeroCuenta.

Detalle: botón “Detalle” → muestra los campos (solo lectura).

Nota: el backend actual no expone PUT /cuentas/{id}; por eso el detalle es solo lectura.

Transacciones
Listar por cuenta: en Cuentas → “Ver transacciones”.

Crear transacción:

Depósito y Retiro desde la pantalla de transacciones.

El saldo se actualiza y puedes comprobarlo volviendo a Cuentas.

Axios + Interceptores (requisito)
Cliente Axios con interceptores: src/services/http.js

Rutas Express que usan Axios:

GET /api-ax/cuentas → llama a GET /cuentas en el backend

POST /api-ax/cuentas/usuario/:usuarioId → llama al POST del backend

La UI principal usa fetch, pero las rutas /api-ax/* demuestran el uso de Axios con interceptores y async/await.

Verificación rápida (sin tocar código)
Con backend arriba y el front en http://localhost:3000, abre la Consola (F12 → Console) y ejecuta:

js
Copiar código
// Proxy normal
fetch('/api/cuentas').then(r => r.status)  // 200/304

// Axios + interceptores
fetch('/api-ax/cuentas').then(r => r.status)  // 200
Estructura
bash
Copiar código
gestor-bancario-frontend/
├─ app.js                # servidor Express (sirve estáticos y monta rutas /api y /api-ax)
├─ .env / .env.example
├─ src/
│  ├─ services/
│  │  └─ http.js        # Axios + interceptores
│  └─ routes/
│     ├─ api.js         # (tu proxy/routers existentes hacia backend)
│     └─ cuentas.ax.js  # rutas que usan Axios (GET/POST)
├─ index.html
├─ css/
├─ assets/
└─ js/
   ├─ app.js            # código del navegador (no usa require)
   ├─ services/api.js   # llamadas fetch a /api/*
   └─ components/       # cuentas, transacciones, etc.
Problemas comunes
La página no abre → Asegúrate de ver en terminal:

✅ Frontend (Express) en http://localhost:3000

CORS → No aplica: el navegador llama a tu Express (/api / /api-ax), y Express llama al backend.

“API route not found” → Aparece si llamas a un endpoint que no existe en el backend (p.ej., PUT /cuentas/{id}).




## 🆕 Nueva versión del Frontend — React + Vite (Modernización)

Se desarrolló una versión moderna del frontend utilizando **React 18 + Vite**, reemplazando el renderizado del lado del servidor (Express) por una SPA (Single Page Application) que consume directamente el API REST de Spring Boot.

**Carpeta del nuevo frontend:**  
`./react-app/`

### 🚀 Ejecución

1. Abrir una terminal y ejecutar:
   ```bash
   cd react-app
   npm install
   npm run dev
Abrir en el navegador:
👉 http://localhost:5173

⚙️ Variables de entorno
Crear un archivo .env dentro de react-app con el siguiente contenido:

ini
Copiar código
VITE_API_BASE_URL=http://localhost:8080
💡 Tecnologías utilizadas
React 18 (con Hooks)

React Router v6 (rutas cliente)

Axios (cliente HTTP configurado con baseURL)

Vite (para desarrollo rápido)

Vitest (para pruebas unitarias)

Comunicación directa con el backend Java/Spring (sin servidor Node intermedio)

🧩 Funcionalidades implementadas
Cuentas

Listar todas las cuentas

Crear nuevas cuentas

Ver detalle de una cuenta específica

Transacciones

Listar transacciones por cuenta

Crear depósitos y retiros

Pruebas automáticas

Servicios Axios probados con Vitest (mock API)

📦 Rama de desarrollo
feature/modernize-frontend-react

📸 Evidencias:
Ejecución local: http://localhost:5173

Backend corriendo en: http://localhost:8080

Capturas disponibles en el directorio react-app/estructura.txt si se requieren.