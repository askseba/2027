'use client';

import { motion, Variants } from 'framer-motion';

const stats = [
  { number: '+80,000', label: 'عطر عالمي' },
  { number: '%98', label: 'رضا العملاء' },
  { number: '3 دقائق', label: 'وقت الاختبار' },
  { number: '+10,000', label: 'مستخدم' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export function StatsSection() {
  return (
    <section className="py-[var(--section-spacing)] bg-cream dark:bg-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-6 bg-transparent dark:bg-white/5 rounded-xl border border-gold/10 dark:border-amber-500/10 shadow-[0_2px_12px_rgba(91,66,51,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-medium hover:scale-[1.02]"
            >
              <p className="text-3xl md:text-4xl font-bold text-gold dark:text-amber-500 font-logo">
                {stat.number}
              </p>
              <p className="mt-2 text-base md:text-lg font-medium text-dark-brown dark:text-text-primary text-center">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
