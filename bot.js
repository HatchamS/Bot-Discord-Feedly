const Discord = require('discord.js');
const bot = new Discord.Client({intents: []});
const categoryName="NEW";
const textChannel ="GUILD_TEXT";
const config = require('./config.json');
const FeedlyApp = require("./feedly.js")


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

GetTargetChannelByName = async (Name,FetchRequest) => {
  let listeChannel= await FetchRequest; 
  let Channel = listeChannel.find(chanenel=>chanenel.name==Name);
  return Channel;
}

CreateChannel = async (GuildChannelManager,NameNewChannel,idCategoryChannel,typeChannel) =>{
  let newChannel = await GuildChannelManager.create(NameNewChannel,{type:typeChannel});
  newChannel.setParent(idCategoryChannel);
}

GetAllChildren = (categoryChannel,property) =>{
  let ListNameChildren=[];
  categoryChannel.children.forEach((e)=>{
    ListNameChildren.push(e[property]);
  })
  return ListNameChildren;
}

CreateAllChilldrenNeed = (listChannel,listNewChannel,Request)=> {
  return new Promise(async (resolve)=>{
    let RequestFetch = await Request.fetch()
    let CategoryChannel = await GetTargetChannelByName(categoryName,RequestFetch);
    var numberchildren = CategoryChannel.children.size;
    let targetNumberChannel=numberchildren
    
    let arrayChildrenName = GetAllChildren(CategoryChannel,"name");
    for (let nameChannel of listNewChannel) {
      if (!arrayChildrenName.includes(nameChannel)){
        CreateChannel(listChannel,nameChannel,CategoryChannel.id,textChannel);
        targetNumberChannel++
      }else{
        console.log(nameChannel+" existe déjà dans le salon "+categoryName);
      }
    }
    
    while (numberchildren !== targetNumberChannel) {
      numberchildren = CategoryChannel.children.size;
      await sleep(1000)
      
    }
    if(numberchildren==targetNumberChannel){
      resolve()
    }
    
    

  })
}
SendAllMessageToChannel = async (ActiveChannel,ObjectNameChannelAndId,AllmessageToSend,nameTargetChannel) => {
  let IdTargetChannel = ObjectNameChannelAndId[nameTargetChannel];
  let ChannelToSendMessage= await ActiveChannel.fetch(IdTargetChannel);
  //let FormatedMessage = AllmessageToSend.join('\n')
  return await ChannelToSendMessage.send("Nombre de nouveau article: "+AllmessageToSend);
}
zipMapToObject=(mapIterator,array)=>{
  let finalObject={}
  let Compteur = 0
  mapIterator.forEach((element,index,map) => {
      finalObject[element]=array[Compteur++]
  })
  return finalObject
}
fusionMap=(MapOne,MapTwo)=>{
  let finalObject={}
  MapOne.forEach((value, key, map) => {
    finalObject[value]=MapTwo.get(key)
  })
  return finalObject
}

async function Main(Client){
  let sectionFeedly = await FeedlyApp.GetAllFolder(config.tokenFeedly); //get label value and his id key
  let NewArticle = await FeedlyApp.GetAllUnreadCounts(config.tokenFeedly,sectionFeedly)
  if (NewArticle.values().next() === true){
    console.log("Pas de Nouveau Articles")
  }else{
    let serv=Client.guilds.cache;
    let guildID = Client.guilds.cache.keys().next().value;
    let Request = serv.get(guildID).channels
    
    await CreateAllChilldrenNeed(Request,sectionFeedly.values(),Request);
    console.log("Création des channels terminés");

    
    let ChannelsClient=Client.channels;
    let CategoryChannelTarget = await GetTargetChannelByName(categoryName,Request.fetch(),"id");
    let refrechChildrenId = GetAllChildren(CategoryChannelTarget,"id");
    
    let nammeChannelAndIsId = zipMapToObject(sectionFeedly,refrechChildrenId)
    let DataSend = fusionMap(sectionFeedly,NewArticle)
    
  
    for (let [key, value] of Object.entries(DataSend)) {
      await SendAllMessageToChannel(ChannelsClient,nammeChannelAndIsId,value,key)
    }
    console.log("Tous les messages envoyés");
    Client.destroy()

  }

}

bot.on('ready',  () =>{
  Main(bot);
})
bot.login(config.BotToken);