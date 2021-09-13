const moment = require('moment');

exports.run = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.name)
        .slice(0, -1);
    const userFlags = member.user.flags.toArray();
    let status;
    switch (member.presence.status) {
        case "online":
            status = ":green_circle: online";
            break;
        case "dnd":
            status = ":red_circle: dnd";
            break;
        case "idle":
            status = ":yellow_circle: idle";
            break;
        case "offline":
            status = ":black_circle: offline";
            break;
    }

    const flags = {
        DISCORD_EMPLOYEE: 'Discord Employee',
        DISCORD_PARTNER: 'Discord Partner',
        BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
        BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
        HYPESQUAD_EVENTS: 'HypeSquad Events',
        HOUSE_BRAVERY: 'House of Bravery',
        HOUSE_BRILLIANCE: 'House of Brilliance',
        HOUSE_BALANCE: 'House of Balance',
        EARLY_SUPPORTER: 'Early Supporter',
        TEAM_USER: 'Team User',
        SYSTEM: 'System',
        VERIFIED_BOT: 'Verified Bot',
        VERIFIED_DEVELOPER: 'Verified Bot Developer'
    };

    const embed = new Discord.MessageEmbed()
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setColor(member.displayHexColor || 'BLUE')
        .addField('User :', [
            `**❯ Username :** ${member.user.username}`,
            `**❯ Discriminator :** ${member.user.discriminator}`,
            `**❯ ID :** ${member.id}`,
            `**❯ Flags :** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
            `**❯ Avatar :** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
            `**❯ Time Created :** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} • ${moment(member.user.createdTimestamp).fromNow()}`,
            `**❯ Status : ** ${status}`,
            `**❯ Game :** ${member.user.presence.game || 'Not playing now.'}`,
            `\u200b`
        ])
        .addField('Member :', [
            `**❯ Residence Time :** ${moment(member.joinedTimestamp).fromNow()}`,
            `**❯ Highest Role :** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
            `**❯ Server Join Date :** ${moment(member.joinedAt).format('LL LTS')}`,
            `**❯ Hoist Role :** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
            `**❯ Roles [${roles.length}] :** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? roles.slice(0, 9).join(', ') + '...' : 'None'}`,
            `\u200b`
        ]);
    return message.channel.send({ embeds: [embed] });
}

/*const embed = new Discord.MessageEmbed()
    .setTitle(`${user.user.username} stats`)
    .setColor(`#f3f3f3`)
    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
    .addFields(
        {
            name: "Name: ",
            value: user.user.username,
            inline: true
        },
        {
            name: "#️⃣ Discriminator: ",
            value: `#${user.user.discriminator}`,
            inline: true
        },
        {
            name: "🆔 ID: ",
            value: user.user.id,
        },
        {
            name: "Current Status: ",
            value: status,
            inline: true
        },
        {
            name: "Activity: ",
            value: user.presence.activities[0] ? user.presence.activities[0].name : `User isn't playing a game!`,
            inline: true
        },
        {
            name: 'Avatar link: ',
            value: `[Click Here](${user.user.displayAvatarURL()})`
        },
        {
            name: 'Creation Date: ',
            value: user.user.createdAt.toLocaleDateString("en-GB"),
            inline: true
        },
        {
            name: 'Joined Date: ',
            value: user.joinedAt.toLocaleDateString("en-GB"),
            inline: true
        },
        {
            name: 'Residence Time : ',
            value: user.joinedTimestamp.toLocaleDateString("en-GB"),
            inline: true
        },
        {
            name: 'User Roles: ',
            value: user.roles.cache.map(role => role.toString()).join(" ,"),
            inline: false
        }
    )

await message.channel.send(embed)
}*/

exports.help = {
    name: "user-info",
    description: "get info's about any member",
    usage: "<prefix>user <member>",
    example: "=user @Ali"
};

exports.conf = {
    aliases: ["user"],
    cooldown: 5
}