require('dotenv').config()
const Tgfancy = require("tgfancy");
const oracleData = require('./oracle-data.json')

const bot = new Tgfancy(process.env.telegram_token, {
    polling:true,
    // all options to 'tgfancy' MUST be placed under the
    // 'tgfancy' key, as shown below
    tgfancy: {
        option: "value",
    },
});

function getDiceNumbers(){
    return [Math.floor(Math.random() * 5) + 1,Math.floor(Math.random() * 5) + 1,Math.floor(Math.random() * 5) + 1]
}

function getRandomOracleMessage() {
    let numbers = getDiceNumbers()
    console.log(numbers)
    let message = oracleData.filter(line=> line["#1"] == numbers[0] && line["#2"] == numbers[1] && line["#3"] == numbers[2])[0]
    return message
}

bot.on('message', (msg)=> {
    const chatId = msg.chat.id;
    let message = getRandomOracleMessage()
    let formattedOracleMessage = `${message.Oracle} (Source: ${message.Source}, Book: ${message.Book}, Line : ${message.Line})`
    bot.sendMessage(chatId,formattedOracleMessage).then(()=> {

    }).catch(err=> {
        console.error(err)
    })
})