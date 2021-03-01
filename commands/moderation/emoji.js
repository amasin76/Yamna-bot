const { Util } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANNAGE_MESSAGES')) return;
    if (!args.length) return message.reply("please specify some emojis!");

    for (const rawEmoji of args) {
        const parsedEmoji = Util.parsedEmoji(rawEmoji);

        if (parsedEmoji.id) {
            const extension = parsedEmoji.animated ? ".gif" : ".png";
            const url = `http://cdn.dicordapp.com/emojis/${parsedEmoji.id + extension}`;
            message.guild.emojis
                .create(url, parsedEmoji.name)
                .then((emoji) => message.channel.send(`Added: \`${emoji.url}\``));
        }
    }
}
exports.help = {
    name: "emoji",
    description: " temp mute a user",
    usage: "tmute @user <time>",
    example: "~tmute @sam 1h"
}

exports.conf = {
    aliases: ["steal-emoji"],
    cooldown: 5
}
