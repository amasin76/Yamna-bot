exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command');
    client.emit('guildMemberAdd', message.member)
}
exports.help = {
    name: "simjoin",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "~simjoin"
}
exports.conf = {
    aliases: ["simulationjoin"],
    cooldown: 5
}