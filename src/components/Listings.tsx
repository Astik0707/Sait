"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Property,
  formatPrice,
  formatArea,
  getRoomsLabel,
} from "@/data/mock";
import { getProperties } from "@/lib/properties";
import PropertyModal from "./PropertyModal";

export default function Listings() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      const data = await getProperties();
      setProperties(data);
      setIsLoading(false);
    }
    loadProperties();
  }, []);

  return (
    <section id="listings" className="py-24 md:py-32 bg-white">
      <div className="container-width section-padding">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-medium mb-4 uppercase tracking-wider"
          >
            Каталог
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4"
          >
            Актуальные объекты
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-600 text-lg max-w-xl mx-auto"
          >
            Подобранные варианты для покупки недвижимости в Нальчике
          </motion.p>
        </div>

        {/* Property grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Объекты не найдены</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PropertyCard
                    property={property}
                    onClick={() => setSelectedProperty(property)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  );
}

function PropertyCard({
  property,
  onClick,
}: {
  property: Property;
  onClick: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.6 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        />
        
        {/* Animated Status badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 left-4"
        >
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-accent text-white shadow-lg">
            Продажа
          </span>
        </motion.div>

        {/* Animated Price overlay */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="font-display text-2xl font-bold text-white drop-shadow-2xl"
          >
            {formatPrice(property.priceRub, false)}
          </motion.span>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="p-5"
      >
        <motion.h3
          whileHover={{ x: 4 }}
          className="text-neutral-900 font-semibold text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors"
        >
          {property.title}
        </motion.h3>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center gap-4 text-neutral-600 text-sm">
          <motion.span
            whileHover={{ scale: 1.1, color: "#722F37" }}
            className="flex items-center gap-1.5 transition-colors"
          >
            <motion.svg
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </motion.svg>
            {formatArea(property.areaM2)}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.1, color: "#722F37" }}
            className="flex items-center gap-1.5 transition-colors"
          >
            <motion.svg
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </motion.svg>
            {getRoomsLabel(property.rooms)}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="ml-auto text-neutral-500 font-medium"
          >
            {property.district}
          </motion.span>
        </div>
      </motion.div>
    </motion.article>
  );
}

