const { default: axios } = require("axios")
const { pageOptions, ayahOptions, tafsirAyahOptions, tafsirPageOptions, sendWaitingMessage } = require("./utils");
const { getAyah, getAyahTafsir, getAyahAudio, getPage, getPageTafsir } = require("./quran-api");

async function sendAyah(ctx, ayahNumber) {
    const [sendWhenFinish] = await sendWaitingMessage(ctx);
    const [ayah, text] = await getAyah(ayahNumber);
    if(ayah === 404){
        ctx.reply(text)
    }else{
        await sendWhenFinish(text, ayahOptions(ayah, text))
    }
}
async function sendAyahTafsir(ctx, ayahNumber) {
    const [sendWhenFinish] = await sendWaitingMessage(ctx);
    const [ayah, text] = await getAyahTafsir(ayahNumber)
    await sendWhenFinish(text, tafsirAyahOptions(ayah, text))
}
async function sendAyahAudio(ctx, ayahNumber) {
    const [ayah, text] = await getAyahAudio(ayahNumber);
    await ctx.replyWithAudio(text);
}

async function sendPage(ctx, pageNumber) {
    if(pageNumber > 604 || pageNumber < 1){
        ctx.reply("اختر رقم بين 604 و 1")
        return ;
    }
    const [sendWhenFinish] = await sendWaitingMessage(ctx);
    const [page, text] = await getPage(pageNumber);
    await sendWhenFinish(text, pageOptions(page, text));
}
async function sendPageTafsir(ctx, pageNumber) {
    const [sendWhenFinish] = await sendWaitingMessage(ctx);
    const [page, text] = await getPageTafsir(pageNumber);
    await sendWhenFinish(text, tafsirPageOptions(page, text))

}

async function handleTextMessage(ctx, text) {

    // make sure that the input is num structure so we can define that it's requesting a page number;
    let pageNumber = Number(text);
    pageNumber = isNaN(pageNumber) ? null : pageNumber;
    let ayahNumber = text.split(":");
    // make sure that the input is num:num structure so we can define that it's requesting a verse number;
    ayahNumber =
        ayahNumber.length === 2 &&
            !isNaN(Number(ayahNumber[0])) &&
            !isNaN(Number(ayahNumber[1]))
            ? `${Number(ayahNumber[0])}:${Number(ayahNumber[1])}`
            : null;
    console.log({ pageNumber, ayahNumber })
    if (pageNumber) {
        await sendPage(ctx, pageNumber);
        return;
    } else if (ayahNumber) {
        await sendAyah(ctx, ayahNumber);
        return;
    }
    // Handle regular text messages - !NOTE : must change this so they can accept surah:verse structure;
    await ctx.editMessageText(
        `You can't send messages, only commands. \n ${preStored.commands}`
    );
}


module.exports = {
    sendAyah, sendAyahTafsir, sendAyahAudio, sendPage, sendPageTafsir, handleTextMessage: handleTextMessage
}