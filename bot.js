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

GetAllChildren = (categoryChannel) =>{
  let ListNameChildren={};
  categoryChannel.children.forEach((e)=>{
    ListNameChildren[e.name]=e.id;
  })
  return ListNameChildren;
}

CreateAllChilldrenNeed = (listChannel,listNewChannel,Request)=> {
  return new Promise(async (resolve)=>{
    let RequestFetch = await Request.fetch()
    let CategoryChannel = await GetTargetChannelByName(categoryName,RequestFetch);
    var numberchildren = CategoryChannel.children.size;
    let targetNumberChannel=numberchildren
    
    let arrayChildrenName = GetAllChildren(CategoryChannel);
    for (let nameChannel of listNewChannel) {
      if (!Object.keys(arrayChildrenName).includes(nameChannel)){
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
SendAllMessageEmbedToChannel = async (ActiveChannel,ObjectNameChannelAndId,TitleArticle,AllPropertyEmbed,nameTargetChannel) => {
  
  let IdTargetChannel = ObjectNameChannelAndId[nameTargetChannel];
  let ChannelToSendMessage= await ActiveChannel.fetch(IdTargetChannel);
  if(AllPropertyEmbed.at(2)==="none"){
    var NewEmbed = new Discord.MessageEmbed()
    .setTitle(TitleArticle)
    .setURL(AllPropertyEmbed.at(0))
    .setDescription(AllPropertyEmbed.at(1))
    .setTimestamp()
  }else{
    var NewEmbed = new Discord.MessageEmbed()
    .setTitle(TitleArticle)
    .setURL(AllPropertyEmbed.at(0))
    .setDescription(AllPropertyEmbed.at(1))
    .setImage(AllPropertyEmbed.at(2))
    .setTimestamp()
    

  }
  await ChannelToSendMessage.send({
    embeds:[NewEmbed]
  });
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
    
    let nammeChannelAndIsId = GetAllChildren(CategoryChannelTarget)
    
    sectionFeedly.forEach(async (FolderName, idFeedly, map) =>{
      
      let NumberNewArticle = NewArticle.get(idFeedly)
      

      let DataSend = await FeedlyApp.GetAllUnreadArticle(config.tokenFeedly,idFeedly,10)
      
      
      
      
      DataSend.forEach(async (value, key, map) =>{
        
        await SendAllMessageEmbedToChannel(ChannelsClient,nammeChannelAndIsId,key,value,FolderName)

      })

    })

    console.log("Tous les messages envoyés");
    //Client.destroy()

  }

}

bot.on('ready', () =>{
  Main(bot);
})
bot.login(config.BotToken);