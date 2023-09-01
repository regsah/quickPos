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

const mysql = require('mysql');

let Basket = [];

let dbcon = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "main_database"
});


//Bu fonksiyonu zaten addToBasket'te kullanıyorum, butona direkt addToBasket'i bağlicaz
/**
 * Returns the product information from the main database with SQL
 * 
 * @param {number} barcode The product barcode to search for
 */
function getProduct(barcode) {
    dbcon.connect(function(err) {
        if (err) throw err;
        console.log("Connection successfull");
        
        let sqlQuery = "SELECT * FROM products WHERE barcode='?' LIMIT 1 ";

        dbcon.query(sql, barcode, function (err, result) {
            if (err) throw err;
            console.log("Product successfully selected");

            return result;
        });
    });
}

//Bunu butona bağlicaz buda list of maps halindeki Basket'e ürünü giricek
//Kullanıcıdan barkod inputunu alıp ürünü ekliyor, basketten de itemleri çekip senin tanımladığın objelere dönüştürücez sanırım

//Belli bi butona bağlı olmaması lazım ama direkt barkod kısmına barkodu girip enterladıktan sonra çalışması lazım
/**
 * Adds the information of the product to the universal Basket
 * 
 * @param {number} barcode Product barcode to add for
 */
function addToBasket(barcode) {
    let retItem = getProduct(barcode);

    Basket.push(
        {
            stock_id: retItem.stock_id,
            barcode : retItem.barcode,
            name    : retItem.product_name,
            num     : 1,
            val     : retItem.price
        }
    );

    return {
        barcode : retItem.barcode,
        name    : retItem.product_name,
        num     : 1,
        val     : retItem.price
    }
}

/**
 * Erases the quantity of the selected item
 * 
 * @param {number} line Line of the element that will be removed (Starts from 0)
 */
function removeFromBasket(line) {
    Basket[line].num = 0;
}

/**
 * Clears all of the information on the basket
 */
function clearBasket() {
    Basket = [];
}

//Ödeme al kısmında hem loglayıp hem de clearlicaz basketi
/**
 * Logs all of the information on the basket to the log database
 */
function logBasket() {
    dbcon.connect(function(err) {
        if (err) throw err;
        console.log("Connection successfull");
        
        let sqlQuery = "INSERT INTO basket_log (stock_id, barcode, name, price, quantity) VALLUES ?";

        //Turns list of maps to list of lists
        let sqlValues = Basket.map(obj => Object.values(obj));

        dbcon.query(sqlQuery, sqlValues, function (err) {
            if (err) throw err;
            console.log("Logging successfull");
        });
    });
}


document.querySelector('#odeme').addEventListener('click', () => {
    logBasket();
    clearBasket();
});


//itemlerin dinamik eklenme cikartilma kismi

/*bu fonksiyon sen her cagirdiginda bizim cektigimiz itemi tanimlayacak
 *olan obje constructor i,
 *
 *itemID: itemin obje olarak html documentinda sahip olmasini istedigimiz id
 *itemName: itemin adi
 *itemNum: envanterden kac tane cektigimiz
 *itemVal: tanesi kac para (istersen toplami kac para yap)
 */
function itemObject(itemID, itemName, itemNum, itemVal) {
    return {
        itemID: itemID,
        itemName: itemName,
        itemNum: itemNum,
        itemVal: itemVal
    };
}

const itemsContainer = document.querySelector("#items-container");

/*ekleme: hocam bunu sen backende ustteki ornekleri kullanarak bagliyacaksin
 *cunku hangi tusun ne getirmesi gerektigini tam olarak bilmiyorum + urun listesi yok ortada
 *ben simdilik park Listesine tiklandiginda yeni item eklenecek sekilde func. yaziyorum
 *sen bunu modifiye edersin uygun sekilde,
 */

 document.querySelector('#button-ent').addEventListener('click', () => {


    //hocam barcodu nerden çekicez onu çözemedim
    let newItemInfo = addToBasket(1)
    let newItem = itemObject(newItemInfo.barcode, newItemInfo.name,
                             newItemInfo.num, newItemInfo.val);

    item_types.push(newItem);

    let prevHTML = itemsContainer.innerHTML;
    let newHTML = `
        <div class="item-sub-container" id="item-sub-container-${newItem.itemID}">
            <button class="item-delete" id="item-delete-${newItem.itemID}">X</button>
            <div class="item-count" id="item-count-${newItem.itemID}">${newItem.itemNum}</div>
            <div class="item-name" id="item-name-${newItem.itemID}">${newItem.itemName}</div>
            <div class="item-cost" id="item-cost-${newItem.itemID}">${newItem.itemVal}</div>
        </div>`;
    itemsContainer.innerHTML = prevHTML + "\n" + newHTML;
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
    ipcRenderer.send('load-home-page');
});
