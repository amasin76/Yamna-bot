const Prefix = require("../../models/prefixSchema");

exports.run = async (client, message, args) => {
    const prefix = args[0];
    if (!prefix)
        return message.channel.send("Hey you need to provide a prefix");

    const result = await Prefix.findOne({
        guildID: message.guild.id,
    });

    if (result) {
        result.prefix = prefix;
        result.save();

        message.channel.send(`The prefix is now ${prefix}`);
    } else if (!result) {
        const data = new Prefix({
            guildID: message.guild.id,
            prefix: prefix,
        });
        data.save();

        message.channel.send(`The prefix is now ${prefix}`);
    }
}
exports.help = {
    name: "setprefix",
    description: "set custom server prefix",
    usage: "tmute @user <time>",
    example: "~tmute @sam 1h"
}

exports.conf = {
    aliases: ["sp"],
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 5
}