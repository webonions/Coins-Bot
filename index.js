const config = require("./config.json");
const Discord = require("discord.js");
const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
const fs = require("fs");


bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("...");
    return;
  }
  

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`------- ${f}`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => { 
      bot.aliases.set(alias, props.help.name);
  
  });
});
})
bot.on("ready", async () => {
  console.log(`------- ${bot.user.username} est en ligne sur ${bot.guilds.size} serveurs`);
  bot.user.setActivity(`Actif`, { type: "PLAYING" })
  bot.user.setStatus('dnd');

  bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;

    if (bot.commands.has(cmd)) {
      commandfile = bot.commands.get(cmd);
  } else if (bot.aliases.has(cmd)) {
    commandfile = bot.commands.get(bot.aliases.get(cmd));
  }
  
      if (!message.content.startsWith(prefix)) return;

          
  try {
    commandfile.run(bot, message, args);
  
  } catch (e) {
  }}
  )})


bot.login(config.token)