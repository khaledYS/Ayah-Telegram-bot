const { handleTelegram } = require("../../index");

exports.handler = async (req) =>{
    const message = JSON.parse(req.body);
    await handleTelegram(message)
    return {
        statusCode: 200
    }
}