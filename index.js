const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const quran = require("quran")
// replace the value below with the Telegram token you receive from BotFather
const token = "5418042042:AAHGiNK87v2MNv7fElAm9uLR7HsEISZ2nB8";

function ayahOptions(ayah) {
    const ayahMovers = [
        ((ayah.number - 1) < 1 ? null : {text: "⬅ السابق", callback_data: `previous_ayah|${ayah.number}`}),
        ((ayah.number + 1) > 6236 ? null : {text: "التالي ➡", callback_data: `next_ayah|${ayah.number}`})
    ]
    return {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "تفسير", callback_data: `tafsir|${ayah.number}` },
            ],
            [...ayahMovers.filter(value => value !== null)],
            [
              {
                text: "شارك الآيه",
                switch_inline_query: "forward",
              },
            ],
          ],
        },
    }
}

const getRandomAyah = async () => {
  // Get the total number of ayahs in the Quran
  const totalAyahs = 6236;

  // Generate a random number between 1 and the total number of ayahs
  const randomAyahNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the API
  const ayahResponse = await axios.get(
    `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani`
  );
  const ayah = ayahResponse.data.data[0];
  const res = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
  return {
    res,
    options: {...ayahOptions(ayah)}
  };
};

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Respond to /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hello, I'm your ayah generator. I render random verses from the holy quran.");
});

// Respond to /start command
bot.onText(/\/ayah/, async (msg) => {
  await bot.sendChatAction(msg.chat.id, "typing");
  const res = await getRandomAyah();
  bot.sendMessage(msg.chat.id, res.res, res.options);
});

// commands
function helpCommand() {
  const commands = [
    "/start - Start the bot",
    "/help - Show available commands",
    "/info - Get information about the bot",
    "/ayah - Get random Ayah with explaniation",
    "/dua - Get random dua",
    // Add more commands here
  ];
  return "Here are the available commands:\n" + commands.join("\n");
}
bot.onText(/\/help/, (msg) => {
  // bot.sendMessage(msg.chat.id, helpCommand())
  bot.sendMessage(msg.chat.id, helpCommand());
});

async function sendTafsir(ayahNumber, chatId){
    await bot.sendChatAction(chatId, "typing")
    const respond = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`);
    const tafsiredAyah = respond.data.data.text
    await bot.sendMessage(chatId, tafsiredAyah)
}
async function sendAyah(ayahNumber, chatId){
    await bot.sendChatAction(chatId, "typing")
    const respond = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayahNumber}`);
    const ayah = respond.data.data;
    const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
    await bot.sendMessage(chatId, text, ayahOptions(ayah))
}

bot.on("callback_query", async (query)=>{
    const [option, ...data] = query.data.split("|")
    const chatId = query.message.chat.id;
    await bot.sendMessage(1326076292, `${option} ; from : ${query.from.first_name}@${query.from.username}`)
    if(option === 'tafsir'){
        await sendTafsir(data[0], chatId)
    }else if (option === "next_ayah"){
        await sendAyah((Number(data[0])+1), chatId)
    }else if (option === "previous_ayah"){
        await sendAyah((Number(data[0])-1), chatId)
    }
})

bot.on("message", async (msg) => {
  // Check if the message matches the command pattern
  const commandRegex = /^\/([a-zA-Z0-9]+)(\s+(.*))?$/;
  const matches = msg.text.match(commandRegex);
  await bot.sendMessage(1326076292, `${msg.text} ; from : ${msg.chat.first_name}@${msg.chat.username}`)
  if (!matches) {
    // The message is not a command
    handleTextMessage(msg);
  }
});

function handleTextMessage(msg) {
  // Handle regular text messages
  bot.sendMessage(
    msg.chat.id,
    `You can't send messages, only commands. \n ${helpCommand()}`
  );
}
