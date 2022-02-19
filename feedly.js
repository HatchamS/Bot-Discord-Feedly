const axios = require('axios')
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
async function GetAllFolder(tokenApi) {
    let resultRequest = await axios.get("https://cloud.feedly.com/v3/collections",{
        headers: {'Authorization': tokenApi}
    })
    
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
        return LabelAndId
    }
    

};
async function GetAllUnreadCounts(tokenApi,listId){
    let resultRequest = await axios.get("https://cloud.feedly.com/v3/markers/counts",{
        headers: {'Authorization': tokenApi}
    })
    let Allvalue = Object.values(resultRequest.data)
    let FilterData = Allvalue[0].filter(input=>input.count>0 && listId.has(input.id))
    
    let NumberUnreadCounts=new Map()
    Object.entries(FilterData).forEach(([clé, valeur])=>{
        NumberUnreadCounts.set(valeur.id,valeur.count);
    })
    while(NumberUnreadCounts.size !== FilterData.length){
        await sleep(1000);
    }
    if (NumberUnreadCounts.size === FilterData.length){
        return NumberUnreadCounts;
    }
    
}

async function GetAllUnreadArticle(tokenApi,streamIdtoken,numberarticle = 10){
    let resultRequest = await axios.get("https://cloud.feedly.com/v3/streams/contents?streamId="+streamIdtoken+"&unreadOnly=true"+"&count="+numberarticle,{
        headers: {'Authorization': tokenApi}
    })
    let Allvalue = resultRequest.data.items;
    
    
    let ListNewArticle=new Map()
    let compteur=0
    Object.entries(Allvalue).forEach(([key,valu])=>{
        
        let ValueImg = valu.visual===undefined ? "none":valu.visual.url
        ListNewArticle.set(compteur++,[valu.origin["title"],valu.canonicalUrl,valu.title,ValueImg]);

    })
    

    while (Object.entries(Allvalue).length !== ListNewArticle.size){
        
        await sleep(1500)
    }
    
    if(Object.entries(Allvalue).length === ListNewArticle.size){
        return ListNewArticle;
    } 
}

async function MarkCategoryAsRead(tokenApi,FeedlyId){
    let resultRequest = await axios({
        method: 'post',
        url: 'https://cloud.feedly.com/v3/markers',
        headers: {'Authorization': tokenApi},
        data: {
            "action": "markAsRead",
            "type": "categories",
            "categoryIds": [FeedlyId],
            "asOf": Date.now()
        }
    })
    return resultRequest
}


module.exports.GetAllFolder = GetAllFolder;
module.exports.GetAllUnreadCounts=GetAllUnreadCounts;
module.exports.GetAllUnreadArticle=GetAllUnreadArticle;
module.exports.MarkCategoryAsRead=MarkCategoryAsRead;