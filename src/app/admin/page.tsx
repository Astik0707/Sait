"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    district: "",
    addressHint: "",
    priceRub: "",
    areaM2: "",
    rooms: "",
    imageUrl: "",
    description: "",
    features: "",
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    // Проверяем авторизацию
    fetch("/api/auth/check")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          district: formData.district,
          addressHint: formData.addressHint,
          priceRub: formData.priceRub,
          areaM2: formData.areaM2,
          rooms: formData.rooms,
          imageUrl:
            formData.imageUrl ||
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
          description: formData.description,
          features: formData.features,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Если БД не настроена, показываем fallback сообщение
        if (data.useMock) {
          setSubmitStatus({
            type: "error",
            message:
              "База данных не настроена. Настройте Supabase и добавьте переменные окружения. Пока используйте mock.ts",
          });
          return;
        }
        throw new Error(data.error || "Ошибка при сохранении");
      }

      setSubmitStatus({
        type: "success",
        message: "Объект успешно добавлен в базу данных!",
      });

      // Очищаем форму
      setFormData({
        title: "",
        district: "",
        addressHint: "",
        priceRub: "",
        areaM2: "",
        rooms: "",
        imageUrl: "",
        description: "",
        features: "",
      });

      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      console.error("Error saving property:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Ошибка при сохранении объекта. Проверьте консоль.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="font-display text-xl font-bold text-neutral-900">
                Pach Group
              </a>
              <span className="text-neutral-400">|</span>
              <span className="text-neutral-600 text-sm">Админ-панель</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">
            Добавить новый объект
          </h1>

          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                submitStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-neutral-700 text-sm font-medium mb-2">
                Название объекта *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="Например: Просторная квартира с видом на горы"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-neutral-700 text-sm font-medium mb-2">
                  Район *
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Например: Центр"
                />
              </div>

              <div>
                <label className="block text-neutral-700 text-sm font-medium mb-2">
                  Адрес (подсказка) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressHint}
                  onChange={(e) =>
                    setFormData({ ...formData, addressHint: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Например: ул. Кабардинская"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-neutral-700 text-sm font-medium mb-2">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.priceRub}
                  onChange={(e) =>
                    setFormData({ ...formData, priceRub: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="7450000"
                />
              </div>

              <div>
                <label className="block text-neutral-700 text-sm font-medium mb-2">
                  Площадь (м²) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={formData.areaM2}
                  onChange={(e) =>
                    setFormData({ ...formData, areaM2: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="85"
                />
              </div>

              <div>
                <label className="block text-neutral-700 text-sm font-medium mb-2">
                  Комнат *
                </label>
                <input
                  type="number"
                  required
                  value={formData.rooms}
                  onChange={(e) =>
                    setFormData({ ...formData, rooms: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                  placeholder="3"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 text-sm font-medium mb-2">
                Изображение
              </label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl transition-colors">
                    <svg
                      className="w-5 h-5 text-neutral-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-neutral-700 text-sm font-medium">
                      Загрузить фото
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({
                            ...formData,
                            imageUrl: reader.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <span className="flex items-center text-neutral-400 text-sm">
                  или
                </span>
                <input
                  type="url"
                  value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors text-sm"
                  placeholder="Вставьте URL изображения"
                  disabled={formData.imageUrl.startsWith("data:")}
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-3 relative">
                  <img
                    src={formData.imageUrl}
                    alt="Превью"
                    className="w-full h-40 object-cover rounded-xl border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-neutral-700 text-sm font-medium mb-2">
                Описание *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Подробное описание объекта..."
              />
            </div>

            <div>
              <label className="block text-neutral-700 text-sm font-medium mb-2">
                Особенности (через запятую)
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="Панорамные окна, Встроенная кухня, Два санузла"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="/"
                className="flex-1 text-center px-4 py-3 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors font-medium"
              >
                На сайт
              </a>
              <button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Сохранить объект
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

