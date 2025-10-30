// app.js — servidor Express (CommonJS) con logs de arranque
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');

console.log('🔧 Boot: cargando app.js ...');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Routers (el de /api ya existía en tu proyecto)
let apiRouter = null;
let cuentasAxRouter = null;
try {
  apiRouter = require('./src/routes/api');
  console.log('✅ Router /api cargado');
} catch (e) {
  console.log('ℹ️  Router /src/routes/api NO encontrado (continuamos)');
}
try {
  cuentasAxRouter = require('./src/routes/cuentas.ax');
  console.log('✅ Router /api-ax (Axios) cargado');
} catch (e) {
  console.log('ℹ️  Router /src/routes/cuentas.ax NO encontrado (continuamos)');
}

app.use(morgan('dev'));
app.use(express.json());

// Servir frontend estático (index.html, css, js, assets) desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));
console.log('📦 Static OK ->', path.join(__dirname));

// Montar routers si existen
if (apiRouter) app.use('/api', apiRouter);                 // tu proxy actual
if (cuentasAxRouter) app.use('/api-ax', cuentasAxRouter);  // rutas con Axios+interceptores

// 404 para rutas /api*
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  next();
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('💥 Error middleware:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error inesperado',
    data: err.data || null,
  });
});

// Captura de errores globales (para que no se cierre en silencio)
process.on('uncaughtException', (err) => {
  console.error('💥 uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('💥 unhandledRejection:', reason);
});

console.log('🚀 Iniciando listen en puerto', PORT, '...');
app.listen(PORT, () => {
  console.log(`✅ Frontend (Express) en http://localhost:${PORT}`);
  console.log(`➡️  Proxy API hacia ${process.env.API_BASE_URL || 'http://localhost:8080'}`);
  if (cuentasAxRouter) console.log('🔗 Rutas Axios montadas en /api-ax');
});
