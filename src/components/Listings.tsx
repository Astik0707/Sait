"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  properties,
  Property,
  PropertyStatus,
  formatPrice,
  formatArea,
  getRoomsLabel,
} from "@/data/mock";
import PropertyModal from "./PropertyModal";

type FilterTab = "all" | PropertyStatus;

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "sale", label: "Продажа" },
  { value: "rent", label: "Аренда" },
];

export default function Listings() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties =
    activeTab === "all"
      ? properties
      : properties.filter((p) => p.status === activeTab);

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
            Подобранные варианты для покупки и аренды в Нальчике
          </motion.p>
        </div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-neutral-100 rounded-2xl p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative px-6 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  activeTab === tab.value
                    ? "text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Property grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, index) => (
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
  const isRent = property.status === "rent";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              isRent
                ? "bg-blue-500 text-white"
                : "bg-accent text-white"
            }`}
          >
            {isRent ? "Аренда" : "Продажа"}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="font-display text-2xl font-bold text-white drop-shadow-lg">
            {formatPrice(property.priceRub, isRent)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-neutral-900 font-semibold text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center gap-4 text-neutral-600 text-sm">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {formatArea(property.areaM2)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {getRoomsLabel(property.rooms)}
          </span>
          <span className="ml-auto text-neutral-500">
            {property.district}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

