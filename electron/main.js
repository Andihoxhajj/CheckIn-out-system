const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;
let backendProcess;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 882,
    minWidth: 1180,
    minHeight: 720,
    backgroundColor: '#0f172a',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Villa Manager',
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev && process.env.FRONTEND_DEV_URL) {
    mainWindow.loadURL(process.env.FRONTEND_DEV_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const prodPath = url.pathToFileURL(
      path.join(__dirname, '../app/frontend/dist/index.html'),
    ).href;
    mainWindow.loadURL(prodPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const startBackend = () => {
  if (isDev) return;
  const serverPath = path.join(__dirname, '../app/backend/dist/server.js');
  backendProcess = spawn(process.execPath, [serverPath], {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
    detached: false,
  });

  backendProcess.on('error', (err) => {
    dialog.showErrorBox('Backend Error', err.message);
  });
};

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

