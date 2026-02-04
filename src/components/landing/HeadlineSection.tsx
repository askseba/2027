'use client';

import { motion } from 'framer-motion';

export function HeadlineSection() {
  return (
    <section className="py-[var(--section-spacing)] bg-cream dark:bg-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-center text-dark-brown dark:text-text-primary leading-tight font-logo"
        >
          تعرف على ذوقك العطري في 3 دقائق
        </motion.h1>
      </div>
    </section>
  );
}
