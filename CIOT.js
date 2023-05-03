const text = document.getElementById("text");

const button = document.getElementById("button");
const h1 = document.getElementById("h1");
const h2 = document.getElementById("h2");
const request_fitbit_url = "http://127.0.0.1:3000/getrealtime";
const request_publish_url = "http://127.0.0.1:3000/getpublish";

setInterval(
    ()=>{
        axios.get(request_fitbit_url)
        .then(response => {
            h1.textContent = response.data[0];
            //받아온 것에 변화가 있을 때 해당 부분 수정
        })
        .catch(error => {
            console.log(error);
        });
    },
    1000
);
setInterval(
    ()=>{
        axios.get(request_publish_url)
        .then(response => {
            h2.textContent = response.data;
            //받아온 것에 변화가 있을 때 해당 부분 수정
        })
        .catch(error => {
            console.log(error);
        });
    },
    1000
);