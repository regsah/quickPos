const { ipcRenderer } = require('electron');

const mysql = require('mysql2');

const dbcon = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "main_database"
});

function itemObject(itemCode, itemBarcode, itemName, itemVal, itemKDV) {
    return {
        itemCode: itemCode,
        itemBarcode: itemBarcode,
        itemName: itemName,
        itemVal: itemVal,
        itemKDV: itemKDV
    };
}

function createItemHTML(item, idCount) {
    return `
    <div class="items-container">
        <p id="kod-${idCount}" class="item-text kod-text">${item.itemCode}</p>
        <p id="barkod-${idCount}" class="item-text barkod-text">${item.itemBarcode}</p>
        <p id="isim-${idCount}" class="item-text isim-text">${item.itemName}</p>
        <p id="fiyat-${idCount}" class="item-text fiyat-text">${item.itemVal}</p>
        <p id="kdv-${idCount}" class="item-text kdv-text">${item.itemKDV}</p>
    </div>`;
}

//function barcodeSearch(text, dbcon) {

//};

const rightContainer = document.querySelector('#right-container');
const itemLabels = `
    <div class="items-container item-labels">
        <p id="kod-label" class="item-text kod-text">Stok Kodu</p>
        <p id="barkod-label" class="item-text barkod-text">Barkod</p>
        <p id="isim-label" class="item-text isim-text">İsim</p>
        <p id="fiyat-label" class="item-text fiyat-text">Fiyat</p>
        <p id="kdv-label" class="item-text kdv-text">KDV</p>
    </div>`;


document.querySelector('#urun-button').addEventListener('click', (event) => {
    event.preventDefault();

    //Getting the values from the containers
    let nameText = document.querySelector('#urun-text').value;
    let barcodeText = document.querySelector('#barkod-text').value;

    let foundItems = [];

    let idCount = 0;
    rightContainer.innerHTML = "";

    let newHTML = itemLabels + "\n\n";

    //Checking if barcode text is filled if so search by barcode
    //if not search by the product name
    if (barcodeText != '') {
        dbcon.connect(function(err) {
            if (err) throw err;
            console.log('Connection successfull');
    
            let sqlQuery = "SELECT * FROM products WHERE barcode = ?";
    
            dbcon.query(sqlQuery, barcodeText, function (err, result) {
                if (err) throw err;

                result.forEach(row => {
                    foundItems.push(itemObject( row.stock_id.toString(), row.barcode.toString(), row.product_name.toString(), 
                                                row.price.toString(), row.tax.toString()));
                });

                foundItems.forEach(item => {
                    newHTML += createItemHTML(item, idCount);
                    ++idCount;
                });

                rightContainer.innerHTML = newHTML;
            });
        });
    }
    else {
        dbcon.connect(function(err) {
            if (err) throw err;
            console.log('Connection successfull');
    
            let sqlQuery = "SELECT * FROM products WHERE barcode LIKE '%"+ nameText + "%'";
    
            dbcon.query(sqlQuery, function (err, result) {
                if (err) throw err;

                result.forEach(row => {
                    foundItems.push(itemObject( row.stock_id.toString(), row.barcode.toString(), row.product_name.toString(), 
                                                row.price.toString(), row.tax.toString()));
                });

                foundItems.forEach(item => {
                    newHTML += createItemHTML(item, idCount);
                    ++idCount;
                });

                rightContainer.innerHTML = newHTML;
            });
        });
    }

    //burada foundItems'in içini dolduracak fonksiyon çağırılır ilk
    //ustteki foundItems i silersin burayı ayarladiktan sonra
    //let foundItems = sihirliFonksiyon()

    //item eklerken sıkıntı oluyor mu testi, silinecek
    //foundItems.push(itemObject('0004', '8517870121248', 'Faber-Castell 48li Keçeli Kalem', '5000 tl', '%20')

    //item silerken sıkıntı oluyor mu testi, silinecek
    //foundItems.pop();

    document.querySelector('#urun').reset();
    document.querySelector('#barkod').reset();

});

//anasayfaya dönüş
document.querySelector('#back-button').addEventListener('click', () => {
    console.log("Returning to main page");
    ipcRenderer.send('load-home-page');
});