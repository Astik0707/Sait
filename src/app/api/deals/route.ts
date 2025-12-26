import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

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
    const deals = data.map((deal) => ({
      id: deal.id,
      badge: deal.badge || "Продано",
      district: deal.district,
      dateLabel: deal.date_label,
      priceRub: deal.price_rub || undefined,
      note: deal.note,
    }));

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
    const { badge, district, dateLabel, priceRub, note } = body;

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

    const { data, error } = await supabaseAdmin
      .from("deals")
      .insert({
        badge: badge || "Продано",
        district: district.trim(),
        date_label: dateLabel.trim(),
        price_rub: priceRub ? parseInt(priceRub) : null,
        note: note.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create deal", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: data.id,
        badge: data.badge,
        district: data.district,
        dateLabel: data.date_label,
        priceRub: data.price_rub || undefined,
        note: data.note,
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

