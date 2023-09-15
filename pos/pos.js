/*
python scripti cagirmak boyle oluyor electronda
sql denemedim bilmediğim icin ama chatGPT ye sorunca 
bir seyler tukurdu hemen cok zor degildir herhalde

bunlar butonlara baglanan eventListenerlar bir de
subProcess in spawnlandigi kisim var main.js de ona da bak

iki ornek yaptim cogaltma kismi daha net olsun diye.
butonlari rastgele atadim backendde ne yapacagini bilmedigimden.
sen index.html den bakarsin idlere oradan istedigin butona istedigin
scripti atarsin 
*/

const { ipcRenderer } = require('electron');

const mysql = require('mysql2');

let Basket  = [];
let sum     = 0

const dbcon = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "main_database"
});



//Devre Dışı

/**
 * Returns the product information from the main database with SQL
 * 
 * @param {number} barcode The product barcode to search for
 */

/*
function getProduct(barcode) {
    dbcon.connect(function(err) {
        if (err) throw err;
        alert(1);
        console.log("Connection successfull");
        
        let sqlQuery = "SELECT * FROM products WHERE barcode='?' LIMIT 1 ";

        dbcon.query(sqlQuery, barcode, function (err, result) {
            if (err) throw err;
            alert(2);
            console.log("Product successfully selected");

            return result;
        });
    });
}
*/


//Devre Dışı
/**
 * Adds the information of the product to the universal Basket
 * 
 * @param {number} barcode Product barcode to add for
 */

/*
function addToBasket(barcode) {
    dbcon.connect(function(err) {
        if (err) throw err;
        alert(1);
        console.log("Connection successfull");
        
        let sqlQuery = "SELECT * FROM products WHERE barcode='?' LIMIT 1 ";

        dbcon.query(sqlQuery, barcode, function (err, result) {
            if (err) throw err;
            alert(2);
            console.log("Product successfully selected");

            return result;
        });
    });


    alert(3);
    Basket.push(
        {
            stock_id: retItem.stock_id,
            barcode : retItem.barcode,
            name    : retItem.product_name,
            num     : 1,
            val     : retItem.price
        }
    );
    alert(4);

}
*/

//Sistemini kurmamız lazım
/**
 * Erases the quantity of the selected item
 * 
 * @param {number} line Line of the element that will be removed (Starts from 0)
 */
/*
function removeFromBasket(line) {
    Basket[line].num = 0;
}
*/

//Devre dışı
/**
 * Logs all of the information on the basket to the log database and clears the Basket
 */
/*function logBasket() {
    dbcon.connect(function(err) {
        if (err) throw err;
        console.log("Connection successfull");
        
        let sqlQuery = "INSERT INTO basket_log (stock_id, barcode, name, price, quantity) VALLUES ?";

        //Turns list of maps to list of lists
        let sqlValues = Basket.map(obj => Object.values(obj));

        dbcon.query(sqlQuery, sqlValues, function (err) {
            if (err) throw err;
            console.log("Logging successfull");
            Basket = [];
        });
    });
}
*/

const itemsContainer = document.querySelector("#items-container");


let clearHTML = itemsContainer.innerHTML;

document.querySelector('#odeme').addEventListener('click', () => {

    dbcon.connect(function(err) {
        if (err) throw err;
        console.log("Connection successfull");
        
        let sqlQuery = "INSERT INTO basket_log (stock_id, barcode, name, price, quantity) VALLUES ?";

        //Turns list of maps to list of lists
        let sqlValues = Basket.map(obj => Object.values(obj));

        dbcon.query(sqlQuery, sqlValues, function (err) {
            if (err) throw err;
            console.log("Logging successfull");
            Basket = [];
        });
    });
    itemsContainer.innerHTML = clearHTML;
    document.querySelector('#total-value').innerHTML = "0 tl";

    console.log('Transaction successfull');
});

document.querySelector('#button-ent').addEventListener('click', () => {

    let barcode = document.querySelector('#item-id').value;

    dbcon.connect(function(err) {
        if (err) throw err;
        console.log("Connection successfull");
        
        let sqlQuery = "SELECT * FROM products WHERE barcode=? LIMIT 1 ";

        dbcon.query(sqlQuery, barcode, function (err, result) {
            if (err) throw err;
            console.log("Product successfully selected");

            //Checking if retrieved item is correct or successfully retrieved
            if (result[0].barcode == '') {
                alert("Barcode not found!!");
            }

            else {
                Basket.push(
                    {
                        stock_id: result[0].stock_id,
                        barcode : result[0].barcode,
                        name    : result[0].product_name,
                        num     : 1,
                        val     : result[0].price
                    }
                );

                sum += result[0].price;
                document.querySelector('#total-value').innerHTML = sum.toString() + " tl";

                let newItem = {
                                itemID  : result[0].barcode.toString(), 
                                itemName: result[0].product_name,
                                itemNum : 1, 
                                itemVal : result[0].price.toString()
                };

                //Adding the item to the html
                let prevHTML = itemsContainer.innerHTML;
                let newHTML = `
                    <div class="item-sub-container" id="item-sub-container-${newItem.itemID}">
                        <button class="item-delete" id="item-delete-${newItem.itemID}">X</button>
                        <div class="item-count" id="item-count-${newItem.itemID}">${newItem.itemNum}</div>
                        <div class="item-name" id="item-name-${newItem.itemID}">${newItem.itemName}</div>
                        <div class="item-cost" id="item-cost-${newItem.itemID}">${newItem.itemVal}</div>
                    </div>`;

                itemsContainer.innerHTML = prevHTML + "\n" + newHTML;
            }
        });
    });

    document.querySelector("#item").reset();

});


//Şimdilik çıkarma dursun hocam çünkü htmlden silmenin yanında kaçıncı satırı
//sildiğinin bilgisini de iletmek gerekiyo

//cikarma:
//itemsContainer.addEventListener('click', (event) => {
//    if (event.target.classList.contains('item-delete')) {
//        event.target.parentElement.remove();
//    }
//});

//anasayfaya dönüş
document.querySelector('#back-button').addEventListener('click', () => {
    console.log("Yes");
    ipcRenderer.send('load-home-page');
});
