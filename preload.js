// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose secure functions to index.html
contextBridge.exposeInMainWorld('api', {
  goBack: () => ipcRenderer.send('nav-action', 'back'),
  goForward: () => ipcRenderer.send('nav-action', 'forward'),
  goHome: () => ipcRenderer.send('nav-action', 'home'),
  reload: () => ipcRenderer.send('nav-action', 'reload'),
  showHistory: () => ipcRenderer.send('nav-action', 'history'),
  showSettings: () => ipcRenderer.send('nav-action', 'settings'),
  setDefaultBrowser: () => ipcRenderer.send('settings-action', 'set-default-browser'),
  navigateTo: (url) => ipcRenderer.send('nav-action', { type: 'navigate', url: url }),
  getCurrentUrl: (callback) => {
    ipcRenderer.send('get-current-url');
    ipcRenderer.once('current-url', (event, url) => callback(url));
  },
  onUrlChange: (callback) => {
    ipcRenderer.on('url-changed', (event, url) => callback(url));
  }
});