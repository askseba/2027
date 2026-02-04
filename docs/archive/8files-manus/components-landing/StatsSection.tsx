'use client';

import { motion, Variants } from 'framer-motion';

const stats = [
  { number: '+80,000', label: 'عطور عالمية' },
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
    <section className="py-12 md:py-16 bg-cream dark:bg-surface">
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
              className="flex flex-col items-center justify-center p-6 bg-white/70 dark:bg-surface-elevated/70 rounded-xl shadow-lg backdrop-blur-sm border border-gold/10 dark:border-amber-500/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <p className="text-4xl md:text-5xl font-bold text-gold dark:text-amber-500 font-manrope">
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
