const WEB_APP_LINK =
  import.meta.env.VITE_PUBLIC_WEB_APP_INVITE_LINK ||
  "https://t.me/no_think_coin_bot/startapp?startapp=";

export const makeInviteLink = (id: string) => {
  const text = `
NO-THINK. JUST CLICK. Earn coins with every click!`;
  return `https://t.me/share/url?url=${WEB_APP_LINK}${id}&text=${text}`;
};
