const { includes } = require("old-wio.db")

module.exports = async (client, interaction) => {
    console.log(interaction.values)
    //Select Menu
    if (interaction.isSelectMenu()) { //Profile
        await interaction.deferReply({ ephemeral: true })

        const roleId = interaction?.values[0]
        const role = interaction.guild.roles.cache.get(roleId)
        const memberRoles = interaction.member.roles
        const hasRole = memberRoles.cache.has(roleId)
        const isSelected = !!roleId

        //platforms
        const platformRoles = {
            'pc': '929428032400261160',
            'ps': '929428037131440128',
            'xbox': '929428042038771774',
            'mobile': '929428045197107240',
        }
        if (interaction.customId === 'platformRoles') {

            const subRoles = Object.values(platformRoles).filter(i => !i.includes(roleId))

            if (!roleId) {

                memberRoles.remove(subRoles) //unchecked the option
                const embed = new Discord.MessageEmbed().setDescription(`✅ Your state has been reset`);
                interaction.followUp({ embeds: [embed] })
            } else if (hasRole && !isSelected) {
                memberRoles.remove(roleId)
                const embed = new Discord.MessageEmbed().setDescription(`✅ <@&${role.id}> role has been removed`);
                interaction.followUp({ embeds: [embed] })
            } else if (hasRole && isSelected) {
                const embed = new Discord.MessageEmbed().setDescription(`✅ Already you have <@&${role.id}> role`);
                interaction.followUp({ embeds: [embed] })
            } else {
                await memberRoles.remove(subRoles)
                memberRoles.add(roleId)
                const embed = new Discord.MessageEmbed().setDescription(`✅ <@&${role.id}> role has been added`);
                interaction.followUp({ embeds: [embed] })
            }
        }
        //Refersh Rate
        const refershRateRoles = {
            '60hz': '936607305775075419',
            '120hz': '936607422322200606',
            '240hz': '936607457965391872',
        }
        if (interaction.customId === 'rrRole') {

            const subRoles = Object.values(refershRateRoles).filter(i => !i.includes(roleId))

            if (!roleId) {
                memberRoles.remove(subRoles) //unchecked the option
                const embed = new Discord.MessageEmbed().setDescription(`✅ Your state has been reset`);
                interaction.followUp({ embeds: [embed] })
            } else if (hasRole && !isSelected) {
                memberRoles.remove(roleId)
                const embed = new Discord.MessageEmbed().setDescription(`✅ <@&${role.id}> role has been removed`);
                interaction.followUp({ embeds: [embed] })
            } else if (hasRole && isSelected) {
                const embed = new Discord.MessageEmbed().setDescription(`✅ Already you have <@&${role.id}> role`);
                interaction.followUp({ embeds: [embed] })
            } else {
                await memberRoles.remove(subRoles)
                memberRoles.add(roleId)
                const embed = new Discord.MessageEmbed().setDescription(`✅ <@&${role.id}> role has been added`);
                interaction.followUp({ embeds: [embed] })
            }
        }
    }
}
