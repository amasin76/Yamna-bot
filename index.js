const Discord = require('discord.js');
const YamnaBot = require("./handlers/ClientBuilder.js");
const client = new YamnaBot();
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
require('discord-buttons')(client)
require("./logger.js")(client);
//Handler
["module", "Event", "distube", "nsfw", "update"/*, "welcome"*/].forEach(handler => {
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
});*/
