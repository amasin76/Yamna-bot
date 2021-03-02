const blacklist = require('../../models/blacklistSchema')

exports.run = async (client, message, args) => {
    if (message.author.id !== '484524591696576523') return message.channel.send('This is an owner only command.')
    const User = message.guild.members.cache.get(args[0])
    if (!User) return message.channel.send('User is not valid.')

    blacklist.findOne({ id: User.user.id }, async (err, data) => {
        if (err) throw err;
        if (data) {
            await blacklist.findOneAndDelete({ id: User.user.id })
                .catch(err => console.log(err))
            message.channel.send(`**${User.displayName}** has been removed from blacklist.`)
        } else {
            message.channel.send(`**${User.displayName}** is not blacklisted.`)
        }

    })
}

exports.help = {
    name: "removeblacklist",
    description: "invisible",
    usage: "invisible",
    example: "invisible"
}

exports.conf = {
    aliases: ["rbl"],
    cooldown: 10
}