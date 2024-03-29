const fetch = require("node-fetch");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
    if (!channel || channel.type !== "GUILD_VOICE") {
        return await message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle("❌ | Invalid channel")
                .setDescription(`\`\`\`Join voice channel OR Provide room (Name/ID/Mention)\`\`\``)]
        })//\nYou can reach id by:\n1-\`Settigns >Advanced >Devloper mode = ON\`\n2-\`Right click on channel >copy ID\`
        //.then(msg => msg.delete({ timeout: 20000 }))
        //.then(message.delete({ timeout: 30000 }))
    }
    if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | I need `CREATE_INSTANT_INVITE` permission");
    try {
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 21600,
                max_uses: 0,
                target_application_id: "755600276941176913", // youtube together
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${process.env.SECRET}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("❌ | Could not start **YouTube Together**!");
                message.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor("Youtube Together", "https://www.transparentpng.com/thumb/youtube/youtube-logo-png-pictures-15.png", `https://discord.gg/${invite.code}`)
                        .setColor(config.wrongcolor)
                        .setURL(`https://discord.gg/${invite.code}`)
                        .setDescription(`Click Me : https://discord.gg/${invite.code}\nChannel : \`${channel.name}\`\nCreated by : \`${message.author.username}\``)
                        .setFooter(config.footertext, config.footericon)]
                })
            })
            .catch(e => {
                message.channel.send("❌ | Could not start **YouTube Together**!");
            })
    } catch (err) {
        console.log(err)
    }
}
exports.help = {
    name: "youtube",
    description: "To watch youtube together",
    usage: "<prefix>yt",
    example: "-yt"
}
exports.conf = {
    aliases: ["yt", "ytt", "y2g"],
    cooldown: 5
}