// main.js
const { app, BrowserWindow, session, BrowserView, ipcMain, dialog, net, shell } = require('electron');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// !!! REPLACE THIS WITH YOUR GITHUB URL !!!
const BLOCKLIST_URL = 'https://glitchy1122.github.io/my-browser-blocklist/json';
// HISTORY_FILE will be set after app is ready
let HISTORY_FILE;
// ---------------------

let blockList = new Set();
let mainWindow; // Main UI window
let view; // Web content view

// --- BLOCKLIST LOADER ---
async function loadBlockList() {
  return new Promise((resolve, reject) => {
    try {
      const request = net.request(BLOCKLIST_URL);
      request.on('response', (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          try {
            const domains = JSON.parse(data);
            blockList = new Set(domains);
            console.log(`Blocklist loaded with ${blockList.size} domains.`);
            resolve();
          } catch (error) {
            console.error(`Failed to parse blocklist: ${error.message}`);
            resolve(); // Continue even if parsing fails
          }
        });
      });
      request.on('error', (error) => {
        console.error(`Failed to load blocklist: ${error.message}`);
        resolve(); // Continue even if loading fails
      });
      request.end();
    } catch (error) {
      console.error(`Error in loadBlockList: ${error.message}`);
      resolve(); // Continue even if there's an error
    }
  });
}

// --- CREATE MAIN BROWSER WINDOW ---
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Bridge for index.html
      contextIsolation: true,
      sandbox: true
    }
  });

  // Load the UI (buttons)
  mainWindow.loadFile('index.html');

  // Create the content view
  view = new BrowserView();
  mainWindow.setBrowserView(view);

  // Set view size (50px from top)
  const [width, height] = mainWindow.getSize();
  view.setBounds({ x: 0, y: 50, width: width, height: height - 50 });

  // Resize view with window
  mainWindow.on('resize', () => {
    // Check if mainWindow exists (it might be closing)
    if (mainWindow) {
      const [newWidth, newHeight] = mainWindow.getSize();
      view.setBounds({ x: 0, y: 50, width: newWidth, height: newHeight - 50 });
    }
  });

  // Load default homepage
  view.webContents.loadURL('https://www.google.com');

  // Update omnibox when URL changes
  view.webContents.on('did-navigate', (event, url) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('url-changed', url);
    }
  });

  view.webContents.on('did-navigate-in-page', (event, url) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('url-changed', url);
    }
  });

  // --- TOP-NOTCH FILTER ---
  view.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    const url = new URL(details.url);
    const domain = url.hostname;

    if (blockList.has(domain)) {
      console.log(`BLOCKED: ${domain}`);
      view.webContents.loadFile(path.join(__dirname, 'blocked.html'));
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });

  // --- SAVE HISTORY ---
  view.webContents.on('did-finish-load', () => {
    const url = view.webContents.getURL();
    const title = view.webContents.getTitle();

    if (url.startsWith('file://')) return; // Don't save internal pages

    const historyEntry = {
      url: url,
      title: title,
      date: new Date().toISOString()
    };

    try {
      let history = [];
      if (fs.existsSync(HISTORY_FILE)) {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE));
      }
      history.unshift(historyEntry); // Add to top
      if (history.length > 1000) history = history.slice(0, 1000); // Limit size
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  });

  // --- FIX 2: CLEAN UP WHEN WINDOW IS CLOSED ---
  // This prevents crashes when re-opening the app
  mainWindow.on('closed', () => {
    mainWindow = null;
    view = null;
  });

  // --- DOWNLOAD HANDLER (REMOVED FROM HERE) ---
  // We moved this to the app.whenReady() section (Fix 3)
}

// --- IPC LISTENERS (Communication) ---

// Listen for nav actions (Back, Forward, Reload, History)
ipcMain.on('nav-action', (event, action) => {
  if (action === 'history') {
    // Open History in a new, modal window
    const historyWindow = new BrowserWindow({
      width: 600,
      height: 700,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'history-preload.js'), // Bridge for history.html
        contextIsolation: true,
        sandbox: false
      }
    });
    historyWindow.loadFile('history.html');
    historyWindow.setMenu(null);
  } else if (action === 'settings') {
    // Open Settings window
    showSettingsWindow();
  } else if (typeof action === 'object' && action.type === 'navigate') {
    // Handle URL navigation
    if (view && action.url) {
      view.webContents.loadURL(action.url);
    }
  } else if (view) { // Check if view exists
    // Actions for the web content view
    if (action === 'back') view.webContents.goBack();
    if (action === 'forward') view.webContents.goForward();
    if (action === 'reload') view.webContents.reload();
    if (action === 'home') view.webContents.loadURL('https://www.google.com');
  }
});

