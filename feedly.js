const axios = require('axios')
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
async function GetAllBoards(tokenApi) {
    let resultRequest = await axios.get("https://cloud.feedly.com/v3/collections",{
        headers: {'Authorization': tokenApi}
    })
    console.log(resultRequest.data)
    return new Promise((resolve)=>{
        let Boards=[]
        Object.entries(resultRequest.data).forEach(([clé, valeur])=>{

            if(valeur.label !== undefined){
                Boards.push(valeur.label);
            }
        })
        while(Boards.length!==resultRequest.data.length){
            sleep(1000)
        }
        if(Boards.length===resultRequest.data.length){
            resolve(Boards)
        }
    })

};


module.exports.GetAllBoards = GetAllBoards;