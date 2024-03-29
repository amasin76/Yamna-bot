Discord = require("discord.js");
const getprefix = require("../../util/getprefix");

exports.run = async (client, message, args) => {
    let prefix = await getprefix(message.guild.id);

    if (!args[0]) {
        // This will turn the folder (category) into array.
        let module = Array.from(client.helps.values());
        let dirEmojis = {
            Audio: '🔊',
            Dev: '💻',
            Economy: '💰',
            Football: '⚽',
            Games: '🎮',
            General: '📕',
            Moderation: '💼',
            Muslim: '🕋',
            Premium: '💎',
            Record: '📼',
            Together: '💞',
            Utility: '🔧'
        }

        // This will hide a folder from display that includes "hide: true" in their module.json
        if (!client.config.owners.includes(message.author.id)) module = client.helps.array().filter(x => !x.hide);
        const embed = new Discord.MessageEmbed()
            .setColor(0x1d1d1d)
            //.setTimestamp(new Date())
            .setTitle(`**Help Menu** || **Prefix** \`${prefix}\``)
            .setDescription(`**${message.guild.name}** 💖 Type \`${prefix}help [command]\` to get more specific info about a cmd.`)
            .setFooter("=-=-=-=-=-=-=-=-=-=> By: Bio")

        for (const mod of module) {
            // You can change the .join(" | ") to commas, dots or every symbol.
            embed.addField(`${dirEmojis[mod.name]} ${mod.name}`, mod.cmds.map(x => `\`${x}\``).join(" | "));
        }

        return message.channel.send({ embeds: [embed] });
    } else {
        let cmd = args[0];

        // If the user type the [command], also with the aliases.
        if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            let name = command.help.name; // The command name.
            let desc = command.help.description; // The command description.
            let cooldown = command.conf.cooldown + " second(s)"; // The command cooldown.
            let aliases = command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "No aliases provided.";
            let usage = command.help.usage ? command.help.usage : "No usage provided.";
            let example = command.help.example ? command.help.example : "No example provided.";

            let embed = new Discord.MessageEmbed()
                .setColor(0x7289DA)
                .setTitle(name)
                .setDescription(desc)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter("[] optional, <> required. Don't includes these things while typing a command.")
                .addField("Cooldown", cooldown)
                .addField("Aliases", aliases, true)
                .addField("Usage", usage, true)
                .addField("Example", example, true)

            return message.channel.send({ embeds: [embed] });
        } else {
            // If the user type the wrong command.
            return message.channel.send({ embed: { color: "RED", description: "Unknown command." } });
        }
    }
}

exports.help = {
    name: "help",
    description: "Show a command list.",
    usage: "help [command]",
    example: "=help verify"
}

exports.conf = {
    aliases: ["?"],
    cooldown: 5
}