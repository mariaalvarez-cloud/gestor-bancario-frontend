// app.js — servidor Express (CommonJS)
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Routers (el de /api ya existía en tu proyecto)
let apiRouter = null;
let cuentasAxRouter = null;
try { apiRouter = require('./src/routes/api'); } catch (_) {}
try { cuentasAxRouter = require('./src/routes/cuentas.ax'); } catch (_) {}

app.use(morgan('dev'));
app.use(express.json());

// Servir tu frontend estático (index.html, css, js, assets) desde la raíz
app.use(express.static(path.join(__dirname)));

// Montar routers si existen
if (apiRouter) app.use('/api', apiRouter);           // tu proxy actual
if (cuentasAxRouter) app.use('/api-ax', cuentasAxRouter); // rutas con Axios+interceptores

// 404 para rutas /api*
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  next();
});

// Manejador de errores
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error inesperado',
    data: err.data || null,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Frontend (Express) en http://localhost:${PORT}`);
  console.log(`➡️  Proxy API hacia ${process.env.API_BASE_URL || 'http://localhost:8080'}`);
  if (cuentasAxRouter) console.log('🔗 Rutas Axios montadas en /api-ax');
});
