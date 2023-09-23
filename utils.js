
module.exports.ayahOptions = function ayahOptions(ayah, text) {
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
        [{ text: "صوتيه🔊", callback_data: `ayah_audio|${ayah.number}` }],
        [
          {
            text: "شارك الآيه",
            switch_inline_query: text,
          },
        ],
      ],
    },
  };
}
module.exports.tafsirAyahOptions = function tafsirAyahOptions(ayah, text) {
  const ayahMovers = [
    ayah.number - 1 < 1
      ? null
      : { text: "⬅ السابق", callback_data: `previous_tafsir_ayah|${ayah.number}` },
    ayah.number + 1 > 6236
      ? null
      : { text: "التالي ➡", callback_data: `next_tafsir_ayah|${ayah.number}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "الرجوع للآية 📖", callback_data: `backto_ayah|${ayah.number}` }],
        [...ayahMovers.filter((value) => value !== null)],
        [
          {
            text: "شارك تفسير الآيه",
            switch_inline_query: text,
          },
        ],
      ],
    },
  };
}


module.exports.pageOptions = function pageOptions(page, text) {
  const pageMovers = [
    page.number - 1 < 1
      ? null
      : { text: "⬅ السابق", callback_data: `previous_page|${page.number}` },
    page.number + 1 > 604
      ? null
      : { text: "التالي ➡", callback_data: `next_page|${page.number}` },
  ];
  const longPageMovers = [
    // next
    page.number + 1 > 604
      ? null
      : { text: "5 ➡", callback_data: `next_long_page|${page.number + 1}` },
    page.number + 5 > 604
      ? null
      : { text: "5 ➡", callback_data: `next_long_page|${page.number + 5}` },
    page.number + 10 > 604
      ? null
      : { text: "10 ➡", callback_data: `next_long_page|${page.number + 10}` },
    page.number + 50 > 604
      ? null
      : { text: "50 ➡", callback_data: `next_long_page|${page.number + 50}` },
    page.number + 100 > 604
      ? null
      : { text: "100 ➡", callback_data: `next_long_page|${page.number + 100}` },
    // previous
    page.number - 1 < 1
      ? null
      : { text: "⬅ 1", callback_data: `previous_long_page|${page.number - 1}` },
      page.number - 5 < 1
      ? null
      : { text: "⬅ 5", callback_data: `precious_long_page|${page.number - 5}` },
      page.number - 1 < 1
      ? null
      : { text: "⬅ 10", callback_data: `precious_long_page|${page.number - 10}` },
      page.number - 1 < 1
      ? null
      : { text: "⬅ 50", callback_data: `precious_long_page|${page.number - 50}` },
      page.number - 1 < 1
      ? null
      : { text: "⬅ 100", callback_data: `precious_long_page|${page.number - 100}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "تفسير", callback_data: `tafsir_page|${page.number}` }],
        [...pageMovers.filter((value) => value !== null)],
        [...longPageMovers.filter((value) => value !== null)],
        [
          {
            text: "شارك الصفحة",
            switch_inline_query: text,
          },
        ],
      ],
    },
  };
}
module.exports.tafsirPageOptions = function tafsirPageOptions(page, text) {
  const pageMovers = [
    page.number - 1 < 1
      ? null
      : { text: "⬅ السابق", callback_data: `previous_tafsir_page|${page.number}` },
    page.number + 1 > 604
      ? null
      : { text: "التالي ➡", callback_data: `next_tafsir_page|${page.number}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "الرجوع للصفحة 📖", callback_data: `backto_page|${page.number}` }],
        [...pageMovers.filter((value) => value !== null)],
        [...pageMovers.filter((value) => value !== null)],
        [
          {
            text: "شارك تفسير الصفحة",
            switch_inline_query: text,
          },
        ],
      ],
    },
  };
}

module.exports.getRandomAyah = function getRandomAyah() {
  // Get the total number of ayahs in the Quran
  const totalAyahs = 6236;

  // Generate a random number between 1 and the total number of ayahs
  const randomAyahNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the 
  return randomAyahNumber;
};

module.exports.getRandomPage = function getRandomPage() {
  // Get the total number of ayahs in the Quran
  const totalAyahs = 604;

  // Generate a random number between 1 and the total number of ayahs
  const randomPageNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the 
  return randomPageNumber;
};

exports.sendWaitingMessage = async function (ctx) {
  const waitingText = "يتم معالجة الطلب 🔍......"
  let messageId = ctx.update?.callback_query?.message?.message_id;
  let chatId = ctx.update?.callback_query?.message?.chat?.id;
  if (!messageId) {
    const userMessageId = ctx.update?.message?.message_id;
    const waitingMessage = await ctx.reply(waitingText, { reply_to_message_id: userMessageId, allow_sending_without_reply: true })
    messageId = waitingMessage.message_id;
    chatId = waitingMessage.chat.id;
  } else {
    console.log(messageId)
    await ctx.telegram.editMessageText(chatId, messageId, undefined, waitingText);
  }
  const sendWhenFinish = async (text, options) => {
    await ctx.telegram.editMessageText(chatId, messageId, undefined, text, options);
  }
  return [sendWhenFinish, { chatId, messageId }];
}


module.exports.preStored = {
  commands:
    "/ayah - آية من القرآن الكريم بشكل عشوائي \n/page - صفحة من القرآن الكريم بشكل عشوائي\n/subscribe - اشترك في الآيات التي تُرسل بشكل عشوائي🙊\n/unsubscribe - الغي الاشتراك",
  start:
    "نورت البوت !!! ارسل /commands لمعرفة الأوامر الممكنه",
};