const { app, BrowserWindow, ipcMain, Tray, Menu, clipboard, nativeImage } = require('electron');
const path = require('path');
const { initOfflineEngine, translateOffline } = require('./offline');
const { initStore, getStore, setStore } = require('./store');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 600,
    resizable: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../../build/icon.png'),
  });

  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('AG Translation');

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow && mainWindow.show() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => { mainWindow && mainWindow.show(); });
}

// ============== IPC Handlers ==============

// Store operations
ipcMain.handle('store:get', (_, key) => getStore(key));
ipcMain.handle('store:set', (_, key, value) => setStore(key, value));

// Window controls
ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window:close', () => mainWindow?.close());

// Offline translation
ipcMain.handle('translate:offline', async (_, text, sourceLang, targetLang) => {
  return translateOffline(text, sourceLang, targetLang);
});

// Clipboard
ipcMain.handle('clipboard:write', (_, text) => clipboard.writeText(text));
ipcMain.handle('clipboard:read', () => clipboard.readText());

// Open external links
ipcMain.on('shell:openExternal', (_, url) => {
  require('electron').shell.openExternal(url);
});

// ============== App Lifecycle ==============

app.whenReady().then(() => {
  initStore();
  initOfflineEngine();
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
