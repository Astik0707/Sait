import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, comment } = await request.json();

    // Валидация
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials not configured");
      return NextResponse.json(
        { error: "Сервис временно недоступен" },
        { status: 500 }
      );
    }

    // Формируем сообщение
    const message = `
🏠 *Новая заявка с сайта Pach Group*

👤 *Имя:* ${escapeMarkdown(name)}
📞 *Телефон:* ${escapeMarkdown(phone)}
${comment ? `💬 *Комментарий:* ${escapeMarkdown(comment)}` : ""}

📅 _${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}_
    `.trim();

    // Отправляем в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("Telegram API error:", errorData);
      return NextResponse.json(
        { error: "Ошибка отправки сообщения" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// Экранирование специальных символов Markdown
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

