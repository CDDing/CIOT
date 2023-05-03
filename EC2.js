const axios=require('axios');
const request_json="profile.json";
const url = "http://127.0.0.1:3000/getdata?request_json="+request_json;
console.log(url+" Request");
setInterval(
    ()=>{
        axios.get(url)
        .then(response => {
            console.log("받음");
        })
        .catch(error => {
            console.log(error);
        });
    },
    1000
);