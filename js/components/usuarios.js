// js/components/usuarios.js
window.renderUsuarios = function(){
  const u = window.ApiService.getAll("usuarios")[0];
  document.getElementById("main-content").innerHTML = `
    <h2>Usuarios</h2>
    <div class="card" style="text-align:left; margin-top:12px; max-width:520px;">
      <label>Nombre:<br><input id="user-nombre" value="${u?.nombre||""}"/></label><br/><br/>
      <label>Email:<br><input id="user-email" type="email" value="${u?.email||""}"/></label><br/><br/>
      <button class="btn btn-secondary" id="save-user">Guardar</button>
    </div>`;
  document.getElementById("save-user").onclick = ()=>{
    const nombre = document.getElementById("user-nombre").value.trim();
    const email  = document.getElementById("user-email").value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("Email inválido");
    window.ApiService.update("usuarios", u.id, { nombre, email });
    showToast("Perfil actualizado");
  };
};
