import { Property } from "@/data/mock";

// Получить все объекты (только из БД, без fallback на mock)
export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch("/api/properties", {
      cache: "no-store", // Всегда получать свежие данные
    });

    if (!response.ok) {
      // Если API не работает (БД не настроена), возвращаем пустой массив
      console.warn("API not available, returning empty array");
      return [];
    }

    const data = await response.json();
    
    // Проверяем, что это массив (а не объект с ошибкой)
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    // Возвращаем пустой массив вместо mock данных
    return [];
  }
}

// Для серверных компонентов (SSR)
export async function getPropertiesServer(): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/properties`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching properties (server):", error);
    return [];
  }
}

