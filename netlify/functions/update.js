const { handleTelegram } = require("../..");
// Create a bot instance

exports.handler = async (req) =>{
    const message = req.body.message;
    console.log(req.body, "here")
    try{
        await handleTelegram(message)
    }catch (e){
        console.log(e)
    }
    return {
        statusCode: 200
    }
}