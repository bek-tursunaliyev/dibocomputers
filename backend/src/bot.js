const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINIAPP_URL = process.env.MINIAPP_URL;
const WEBHOOK_PATH = "/api/telegram/webhook";
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

let bot = null;

function getBot() {
  if (bot) return bot;
  if (!BOT_TOKEN) {
    console.warn("BOT_TOKEN topilmadi, bot ishga tushirilmadi.");
    return null;
  }

  bot = new Telegraf(BOT_TOKEN);

  bot.telegram
    .setChatMenuButton({
      menu_button: { type: "web_app", text: "🏪 Do'konga o'tish", web_app: { url: MINIAPP_URL } },
    })
    .catch((err) => console.error("Menyu tugmasini o'rnatishda xatolik:", err.message));

  bot.start((ctx) => {
    ctx.reply(
      `Assalomu alaykum, ${ctx.from.first_name}! 👋\n\nDiboComputers - Namangandagi ishonchli kompyuter va noutbuk do'koni.\n\nKatalogimizni ko'rish va buyurtma berish uchun pastdagi tugmani bosing.`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "🏪 Do'konga o'tish", web_app: { url: MINIAPP_URL } }]],
        },
      }
    );
  });

  bot.catch((err) => console.error("Bot xatoligi:", err.message));

  return bot;
}

function initBot() {
  const b = getBot();
  if (!b) return null;

  if (process.env.VERCEL) {
    console.log("Telegram bot webhook rejimida ishlaydi:", WEBHOOK_PATH);
  } else {
    b.launch();
    console.log("Telegram bot polling rejimida (lokal) ishga tushdi.");
    process.once("SIGINT", () => b.stop("SIGINT"));
    process.once("SIGTERM", () => b.stop("SIGTERM"));
  }

  return b;
}

async function sendOrderConfirmation(telegramId) {
  const b = getBot();
  if (!b) return;
  await b.telegram.sendMessage(
    telegramId,
    "✅ Buyurtmangiz muvaffaqiyatli qabul qilindi!\n\nAdmin tez orada siz bilan bog'lanadi!"
  );
}

module.exports = { initBot, getBot, sendOrderConfirmation, WEBHOOK_PATH, WEBHOOK_SECRET };
