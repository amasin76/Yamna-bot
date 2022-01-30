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
            'pc': '937120830452797480',
            'ps': '937120833799868477',
            'xbox': '937120835834093629',
            'mobile': '937120837885112381',
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
            '60hz': '937132999177285652',
            '120hz': '937133000875995197',
            '240hz': '937133006030794812',
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
