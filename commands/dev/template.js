const { MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.run = async (client, message, args) => {
    if (message.author.id !== process.env.BOT_OWNER) message.channel.send(`⛔ **This CMD only for Dev** ⛔`)

    const row1 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('platformRoles')
                .setPlaceholder('Click to select Platform')
                .setMaxValues(1)
                .setMinValues(0)
                .addOptions([
                    {
                        emoji: "🖥",
                        label: "PC",
                        value: "929428032400261160",
                    },
                    {
                        emoji: "🎮",
                        label: "PlayStation",
                        value: "929428037131440128",
                    },
                    {
                        emoji: "🎮",
                        label: "XBOX",
                        value: "929428042038771774",
                    },
                    {
                        emoji: "📱",
                        label: "Mobile",
                        value: "929428045197107240",
                    },
                ])
        )
    const row2 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('rrRole')
                .setPlaceholder('Click to select Refresh-Rate')
                .setMaxValues(1)
                .setMinValues(0)
                .addOptions([
                    {
                        emoji: "🟡",
                        label: "60 ~ 75 Hz",
                        value: "936607305775075419",
                    },
                    {
                        emoji: "🟢",
                        label: "120 ~ 144 Hz",
                        value: "936607422322200606",
                    },
                    {
                        emoji: "🔵",
                        label: "240 Hz",
                        value: "936607457965391872",
                    },
                ])
        )
    await message.channel.send({ content: "Select Menu : Platform & Refresh Rate", components: [row1, row2] })
}
exports.help = {
    name: 'custom',
    description: '',
    usage: '<prefix>',
    example: '='
}
exports.conf = {
    aliases: [],
    userPermissions: [],
    cooldown: 5
}