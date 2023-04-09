const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const quran = require("quran");
const express = require("express");
require("dotenv").config();
const preStored = {
  commands:
    "/ayah - آية من القرآن الكريم بشكل عشوائي \n/page - صفحة من القرآن الكريم بشكل عشوائي\n/subscribe - اشترك في الآيات التي تُرسل بشكل عشوائي🙊\n/unsubscribe - الغي الاشتراك",
  start:
    "حييي الله تو ما نور البوت, اضغط على /commands عشان تعرف الاامر اللازمه للاستخدام",
};
const app = express();

// replace the value below with the Telegram token you receive from BotFather
const token = process.env.TOKEN;

function ayahOptions(ayah) {
  const ayahMovers = [
    ayah.number - 1 < 1
      ? null
      : { text: "⬅ السابق", callback_data: `previous_ayah|${ayah.number}` },
    ayah.number + 1 > 6236
      ? null
      : { text: "التالي ➡", callback_data: `next_ayah|${ayah.number}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "تفسير", callback_data: `tafsir_ayah|${ayah.number}` }],
        [...ayahMovers.filter((value) => value !== null)],
        [{text: "صوتيه🔊", callback_data: `ayah_audio|${ayah.number}`}],
        [
          {
            text: "شارك الآيه",
            switch_inline_query: "",
          },
        ],
      ],
    },
  };
}

function pageOptions (page, surahs) {
  const pageMovers = [
    page.number - 1 < 1
      ? null
      : { text: "⬅ السابق", callback_data: `previous_page|${page.number}` },
    page.number + 1 > 604
      ? null
      : { text: "التالي ➡", callback_data: `next_page|${page.number}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "تفسير", callback_data: `tafsir_page|${page.number}` }],
        [...pageMovers.filter((value) => value !== null)],
        [
          {
            text: "شارك الصفحة",
            switch_inline_query: surahs,
          },
        ],
      ],
    },
  };
}

const getRandomAyah = () => {
  // Get the total number of ayahs in the Quran
  const totalAyahs = 6236;

  // Generate a random number between 1 and the total number of ayahs
  const randomAyahNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the 
  return randomAyahNumber;
};

const getRandomPage = () => {
  // Get the total number of ayahs in the Quran
  const totalAyahs = 604;

  // Generate a random number between 1 and the total number of ayahs
  const randomPageNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the 
  return randomPageNumber;
};


async function sendAyahTafsir(ayahNumber, chatId) {
  await bot.sendChatAction(chatId, "typing");
  const respond = await axios.get(
    `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`
  );
  const tafsiredAyah = respond.data.data.text;
  await bot.sendMessage(chatId, tafsiredAyah);
}
async function sendAyah(ayahNumber, chatId) {
  await bot.sendChatAction(chatId, "typing");
  const respond = await axios.get(
    `https://api.alquran.cloud/v1/ayah/${ayahNumber}/quran-uthmani`
  );
  const ayah = respond.data.data;
  const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
  await bot.sendMessage(chatId, text, ayahOptions(ayah));
}
async function sendAyahAudio(ayahNumber, chatId) {
  await bot.sendChatAction(chatId, "record_voice");
  const respond = await axios.get(
    `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.abdurrahmaansudais`
  );
  const ayah = respond.data.data;
  const audioUrl = ayah.audio; // Replace with the URL of the audio file
  await bot.sendAudio(chatId, audioUrl)
}

async function sendPage(pageNumber, chatId){
  await bot.sendChatAction(chatId, "typing");
  const respond = await axios.get(
    `https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`
  );
  const page = respond.data.data;
  let surahs = page.ayahs;
  surahs = surahs.map((val, ind)=>{
    const surahNumberOfPreviousAyah = ind <= 0 ? null : surahs[ind-1].surah.number;
    const surahNumberOfCurrentAyah = val.surah.number;
    const surahName = surahNumberOfCurrentAyah === surahNumberOfPreviousAyah ? null : val.surah.name;
    const text = `${surahName ? `\n\n\n -${surahName}-: \n` : ""}${val.text}${val.sajda ? "[سجدة]" : ""}(${val.numberInSurah})`
    return text;
  })
  surahs = `${surahs.join("")} \n\n\n صفحة صـ${page.number}`
  await bot.sendMessage(chatId, surahs, pageOptions(page, surahs));
}
async function sendPageTafsir(pageNumber, chatId) {
  await bot.sendChatAction(chatId, "typing");
  const respond = await axios.get(
    `https://api.alquran.cloud/v1/page/${pageNumber}/ar.muyassar`
  );
  const tafsiredPage = respond.data.data.ayahs;
  await bot.sendMessage(chatId, tafsiredPage.map(val=>`(${val.numberInSurah})-${val.text}\n`).join("\n"));
}

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });
app.get(`/bot`, (req, res) => {
  res.json("hi");
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
  await sendAyah(ayahNumber, msg.chat.id)
});
// Respond to /page command
bot.onText(/\/page/, async (msg) => {
  await bot.sendChatAction(msg.chat.id, "typing");
  const pageNumber = getRandomPage();
  await sendPage(pageNumber, msg.chat.id);
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
    await sendAyahTafsir(data[0], chatId);
  } else if (option === "next_ayah") {
    await sendAyah(Number(data[0]) + 1, chatId);
  } else if (option === "previous_ayah") {
    await sendAyah(Number(data[0]) - 1, chatId);
  } else if (option === "next_page") {
    await sendPage(Number(data[0]) + 1, chatId);
  } else if (option === "previous_page") {
    await sendPage(Number(data[0]) - 1, chatId);
  }else if (option === "ayah_audio"){
    await sendAyahAudio(Number(data[0]), chatId)
  }else if (option === "tafsir_page"){
    await sendPageTafsir(Number(data[0]), chatId)
  }
});

bot.on("message", async (msg) => {
  if (msg.chat.id !== 1326076292) {
    console.log("hi");
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
