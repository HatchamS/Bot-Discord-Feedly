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

CreateAllChilldrenNeed = (listChannel,listNewChannel,categoryChannel)=> {
  let arrayChildrenName = GetAllChildren(categoryChannel,"name");
  listNewChannel.forEach(element => {
    if (!arrayChildrenName.includes(element)){
      CreateChannel(listChannel,element,categoryChannel.id,textChannel);
    }else{
      console.log(element+" existe déjà dans le salon "+categoryName);
    }
  });
}
SendAllMessageToChannel = async (ActiveChannel,AllIdchildrenChannel,content,) => {
  let ChannelToSendMessage= await ActiveChannel.fetch(AllIdchildrenChannel[1])
  await ChannelToSendMessage.send(content)
  return 0;
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
async function Main(array,Client){
  
  let serv=Client.guilds.cache;
  let guildID = Client.guilds.cache.keys().next().value;
  let ChannelsClient=Client.channels;
  let Request = serv.get(guildID).channels
  let RequestFetch = await Request.fetch()
  
  let CategoryChannel = await GetTargetChannelByName(categoryName,RequestFetch);
  
  
  CreateAllChilldrenNeed(Request,array,CategoryChannel);
  await sleep(2000)
  
  let refrechChildrenId = GetAllChildren(CategoryChannel,"id");
  SendAllMessageToChannel(Client.channels,refrechChildrenId ,"C'est un message");

}

bot.on('ready',  () =>{
  let NewChannel=["coucou","troll"];
  Main(NewChannel,bot);
})

bot.login(config.BotToken);