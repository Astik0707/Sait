"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background gradient - light theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-50" />
      
      {/* Subtle radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      
      {/* Grid lines decoration - light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200/40 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200/40 to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200/40 to-transparent" />
      </div>

      <div className="relative z-10 container-width section-padding py-32 md:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Small tag */}
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm font-medium mb-8">
              Недвижимость в Нальчике
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-neutral-900 mb-6 leading-[1.1]"
          >
            Ваша сделка —{" "}
            <span className="text-accent">наш приоритет</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Полное сопровождение сделок с недвижимостью в Нальчике.
            <br className="hidden md:block" />
            От первого звонка до передачи ключей.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollTo("listings")}
              className="btn-primary text-base px-8 py-4"
            >
              Смотреть объекты
            </button>
            <button
              onClick={() => scrollTo("contacts")}
              className="btn-secondary text-base px-8 py-4"
            >
              Подобрать объект
            </button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-16 border-t border-neutral-200"
          >
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-1">
                  50+
                </div>
                <div className="text-neutral-600 text-sm">Сделок в год</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-1">
                  5+
                </div>
                <div className="text-neutral-600 text-sm">Лет опыта</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-1">
                  100%
                </div>
                <div className="text-neutral-600 text-sm">Сопровождение</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-neutral-300 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-neutral-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

