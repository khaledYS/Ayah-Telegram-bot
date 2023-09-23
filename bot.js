const express = require("express");
const serverless = require('serverless-http');
const { getRandomAyah, getRandomPage, preStored, ayahOptions } = require("./utils");
const { set } = require("express/lib/application");
const { Telegraf, Markup } = require("telegraf");
const { sendAyah, sendAyahTafsir, sendAyahAudio, sendPage, sendPageTafsir, handleTextMessage } = require("./bot-reply");
require("dotenv").config();
const token = process.env.TOKEN;
const bot = new Telegraf(token);
const url = `https://ayah-bot.netlify.app/.netlify/functions/update`;

// Start command
bot.command("start", async (ctx)=>{
    const res = await ctx.reply(preStored.start);
    console.log(res, "hhh")
})

bot.command("commands", async (ctx ) => {
    await ctx.reply(preStored.commands)
});

// Respond to /ayah command
bot.command("ayah", async (ctx) => {
    const ayahNumber = getRandomAyah();
    const res = await sendAyah(ctx, ayahNumber);
});

bot.command("page", async (ctx) => {
    const ayahNumber = getRandomPage();
    const res = await sendPage(ctx, ayahNumber);
});

bot.on("callback_query", async (ctx)=>{
    const query = ctx.update.callback_query.data ;
    const [option, ...data] = query.split("|");
    if (option === "tafsir_ayah") {
        console.log("tafsired")
        await sendAyahTafsir(ctx, data[0]);
    }
     else if (option === "next_ayah") {
        await sendAyah(ctx, Number(data[0]) + 1);
    } else if (option === "previous_ayah") {
        await sendAyah(ctx, Number(data[0]) - 1);
    } else if (option === "next_page") {
        await sendPage(ctx, Number(data[0]) + 1);
    } else if (option === "previous_page") {
        await sendPage(ctx, Number(data[0]) - 1);
    } else if (option === "previous_long_page" || option === "next_long_page") {
        await sendPage(ctx, Number(data[0]));
    } else if (option === "ayah_audio") {
        await sendAyahAudio(ctx, Number(data[0]));
    } else if (option === "tafsir_page") {
        await sendPageTafsir(ctx, Number(data[0]));
    } else if (option === "previous_tafsir_page") {
        await sendPageTafsir(ctx, Number(data[0]) - 1);
    } else if (option === "next_tafsir_page") {
        await sendPageTafsir(ctx, Number(data[0]) + 1);
    } else if (option === "previous_tafsir_ayah") {
        await sendAyahTafsir(ctx, Number(data[0]) - 1);
    } else if (option === "next_tafsir_ayah") {
        await sendAyahTafsir(ctx, Number(data[0]) + 1);
    }else if (option === "backto_page"){
        await sendPage(ctx, Number(data[0]))
    }else if (option === "backto_ayah"){
        await sendAyah(ctx, Number(data[0]))
    }
})

bot.on("message", async (ctx) => {
    const text = ctx.update.message.text;
    console.log(ctx.update.message)
    const reply = await handleTextMessage(ctx, text)
});

bot.catch(async (err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    await ctx.reply("خطأ, حاول مجدداً في وقتٍ لاحق.")
    await ctx.sendMessage("خطأ, حاول مجدداً في وقتٍ لاحق." + ctx.updateType, {chat_id: 1326076292})
})

exports.bot = bot