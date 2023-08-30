const { ipcRenderer } = require('electron');

document.querySelector('#pos').addEventListener('click', () => {
    ipcRenderer.send('load-pos-page');
});

document.querySelector('#stok-listesi').addEventListener('click', () => {
    ipcRenderer.send('load-liste-page');
});

document.querySelector('#stok-ekleme').addEventListener('click', () => {
    ipcRenderer.send('load-ekleme-page');
});