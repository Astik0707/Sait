"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setFormData({ name: "", phone: "", comment: "" });
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <section id="contacts" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <div className="relative z-10 container-width section-padding">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-medium mb-4 uppercase tracking-wider"
          >
            Связаться
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4"
          >
            Начните с бесплатной консультации
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-600 text-lg max-w-xl mx-auto"
          >
            Оставьте заявку или свяжитесь с нами напрямую
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Address */}
            <div className="mb-10">
              <h3 className="text-neutral-900 text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Адрес
              </h3>
              <p className="text-neutral-600 text-lg">
                г. Нальчик, ул. Тамазова, 3
              </p>
            </div>

            {/* Phone buttons */}
            <div className="space-y-4 mb-10">
              <a
                href="tel:+79187257729"
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-neutral-900 font-medium">+7 918 725-77-29</div>
                  <div className="text-neutral-600 text-sm">Позвонить</div>
                </div>
              </a>

              <a
                href="tel:+79396902400"
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-neutral-900 font-medium">+7 939 690-24-00</div>
                  <div className="text-neutral-600 text-sm">Позвонить</div>
                </div>
              </a>
            </div>

            {/* Telegram buttons */}
            <div className="space-y-4">
              <a
                href="https://t.me/Pach_Group"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-blue-500 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-neutral-900 font-medium">@Pach_Group</div>
                  <div className="text-neutral-600 text-sm">Открыть канал</div>
                </div>
              </a>

              <a
                href="https://t.me/Pach_Group"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Написать в Telegram
              </a>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200">
              <h3 className="text-neutral-900 text-xl font-semibold mb-6">
                Оставить заявку
              </h3>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-neutral-700 text-sm mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Как вас зовут?"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-neutral-700 text-sm mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-neutral-700 text-sm mb-2">
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Расскажите, что вы ищете..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Отправить заявку
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]"
          >
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xl flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-neutral-900 font-medium mb-1">Спасибо за заявку!</p>
                <p className="text-neutral-600 text-sm">
                  MVP: форма в разработке. Свяжитесь с нами по телефону или Telegram.
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

