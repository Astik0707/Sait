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
    const properties = (data || []).map((prop: any) => {
      // Пытаемся получить массив изображений из БД
      let imageUrls: string[] | undefined;
      if (prop.image_urls) {
        // Если есть поле image_urls, пытаемся распарсить JSON
        try {
          imageUrls = typeof prop.image_urls === 'string' 
            ? JSON.parse(prop.image_urls) 
            : prop.image_urls;
          console.log(`GET /api/properties - Property ${prop.id}: ${imageUrls?.length || 0} images from DB`);
        } catch (e) {
          console.error(`GET /api/properties - Failed to parse image_urls for ${prop.id}:`, e);
          imageUrls = undefined;
        }
      } else {
        console.log(`GET /api/properties - Property ${prop.id}: no image_urls field`);
      }
      
      return {
        id: prop.id,
        title: prop.title,
        district: prop.district,
        addressHint: prop.address_hint,
        priceRub: prop.price_rub,
        areaM2: prop.area_m2,
        rooms: prop.rooms,
        status: prop.status,
        imageUrl: prop.image_url,
        imageUrls: imageUrls,
        description: prop.description,
        features: prop.features || [],
      };
    });

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
      imageUrls: imageUrlsFromBody,
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

    // Валидация числовых полей
    const priceRubNum = parseInt(String(priceRub));
    const areaM2Num = parseFloat(String(areaM2));
    const roomsNum = parseInt(String(rooms));

    if (isNaN(priceRubNum) || priceRubNum <= 0) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    if (isNaN(areaM2Num) || areaM2Num <= 0) {
      return NextResponse.json(
        { error: "Invalid area" },
        { status: 400 }
      );
    }

    if (isNaN(roomsNum) || roomsNum <= 0) {
      return NextResponse.json(
        { error: "Invalid number of rooms" },
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

    // Определяем основное изображение и массив изображений
    const mainImageUrl = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody[0] 
      : (imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80");
    
    const imagesArray = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody 
      : (imageUrl ? [imageUrl] : []);

    // Преобразуем формат фронтенда в формат БД
    const insertData: any = {
      title,
      district,
      address_hint: addressHint,
      price_rub: priceRubNum,
      area_m2: areaM2Num,
      rooms: roomsNum,
      status: "sale",
      image_url: mainImageUrl,
      description: description || "",
      features: Array.isArray(features)
        ? features
        : features
            ? features.split(",").map((f: string) => f.trim()).filter((f: string) => f)
            : [],
    };

    // Сохраняем массив изображений как JSON в поле image_urls
    if (imagesArray.length > 0) {
      try {
        insertData.image_urls = JSON.stringify(imagesArray);
        console.log("Saving image_urls:", imagesArray.length, "images");
      } catch (e) {
        console.error("Failed to stringify image_urls:", e);
        // Продолжаем без image_urls, но логируем ошибку
      }
    } else {
      // Если нет изображений, устанавливаем null
      insertData.image_urls = null;
    }

    console.log("Inserting property with data:", {
      title: insertData.title,
      image_url: insertData.image_url,
      image_urls: insertData.image_urls ? `JSON with ${imagesArray.length} images` : "null",
      image_urls_length: imagesArray.length,
      image_urls_preview: insertData.image_urls ? insertData.image_urls.substring(0, 100) + "..." : null
    });

    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      console.error("Error code:", error.code);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      
      // Если ошибка связана с отсутствующим полем image_urls, попробуем без него
      if (error.message && (error.message.includes("image_urls") || error.message.includes("column") || error.code === "42703")) {
        console.warn("Field image_urls doesn't exist, retrying without it");
        const insertDataWithoutImageUrls = { ...insertData };
        delete insertDataWithoutImageUrls.image_urls;
        
        const retryResult = await supabaseAdmin
          .from("properties")
          .insert(insertDataWithoutImageUrls)
          .select()
          .single();
        
        if (retryResult.error) {
          return NextResponse.json(
            { error: "Failed to create property", details: retryResult.error.message },
            { status: 500 }
          );
        }
        
        // Возвращаем результат без image_urls
        const retryData = retryResult.data;
        return NextResponse.json({
          id: retryData.id,
          title: retryData.title,
          district: retryData.district,
          addressHint: retryData.address_hint,
          priceRub: retryData.price_rub,
          areaM2: retryData.area_m2,
          rooms: retryData.rooms,
          status: retryData.status,
          imageUrl: retryData.image_url,
          imageUrls: imagesArray.length > 0 ? imagesArray : undefined,
          description: retryData.description,
          features: retryData.features || [],
        }, { status: 201 });
      }
      
      return NextResponse.json(
        { error: "Failed to create property", details: error.message, code: error.code },
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
        console.log(`POST /api/properties - Saved property ${data.id}: ${imageUrls?.length || 0} images in DB`);
      } catch (e) {
        console.error(`POST /api/properties - Failed to parse image_urls for ${data.id}:`, e);
        imageUrls = undefined;
      }
    } else {
      console.log(`POST /api/properties - Property ${data.id}: no image_urls field in DB response`);
      // Если поле не существует в БД, но у нас есть изображения, возвращаем их на фронтенде
      // Это позволит отображать изображения, даже если они не сохранились в БД
      if (imagesArray.length > 0) {
        imageUrls = imagesArray;
        console.log(`POST /api/properties - Using fallback: returning ${imagesArray.length} images from request`);
      }
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
      imageUrls: imageUrls,
      description: data.description,
      features: data.features || [],
    };

    console.log(`POST /api/properties - Returning property with ${imageUrls?.length || 0} images`);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - обновить объект (требует авторизации)
export async function PUT(request: NextRequest) {
  try {
    // Проверка авторизации через cookie
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
    const {
      title,
      district,
      addressHint,
      priceRub,
      areaM2,
      rooms,
      imageUrl,
      imageUrls: imageUrlsFromBody,
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

    // Валидация числовых полей
    const priceRubNum = parseInt(String(priceRub));
    const areaM2Num = parseFloat(String(areaM2));
    const roomsNum = parseInt(String(rooms));

    if (isNaN(priceRubNum) || priceRubNum <= 0) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    if (isNaN(areaM2Num) || areaM2Num <= 0) {
      return NextResponse.json(
        { error: "Invalid area" },
        { status: 400 }
      );
    }

    if (isNaN(roomsNum) || roomsNum <= 0) {
      return NextResponse.json(
        { error: "Invalid number of rooms" },
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

    // Определяем основное изображение и массив изображений
    const mainImageUrl = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody[0] 
      : (imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80");
    
    const imagesArray = imageUrlsFromBody && imageUrlsFromBody.length > 0 
      ? imageUrlsFromBody 
      : (imageUrl ? [imageUrl] : []);

    // Преобразуем формат фронтенда в формат БД
    const updateData: any = {
      title,
      district,
      address_hint: addressHint,
      price_rub: priceRubNum,
      area_m2: areaM2Num,
      rooms: roomsNum,
      image_url: mainImageUrl,
      description: description || "",
      features: Array.isArray(features)
        ? features
        : features
            ? features.split(",").map((f: string) => f.trim()).filter((f: string) => f)
            : [],
    };

    // Сохраняем массив изображений как JSON в поле image_urls
    if (imagesArray.length > 0) {
      try {
        updateData.image_urls = JSON.stringify(imagesArray);
        console.log("Updating image_urls:", imagesArray.length, "images");
      } catch (e) {
        console.error("Failed to stringify image_urls:", e);
        // Продолжаем без image_urls
      }
    } else {
      // Если нет изображений, устанавливаем null
      updateData.image_urls = null;
    }

    console.log("Updating property with data:", {
      id,
      image_url: updateData.image_url,
      image_urls: updateData.image_urls ? "present" : "null",
      image_urls_length: imagesArray.length
    });

    // Проверяем, что обновляется только одна запись
    const { data: updateResult, error: updateError } = await supabaseAdmin
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      console.error("Error code:", updateError.code);
      console.error("Error details:", updateError.details);
      console.error("Error hint:", updateError.hint);
      
      // Если ошибка связана с отсутствующим полем image_urls, попробуем без него
      if (updateError.message && (updateError.message.includes("image_urls") || updateError.message.includes("column") || updateError.code === "42703")) {
        console.warn("Field image_urls doesn't exist, retrying without it");
        const updateDataWithoutImageUrls = { ...updateData };
        delete updateDataWithoutImageUrls.image_urls;
        
        const retryResult = await supabaseAdmin
          .from("properties")
          .update(updateDataWithoutImageUrls)
          .eq("id", id)
          .select();
        
        if (retryResult.error) {
          return NextResponse.json(
            { error: "Failed to update property", details: retryResult.error.message },
            { status: 500 }
          );
        }
        
        if (!retryResult.data || retryResult.data.length === 0) {
          return NextResponse.json(
            { error: "Property not found" },
            { status: 404 }
          );
        }
        
        // Возвращаем результат без image_urls
        const retryData = retryResult.data[0];
        let imageUrls: string[] | undefined;
        if (imagesArray.length > 0) {
          imageUrls = imagesArray;
        }
        
        return NextResponse.json({
          id: retryData.id,
          title: retryData.title,
          district: retryData.district,
          addressHint: retryData.address_hint,
          priceRub: retryData.price_rub,
          areaM2: retryData.area_m2,
          rooms: retryData.rooms,
          status: retryData.status,
          imageUrl: retryData.image_url,
          imageUrls: imageUrls,
          description: retryData.description,
          features: retryData.features || [],
        }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: "Failed to update property", details: updateError.message, code: updateError.code },
        { status: 500 }
      );
    }

    // Проверяем результат
    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (updateResult.length > 1) {
      console.warn(`Multiple properties updated for id ${id}, using first one`);
    }

    const data = updateResult[0];

    // Парсим image_urls если есть
    let imageUrls: string[] | undefined;
    if (data.image_urls) {
      try {
        imageUrls = typeof data.image_urls === 'string' 
          ? JSON.parse(data.image_urls) 
          : data.image_urls;
        console.log(`PUT /api/properties - Updated property ${data.id}: ${imageUrls?.length || 0} images in DB`);
      } catch (e) {
        console.error(`PUT /api/properties - Failed to parse image_urls for ${data.id}:`, e);
        imageUrls = undefined;
      }
    } else {
      console.log(`PUT /api/properties - Property ${data.id}: no image_urls field in DB response`);
      // Если поле не существует в БД, но у нас есть изображения, возвращаем их на фронтенде
      if (imagesArray.length > 0) {
        imageUrls = imagesArray;
        console.log(`PUT /api/properties - Using fallback: returning ${imagesArray.length} images from request`);
      }
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
      imageUrls: imageUrls,
      description: data.description,
      features: data.features || [],
    };

    console.log(`PUT /api/properties - Returning property with ${imageUrls?.length || 0} images`);
    return NextResponse.json(property, { status: 200 });
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

