const text = document.getElementById("text");

const button = document.getElementById("button");
const h1 = document.getElementById("h1");
const h2 = document.getElementById("h2");
const h3 = document.getElementById("h3");
const request_fitbit_url = "http://127.0.0.1:3000/getrealtime";
const request_publish_url = "http://127.0.0.1:3000/getpublish";

setInterval(
    ()=>{
        axios.get(request_fitbit_url)
        .then(response => {
            //h1.textContent = response.data[0].user.age;

            console.log("heart rate time : " + response.data[0]['activities-heart-intraday']['dataset'][0]['time']);
            console.log("heart rate value : " + response.data[0]['activities-heart-intraday']['dataset'][0]['value']);

            console.log("hrv : " + response.data[1]);

            console.log("br : " + response.data[2]);

            console.log("spo2 : " + response.data[3]);

            //console.log(response);
            //받아온 것에 변화가 있을 때 해당 부분 수정
        })
        .catch(error => {
            console.log(error);
        });
    },
    60000
);


setInterval(
    ()=>{
        axios.get(request_publish_url)
        .then(response => {
            h3.textContent = response.data;
            //받아온 것에 변화가 있을 때 해당 부분 수정
        })
        .catch(error => {
            console.log(error);
        });
    },
    1000
);