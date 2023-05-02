
const axios = require('axios');
const text = document.getElementById("text");
const button = document.getElementById("button");
const h1 = document.getElementById("h1");
const url = "http://127.0.0.1/";
h1.textContent = url + text.value;
button.addEventListener('click',()=>{
    /*axios.get(url + text.value)
    .then(response => {
        h1.textContent = response.data;
    })
    .catch(error => {
        h1.textContent = error;
    });*/
})