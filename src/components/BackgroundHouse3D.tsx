"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// Динамический импорт для избежания проблем с SSR
const House3D = dynamic(() => import("./House3D"), {
  ssr: false,
});

export default function BackgroundHouse3D() {
  const { scrollYProgress } = useScroll();
  
  // Преобразуем общий прогресс скролла страницы для 3D анимации
  // Анимация происходит при скролле от начала до 80% страницы
  const houseBuildProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const [progressValue, setProgressValue] = useState(0);

  // Обновляем значение прогресса для передачи в 3D компонент
  useMotionValueEvent(houseBuildProgress, "change", (latest) => {
    setProgressValue(latest);
  });

  return (
    <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-50 md:opacity-60">
        <House3D scrollProgress={progressValue} />
      </div>
      {/* Более лёгкий градиент для лучшей читаемости контента */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20 pointer-events-none" />
    </div>
  );
}

