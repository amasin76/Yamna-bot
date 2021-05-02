const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { delay } = require("../../handlers/functions")

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permissions to use this command');
    try {
        const text = args.join(" ")
        clearamount = Number(args[0]);
        if (clearamount >= 1 && clearamount <= 100) {
            message.channel.bulkDelete(clearamount);
        }
        else {
            let limit = clearamount > 1000 ? 1000 : clearamount;
            for (let i = 100; i <= limit; i += 100) {
                try {
                    await message.channel.bulkDelete(i);
                } catch { }
                await delay(1500);
            }
        }
        message.channel.send(new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle(`✅ ${clearamount} messages successfully deleted!`)
        ).then(msg => msg.delete({ timeout: 5000 }));
    } catch (e) {
        console.log(e.stock);
        return message.channel.send(new MessageEmbed()
            .setColor(config.wrongcolor)
            .setFooter(config.footertext, config.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stock}\`\`\``)
        );
    }
}
exports.help = {
    name: "clear",
    description: "Deletes messages in a text channel",
    usage: "<prefix>purge [Amount of messages]",
    example: "~purge"
}
exports.conf = {
    aliases: ["delete", "purge"],
    cooldown: 5
}