// js/components/login.js
window.Auth = {
  isLogged(){ return !!localStorage.getItem("gbmiap_auth"); },
  login(email, password){
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email inválido");
    if(!password || password.length<6) throw new Error("La clave debe tener al menos 6 caracteres");
    localStorage.setItem("gbmiap_auth", JSON.stringify({email, at: Date.now()}));
    return true;
  },
  logout(){ localStorage.removeItem("gbmiap_auth"); }
};

window.renderLogin = function(){
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <h2>Iniciar sesión</h2>
    <div class="card" style="text-align:left; margin:16px auto; max-width:420px;">
      <label>Email<br><input id="login-email" type="email" placeholder="tu@correo.com" autocomplete="username"></label>
      <br><br>
      <label>Contraseña<br><input id="login-pass" type="password" placeholder="••••••" autocomplete="current-password" minlength="6"></label>
      <br><br>
      <button class="btn btn-secondary" id="btn-login">Entrar</button>
    </div>
  `;
  document.getElementById("btn-login").onclick = ()=>{
    const email = document.getElementById("login-email").value.trim();
    const pass  = document.getElementById("login-pass").value;
    try{ window.Auth.login(email, pass); showToast("Sesión iniciada"); location.hash="#/"; }
    catch(e){ showToast(e.message || "Error de inicio de sesión"); }
  };
};
