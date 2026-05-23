const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');

let server;

function startServer() {
  return new Promise((resolve) => {
    const expressApp = express();
    const distDir = path.join(__dirname, '../dist');
    expressApp.use(express.static(distDir));
    expressApp.use((req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
    server = http.createServer(expressApp);
    server.listen(0, '127.0.0.1', () => {
      resolve(server.address().port);
    });
  });
}

async function createWindow() {
  const port = await startServer();

  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Laptop Buying Guide',
    icon: path.join(__dirname, 'icon.png'),
    show: false,
  });

  win.loadURL(`http://127.0.0.1:${port}`);
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
    app.focus({ steal: true });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
