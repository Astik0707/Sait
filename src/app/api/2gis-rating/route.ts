import { NextRequest, NextResponse } from "next/server";

// ID филиала в 2ГИС (из env)
const DGIS_BRANCH_ID = process.env.DGIS_BRANCH_ID || "70000001096815639";
// URL страницы с отзывами в 2ГИС (из env, публичный)
const DGIS_REVIEWS_URL = process.env.NEXT_PUBLIC_DGIS_REVIEWS_URL || "https://2gis.ru/nalchik/branches/70000001034124982/firm/70000001096815639/43.576255%2C43.470569/tab/reviews";

// Кэш в памяти (в продакшене лучше использовать Redis или другой кэш)
interface CacheEntry {
  data: {
    rating: number;
    reviewsCount: number;
    reviewsUrl: string;
  };
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 60 минут

interface DGISResponse {
  meta?: { code?: number };
  result?: {
    items?: Array<{
      id?: string;
      type?: string;
      reviews?: {
        general_rating?: number;
        general_review_count?: number;
        org_rating?: number;
        org_review_count?: number;
        [k: string]: any;
      };
      [k: string]: any;
    }>;
    [k: string]: any;
  };
}

// GET - получение рейтинга и количества отзывов из 2ГИС
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.DGIS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "2GIS API key not configured",
          hint: "Add DGIS_API_KEY to your .env.local file. Get your key at https://platform.2gis.ru/",
        },
        { status: 500 }
      );
    }

    // Проверяем кэш
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
          "X-Cache": "HIT",
        },
      });
    }

    // Запрос к 2ГИС API
    const apiUrl = `https://catalog.api.2gis.com/3.0/items/byid?id=${DGIS_BRANCH_ID}&fields=items.reviews&key=${apiKey}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Next.js кэширование на 1 час
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("2GIS API error:", response.status, errorText);

      // Если есть старые данные в кэше, возвращаем их
      if (cache) {
        return NextResponse.json(
          {
            ...cache.data,
            warning: "Using cached data due to API error",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=3600",
              "X-Cache": "STALE",
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to fetch data from 2GIS API",
          details: `HTTP ${response.status}: ${response.statusText}`,
          hint: "Check your API key and branch ID. API key can be obtained at https://platform.2gis.ru/",
        },
        { status: response.status }
      );
    }

    const data: DGISResponse = await response.json();

    // Проверяем структуру ответа
    if (
      data.meta?.code !== 200 ||
      !data.result?.items ||
      data.result.items.length === 0
    ) {
      // Если есть старые данные в кэше, возвращаем их
      if (cache) {
        return NextResponse.json(
          {
            ...cache.data,
            warning: "Using cached data due to invalid API response",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=3600",
              "X-Cache": "STALE",
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: "Invalid response from 2GIS API",
          details: "No items found in response",
          hint: "Check if the branch ID is correct",
        },
        { status: 500 }
      );
    }

    const item = data.result.items[0];
    const r = item.reviews || {};

    const ratingRaw =
      (typeof r.general_rating === "number" ? r.general_rating : undefined) ??
      (typeof r.org_rating === "number" ? r.org_rating : undefined) ??
      0;

    const countRaw =
      (typeof r.general_review_count === "number" ? r.general_review_count : undefined) ??
      (typeof r.org_review_count === "number" ? r.org_review_count : undefined) ??
      0;

    const rating = Math.round(ratingRaw * 10) / 10;
    const reviewsCount = Math.trunc(countRaw);

    // Сохраняем в кэш
    const result = {
      rating,
      reviewsCount,
      reviewsUrl: DGIS_REVIEWS_URL,
    };

    cache = {
      data: result,
      timestamp: Date.now(),
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("2GIS rating API error:", error);

    // Если есть старые данные в кэше, возвращаем их
    if (cache) {
      return NextResponse.json(
        {
          ...cache.data,
          warning: "Using cached data due to error",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600",
            "X-Cache": "STALE",
          },
        }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

