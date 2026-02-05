'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function ValuePropSection() {
  const t = useTranslations('home');

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
          {t('valuePropTagline')}
        </motion.p>
      </div>
    </section>
  );
}
