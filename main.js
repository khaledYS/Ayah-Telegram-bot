const { default: axios } = require("axios");

async function main(){
    try{
        const respond = await axios.get(`https://api.alquran.cloud/v1/ayah/333:33/quran-uthmani`)
        const ayah = respond.data.data;
        const text = `${ayah.text} \n[${ayah.surah.name}](${ayah.numberInSurah})`;
        console.log(ayah, text)
        return [ayah, text];
    }catch(err){
        return [404, "تأكد من الرقم المدخل"]
    }
}
main()