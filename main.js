console.log("it works...");

const electron = require("electron");
const { ipcMain, app, BrowserWindow } = electron;
const path = require("path");
const url = require("url");

const mysql = require('mysql2');

let win;

const dbcon = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
});

module.exports = dbcon;

dbcon.connect(function(err) {
  if (err) throw err;
  console.log("Connection successfull");

  let sqlQuery = "CREATE DATABASE IF NOT EXISTS main_database";

  dbcon.query(sqlQuery, function (err) {
      if (err) throw err;
  });

  sqlQuery = "USE main_database";

  dbcon.query(sqlQuery, (error) => {
    if(error) throw error;

    console.log("Using Database");
  })
  
  sqlQuery = "CREATE TABLE IF NOT EXISTS products (stock_id INT AUTO_INCREMENT PRIMARY KEY, barcode INT, product_name VARCHAR(255), price INT, tax INT)";

  dbcon.query(sqlQuery, function (err) {
      if (err) throw err;
  });

  sqlQuery = "CREATE TABLE IF NOT EXISTS basket_log (stock_id INT, barcode INT, product_name VARCHAR(255), price INT, quantity INT)"

  dbcon.query(sqlQuery, function (err) {
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
