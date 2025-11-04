// history-preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('historyApi', {
  // Function to ask the "brain" for the history list
  getHistory: () => ipcRenderer.invoke('get-history'),
  
  // Function to tell the "brain" to close this window
  goHome: () => ipcRenderer.send('go-home')
});