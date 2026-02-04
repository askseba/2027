'use client';

import { motion } from 'framer-motion';

export function StatusCircles() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="hidden sm:flex items-center gap-2 ml-4"
    >
      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" title="الخدمة متاحة"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500" title="تحديثات قادمة"></div>
      <div className="w-3 h-3 rounded-full bg-red-500" title="صيانة قريبة"></div>
    </motion.div>
  );
}
