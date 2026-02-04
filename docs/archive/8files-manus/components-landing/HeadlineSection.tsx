'use client';

import { motion } from 'framer-motion';

export function HeadlineSection() {
  return (
    <section className="py-12 md:py-16 bg-cream dark:bg-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-center text-dark-brown dark:text-text-primary leading-tight font-manrope"
        >
          تعرف على ذوقك العطري في 3 دقائق
        </motion.h1>
      </div>
    </section>
  );
}
