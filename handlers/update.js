const config = require("../config.json");
module.exports = (c) => {
    c.on('messageUpdate', async (oldMsg, newMsg) => {
        try {
            if (["484524591696576524"].some(e => e === newMsg.author.id)) return;
            if (newMsg.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi) !== null) {
                newMsg.delete().then(() => {
                    newMsg.channel.send(`${newMsg.author}, **Invite links aren't allowed here**\n\`This message will be deleted in 15s\``).then(e => setTimeout(() => e.delete(), 15 * 1000))
                })
            }

            let shareLinks = ["twitch.tv/", "youtube.com/", "youtu.be/"]
            let whiteChannel = ["746777186714779770", "717058723692019772"]
            if (newMsg.author.bot) return;
            if (newMsg.channel.id == '749584245457944577' && newMsg.content.toLowerCase().includes('twitch')) return;
            if (!whiteChannel.includes(newMsg.channel.id) && shareLinks.some(word => newMsg.content.toLowerCase().includes(word))) {
                await newMsg.delete().catch(console.error);
                return await newMsg.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(config.wrongcolor)
                        .setFooter(config.footertext, newMsg.author.displayAvatarURL({ format: 'png', dynamic: false }))
                        .setTitle("⛔ Violation of Rules")
                        .setDescription(`__Channels Category__ (check <#714787304862122104>) \n\n \`Please use the correct channel for the topic you are posting about\` \n\n You can post Links in <#746777186714779770> or Clips in <#749584245457944577>`)]
                })
                    .then(msg => setTimeout(() => msg.delete(), 30 * 1000))
            }
        } catch (err) {
            console.log(err)
        }
    })
}