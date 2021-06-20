exports.run = (client, message, args) => {
    //const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let flipcoin = ["👑**TAJ**", "🧛**MALIK**"];
    let randomIndex = Math.floor(Math.random() * flipcoin.length);

    message.channel.send(`**=>** ${flipcoin[randomIndex]}`);
}

exports.help = {
    name: "coin",
    description: "Flip coin"
}
exports.conf = {
    aliases: ["1dh"],
    cooldown: 10
}