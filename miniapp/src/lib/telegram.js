function getTelegram() {
  return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
}

export function initTelegram() {
  const tg = getTelegram();
  if (tg) {
    tg.ready();
    tg.expand();
  }
  return tg;
}

export function getTelegramUser() {
  const tg = getTelegram();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return { id: "000000000", first_name: "Mehmon", last_name: "", username: "guest" };
}

export function getInitData() {
  const tg = getTelegram();
  return tg ? tg.initData : "";
}

export function closeTelegramApp() {
  const tg = getTelegram();
  if (tg) tg.close();
}

export function hapticFeedback(style = "light") {
  const tg = getTelegram();
  if (tg && tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred(style);
  }
}
