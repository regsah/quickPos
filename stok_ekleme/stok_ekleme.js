const { ipcRenderer } = require('electron');

const mysql = require('mysql2');

const dbcon = mysql.createConnection({
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

    //Taking the values from containers
    let stockCode   = document.querySelector('#kod-text').value;
    let barcode     = document.querySelector('#barkod-text').value;
    let name        = document.querySelector('#isim-text').value;
    let price       = document.querySelector('#fiyat-text').value;
    let tax         = document.querySelector('#kdv-text').value;
    let quantity    = document.querySelector('#miktar-text').value;

    //Querying the new item to database
    dbcon.connect(function(err) {
        if (err) throw err;

        console.log('Connection successfull (Stock adding)');

        let sqlQuery = "INSERT INTO products (barcode, product_name, price, tax) VALUES (?, ?, ?, ?)";

        dbcon.query(sqlQuery, [barcode, name, price, tax], function (err) {
            if (err) throw err;
            console.log("Item added");
        });
    });

    document.querySelector('#kod').reset();
    document.querySelector('#barkod').reset();
    document.querySelector('#isim').reset();
    document.querySelector('#fiyat').reset();
    document.querySelector('#kdv').reset();
    document.querySelector('#miktar').reset();


});