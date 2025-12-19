"use client";

import { motion } from "framer-motion";
import { deals, formatPrice } from "@/data/mock";

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
  return (
    <section id="deals" className="py-24 md:py-32 bg-neutral-50">
      <div className="container-width section-padding">
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
              className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-neutral-300 transition-colors shadow-sm hover:shadow-md"
            >
              {/* Badge and date */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    deal.badge === "Продано"
                      ? "bg-accent/10 text-accent"
                      : "bg-blue-500/10 text-blue-600"
                  }`}
                >
                  {deal.badge}
                </span>
                <span className="text-neutral-600 text-sm">{deal.dateLabel}</span>
              </div>

              {/* Note */}
              <p className="text-neutral-900 font-medium mb-3">{deal.note}</p>

              {/* District and price */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {deal.district}
                </span>
                {deal.priceRub && (
                  <span className="text-accent font-semibold">
                    {formatPrice(deal.priceRub, deal.badge === "Сдано")}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-neutral-500 text-sm mt-8"
        >
          * Примеры. Для MVP используются демонстрационные данные.
        </motion.p>
      </div>
    </section>
  );
}

