const axios = require("axios")
const {pageOptions, ayahOptions, tafsirAyahOptions, tafsirPageOptions} = require("./utils")


module.exports.sendAyah = async function sendAyah(ayahNumber) {
    console.log(ayahNumber, "bb1")
    try{
        const respond = await axios.get(
            `https://api.alquran.cloud/v1/ayah/${ayahNumber}/quran-uthmani`
        );
        console.log(ayahNumber, "bb2")
        const ayah = respond.data.data;
        console.log(ayahNumber, "bb3")
        const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
        console.log(ayahNumber, "bb4")
        return {ayah, text};
    }catch(er){
        console.log(er)
        return {ayah: "", text: ""}
    }
}
module.exports.sendAyahTafsir = async function sendAyahTafsir(ayahNumber, chatId, bot) {
    await bot.sendChatAction(chatId, "typing");
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`
    );
    const tafsiredAyah = respond.data.data;
    const text = `تفسير ${tafsiredAyah.surah.name} \n ${tafsiredAyah.numberInSurah}-${tafsiredAyah.text}`;
    await bot.sendMessage(chatId, text, tafsirAyahOptions(tafsiredAyah, text));
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
        const text = `${surahName ? `\n\n -${surahName}-: \n` : ""}${val.text}${val.sajda ? "[سجدة]" : ""}(${val.numberInSurah})`
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
    const tafsiredPage = respond.data.data;
    const ayahs = tafsiredPage.ayahs;
    let text = ayahs.map((val, ind)=>{
        const surahNumberOfPreviousAyah = ind <= 0 ? null : ayahs[ind - 1].surah.number;
        const surahNumberOfCurrentAyah = val.surah.number;
        const surahName = surahNumberOfCurrentAyah === surahNumberOfPreviousAyah ? null : val.surah.name;
        const text = `${surahName ? `\n\nتفسير${surahName}\n` : ""}(${val.numberInSurah})-${val.text}`;
        return text;
    })
    text = `${text.join("\n")} \n\n صــ${tafsiredPage.number}`;
    await bot.sendMessage(chatId, text, {...tafsirPageOptions(tafsiredPage, text)}).catch(e=>{bot.sendMessage(chatId, JSON.stringify(e))});
}

