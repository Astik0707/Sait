import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// PUT - обновить объект
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      status,
    } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (district) updateData.district = district;
    if (addressHint) updateData.address_hint = addressHint;
    if (priceRub) updateData.price_rub = parseInt(priceRub);
    if (areaM2) updateData.area_m2 = parseFloat(areaM2);
    if (rooms) updateData.rooms = parseInt(rooms);
    if (imageUrl) updateData.image_url = imageUrl;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) {
      updateData.features = Array.isArray(features)
        ? features
        : features
            .split(",")
            .map((f: string) => f.trim())
            .filter((f: string) => f);
    }
    if (status) updateData.status = status;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("properties")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update property", details: error.message },
        { status: 500 }
      );
    }

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

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - удалить объект
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      .eq("id", params.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete property", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

