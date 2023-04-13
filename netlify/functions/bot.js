const serverless = require("serverless-http");
const express = require("express");
const { bot } = require("../../index");
const app = express();
const router = express.Router();
app.use(express.json())

router.all("/", async (req, res)=>{
    try{
        console.log(req.body)
        const message = req.body ;
        await bot.handleUpdate(message)
        res.status(200).json({body: ""})
    }catch(err){
        console.log(err)
        res.status(401).json({body:"error didn't find out"})
    }
})


// setting up the express app
app.use("/.netlify/functions/bot", router)

exports.handler = serverless(app)