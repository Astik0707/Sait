"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// Динамический импорт для избежания проблем с SSR
const House3D = dynamic(() => import("./House3D"), {
  ssr: false,
});

export default function FixedHouse3D() {
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
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 z-30 pointer-events-none hidden lg:block">
      <div className="relative w-full h-full">
        <House3D scrollProgress={progressValue} />
        {/* Прогресс-бар */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[200px]">
          <div className="text-neutral-600 text-xs font-medium mb-1 text-center">
            Строительство
          </div>
          <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progressValue * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

