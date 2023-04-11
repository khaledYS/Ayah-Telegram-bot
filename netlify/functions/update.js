const { bot } = require("../../index");

exports.handler = async (req) =>{
    const message = JSON.parse(req.body);
    bot.processUpdate(message);
    return {
        statusCode: 200
    }
}