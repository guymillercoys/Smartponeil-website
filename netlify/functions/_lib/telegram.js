/**
 * Telegram notification helper
 */

export async function sendTelegram(text) {
  // Check if Telegram is enabled
  if (process.env.TELEGRAM_ENABLED !== "true") {
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log("Telegram: Missing bot token or chat ID");
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          disable_web_page_preview: true
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Telegram send failed:", response.status, errorText);
    }
  } catch (err) {
    console.log("Telegram error:", err.message);
  }
}

