import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET - получить все объекты
export async function GET() {
  try {
    // Проверяем наличие Supabase клиента
    if (!supabase) {
      // Возвращаем пустой массив вместо ошибки
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "sale")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      // Возвращаем пустой массив вместо ошибки
      return NextResponse.json([]);
    }

    // Преобразуем формат из БД в формат фронтенда
    const properties = (data || []).map((prop) => ({
      id: prop.id,
      title: prop.title,
      district: prop.district,
      addressHint: prop.address_hint,
      priceRub: prop.price_rub,
      areaM2: prop.area_m2,
      rooms: prop.rooms,
      status: prop.status,
      imageUrl: prop.image_url,
      description: prop.description,
      features: prop.features || [],
    }));

    return NextResponse.json(properties);
  } catch (error) {
    console.error("API error:", error);
    // Возвращаем пустой массив вместо ошибки
    return NextResponse.json([]);
  }
}

// POST - создать новый объект (требует авторизации)
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации через cookie
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      district,
      addressHint,
      priceRub,
      areaM2,
      rooms,
      imageUrl,
      description,
      features,
    } = body;

    // Валидация
    if (!title || !district || !addressHint || !priceRub || !areaM2 || !rooms) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Используем admin клиент для записи
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local" },
        { status: 500 }
      );
    }

    // Преобразуем формат фронтенда в формат БД
    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert({
        title,
        district,
        address_hint: addressHint,
        price_rub: parseInt(priceRub),
        area_m2: parseFloat(areaM2),
        rooms: parseInt(rooms),
        status: "sale",
        image_url: imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        description: description || "",
        features: Array.isArray(features)
          ? features
          : features
              ? features.split(",").map((f: string) => f.trim()).filter((f: string) => f)
              : [],
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create property", details: error.message },
        { status: 500 }
      );
    }

    // Возвращаем в формате фронтенда
    const property = {
      id: data.id,
      title: data.title,
      district: data.district,
      addressHint: data.address_hint,
      priceRub: data.price_rub,
      areaM2: data.area_m2,
      rooms: data.rooms,
      status: data.status,
      imageUrl: data.image_url,
      description: data.description,
      features: data.features || [],
    };

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - удалить объект (требует авторизации)
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
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete property", details: error.message },
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

