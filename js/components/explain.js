// js/components/explain.js
window.renderExplicacion = function(){
  document.getElementById("main-content").innerHTML = `
    <h2>Explicación técnica</h2>
    <p class="muted">Arquitectura, enrutamiento, datos y cómo migrará a React.</p>
    <section class="card" style="text-align:left; margin-top:16px;">
      <details open>
        <summary><strong>Arquitectura del prototipo</strong></summary>
        <pre style="white-space:pre-wrap; line-height:1.5; margin-top:8px;">
HTML + CSS + JS (sin frameworks)
Router hash en app.js
Vistas en js/components/*
Datos en js/services/:
  - storage.js: mock con localStorage (este prototipo)
  - api.js: stub para futura API (mismo contrato)
        </pre>
      </details>
      <details>
        <summary><strong>Router (70% JS)</strong></summary>
        <p>Escucha <code>hashchange</code> y mapea <code>#/ruta</code> → función de render. Navega sin recargar.</p>
      </details>
      <details>
        <summary><strong>Datos y validaciones (70% JS)</strong></summary>
        <p><code>storage.js</code> inicializa seed, provee CRUD y <code>transferir()</code> con validaciones de saldo y monto.</p>
      </details>
      <details>
        <summary><strong>Preparado para React</strong></summary>
        <p>Los componentes se migran a <code>/src/components</code> y <code>services/</code> se reutiliza. Solo cambia la vista (JSX) y el router.</p>
      </details>
      <details>
        <summary><strong>Despliegue</strong></summary>
        <p>GitHub Pages desde <code>main</code>, con favicons y metadatos OG.</p>
      </details>
    </section>
  `;
};
