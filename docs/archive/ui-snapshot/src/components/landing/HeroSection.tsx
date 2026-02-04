// ✅ HeroSection - Fixed Version
// components/landing/HeroSection.tsx

'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  
  // ✅ React-native way للتعامل مع mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // تحويل موقع الماوس لزوايا دوران
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream via-cream to-cream/95 dark:from-surface dark:via-surface-elevated dark:to-background">
      
      {/* ✅ Ambient light - CSS only */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-radial from-gold/15 via-gold/5 to-transparent dark:from-amber-500/10 dark:via-amber-500/5 dark:to-transparent blur-3xl" />
      </div>

      {/* ✅ Floating particles - opacity transition to avoid CLS */}
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        {mounted &&
          [...Array(15)].map((_, i) => {
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            const endX = Math.random() * window.innerWidth;
            const endY = Math.random() * window.innerHeight;

            return (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-gold/30 dark:bg-amber-500/20"
                initial={{ x: startX, y: startY }}
                animate={{ x: endX, y: endY }}
                transition={{
                  duration: 10 + Math.random() * 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            );
          })}
      </div>

      <div className="container relative z-10 mx-auto px-6">
        
        {/* ✅ H1 sr-only for SEO; logo Image keeps alt backup */}
        <h1 className="sr-only">Ask Seba</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pt-6 text-center bg-transparent"
        >
          <div className="isolate overflow-hidden rounded-2xl bg-cream p-2 md:p-4 inline-block mx-auto mb-8 md:mb-10 shadow-soft drop-shadow-lg dark:bg-surface/80">
            <Image
              src="/ask_logo.png"
              alt="Ask Seba"
              width={280}
              height={72}
              priority
              className="mx-auto h-20 md:h-24 lg:h-28 w-auto object-contain bg-transparent"
              style={{ background: "transparent" }}
            />
          </div>
        </motion.div>

        {/* ✅ Perfume - Interactive 3D effect, reserved height for CLS */}
        <motion.div
          className="relative mt-6 flex min-h-[400px] aspect-[280/400] justify-center"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              type: 'spring',
              stiffness: 100
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
          >
            <Image
              src="/perfume_transparent.webp"
              alt="Perfume Bottle"
              width={280}
              height={400}
              priority={true}
              sizes="(max-width: 768px) 280px, 400px"
              className="drop-shadow-[0_20px_40px_rgba(91,66,51,0.3)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:drop-shadow-[0_30px_60px_rgba(179,157,125,0.4)] dark:hover:drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            />
            
            {/* ✅ Glow effect on hover */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-radial from-gold/20 dark:from-amber-500/15 to-transparent opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
