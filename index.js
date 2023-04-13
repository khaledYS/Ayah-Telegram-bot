const express = require("express");
const serverless = require('serverless-http');
const { getRandomAyah, getRandomPage, preStored, ayahOptions } = require("./utils");
const {
    getAyahTafsir,
    getAyah,
    getAyahAudio,
    getPage,
    getPageTafsir,
} = require("./quran-api.js");
const { set } = require("express/lib/application");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const token = process.env.TOKEN;
const bot = new Telegraf(token);
const url = `https://ayah-bot.netlify.app/.netlify/functions/update`;
 
// Start Express Server
bot.command("start", async (ctx)=>{
    const res = await ctx.reply(preStored.start);
    console.log(res, "hhh")
})
/*
bot.onText(/\/commands/, async (msg) => {
    await bot.sendMessage(msg.chat.id, preStored.commands);
});
// Respond to /ayah command
bot.onText(/\/ayah/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendChatAction(chatId, "typing");
    const ayahNumber = getRandomAyah();
    const [ayah, text] = await getAyah(ayahNumber);
    await bot.sendMessage(chatId, text, ayahOptions(ayah, text));
});
*/

exports.bot = bot