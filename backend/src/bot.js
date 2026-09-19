const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINIAPP_URL = process.env.MINIAPP_URL;

let bot = null;

function initBot() {
  if (!BOT_TOKEN) {
    console.warn("BOT_TOKEN topilmadi, bot ishga tushirilmadi.");
    return null;
  }

  bot = new Telegraf(BOT_TOKEN);

  bot.telegram
    .setChatMenuButton({
      menu_button: { type: "web_app", text: "🛒 Katalog", web_app: { url: MINIAPP_URL } },
    })
    .catch((err) => console.error("Menyu tugmasini o'rnatishda xatolik:", err.message));

  bot.start((ctx) => {
    ctx.reply(
      `Assalomu alaykum, ${ctx.from.first_name}! 👋\n\nDiboComputers - Namangandagi ishonchli kompyuter va noutbuk do'koni.\n\nKatalogimizni ko'rish va buyurtma berish uchun pastdagi tugmani bosing.`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "🛒 Do'konni ochish", web_app: { url: MINIAPP_URL } }]],
        },
      }
    );
  });

  bot.catch((err) => console.error("Bot xatoligi:", err.message));

  bot.launch();
  console.log("Telegram bot ishga tushdi.");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
}

async function sendOrderConfirmation(telegramId) {
  if (!bot) return;
  await bot.telegram.sendMessage(
    telegramId,
    "✅ Buyurtmangiz muvaffaqiyatli qabul qilindi!\n\nAdmin tez orada siz bilan bog'lanadi!"
  );
}

module.exports = { initBot, sendOrderConfirmation };
