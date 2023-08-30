console.log("it works...");

const electron = require("electron");
const { ipcMain, app, BrowserWindow } = electron;
const path = require("path");
const url = require("url");

const mysql = require('mysql');

let win;

let dbcon = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "main_database"
});

dbcon.connect(function(err) {
  if (err) throw err;
  console.log("Connection successfull");

  let sqlQuery = "CREATE DATABASE [IF NOT EXISTS] main_database";

  dbcon.query(sqlQuery, barcode, function (err, result) {
      if (err) throw err;
  });

  
  sqlQuery = "CREATE TABLE [IF NOT EXISTS] products (stock_id INT AUTO_INCREMENT PRIMARY KEY, barcode VARCHAR(255), product_name VARCHAR(255), price VARCHAR(255), tax VARCHAR(255))";

  dbcon.query(sqlQuery, barcode, function (err, result) {
      if (err) throw err;
  });

  sqlQuery = "CREATE TABLE [IF NOT EXISTS] basket_log (stock_id VARCHAR(255), barcode VARCHAR(255), product_name VARCHAR(255), price VARCHAR(255), quantity VARCHAR(255))"

  dbcon.query(sqlQuery, barcode, function (err, result) {
    if (err) throw err;
  }); 
});

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
