const express = require("express");
const { handleTelegram } = require("../..");
express.json()
// Create a bot instance

exports.handler = async (req) =>{
    const jsooneed = await req.json();
    console.log("starttyy", jsooneed, "enddyyyy")
    let message = req["body"].message;
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