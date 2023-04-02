const axios = require('axios');
const getRandomAyah = async () => {
    // Get the total number of ayahs in the Quran
    const totalAyahs = 6236;
  
    // Generate a random number between 1 and the total number of ayahs
    const randomAyahNumber = Math.floor(Math.random() * totalAyahs) + 1;
    // Get the ayah with the random number using the API
    const ayahResponse = await axios.get(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}`);
    const ayah = ayahResponse.data.data;
    console.log(ayah.text)
};
getRandomAyah()