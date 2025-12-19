"use client";

import { motion } from "framer-motion";

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#listings", label: "Объекты" },
  { href: "#deals", label: "Сделки" },
  { href: "#services", label: "Услуги" },
  { href: "#contacts", label: "Контакты" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container-width section-padding py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="#" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold text-neutral-900 tracking-tight">
                Pach Group
              </span>
            </a>
            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              Ваш надёжный партнёр по недвижимости в Нальчике. Продажа и аренда с полным сопровождением.
            </p>
            {/* Social */}
            <a
              href="https://t.me/Pach_Group"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              @Pach_Group
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-neutral-900 font-semibold mb-4">Навигация</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-neutral-900 font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-sm">
              <p className="text-neutral-600">
                г. Нальчик, ул. Тамазова, 3
              </p>
              <a
                href="tel:+79187257729"
                className="block text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                +7 918 725-77-29
              </a>
              <a
                href="tel:+79396902400"
                className="block text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                +7 939 690-24-00
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Pach Group. Все права защищены.
          </p>
          <p className="text-neutral-500 text-xs">
            Демонстрационный сайт (MVP)
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

