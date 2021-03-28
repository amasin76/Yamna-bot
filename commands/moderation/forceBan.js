const { BOT_OWNER } = process.env;

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) { return message.reply({ embed: { "description": "⛔ You do not have permissions to ban members", "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 })); }

    let userID = args[0];
    let reason = args.slice(1).join(" ");

    if (!userID) return message.channel.send({ embed: { "description": "❕ Please type the id", "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 }));
    if (isNaN(userID)) return message.channel.send({ embed: { "description": "❕ User id must be a number", "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 }));
    if (userID === message.author.id) return message.channel.send({ embed: { "description": "⛔ Suicide Ban! Why? u can't ban yourslef.", "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 }));
    if (userID === client.user.id) return message.channel.send({ embed: { "description": "⛔ Nice move, But why would I Ban myself!.", "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 }));
    if (userID === BOT_OWNER) return message.channel.send({ embed: { "description": "⛔ The one who u want ban him, He who developed me.", "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 }));
    if (!reason) reason = "(Outside Ban): No reason provided";

    client.users.fetch(userID).then(async (user) => {
        await message.guild.members.ban(user.id, { reason: `(Outside Ban): ${reason}` });
        return message.channel.send(`**${user.tag}** ✅ has been banned, from outside this server.`).then(msg => msg.delete({ timeout: 10000 }));
    }).catch(err => {
        message.channel.send({ embed: { "description": `❌Error: \`${err.message}\``, "color": 0xff2050 } }).then(msg => msg.delete({ timeout: 10000 }));
    })
}
exports.help = {
    name: "force-ban",
    description: "You can __Ban__ him using his id even if he is __not in the server__",
    usage: "fban <user.id> [reason]",
    example: "=fban 123456789123456789 cancer"
}

exports.conf = {
    aliases: ["fban", "forceban"],
    cooldown: 5
}