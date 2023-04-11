const { handleTelegram } = require("../..");
// Create a bot instance

exports.handler = async (req) =>{
    // const message = JSON.parse(req.body);
    console.log(req, "here")
    // handleTelegram(message)
    return {
        statusCode: 200
    }
}