require("dotenv").config();
const { Telegraf } = require("telegraf");
const { WEBHOOK_PATH, WEBHOOK_SECRET } = require("../src/bot");

const BOT_TOKEN = process.env.BOT_TOKEN;
const BACKEND_URL = process.env.BACKEND_URL;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN topilmadi (.env)");
if (!BACKEND_URL) throw new Error("BACKEND_URL topilmadi (.env yoki argument)");

const bot = new Telegraf(BOT_TOKEN);
const url = `${BACKEND_URL.replace(/\/$/, "")}${WEBHOOK_PATH}`;

bot.telegram
  .setWebhook(url, { secret_token: WEBHOOK_SECRET })
  .then(() => {
    console.log("Webhook o'rnatildi:", url);
    return bot.telegram.getWebhookInfo();
  })
  .then((info) => console.log(info))
  .catch((err) => {
    console.error("Webhook o'rnatishda xatolik:", err.message);
    process.exit(1);
  });
