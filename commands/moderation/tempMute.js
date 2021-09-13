exports.run = async (client, message, args) => {
    const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    const time = args[1]
    if (!Member) return message.channel.send('Member is not found.')
    if (!time) return message.channel.send('Please specify a time [minute].')
    if (1 > parseInt(time) || 1440 < parseInt(time)) return message.channel.send('allowed range [ min: 1 - max: 1440(24h) ]')
    const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted')
    if (!role) {
        try {
            message.channel.send('Muted role is not found, attempting to create muted role ▐ ▐ ▐ . . . ')

            let muterole = await message.guild.roles.create({
                data: {
                    name: 'muted',
                    permissions: []
                }
            });
            message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                await channel.createOverwrite(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
            });
            message.channel.send('Muted role has sucessfully been created.')
        } catch (error) {
            console.log(error)
        }
    };
    let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')
    if (Member.roles.cache.has(role2.id)) return message.channel.send(`${Member.displayName} has already been muted.`)
    await Member.roles.add(role2)
    message.channel.send(`${Member.displayName} is now muted.`)

    setTimeout(async () => {
        await Member.roles.remove(role2)
        message.channel.send(`${Member.displayName} is now unmuted`)
    }, time * 1000 * 60)
}

exports.help = {
    name: "tmute",
    description: " temp mute a user",
    usage: "tmute @user <time>",
    example: "~tmute @sam 1h"
}

exports.conf = {
    aliases: ["tm"],
    userPermissions: ["MANAGE_GUILD"],
    cooldown: 5
}