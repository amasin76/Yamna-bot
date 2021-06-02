const fetch = require("node-fetch");

exports.run = async (client, message, args) => {
    const from = args[0]; const to = args[1]; const amount = args[2];
    fetch(`https://currency-exchange.p.rapidapi.com/exchange?to=${to}&from=${from}&q=${amount}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "8d63291ce4mshfae0a8f4ae93d54p11a65djsn73856190cc2c",
            "x-rapidapi-host": "currency-exchange.p.rapidapi.com"
        }
    })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });//soccer - sunnah -
}
exports.help = {
    name: "ex",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "=simjoin"
}
exports.conf = {
    aliases: ["exchange"],
    cooldown: 5
}