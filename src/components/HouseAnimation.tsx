"use client";

import { motion } from "framer-motion";

export default function HouseAnimation() {
  const features = [
    {
      icon: "⚡",
      title: "Скорость",
      text: "Закрываем сделки в кратчайшие сроки",
    },
    {
      icon: "🔍",
      title: "Прозрачность",
      text: "Полный отчёт на каждом этапе",
    },
    {
      icon: "🤝",
      title: "Переговоры",
      text: "Отстаиваем ваши интересы",
    },
  ];

  const steps = [
    { number: "01", title: "Консультация", desc: "Анализ ваших потребностей" },
    { number: "02", title: "Подбор", desc: "Поиск идеального варианта" },
    { number: "03", title: "Сделка", desc: "Оформление документов" },
    { number: "04", title: "Передача", desc: "Получение ключей" },
  ];

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white to-neutral-50"
    >
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container-width section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-16 md:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-accent text-sm font-medium mb-4 uppercase tracking-wider"
            >
              Наш подход
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="heading-display text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6"
            >
              Дом строится <br />
              <span className="text-accent">шаг за шагом</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-neutral-600 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Так же и каждая сделка — это выверенный процесс, где важна каждая деталь. 
              Мы сопровождаем вас от первого звонка до передачи ключей.
            </motion.p>
          </div>

          {/* Двухколоночный layout */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Левая колонка - Features */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Наши преимущества
              </h3>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-neutral-900 font-semibold mb-1 text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Правая колонка - Steps */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Этапы работы
              </h3>
              <div className="space-y-4 relative">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative flex items-center gap-4 p-5 bg-white border border-neutral-200 rounded-xl hover:border-accent/30 hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent text-white rounded-lg flex items-center justify-center font-bold text-lg relative z-10">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-neutral-900 font-semibold mb-1">
                        {step.title}
                      </h4>
                      <p className="text-neutral-600 text-sm">
                        {step.desc}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-full w-0.5 h-4 bg-accent/20" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

