'use client';

import { motion } from 'framer-motion';

export function ValuePropSection() {
  return (
    <section className="py-[var(--section-spacing)] bg-cream dark:bg-surface">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl font-medium text-center text-medium-brown dark:text-text-secondary"
        >
          اختبار ذكي يحدد بصمتك العطرية ويرشح لك العطور المثالية
        </motion.p>
      </div>
    </section>
  );
}
