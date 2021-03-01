exports.run = async (client, message, args) => {
    if (message.author.id !== process.env.BOT_OWNER) {
        return message.channel.send(`⛔ **Restarting the BOT! is only allowed for the Developer** ⛔`)
    }
    await message.channel.send(`✅Done`)
    console.log('Bot rebooting...');
    process.exit();
}

exports.help = {
    name: "restart",
    description: " reboot/restart bot",
    usage: "restart",
    example: "/restart"
}

exports.conf = {
    aliases: ["restart", "reboot", "go", "exit"],
    cooldown: 5
}