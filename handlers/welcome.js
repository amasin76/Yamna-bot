const { MessageEmbed } = require("discord.js");
const moment = require('moment');
const { unicolor, imageLink, channel } = require('../config.json')
let universalColor = unicolor.toUpperCase()
const canvas = require('discord-canvas'),
    welcomeCanvas = new canvas.Welcome()


module.exports = client => {
    client.on('guildMemberAdd', async member => {
        let image = await welcomeCanvas
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(`\`${member.guild.name}\``)
            .setAvatar(member.user.displayAvatarURL({
                format: 'png'
            }))
            .setColor("border", universalColor)
            .setColor("username-box", universalColor)
            .setColor("discriminator-box", universalColor)
            .setColor("message-box", universalColor)
            .setColor("title", universalColor)
            .setColor("avatar", universalColor)
            .setBackground(imageLink)
            .toAttachment()


        let attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");

        member.guild.channels.cache.find(c => c.id === channel).send(attachment)
    })
    //Welcome Msg========================
    const guildInvites = new Map();
    client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
    client.on("ready", () => {
        console.log(`${client.user.tag} is Online`)
        client.guilds.cache.forEach(guild => {
            guild.fetchInvites()
                .then(invites => guildInvites.set(guild.id, invites))
                .catch(err => console.log(err));


        });
    });

    client.on("guildMemberAdd", async member => {
        const cachedInvites = guildInvites.get(member.guild.id);
        const newInvites = await member.guild.fetchInvites();
        guildInvites.set(member.guild.id, newInvites);

        try {
            const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
            const embed = new MessageEmbed()
                //.setTitle(`Welcome to ${member.guild.name}`)
                //.setDescription(`Hello ${member}, you are our ${member.guild.memberCount}th member\nJoined using ${usedInvite.inviter/*.username*/}'s link\nNumber of uses: ${usedInvite.uses}\nInvite Link: ${usedInvite.url}`)
                .setDescription(`✨ **Welcome 💖__${member.user}__💖 to ${member.guild.name}** \n✨ **Invited by 💌 __${usedInvite.inviter.tag/*.username*/}'s__ 💌 Invite**`)
                .setColor("#8015EA")
                .setFooter(`Acc age: 📆 ${moment(member.user.createdTimestamp).format('LL')} ● ${moment(member.user.createdTimestamp).fromNow()}  |  Code: ${usedInvite.code} 🔑`)
            //.setTimestamp()

            const joinChannel = member.guild.channels.cache.find(c => c.id === channel) //member.guild.channels.cache.find(channel => channel.id === "717082044022390877")
            setTimeout(() => {
                if (joinChannel) {
                    joinChannel.send(embed).catch(err => console.log(err))

                }
            }, 2000)
        }
        catch (err) { console.log(err); }
    })
}