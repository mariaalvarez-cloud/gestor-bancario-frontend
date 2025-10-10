// js/services/api.js
(function () {
  const API = window.APP_CONFIG?.API_BASE_URL || "http://localhost:8080";
  const ApiService = {
    getAll: (name)=> window.StorageService.getAll(name),
    findById: (name,id)=> window.StorageService.findById(name,id),
    insert: (name,obj)=> window.StorageService.insert(name,obj),
    update: (name,id,patch)=> window.StorageService.update(name,id,patch),
    remove: (name,id)=> window.StorageService.remove(name,id),
    transferir: (payload)=> window.StorageService.transferir(payload),

    // Ejemplo futuro con fetch:
    // async getAll(name){ const r=await fetch(`${API}/${name}`); return r.json(); }
  };
  window.ApiService = ApiService;
})();
