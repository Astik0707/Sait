import { headers } from "next/headers";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HouseAnimation from "@/components/HouseAnimation";
import Listings from "@/components/Listings";
import Deals from "@/components/Deals";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";

interface DGISRating {
  rating: number;
  reviewsCount: number;
  reviewsUrl: string;
  warning?: string;
}

async function fetchDgisRating(): Promise<DGISRating | null> {
  try {
    // Получаем base URL из headers для построения абсолютного URL
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
    
    // Если host отсутствует, безопасно возвращаем null
    if (!host) {
      console.warn("Missing host header, cannot fetch 2GIS rating during SSR");
      return null;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/2gis-rating`, {
      cache: "no-store", // Не кэшировать на уровне Next.js, используем кэш API route
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Проверяем, что это не ошибка
    if (data.error || data.rating === undefined || data.reviewsCount === undefined) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch 2GIS rating during SSR:", error);
    return null;
  }
}

export default async function Home() {
  // Fetch 2GIS rating during SSR
  const initialDgisRating = await fetchDgisRating();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HouseAnimation />
        <Listings />
        <Deals />
        <Services />
        <Testimonials initialDgisRating={initialDgisRating} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

