
const puppeteer = require('puppeteer')
const moment = require('moment');


exports.run = async (client, message, args) => {
    let startTime = new Date();
    const progressMessage = await message.channel.send(`:pick: Gathering screenshot`);

    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        headless: false,
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    try {

        const page = await browser.newPage();
        await page.goto('https://www.goal.com/en/tables/', { waitUntil: 'load', timeout: 90 * 1000 })
        await page.setViewport({ width: 1920, height: 1080 });

        // get a list of all elements - same as document.querySelectorAll('*')
        const elements = await page.$$('.p0c-competition-tables__table-container')
        const titles = await page.evaluate(() =>
            Array.from(document.querySelectorAll(".p0c-competition-tables__table-header-link")).map(title => title.innerText.trim()
            ))

        for (var i = 0; i < 6/*elements.length*/; i++) {
            //await elements[i].screenshot({ path: `assets/screenshot/${i}.png` })
            let imageBuffer = await elements[i].screenshot({ omitBackground: false })
            let title = await titles[i]

            await message.channel.send({
                content: `${title}`, files: [{ attachment: imageBuffer }]
            });
        }
    } catch (e) {
        console.log(`couldnt take screenshot of element with index: ${i}. cause: `, e)
        progressMessage.edit(`Error: ${e.message || e}`);
    } finally {
        await browser.close();
    }

    let endTime = new Date();
    progressMessage.delete();
    const timeDifference = endTime - startTime

    message.channel.send(`:white_check_mark: Success :stopwatch: ${parseInt((timeDifference) / 1000)}s`).then(msg => msg.delete({ timeout: 15000 }))
}
exports.help = {
    name: "foot",
    description: "real-time rates of all currencies we support",
    usage: "<prefix>ex",
    example: "=ex"
}
exports.conf = {
    aliases: [],
    cooldown: 5
}
//p0c-competition-tables__table-container
//title: p0c-competition-tables__table-header-link