const Discord = require('discord.js');
const bot = new Discord.Client({intents: []});
const categoryName="NEW";
const textChannel ="GUILD_TEXT";
const config = require('./config.json');


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
    listNewChannel.forEach(element => {
      if (!arrayChildrenName.includes(element)){
        CreateChannel(listChannel,element,CategoryChannel.id,textChannel);
        targetNumberChannel++
      }else{
        console.log(element+" existe déjà dans le salon "+categoryName);
      }
    })
    while (numberchildren !== targetNumberChannel) {
      numberchildren = CategoryChannel.children.size;
      await sleep(1000)
      
    }
    if(numberchildren==targetNumberChannel){
      resolve()
    }
    
    

  })
}
SendAllMessageToChannel = async (ActiveChannel,AllIdchildrenChannel,content) => {
  let ChannelToSendMessage= await ActiveChannel.fetch(AllIdchildrenChannel[0])
  await ChannelToSendMessage.send(content)
  return 0;
}

async function Main(DataInput,Client){
  let sectionFeedly = Object.keys(DataInput)
  

  let serv=Client.guilds.cache;
  let guildID = Client.guilds.cache.keys().next().value;
  let ChannelsClient=Client.channels;
  let Request = serv.get(guildID).channels
  
  let CategoryChannelTarget = await GetTargetChannelByName(categoryName,Request.fetch(),"id");

  await CreateAllChilldrenNeed(Request,sectionFeedly,Request);
  console.log("Création des channels terminer");
  let refrechChildrenId = GetAllChildren(CategoryChannelTarget,"id");
  SendAllMessageToChannel(ChannelsClient,refrechChildrenId ,"C'est un message");

}

bot.on('ready',  () =>{
  let FeedlyResponce = {
    "comics":["super nouvelle","Autre super nouvelle"],
    "BD":["super nouvelleB","Autre super nouvelleB"]
  }
  
  Main(FeedlyResponce,bot);
})

bot.login(config.BotToken);