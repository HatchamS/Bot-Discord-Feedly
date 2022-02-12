const Discord = require('discord.js');
const bot = new Discord.Client({intents: []});
const categoryName="NEW";
const textChannel ="GUILD_TEXT";
const config = require('./config.json');

GetIdChannelByName = async (categoryName,FetchRequest) => {
  let listeChannel= await FetchRequest; 
  let idChannel = listeChannel.find(chanenel=>chanenel.name==categoryName);
  return idChannel.id;
  
}

CreateChannel = async (GuildChannelManager,NameNewChannel,idCategoryChannel,typeChannel) =>{
  let newChannel = await GuildChannelManager.create(NameNewChannel,{type:typeChannel});
  newChannel.setParent(idCategoryChannel);
}

Main = async (listChannel,listNewChannel)=> {
  let CategoryChannelId = await GetIdChannelByName(categoryName,listChannel.fetch());
  listNewChannel.forEach(element => {
    CreateChannel(listChannel,element,CategoryChannelId,textChannel);
  });
  
}

bot.on('ready',  () =>{
  const serv = bot.guilds.cache;
  const guildID = serv.keys().next().value;
  const ChannelsServer=serv.get(guildID).channels;

  let array=["bonjours","coucou"]  
  Main(ChannelsServer,array);
  
})


bot.login(config.BotToken);