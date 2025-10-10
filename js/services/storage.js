// js/services/storage.js
(function () {
  const NAMESPACE = "gbmiap_v1";
  const SEED = {
    usuarios: [{ id: 1, nombre: "María Alvarez", email: "maria@example.com" }],
    cuentas: [
      { id: 101, alias: "Ahorros 1234", tipo: "Ahorros",  saldo: 12500000 },
      { id: 102, alias: "Corriente 5678", tipo: "Corriente", saldo: 6230000 },
      { id: 103, alias: "Nómina 9012",   tipo: "Ahorros",  saldo: 3100000 }
    ],
    transacciones: []
  };

  function readAll(){ const raw = localStorage.getItem(NAMESPACE); return raw? JSON.parse(raw): null; }
  function writeAll(db){ localStorage.setItem(NAMESPACE, JSON.stringify(db)); }
  function ensureSeed(){ if(!readAll()) writeAll(SEED); }
  function getCol(name){ ensureSeed(); const db = readAll(); return db[name] || []; }
  function setCol(name, arr){ const db = readAll(); db[name]=arr; writeAll(db); }

  const StorageService = {
    getAll: (name)=> getCol(name),
    findById(name, id){ return getCol(name).find(x=> String(x.id)===String(id)) || null; },
    insert(name, obj){ const col=getCol(name); const toSave={...obj,id:Date.now()}; col.push(toSave); setCol(name,col); return toSave; },
    update(name, id, patch){ const col=getCol(name); const i=col.findIndex(x=> String(x.id)===String(id)); if(i<0) return null; col[i]={...col[i],...patch}; setCol(name,col); return col[i]; },
    remove(name, id){ const col=getCol(name); const filtered=col.filter(x=> String(x.id)!==String(id)); setCol(name,filtered); return filtered.length!==col.length; },

    transferir({origenId,destinoId,monto}){
      monto=Number(monto);
      const cuentas=getCol("cuentas");
      const iO=cuentas.findIndex(c=>c.id===Number(origenId));
      const iD=cuentas.findIndex(c=>c.id===Number(destinoId));
      if(iO===-1||iD===-1) throw new Error("Cuenta no encontrada");
      if(origenId===destinoId) throw new Error("Origen y destino no pueden ser la misma cuenta");
      if(monto<=0) throw new Error("Monto inválido");
      if(cuentas[iO].saldo<monto) throw new Error("Saldo insuficiente");
      cuentas[iO].saldo-=monto; cuentas[iD].saldo+=monto; setCol("cuentas",cuentas);
      const tx={ id:Date.now(), tipo:"transferencia", origenId:Number(origenId), destinoId:Number(destinoId), monto, fecha:new Date().toISOString() };
      const txs=getCol("transacciones"); txs.unshift(tx); setCol("transacciones", txs);
      return tx;
    }
  };

  window.StorageService = StorageService;
})();
