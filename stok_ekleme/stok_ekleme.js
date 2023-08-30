const { ipcRenderer } = require('electron');

//anasayfaya dönüş
document.querySelector('#back-button').addEventListener('click', () => {
    ipcRenderer.send('load-home-page');
});