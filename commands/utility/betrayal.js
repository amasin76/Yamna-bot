const fetch = require("node-fetch");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
    if (!channel || channel.type !== "voice") {
        return await message.channel.send(new Discord.MessageEmbed()
            .setColor(config.wrongcolor)
            .setFooter(config.footertext, config.footericon)
            .setTitle("❌ | Invalid channel")
            .setDescription(`\`\`\`Join voice channel OR Provide room (Name/ID/Mention)\`\`\``))
            .then(msg => msg.delete({ timeout: 20000 }))
            .then(message.delete({ timeout: 30000 }))
    } //message.channel.send("❌ | Invalid channel specified! \n -Mention vioce chnnel OR Provide ID\nID:(activate visibilty ID by go Settigns>Advanced>Devloper mode = ON)");
    if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | I need `CREATE_INSTANT_INVITE` permission");
    try {
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 21600,
                max_uses: 0,
                target_application_id: "773336526917861400", // Betrayal.io
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
                message.channel.send(new Discord.MessageEmbed()
                    .setAuthor("Betrayal (Similar to Among Us)", "https://static.wikia.nocookie.net/versus-compendium/images/5/5f/Impostor.png/revision/latest?cb=20200912190532", `https://discord.gg/${invite.code}`)
                    .setColor("BLACK")
                    .setURL(`https://discord.gg/${invite.code}`)
                    .setDescription(`Click Me : https://discord.gg/${invite.code}\nChannel : \`${channel.name}\`\nCreated by : \`${message.author.username}\``)
                    .setFooter(config.footertext, config.footericon))
            })
            .catch(e => {
                message.channel.send("❌ | Could not start **YouTube Together**!");
            })
    } catch (err) {
        console.log(err)
    }
}
exports.help = {
    name: "betrayal",
    description: "Play Betrayal game together",
    usage: "<prefix>bty",
    example: "=bty"
}
exports.conf = {
    aliases: ["bty", "among-us", "among"],
    cooldown: 5
}