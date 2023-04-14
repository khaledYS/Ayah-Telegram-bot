const { default: axios } = require("axios")
const { pageOptions, ayahOptions, tafsirAyahOptions, tafsirPageOptions, preStored } = require("./utils");
const { getAyah, getAyahTafsir, getAyahAudio, getPage, getPageTafsir } = require("./quran-api");


async function sendAyah(ctx, ayahNumber) {
    const [ayah, text] = await getAyah(ayahNumber);
    await ctx.reply(text, ayahOptions(ayah, text));
}
async function sendAyahTafsir(ctx, ayahNumber) {
    const [ayah, text] = await getAyahTafsir(ayahNumber)
    await ctx.reply(text, tafsirAyahOptions(ayah, text))
}
async function sendAyahAudio(ctx, ayahNumber) {
    const [ayah, text] = await getAyahAudio(ayahNumber);
    await ctx.replyWithAudio(text);
}

async function sendPage(ctx, pageNumber) {
    const [page, text] = await getPage(pageNumber);
    await ctx.reply(text, pageOptions(page, text));
}
async function sendPageTafsir(ctx, pageNumber) {
    const [page, text] = await getPageTafsir(pageNumber);
    await ctx.reply(text, tafsirPageOptions(page, text))

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
    await ctx.reply(
        `You can't send messages, only commands. \n ${preStored.commands}`
    );
}


module.exports = {
    sendAyah, sendAyahTafsir, sendAyahAudio, sendPage, sendPageTafsir, handleTextMessage: handleTextMessage
}