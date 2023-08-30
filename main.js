console.log("it works...");

const electron = require("electron");
const { ipcMain, app, BrowserWindow } = electron;
const path = require("path");
const url = require("url");

let win;

function createWindow() {
    win = new BrowserWindow({
        minHeight: 600,
        minWidth: 800,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'home/home.html'),
        protocol: 'file',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('load-home-page', () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'home/home.html'),
    protocol: 'file',
    slashes: true
  }));
});

ipcMain.on('load-pos-page', () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'pos/pos.html'),
    protocol: 'file',
    slashes: true
  }));
});

ipcMain.on('load-liste-page', () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'stok_liste/stok_liste.html'),
    protocol: 'file',
    slashes: true
  }));
});

ipcMain.on('load-ekleme-page', () => {
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'stok_ekleme/stok_ekleme.html'),
    protocol: 'file',
    slashes: true
  }));
});
