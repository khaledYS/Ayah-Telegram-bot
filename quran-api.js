const axios = require("axios")
const {pageOptions, ayahOptions} = require("./utils")


module.exports.sendAyah = async function sendAyah(ayahNumber, chatId, bot) {
    await bot.sendChatAction(chatId, "typing");
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/quran-uthmani`
    );
    const ayah = respond.data.data;
    const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
    await bot.sendMessage(chatId, text, ayahOptions(ayah, text));
}
module.exports.sendAyahTafsir = async function sendAyahTafsir(ayahNumber, chatId, bot) {
    await bot.sendChatAction(chatId, "typing");
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`
    );
    const tafsiredAyah = respond.data.data;
    const text = `-${tafsiredAyah.surah.name}- \n ${tafsiredAyah.numberInSurah}-${tafsiredAyah.text}`;
    await bot.sendMessage(chatId, text);
}
module.exports.sendAyahAudio = async function sendAyahAudio(ayahNumber, chatId, bot) {
    await bot.sendChatAction(chatId, "record_voice");
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.abdurrahmaansudais`
    );
    const ayah = respond.data.data;
    const audioUrl = ayah.audio; // Replace with the URL of the audio file
    await bot.sendAudio(chatId, audioUrl)
}

module.exports.sendPage = async function sendPage(pageNumber, chatId, bot) {
    await bot.sendChatAction(chatId, "typing");
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`
    );
    const page = respond.data.data;
    let surahs = page.ayahs;
    surahs = surahs.map((val, ind) => {
        const surahNumberOfPreviousAyah = ind <= 0 ? null : surahs[ind - 1].surah.number;
        const surahNumberOfCurrentAyah = val.surah.number;
        const surahName = surahNumberOfCurrentAyah === surahNumberOfPreviousAyah ? null : val.surah.name;
        const text = `${surahName ? `\n\n\n -${surahName}-: \n` : ""}${val.text}${val.sajda ? "[سجدة]" : ""}(${val.numberInSurah})`
        return text;
    })
    surahs = `${surahs.join("")} \n\n\n صفحة صـ${page.number}`
    await bot.sendMessage(chatId, surahs, pageOptions(page, surahs));
}
module.exports.sendPageTafsir = async function sendPageTafsir(pageNumber, chatId, bot) {
    await bot.sendChatAction(chatId, "typing");
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/page/${pageNumber}/ar.muyassar`
    );
    const tafsiredPage = respond.data.data.ayahs;
    await bot.sendMessage(chatId, tafsiredPage.map(val => `(${val.numberInSurah})-${val.text}\n`).join("\n"));
}

