const axios = require('axios');
const { sendAyah } = require('./quran-api');
const { getRandomAyah } = require('./utils');
const bbbb = async () => {
    try{
        const number = getRandomAyah()
        console.log(number)
        const respond = await axios.get(
            `https://api.alquran.cloud/v1/ayah/${number}/quran-uthmani`
        );
        const ayah = respond.data.data;
        const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
        console.log({text})
    }catch(er){
        console.log(er)
    }
};
bbbb()