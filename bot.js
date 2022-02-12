const Discord = require('discord.js');
const bot = new Discord.Client({intents: []});
const categoryName="NEW";
const textChannel ="GUILD_TEXT";
const config = require('./config.json');

GetTargetChannelByName = async (categoryName,FetchRequest) => {
  let listeChannel= await FetchRequest; 
  let Channel = listeChannel.find(chanenel=>chanenel.name==categoryName);
  return Channel;
}

CreateChannel = async (GuildChannelManager,NameNewChannel,idCategoryChannel,typeChannel) =>{
  let newChannel = await GuildChannelManager.create(NameNewChannel,{type:typeChannel});
  newChannel.setParent(idCategoryChannel);
}

GetAllIdChildren = (categoryChannel) =>{
  let ListNameChildren=[];
  categoryChannel.children.forEach((e)=>{
    ListNameChildren.push(e.name);
  })
  return ListNameChildren;
}

Main = async (listChannel,listNewChannel)=> {
  let CategoryChannel = await GetTargetChannelByName(categoryName,listChannel.fetch());
  let arrayChildrenName = GetAllIdChildren(CategoryChannel);
  
  listNewChannel.forEach(element => {
    
    if (!arrayChildrenName.includes(element)){
      CreateChannel(listChannel,element,CategoryChannel.id,textChannel);
    }else{
      console.log(element+" existe déjà dans le salon "+categoryName);
    }
    
  });
  
}

bot.on('ready',  () =>{
  const serv = bot.guilds.cache;
  const guildID = serv.keys().next().value;
  const ChannelsServer=serv.get(guildID).channels;
  let array=[]  
  Main(ChannelsServer,array);
  
})


bot.login(config.BotToken);