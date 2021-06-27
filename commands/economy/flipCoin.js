exports.run = (client, message, args) => {
    //const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let flipcoin = ["👑**TAJ**", "🧛**MALIK**"];
    let randomIndex = Math.floor(Math.random() * flipcoin.length);

    //message.channel.send(`**=>** ${flipcoin[randomIndex]}`);

    const taj = 'https://cdn.discordapp.com/attachments/713816205814661232/857888723738951700/taj-final.png'
    const malik = 'https://cdn.discordapp.com/attachments/713816205814661232/857888742546997278/malik-fianl.png'

    message.channel.send(randomIndex === 1 ? taj : malik);
}

exports.help = {
    name: "coin",
    description: "Flip coin"
}
exports.conf = {
    aliases: ["1dh"],
    cooldown: 10
}