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

GetAllChildren = (categoryChannel,property) =>{
  let ListNameChildren=[];
  categoryChannel.children.forEach((e)=>{
    ListNameChildren.push(e[property]);
  })
  return ListNameChildren;
}

ManageChannel = async (listChannel,listNewChannel)=> {
  let CategoryChannel = await GetTargetChannelByName(categoryName,listChannel.fetch());
  let arrayChildrenName = GetAllChildren(CategoryChannel,"name");
  
  listNewChannel.forEach(element => {
    if (!arrayChildrenName.includes(element)){
      CreateChannel(listChannel,element,CategoryChannel.id,textChannel);
    }else{
      console.log(element+" existe déjà dans le salon "+categoryName);
    }
  });
  return CategoryChannel;
}
SendAllMessageToChannel = async (ActiveChannel,AllIdchildrenChannel,content,) => {
  let ChannelToSendMessage= await ActiveChannel.fetch(AllIdchildrenChannel[0])
  await ChannelToSendMessage.send(content)
  return 0;
}
bot.on('ready',  () =>{
  const serv = bot.guilds.cache;
  const guildID = serv.keys().next().value;

  let array=["troll"];  
  ManageChannel(serv.get(guildID).channels,array).then((parent) => {
    let allActiveChannelChildrenId=GetAllChildren(parent,"id")
    SendAllMessageToChannel(bot.channels,allActiveChannelChildrenId,"C'est un message")
    })
})

bot.login(config.BotToken);