const TelegramBot = require("node-telegram-bot-api");

const token = "6060348782:AAHSurevsGfCGk4ixaj2gfUhlJ9Fzy4p1Lw";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `echo: ${msg.text}`);
});
