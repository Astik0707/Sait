"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#listings", label: "Объекты" },
  { href: "#deals", label: "Сделки" },
  { href: "#services", label: "Услуги" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContacts = () => {
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-neutral-700 hover:text-neutral-900 transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button onClick={scrollToContacts} className="btn-primary text-sm">
              Связаться
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-neutral-700 hover:text-neutral-900 transition-colors duration-200 text-lg font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
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

