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

document.querySelector('#odeme').addEventListener('click', () => {
    ipcRenderer.send('run-python-1');
});

document.querySelector('#parkaAl').addEventListener('click', () => {
    ipcRenderer.send('run-python-2');
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

//belki ise yarar diye bu arrayi koydum ama sil istersen, benim isime yaramadi
const item_types = [];

let placeHolderIDs = 0;

/*ekleme: hocam bunu sen backende ustteki ornekleri kullanarak bagliyacaksin
 *cunku hangi tusun ne getirmesi gerektigini tam olarak bilmiyorum + urun listesi yok ortada
 *ben simdilik park Listesine tiklandiginda yeni item eklenecek sekilde func. yaziyorum
 *sen bunu modifiye edersin uygun sekilde,
 */

 document.querySelector('#parkListe').addEventListener('click', () => {
    //bu objeyi bir butona o butonu da bir scripte baglarsin hocam otomatik ceker degerleri
    let newItem = itemObject(placeHolderIDs++, "kalemlik", 1, 100);
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


//cikarma:
itemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('item-delete')) {
        event.target.parentElement.remove();
    }
});

//anasayfaya dönüş
document.querySelector('#back-button').addEventListener('click', () => {
    ipcRenderer.send('load-home-page');
});
