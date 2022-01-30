module.exports = async (client, interaction) => {
    //Select Menu
    if (interaction.isSelectMenu()) { //Profile
        await interaction.deferReply({ ephemeral: true })

        const roleId = interaction?.values[0]
        const role = interaction.guild.roles.cache.get(roleId)
        const memberRoles = interaction.member.roles
        const hasRole = memberRoles.cache.has(roleId)

        //platforms
        const platformRoles = {
            'pc': '929428032400261160',
            'ps': '929428037131440128',
            'xbox': '929428042038771774',
            'mobile': '929428045197107240',
        }
        if (interaction.customId === 'platformRoles') {

            if (!roleId) return memberRoles.remove(Object.values(platformRoles)) //unchecked the option

            if (hasRole) {
                await memberRoles.remove(roleId)
                const embed = new Discord.MessageEmbed().setDescription(`✅ ${role.name} has been removed`);
                return interaction.followUp({ embeds: [embed] })
            } else {
                await memberRoles.remove(Object.values(platformRoles))
                await memberRoles.add(roleId)
                const embed = new Discord.MessageEmbed().setDescription(`✅ ${role.name} has been added`);
                return interaction.followUp({ embeds: [embed] })
            }
        }
        //Refersh Rate
        const refershRateRoles = {
            '60hz': '936607305775075419',
            '120hz': '936607422322200606',
            '240hz': '936607457965391872',
        }
        if (interaction.customId === 'rrRole') {

            if (!values[0]) return memberRoles.remove(Object.values(platformRoles)) //unchecked the option

            if (hasRole) {
                memberRoles.remove(roleId)
                interaction.followUp(`✅ ${role.name} has been removed`)
            } else {
                await memberRoles.remove(Object.values(refershRateRoles))
                memberRoles.add(roleId)
                interaction.followUp(`✅ ${role.name} has been added`)
            }
        }
    }
}
