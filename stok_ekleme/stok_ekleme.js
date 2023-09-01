const { ipcRenderer } = require('electron');

const mysql = require('mysql2');

let dbcon = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "main_database"
});

//anasayfaya dönüş
document.querySelector('#back-button').addEventListener('click', () => {
    ipcRenderer.send('load-home-page');
});

document.querySelector('#kaydet-button').addEventListener('click', () => {
    let stockCode   = document.querySelector('#kod-text').value;
    let barcode     = document.querySelector('#barcode-text').value;
    let name        = document.querySelector('#isim-text').value;
    let price       = document.querySelector('#fiyat-text').value;
    let tax         = document.querySelector('#kdv-text').value;
    let quantity    = document.querySelector('#miktar-text').value;

    dbcon.connect(function(err) {
        if (err) throw err;
        console.log('Connection successfull');

        let sqlQuery = "INSERT INTO products (barcode, name, price, tax) VALUES (?, ?, ?, ?, ?)";

        dbcon.query(sqlQuery, [stockCode, barcode, name, price, tax], function (err) {
            if (err) throw err;
            console.log("Item added")
        })
    })

});