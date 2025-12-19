"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Property, formatPrice, formatArea, getRoomsLabel } from "@/data/mock";

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create a mock carousel with the same image repeated
  const images = property ? [property.imageUrl, property.imageUrl, property.imageUrl] : [];

  useEffect(() => {
    if (property) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [property]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!property) return null;

  const isRent = property.status === "rent";

  return (
    <AnimatePresence>
      {property && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-2 h-full">
                {/* Image carousel */}
                <div className="relative h-64 sm:h-80 lg:h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[currentImageIndex]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel navigation */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                        isRent
                          ? "bg-blue-500/90 text-white"
                          : "bg-accent/90 text-white"
                      }`}
                    >
                      {isRent ? "Аренда" : "Продажа"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-10 flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="heading-display text-2xl md:text-3xl text-neutral-900 mb-3">
                      {property.title}
                    </h2>
                    <p className="text-neutral-600 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.district}, {property.addressHint}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-neutral-200">
                    <span className="font-display text-3xl md:text-4xl font-bold text-accent">
                      {formatPrice(property.priceRub, isRent)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-neutral-200">
                    <div className="text-center p-4 bg-neutral-50 rounded-xl">
                      <div className="text-neutral-900 font-semibold text-lg">
                        {formatArea(property.areaM2)}
                      </div>
                      <div className="text-neutral-600 text-sm">Площадь</div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-xl">
                      <div className="text-neutral-900 font-semibold text-lg">
                        {property.rooms}
                      </div>
                      <div className="text-neutral-600 text-sm">
                        {getRoomsLabel(property.rooms).split(" ")[1] || "комн."}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-xl">
                      <div className="text-neutral-900 font-semibold text-lg">
                        {property.district}
                      </div>
                      <div className="text-neutral-600 text-sm">Район</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-neutral-900 font-semibold mb-3">Описание</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-neutral-900 font-semibold mb-3">Особенности</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm rounded-lg"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-auto space-y-3">
                    <a
                      href="tel:+79187257729"
                      className="btn-primary w-full text-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Позвонить
                    </a>
                    <a
                      href="https://t.me/Pach_Group"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full text-center"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

