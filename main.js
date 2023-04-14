// Respond to /page command
bot.onText(/\/page/, async (msg) => {
    await bot.sendChatAction(msg.chat.id, "typing");
    const pageNumber = getRandomPage();
    const [page, text] = await getPage(pageNumber);
    // complete
});


bot.on("callback_query", async (query) => {
    const [option, ...data] = query.data.split("|");
    const chatId = query.message.chat.id;
    await bot.sendMessage(
        1326076292,
        `${option} ; from : ${query.from.first_name}@${query.from.username}`
    );
    if (option === "tafsir_ayah") {
        await sendAyahTafsir(data[0], chatId, bot);
    } else if (option === "next_ayah") {
        await sendAyah(Number(data[0]) + 1, chatId, bot);
    } else if (option === "previous_ayah") {
        await sendAyah(Number(data[0]) - 1, chatId, bot);
    } else if (option === "next_page") {
        await sendPage(Number(data[0]) + 1, chatId, bot);
    } else if (option === "previous_page") {
        await sendPage(Number(data[0]) - 1, chatId, bot);
    } else if (option === "ayah_audio") {
        await sendAyahAudio(Number(data[0]), chatId, bot);
    } else if (option === "tafsir_page") {
        await sendPageTafsir(Number(data[0]), chatId, bot);
    } else if (option === "previous_tafsir_page") {
        await sendPageTafsir(Number(data[0]) - 1, chatId, bot);
    } else if (option === "next_tafsir_page") {
        await sendPageTafsir(Number(data[0]) + 1, chatId, bot);
    } else if (option === "previous_tafsir_ayah") {
        await sendAyahTafsir(Number(data[0]) - 1, chatId, bot);
    } else if (option === "next_tafsir_ayah") {
        await sendAyahTafsir(Number(data[0]) + 1, chatId, bot);
    }
});

bot.on("message", async (ctx) => {
    const message = ctx.update.data.text;
    console.log(message )
});
