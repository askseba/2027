'use client';

import { motion, Variants } from 'framer-motion';

const benefits = [
  { icon: '🎯', text: 'اختيار العطر' },
  { icon: '🧪', text: 'تجنب الحساسية' },
  { icon: '💰', text: 'توفير المال' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export function BenefitsSection() {
  return (
    <section className="py-[var(--section-spacing)] bg-cream dark:bg-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-dark-brown dark:text-text-primary mb-10 font-logo"
        >
          نساعدك في
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(91,66,51,0.08)' }}
              className="flex flex-col items-center text-center p-8 bg-transparent dark:bg-white/5 rounded-2xl border border-gold/10 dark:border-amber-500/10 shadow-[0_2px_12px_rgba(91,66,51,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <p className="text-xl font-semibold text-dark-brown dark:text-text-primary">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
