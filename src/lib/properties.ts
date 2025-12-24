import { Property } from "@/data/mock";
import { properties as mockProperties } from "@/data/mock";

// Получить все объекты (с fallback на mock)
export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch("/api/properties", {
      cache: "no-store", // Всегда получать свежие данные
    });

    if (!response.ok) {
      // Если API не работает (БД не настроена), используем mock
      console.warn("API not available, using mock data");
      return mockProperties;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    // Fallback на mock данные
    return mockProperties;
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
      return mockProperties;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching properties (server):", error);
    return mockProperties;
  }
}