// Settings window function
function showSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: 500,
    height: 400,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'settings-preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  });
  
  settingsWindow.loadFile('settings.html');
  settingsWindow.setMenu(null);
}

// Listen for request from history.html
ipcMain.handle('get-history', async () => {
  try {
    if (!HISTORY_FILE) {
      console.warn('HISTORY_FILE not initialized yet');
      return [];
    }
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE);
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to read history:', error);
  }
  return []; // Return empty on error
});

// Listen for get current URL request
ipcMain.on('get-current-url', (event) => {
  if (view) {
    const url = view.webContents.getURL();
    event.sender.send('current-url', url);
  } else {
    event.sender.send('current-url', 'https://www.google.com');
  }
});

// Listen for "Back to Browser" from history.html
ipcMain.on('go-home', (event) => {
  // --- FIX 1: USE 'if (win)' INSTEAD OF '?.' ---
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.close();
  }
});

// --- SET DEFAULT BROWSER FUNCTIONALITY ---

// Listen for settings action
ipcMain.on('settings-action', (event, action) => {
  if (action === 'set-default-browser') {
    setAsDefaultBrowser();
  }
});

// Function to set as default browser
function setAsDefaultBrowser() {
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Try to set as default browser
    try {
      // Set protocol handlers
      const httpSuccess = app.setAsDefaultProtocolClient('http');
      const httpsSuccess = app.setAsDefaultProtocolClient('https');
      
      if (httpSuccess && httpsSuccess) {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Default Browser',
          message: 'Successfully set as default browser!',
          detail: 'This browser is now set as the default for HTTP and HTTPS links.',
          buttons: ['OK']
        });
      } else {
        // Show dialog with instructions to open Windows Settings
        const result = dialog.showMessageBoxSync(mainWindow, {
          type: 'info',
          title: 'Set as Default Browser',
          message: 'This requires administrator privileges.',
          detail: 'Would you like to open Windows Settings to set this browser as default manually?',
          buttons: ['Open Settings', 'Cancel'],
          defaultId: 0
        });
        
        if (result === 0) {
          // Open Windows 10/11 default apps settings
          shell.openExternal('ms-settings:defaultapps');
        }
      }
    } catch (error) {
      console.error('Error setting default browser:', error);
      dialog.showErrorBox('Error', 'Failed to set as default browser. Please try opening Windows Settings manually.');
    }
  } else if (platform === 'darwin') {
    // macOS - Open System Preferences
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles');
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Set as Default Browser',
      message: 'Please select this browser as your default in System Preferences.',
      buttons: ['OK']
    });
  } else {
    // Linux
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Set as Default Browser',
      message: 'Please set this browser as default through your system settings.',
      detail: 'On most Linux distributions, you can do this through Settings > Default Applications.',
      buttons: ['OK']
    });
  }
}

// Handle protocol URLs when app is already running (macOS)
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (view) {
    view.webContents.loadURL(url);
  }
});

// Handle protocol URLs on Windows
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Find if there's a URL in the command line
  const url = commandLine.find(arg => arg.startsWith('http://') || arg.startsWith('https://'));
  if (url && view) {
    view.webContents.loadURL(url);
  }
  // Focus the main window
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// --- APP LIFECYCLE ---

// Make sure only one instance runs
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.whenReady().then(async () => {
  // Initialize HISTORY_FILE after app is ready
  HISTORY_FILE = path.join(app.getPath('userData'), 'history.json');
  
  // Handle protocol arguments on Windows
  if (process.platform === 'win32') {
    // Check if app was launched with a URL argument
    const args = process.argv.slice(1);
    if (args.length > 0 && (args[0].startsWith('http://') || args[0].startsWith('https://'))) {
      if (view) {
        view.webContents.loadURL(args[0]);
      }
    }
  }
  
  await loadBlockList();
  createWindow();

  // --- FIX 3: ATTACH DOWNLOAD HANDLER TO DEFAULT SESSION ---
  // This listener is app-wide and safer than attaching to the view
  session.defaultSession.on('will-download', (event, item, webContents) => {
    // Make sure the download is from our 'view' (web content)
    // and not our UI (index.html) or other windows
    if (view && webContents.id === view.webContents.id) {
      
      const defaultPath = path.join(app.getPath('downloads'), item.getFilename());
      const savePath = dialog.showSaveDialogSync({ defaultPath: defaultPath });

      if (savePath) {
        item.setSavePath(savePath);
        // You can add 'updated' and 'done' listeners here
      } else {
        item.cancel();
      }
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});