const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const {getRandomAyah, getRandomPage} = require("./utils")
const {sendAyahTafsir,sendAyah,sendAyahAudio,sendPage, sendPageTafsir} = require("./quran-api.js")
require("dotenv").config();


const preStored = {
  commands:
  "/ayah - آية من القرآن الكريم بشكل عشوائي \n/page - صفحة من القرآن الكريم بشكل عشوائي\n/subscribe - اشترك في الآيات التي تُرسل بشكل عشوائي🙊\n/unsubscribe - الغي الاشتراك",
  start:
  "حييي الله تو ما نور البوت, اضغط على /commands عشان تعرف الاامر اللازمه للاستخدام",
};
const token = process.env.TOKEN;
// Create a bot instance
const bot = new TelegramBot(token, { polling: true });


app.get(`/bot`, (req, res) => {
  res.json("hi");
  console.log("recieved")
});


// Respond to /start command
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
  await sendAyah(ayahNumber, msg.chat.id, bot)
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
  }else if (option === "ayah_audio"){
    await sendAyahAudio(Number(data[0]), chatId, bot)
  }else if (option === "tafsir_page"){
    await sendPageTafsir(Number(data[0]), chatId, bot)
  }
});

bot.on("message", async (msg) => {
  if (msg.chat.id !== 1326076292) {
    bot.sendMessage(
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
      handleTextMessage(msg);
    }
  } catch {
    bot.sendMessage(msg.chat.id, "امممم, رسالتك غير مفهومه ؟!");
  }
});

function handleTextMessage(msg) {
  // Handle regular text messages - !NOTE : must change this so they can accept surah:verse structure;
  bot.sendMessage(
    msg.chat.id,
    `You can't send messages, only commands. \n ${preStored.commands}`
  );
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
