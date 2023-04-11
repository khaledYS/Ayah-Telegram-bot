const express = require("express");
const { handleTelegram } = require("../..");
const { json } = require("express/lib/response");
express.json()
// Create a bot instance

exports.handler = async (req) =>{
    const jsooneed = JSON.parse(req);
    console.log("starttyy", jsooneed, "enddyyyy")
    let message = jsooneed.body.message;
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