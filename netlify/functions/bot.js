const serverless = require("serverless-http");
const express = require("express");
const { bot } = require("../..");
const app = express();
const router = express.Router();

router.all("/", async (req, res)=>{
    console.log(req.body)
    console.log("recieved")
    await bot.processUpdate(req.body)
    res.sendStatus(200)
})


// setting up the express app
app.use(express.json())
app.use("/.netlify/functions/bot", router)

exports.handler = serverless(app)