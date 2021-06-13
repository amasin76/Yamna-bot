exports.run = async (client, message, args) => {

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;

    if (!channel || channel.type !== "voice") {
        return await message.channel.send(new Discord.MessageEmbed()
            .setColor(config.wrongcolor)
            .setFooter(config.footertext, config.footericon)
            .setTitle("❌ | Invalid channel")
            .setDescription(`\`\`\`Join voice channel OR Provide room (Name/ID/Mention)\`\`\``))//\nYou can reach id by:\n1-\`Settigns >Advanced >Devloper mode = ON\`\n2-\`Right click on channel >copy ID\`
            .then(msg => msg.delete({ timeout: 20000 }))
            .then(message.delete({ timeout: 30000 }))
    }
    const channelMembers = channel.members

    for (const member of channelMembers) {
        const user = message.guild.members.cache.get(member[0]);
        if (user) {
            user.voice.setChannel(
                message.member.voice.channel,
                `Moveall Command was run by: ${message.author.tag}`
            );
        }
    }
};
exports.help = {
    name: "mvall",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "~simjoin"
}
exports.conf = {
    aliases: ["mall"],
    cooldown: 5
}