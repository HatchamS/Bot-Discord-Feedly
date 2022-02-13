const Discord = require('discord.js');
const bot = new Discord.Client({intents: []});
const categoryName="NEW";
const textChannel ="GUILD_TEXT";
const config = require('./config.json');

GetTargetChannelByName = async (Name,FetchRequest) => {
  let listeChannel= await FetchRequest; 
  let Channel = listeChannel.find(chanenel=>chanenel.name==Name);
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

ManageChannel = async (listChannel,listNewChannel)=> {
  let CategoryChannel = await GetTargetChannelByName(categoryName,listChannel.fetch());
  let arrayChildrenName = GetAllIdChildren(CategoryChannel);
  
  listNewChannel.forEach(element => {
    if (!arrayChildrenName.includes(element)){
      CreateChannel(listChannel,element,CategoryChannel.id,textChannel);
    }else{
      console.log(element+" existe déjà dans le salon "+categoryName);
    }
  });
  return CategoryChannel.id;
}
SendAllMessageToChannel = async (ActiveChannel,targetNameChannel,content,guildChannel,parenid) => {
  let TargetChannel = await GetTargetChannelByName(targetNameChannel,guildChannel)
  let ChannelToSendMessage=ActiveChannel.find(channel=>channel.id===TargetChannel.id & channel.parentId===parenid)
  await ChannelToSendMessage.send(content)
  return 0;
}
bot.on('ready',  () =>{
  const serv = bot.guilds.cache;
  const guildID = serv.keys().next().value;

  let array=[];  
  ManageChannel(serv.get(guildID).channels,array).then((idparent) => {
    let allActiveChannel=bot.channels.cache
    SendAllMessageToChannel(allActiveChannel,"coucou","C'est un message",serv.get(guildID).channels.fetch(),idparent)
    })
})

bot.login(config.BotToken);