exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command');
    var roodxuser = roodx.mentions.members.first();
    var roodxrole = roodx.guild.roles.cache.find(r => r.id === "ايدي الرتبه");
    var roodxtimerole = roodx.content.split(' ').slice('3').join(" ")
    var roodxlog = roodx.guild.channels.cache.find(r => r.id === "ايدي روم الوق حق الرتب")
    var roodxrrrr = '`';
    var roodxrrr = "` ` `"; // شي المسافه الي بينهم علئ شان ما اقدر ارسله في الدسكورد 
    var embed123 = new Discord.MessageEmbed();

    if (!roodx.guild.me.hasPermission('MANAGE_ROLES')) return roodx.reply('** Please check My permissions ):**')
    if (!roodxuser) return roodx.channel.send(embed123
        .setTitle('**instructions**')
        .setDescription(`
**
[ TIME ] **
${roodxrrr}
 1h = 3600
 2h = 7200
 1d = 86400
 1week = 604800
 2week = 1209600
 1m= 2592000 
 1y = 31556952
${roodxrrr}

**Example:
${prefix}role @member 3600
**
`))
    if (!roodxrole) return roodx.reply("**please check the role name**")




    roodxuser.roles.add(roodxrole).then(r => {
        roodx.channel.send(`** Has Be Update Role to** ${roodxrole} \n \ **Name:${roodxuser} \n \  Time:${roodxrrrr}${roodxtimerole}${roodxrrrr}**`)
    })

    setTimeout(roodx => {
        roodxuser.roles.remove(roodxrole).then(roodx => {
            var embed = new Discord.MessageEmbed()
                .setTitle('**Role Is Ends**')
                .setAuthor(roodxuser.user.username, roodxuser.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail(roodxuser.user.avatarURL({ dynamic: true }))
                .setDescription(`**The member Role has expired**
        **Name Member:${roodxuser}
        Role Time:${roodxtimerole}
        **`)
            roodxlog.send(embed)
        })


    }, roodxtimerole * 1000)
}
exports.help = {
    name: "temprole",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "~simjoin"
}
exports.conf = {
    aliases: ["tempRole", "temp-role"],
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 5
}