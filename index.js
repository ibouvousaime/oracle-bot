require('dotenv').config()
const Tgfancy = require("tgfancy");
const oracleData = require('./oracle-data.json')

const bot = new Tgfancy(process.env.telegram_token, {
    polling:true, 
    tgfancy: {
        option: "value",
    }
});


function getDiceNumbers(){
    return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
}


function getRandomOracleMessage() {
    let numbers = getDiceNumbers()
    let message = oracleData.filter(line => line["#1"] == numbers[0] && line["#2"] == numbers[1] && line["#3"] == numbers[2])[0]
    return message.Oracle.includes("—") ? getRandomOracleMessage() : message
}



function generateGoogleLuckyLink(source, book, line) {
    return `http://www.google.com/search?q=${source}+${book}+${line}&btnI`
}


function sendOracleMessage(chatId, msg) {
    return new Promise((resolve, reject)=> {
        let message = getRandomOracleMessage()
        const sourceLink = `${generateGoogleLuckyLink(message.Source, message.Book, message.Line)}`
        let formattedOracleMessage = 
        `The oracle's message to <b>${msg.text}</b>: \n\n` +
        `<i>"${message.Oracle}"</i>\n\n` +
        `<a href="${sourceLink}">Source: ${message.Source}, Book: ${message.Book}, Line: ${message.Line}</a>\n\n`+ 
        `<code>${message.Source} Book ${message.Book} Line ${message.Line}</code>`;
                bot.sendMessage(chatId, formattedOracleMessage, {parse_mode:"HTML", disable_web_page_preview: true}).then(()=> {
            console.log("sent", formattedOracleMessage)
            resolve()
        }).catch(err=> {
            console.error(err)
            reject()
        })
    })

}

bot.on('message', async (msg)=> {
    const chatId = msg.chat.id;
    if (msg.text.trim().length && !msg.text.includes("/")) {
        sendOracleMessage().catch(err=> {
            sendOracleMessage(chatId, msg)
        })
    }
    else if (msg.text == '/start') {
        bot.sendMessage(chatId, "Welcome, please send me someone's name and I will predict their future.")
    }
    else {
        bot.sendMessage(chatId, "Send me a name instead, please.").catch(err=> {
            console.error(err)
        })
    }
})

