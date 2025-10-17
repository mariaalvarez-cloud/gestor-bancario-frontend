// js/components/home.js
console.log("Gestor Bancario listo 💜");

// ---------- Utils ----------
function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  const live = document.getElementById("announcer");
  if (live) live.textContent = msg;
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 1800);
}

function formatCurrency(n) {
  return Number(n).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

// ---------- Home ----------
function renderHome() {
  // Antes se usaba ApiService.getAll (que no existe en nuestro flujo actual).
  // Lo dejamos con un "fallback" vacío para NO romper el Home.
  const cuentas =
    globalThis.ApiService && typeof globalThis.ApiService.getAll === "function"
      ? globalThis.ApiService.getAll("cuentas")
      : [];

  const cards = cuentas
    .map(
      (c) => `
    <article class="card account-card">
      <h4>${c.alias ?? "Cuenta"}</h4>
      <p class="account-type">${c.tipo ?? "-"}</p>
      <p class="account-balance">${formatCurrency(c.saldo ?? 0)}</p>
      <div class="account-actions">
        <button class="btn btn-secondary" data-action="transferir" data-id="${c.id}">Transferir</button>
        <button class="btn btn-ghost" data-action="ver-mov" data-id="${c.id}">Ver movimientos</button>
      </div>
    </article>`
    )
    .join("");

  document.getElementById("main-content").innerHTML = `
    <section class="promo"><h3>💜 Logra tus sueños financieros con confianza.</h3></section>
    <section class="home-grid">
      <div class="quick-actions">
        <h3 class="section-title">⚡ Acciones rápidas</h3>
        <div class="qa-grid">
          <button id="action-transferir" class="qa-card"><span>Transferir</span></button>
          <button id="action-depositar" class="qa-card"><span>Depositar</span></button>
          <button id="action-retirar" class="qa-card"><span>Retirar</span></button>
        </div>
      </div>
      <div class="accounts">
        <h3 class="section-title">🔹 Resumen de cuentas</h3>
        <div class="accounts-grid">${cards}</div>
      </div>
    </section>
  `;

  document.getElementById("action-transferir").onclick = () =>
    (location.hash = "#/transacciones?action=transferir");
  document.getElementById("action-depositar").onclick = () =>
    showToast("Prototipo: Depositar");
  document.getElementById("action-retirar").onclick = () =>
    showToast("Prototipo: Retirar");

  document.querySelectorAll(".account-actions .btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      const { action, id } = e.currentTarget.dataset;
      if (action === "transferir") location.hash = `#/transacciones?from=${id}`;
      if (action === "ver-mov") showToast("Prototipo: Ver movimientos");
    });
  });
}

// ---------- Router ----------
const routes = {
  "": renderHome,
  "#/": renderHome,
  "#/home": renderHome,

  // Antes: window.renderCuentas()  -> no existe.
  // Ahora: usamos el componente que expusimos: UI.pintarListadoCuentas
  "#/cuentas": () => {
    if (globalThis.UI?.pintarListadoCuentas) {
      globalThis.UI.pintarListadoCuentas("#main-content");
    } else {
      console.error("UI.pintarListadoCuentas no está definido");
      showToast("Vista de Cuentas no disponible.");
    }
  },

  // Mantengo las demás rutas como estaban (puedes adaptarlas luego):
  "#/login": () => globalThis.renderLogin?.(),
  "#/transacciones": () => globalThis.renderTransacciones?.(),
  "#/usuarios": () => globalThis.renderUsuarios?.(),
  "#/explicacion": () => globalThis.renderExplicacion?.(),
};

function requireAuth(hash) {
  const open = new Set(["#/login", "#/explicacion"]);
  if (open.has(hash)) return true;
  if (!globalThis.Auth?.isLogged?.()) {
    location.hash = "#/login";
    return false;
  }
  return true;
}

function navigate() {
  const raw = location.hash || "#/";
  const hash = raw.split("?")[0];
  if (!requireAuth(hash)) return;
  const view = routes[hash] || renderHome;
  view();
}

function attachNav() {
  const get = (id) => document.getElementById(id);
  get("btnHome")?.addEventListener("click", () => (location.hash = "#/"));
  get("btnCuentas")?.addEventListener("click", () => (location.hash = "#/cuentas"));
  get("btnTransacciones")?.addEventListener("click", () => (location.hash = "#/transacciones"));
  get("btnUsuarios")?.addEventListener("click", () => (location.hash = "#/usuarios"));
  get("btnLogout")?.addEventListener("click", () => {
    globalThis.Auth?.logout?.();
    showToast("Sesión cerrada");
    location.hash = "#/login";
  });

  // bottom nav
  document.getElementById("bn-transferir")?.addEventListener("click", () => (location.hash = "#/transacciones?action=transferir"));
  document.getElementById("bn-depositar")?.addEventListener("click", () => showToast("Prototipo: Depositar"));
  document.getElementById("bn-retirar")?.addEventListener("click", () => showToast("Prototipo: Retirar"));
}

globalThis.addEventListener("hashchange", navigate);
document.addEventListener("DOMContentLoaded", () => {
  attachNav();
  if (!location.hash) location.hash = "#/";
  navigate();
});

// ---------- Exponer utilidades ----------
globalThis.showToast = showToast;
globalThis.formatCurrency = formatCurrency;

// ---------- Puente de compatibilidad ----------
// Si en alguna parte del código viejo llaman window.renderCuentas(),
// lo redirigimos a la nueva función del componente:
globalThis.renderCuentas = function () {
  if (globalThis.UI?.pintarListadoCuentas) {
    globalThis.UI.pintarListadoCuentas("#main-content");
  } else {
    console.error("UI.pintarListadoCuentas no está definido");
    showToast("Vista de Cuentas no disponible.");
  }
};
