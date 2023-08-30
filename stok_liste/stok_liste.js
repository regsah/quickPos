const { ipcRenderer } = require('electron');

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

//bu array dinamik olarak alacak tabi sql'den veriyi, normalde aşağıdaki listenerin içinde oluştururuz
let foundItems = [
    itemObject('0001', '8517870121245', 'Faber-Castell 12li Keçeli Kalem', '174 tl', '%20'),
    itemObject('0002', '8517870121246', 'Faber-Castell 16li Keçeli Kalem', '200 tl', '%20'),
    itemObject('0003', '8517870121247', 'Faber-Castell 24lü Keçeli Kalem', '300 tl', '%20'),
];


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

    let idCount = 0
    rightContainer.innerHTML = "";

    //burada foundItems'in içini dolduracak fonksiyon çağırılır ilk
    //ustteki foundItems i silersin burayı ayarladiktan sonra
    //let foundItems = sihirliFonksiyon()

    let newHTML = itemLabels + "\n\n";

    foundItems.forEach(item => {
        newHTML += createItemHTML(item, idCount);
        ++idCount;
    });

    rightContainer.innerHTML = newHTML;

    //item eklerken sıkıntı oluyor mu testi, silinecek
    //foundItems.push(itemObject('0004', '8517870121248', 'Faber-Castell 48li Keçeli Kalem', '5000 tl', '%20'));

    //item silerken sıkıntı oluyor mu testi, silinecek
    //foundItems.pop();
});

//anasayfaya dönüş
document.querySelector('#back-button').addEventListener('click', () => {
    ipcRenderer.send('load-home-page');
});