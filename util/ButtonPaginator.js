const { MessageButton, MessageActionRow, Collector } = require('discord.js');

const paginator = async (msg, pages) => {
    if (!msg && !msg.channel) throw new Error("Provide a message to access the channel")
    if (!pages) throw new Error("Please provide pages")
    let page = 0
    const btn1 = new MessageButton().setEmoji("⏪").setCustomId("prev").setStyle("PRIMARY")
    const btn2 = new MessageButton().setEmoji("⏩").setCustomId("next").setStyle("PRIMARY")
    const btn3 = new MessageButton().setEmoji("🏠").setCustomId("home").setStyle("PRIMARY")
    const row = new MessageActionRow().addComponents([btn1, btn3, btn2])

    const btn1after = new MessageButton().setEmoji("⏪").setCustomId("prev").setStyle("PRIMARY").setDisabled()
    const btn2after = new MessageButton().setEmoji("⏩").setCustomId("next").setStyle("PRIMARY").setDisabled()
    const btn3after = new MessageButton().setEmoji("🏠").setCustomId("home").setStyle("PRIMARY").setDisabled()
    const deadRow = new MessageActionRow().addComponents([btn1after, btn3after, btn2after])

    const curPage = await msg.channel.send({ embeds: [pages[0]], components: [row] })
    // const filter = (b) => ['prev', 'next'].includes(b.id)
    const filter = button => button.user.id === msg.author.id
    const col = await curPage.createMessageComponentCollector({ filter, time: 30 * 1000 })

    col.on('collect', button => {
        button.deferUpdate();
        //if(button.clicker.user.id !== msg.author.id) return
        if (button.customId == "prev") {
            page = page > 0 ? --page : pages.length - 1;
        } else if (button.customId == "next") {
            page = page + 1 < pages.length ? ++page : 0;
        } else if (button.customId == 'home') {
            page = 0
        }

        curPage.edit({ embeds: [pages[page]], components: [row] })
    })
    col.on('end', () => {
        console.log(curPage.deleted)
        if (!curPage.deleted) {
            curPage.edit({ embeds: [pages[page]], components: [deadRow] })
        }
    })

    return curPage
}

module.exports = paginator