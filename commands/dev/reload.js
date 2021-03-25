const { BOT_OWNER } = process.env;

exports.run = async (client, message, args) => {
    if (message.author.id !== BOT_OWNER) {
        return message.channel.send('❌ You must have the following permissions to use that: Bot Owner.')
    }
    if (!args[0]) return message.channel.send("Specify a category")
    if (!args[1]) return message.channel.send("Specify a command name")
    let category = args[0].toLowerCase();
    let command = args[1].toLowerCase();

    try {
        delete require.cache[require.resolve(`../../commands/${category}/${command}.js`)]
        client.commands.delete(command);

        const pull = require(`../../commands/${category}/${command}.js`);
        client.commands.set(command, pull);

        return message.channel.send(`✅Done Reloading: 🔄**${command}**`)
    } catch (err) {
        return message.channel.send(`Error Reloading **${command}**: \`${err.message}\``);
    }


}
exports.help = {
    name: "reload",
    description: "invisible",
    usage: "invisible",
    example: "invisible"
}

exports.conf = {
    aliases: ["r"],
    cooldown: 10
}