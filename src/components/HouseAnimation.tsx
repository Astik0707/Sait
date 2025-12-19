"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HouseAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to drawing progress
  const pathProgress = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const windowsOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const roofProgress = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const doorOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const smokeOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

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

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-50" />

      <div className="relative z-10 container-width section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
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
              className="text-neutral-600 text-lg mb-10 leading-relaxed"
            >
              Так же и каждая сделка — это выверенный процесс, где важна каждая деталь. 
              Мы сопровождаем вас от первого звонка до передачи ключей.
            </motion.p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-neutral-900 font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">{feature.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SVG House Animation */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Foundation line */}
                <motion.line
                  x1="50"
                  y1="320"
                  x2="350"
                  y2="320"
                  stroke="#722F37"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    pathLength: pathProgress,
                  }}
                />

                {/* House walls - left */}
                <motion.line
                  x1="80"
                  y1="320"
                  x2="80"
                  y2="180"
                  stroke="#404040"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    pathLength: pathProgress,
                  }}
                />

                {/* House walls - right */}
                <motion.line
                  x1="320"
                  y1="320"
                  x2="320"
                  y2="180"
                  stroke="#404040"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    pathLength: pathProgress,
                  }}
                />

                {/* House walls - top */}
                <motion.line
                  x1="80"
                  y1="180"
                  x2="320"
                  y2="180"
                  stroke="#404040"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    pathLength: pathProgress,
                  }}
                />

                {/* Roof - left side */}
                <motion.line
                  x1="60"
                  y1="180"
                  x2="200"
                  y2="80"
                  stroke="#722F37"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    pathLength: roofProgress,
                  }}
                />

                {/* Roof - right side */}
                <motion.line
                  x1="200"
                  y1="80"
                  x2="340"
                  y2="180"
                  stroke="#722F37"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    pathLength: roofProgress,
                  }}
                />

                {/* Left window */}
                <motion.rect
                  x="110"
                  y="210"
                  width="50"
                  height="50"
                  stroke="#404040"
                  strokeWidth="2"
                  fill="none"
                  style={{ opacity: windowsOpacity }}
                />
                <motion.line
                  x1="135"
                  y1="210"
                  x2="135"
                  y2="260"
                  stroke="#404040"
                  strokeWidth="1"
                  style={{ opacity: windowsOpacity }}
                />
                <motion.line
                  x1="110"
                  y1="235"
                  x2="160"
                  y2="235"
                  stroke="#404040"
                  strokeWidth="1"
                  style={{ opacity: windowsOpacity }}
                />

                {/* Right window */}
                <motion.rect
                  x="240"
                  y="210"
                  width="50"
                  height="50"
                  stroke="#404040"
                  strokeWidth="2"
                  fill="none"
                  style={{ opacity: windowsOpacity }}
                />
                <motion.line
                  x1="265"
                  y1="210"
                  x2="265"
                  y2="260"
                  stroke="#404040"
                  strokeWidth="1"
                  style={{ opacity: windowsOpacity }}
                />
                <motion.line
                  x1="240"
                  y1="235"
                  x2="290"
                  y2="235"
                  stroke="#404040"
                  strokeWidth="1"
                  style={{ opacity: windowsOpacity }}
                />

                {/* Door */}
                <motion.rect
                  x="175"
                  y="250"
                  width="50"
                  height="70"
                  stroke="#722F37"
                  strokeWidth="2"
                  fill="none"
                  style={{ opacity: doorOpacity }}
                />
                <motion.circle
                  cx="215"
                  cy="290"
                  r="4"
                  fill="#722F37"
                  style={{ opacity: doorOpacity }}
                />

                {/* Chimney */}
                <motion.rect
                  x="260"
                  y="100"
                  width="25"
                  height="50"
                  stroke="#404040"
                  strokeWidth="2"
                  fill="none"
                  style={{ opacity: windowsOpacity }}
                />

                {/* Smoke */}
                <motion.path
                  d="M272 100 Q275 80, 270 65 Q265 50, 275 35"
                  stroke="#737373"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  style={{ opacity: smokeOpacity }}
                />
                <motion.path
                  d="M278 100 Q283 85, 278 70 Q273 55, 283 40"
                  stroke="#737373"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  style={{ opacity: smokeOpacity }}
                />
              </svg>

              {/* Decorative elements */}
              <motion.div
                style={{ opacity: smokeOpacity }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center"
              >
                <span className="text-neutral-600 text-sm font-medium">
                  Ваш дом начинается здесь
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

