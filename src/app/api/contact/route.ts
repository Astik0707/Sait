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
    const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatIdsRaw) {
      console.error("Telegram credentials not configured");
      return NextResponse.json(
        { error: "Сервис временно недоступен" },
        { status: 500 }
      );
    }

    // Парсим несколько Chat ID (поддерживаем запятую, пробел, перенос строки)
    const chatIds = chatIdsRaw
      .split(/[,\s\n]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (chatIds.length === 0) {
      console.error("No valid Telegram Chat IDs found");
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

    // Отправляем в Telegram всем указанным Chat ID
    const sendPromises = chatIds.map(async (chatId) => {
      try {
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
          console.error(`Telegram API error for chat ${chatId}:`, errorData);
          return { success: false, chatId, error: errorData };
        }

        return { success: true, chatId };
      } catch (error) {
        console.error(`Error sending to chat ${chatId}:`, error);
        return { success: false, chatId, error: error instanceof Error ? error.message : "Unknown error" };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.success).length;

    // Если хотя бы одно сообщение отправлено успешно - считаем успехом
    if (successCount === 0) {
      console.error("Failed to send to all Telegram chats:", results);
      return NextResponse.json(
        { error: "Ошибка отправки сообщения" },
        { status: 500 }
      );
    }

    // Логируем результаты (только в development)
    if (process.env.NODE_ENV !== "production" && successCount < chatIds.length) {
      console.warn(`Sent to ${successCount}/${chatIds.length} chats. Failed:`, results.filter((r) => !r.success));
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

