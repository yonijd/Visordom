let config = {
  active: false,
  fontSize: 11,
  color: '#89b4fa',
  scanParent: true,
  debounceMs: 150
};

let scanTimer = null;
let currentHoveredTarget = null;

// 1. Inyección del Panel Flotante
const panel = document.createElement('div');
panel.id = 'visordom-panel';
panel.innerHTML = `
  <div id="visordom-header">
    <span>🔍 VisorDOM</span>
    <div style="display:flex; align-items:center; gap:8px;">
      <span id="visordom-status" style="font-size:10px;">● ACTIVO</span>
      <button id="visordom-close" style="background:none; border:none; color:#cdd6f4; font-size:14px; font-weight:bold; cursor:pointer; padding:0 2px;">✕</button>
    </div>
  </div>
  <div id="visordom-body">
    <div id="visordom-title">Visor Inactivo</div>
    <hr id="visordom-hr" style="border:0; border-top:1px solid #45475a; margin:6px 0;">
    <div id="visordom-snippet">Actívalo desde las opciones de la extensión para iniciar.</div>
  </div>
`;

Object.assign(panel.style, {
  position: 'fixed', top: '20px', right: '20px', width: '320px', height: '180px',
  minWidth: '200px', minHeight: '100px', padding: '0', background: '#1e1e2e',
  color: '#cdd6f4', border: '1px solid ' + config.color, borderRadius: '8px',
  zIndex: '999999', boxShadow: '0 4px 15px rgba(0,0,0,0.6)', fontFamily: 'monospace',
  display: 'none', flexDirection: 'column', resize: 'both', overflow: 'hidden'
});

const styleSheet = document.createElement("style");
document.head.appendChild(styleSheet);
document.body.appendChild(panel);

function applyStyles() {
  panel.style.display = config.active ? 'flex' : 'none';
  panel.style.borderColor = config.color;
  
  styleSheet.innerText = `
    #visordom-header {
      background: #313244; padding: 6px 10px; cursor: move; font-weight: bold;
      display: flex; justify-content: space-between; align-items: center; user-select: none;
      border-bottom: 1px solid #45475a; color: ${config.color};
    }
    #visordom-close:hover { color: #f38ba8 !important; }
    #visordom-body { padding: 10px; flex: 1; overflow-y: auto; font-size: ${config.fontSize}px; }
    #visordom-title { font-weight: bold; color: ${config.color}; word-break: break-word; }
    #visordom-snippet { color: #bac2de; white-space: pre-wrap; word-break: break-word; margin-top: 4px; }
  `;
}

// 2. Cargar configuración inicial (Default inactivo)
chrome.storage.local.get(config, (saved) => {
  config = saved;
  applyStyles();
});

// Listener para cambios en caliente desde el popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_CONFIG') {
    config = message.config;
    applyStyles();
  }
});

// Botón "X" de Cierre (Oculta la ventana y desactiva el visor)
document.getElementById('visordom-close').addEventListener('click', () => {
  config.active = false;
  applyStyles();
  chrome.storage.local.set({ active: false });
});

// 3. Arrastre de Ventana (Drag & Drop)
const header = document.getElementById('visordom-header');
let isDragging = false, offsetX = 0, offsetY = 0;

header.addEventListener('mousedown', (e) => {
  if (e.target.id === 'visordom-close') return; // Evitar arrastre si clic en X
  isDragging = true;
  offsetX = e.clientX - panel.offsetLeft;
  offsetY = e.clientY - panel.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  panel.style.left = `${e.clientX - offsetX}px`;
  panel.style.top = `${e.clientY - offsetY}px`;
  panel.style.right = 'auto';
});

document.addEventListener('mouseup', () => isDragging = false);

// 4. Lógica de Escaneo en 2 Etapas
document.addEventListener('mouseover', (e) => {
  if (!config.active || panel.contains(e.target)) return;

  const target = e.target;
  currentHoveredTarget = target;

  // --- ETAPA 1: Lectura Instantánea ---
  const textoDirecto = target.innerText ? target.innerText.trim() : '';
  if (textoDirecto.length > 0) {
    mostrarEnPanel(textoDirecto, false);
  }

  // --- ETAPA 2: Escaneo Profundo Asíncrono ---
  clearTimeout(scanTimer);

  if (config.scanParent) {
    scanTimer = setTimeout(() => {
      if (currentHoveredTarget === target) {
        escaneoProfundoContenedor(target);
      }
    }, config.debounceMs);
  }
}, { passive: true });

function escaneoProfundoContenedor(nodo) {
  let contenedor = nodo.closest('li, [role="option"], [role="button"], article, .search-result-item, div');
  
  while (contenedor && contenedor.parentElement && contenedor.innerText.trim().length < 50 && contenedor.tagName !== 'BODY') {
    contenedor = contenedor.parentElement;
  }

  if (contenedor && contenedor.innerText.trim().length > 0) {
    mostrarEnPanel(contenedor.innerText.trim(), true);
  }
}

function mostrarEnPanel(texto, esProfundo) {
  const lineas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const titulo = lineas[0] || "Nodo Detectado";
  const resto = lineas.slice(1).join('\n');

  document.getElementById('visordom-title').innerText = (esProfundo ? "🔍 " : "") + titulo;
  document.getElementById('visordom-snippet').innerText = resto.length > 0 ? resto : titulo;
}