"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  id: string;
  initials: string;
  text: string;
}

interface DGISRating {
  rating: number;
  reviewsCount: number;
  reviewsUrl: string;
  warning?: string;
}

interface TestimonialsProps {
  initialDgisRating?: DGISRating | null;
}

const trustItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Сопровождение сделки",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: "Переговоры",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Юр. поддержка",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Компонент карточки отзыва с возможностью сворачивания
function TestimonialCard({ testimonial, variants }: { testimonial: Testimonial; variants: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 200; // Максимальная длина текста до обрезки
  const shouldTruncate = testimonial.text.length > MAX_LENGTH;
  const displayText = isExpanded || !shouldTruncate 
    ? testimonial.text 
    : testimonial.text.substring(0, MAX_LENGTH) + "...";

  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl p-8 border border-neutral-200 hover:border-accent/30 shadow-sm hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 relative overflow-hidden group"
    >
      {/* Animated background on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"
      />
      
      {/* Quote icon */}
      <motion.svg
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="w-10 h-10 text-accent/30 mb-6 relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </motion.svg>

      {/* Quote text */}
      <motion.p
        whileHover={{ x: 4 }}
        className="text-neutral-700 text-lg leading-relaxed mb-4 relative z-10"
      >
        {displayText}
      </motion.p>

      {/* Кнопка "Читать далее/Свернуть" */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-accent hover:text-accent/80 font-medium text-sm mb-6 relative z-10 transition-colors flex items-center gap-1 group/btn"
        >
          {isExpanded ? (
            <>
              <span>Свернуть</span>
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </>
          ) : (
            <>
              <span>Читать далее</span>
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </button>
      )}

      {/* Author */}
      <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center gap-3 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20"
        >
          <span className="text-accent font-semibold text-sm">
            {testimonial.initials}
          </span>
        </motion.div>
        <span className="text-neutral-600 text-sm">Клиент</span>
      </motion.div>
    </motion.article>
  );
}

export default function Testimonials({ initialDgisRating = null }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dgisRating, setDgisRating] = useState<DGISRating | null>(initialDgisRating);
  const [isLoadingRating, setIsLoadingRating] = useState(!initialDgisRating);

  useEffect(() => {
    // Загружаем отзывы из API
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching testimonials:", error);
        setTestimonials([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Загружаем рейтинг из 2ГИС только если не был передан через SSR
    if (!initialDgisRating) {
      fetch("/api/2gis-rating")
        .then((res) => res.json())
        .then((data) => {
          if (data.rating !== undefined && data.reviewsCount !== undefined) {
            setDgisRating(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching 2GIS rating:", error);
          // Не критично, просто не показываем рейтинг
        })
        .finally(() => {
          setIsLoadingRating(false);
        });
    }
  }, [initialDgisRating]);

  return (
    <section className="relative py-24 md:py-32 bg-neutral-50 overflow-hidden">
      {/* Static background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container-width section-padding">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-medium mb-4 uppercase tracking-wider"
          >
            Отзывы
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4"
          >
            Что говорят клиенты
          </motion.h2>

          {/* 2ГИС рейтинг и кнопка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            {!isLoadingRating && dgisRating && (
              <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 border border-neutral-200 shadow-sm">
                {/* Звёздочки */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(dgisRating.rating);
                    const halfFilled =
                      !filled &&
                      star === Math.ceil(dgisRating.rating) &&
                      dgisRating.rating % 1 >= 0.5;
                    return (
                      <div key={star} className="relative">
                        <svg
                          className={`w-5 h-5 ${
                            filled
                              ? "text-yellow-400 fill-current"
                              : "text-neutral-300"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {halfFilled && (
                          <div className="absolute inset-0 overflow-hidden w-1/2">
                            <svg
                              className="w-5 h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-neutral-900">
                    {dgisRating.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {dgisRating.reviewsCount}{" "}
                    {dgisRating.reviewsCount === 1
                      ? "отзыв"
                      : dgisRating.reviewsCount < 5
                      ? "отзыва"
                      : "отзывов"}
                  </span>
                </div>
              </div>
            )}
            <motion.a
              href={
                dgisRating?.reviewsUrl ||
                "https://2gis.ru/nalchik/branches/70000001034124982/firm/70000001096815639/43.576255%2C43.470569/tab/reviews"
              }
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm hover:shadow-md"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Смотреть все отзывы в 2ГИС
            </motion.a>
          </motion.div>
        </div>

        {/* Testimonials grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-neutral-200 animate-pulse"
              >
                <div className="h-10 w-10 bg-neutral-200 rounded mb-6"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                  <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} variants={itemVariants} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 mb-16">
            <p className="text-neutral-500 text-lg">
              Отзывы появятся здесь после добавления в админ-панели
            </p>
          </div>
        )}

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm"
        >
          <div className="grid sm:grid-cols-3 gap-8">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 4 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent"
                >
                  {item.icon}
                </motion.div>
                <motion.span
                  whileHover={{ color: "#722F37" }}
                  className="text-neutral-900 font-medium transition-colors"
                >
                  {item.title}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

