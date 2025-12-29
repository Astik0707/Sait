export type PropertyStatus = "sale";

export interface Property {
  id: string;
  title: string;
  district: string;
  addressHint: string;
  priceRub: number;
  areaM2: number;
  rooms: number;
  status: PropertyStatus;
  imageUrl: string;
  imageUrls?: string[];
  description: string;
  features: string[];
}

export interface Deal {
  id: string;
  badge: "Продано";
  district: string;
  dateLabel: string;
  priceRub?: number;
  note: string;
}

export interface Testimonial {
  id: string;
  initials: string;
  text: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Просторная квартира с видом на горы",
    district: "Центр",
    addressHint: "ул. Кабардинская",
    priceRub: 7450000,
    areaM2: 85,
    rooms: 3,
    status: "sale",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    description: "Светлая трёхкомнатная квартира с панорамным видом на Эльбрус. Свежий ремонт, качественные материалы, продуманная планировка.",
    features: ["Панорамные окна", "Встроенная кухня", "Два санузла", "Закрытый двор"],
  },
  {
    id: "3",
    title: "Двухуровневый дом с участком",
    district: "Александровка",
    addressHint: "ул. Садовая",
    priceRub: 12800000,
    areaM2: 180,
    rooms: 5,
    status: "sale",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    description: "Современный дом с продуманной планировкой. Участок 8 соток, ландшафтный дизайн, гараж на 2 машины.",
    features: ["Гараж", "Сад", "Терраса", "Сауна", "Камин"],
  },
  {
    id: "4",
    title: "Квартира в тихом районе",
    district: "Искож",
    addressHint: "ул. Мечникова",
    priceRub: 4200000,
    areaM2: 54,
    rooms: 2,
    status: "sale",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    description: "Двухкомнатная квартира после капитального ремонта. Тихий двор, рядом школа и детский сад.",
    features: ["Свежий ремонт", "Балкон", "Кладовая"],
  },
  {
    id: "6",
    title: "Пентхаус с террасой",
    district: "Центр",
    addressHint: "ул. Толстого",
    priceRub: 15900000,
    areaM2: 145,
    rooms: 4,
    status: "sale",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    description: "Эксклюзивный пентхаус на последнем этаже. Терраса 50 м², панорамный вид на город и горы.",
    features: ["Терраса", "Умный дом", "Дизайнерский ремонт", "Охрана"],
  },
  {
    id: "8",
    title: "Таунхаус в закрытом посёлке",
    district: "Долинск",
    addressHint: "кп Горный",
    priceRub: 9500000,
    areaM2: 140,
    rooms: 4,
    status: "sale",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    description: "Таунхаус в охраняемом посёлке. Готов к проживанию, качественная отделка под ключ.",
    features: ["Охрана 24/7", "Парковка", "Детская площадка", "Газон"],
  },
  {
    id: "9",
    title: "Двухкомнатная в новом доме",
    district: "Центр",
    addressHint: "ул. Осетинская",
    priceRub: 5800000,
    areaM2: 62,
    rooms: 2,
    status: "sale",
    imageUrl: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    description: "Квартира в сданном доме 2024 года. Чистовая отделка, готова к заселению.",
    features: ["Лифт", "Консьерж", "Подземный паркинг", "Видеонаблюдение"],
  },
];

export const deals: Deal[] = [
  {
    id: "1",
    badge: "Продано",
    district: "Центр",
    dateLabel: "Ноябрь 2024",
    priceRub: 8200000,
    note: "3-комнатная квартира, 92 м²",
  },
  {
    id: "3",
    badge: "Продано",
    district: "Александровка",
    dateLabel: "Сентябрь 2024",
    priceRub: 11500000,
    note: "Частный дом, 160 м², участок 6 сот.",
  },
  {
    id: "4",
    badge: "Продано",
    district: "Искож",
    dateLabel: "Август 2024",
    priceRub: 3900000,
    note: "2-комнатная квартира после ремонта",
  },
  {
    id: "6",
    badge: "Продано",
    district: "Долинск",
    dateLabel: "Июль 2024",
    priceRub: 7800000,
    note: "Таунхаус в закрытом посёлке",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    initials: "А.К.",
    text: "Профессиональный подход на каждом этапе. Помогли продать квартиру за месяц по хорошей цене.",
  },
  {
    id: "2",
    initials: "М.Б.",
    text: "Помогли найти идеальный дом для семьи. Профессиональный подход, все документы в порядке. Рекомендую.",
  },
  {
    id: "3",
    initials: "Р.Т.",
    text: "Сопровождали сделку от начала до конца. Все документы в порядке, никаких сюрпризов. Рекомендую.",
  },
];

// Utility functions
export function formatPrice(price: number, isMonthly = false): string {
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return isMonthly ? `${formatted} ₽/мес` : `${formatted} ₽`;
}

export function formatArea(area: number): string {
  return `${area} м²`;
}

export function getRoomsLabel(rooms: number): string {
  if (rooms === 1) return "1 комната";
  if (rooms >= 2 && rooms <= 4) return `${rooms} комнаты`;
  return `${rooms} комнат`;
}

