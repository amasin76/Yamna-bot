exports.run = async (client, message, args) => {
    const voicechannel = message.member.voice.channel;
    if (!voicechannel) return message.channel.send("Please join a voice channel first!");

    message.member.voice.channel.leave();
    message.channel.send("Finished writing audio");
}
exports.help = {
    name: 'rstop'
}
exports.conf = {
    aliases: ["recstop"]
}