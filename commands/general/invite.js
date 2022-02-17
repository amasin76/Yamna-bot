const { MessageEmbed } = require("discord.js");
const { getMember, secondsToTime } = require('../../handlers/functions')
const Invite = require('../../models/inviterSchema')
const btPages = require('../../util/ButtonPaginator')

exports.run = async (client, message, args) => {

    const target = getMember(message, args[0]) || message.author

    const result = await Invite.aggregate([
        {
            '$match': {
                '_id': target.id
            }
        }, {
            '$project': {
                '_id': 1,
                'inviter.total': 1,
                'inviter.active': 1,
                'invitedUsers.available': 1,
                'invitedUsers.left': 1,
                'invitedUsers.invitedId': 1,
                'invitedUsers.invitedName': 1,
                'invitedUsers.highestRole': 1,
                'invitedUsers.joinedAt': 1
            }
        }, {
            '$unwind': {
                'path': '$invitedUsers'
            }
        }, {
            '$sort': {
                'invitedUsers.joinedAt': -1
            }
        }, {
            '$group': {
                '_id': '$_id',
                inviter: { $addToSet: '$inviter' },
                'invitedUsers': {
                    '$push': '$invitedUsers'
                }
            }
        }
    ])

    let users = result[0].invitedUsers
    const { total, active } = result[0].inviter[0]

    const joinCounts = {};
    const usersName = users.map(el => el.invitedId)
    usersName.forEach(x => { joinCounts[x] = (joinCounts[x] || 0) + 1; });

    let str1 = users.map(user => {
        return `<@${user.invitedId}>\n\`\`\`fix\n${!user.available ? user.left.residenceTime : 'in'} | Joins: x${joinCounts[user.invitedId]} | Residence : ${secondsToTime((Date.now() - user.joinedAt) / 1000)[0]}\`\`\``
    })

    const embed1 = new MessageEmbed()
        .setTitle(`💚 INVITED USERS BY: ${target?.user?.username || target?.username}`)
        .setDescription(`\n${str1.join('\n')} \n`)
        .setFields(
            {
                name: ':kite:Total',
                value: `\`\`\`js\n${total.toString()}\n\`\`\``,
                inline: true
            },
            {
                name: '🔋Active',
                value: `\`\`\`js\n${active.toString()}\n\`\`\``,
                inline: true
            },
            {
                name: '💔Left',
                value: `\`\`\`js\n${(total - active).toString()}\n\`\`\``,
                inline: true
            },
        )
        .setFooter('❕ track invites start recording in our database since 13/02/2022')
        .setColor('GREEN')

    let entrieCount = users.length
    if (entrieCount <= 6) return message.channel.send({ embeds: [embed1] })


    //Pagination if inviter have more than 6 users
    let pageCount = Math.ceil(users.length / 5)
    if (pageCount > 5) pageCount = 5
    if (entrieCount > 6) pageCount = 6

    let count = 0, embeds = [], embed

    for (let i = 1; i <= pageCount; i++) {

        let str = ''
        for (let j = 1; j <= 6; j++) {
            count++
            str += `<@${users[j].invitedId}> [${count}]\n\`\`\`fix\n${!users[j].available ? users[j].left.residenceTime : 'in'} | Joins: x${joinCounts[users[j].invitedId]} | Residence : ${secondsToTime((Date.now() - users[j].joinedAt) / 1000)[0]}\`\`\``
        }

        embed = new MessageEmbed()
            .setTitle(`💚 INVITED USERS BY: ${target?.user?.username || target?.username}`)
            .setDescription(`\n${str}\n`)
            .setFooter(`❕ Pages: ${i}/6 Total: ${Math.ceil(users.length / 5)} | Recording Since 13/02/2022`)

        embeds.push(embed)
    }

    embeds[0].setFields(
        {
            name: ':kite:Total',
            value: `\`\`\`js\n${total.toString()}\n\`\`\``,
            inline: true
        },
        {
            name: '🔋Active',
            value: `\`\`\`js\n${active.toString()}\n\`\`\``,
            inline: true
        },
        {
            name: '💔Left',
            value: `\`\`\`js\n${(total - active).toString()}\n\`\`\``,
            inline: true
        },
    )

    btPages(message, embeds)
}
exports.help = {
    name: 'invite',
    description: "get inviter info's",
    usage: '<prefix>',
    example: '-'
}
exports.conf = {
    aliases: ['inv'],
    userPermissions: [],
    cooldown: 5
}