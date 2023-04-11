const TelegramBot = require("node-telegram-bot-api");
const { handleTelegram } = require("../..");
// Create a bot instance

exports.handler = async (req) =>{
    const message = JSON.parse(req.body);
    handleTelegram(message)
    return {
        statusCode: 200
    }
}