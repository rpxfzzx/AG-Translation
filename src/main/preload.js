const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Store
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  storeSet: (key, value) => ipcRenderer.invoke('store:set', key, value),

  // Window
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  // Network
  isOnline: () => ipcRenderer.invoke('network:isOnline'),

  // Translation
  translateOffline: (text, source, target) =>
    ipcRenderer.invoke('translate:offline', text, source, target),

  // Clipboard
  clipboardWrite: (text) => ipcRenderer.invoke('clipboard:write', text),
  clipboardRead: () => ipcRenderer.invoke('clipboard:read'),

  // Shell
  openExternal: (url) => ipcRenderer.send('shell:openExternal', url),
});
