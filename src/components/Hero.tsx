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
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-50" />
      
      {/* Static radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/8 via-transparent to-transparent" />
      
      {/* Static grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200/40 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200/40 to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200/40 to-transparent" />
      </div>

      {/* Static decorative shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />

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
            Ваша гарантия —{" "}
            <span className="text-accent">наш опыт</span>
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
            <motion.button
              onClick={() => scrollTo("listings")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-base px-8 py-4 relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Смотреть объекты</span>
            </motion.button>
            <motion.button
              onClick={() => scrollTo("contacts")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-base px-8 py-4 relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-accent/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Подобрать объект</span>
            </motion.button>
          </motion.div>

          {/* Animated Stats strip */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-16 border-t border-neutral-200"
          >
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-default"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="font-display text-3xl md:text-4xl font-bold text-accent mb-1"
                >
                  50+
                </motion.div>
                <div className="text-neutral-600 text-sm">Сделок в год</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-default"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="font-display text-3xl md:text-4xl font-bold text-accent mb-1"
                >
                  5+
                </motion.div>
                <div className="text-neutral-600 text-sm">Лет опыта</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-default"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="font-display text-3xl md:text-4xl font-bold text-accent mb-1"
                >
                  100%
                </motion.div>
                <div className="text-neutral-600 text-sm">Сопровождение</div>
              </motion.div>
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
        <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-neutral-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

