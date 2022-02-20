const Discord = require('discord.js');
const bot = new Discord.Client({intents: []});
const categoryName="NEW";
const textChannel ="GUILD_TEXT";
const config = require('./config.json');
const FeedlyApp = require("./feedly.js")


GetTargetChannelByName = async (Name,FetchRequest) => {
  let listeChannel= await FetchRequest; 
  let Channel = listeChannel.find(chanenel=>chanenel.name==Name);
  return Channel;
}

CreateChannel = async (GuildChannelManager,NameNewChannel,idCategoryChannel,typeChannel) =>{
  let newChannel = await GuildChannelManager.create(NameNewChannel,{type:typeChannel});
  return newChannel.setParent(idCategoryChannel);
}

GetAllChildren = (categoryChannel) =>{
  let ListNameChildren={};
  categoryChannel.children.forEach((e)=>{
    ListNameChildren[e.name]=e.id;
  })
  return ListNameChildren;
}

CreateAllChilldrenNeed = async (listChannel,listNewChannel,Request)=> {
  let RequestFetch = await Request.fetch()
  let CategoryChannel = await GetTargetChannelByName(categoryName,RequestFetch);
  
  let arrayChildrenName = GetAllChildren(CategoryChannel);

  for (let nameChannel of listNewChannel) {

    if (!Object.keys(arrayChildrenName).includes(nameChannel)){
      await CreateChannel(listChannel,nameChannel,CategoryChannel.id,textChannel);
      
    }else{
      console.log(nameChannel+" existe déjà dans le salon "+categoryName);
    }
  } 
}
SendAllMessageEmbedToChannel = async (ActiveChannel,ObjectNameChannelAndId,AllPropertyEmbed,nameTargetChannel) => {
  
  let IdTargetChannel = ObjectNameChannelAndId[nameTargetChannel];
  let ChannelToSendMessage= await ActiveChannel.fetch(IdTargetChannel);
  if(AllPropertyEmbed.at(3)==="none"){
    var NewEmbed = new Discord.MessageEmbed()
    .setTitle(AllPropertyEmbed.at(0))
    .setURL(AllPropertyEmbed.at(1))
    .setDescription(AllPropertyEmbed.at(2))
    .setTimestamp()
  }else{
    var NewEmbed = new Discord.MessageEmbed()
    .setTitle(AllPropertyEmbed.at(0))
    .setURL(AllPropertyEmbed.at(1))
    .setDescription(AllPropertyEmbed.at(2))
    .setImage(AllPropertyEmbed.at(3))
    .setTimestamp()
    

  }
  await ChannelToSendMessage.send({
    embeds:[NewEmbed]
  });
}
async function Main(Client){
  let sectionFeedly = await FeedlyApp.GetAllFolder(config.tokenFeedly); //get label value and his id key
  let NewArticle = await FeedlyApp.GetAllUnreadCounts(config.tokenFeedly,sectionFeedly)

  if (NewArticle.values().next().done === true){
    console.log("Pas de Nouveau Articles")
    return 0;
  }else{
    let serv=Client.guilds.cache;
    let guildID = Client.guilds.cache.keys().next().value;
    let Request = serv.get(guildID).channels;
    
    await CreateAllChilldrenNeed(Request,sectionFeedly.values(),Request);
    console.log("Création des channels terminés");

    let ChannelsClient=Client.channels;
    let CategoryChannelTarget = await GetTargetChannelByName(categoryName,Request.fetch(),"id");
    
    let nammeChannelAndIsId = GetAllChildren(CategoryChannelTarget);

    for (const [idFeedly,FolderName] of sectionFeedly){
    
    let NumberNewArticle = NewArticle.get(idFeedly);

    let DataSend = await FeedlyApp.GetAllUnreadArticle(config.tokenFeedly,idFeedly,NumberNewArticle)

    for(const [key,value] of DataSend){
      await SendAllMessageEmbedToChannel(ChannelsClient,nammeChannelAndIsId,value,FolderName);
      await FeedlyApp.MarkCategoryAsRead(config.tokenFeedly,idFeedly);
      }
    }
  }
};

bot.on('ready', () =>{
  Main(bot).then((event)=>{
    console.log("Tous les messages envoyés");
    bot.destroy()
  });
});
bot.login(config.BotToken);