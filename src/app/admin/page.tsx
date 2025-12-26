"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Tab = "properties" | "testimonials";

interface Testimonial {
  id: string;
  initials: string;
  text: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("properties");
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
  const [testimonialForm, setTestimonialForm] = useState({
    initials: "",
    text: "",
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);

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

  useEffect(() => {
    // Загружаем отзывы при переключении на вкладку
    if (activeTab === "testimonials") {
      loadTestimonials();
    }
  }, [activeTab]);

  const loadTestimonials = async () => {
    setIsLoadingTestimonials(true);
    try {
      const response = await fetch("/api/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Защита от множественной отправки
    if (isSubmitting) return;
    
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmittingTestimonial) return;
    
    setSubmitStatus({ type: null, message: "" });
    setIsSubmittingTestimonial(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initials: testimonialForm.initials.trim(),
          text: testimonialForm.text.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при сохранении отзыва");
      }

      setSubmitStatus({
        type: "success",
        message: "Отзыв успешно добавлен!",
      });

      // Очищаем форму и обновляем список
      setTestimonialForm({ initials: "", text: "" });
      await loadTestimonials();

      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      console.error("Error saving testimonial:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Ошибка при сохранении отзыва. Проверьте консоль.",
      });
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Удалить этот отзыв?")) return;

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка при удалении");
      }

      setSubmitStatus({
        type: "success",
        message: "Отзыв удален!",
      });

      await loadTestimonials();
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Ошибка при удалении отзыва.",
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
        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "properties"
                ? "text-accent border-b-2 border-accent"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Объекты
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "testimonials"
                ? "text-accent border-b-2 border-accent"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Отзывы
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
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
                disabled={isSubmitting}
                className="flex-1 bg-accent hover:bg-accent/90 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Сохранение...
                  </>
                ) : (
                  "Сохранить объект"
                )}
              </button>
            </div>
          </form>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            {/* Add Testimonial Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Добавить отзыв из 2ГИС
              </h2>
              <p className="text-sm text-neutral-600 mb-4">
                Скопируйте отзыв с{" "}
                <a
                  href={process.env.NEXT_PUBLIC_DGIS_REVIEWS_URL || "https://2gis.ru/nalchik/branches/70000001034124982/firm/70000001096815639/43.576255%2C43.470569/tab/reviews"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  страницы отзывов в 2ГИС
                </a>{" "}
                и вставьте сюда.
              </p>

              {submitStatus.type && (
                <div
                  className={`mb-4 p-4 rounded-xl ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div>
                  <label className="block text-neutral-700 text-sm font-medium mb-2">
                    Инициалы автора *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.initials}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        initials: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Например: М.Б."
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 text-sm font-medium mb-2">
                    Текст отзыва *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={testimonialForm.text}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Вставьте текст отзыва из 2ГИС..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTestimonial}
                  className="w-full bg-accent hover:bg-accent/90 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmittingTestimonial ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Сохранение...
                    </>
                  ) : (
                    "Добавить отзыв"
                  )}
                </button>
              </form>
            </div>

            {/* Testimonials List */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Существующие отзывы ({testimonials.length})
              </h2>

              {isLoadingTestimonials ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-3 border-accent border-t-transparent rounded-full"></div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  Нет отзывов. Добавьте первый отзыв из 2ГИС.
                </div>
              ) : (
                <div className="space-y-3">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
                              {testimonial.initials}
                            </div>
                            <span className="text-sm text-neutral-600">
                              {testimonial.initials}
                            </span>
                            {testimonial.created_at && (
                              <span className="text-xs text-neutral-400">
                                {new Date(testimonial.created_at).toLocaleDateString("ru-RU")}
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-700 text-sm leading-relaxed">
                            {testimonial.text}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

