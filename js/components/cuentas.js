// js/components/cuentas.js
window.renderCuentas = function(){
  const cuentas = window.ApiService.getAll("cuentas");
  const rows = cuentas.map(c=>`
    <article class="card" style="text-align:left">
      <h4>${c.alias}</h4>
      <p class="account-type">${c.tipo}</p>
      <p><strong>Saldo:</strong> ${formatCurrency(c.saldo)}</p>
      <div style="margin-top:8px">
        <label>Editar alias: <input id="alias-${c.id}" value="${c.alias}" /></label>
        <button class="btn btn-secondary" data-id="${c.id}">Guardar</button>
      </div>
    </article>`).join("");

  document.getElementById("main-content").innerHTML = `
    <h2>Cuentas</h2>
    <div class="accounts-grid" style="margin-top:12px">${rows}</div>
  `;
  document.querySelectorAll(".btn.btn-secondary").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      const input = document.getElementById(`alias-${id}`);
      const alias = input.value.trim();
      if(alias.length<3){ input.setAttribute("aria-invalid","true"); input.focus(); showToast("Alias muy corto (min 3)"); return; }
      input.removeAttribute("aria-invalid");
      window.ApiService.update("cuentas", id, { alias });
      showToast("Alias actualizado");
      window.renderCuentas();
    });
  });
};
