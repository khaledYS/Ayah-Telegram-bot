const express = require("express");
const { handleTelegram } = require("../..");
const { json } = require("express/lib/response");
express.json()
// Create a bot instance

exports.handler = async (req) =>{
    let message = JSON.parse(req.body);
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