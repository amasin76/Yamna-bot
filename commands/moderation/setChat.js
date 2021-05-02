const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permissions to use this command');
    try {
        if (!args[0])
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | You didn't provided a Method`)
                .setDescription(`Usage: \`${config.prefix}setup <add/remove> <#channel>\``)
            );
        if (args[0].toLowerCase() !== "add" && args[0].toLowerCase() !== "remove")
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | You didn't provided a **valid** Method`)
                .setDescription(`Usage: \`${config.prefix}setup <add/remove> <#channel>\``)
            );
        if (!args[1])
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | You didn't provided a Channel`)
                .setDescription(`Usage: \`${config.prefix}setup <add/remove> <#channel>\``)
            );
        if (args[1].length !== 18 && !message.mentions.channels.first())
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | You didn't provided a **valid** Channel`)
                .setDescription(`Usage: \`${config.prefix}setup <add/remove> <#channel>\``)
            );
        let channel = message.mentions.channels.first() || client.channels.cache.get(args[1]);
        if (!channel)
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | You didn't provided a **valid** Channel`)
                .setDescription(`Usage: \`${config.prefix}setup <add/remove> <#channel>\``)
            );
        if (args[0].toLowerCase() === "add") {
            if (client.chatbot.get(message.guild.id, "channels").includes(channel.id))
                return message.channel.send(new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | Your Channel is already, in the Setup!`)
                    .setDescription(`You can remove it by typing: \`${prefix}setup remove <#${channel.id}>\``)
                );
            client.chatbot.push(message.guild.id, channel.id, "channels");
            return message.channel.send(new MessageEmbed()
                .setColor(config.color)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`✅ SUCCESS | Added \`${channel.name}\` to the Setup!`)
                .setDescription(`You can now chat with me in: <#${channel.id}>`)
            );
        }
        else if (args[0].toLowerCase() === "remove") {
            if (!client.chatbot.get(message.guild.id, "channels").includes(channel.id))
                return message.channel.send(new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | Your Channel is NOT in the Setup!`)
                    .setDescription(`You can add it by typing: \`${prefix}setup add <#${channel.id}>\``)
                );
            client.chatbot.remove(message.guild.id, channel.id, "channels");
            return message.channel.send(new MessageEmbed()
                .setColor(config.color)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`✅ SUCCESS | Removed \`${channel.name}\` to the Setup!`)
                .setDescription(`You can no longer chat with me in: <#${channel.id}>`)
            );
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(config.wrongcolor)
            .setFooter(config.footertext, config.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
}
exports.help = {
    name: "setchat",
    description: "Setup Bot Channels (Adding / Removing setups)",
    usage: "<prefix>setup <add/remove> <#channel>",
    example: "~setup add #chatbot"
}

exports.conf = {
    aliases: ["setupchat", "chatbot"],
    cooldown: 5
}