const { default: axios } = require("axios")
const {pageOptions, ayahOptions, tafsirAyahOptions, tafsirPageOptions} = require("./utils")


module.exports.getAyah = async function getAyah(ayahNumber) {
    try{    
        const respond = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/quran-uthmani`)
        const ayah = respond.data.data;
        const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
        return [ayah, text];
    }catch(er){
        return [404, "تأكد من رقم الآيه المدخل"]
    }
}
module.exports.getAyahTafsir = async function getAyahTafsir(ayahNumber) {
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`
    );
    const tafsiredAyah = respond.data.data;
    const text = `تفسير ${tafsiredAyah.surah.name} \n ${tafsiredAyah.numberInSurah}-${tafsiredAyah.text}`;
    return [tafsiredAyah, text]
}
module.exports.getAyahAudio = async function getAyahAudio(ayahNumber) {
    const respond = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.abdurrahmaansudais`
    );
    const ayah = respond.data.data;
    const audioUrl = ayah.audio; // Replace with the URL of the audio file
    return [ayah, audioUrl]
}

module.exports.getPage = async function getPage(pageNumber) {
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
    return [page, surahs]
}
module.exports.getPageTafsir = async function getPageTafsir(pageNumber) {
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
    return [tafsiredPage, text] ;
}

