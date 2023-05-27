const axios = require('axios');
const authorization='Bearer 87294c07-4dd1-4e22-a0d4-8938962c81c8';//뒤에는 토큰 알아서 붙힐 것
const deviceID='89aa2480-6c51-8353-e39b-52ab1527c40c';//에어컨 코드 넣어야함 현재는 냉장고 코드
const headers={"Authorization":authorization};
const commands = [
    {
      component: "main",
      capability: "refrigeration",
      command: "setRapidCooling",
      arguments: ["on"]
    }
  ];
async function getDevices() {
  const response=await axios.get('https://api.smartthings.com/v1/devices',{headers});
  console.log(JSON.stringify(response.data,null,2));//여기서 components를 통해 위의 command 바꿔줘야함
  axios.post
}
async function executeCommand(deviceId, commands) {
    const url = `https://api.smartthings.com/v1/devices/${deviceId}/commands`;
    const response = await axios.post(url, { commands }, { headers });
    console.log(response.data);
}
//getDevices();
executeCommand(deviceID,commands);