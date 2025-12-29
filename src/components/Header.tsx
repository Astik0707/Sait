"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#listings", label: "Объекты" },
  { href: "#deals", label: "Сделки" },
  { href: "#services", label: "Услуги" },
  { href: "#contacts", label: "Контакты" },
] as const;

// Утилита для throttle
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Мемоизируем section IDs
  const sectionIds = useMemo(
    () => navLinks.map((link) => link.href.slice(1)),
    []
  );

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Устанавливаем активную секцию из хэша URL при загрузке
    const hash = window.location.hash.slice(1);
    if (hash && sectionIds.includes(hash)) {
      setActiveSection(hash);
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    // Отслеживаем видимость всех секций для выбора наиболее видимой
    const visibleSections = new Map<string, number>();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (id && sectionIds.includes(id)) {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        }
      });

      // Выбираем секцию с наибольшей видимостью
      if (visibleSections.size > 0) {
        const mostVisible = Array.from(visibleSections.entries()).reduce(
          (max, [id, ratio]) => (ratio > max[1] ? [id, ratio] : max),
          ["", 0]
        );
        if (mostVisible[0]) {
          setActiveSection(mostVisible[0]);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Наблюдаем за всеми секциями из навигации
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Обработка изменения хэша при клике на ссылки
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash && sectionIds.includes(newHash)) {
        setActiveSection(newHash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [sectionIds]);

  const scrollToContacts = useCallback(() => {
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-width section-padding">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <span className="font-display text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              Pach Group
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.slice(1); // Оптимизация: slice быстрее чем replace
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-neutral-700 hover:text-neutral-900 transition-colors duration-200 text-sm font-medium ${
                    isActive ? "text-neutral-900" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={scrollToContacts} className="btn-primary text-sm">
              Связаться
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-neutral-900"
            aria-label="Открыть меню"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-t border-neutral-200 shadow-lg"
          >
            <nav className="section-padding py-6 space-y-4">
              {navLinks.map((link) => {
                const sectionId = link.href.slice(1); // Оптимизация: slice быстрее чем replace
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block text-neutral-700 hover:text-neutral-900 transition-colors duration-200 text-lg font-medium py-2 relative ${
                      isActive ? "text-neutral-900" : ""
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorMobile"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
              <button
                onClick={scrollToContacts}
                className="btn-primary w-full mt-4"
              >
                Связаться
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

