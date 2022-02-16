const axios = require('axios')
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
async function GetAllFolder(tokenApi) {
    let resultRequest = await axios.get("https://cloud.feedly.com/v3/collections",{
        headers: {'Authorization': tokenApi}
    })
    console.log(resultRequest.data)
    return new Promise(async (resolve)=>{
        let LabelAndId=new Map()
        Object.entries(resultRequest.data).forEach(([clé, valeur])=>{

            if(valeur.label !== undefined){
                LabelAndId.set(valeur.id,valeur.label);
            }
        })
        while(LabelAndId.size!==resultRequest.data.length){
            await sleep(1000)
        }
        if(LabelAndId.size===resultRequest.data.length){
            resolve(LabelAndId)
        }
    })

};
async function GetAllUnreadCounts(tokenApi,listId){
    let resultRequest = await axios.get("https://cloud.feedly.com/v3/markers/counts",{
        headers: {'Authorization': tokenApi}
    })
    let Allvalue = Object.values(resultRequest.data)
    let FilterData = Allvalue[0].filter(input=>input.count>0 && listId.has(input.id))
    return new Promise(async (resolve)=>{
        let NumberUnreadCounts=new Map()
        Object.entries(FilterData).forEach(([clé, valeur])=>{
            NumberUnreadCounts.set(valeur.id,valeur.count)
        })
        while(NumberUnreadCounts.size !== FilterData.length){
            await sleep(1000)
        }
        if (NumberUnreadCounts.size === FilterData.length){
            resolve(NumberUnreadCounts)
        }
    })
}



module.exports.GetAllFolder = GetAllFolder;
module.exports.GetAllUnreadCounts=GetAllUnreadCounts;