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
        [{text: "صوتيه🔊", callback_data: `ayah_audio|${ayah.number}`}],
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
      : { text: "⬅ السابق", callback_data: `previous_ayah|${ayah.number}` },
    ayah.number + 1 > 6236
      ? null
      : { text: "التالي ➡", callback_data: `next_ayah|${ayah.number}` },
  ];
  return {
    reply_markup: {
      inline_keyboard: [
        [...ayahMovers.filter((value) => value !== null)],
        [{text: "صوتيه🔊", callback_data: `ayah_audio|${ayah.number}`}],
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


module.exports.pageOptions = function pageOptions (page, text) {
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
            switch_inline_query: text,
          },
        ],
      ],
    },
  };
}
module.exports.tafsirPageOptions = function tafsirPageOptions (page, text) {
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

module.exports.getRandomAyah = function getRandomAyah () {
  // Get the total number of ayahs in the Quran
  const totalAyahs = 6236;

  // Generate a random number between 1 and the total number of ayahs
  const randomAyahNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the 
  return randomAyahNumber;
};

module.exports.getRandomPage = function getRandomPage (){
  // Get the total number of ayahs in the Quran
  const totalAyahs = 604;

  // Generate a random number between 1 and the total number of ayahs
  const randomPageNumber = Math.floor(Math.random() * totalAyahs) + 1;
  // Get the ayah with the random number using the 
  return randomPageNumber;
};