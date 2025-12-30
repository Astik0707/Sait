import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// Увеличиваем лимит размера тела запроса для загрузки изображений
export const runtime = 'nodejs';
export const maxDuration = 30;

// GET - получить все сделки
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch deals" },
        { status: 500 }
      );
    }

    // Преобразуем формат из БД в формат фронтенда
    const deals = data.map((deal) => {
      // Пытаемся получить массив изображений из БД
      let imageUrls: string[] | undefined;
      if (deal.image_urls) {
        try {
          imageUrls = typeof deal.image_urls === 'string' 
            ? JSON.parse(deal.image_urls) 
            : deal.image_urls;
        } catch (e) {
          console.error(`Failed to parse image_urls for deal ${deal.id}:`, e);
          imageUrls = undefined;
        }
      }

      return {
        id: deal.id,
        badge: deal.badge || "Продано",
        district: deal.district,
        dateLabel: deal.date_label,
        priceRub: deal.price_rub || undefined,
        note: deal.note,
        imageUrl: deal.image_url || undefined,
        imageUrls: imageUrls,
      };
    });

    return NextResponse.json(deals || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - создать новую сделку (требует авторизации)
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { badge, district, dateLabel, priceRub, note, imageUrl, imageUrls: imageUrlsFromBody } = body;

    // Валидация
    if (!district || !dateLabel || !note) {
      return NextResponse.json(
        { error: "Missing required fields: district, dateLabel, note" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Определяем основное изображение и массив изображений
    const mainImageUrl = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody[0] 
      : (imageUrl || null);
    
    const imagesArray = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody 
      : (imageUrl ? [imageUrl] : []);

    const insertData: any = {
      badge: badge || "Продано",
      district: district.trim(),
      date_label: dateLabel.trim(),
      price_rub: priceRub ? parseInt(String(priceRub)) : null,
      note: note.trim(),
      image_url: mainImageUrl,
    };

    // Сохраняем массив изображений как JSON в поле image_urls
    if (imagesArray.length > 0) {
      try {
        insertData.image_urls = JSON.stringify(imagesArray);
        console.log("Saving deal image_urls:", imagesArray.length, "images");
      } catch (e) {
        console.error("Failed to stringify image_urls:", e);
      }
    } else {
      insertData.image_urls = null;
    }

    const { data, error } = await supabaseAdmin
      .from("deals")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create deal", details: error.message },
        { status: 500 }
      );
    }

    // Парсим image_urls если есть
    let imageUrls: string[] | undefined;
    if (data.image_urls) {
      try {
        imageUrls = typeof data.image_urls === 'string' 
          ? JSON.parse(data.image_urls) 
          : data.image_urls;
      } catch (e) {
        console.error(`Failed to parse image_urls for deal ${data.id}:`, e);
        imageUrls = undefined;
      }
    }

    return NextResponse.json(
      {
        id: data.id,
        badge: data.badge,
        district: data.district,
        dateLabel: data.date_label,
        priceRub: data.price_rub || undefined,
        note: data.note,
        imageUrl: data.image_url || undefined,
        imageUrls: imageUrls,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - обновить сделку (требует авторизации)
export async function PUT(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { badge, district, dateLabel, priceRub, note, imageUrl, imageUrls: imageUrlsFromBody } = body;

    // Валидация
    if (!district || !dateLabel || !note) {
      return NextResponse.json(
        { error: "Missing required fields: district, dateLabel, note" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Определяем основное изображение и массив изображений
    const mainImageUrl = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody[0] 
      : (imageUrl || null);
    
    const imagesArray = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody 
      : (imageUrl ? [imageUrl] : []);

    const updateData: any = {
      badge: badge || "Продано",
      district: district.trim(),
      date_label: dateLabel.trim(),
      price_rub: priceRub ? parseInt(String(priceRub)) : null,
      note: note.trim(),
      image_url: mainImageUrl,
    };

    // Сохраняем массив изображений как JSON в поле image_urls
    if (imagesArray.length > 0) {
      try {
        updateData.image_urls = JSON.stringify(imagesArray);
        console.log("Updating deal image_urls:", imagesArray.length, "images");
      } catch (e) {
        console.error("Failed to stringify image_urls:", e);
      }
    } else {
      updateData.image_urls = null;
    }

    const { data, error } = await supabaseAdmin
      .from("deals")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update deal", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Парсим image_urls если есть
    let imageUrls: string[] | undefined;
    if (data.image_urls) {
      try {
        imageUrls = typeof data.image_urls === 'string' 
          ? JSON.parse(data.image_urls) 
          : data.image_urls;
      } catch (e) {
        console.error(`Failed to parse image_urls for deal ${data.id}:`, e);
        imageUrls = undefined;
      }
    }

    return NextResponse.json(
      {
        id: data.id,
        badge: data.badge,
        district: data.district,
        dateLabel: data.date_label,
        priceRub: data.price_rub || undefined,
        note: data.note,
        imageUrl: data.image_url || undefined,
        imageUrls: imageUrls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - удалить сделку (требует авторизации)
export async function DELETE(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from("deals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete deal", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

