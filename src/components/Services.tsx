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
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Подбор",
    description: "Подберём варианты под ваши требования",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Сделка",
    description: "Сопроводим до передачи ключей",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
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
          <h3 className="text-neutral-900 text-3xl md:text-4xl lg:text-5xl font-display font-bold">Как мы работаем</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative text-center p-8 lg:p-10 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 group"
            >
              {/* Connector line with arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-6 items-center z-10">
                  <div className="w-8 lg:w-12 h-px bg-gradient-to-r from-accent/40 to-accent/20" />
                  <svg className="w-4 h-4 text-accent/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Number with gradient background */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                    <span className="font-display text-4xl font-bold bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent">
                      {item.step}
                    </span>
                  </div>
                </div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
              </div>

              <h4 className="text-neutral-900 text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                {item.title}
              </h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

