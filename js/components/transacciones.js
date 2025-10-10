// js/components/transacciones.js
window.renderTransacciones = function(){
  const params = new URLSearchParams((location.hash.split("?")[1]||""));
  const cuentas = window.ApiService.getAll("cuentas");
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <h2>Transacciones</h2>
    <div class="card" style="text-align:left; margin-top:12px">
      <ol style="margin-left:18px">
        <li><strong>Origen</strong></li>
        <li><strong>Destino</strong></li>
        <li><strong>Confirmación</strong></li>
      </ol>
      <div id="tx-step" style="margin-top:16px"></div>
    </div>
  `;
  const state = { origenId: params.get("from")||"", destinoId:"", monto:"" };

  function step1(){
    const opts = cuentas.map(c=>`<option value="${c.id}" ${String(c.id)===String(state.origenId)?"selected":""}>${c.alias} — ${formatCurrency(c.saldo)}</option>`).join("");
    document.getElementById("tx-step").innerHTML = `
      <h3>Paso 1 — Selecciona cuenta origen</h3>
      <select id="sel-origen"><option value="">Elige una cuenta…</option>${opts}</select>
      <button class="btn btn-secondary" id="go-2" style="margin-left:8px">Continuar</button>`;
    document.getElementById("go-2").onclick = ()=>{
      state.origenId = document.getElementById("sel-origen").value;
      if(!state.origenId) return showToast("Selecciona una cuenta de origen");
      step2();
    };
  }
  function step2(){
    const opts = cuentas.filter(c=> String(c.id)!==String(state.origenId))
      .map(c=>`<option value="${c.id}">${c.alias} — ${formatCurrency(c.saldo)}</option>`).join("");
    document.getElementById("tx-step").innerHTML = `
      <h3>Paso 2 — Destino y monto</h3>
      <label>Destino: <select id="sel-destino"><option value="">Elige destino…</option>${opts}</select></label>
      <label style="margin-left:12px">Monto (COP): <input id="inp-monto" type="number" min="1" step="1" placeholder="100000" /></label>
      <div style="margin-top:10px">
        <button class="btn btn-ghost" id="back-1">Atrás</button>
        <button class="btn btn-secondary" id="go-3" style="margin-left:8px">Continuar</button>
      </div>`;
    document.getElementById("back-1").onclick = step1;
    document.getElementById("go-3").onclick = ()=>{
      state.destinoId = document.getElementById("sel-destino").value;
      state.monto = document.getElementById("inp-monto").value;
      if(!state.destinoId) return showToast("Selecciona una cuenta destino");
      if(state.origenId===state.destinoId) return showToast("Origen y destino no pueden ser la misma cuenta");
      const monto = Number(state.monto);
      if(!monto || monto<=0) return showToast("Monto inválido");
      const origen = cuentas.find(c=> String(c.id)===String(state.origenId));
      if(origen.saldo < monto) return showToast("Saldo insuficiente");
      step3();
    };
  }
  function step3(){
    const origen = cuentas.find(c=> String(c.id)===String(state.origenId));
    const destino = cuentas.find(c=> String(c.id)===String(state.destinoId));
    const monto = Number(state.monto);
    document.getElementById("tx-step").innerHTML = `
      <h3>Paso 3 — Confirmación</h3>
      <p>Vas a transferir <strong>${formatCurrency(monto)}</strong></p>
      <p><strong>Desde:</strong> ${origen.alias}</p>
      <p><strong>Hacia:</strong> ${destino.alias}</p>
      <div style="margin-top:10px">
        <button class="btn btn-ghost" id="back-2">Atrás</button>
        <button class="btn btn-secondary" id="confirm">Confirmar</button>
      </div>`;
    document.getElementById("back-2").onclick = step2;
    document.getElementById("confirm").onclick = ()=>{
      try{
        window.ApiService.transferir({ origenId:Number(state.origenId), destinoId:Number(state.destinoId), monto:Number(state.monto) });
        showToast("Transferencia realizada");
        location.hash = "#/"; // volver al Home
      }catch(e){ showToast(e.message || "Error en la transferencia"); }
    };
  }
  step1();
};
