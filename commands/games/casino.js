exports.run = async (client, message, args) => {
    let slot1 = ['🍏', '🍍', '🍑', '🍓'];
    let slots1 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let slots2 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let slots3 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let we;
    if (slots1 === slots2 && slots2 === slots3) {
        we = "✨ **Win!** "
    } else {
        we = "❌ **Lose!** "
    }
    message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
};
exports.help = {
    name: 'fruit'
}
exports.conf = {
    aliases: ["casino"]
}