document.addEventListener('DOMContentLoaded', () => {
  const visorActive = document.getElementById('visorActive');
  const fontSize = document.getElementById('fontSize');
  const accentColor = document.getElementById('accentColor');
  const scanParent = document.getElementById('scanParent');
  const debounceMs = document.getElementById('debounceMs');
  const debounceContainer = document.getElementById('debounceContainer');
  const btnSave = document.getElementById('btnSave');

  // Cargar opciones guardadas (Predeterminado: active = false)
  chrome.storage.local.get({
    active: false,
    fontSize: 11,
    color: '#89b4fa',
    scanParent: true,
    debounceMs: 150
  }, (cfg) => {
    visorActive.checked = cfg.active;
    fontSize.value = cfg.fontSize;
    accentColor.value = cfg.color;
    scanParent.checked = cfg.scanParent;
    debounceMs.value = cfg.debounceMs;
    toggleDebounceUI(cfg.scanParent);
  });

  scanParent.addEventListener('change', () => toggleDebounceUI(scanParent.checked));

  function toggleDebounceUI(enabled) {
    if (enabled) {
      debounceContainer.classList.remove('disabled');
      debounceMs.disabled = false;
    } else {
      debounceContainer.classList.add('disabled');
      debounceMs.disabled = true;
    }
  }

  // Guardar y notificar al script inyectado
  btnSave.addEventListener('click', () => {
    const newConfig = {
      active: visorActive.checked,
      fontSize: parseInt(fontSize.value, 10),
      color: accentColor.value,
      scanParent: scanParent.checked,
      debounceMs: parseInt(debounceMs.value, 10)
    };

    chrome.storage.local.set(newConfig, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE_CONFIG', config: newConfig });
        }
      });
      window.close();
    });
  });
});