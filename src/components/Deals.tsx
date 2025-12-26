"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/data/mock";

interface Deal {
  id: string;
  badge: "Продано";
  district: string;
  dateLabel: string;
  priceRub?: number;
  note: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загружаем сделки из API
    fetch("/api/deals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDeals(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching deals:", error);
        setDeals([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="deals" className="relative py-24 md:py-32 bg-neutral-50 overflow-hidden">
      {/* Static background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container-width section-padding">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-medium mb-4 uppercase tracking-wider"
          >
            Результаты
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4"
          >
            Успешные сделки
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-600 text-lg max-w-xl mx-auto"
          >
            Завершённые проекты — лучшее подтверждение нашей работы
          </motion.p>
        </div>

        {/* Deals grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-neutral-200 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                </div>
                <div className="h-5 w-full bg-neutral-200 rounded mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 bg-neutral-200 rounded"></div>
                  <div className="h-5 w-24 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : deals.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {deals.map((deal) => (
            <motion.article
              key={deal.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-accent/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent/10 relative overflow-hidden group"
            >
              {/* Animated background gradient on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"
              />
              
              {/* Badge and date */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20"
                >
                  {deal.badge}
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-neutral-600 text-sm font-medium"
                >
                  {deal.dateLabel}
                </motion.span>
              </div>

              {/* Note */}
              <motion.p
                whileHover={{ x: 4 }}
                className="relative z-10 text-neutral-900 font-medium mb-3 transition-colors group-hover:text-accent"
              >
                {deal.note}
              </motion.p>

              {/* District and price */}
              <div className="relative z-10 flex items-center justify-between">
                <motion.span
                  whileHover={{ scale: 1.05, color: "#722F37" }}
                  className="text-neutral-600 text-sm flex items-center gap-1.5 transition-colors"
                >
                  <motion.svg
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </motion.svg>
                  {deal.district}
                </motion.span>
                {deal.priceRub && (
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-accent font-semibold text-lg"
                  >
                    {formatPrice(deal.priceRub, false)}
                  </motion.span>
                )}
              </div>
            </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">
              Сделки появятся здесь после добавления в админ-панели
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

