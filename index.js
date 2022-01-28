const { Discord, Intents, Options, LimitedCollection } = require('discord.js');
const YamnaBot = require("./handlers/ClientBuilder.js");
const client = new YamnaBot({
  ownerID: ['484524591696576523'],
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
  ],
  makeCache: Options.cacheWithLimits({
    MessageManager: {
      sweepInterval: 300,
      sweepFilter: LimitedCollection.filterByLifetime({
        lifetime: 1800,
        getComparisonTimestamp: e => e.editedTimestamp ?? e.createdTimestamp,
      })
    }
  })
});
const fs = require('fs');
const { CHANNEL, SERVER, LIVE } = require("./config.json");
require('dotenv').config();
//client.commands = new Discord.Collection();
//DataBases(MongoDB)=====================
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  userFindAndModify: false
}).then(() => {
  console.log('Connected to Mongo.db');
}).catch((err) => {
  console.log(err);
});

let prefix = "=";
//
//require("./logger.js")(client);
require("./logger2.js")(client);
//Handler
["module", "Event", "distube", "nsfw", "update", "welcome"/*, "antigrif"*/].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
//client=-=-=-=-=-=-=-=-=-=-=-=-=
client.package = require("./package.json");
client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.
client.login(process.env.SECRET).catch(console.error); // This token will leads to the .env file. It's safe in there.

//leave = ban =-=-=-=-=-=-=-=-=-=
/*client.on("guildMemberRemove", async function (member) {
    //console.log(member)
    user = member
    try {
        await user.ban({
            days: 0,
            reason: "Rule #0: Leave => Ban"
        }).catch(err => console.log(err));
    } catch (err) {
        console.log(err)
    }
});
//Youtube Channel Info
const YouTube = require("simple-youtube-api");

// YouTube Api (v3)
const youtube = new YouTube("api here");

client.on("ready", () => {

  // YouTube channel URL
  let chURL = "https://youtube.com/channel/UCZ5XnGb-3t7jCkXdawN2tkA";
 //  Do not use https://youtube.com/c/discord

  let namech = "Category id here";
  let subscriberch = "Channel 1 id here ";
  let viewsch = "Channel 2 id here";
  let videosch = " Channel 3 id here";

  // Updata Time
  let time = 10000; // 10000 = 10s~

  let Name;
  let sub;
  let view;
  let videos;

  setInterval(() => {
    youtube.getChannel(chURL).then(c => {
      Name = c.title;
      let name = client.channels.cache.get(namech);
      name.setName(`『 ${Name} 』`);
    });
  }, time);
  setInterval(() => {
    youtube.getChannel(chURL, { part: "statistics" }).then(c => {
      sub = c.subscriberCount;
      view = c.viewCount;
      videos = c.videoCount;
      let Sub = client.channels.cache.get(subscriberch);
      let View = client.channels.cache.get(viewsch);
      let Videos = client.channels.cache.get(videosch);
      Sub.setName(`『 Subscriber 』〘 ${sub} 〙`);
      View.setName(`『 Views 』〘 ${view} 〙`);
      Videos.setName(`『 Videos 』〘 ${videos} 〙`);
    });
  }, time);
});
if (message.deletable) message.delete();
//ODMwMTY2MDA1MTUzNjYwOTI5.YHCuVw.noxlCUTlQXAWfq2-vX5XDaUZFd8
*/
//haveibeenpwned.com | urlscan.io | mailboxlayer.com | cloudmersive | newsapi | apiflash | mail.tm | 12data
//rebrandly|thesportsdb|abstractapi(sms)|VirusTotal|football-data|bigdatacloud|freetogame|markerapi|numvalidate
//gamerpower|quran.api-docs.io|fullcontact|gofile.io|cheapshark|||

//CDN : cloudinary | image4.io
