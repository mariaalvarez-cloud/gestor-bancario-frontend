console.log("Gestor Bancario listo 💜");

// --- Datos de ejemplo (luego se reemplazan por API) ---
const cuentasDemo = [
  { alias: "Ahorros 1234", saldo: "$12.500.000", tipo: "Ahorros" },
  { alias: "Corriente 5678", saldo: "$6.230.000", tipo: "Corriente" },
  { alias: "Nómina 9012", saldo: "$3.100.000", tipo: "Ahorros" }
];

// --- Utilidad: Toast simple ---
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
// Barra inferior (prototipo)
document.addEventListener("DOMContentLoaded", () => {
  const map = {
    "bn-transferir": "Prototipo: Transferir",
    "bn-depositar": "Prototipo: Depositar",
    "bn-retirar": "Prototipo: Retirar"
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => showToast(map[id]));
  });
});

// --- Render Home ---
function renderHome() {
  const main = document.getElementById("main-content");
  const cuentasHTML = cuentasDemo.map(c => `
    <article class="card account-card">
      <h4>${c.alias}</h4>
      <p class="account-type">${c.tipo}</p>
      <p class="account-balance">${c.saldo}</p>
      <div class="account-actions">
        <button class="btn btn-secondary" data-action="transferir">Transferir</button>
        <button class="btn btn-ghost" data-action="ver-mov">Ver movimientos</button>
      </div>
    </article>
  `).join("");

  main.innerHTML = `
    <section class="promo">
      <h3>💜 Logra tus sueños financieros con confianza.</h3>
    </section>

    <section class="home-grid">
      <div class="quick-actions">
        <h3 class="section-title">⚡ Acciones rápidas</h3>
        <div class="qa-grid">
          <button id="action-transferir" class="qa-card">
            <span>Transferir</span>
          </button>
          <button id="action-depositar" class="qa-card">
            <span>Depositar</span>
          </button>
          <button id="action-retirar" class="qa-card">
            <span>Retirar</span>
          </button>
        </div>
      </div>

      <div class="accounts">
        <h3 class="section-title">🔹 Resumen de cuentas</h3>
        <div class="accounts-grid">
          ${cuentasHTML}
        </div>
      </div>
    </section>
  `;

  // Eventos de quick actions (prototipo)
  document.getElementById("action-transferir").addEventListener("click", () => showToast("Prototipo: Transferir"));
  document.getElementById("action-depositar").addEventListener("click", () => showToast("Prototipo: Depositar"));
  document.getElementById("action-retirar").addEventListener("click", () => showToast("Prototipo: Retirar"));

  // Eventos de acciones por cuenta (delegación)
  document.querySelectorAll(".account-actions .btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      if (action === "transferir") showToast("Prototipo: Transferir desde esta cuenta");
      if (action === "ver-mov") showToast("Prototipo: Ver movimientos");
    });
  });
}

// --- Navegación superior ---
function attachNav() {
  document.getElementById("btnHome").addEventListener("click", renderHome);
  document.getElementById("btnCuentas").addEventListener("click", () => window.renderCuentas());
  document.getElementById("btnTransacciones").addEventListener("click", () => window.renderTransacciones());
  document.getElementById("btnUsuarios").addEventListener("click", () => window.renderUsuarios());
}

// --- Inicio por defecto ---
document.addEventListener("DOMContentLoaded", () => {
  attachNav();
  renderHome();
});
