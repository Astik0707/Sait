import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Проверяем наличие credentials
const hasCredentials = supabaseUrl && supabaseAnonKey;

if (!hasCredentials) {
  console.warn(
    "Supabase credentials not found. Using mock data. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  );
}

// Клиент для чтения (публичный) - создаём только если есть credentials
export const supabase = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Клиент для записи (с Service Role Key - только на сервере!)
export const supabaseAdmin =
  hasCredentials && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

// Типы для таблиц
export interface Property {
  id: string;
  title: string;
  district: string;
  address_hint: string;
  price_rub: number;
  area_m2: number;
  rooms: number;
  status: "sale" | "sold";
  image_url: string;
  description: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  badge: "Продано";
  district: string;
  date_label: string;
  price_rub?: number;
  note: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  initials: string;
  text: string;
  created_at?: string;
}

