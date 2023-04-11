const { handleTelegram } = require("../..");
// Create a bot instance

exports.handler = async (req) =>{
    let message = req.body.message;
    message = JSON.stringify(message);
    message = JSON.parse(message);
    console.log(message, "here")
    try{
        await handleTelegram(message)
        console.log("finished the one")
    }catch (e){
        console.log(e)
    }finally{
        console.log("finished")
    }
    return {
        statusCode: 200
    }
}