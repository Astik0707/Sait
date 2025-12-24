"use client";

import { motion } from "framer-motion";

const saleServices = [
  "Бесплатная оценка недвижимости",
  "Профессиональная фотосъёмка",
  "Размещение на всех площадках",
  "Организация показов",
  "Ведение переговоров",
  "Полное юридическое сопровождение",
];


const steps = [
  {
    step: "01",
    title: "Заявка",
    description: "Оставьте заявку или позвоните нам",
  },
  {
    step: "02",
    title: "Подбор",
    description: "Подберём варианты под ваши требования",
  },
  {
    step: "03",
    title: "Сделка",
    description: "Сопроводим до передачи ключей",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white">
      <div className="container-width section-padding">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-medium mb-4 uppercase tracking-wider"
          >
            Что мы делаем
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4"
          >
            Наши услуги
          </motion.h2>
        </div>

        {/* Services */}
        <div className="max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-50 rounded-3xl p-8 lg:p-10 border border-neutral-200"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-neutral-900 text-2xl font-display font-bold">Наши услуги</h3>
            </div>
            <ul className="space-y-4">
              {saleServices.map((service, index) => (
                <motion.li
                  key={service}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-neutral-700"
                >
                  <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* How we work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-neutral-900 text-2xl font-display font-bold">Как мы работаем</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-neutral-300" />
              )}
              
              <div className="font-display text-5xl font-bold text-accent/20 mb-4">
                {item.step}
              </div>
              <h4 className="text-neutral-900 text-xl font-semibold mb-2">
                {item.title}
              </h4>
              <p className="text-neutral-600 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

