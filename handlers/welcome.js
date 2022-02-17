const { MessageEmbed } = require("discord.js");
const { Invites } = require('../util/fetchData');
const moment = require('moment');
let { unicolor, imageLink, channel } = require('../config.json')
const universalColor = unicolor.toUpperCase()
const canvas = require('discord-canvas'),
    welcomeCanvas = new canvas.Welcome()
//channel = '712769961004630171'

module.exports = client => {

    const InvitesTracker = require('@androz2091/discord-invites-tracker');
    const tracker = InvitesTracker.init(client, {
        fetchGuilds: true,
        fetchVanity: true,
        fetchAuditLogs: true
    });

    tracker.on('guildMemberAdd', async (member, type, invite) => {

        if (member.guild.id !== '527174592528252934') return;
        try {
            let image = await welcomeCanvas
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator)
                .setMemberCount(member.guild.memberCount)
                .setGuildName(`| THE EPICS |`)
                .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
                //.setColor("border", universalColor)
                //.setColor("username-box", universalColor)
                .setColor("discriminator-box", universalColor)
                .setColor("message-box", universalColor)
                .setColor("title", universalColor)
                .setColor("avatar", universalColor)
                .setBackground(imageLink)
                .toAttachment()//1024 * 450

            let welcomeImage = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");

            await member.guild.channels.cache.find(c => c.id === channel).send({ files: [welcomeImage] })

            const embed = new MessageEmbed()
                .setDescription(`✨ **Welcome 💖__${member.user}__💖 to  ${member.guild.name}** \n✨ **Invited by 💌 __${invite?.inviter?.tag}'s__ 💌 Invite\***`)
                .setColor("#8015EA")
                .setFooter(`Acc age: 📆 ${moment(member.user.createdTimestamp).fromNow()}  ●  Code: 🔑 ${invite?.code || 'n/a'}  ●  Type: ✈ ${type}`)


            const joinChannel = member.guild.channels.cache.find(c => c.id === channel)
            if (joinChannel) joinChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        } catch (err) { console.log(err) }

        //DB
        if (invite.inviter && type === 'normal') {
            const inGuild = { state: true }
            const t = await Invites(member, inGuild, invite)
            console.log(t)
        }

    })
}


    //-------------------------------------

/*client.on("inviteCreate", async invite => {

    if (invite.guild.id !== '527174592528252934') return;
    guildInvites.set(invite.guild.id, await invite.guild.invites.fetch({ cache: true }))

});

client.on("ready", () => {

    client.guilds.cache.forEach(guild => {
        guild.invites.fetch({ cache: false })
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });

});

client.on('guildMemberAdd', async member => {

    if (member.guild.id !== '527174592528252934') return;
    try {
        let image = await welcomeCanvas
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(`| THE EPICS |`)
            .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
            //.setColor("border", universalColor)
            //.setColor("username-box", universalColor)
            .setColor("discriminator-box", universalColor)
            .setColor("message-box", universalColor)
            .setColor("title", universalColor)
            .setColor("avatar", universalColor)
            .setBackground(imageLink)
            .toAttachment()//1024 * 450

        let welcomeImage = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");

        await member.guild.channels.cache.find(c => c.id === channel).send(await { files: [welcomeImage] })
    } catch (err) { console.log(err) }

    try {
        const cachedInvites = guildInvites.get(member.guild.id);
        const newInvites = await member.guild.invites.fetch({ cache: true })
        guildInvites.set(member.guild.id, newInvites);

        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses)

        let tempInvite;
        if (!usedInvite) {
            tempInvite = cachedInvites.filter(e => !newInvites.find(a => e.code == a.code))
            tempInvite = tempInvite.first()
        }

        const embed = new MessageEmbed()
            //.setTitle(`Welcome to ${member.guild.name}`)
            //.setDescription(`Hello ${member}, you are our ${member.guild.memberCount}th member\nJoined using ${usedInvite.inviter.username}'s link\nNumber of uses: ${usedInvite.uses}\nInvite Link: ${usedInvite.url}`)
            .setDescription(`✨ **Welcome 💖__${member.user}__💖 to  ${member.guild.name}** \n✨ **Invited by 💌 __${usedInvite?.inviter?.tag || tempInvite?.inviter?.username}'s__ 💌 Invite\***`)
            .setColor("#8015EA")
            .setFooter(`Acc age: 📆 ${moment(member.user.createdTimestamp).format('LL')} ● ${moment(member.user.createdTimestamp).fromNow()}  |  Code: ${usedInvite?.code || tempInvite?.code} 🔑`)
        //.setTimestamp()

        const joinChannel = member.guild.channels.cache.find(c => c.id === channel) //member.guild.channels.cache.find(channel => channel.id === "717082044022390877")
        //setTimeout(() => {
        if (joinChannel) joinChannel.send({ embeds: [embed] }).catch(err => console.log(err))

    }
    catch (err) { console.log(err); }
})
}*/