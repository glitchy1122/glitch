// settings-preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('settingsApi', {
  setDefaultBrowser: () => ipcRenderer.send('settings-action', 'set-default-browser')
});

