const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
// Create a bot instance
const bot = new TelegramBot(token);

exports.handler = async (req) =>{
    const message = JSON.parse(req.body);
    await bot.processUpdate(message);
    return {
        statusCode: 200
    }
}