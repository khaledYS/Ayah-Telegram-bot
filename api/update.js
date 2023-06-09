const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const { getRandomAyah, getRandomPage, preStored } = require("../utils");
const {
  sendAyahTafsir,
  sendAyah,
  sendAyahAudio,
  sendPage,
  sendPageTafsir,
} = require("../quran-api.js");
const serverless = require("serverless-http")
require("dotenv").config();

const port = 443;

const options = {
  webHook: {
    // Just use 443 directly
    port: 443
  }
};
const token = process.env.TOKEN;
const bot = new TelegramBot(token, options);
const url = 'YOUR_DOMAIN_ALIAS' || process.env.NOW_URL;

bot.setWebHook(`${url}/bot${token}`);

// We are receiving updates at the route below!
app.post(`/bot${token}`, (req, res) => {
  bot.sendMessage(1326076292, "post")
  bot.processUpdate(req.body);
  console.log("responded to a message")
  res.sendStatus(200);
});
app.get(`/bot${token}`, (req, res) => {
  bot.sendMessage(1326076292, "get")
  console.log("updateddd")
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});


bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, preStored.start);
});
// response to /commands
bot.onText(/\/commands/, (msg) => {
  // bot.sendMessage(msg.chat.id, preStored.commands);
});
// Respond to /ayah command
bot.onText(/\/ayah/, async (msg) => {
  await bot.sendChatAction(msg.chat.id, "typing");
  const ayahNumber = getRandomAyah();
  await sendAyah(ayahNumber, msg.chat.id, bot);
});
// Respond to /page command
bot.onText(/\/page/, async (msg) => {
  await bot.sendChatAction(msg.chat.id, "typing");
  const pageNumber = getRandomPage();
  await sendPage(pageNumber, msg.chat.id, bot);
});

bot.onText(/\/help|\/commands/, (msg) => {
  // bot.sendMessage(msg.chat.id, helpCommand())
  bot.sendMessage(msg.chat.id, preStored.commands);
});

bot.on("callback_query", async (query) => {
  const [option, ...data] = query.data.split("|");
  const chatId = query.message.chat.id;
  await bot.sendMessage(
    1326076292,
    `${option} ; from : ${query.from.first_name}@${query.from.username}`
    );
    if (option === "tafsir_ayah") {
      await sendAyahTafsir(data[0], chatId, bot);
  } else if (option === "next_ayah") {
    await sendAyah(Number(data[0]) + 1, chatId, bot);
  } else if (option === "previous_ayah") {
    await sendAyah(Number(data[0]) - 1, chatId, bot);
  } else if (option === "next_page") {
    await sendPage(Number(data[0]) + 1, chatId, bot);
  } else if (option === "previous_page") {
    await sendPage(Number(data[0]) - 1, chatId, bot);
  } else if (option === "ayah_audio") {
    await sendAyahAudio(Number(data[0]), chatId, bot);
  } else if (option === "tafsir_page") {
    await sendPageTafsir(Number(data[0]), chatId, bot);
  } else if (option === "previous_tafsir_page") {
    await sendPageTafsir(Number(data[0]) - 1, chatId, bot);
  } else if (option === "next_tafsir_page") {
    await sendPageTafsir(Number(data[0]) + 1, chatId, bot);
  } else if (option === "previous_tafsir_ayah") {
    await sendAyahTafsir(Number(data[0]) - 1, chatId, bot);
  } else if (option === "next_tafsir_ayah") {
    await sendAyahTafsir(Number(data[0]) + 1, chatId, bot);
  }
});

bot.on("message", async (msg) => {
  if (msg.chat.id !== 1326076292) {
    await bot.sendMessage(
      msg.chat.id,
      "Unfortunetly...., The Bot is under development. Excuse me for any bad response or wrong one."
      );
      return;
    }
    // Check if the message matches the command pattern
    const commandRegex = /^\/([a-zA-Z0-9]+)(\s+(.*))?$/;
    try {
      const matches = msg.text.match(commandRegex);
      await bot.sendMessage(
        1326076292,
        `${msg.text} ; from : ${msg.chat.first_name}@${msg.chat.username}@${msg.chat.id}`
        );
        if (!matches) {
          // The message is not a command
          await handleTextMessage(msg);
        }
      } catch {
        await bot.sendMessage(msg.chat.id, "امممم, رسالتك غير مفهومه ؟!");
      }
    });
    
    bot.on("webhook_error", (e)=>{
      console.log(e)
    })
    bot.on("polling_error", (e)=>{
      console.log(e)
    })
    
    async function handleTextMessage(msg) {
      const chatId = msg.chat.id;
      const text = msg.text.trim();
      
      // make sure that the input is num structure so we can define that it's requesting a page number;
      let pageNumber = Number(text);
  pageNumber = isNaN(pageNumber) ? null : pageNumber;
  let ayahNumber = text.split(":");
  // make sure that the input is num:num structure so we can define that it's requesting a verse number;
  ayahNumber =
  ayahNumber.length === 2 &&
  !isNaN(Number(ayahNumber[0])) &&
  !isNaN(Number(ayahNumber[1]))
  ? `${Number(ayahNumber[0])}:${Number(ayahNumber[1])}`
  : null;
  if (pageNumber) {
    await sendPage(pageNumber, chatId, bot);
    return;
  } else if (ayahNumber) {
    await sendAyah(ayahNumber, chatId, bot);
    return;
  }
  // Handle regular text messages - !NOTE : must change this so they can accept surah:verse structure;
  bot.sendMessage(
    chatId,
    `You can't send messages, only commands. \n ${preStored.commands}`
    );
  }
  
  
  
  
  // Export the handler function for Netlify
  module.exports.handler = serverless(app)